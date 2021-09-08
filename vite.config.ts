import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const deps = Object.keys(pkg.dependencies);

const external = function (id: string) {
  return /^vue/.test(id) || deps.some((k) => new RegExp("^" + k).test(id));
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Vue3NormalLibrary",
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: external,
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
      plugins: [
        typescript({
          tsconfigOverride: {
            include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
            exclude: [
              "node_modules",
              "utils/**/__tests__/*",
              "src/main.ts",
              "tests/**/*.ts",
              "tests/**/*.tsx",
              "public",
              "favicon.ico",
            ],
          },
          abortOnError: false,
        }),
      ],
    },
  },
  plugins: [vue(), vueJsx()],
});
