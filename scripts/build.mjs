import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { rm } from 'node:fs/promises';

const execFileAsync = promisify(execFile);
await rm('js', { recursive: true, force: true });
await execFileAsync('tsc', ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });
await execFileAsync('vite', ['build'], { stdio: 'inherit' });
