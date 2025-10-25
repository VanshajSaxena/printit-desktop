export default /**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
({
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
      output: {
        preserveModules: true,
        preserveModulesRoot: '.',
      },
    },
  },
});
