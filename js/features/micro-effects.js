import { CONFIG } from '../core/config.js';
export function initMicroEffects() {
    const cleanups = [initGlitch(), initCounters()];
    return () => cleanups.forEach((cleanup) => cleanup());
}
function initGlitch() {
    const items = [...document.querySelectorAll('[data-glitch]')];
    if (!items.length)
        return () => { };
    const timers = [];
    const prepare = () => items.forEach((item) => {
        const source = item.querySelector('span') || item;
        item.dataset.text = source.textContent?.trim() || '';
    });
    prepare();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return () => { };
    const trigger = (item) => {
        item.classList.add('glitching');
        window.setTimeout(() => item.classList.remove('glitching'), 220);
    };
    items.forEach((item, index) => {
        const loop = () => {
            trigger(item);
            const range = CONFIG.animation.glitchMaxDelay - CONFIG.animation.glitchMinDelay;
            const delay = CONFIG.animation.glitchMinDelay + ((index * 911) % range);
            timers[index] = window.setTimeout(loop, delay);
        };
        timers[index] = window.setTimeout(loop, 1600 + index * 900);
    });
    const onLang = () => prepare();
    window.addEventListener('portfolio:langchange', onLang);
    return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        window.removeEventListener('portfolio:langchange', onLang);
        items.forEach((item) => item.classList.remove('glitching'));
    };
}
function initCounters() {
    const items = [...document.querySelectorAll('.stats strong')];
    if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return () => { };
    items.forEach((item) => {
        const match = item.textContent?.trim().match(/^(\d+)(.*)$/);
        if (!match)
            return;
        item.dataset.counterValue = match[1];
        item.dataset.counterSuffix = match[2];
        item.textContent = `0${match[2]}`;
    });
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            animateCounter(entry.target);
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.8 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
}
function animateCounter(item) {
    const target = Number(item.dataset.counterValue);
    const suffix = item.dataset.counterSuffix || '';
    const duration = 700;
    const start = performance.now();
    const frame = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        item.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1)
            requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}
