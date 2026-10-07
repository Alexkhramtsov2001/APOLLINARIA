const listeners = new Map();
export const EVENTS = Object.freeze({
    READY: 'portfolio:ready',
    LANGUAGE: 'portfolio:langchange',
    CONTENT_RENDERED: 'portfolio:content-rendered',
    MODULES_READY: 'portfolio:modules-ready',
    SCROLL: 'portfolio:scroll',
});
export function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
}
export function on(name, handler, options) {
    window.addEventListener(name, handler, options);
    if (!listeners.has(name))
        listeners.set(name, new Set());
    listeners.get(name).add(handler);
    return () => off(name, handler, options);
}
export function off(name, handler, options) {
    window.removeEventListener(name, handler, options);
    listeners.get(name)?.delete(handler);
}
export function clearEvents() {
    for (const [name, handlers] of listeners) {
        for (const handler of handlers)
            window.removeEventListener(name, handler);
    }
    listeners.clear();
}
