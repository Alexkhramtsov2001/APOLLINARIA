export function initMarquee() {
    const marquee = document.querySelector('.marquee');
    const track = marquee?.querySelector('.marquee__track');
    const source = track?.querySelector('.marquee__group');
    if (!marquee || !track || !source)
        return () => { };
    let resizeObserver = null;
    let resizeTimer = 0;
    let disposed = false;
    let lastWidth = 0;
    const build = () => {
        if (disposed)
            return;
        const viewportWidth = marquee.getBoundingClientRect().width;
        if (!viewportWidth)
            return;
        const widthChanged = Math.abs(viewportWidth - lastWidth) > 1;
        if (!widthChanged && track.children.length > 1)
            return;
        lastWidth = viewportWidth;
        const template = source.cloneNode(true);
        template.style.width = 'max-content';
        template.style.flex = '0 0 auto';
        track.replaceChildren(template);
        const first = track.firstElementChild;
        if (!first)
            return;
        const groupWidth = first.getBoundingClientRect().width;
        if (!groupWidth)
            return;
        const requiredWidth = Math.max(viewportWidth * 3, groupWidth * 3);
        while (track.scrollWidth < requiredWidth)
            track.appendChild(first.cloneNode(true));
        track.style.setProperty('--marquee-shift', `${groupWidth}px`);
        track.style.setProperty('--marquee-shift-negative', `-${groupWidth}px`);
        track.style.setProperty('--marquee-duration', `${Math.max(18, groupWidth / 38)}s`);
    };
    const scheduleBuild = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(build, 120);
    };
    const onVisibility = () => { track.style.animationPlayState = document.hidden ? 'paused' : 'running'; };
    build();
    document.addEventListener('visibilitychange', onVisibility);
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect?.width ?? 0;
            if (Math.abs(width - lastWidth) > 1)
                scheduleBuild();
        });
        resizeObserver.observe(marquee);
    }
    return () => {
        disposed = true;
        window.clearTimeout(resizeTimer);
        document.removeEventListener('visibilitychange', onVisibility);
        resizeObserver?.disconnect();
    };
}
