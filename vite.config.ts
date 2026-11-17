import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site from /workshop-karaganda/; local dev stays at /.
const pagesBuild = process.env.GITHUB_PAGES === "1";

export default defineConfig({
  base: pagesBuild ? "/workshop-karaganda/" : "/",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 8080 },
  preview: { port: 8081 },
});
