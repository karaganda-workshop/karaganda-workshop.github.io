<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import BookLink from "@/components/BookLink.vue";
import { trackEvent } from "@/lib/analytics";

// Headline across two lines; each line split into characters for the reveal.
const HEADLINE = "Для предпринимателей";
const line1 = [..."Для"];
const line2 = [..."предпринимателей"];
// The squiggle is woven in after this character index of line 2.
const SQUIGGLE_AT = 10;

const root = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  // Reduced motion: CSS leaves everything visible; skip the animation entirely.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Pass the DOM element (root.value), NOT the Vue ref, as the context scope.
  const scope = root.value;
  if (!scope) return;

  ctx = gsap.context(() => {
    const tl = gsap.timeline();
    // Letters rise in one after another at a brisk, even pace.
    tl.fromTo(
      ".hero-char",
      { yPercent: 45, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.03 },
    );
    // The geometric shapes fade in (opacity only — the idle float owns transform).
    tl.fromTo(".hero-shape", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.15 }, "-=0.35");
    // Caption and buttons follow, overlapping the tail of the headline.
    tl.fromTo(
      ".hero-rise",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.12 },
      "-=0.4",
    );
  }, scope);
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <section
    ref="root"
    class="relative flex min-h-[calc(100svh-3.75rem)] flex-col overflow-hidden bg-coal text-stone"
    data-section="hero"
  >
    <!-- Soft peach glow behind the headline. -->
    <div
      class="pointer-events-none absolute -top-32 -left-10 h-[34rem] w-[34rem] rounded-full bg-peach-strong/20 blur-[120px]"
      aria-hidden="true"
    />

    <!-- SVG gradient defs shared by the inline shapes. -->
    <svg width="0" height="0" class="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="hero-pinwheel-grad" gradientUnits="userSpaceOnUse" x1="78" y1="6" x2="20" y2="94">
          <stop offset="0" stop-color="#f6933a" />
          <stop offset="0.5" stop-color="#ee7e68" />
          <stop offset="1" stop-color="#bf86d8" />
        </linearGradient>
        <linearGradient id="hero-sq-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#bba9f8" />
          <stop offset="0.55" stop-color="#9a7fe8" />
          <stop offset="1" stop-color="#c58ad9" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Oversized, full-bleed two-line headline, vertically centered. -->
    <div class="relative flex flex-1 flex-col justify-center px-5 pt-12 pb-6 sm:px-8 lg:px-12">
      <h1 class="hero-title text-[clamp(2rem,10vw,8rem)] leading-[0.9]">
        <span class="sr-only">{{ HEADLINE }}</span>
        <span aria-hidden="true">
          <!-- Line 1: «Для» + pinwheel woven in after it -->
          <span class="flex items-center">
            <span class="whitespace-nowrap">
              <span v-for="(ch, ci) in line1" :key="`a${ci}`" class="hero-char inline-block">{{
                ch
              }}</span>
            </span>
            <svg
              viewBox="0 0 100 100"
              class="hero-shape ml-[0.22em] inline-block h-[0.66em] w-[0.66em] shrink-0 align-middle"
              aria-hidden="true"
            >
              <g fill="url(#hero-pinwheel-grad)">
                <path d="M50 50 L0 50 A50 50 0 0 1 50 0 Z" transform="translate(-3 -3)" />
                <path d="M50 50 L50 0 A50 50 0 0 1 100 50 Z" transform="translate(3 -3)" />
                <path d="M50 50 L100 50 A50 50 0 0 1 50 100 Z" transform="translate(3 3)" />
                <path d="M50 50 L50 100 A50 50 0 0 1 0 50 Z" transform="translate(-3 3)" />
              </g>
            </svg>
          </span>
          <!-- Line 2: «предпринимателей» + squiggle woven between letters -->
          <span class="block whitespace-nowrap">
            <template v-for="(ch, ci) in line2" :key="`b${ci}`">
              <span class="hero-char inline-block">{{ ch }}</span>
              <svg
                v-if="ci === SQUIGGLE_AT"
                viewBox="0 0 60 150"
                class="hero-shape hero-squiggle mx-[-0.03em] inline-block h-[1.12em] w-[0.46em] align-middle"
                aria-hidden="true"
              >
                <path
                  d="M20 8 C 48 20, 48 45, 20 57 S -8 94, 20 106 S 48 140, 22 148"
                  fill="none"
                  stroke="url(#hero-sq-grad)"
                  stroke-width="17"
                  stroke-linecap="round"
                />
                <path
                  d="M20 8 C 48 20, 48 45, 20 57 S -8 94, 20 106 S 48 140, 22 148"
                  fill="none"
                  stroke="#ffffff"
                  stroke-opacity="0.35"
                  stroke-width="5"
                  stroke-linecap="round"
                  transform="translate(-3 -2)"
                />
              </svg>
            </template>
          </span>
        </span>
      </h1>
    </div>

    <!-- Bottom row: bracketed caption left, actions right. -->
    <div
      class="relative flex flex-col gap-6 px-5 pb-10 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12"
    >
      <p class="hero-rise max-w-md text-left text-base leading-relaxed text-stone/60">
        <span class="text-peach-strong">{</span>
        Покажем, как <mark class="key-mark">настроить рекламу</mark>,
        <mark class="key-mark">автоматизировать работу&nbsp;с&nbsp;клиентами</mark>
        и расскажем про <mark class="key-mark">особенности налогообложения</mark>
        <span class="text-peach-strong">}</span>
      </p>
      <div class="hero-rise flex flex-shrink-0 flex-wrap items-center gap-3">
        <BookLink variant="light" offset="night" location="hero" class="h-14 px-8 text-base"
          >Забронировать место</BookLink
        >
        <a
          href="#results"
          class="inline-flex h-14 items-center rounded-full border border-stone/25 bg-transparent px-8 text-base font-semibold text-stone transition-colors duration-200 hover:border-stone/50 hover:bg-stone/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone focus-visible:ring-offset-2 focus-visible:ring-offset-coal"
          @click="trackEvent('click_benefits')"
        >
          Что я получу
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hide the animated pieces up front only when motion is allowed, so GSAP can
   reveal them with no flash. Reduced motion leaves them visible. */
@media (prefers-reduced-motion: no-preference) {
  .hero-char,
  .hero-rise,
  .hero-shape {
    opacity: 0;
  }
}

/* The highlighted words default to dark text (for light sections); on the dark
   hero they need light text. The peach underline stays as-is. */
.hero-rise :deep(.key-mark) {
  color: var(--color-stone);
}

/* Hero headline in Onest — a clean geometric display face. */
.hero-title {
  font-family: "Onest Variable", var(--font-sans);
  font-weight: 700;
  letter-spacing: -0.03em;
}

/* Gentle idle float for the woven-in shapes (transform only). */
@media (prefers-reduced-motion: no-preference) {
  .hero-shape {
    animation: hero-float 7s ease-in-out infinite;
  }
  .hero-squiggle {
    animation-duration: 9s;
    animation-delay: -3s;
  }
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
