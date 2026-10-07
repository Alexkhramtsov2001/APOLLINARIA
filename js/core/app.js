import { CONFIG } from './config.js';
import { EVENTS, emit } from './events.js';
import { destroyScrollManager, initScrollManager } from './scroll-manager.js';
const modules = new Map();
let started = false;
let controller = null;
export function registerModule(name, module) {
    modules.get(name)?.destroy?.();
    modules.set(name, module);
}
export function getModule(name) {
    return modules.get(name);
}
export function getAppSignal() {
    return controller?.signal;
}
export async function initApp() {
    if (started)
        return;
    started = true;
    controller = new AbortController();
    document.documentElement.classList.add('js');
    initScrollManager();
    if (CONFIG.debug)
        console.info('[portfolio] app initialized');
    emit(EVENTS.READY);
}
export function destroyApp() {
    for (const module of modules.values())
        module.destroy?.();
    modules.clear();
    destroyScrollManager();
    controller?.abort();
    controller = null;
    started = false;
}
