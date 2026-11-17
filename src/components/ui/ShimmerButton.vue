<script setup lang="ts">
/**
 * Vue port of Magic UI's <ShimmerButton>: a light streak travels around the
 * button's edge while an inner glow highlights it on hover / press.
 *
 *   <ShimmerButton class="shadow-2xl">
 *     <span class="text-sm font-medium text-white">Shimmer Button</span>
 *   </ShimmerButton>
 *
 * Renders a <button> by default; pass `as="a"` plus `href` etc. for a link.
 * Same props and defaults as the original; inline-flex (not flex) so a link
 * button doesn't stretch to its container width.
 */
withDefaults(
  defineProps<{
    as?: string;
    shimmerColor?: string;
    shimmerSize?: string;
    shimmerDuration?: string;
    borderRadius?: string;
    background?: string;
    /** Original px-6 py-3 padding; turn off to size the button via `class`. */
    padded?: boolean;
  }>(),
  {
    as: "button",
    shimmerColor: "#ffffff",
    shimmerSize: "0.05em",
    shimmerDuration: "3s",
    borderRadius: "100px",
    background: "rgba(0, 0, 0, 1)",
    padded: true,
  },
);
</script>

<template>
  <component
    :is="as"
    class="shimmer-button group relative z-0 inline-flex transform-gpu cursor-pointer items-center justify-center overflow-hidden border border-white/10 whitespace-nowrap text-white transition-transform duration-300 ease-in-out active:translate-y-px"
    :class="{ 'px-6 py-3': padded }"
    :style="{
      '--spread': '90deg',
      '--shimmer-color': shimmerColor,
      '--radius': borderRadius,
      '--speed': shimmerDuration,
      '--cut': shimmerSize,
      '--bg': background,
    }"
  >
    <!-- spark container -->
    <div class="shimmer-spark-wrap absolute inset-0 -z-30 overflow-visible blur-[2px]">
      <div class="shimmer-spark absolute inset-0 aspect-square h-[100cqh]">
        <div class="shimmer-spark-before absolute -inset-full w-auto rotate-0" />
      </div>
    </div>

    <slot />

    <!-- highlight -->
    <div
      class="absolute inset-0 size-full transform-gpu rounded-2xl shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
    />

    <!-- backdrop -->
    <div class="shimmer-backdrop absolute -z-20" />
  </component>
</template>

<style scoped>
.shimmer-button {
  border-radius: var(--radius);
  background: var(--bg);
}

.shimmer-spark-wrap {
  container-type: size;
}

.shimmer-spark {
  animation: shimmer-slide var(--speed) ease-in-out infinite alternate;
}

.shimmer-spark-before {
  background: conic-gradient(
    from calc(270deg - (var(--spread) * 0.5)),
    transparent 0,
    var(--shimmer-color) var(--spread),
    transparent var(--spread)
  );
  animation: spin-around calc(var(--speed) * 2) infinite linear;
}

.shimmer-backdrop {
  inset: var(--cut);
  border-radius: var(--radius);
  background: var(--bg);
}

@keyframes shimmer-slide {
  to {
    transform: translate(calc(100cqw - 100%), 0);
  }
}

@keyframes spin-around {
  0% {
    transform: translateZ(0) rotate(0);
  }
  15%,
  35% {
    transform: translateZ(0) rotate(90deg);
  }
  65%,
  85% {
    transform: translateZ(0) rotate(270deg);
  }
  100% {
    transform: translateZ(0) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer-spark,
  .shimmer-spark-before {
    animation: none;
  }
}
</style>
