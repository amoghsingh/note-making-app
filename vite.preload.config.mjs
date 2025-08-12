import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    outDir: 'dist/preload',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main/preload.js'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});
