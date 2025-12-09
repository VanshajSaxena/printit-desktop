import type { Config as PrettierConfig } from "prettier";

interface Config extends PrettierConfig {
  tailwindStylesheet?: string;
}

const config: Config = {
  trailingComma: "all",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/index.css",
};

export default config;
