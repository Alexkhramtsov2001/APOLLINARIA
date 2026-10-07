import { CONFIG } from '../core/config.js';
export function initReveal() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer = null;
    const observeItems = (root = document) => {
        const items = [...root.querySelectorAll('[data-reveal]:not(.is-visible)')];
        if (reduced.matches || !('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('is-visible'));
            return;
        }
        items.forEach((item, index) => {
            item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
            observer?.observe(item);
        });
    };
    observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: CONFIG.animation.revealThreshold, rootMargin: '0px 0px -8% 0px' });
    const onContentRendered = (event) => {
        const detail = event.detail;
        const selector = detail?.type === 'skills' ? '[data-skills]' : detail?.type === 'projects' ? '[data-projects]' : null;
        const root = selector ? document.querySelector(selector) : document;
        if (root)
            observeItems(root);
    };
    const onMotionChange = () => {
        if (!reduced.matches)
            return;
        observer?.disconnect();
        document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
    };
    observeItems();
    window.addEventListener('portfolio:content-rendered', onContentRendered);
    reduced.addEventListener?.('change', onMotionChange);
    return () => {
        observer?.disconnect();
        window.removeEventListener('portfolio:content-rendered', onContentRendered);
        reduced.removeEventListener?.('change', onMotionChange);
    };
}
