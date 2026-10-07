import { test, expect } from '@playwright/test';

async function openPortfolio(page) {
  const errors = [];
  const badResponses = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => {
    if (response.status() >= 400 && new URL(response.url()).pathname !== '/favicon.ico') badResponses.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute('data-app-error', 'true');
  await expect(page.locator('html')).not.toHaveAttribute('data-module-error');
  return { errors, badResponses };
}

test('portfolio loads without runtime or resource errors', async ({ page }) => {
  const { errors, badResponses } = await openPortfolio(page);
  expect(errors).toEqual([]);
  expect(badResponses).toEqual([]);
  await expect(page.locator('[data-skills] .skill-card')).toHaveCount(4);
  await expect(page.locator('[data-projects] .project-card')).toHaveCount(3);
});

test('desktop navigation and palette work', async ({ page }) => {
  await openPortfolio(page);
  await expect(page.locator('#paletteButton')).toBeVisible();
  const initialPalette = await page.locator('html').getAttribute('data-palette');
  await page.locator('#paletteButton').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-palette', initialPalette);
  await expect(page.locator('#paletteButton')).toHaveAttribute('aria-label', /Сменить палитру|Change palette/);

  await page.locator('[data-nav-link][href="#skills"]').first().click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.locator('[data-nav-link][href="#skills"]').first()).toHaveClass(/is-active/);
});

test('palette and language persist after reload', async ({ page }) => {
  await openPortfolio(page);
  await page.locator('#paletteButton').click();
  const palette = await page.locator('html').getAttribute('data-palette');
  await page.locator('#languageButton').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-palette', palette);
  await expect(page.locator('[data-nav-link][href="#skills"]').first()).toHaveText('Skills');
  await expect(page.locator('[data-skills] .skill-card')).toHaveCount(4);
  await expect(page.locator('[data-projects] .project-card')).toHaveCount(3);
});

test('mobile menu traps focus and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolio(page);
  const menu = page.locator('#mobileMenu');
  await expect(menu).toBeHidden();
  await page.locator('#menuButton').click();
  await expect(menu).toBeVisible();
  await expect(page.locator('#mobilePaletteButton')).toBeVisible();
  await expect(page.locator('#mobileLanguageButton')).toBeVisible();
  await expect(page.locator('#paletteButton')).not.toBeVisible();

  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#mobileLanguageButton')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.locator('#menuButton')).toBeFocused();
});

test('mobile menu language and palette work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolio(page);
  await page.locator('#menuButton').click();
  const initialPalette = await page.locator('html').getAttribute('data-palette');
  await page.locator('#mobilePaletteButton').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-palette', initialPalette);
  await page.locator('#mobileLanguageButton').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#mobileLanguageButton')).toHaveText('RU');
  await expect(page.locator('[data-skills] .skill-card')).toHaveCount(4);
  await page.locator('#menuButton').press('Escape');
  await expect(page.locator('#mobileMenu')).toBeHidden();
});

test('dynamic cards keep cursor and reveal behavior after language switch', async ({ page }) => {
  await openPortfolio(page);
  await page.locator('#languageButton').click();
  const project = page.locator('[data-projects] .project-card').first();
  await expect(project).toBeVisible();
  await project.hover();
  await expect(page.locator('#cursor')).toHaveClass(/is-hovering/);
  await page.locator('#languageButton').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('[data-projects] .project-card')).toHaveCount(3);
});

test('copy email shows confirmation toast', async ({ page }) => {
  await openPortfolio(page);
  await page.locator('[data-copy-email]').click();
  await expect(page.locator('#toast')).toHaveClass(/is-visible/);
  await expect(page.locator('#toast')).toContainText('EMAIL');
});
