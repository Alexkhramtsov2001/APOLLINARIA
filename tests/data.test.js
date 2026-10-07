import { describe, expect, it } from 'vitest';
import { SKILLS, TOOLS } from '../src/data/skills.ts';
import { PROJECTS } from '../src/data/projects.ts';

describe('portfolio content data', () => {
  it('keeps skill directions and tools separated', () => {
    expect(SKILLS.length).toBeGreaterThanOrEqual(4);
    expect(TOOLS.length).toBeGreaterThanOrEqual(6);
    expect(SKILLS.every((item) => Array.isArray(item.tools))).toBe(true);
  });
  it('uses stable project records', () => {
    expect(Array.isArray(PROJECTS)).toBe(true);
    expect(PROJECTS.every((project) => project.number && project.title && project.description)).toBe(true);
  });
});
