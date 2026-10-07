import { subscribeScroll } from '../core/scroll-manager.js';
export function initScrollProgress() {
    const progress = document.querySelector('#scrollProgress');
    if (!progress)
        return () => { };
    const update = ({ y }) => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? y / scrollable : 0;
        progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };
    return subscribeScroll(update);
}
