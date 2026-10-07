import type { ScrollState } from './types.js';

let cleanup: () => void = () => {};
let frame = 0;
let lastY = 0;
let lastWidth = 0;
let lastHeight = 0;
const subscribers = new Set<(state: ScrollState) => void>();

function measure(): void {
  lastY = window.scrollY;
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;
}

function snapshot(): ScrollState {
  return Object.freeze({ y: lastY, width: lastWidth, height: lastHeight });
}

function flush(): void {
  frame = 0;
  measure();
  const state = snapshot();
  subscribers.forEach((subscriber) => subscriber(state));
}

function requestFlush(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(flush);
}

export function initScrollManager(): () => void {
  cleanup();
  measure();
  window.addEventListener('scroll', requestFlush, { passive: true });
  window.addEventListener('resize', requestFlush, { passive: true });
  cleanup = () => {
    window.removeEventListener('scroll', requestFlush);
    window.removeEventListener('resize', requestFlush);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    subscribers.clear();
  };
  return cleanup;
}

export function subscribeScroll(handler: (state: ScrollState) => void): () => void {
  subscribers.add(handler);
  handler(snapshot());
  return () => subscribers.delete(handler);
}

export function getScrollState(): ScrollState {
  return snapshot();
}

export function destroyScrollManager(): void {
  cleanup();
  cleanup = () => {};
}
