import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths(),
      dts({
        insertTypesEntry: true,
        rollupTypes: true,
      }),
    ],
    build: {
      lib: {
        entry: 'index.ts',
        formats: ['es'],
        fileName: 'index',
      },
      outDir: 'dist',
      sourcemap: 'inline',
      emptyOutDir: true,
      reportCompressedSize: true,
      rollupOptions: {
        external: ['electron-log'],
      },
    },
  };
});
