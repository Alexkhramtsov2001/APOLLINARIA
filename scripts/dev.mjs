import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { spawn } from 'node:child_process';

const execFileAsync = promisify(execFile);
await execFileAsync('tsc', ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });

const run = (command, args) => spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
const build = run('tsc', ['-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput']);
const vite = run('vite', ['--host', '127.0.0.1']);

let shuttingDown = false;
const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  build.kill('SIGTERM');
  vite.kill('SIGTERM');
  setTimeout(() => process.exit(code), 100);
};

build.on('error', () => shutdown(1));
vite.on('error', () => shutdown(1));
build.on('exit', (code, signal) => {
  if (!shuttingDown && code !== 0 && signal !== 'SIGTERM') shutdown(code ?? 1);
});
vite.on('exit', (code, signal) => {
  if (!shuttingDown && code !== 0 && signal !== 'SIGTERM') shutdown(code ?? 1);
});

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
