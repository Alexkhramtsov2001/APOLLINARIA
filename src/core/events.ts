const listeners = new Map<string, Set<EventListener>>();

export const EVENTS = Object.freeze({
  READY: 'portfolio:ready',
  LANGUAGE: 'portfolio:langchange',
  CONTENT_RENDERED: 'portfolio:content-rendered',
  MODULES_READY: 'portfolio:modules-ready',
  SCROLL: 'portfolio:scroll',
} as const);

export type PortfolioEventName = (typeof EVENTS)[keyof typeof EVENTS];

export function emit(name: PortfolioEventName | string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on(
  name: PortfolioEventName | string,
  handler: EventListener,
  options?: AddEventListenerOptions | boolean,
): () => void {
  window.addEventListener(name, handler, options);
  if (!listeners.has(name)) listeners.set(name, new Set());
  listeners.get(name)!.add(handler);
  return () => off(name, handler, options);
}

export function off(
  name: PortfolioEventName | string,
  handler: EventListener,
  options?: EventListenerOptions | boolean,
): void {
  window.removeEventListener(name, handler, options);
  listeners.get(name)?.delete(handler);
}

export function clearEvents(): void {
  for (const [name, handlers] of listeners) {
    for (const handler of handlers) window.removeEventListener(name, handler);
  }
  listeners.clear();
}
