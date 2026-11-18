import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site from /workshop-karaganda/; local dev stays at /.
const pagesBuild = process.env.GITHUB_PAGES === "1";

/**
 * Content-Security-Policy for the built site. GitHub Pages can't send
 * response headers, so it ships as a <meta> tag. Build-only: the dev server
 * needs inline styles and a websocket for HMR.
 *  - scripts only from our own origin (no inline/eval) → injected markup can't run
 *  - 'unsafe-inline' styles: Vue :style bindings write style attributes
 *  - data: fonts/images: Vite inlines small assets as data URIs
 *  - no plugins, no <base> hijack, no form posts, no framing via <object>
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");

function securityMeta(): Plugin {
  return {
    name: "security-meta",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: CSP },
          injectTo: "head-prepend",
        },
        {
          tag: "meta",
          attrs: { name: "referrer", content: "strict-origin-when-cross-origin" },
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig({
  base: pagesBuild ? "/workshop-karaganda/" : "/",
  plugins: [vue(), tailwindcss(), securityMeta()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 8080 },
  preview: { port: 8081 },
});
