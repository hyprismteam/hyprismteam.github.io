import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      input: {
        ru: "index.html",
        en: "en/index.html",
        zh: "zh/index.html",
        es: "es/index.html",
        fr: "fr/index.html",
        ptBr: "pt-br/index.html",
      },
    },
  },
});
