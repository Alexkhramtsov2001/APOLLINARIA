import { CONFIG } from '../core/config.js';
const PALETTE_COLORS = {
    cyan: [0, 234, 255],
    violet: [169, 120, 255],
    lime: [182, 255, 61],
};
export function initCanvasBackground() {
    const canvas = document.querySelector('#bgCanvas');
    if (!canvas)
        return () => { };
    const context = canvas.getContext('2d', { alpha: true });
    if (!context)
        return () => { };
    const canvasElement = canvas;
    const contextElement = context;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let profile = getProfile();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let rafId = 0;
    let running = false;
    let lastFrame = 0;
    let resizeTimer = 0;
    let lastResizeWidth = window.innerWidth;
    let disposed = false;
    let visibilityPaused = document.hidden;
    let palette = getPalette(document.documentElement.dataset.palette);
    let gridOffset = { x: 0, y: 0 };
    let glowSprites = new Map();
    const mouse = { x: -1000, y: -1000, active: false };
    function getPalette(value) {
        return value === 'violet' || value === 'lime' ? value : 'cyan';
    }
    function color() {
        return PALETTE_COLORS[palette];
    }
    function getProfile() {
        if (reduced.matches)
            return null;
        const w = window.innerWidth;
        if (w <= CONFIG.performance.mobileBreakpoint) {
            return { count: CONFIG.canvas.mobileParticles, fps: CONFIG.canvas.mobileFps, dpr: CONFIG.canvas.mobileDpr, grid: false, links: false };
        }
        if (w <= CONFIG.performance.tabletBreakpoint) {
            return { count: CONFIG.canvas.tabletParticles, fps: CONFIG.canvas.tabletFps, dpr: CONFIG.canvas.tabletDpr, grid: true, links: false };
        }
        return { count: CONFIG.canvas.desktopParticles, fps: CONFIG.canvas.desktopFps, dpr: CONFIG.canvas.desktopDpr, grid: true, links: true };
    }
    function createGlowSprite(p) {
        const [r, g, b] = p.c;
        const glow = p.radius * 4.2;
        const size = Math.max(2, Math.ceil(glow * 2));
        const key = `${r},${g},${b}|${glow.toFixed(2)}|${p.alpha.toFixed(3)}`;
        const cached = glowSprites.get(key);
        if (cached)
            return cached;
        const sprite = document.createElement('canvas');
        sprite.width = size;
        sprite.height = size;
        const spriteContext = sprite.getContext('2d');
        if (!spriteContext)
            return sprite;
        const center = size / 2;
        const gradient = spriteContext.createRadialGradient(center, center, 0, center, center, glow);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${p.alpha * 0.5})`);
        gradient.addColorStop(0.45, `rgba(${r},${g},${b},${p.alpha * 0.13})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        spriteContext.fillStyle = gradient;
        spriteContext.fillRect(0, 0, size, size);
        glowSprites.set(key, sprite);
        return sprite;
    }
    function resize() {
        profile = getProfile();
        if (!profile) {
            stop();
            canvasElement.width = 1;
            canvasElement.height = 1;
            particles = [];
            glowSprites.clear();
            return;
        }
        width = Math.max(1, window.innerWidth);
        height = Math.max(1, window.innerHeight);
        dpr = Math.min(window.devicePixelRatio || 1, profile.dpr);
        canvasElement.width = Math.round(width * dpr);
        canvasElement.height = Math.round(height * dpr);
        canvasElement.style.width = `${width}px`;
        canvasElement.style.height = `${height}px`;
        contextElement.setTransform(dpr, 0, 0, dpr, 0, 0);
        glowSprites.clear();
        particles = Array.from({ length: profile.count }, () => createParticle());
        if (!visibilityPaused)
            start();
    }
    function createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = 12 + Math.random() * 23;
        const particle = {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 0.9 + Math.random() * 2.1,
            alpha: 0.3 + Math.random() * 0.45,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.5 + Math.random() * 1.5,
            c: color(),
        };
        return particle;
    }
    function drawGrid(dt) {
        if (!profile?.grid)
            return;
        const step = width > 1100 ? 64 : 58;
        const speed = 12;
        const angle = 25 * Math.PI / 180;
        gridOffset.x = (gridOffset.x + Math.cos(angle) * speed * dt) % step;
        gridOffset.y = (gridOffset.y + Math.sin(angle) * speed * dt) % step;
        if (gridOffset.x < 0)
            gridOffset.x += step;
        if (gridOffset.y < 0)
            gridOffset.y += step;
        const [r, g, b] = color();
        contextElement.save();
        contextElement.strokeStyle = `rgba(${r},${g},${b},.065)`;
        contextElement.lineWidth = 1;
        contextElement.beginPath();
        for (let x = -step + gridOffset.x; x <= width + step; x += step) {
            contextElement.moveTo(x, 0);
            contextElement.lineTo(x, height);
        }
        for (let y = -step + gridOffset.y; y <= height + step; y += step) {
            contextElement.moveTo(0, y);
            contextElement.lineTo(width, y);
        }
        contextElement.stroke();
        contextElement.fillStyle = `rgba(${r},${g},${b},.16)`;
        for (let x = -step + gridOffset.x; x <= width + step; x += step) {
            for (let y = -step + gridOffset.y; y <= height + step; y += step) {
                contextElement.beginPath();
                contextElement.arc(x, y, 1.15, 0, Math.PI * 2);
                contextElement.fill();
            }
        }
        contextElement.restore();
    }
    function drawParticles(now, dt) {
        const t = now * 0.001;
        for (const p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.phase += p.phaseSpeed * dt;
            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 180 * 180 && distSq > 1) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / 180) * 7;
                    p.vx += (dx / dist) * force * dt;
                    p.vy += (dy / dist) * force * dt;
                }
            }
            p.vx *= 0.998;
            p.vy *= 0.998;
            if (p.x < -20)
                p.x = width + 20;
            if (p.x > width + 20)
                p.x = -20;
            if (p.y < -20)
                p.y = height + 20;
            if (p.y > height + 20)
                p.y = -20;
            const pulse = 0.78 + Math.sin(p.phase + t * 0.15) * 0.22;
            const glow = p.radius * 4.2;
            const sprite = createGlowSprite(p);
            contextElement.globalAlpha = pulse;
            contextElement.drawImage(sprite, p.x - glow, p.y - glow);
            const [r, g, b] = p.c;
            contextElement.globalAlpha = Math.min(1, p.alpha * pulse);
            contextElement.fillStyle = `rgba(${r},${g},${b},1)`;
            contextElement.beginPath();
            contextElement.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            contextElement.fill();
        }
        contextElement.globalAlpha = 1;
    }
    function drawConnections() {
        if (!profile?.links)
            return;
        const max = 120;
        const maxSq = max * max;
        const cellSize = max;
        const buckets = new Map();
        const key = (x, y) => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
        particles.forEach((p, index) => {
            const k = key(p.x, p.y);
            const bucket = buckets.get(k);
            if (bucket)
                bucket.push(index);
            else
                buckets.set(k, [index]);
        });
        contextElement.save();
        contextElement.lineWidth = 0.55;
        for (let i = 0; i < particles.length; i += 1) {
            const a = particles[i];
            const cx = Math.floor(a.x / cellSize);
            const cy = Math.floor(a.y / cellSize);
            for (let ox = -1; ox <= 1; ox += 1) {
                for (let oy = -1; oy <= 1; oy += 1) {
                    const candidates = buckets.get(`${cx + ox},${cy + oy}`) || [];
                    for (const j of candidates) {
                        if (j <= i)
                            continue;
                        const b = particles[j];
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const ds = dx * dx + dy * dy;
                        if (ds > maxSq)
                            continue;
                        const d = Math.sqrt(ds);
                        const [r, g, bv] = a.c;
                        contextElement.globalAlpha = (1 - d / max) * 0.13;
                        contextElement.strokeStyle = `rgb(${r},${g},${bv})`;
                        contextElement.beginPath();
                        contextElement.moveTo(a.x, a.y);
                        contextElement.lineTo(b.x, b.y);
                        contextElement.stroke();
                    }
                }
            }
        }
        contextElement.restore();
    }
    function frame(now) {
        rafId = 0;
        if (!running || disposed || visibilityPaused || !profile)
            return;
        const interval = 1000 / profile.fps;
        if (now - lastFrame < interval) {
            rafId = requestAnimationFrame(frame);
            return;
        }
        const dt = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;
        contextElement.clearRect(0, 0, width, height);
        drawGrid(dt);
        drawConnections();
        drawParticles(now, dt);
        rafId = requestAnimationFrame(frame);
    }
    function start() {
        if (running || disposed || visibilityPaused || !profile)
            return;
        running = true;
        lastFrame = performance.now();
        rafId = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        if (rafId)
            cancelAnimationFrame(rafId);
        rafId = 0;
    }
    function onResize() {
        const nextWidth = window.innerWidth;
        if (nextWidth === lastResizeWidth)
            return;
        lastResizeWidth = nextWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 120);
    }
    function onVisibility() {
        visibilityPaused = document.hidden;
        if (visibilityPaused)
            stop();
        else
            start();
    }
    function onPalette(event) {
        const detail = event.detail;
        palette = getPalette(detail?.palette || document.documentElement.dataset.palette);
        glowSprites.clear();
        particles.forEach((p) => { p.c = color(); });
    }
    function onMouseMove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;
    }
    function onMouseLeave() { mouse.active = false; }
    function onReduced() { resize(); }
    resize();
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('portfolio:palettechange', onPalette);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });
    reduced.addEventListener?.('change', onReduced);
    return () => {
        disposed = true;
        stop();
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('portfolio:palettechange', onPalette);
        window.removeEventListener('mousemove', onMouseMove);
        document.documentElement.removeEventListener('mouseleave', onMouseLeave);
        reduced.removeEventListener?.('change', onReduced);
        glowSprites.clear();
        contextElement.clearRect(0, 0, width, height);
    };
}
