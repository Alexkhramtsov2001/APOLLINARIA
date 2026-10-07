import { spawn } from 'node:child_process';

/* global fetch */
const host = '127.0.0.1';
const port = '4173';
const url = `http://${host}:${port}/APOLLINARIA/`;

const run = (command, args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { stdio: 'inherit', shell: false, ...options });
  child.on('error', reject);
  child.on('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code ?? signal}`)));
});

await run('npm', ['run', 'build']);
const preview = spawn('npm', ['run', 'preview', '--', '--host', host], { stdio: 'inherit' });
try {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) break;
    } catch { /* Preview may not be ready yet. */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (attempt === 49) throw new Error('Preview server did not become ready.');
  }
  await run('npx', ['--yes', 'lighthouse', url, '--chrome-flags=--headless --no-sandbox', '--only-categories=performance,accessibility,best-practices,seo']);
} finally {
  preview.kill('SIGTERM');
}
