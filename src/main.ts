import { destroyApp, initApp, registerModule } from './core/app.js';
import { clearEvents, EVENTS, on } from './core/events.js';
import { renderSkills } from './data/skills.js';
import { renderProjects } from './data/projects.js';
import { initNavigation } from './components/navigation.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initToast } from './components/toast.js';
import { initPalette } from './features/palette.js';
import { initClipboard } from './features/clipboard.js';
import { initScrollProgress } from './features/scroll-progress.js';
import { initMarquee } from './features/marquee.js';
import { initReveal } from './features/reveal.js';
import { initMicroEffects } from './features/micro-effects.js';
import { initCanvasBackground } from './features/canvas-bg.js';
import { initCursor } from './features/cursor.js';
import * as i18n from './features/i18n.js';
import type { Cleanup } from './core/types.js';

const cleanups: Cleanup[] = [];

function safeInit(name: string, initializer: () => Cleanup): boolean {
  try {
    registerModule(name, { destroy: initializer() });
    return true;
  } catch (error) {
    document.documentElement.dataset.moduleError = name;
    if (window.__PORTFOLIO_DEBUG__) console.error(`[portfolio] ${name} failed`, error);
    return false;
  }
}

function renderLocalizedContent(): void {
  renderSkills(document);
  renderProjects(document);
}

function installGlobalErrorHandling(): Cleanup {
  const onError = (event: ErrorEvent): void => {
    if (window.__PORTFOLIO_DEBUG__) console.error('[portfolio] runtime error', event.error || event.message);
  };
  const onRejection = (event: PromiseRejectionEvent): void => {
    if (window.__PORTFOLIO_DEBUG__) console.error('[portfolio] unhandled rejection', event.reason);
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}

async function boot(): Promise<void> {
  try {
    await initApp();
    cleanups.push(installGlobalErrorHandling());
    i18n.restoreLang();
    i18n.applyTranslations();
    const revealReady = safeInit('reveal', initReveal);
    if (revealReady) document.documentElement.classList.add('js-ready');
    renderLocalizedContent();
    cleanups.push(on(EVENTS.LANGUAGE, () => renderLocalizedContent()));
    safeInit('navigation', initNavigation);
    safeInit('mobile-menu', initMobileMenu);
    safeInit('toast', initToast);
    safeInit('palette', initPalette);
    safeInit('clipboard', initClipboard);
    safeInit('scroll-progress', initScrollProgress);
    safeInit('marquee', initMarquee);
    safeInit('micro-effects', initMicroEffects);
    safeInit('canvas-background', initCanvasBackground);
    safeInit('cursor', initCursor);
    window.__portfolioModulesReady = true;
    window.dispatchEvent(new CustomEvent(EVENTS.MODULES_READY));
  } catch (error) {
    document.documentElement.dataset.appError = 'true';
    if (window.__PORTFOLIO_DEBUG__) console.error('[portfolio] boot failed', error);
  }
}

window.addEventListener('beforeunload', () => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  destroyApp();
  clearEvents();
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else void boot();
