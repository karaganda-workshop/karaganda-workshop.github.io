<script setup lang="ts">
/**
 * Animated isometric scene: one platform, three stations.
 *  - marketing: target board with a hit ripple + live growth bars
 *  - automation: meshed gears turning + request cards riding a conveyor
 *  - finance: calculator keys being pressed + coins dropping onto a stack
 * Light pulses travel up the rods. Time-based, paused off-screen, and frozen
 * on a single frame for prefers-reduced-motion.
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import {
  box,
  cylinder,
  easeInOut,
  face,
  gear,
  LINE,
  ring,
  rodEnds,
  TONES,
  wallCircle,
  type Face,
} from "@/scene/iso";

const BASE_Z = 15;

// ---------- static geometry (computed once) ----------

const base: Face[] = [
  ...box(0, 0, 0, 380, 130, 12),
  ...box(8, 8, 12, 364, 114, 3),
  ...Array.from({ length: 14 }, (_, i) =>
    face(
      [
        [24 + i * 12, 130, 4],
        [31 + i * 12, 130, 4],
        [31 + i * 12, 130, 7],
        [24 + i * 12, 130, 7],
      ],
      "#d5d4cc",
      { strokeWidth: 0.8 },
    ),
  ),
  ...box(352, 96, 0, 30, 36, 14),
];

const led = face(
  [
    [382, 104, 5],
    [382, 108, 5],
    [382, 108, 9],
    [382, 104, 9],
  ],
  "#ee9f7c",
  { strokeWidth: 0.8 },
);

const rods = [
  rodEnds([43, 36, BASE_Z + 70], 320),
  rodEnds([172, 34, BASE_Z + 21], 320),
  rodEnds([310, 28, BASE_Z + 11], 320),
];

const board: Face[] = [
  ...box(40, 30, BASE_Z, 6, 64, 72),
  wallCircle(46, 62, BASE_Z + 37, 24, TONES.stone.top),
];

const belt: Face[] = box(126, 106, BASE_Z, 124, 18, 5);

const calculator: Face[] = [
  ...box(282, 24, BASE_Z, 54, 76, 8),
  ...box(288, 30, BASE_Z + 8, 42, 14, 3, "peach"),
];

const coinStack = (cx: number, cy: number, count: number): Face[] =>
  Array.from({ length: count }, (_, i) => cylinder(cx, cy, BASE_Z + i * 5, 13, 5, "peach")).flat();

const tallStack: Face[] = [
  ...coinStack(358, 40, 6),
  face(ring(358, 40, BASE_Z + 30, 8), "none", { strokeWidth: 0.8 }),
];
const midStack = coinStack(360, 74, 4);
const lowStack = coinStack(330, 116, 3);

// ---------- animation clock ----------

const time = ref(1.2);
const root = shallowRef<SVGSVGElement | null>(null);
let raf = 0;
let last = 0;
let visible = false;
let observer: IntersectionObserver | null = null;

function frame(now: number) {
  const dt = last ? Math.min(now - last, 50) : 16;
  last = now;
  time.value += dt / 1000;
  raf = requestAnimationFrame(frame);
}

function start() {
  if (raf) return;
  last = 0;
  raf = requestAnimationFrame(frame);
}

function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) start();
    else stop();
  });
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  stop();
  observer?.disconnect();
});

// ---------- animated geometry ----------

const scene = computed<Face[]>(() => {
  const t = time.value;

  // Marketing: pulsing target, hit ripple, breathing growth bars.
  const pulse = Math.sin(t * 2.2);
  const ripple = (t % 2.4) / 2.4;
  const marketing: Face[] = [
    ...board,
    wallCircle(46, 62, BASE_Z + 37, 17 + pulse * 1.2, TONES.peach.left),
    wallCircle(46, 62, BASE_Z + 37, 10 - pulse * 0.6, TONES.stone.top),
    wallCircle(46, 62, BASE_Z + 37, 4, LINE),
    {
      ...wallCircle(46, 62, BASE_Z + 37, 4 + ripple * 20, "none"),
      opacity: (1 - ripple) * 0.9,
      strokeWidth: 1.2,
    },
  ];
  const bars = [
    { x: 28, h: 16, tone: "stone" as const },
    { x: 48, h: 28, tone: "stone" as const },
    { x: 68, h: 42, tone: "peach" as const },
  ];
  bars.forEach((bar, i) => {
    const grow = easeInOut((Math.sin(t * 1.1 - i * 0.7) + 1) / 2);
    marketing.push(...box(bar.x, 104, BASE_Z, 14, 14, bar.h - 6 + grow * 10, bar.tone));
  });

  // Automation: gears in mesh, cards travelling along the belt (clipped at the ends).
  const spin = t * 0.55;
  const automation: Face[] = [
    ...gear(172, 48, BASE_Z, 23, 28, 12, 9, spin),
    ...gear(203, 79, BASE_Z, 14, 19, 8, 9, -spin * 1.5 + Math.PI / 8),
    ...belt,
  ];
  const lane = 140;
  const spacing = 28;
  for (let k = 0; k < 5; k++) {
    const x = 110 + ((t * 14 + k * spacing) % lane);
    const x0 = Math.max(x, 128);
    const x1 = Math.min(x + 16, 248);
    automation.push(...box(x0, 109, BASE_Z + 5, x1 - x0, 12, 3, k === 2 ? "peach" : "stone"));
  }

  // Finance: one key pressed at a time, a coin dropping onto the tall stack.
  const slot = t * 2.4;
  const pressed = Math.floor(slot) % 12;
  const press = Math.sin(Math.PI * (slot % 1));
  const finance: Face[] = [...calculator];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const h = index === pressed ? 3 - press * 2 : 3;
      finance.push(
        ...box(
          288 + col * 15,
          52 + row * 11,
          BASE_Z + 8,
          10,
          8,
          h,
          index === 11 ? "peach" : "stone",
        ),
      );
    }
  }

  const drop = (t % 2.8) / 2.8;
  const stackTop = BASE_Z + 30;
  finance.push(...tallStack);
  if (drop < 0.92) {
    const fall = Math.min(drop / 0.32, 1);
    const z = stackTop + 70 * (1 - fall * fall) + (fall === 1 ? bounce(drop) : 0);
    const opacity = Math.min(drop / 0.08, 1) * (drop > 0.72 ? 1 - (drop - 0.72) / 0.2 : 1);
    finance.push(...cylinder(358, 40, z, 13, 5, "peach", opacity));
  }
  finance.push(...midStack, ...lowStack);

  return [...marketing, ...automation, ...finance];
});

function bounce(drop: number): number {
  const p = (drop - 0.32) / 0.12;
  return p > 0 && p < 1 ? Math.sin(Math.PI * p) * 3 : 0;
}
</script>

<template>
  <svg
    ref="root"
    viewBox="-130 -110 500 380"
    role="img"
    aria-label="Маркетинг, автоматизация и финансы на одной платформе"
  >
    <defs>
      <linearGradient id="hs-rod-grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0.25" stop-color="#fff" />
        <stop offset="0.8" stop-color="#000" />
      </linearGradient>
      <mask id="hs-rod-fade" maskUnits="userSpaceOnUse" x="-130" y="-110" width="500" height="380">
        <rect x="-130" y="-110" width="500" height="380" fill="url(#hs-rod-grad)" />
      </mask>
    </defs>

    <polygon
      v-for="(f, i) in base"
      :key="`b${i}`"
      :points="f.points"
      :fill="f.fill"
      :stroke="LINE"
      :stroke-width="f.strokeWidth ?? 1"
      stroke-linejoin="round"
    />
    <polygon
      class="scene-led"
      :points="led.points"
      :fill="led.fill"
      :stroke="LINE"
      stroke-width="0.8"
    />

    <g mask="url(#hs-rod-fade)">
      <g v-for="(r, i) in rods" :key="`r${i}`">
        <line v-bind="r" :stroke="LINE" stroke-width="6" stroke-linecap="round" />
        <line v-bind="r" stroke="#fbfbf8" stroke-width="4" stroke-linecap="round" />
        <line
          v-bind="r"
          class="scene-pulse"
          :style="{ animationDelay: `${i * -1.1}s` }"
          stroke="#eea283"
          stroke-width="2.4"
          stroke-linecap="round"
          pathLength="100"
        />
      </g>
    </g>

    <polygon
      v-for="(f, i) in scene"
      :key="`s${i}`"
      :points="f.points"
      :fill="f.fill"
      :opacity="f.opacity"
      :stroke="LINE"
      :stroke-width="f.strokeWidth ?? 1"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.scene-pulse {
  stroke-dasharray: 9 91;
  stroke-dashoffset: 0;
  animation: scene-pulse 3.3s linear infinite;
}

.scene-led {
  animation: scene-led 1.6s ease-in-out infinite;
}

@keyframes scene-pulse {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -100;
  }
}

@keyframes scene-led {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scene-pulse,
  .scene-led {
    animation: none;
  }

  .scene-pulse {
    opacity: 0;
  }
}
</style>
