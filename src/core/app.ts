import { CONFIG } from './config.js';
import { EVENTS, emit } from './events.js';
import { destroyScrollManager, initScrollManager } from './scroll-manager.js';
import type { PortfolioModule } from './types.js';

const modules = new Map<string, PortfolioModule>();
let started = false;
let controller: AbortController | null = null;

export function registerModule(name: string, module: PortfolioModule): void {
  modules.get(name)?.destroy?.();
  modules.set(name, module);
}

export function getModule(name: string): PortfolioModule | undefined {
  return modules.get(name);
}

export function getAppSignal(): AbortSignal | undefined {
  return controller?.signal;
}

export async function initApp(): Promise<void> {
  if (started) return;
  started = true;
  controller = new AbortController();
  document.documentElement.classList.add('js');
  initScrollManager();
  if (CONFIG.debug) console.info('[portfolio] app initialized');
  emit(EVENTS.READY);
}

export function destroyApp(): void {
  for (const module of modules.values()) module.destroy?.();
  modules.clear();
  destroyScrollManager();
  controller?.abort();
  controller = null;
  started = false;
}
