<script setup lang="ts">
/**
 * Small isometric icons for the facts and results cards, drawn with the same kit and
 * palette as the hero scene. Each sits on a little platform tile.
 */
import { computed } from "vue";
import {
  box,
  cylinder,
  face,
  gear,
  iso,
  LINE,
  TONES,
  wallCircle,
  type Face,
  type P3,
} from "@/scene/iso";

export type FactIconKind =
  "calendar" | "pin" | "clock" | "layers" | "target" | "gears" | "calculator" | "consult" | "docs";

const props = defineProps<{ kind: FactIconKind }>();

function line(a: P3, b: P3, width = 1.6): Face {
  // A thin quad along a→b on the +x wall plane; reads as a stroke.
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  const dy = by - ay;
  const dz = bz - az;
  const len = Math.hypot(dy, dz) || 1;
  const ny = (-dz / len) * (width / 2);
  const nz = (dy / len) * (width / 2);
  return face(
    [
      [ax, ay + ny, az + nz],
      [bx, by + ny, bz + nz],
      [bx, by - ny, bz - nz],
      [ax, ay - ny, az - nz],
    ],
    LINE,
    { strokeWidth: 0.6 },
  );
}

const tile = (): Face[] => box(0, 0, 0, 44, 44, 4);

const faces = computed<Face[]>(() => {
  switch (props.kind) {
    case "calendar": {
      // A standing calendar page: peach header band, rings, a grid of days.
      const out = [...tile(), ...box(16, 8, 4, 5, 28, 30), ...box(16, 8, 26, 5, 28, 8, "peach")];
      for (const y of [14, 28]) out.push(...cylinder(18.5, y, 32, 1.4, 5));
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const y = 11 + c * 6;
          const z = 20 - r * 6;
          out.push(
            face(
              [
                [21, y, z],
                [21, y + 3.4, z],
                [21, y + 3.4, z + 3],
                [21, y, z + 3],
              ],
              r === 1 && c === 2 ? TONES.peach.right : TONES.stone.left,
              { strokeWidth: 0.6 },
            ),
          );
        }
      }
      return out;
    }
    case "pin": {
      // Map pin standing on the tile, with a target ring around its foot.
      return [
        ...tile(),
        face(
          Array.from({ length: 32 }, (_, i) => {
            const a = (i / 32) * Math.PI * 2;
            return [22 + 13 * Math.cos(a), 22 + 13 * Math.sin(a), 4] as P3;
          }),
          TONES.peach.top,
          { strokeWidth: 0.8 },
        ),
        ...cylinder(22, 22, 4, 2.2, 22),
        ...cylinder(22, 22, 24, 8, 7, "peach"),
        ...cylinder(22, 22, 31, 3, 1.5),
      ];
    }
    case "clock": {
      // A wall clock panel with hands at 18:30-ish.
      const cz = 22;
      return [
        ...tile(),
        ...box(16, 6, 4, 5, 32, 34),
        wallCircle(21, 22, cz, 13, TONES.stone.top),
        wallCircle(21, 22, cz, 10, TONES.peach.top),
        line([21, 22, cz], [21, 22, cz - 8]),
        line([21, 22, cz], [21, 27.5, cz + 2.5]),
        wallCircle(21, 22, cz, 1.6, LINE),
      ];
    }
    case "layers": {
      // Three topics stacked as slabs; the top one is the accent.
      return [
        ...tile(),
        ...box(8, 8, 4, 28, 28, 5),
        ...box(10, 10, 12, 24, 24, 5),
        ...box(12, 12, 20, 20, 20, 5, "peach"),
      ];
    }
    case "target": {
      // Advertising: a target board with a growth bar in front of it.
      return [
        ...tile(),
        ...box(14, 6, 4, 5, 32, 34),
        wallCircle(19, 22, 21, 13, TONES.stone.top),
        wallCircle(19, 22, 21, 9, TONES.peach.left),
        wallCircle(19, 22, 21, 5, TONES.stone.top),
        wallCircle(19, 22, 21, 2, LINE),
        ...box(27, 30, 4, 6, 6, 7),
        ...box(34, 30, 4, 6, 6, 13, "peach"),
      ];
    }
    case "gears": {
      // Automation: two meshed gears, chunky enough to read at icon size.
      return [
        ...tile(),
        ...gear(18, 18, 4, 12, 16, 9, 8, 0.15),
        ...gear(34, 34, 4, 6, 9, 7, 8, Math.PI / 7),
      ];
    }
    case "calculator": {
      // Taxes: a calculator with a tall stack of coins beside it.
      const keys: Face[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          keys.push(
            ...box(8 + c * 6, 18 + r * 6, 12, 4, 4, 2, r === 2 && c === 2 ? "peach" : "stone"),
          );
        }
      }
      return [
        ...tile(),
        ...box(6, 6, 4, 20, 30, 8),
        ...box(8, 8, 12, 16, 7, 2.5, "peach"),
        ...keys,
        ...[0, 1, 2, 3, 4, 5].flatMap((i) => cylinder(35, 27, 4 + i * 3.2, 6, 3.2, "peach")),
      ];
    }
    case "consult": {
      // Personal consultation: two people at a small table.
      return [
        ...tile(),
        ...cylinder(10, 22, 4, 4.5, 12),
        ...cylinder(10, 22, 16, 3.6, 5, "peach"),
        ...box(16, 14, 4, 14, 16, 8),
        ...cylinder(36, 22, 4, 4.5, 12),
        ...cylinder(36, 22, 16, 3.6, 5, "peach"),
      ];
    }
    case "docs": {
      // Materials: a stack of sheets, the top one highlighted with text lines.
      const top = 9;
      return [
        ...tile(),
        ...box(10, 12, 4, 24, 22, 2),
        ...box(12, 10, 6, 24, 22, 2),
        ...box(14, 8, top, 24, 22, 2, "peach"),
        ...[0, 1, 2].map((i) =>
          face(
            [
              [17, 12 + i * 5, top + 2],
              [17 + (i === 2 ? 11 : 18), 12 + i * 5, top + 2],
              [17 + (i === 2 ? 11 : 18), 14 + i * 5, top + 2],
              [17, 14 + i * 5, top + 2],
            ],
            TONES.peach.right,
            { strokeWidth: 0.6 },
          ),
        ),
      ];
    }
  }
  return [];
});

// Same frame for every icon (centred on the tile, bottom-aligned) so they share one scale.
const viewBox = computed(() => {
  let maxY = -Infinity;
  for (const f of faces.value) {
    for (const pair of f.points.trim().split(" "))
      maxY = Math.max(maxY, Number(pair.split(",")[1]));
  }
  const [cx] = iso([22, 22, 0]);
  return `${(cx - 44).toFixed(1)} ${(maxY - 74).toFixed(1)} 88 76`;
});
</script>

<template>
  <svg :viewBox="viewBox" aria-hidden="true">
    <polygon
      v-for="(f, i) in faces"
      :key="i"
      :points="f.points"
      :fill="f.fill"
      :stroke="LINE"
      :stroke-width="f.strokeWidth ?? 1"
      stroke-linejoin="round"
    />
  </svg>
</template>
