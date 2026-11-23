---
name: astryx-design
description: Use when styling, spacing, theming, or polishing the visual design of this Vue 3 + Tailwind site (karaganda-workshop), using Meta's Astryx design system as a REFERENCE (not installed — it's React-only). Covers Astryx's token scales (color roles, typography, spacing, radius, motion, elevation) and how to map them onto this project's existing Tailwind `@theme` tokens. Triggers on "Astryx", "дизайн-токены", "типографика", "отступы", "радиусы", "тени", "привести к системе".
---

# Astryx as a design reference for this project

[Astryx](https://astryx.atmeta.com/docs/getting-started) is Meta's design
system. It is **React 19 + StyleX** — incompatible with this **Vue 3 + Tailwind**
site. So we **never install `@astryxdesign/*`** and never import its components.
We use Astryx only as a **reference for design discipline and token scales**, and
translate that into this project's existing Tailwind `@theme` tokens.

## The core rule: borrow the system, keep the brand

- **Adopt Astryx's *scales and discipline*** — its 4px spacing rhythm, radius
  roles, motion durations/eases, type scale, and elevation-by-stacking-order.
- **Do NOT adopt Astryx's neutral gray palette.** This site has its own warm
  brand palette (stone / graphite / peach). Keep it. Astryx's color section is a
  guide to *semantic roles* (what a token is *for*), not the exact hex values to
  paste in.
- When unsure, prefer the site's established look over literal Astryx values.
  Astryx makes the system consistent; it doesn't rebrand the site.

## This project's existing tokens (`src/styles.css` `@theme`)

Map Astryx roles onto these — don't invent parallel tokens.

| Role | Project token |
|---|---|
| Page background | `stone` #f1f0eb |
| Surface / card | `snow` #ffffff / `paper` #f5f5f7 |
| Primary text | `graphite` #111110 / `ink` #1d1d1f |
| Secondary text | `quiet` #6e6e73 / `mist` #a1a1a6 |
| Border / rule | `rule` #dcdbd4 / `line` #d2d2d7 |
| Accent (warm) | `peach` / `peach-strong` / `peach-ink` #9a4a2a |
| Link / info | `blue` #0071e3 |
| Error | `danger` #ff3b30 |
| Font | `--font-sans` Roboto |

## Astryx foundations (reference values)

### Color — semantic roles (map to our palette; don't paste the grays)

Astryx's lesson: **colors are semantic — a token names its *purpose*, not its
look.** Avoid hardcoded hex in components; reach for a role token. Role set worth
mirroring:

- Backgrounds: `background-body`, `-surface`, `-card`, `-muted`, `-inverted`
- Text/icon: `text-primary`, `text-secondary`, `text-disabled`, `text-accent`
- Borders: `border`, `border-emphasized`
- Accent: `accent`, `accent-muted`, `on-accent`
- Status: `info` #0074e2, `success` #198100, `warning` #ffce2f, `error` #c9303a
  (each with a `-muted` and `on-*` pair). Use these only for real status UI
  (form validation, toasts), not decoration — decoration uses the peach brand.

### Typography — type scale

Astryx font-size scale (base 14px × 1.2 geometric). Our body font is Roboto, not
Figtree — keep Roboto; borrow the *scale relationships* and weights.

| Role | Size | Weight | Line-height |
|---|---|---|---|
| Display 1 | 2.625rem | 600 | 1.24 |
| Display 2 | 2.1875rem | 600 | 1.26 |
| Display 3 | 1.8125rem | 600 | 1.24 |
| H1 | 1.5rem | 600 | 1.33 |
| H2 | 1.25rem | 600 | 1.4 |
| H3 | 1.0625rem | 600 | 1.41 |
| Large | 1.0625rem | 600 | 1.41 |
| Body | 0.875rem | 400 | 1.43 |
| Label | 0.875rem | 500 | 1.43 |
| Supporting | 0.75rem | 400 | 1.67 |

Weights: normal 400 · medium 500 · semibold 600 · bold 700. The site already runs
larger hero display sizes for a landing page — that's fine; use this table for
*ratios and weights*, not as a hard cap.

### Spacing — 4px scale

Stay on the 4px rhythm. This maps cleanly to Tailwind's default spacing (Tailwind
`1` = 4px), so prefer Tailwind steps that land on these values and avoid arbitrary
`px`.

`0·2·4·6·8·12·16·20·24·28·32·36·40·44·48` px (= Tailwind `0 0.5 1 1.5 2 3 4 5 6 7 8 9 10 11 12`).

Guidance: small steps (4–8px) for tight internal spacing, larger (16–32px) for
section gaps. Don't mix scale values with random px in the same component.

### Radius — by role

| Astryx token | Value | Use for |
|---|---|---|
| `radius-inner` | 8px | inner nested elements |
| `radius-element` | 12px | buttons, inputs, selectors |
| `radius-container` | 16px | cards, panels, dialogs |
| `radius-page` | 32px | page-level containers only |
| `radius-full` | 9999px | pills, badges, avatar dots |

Pick radius by **what the element is**, not by taste. Buttons/inputs → ~12px;
cards/panels → ~16px; pills → full. The site uses `rounded-full` pills for CTAs —
consistent with `radius-full`. For a nested element inside a padded rounded card,
use `outer radius − padding`.

### Motion — durations & eases (pairs with the `gsap` skill)

| Band | Duration | Use |
|---|---|---|
| fast | 130 / **175** / 230 ms | hover, small state changes, exits |
| medium | 310 / **410** / 550 ms | panels, reveals, dialogs |
| slow | 730 / **975** / 1300 ms | large/hero transitions only |

Easing: `standard` / `entrance` / `move` = `cubic-bezier(0.24, 1, 0.4, 1)`;
`exit` = `cubic-bezier(0.3, 0, 0.6, 0.6)`. Exit is faster than entrance.

Principles: motion aids understanding (reveals, state changes); keep it out of
high-frequency interactions (make those instant); match exit to entrance;
**respect reduced motion** (instant / opacity-only). When animating with GSAP, use
these numbers — e.g. a reveal ≈ 0.41s with an ease close to `power2.out`
(which approximates `0.24,1,0.4,1`). See the `gsap` skill for the Vue wiring.

### Elevation — by stacking order, not strength

Scale: `none | low | med | high`. Choose by **where the surface sits**, use exactly
one level per surface:

- `none`: flat, embedded (default for most surfaces — this site is largely flat).
- `low`: in-flow but distinct from background.
- `med`: floats over nearby content (e.g. the WhatsApp/Claude chat cards).
- `high`: topmost over the whole UI (modal/overlay), often with a backdrop.

Rules: non-overlapping surfaces are `none`/`low` only; don't stack levels; don't
use shadows as decorative borders — use `rule`/`line` border tokens for that.
Inset rings (not outlines) for input focus/validation states.

## How to apply in this project

1. **Translate role → our token.** "Astryx says cards use `background-card` +
   `radius-container`" becomes `bg-snow rounded-2xl` (16px) here.
2. **Stay on the scales.** Spacing on the 4px rhythm, radius by role, motion in
   the duration bands. Flag and remove arbitrary one-off px/ms when polishing.
3. **Keep the brand palette.** Peach/stone/graphite stay; only *structure*
   (roles, consistency) comes from Astryx.
4. **Status colors only for status.** Don't repaint the site in Astryx blue/green.

## Fetch exact values when needed

Token pages (reference, re-fetch if a detail is missing):
`/docs/tokens` (all), `/docs/color`, `/docs/typography`, `/docs/spacing`,
`/docs/shape`, `/docs/motion`, `/docs/elevation` under
`https://astryx.atmeta.com`.

## Verify changes

After design work: `npm run build` must pass; check 390px and 1440px — spacing on
scale, no overflow, contrast holds, and nothing regressed against the existing
warm brand look.
