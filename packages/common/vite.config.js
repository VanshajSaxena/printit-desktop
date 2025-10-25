import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: 'index.ts',
        formats: ['es'],
      },
      outDir: 'dist',
      sourcemap: 'inline',
      emptyOutDir: true,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          preserveModules: true,
          entryFileNames: '[name].js',
          format: 'es',
        },
      },
    },
  };
});
