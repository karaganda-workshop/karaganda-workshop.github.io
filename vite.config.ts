import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// URL path the site is served from. The Pages workflow sets SITE_BASE from
// actions/configure-pages: "/" for karaganda-workshop.github.io, "/<repo>/"
// for a project site. Local dev and preview stay at "/".
function siteBase(raw: string | undefined): string {
  const value = (raw ?? "/").trim();
  if (!/^\/([A-Za-z0-9._-]+\/)*$/.test(value)) {
    throw new Error(`SITE_BASE must look like "/" or "/repo/", got "${value}"`);
  }
  return value;
}

/**
 * Content-Security-Policy for the built site. GitHub Pages can't send
 * response headers, so it ships as a <meta> tag. Build-only: the dev server
 * needs inline styles and a websocket for HMR.
 *  - scripts only from our own origin + Meta Pixel + Yandex Metrika (no inline/eval)
 *    → injected markup can't run
 *  - googletagmanager.com / google-analytics.com for the Google tag (GA4)
 *  - mc.yandex.* for Metrika hits, Webvisor and click map (frames/blob workers)
 *  - facebook.com for the pixel's beacons (img / fetch)
 *  - 'unsafe-inline' styles: Vue :style bindings write style attributes
 *  - data: fonts/images: Vite inlines small assets as data URIs
 *  - no plugins, no <base> hijack, no form posts, no framing via <object>
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://connect.facebook.net https://mc.yandex.ru https://yastatic.net https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.facebook.com https://mc.yandex.ru https://mc.yandex.kz https://mc.yandex.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.facebook.com https://connect.facebook.net https://mc.yandex.ru https://mc.yandex.kz https://mc.yandex.com wss://mc.yandex.ru wss://mc.yandex.kz wss://mc.yandex.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src blob: https://mc.yandex.ru https://mc.yandex.kz https://mc.yandex.com",
  "child-src blob: https://mc.yandex.ru https://mc.yandex.kz https://mc.yandex.com",
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
  base: siteBase(process.env.SITE_BASE),
  plugins: [vue(), tailwindcss(), securityMeta()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 8080 },
  preview: { port: 8081 },
});
