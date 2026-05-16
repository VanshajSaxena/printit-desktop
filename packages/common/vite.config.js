import { builtinModules } from "node:module";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig(() => {
  return {
    envDir: "../../",
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
        external: [
          ...builtinModules,
          ...Object.keys(pkg.dependencies || {}),
          "electron-log",
          "electron",
        ],
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
