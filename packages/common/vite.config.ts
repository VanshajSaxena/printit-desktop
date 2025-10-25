// packages/common/vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  // We only need the 'build' section for library packages
  build: {
    lib: {
      entry: 'index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
  },
});
