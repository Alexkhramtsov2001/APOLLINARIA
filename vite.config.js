import { defineConfig } from 'vite';

export default defineConfig({
  base: '/APOLLINARIA/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
