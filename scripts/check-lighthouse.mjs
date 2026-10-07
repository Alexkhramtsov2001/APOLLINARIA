import { readFile } from 'node:fs/promises';

const file = process.argv[2] || 'lighthouse-report.json';
const report = JSON.parse(await readFile(file, 'utf8'));
const thresholds = {
  performance: 0.80,
  accessibility: 0.90,
  'best-practices': 0.90,
  seo: 0.90,
};

const failures = [];
for (const [category, minimum] of Object.entries(thresholds)) {
  const score = report.categories?.[category]?.score ?? 0;
  const percent = Math.round(score * 100);
  console.log(`${category}: ${percent}/100 (minimum ${minimum * 100})`);
  if (score < minimum) failures.push(`${category} ${percent} < ${minimum * 100}`);
}

if (failures.length) {
  console.error(`Lighthouse budget failed: ${failures.join(', ')}`);
  process.exit(1);
}
