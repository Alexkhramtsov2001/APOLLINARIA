import { CONFIG } from '../core/config.js';
import type { Cleanup } from '../core/types.js';

export function initReveal(): Cleanup {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer: IntersectionObserver | null = null;

  const observeItems = (root: Document | Element = document): void => {
    const items = [...root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)')];
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
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: CONFIG.animation.revealThreshold, rootMargin: '0px 0px -8% 0px' });

  const onContentRendered = (event: Event): void => {
    const detail = (event as CustomEvent<{ type?: string }>).detail;
    const selector = detail?.type === 'skills' ? '[data-skills]' : detail?.type === 'projects' ? '[data-projects]' : null;
    const root = selector ? document.querySelector(selector) : document;
    if (root) observeItems(root);
  };
  const onMotionChange = (): void => {
    if (!reduced.matches) return;
    observer?.disconnect();
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
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
