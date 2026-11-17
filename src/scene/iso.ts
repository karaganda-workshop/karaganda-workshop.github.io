/**
 * Tiny isometric geometry kit. Shapes are described in 3D world units
 * (x → right-down, y → left-down, z → up) and returned as flat polygon
 * faces in the order they must be painted.
 */

export type P3 = [x: number, y: number, z: number];
export type Tone = "stone" | "peach";

export interface Face {
  points: string;
  fill: string;
  strokeWidth?: number;
  opacity?: number;
}

const COS = 0.866;
export const LINE = "#55554f";

export const TONES: Record<Tone, { top: string; left: string; right: string }> = {
  stone: { top: "#fbfbf8", left: "#ecebe5", right: "#dfded7" },
  peach: { top: "#fbe2d5", left: "#f5cdb9", right: "#eebca3" },
};

export function iso([x, y, z]: P3): [number, number] {
  return [(x - y) * COS, (x + y) * 0.5 - z];
}

function toPoints(points: P3[]): string {
  let out = "";
  for (const p of points) {
    const [sx, sy] = iso(p);
    out += `${sx.toFixed(1)},${sy.toFixed(1)} `;
  }
  return out;
}

export function face(points: P3[], fill: string, extra: Partial<Face> = {}): Face {
  return { points: toPoints(points), fill, ...extra };
}

export function box(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  tone: Tone = "stone",
  opacity?: number,
): Face[] {
  if (w <= 0 || d <= 0 || h <= 0) return [];
  const t = TONES[tone];
  const z2 = z + h;
  const extra = opacity === undefined ? {} : { opacity };
  return [
    face(
      [
        [x, y + d, z],
        [x + w, y + d, z],
        [x + w, y + d, z2],
        [x, y + d, z2],
      ],
      t.left,
      extra,
    ),
    face(
      [
        [x + w, y, z],
        [x + w, y + d, z],
        [x + w, y + d, z2],
        [x + w, y, z2],
      ],
      t.right,
      extra,
    ),
    face(
      [
        [x, y, z2],
        [x + w, y, z2],
        [x + w, y + d, z2],
        [x, y + d, z2],
      ],
      t.top,
      extra,
    ),
  ];
}

export function ring(
  cx: number,
  cy: number,
  z: number,
  r: number,
  from = 0,
  to = Math.PI * 2,
  n = 40,
): P3[] {
  const out: P3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = from + ((to - from) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]);
  }
  return out;
}

/** Vertical cylinder; only the side arc facing the viewer (+x+y) is drawn. */
export function cylinder(
  cx: number,
  cy: number,
  z: number,
  r: number,
  h: number,
  tone: Tone = "stone",
  opacity?: number,
): Face[] {
  const t = TONES[tone];
  const extra = opacity === undefined ? {} : { opacity };
  const bottom = ring(cx, cy, z, r, -Math.PI / 4, (Math.PI * 3) / 4, 20);
  const top = ring(cx, cy, z + h, r, -Math.PI / 4, (Math.PI * 3) / 4, 20).reverse();
  return [face([...bottom, ...top], t.left, extra), face(ring(cx, cy, z + h, r), t.top, extra)];
}

/** Extruded gear rotated by `phase`; side faces sorted back-to-front, then the top. */
export function gear(
  cx: number,
  cy: number,
  z: number,
  rIn: number,
  rOut: number,
  teeth: number,
  h: number,
  phase: number,
): Face[] {
  const outline: [number, number][] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * step;
    const pts: [number, number][] = [
      [a, rIn],
      [a + step * 0.18, rOut],
      [a + step * 0.5, rOut],
      [a + step * 0.68, rIn],
    ];
    for (const [ang, r] of pts) outline.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
  }

  const sides: { depth: number; face: Face }[] = [];
  for (let i = 0; i < outline.length; i++) {
    const [ax, ay] = outline[i]!;
    const [bx, by] = outline[(i + 1) % outline.length]!;
    const nx = by - ay;
    const ny = ax - bx;
    if (nx + ny <= 0) continue;
    sides.push({
      depth: ax + ay + bx + by,
      face: face(
        [
          [ax, ay, z],
          [bx, by, z],
          [bx, by, z + h],
          [ax, ay, z + h],
        ],
        nx > ny ? TONES.stone.right : TONES.stone.left,
      ),
    });
  }
  sides.sort((a, b) => a.depth - b.depth);

  return [
    ...sides.map((s) => s.face),
    face(
      outline.map(([x, y]) => [x, y, z + h] as P3),
      TONES.stone.top,
    ),
    ...cylinder(cx, cy, z + h, rIn * 0.32, 4, "peach"),
  ];
}

/** Circle on the vertical plane x = const (a face pointing +x). */
export function wallCircle(x: number, cy: number, cz: number, r: number, fill: string): Face {
  const pts: P3[] = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    pts.push([x, cy + r * Math.cos(a), cz + r * Math.sin(a)]);
  }
  return face(pts, fill);
}

export function rodEnds(from: P3, length: number): { x1: number; y1: number; x2: number; y2: number } {
  const [x1, y1] = iso(from);
  const [x2, y2] = iso([from[0], from[1] - length, from[2] + length * 0.32]);
  return { x1, y1, x2, y2 };
}

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
export const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
