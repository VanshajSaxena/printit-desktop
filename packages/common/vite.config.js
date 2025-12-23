import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(() => {
  return {
    plugins: [
      dts({
        entryRoot: "src",
        tsconfigPath: "./tsconfig.json",
        exclude: ["**/*.test.ts", "**/*.spec.ts"],
        copyDtsFiles: true,
      }),
    ],
    build: {
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
        fileName: "index",
      },
      outDir: "dist",
      sourcemap: "inline",
      emptyOutDir: true,
      reportCompressedSize: true,
      rollupOptions: {
        external: ["electron-log"],
        output: {
          preserveModules: false,
          entryFileNames: "[name].js",
        },
      },
      target: "es2022",
      minify: false,
    },
  };
});
