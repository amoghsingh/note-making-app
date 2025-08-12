// vite.main.config.mjs
import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import path from 'node:path';

export default defineConfig({
  build: {
    outDir: '.vite/build/main',
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.js'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
      ],
    },
    emptyOutDir: true,
  },
});
