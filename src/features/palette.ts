import { CONFIG } from '../core/config.js';
import { EVENTS } from '../core/events.js';
import type { Palette } from '../core/types.js';

const PALETTES: readonly Palette[] = ['cyan', 'violet', 'lime'];

export function initPalette(): () => void {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('#paletteButton, #mobilePaletteButton')];
  if (!buttons.length) return () => {};
  let stored: string | null = null;
  try { stored = localStorage.getItem(CONFIG.storage.palette); } catch { /* Storage may be blocked. */ }
  const current = PALETTES.includes(stored as Palette) ? stored as Palette : getPalette(document.documentElement.dataset.palette);
  applyPalette(current, false);
  const onClick = (): void => {
    const active = getPalette(document.documentElement.dataset.palette);
    const next = PALETTES[(PALETTES.indexOf(active) + 1) % PALETTES.length] || 'cyan';
    applyPalette(next, true);
  };
  buttons.forEach((button) => button.addEventListener('click', onClick));
  const onLanguageChange = (): void => applyPalette(getPalette(document.documentElement.dataset.palette), false);
  window.addEventListener(EVENTS.LANGUAGE, onLanguageChange);
  return () => {
    buttons.forEach((button) => button.removeEventListener('click', onClick));
    window.removeEventListener(EVENTS.LANGUAGE, onLanguageChange);
  };
}

function getPalette(value: string | undefined): Palette { return value === 'violet' || value === 'lime' ? value : 'cyan'; }

function applyPalette(palette: Palette, persist: boolean): void {
  document.documentElement.dataset.palette = palette;
  if (persist) { try { localStorage.setItem(CONFIG.storage.palette, palette); } catch { /* Storage may be blocked. */ } }
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const labels = {
    ru: { cyan: 'Сменить палитру: фиолетовая', violet: 'Сменить палитру: лаймовая', lime: 'Сменить палитру: голубая' },
    en: { cyan: 'Change palette: violet', violet: 'Change palette: lime', lime: 'Change palette: cyan' },
  } as const;
  document.querySelectorAll<HTMLButtonElement>('#paletteButton, #mobilePaletteButton').forEach((button) => button.setAttribute('aria-label', labels[lang][palette]));
  window.dispatchEvent(new CustomEvent('portfolio:palettechange', { detail: { palette } }));
}
