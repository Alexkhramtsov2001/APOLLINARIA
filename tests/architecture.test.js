import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
async function source(path) { return readFile(new URL(path, root), 'utf8'); }

describe('architecture guardrails', () => {
  it('does not keep the old duplicated language render listener', async () => {
    const skills = await source('src/data/skills.ts');
    expect(skills).not.toContain("window.addEventListener('portfolio:langchange'");
  });
  it('keeps a single application entry point in the unchanged HTML shell', async () => {
    const html = await source('index.html');
    expect((html.match(/<script type="module"/g) || []).length).toBe(1);
    expect(html).toContain('./js/main.js');
  });
  it('keeps TypeScript as the canonical application source', async () => {
    const main = await source('src/main.ts');
    expect(main).toContain("from './core/app.js'");
  });
});
