---
name: gsap
description: Use when adding, editing, or debugging GSAP animations in this Vue 3 + Vite site (karaganda-workshop). Covers the CSP-safe npm install, the Vue `<script setup>` cleanup pattern with gsap.context(), ScrollTrigger, honoring prefers-reduced-motion, and this project's animation conventions. Triggers on "GSAP", "gsap.to", "gsap.from", "timeline", "ScrollTrigger", "анимация GSAP".
---

# GSAP in this project

GreenSock (GSAP) v3 for animation in the Vue 3 + Vite landing page. GSAP 3.13+
lives on the public npm registry and **every plugin is free** (ScrollTrigger,
SplitText, DrawSVG, etc.) — no auth token, no private registry, no `.npmrc`
pointing at `npm.greensock.com`.

## Hard constraints for this project

- **Never load GSAP from a CDN.** The site ships to GitHub Pages with a strict
  CSP injected at build time (see `vite.config.ts`). A third-party `<script src>`
  is blocked. GSAP must be a **local npm dependency**, bundled by Vite — then it
  makes no external request and needs no CSP change.
- **No inline scripts.** Keep all GSAP code inside `.vue`/`.ts` modules, same as
  the rest of the app.
- **Always honor `prefers-reduced-motion`.** The site already does this for its
  reveal observer (`src/App.vue`). Any GSAP animation must render a sensible
  static end-state when reduced motion is on — set final values instantly
  instead of tweening.
- **Keep it subtle.** The aesthetic is editorial/minimal (stone/graphite tokens,
  short reveals). Prefer small offsets, 0.3–0.6s durations, gentle eases
  (`power2.out`). Don't add bouncy or attention-grabbing motion unless asked.

## Install

```bash
export PATH=$HOME/.local/node/bin:$PATH
npm install gsap
```

Node lives at `~/.local/node/bin`. After install, verify the build still passes:
`npm run build` (runs `vue-tsc` + Vite).

## Imports

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

- Core: `import { gsap } from "gsap";`
- Any plugin: `import { PluginName } from "gsap/PluginName";` then
  `gsap.registerPlugin(PluginName)`. Registering is required even with a bundler
  so plugins aren't tree-shaken away.
- If a build tool chokes on ESM, the UMD path is `import { gsap } from "gsap/dist/gsap";` — not needed here (Vite handles ESM).

## Vue 3 `<script setup>` pattern — scope and clean up

Animations created in a component **must be cleaned up on unmount**, or they leak
and can fire against detached nodes. Use `gsap.context()` scoped to the
component's root element and `revert()` it in `onUnmounted`. This also auto-scopes
every selector string to that root, so `.card` only matches inside this component.

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  // Reduced motion: no tweening, just the resting state.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // IMPORTANT: pass the DOM element (root.value), NOT the Vue ref object.
  // Passing the ref makes the scope invalid, so selectors match nothing and
  // nothing animates (elements silently stay in their hidden start state).
  const scope = root.value;
  if (!scope) return;

  ctx = gsap.context((self) => {
    gsap.from(".reveal-item", {
      y: 24,
      autoAlpha: 0, // animates opacity + visibility together
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: self.selector!(".reveal-item"),
        start: "top 85%",
        once: true,
      },
    });
  }, scope); // <-- scope is the element, not the ref
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <section ref="root">
    <div class="reveal-item">…</div>
  </section>
</template>
```

Notes:
- `autoAlpha` is preferred over `opacity` — it also toggles `visibility`, so a
  hidden element can't be clicked while invisible.
- `once: true` (or `toggleActions`) keeps a reveal from replaying on scroll-up,
  matching the site's current one-shot reveals.
- `ctx.revert()` kills tweens **and** their ScrollTriggers and restores inline
  styles — one call, full cleanup.

## Coexistence with existing animation code

The site already has: CSS `@keyframes` in `src/styles.css`, an
`IntersectionObserver` reveal in `src/App.vue` (`[data-reveal]`), and a separate
section-view tracker in `src/lib/sectionViews.ts` (analytics — leave it alone).

- GSAP ScrollTrigger and these observers can coexist, but **don't double-animate**
  the same element with both a CSS reveal and a GSAP tween — pick one per element.
- If you convert a `[data-reveal]` element to GSAP, remove its `data-reveal`
  attribute so `App.vue` doesn't also toggle `.is-in` on it. Never remove
  `data-section` — that's analytics, not animation.
- Prefer keeping the existing lightweight CSS reveals for simple fades; reach for
  GSAP when you need timelines, staggers, scrubbing, motion paths, or SVG draw.

## Debugging checklist

- Animation doesn't fire → is the plugin registered? Is the trigger element in
  the DOM at `onMounted` (not inside a `v-if` that's still false)?
- ScrollTrigger positions wrong after dynamic content loads →
  `ScrollTrigger.refresh()`.
- Styles stuck after navigating away → missing `ctx.revert()` in `onUnmounted`.
- Build fails on plugin import → check the import path casing
  (`gsap/ScrollTrigger`, capital S/T).

## Verify changes

After any GSAP work: `npm run build` must pass, and check the page at phone
(390px) and desktop (1440px) widths — no layout shift, no horizontal overflow,
and the reduced-motion path renders the final state.
