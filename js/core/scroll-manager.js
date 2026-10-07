let cleanup = () => { };
let frame = 0;
let lastY = 0;
let lastWidth = 0;
let lastHeight = 0;
const subscribers = new Set();
function measure() {
    lastY = window.scrollY;
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
}
function snapshot() {
    return Object.freeze({ y: lastY, width: lastWidth, height: lastHeight });
}
function flush() {
    frame = 0;
    measure();
    const state = snapshot();
    subscribers.forEach((subscriber) => subscriber(state));
}
function requestFlush() {
    if (frame)
        return;
    frame = window.requestAnimationFrame(flush);
}
export function initScrollManager() {
    cleanup();
    measure();
    window.addEventListener('scroll', requestFlush, { passive: true });
    window.addEventListener('resize', requestFlush, { passive: true });
    cleanup = () => {
        window.removeEventListener('scroll', requestFlush);
        window.removeEventListener('resize', requestFlush);
        if (frame)
            cancelAnimationFrame(frame);
        frame = 0;
        subscribers.clear();
    };
    return cleanup;
}
export function subscribeScroll(handler) {
    subscribers.add(handler);
    handler(snapshot());
    return () => subscribers.delete(handler);
}
export function getScrollState() {
    return snapshot();
}
export function destroyScrollManager() {
    cleanup();
    cleanup = () => { };
}
