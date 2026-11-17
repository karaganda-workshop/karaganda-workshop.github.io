<script setup lang="ts">
/**
 * Vue port of Magic UI's <TextAnimate>: splits its text into words,
 * characters or lines and animates each segment in with a stagger.
 *
 *   <TextAnimate animation="slideUp" by="word">Slide up by word</TextAnimate>
 *
 * Timings follow the original: each segment animates for 0.3s and the
 * cascade is spread over `duration` (default 0.3s). Like the original it
 * starts when scrolled into view (`startOnView`, default true) and replays on
 * every re-entry unless `once` is set. Screen readers get the full text once;
 * the animated segments are aria-hidden. prefers-reduced-motion shows the
 * text at once.
 */
import { computed, onBeforeUnmount, onMounted, ref, useSlots, type VNode } from "vue";

export type TextAnimation =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

const props = withDefaults(
  defineProps<{
    animation?: TextAnimation;
    by?: "text" | "word" | "character" | "line";
    as?: string;
    /** Delay before the first segment, in seconds. */
    delay?: number;
    /** Time the whole cascade is spread over, in seconds. */
    duration?: number;
    segmentClass?: string;
    /** Wait until the element scrolls into view before animating. */
    startOnView?: boolean;
    /** Animate only the first time it enters the view. */
    once?: boolean;
  }>(),
  {
    animation: "fadeIn",
    by: "word",
    as: "p",
    delay: 0,
    duration: 0.3,
    segmentClass: "",
    startOnView: true,
    once: false,
  },
);

const root = ref<HTMLElement | null>(null);
const playing = ref(!props.startOnView);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!props.startOnView || !root.value) return;
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        playing.value = true;
        if (props.once) observer?.disconnect();
      } else if (!props.once) {
        playing.value = false;
      }
    },
    { threshold: 0.1 },
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());

const slots = useSlots();

function slotText(nodes: VNode[] | undefined): string {
  if (!nodes) return "";
  return nodes
    .map((node) =>
      typeof node.children === "string"
        ? node.children
        : Array.isArray(node.children)
          ? slotText(node.children as VNode[])
          : "",
    )
    .join("");
}

const text = computed(() => slotText(slots.default?.()).replace(/\s+/g, " ").trim());

interface Segment {
  text: string;
  space: boolean;
  delay: string;
}

const segments = computed<Segment[]>(() => {
  const parts =
    props.by === "word"
      ? text.value.split(/(\s+)/)
      : props.by === "character"
        ? text.value.split("")
        : props.by === "line"
          ? text.value.split("\n")
          : [text.value];
  const animated = parts.filter((part) => !/^\s+$/.test(part)).length || 1;
  // Like Magic UI: the whole cascade is spread over `duration`.
  const stagger = props.duration / animated;
  let index = 0;
  return parts.map((part) => {
    const space = props.by === "word" && /^\s+$/.test(part);
    const delay = `${(props.delay + (space ? 0 : index++) * stagger).toFixed(3)}s`;
    return { text: part, space, delay };
  });
});
</script>

<template>
  <component :is="as" ref="root" class="text-animate">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(segment, i) in segments" :key="`${by}-${i}`">
        <template v-if="segment.space">{{ segment.text }}</template>
        <span
          v-else
          class="ta-segment"
          :class="[
            playing ? `ta-${animation}` : 'ta-idle',
            by === 'line' ? 'block' : 'inline-block',
            segmentClass,
          ]"
          :style="{ animationDelay: segment.delay }"
          >{{ segment.text }}</span
        >
      </template>
    </span>
  </component>
</template>

<style scoped>
.ta-segment {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.ta-idle {
  opacity: 0;
}

.ta-fadeIn {
  animation-name: ta-fade-in;
}
.ta-blurIn {
  animation-name: ta-blur-in;
}
.ta-blurInUp {
  animation-name: ta-blur-in-up;
}
.ta-blurInDown {
  animation-name: ta-blur-in-down;
}
.ta-slideUp {
  animation-name: ta-slide-up;
}
.ta-slideDown {
  animation-name: ta-slide-down;
}
.ta-slideLeft {
  animation-name: ta-slide-left;
}
.ta-slideRight {
  animation-name: ta-slide-right;
}
.ta-scaleUp {
  animation-name: ta-scale-up;
}
.ta-scaleDown {
  animation-name: ta-scale-down;
}

@keyframes ta-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}
@keyframes ta-blur-in {
  from {
    opacity: 0;
    filter: blur(10px);
  }
}
@keyframes ta-blur-in-up {
  from {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(20px);
  }
}
@keyframes ta-blur-in-down {
  from {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(-20px);
  }
}
@keyframes ta-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}
@keyframes ta-slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
}
@keyframes ta-slide-left {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
}
@keyframes ta-slide-right {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
}
@keyframes ta-scale-up {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
}
@keyframes ta-scale-down {
  from {
    opacity: 0;
    transform: scale(1.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ta-segment {
    animation: none;
  }

  .ta-idle {
    opacity: 1;
  }
}
</style>
