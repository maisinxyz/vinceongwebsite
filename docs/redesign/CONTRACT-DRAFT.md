# CONTRACT (DRAFT): engineering contract for redesign/v3

Author: `architect`, 2026-11-16. Status: DRAFT until the lead freezes it as `CONTRACT.md`.
Paths are relative to `vince-portfolio/` unless they start with `docs/`. "Must" is binding. Where a choice was made, the reason is one sentence.

---

## 0. Ground truth (checked against the code, not the digest)

- Tailwind 4.3.3, framer-motion 12.43, next 15.5.28, React 19.0.0, three 0.169, TS 5.9. `next-themes` 0.4.6 is installed and never imported. The `motion` package is imported only by `components/ui/parallax-floating.tsx`, which is itself dead.
- `app/globals.css` declares the palette twice: literal hex under `@theme inline` (lines 6-20) and as `:root` vars (25-40). `html.theme-light` (45-79) overrides only the `:root` vars, so utilities never flip. `--sidenav-gutter: 71px` (line 39) is the SSR default on **every** viewport. On phones that means a 71px left pad is painted and then snaps to 0 after hydration, which is a real layout shift today.
- `SideNav` returns null until mount and below 1024px. It sets `--sidenav-gutter` (base + 14) on every route, including routes that have no rail, so `/contact` pads for a rail it never shows.
- Navbar (desktop links at `md`), SideNav (`lg`, 1024) and `useDeviceType` (`<=1024` counts as tablet, so 1024 itself is tablet) disagree. The result is a 768-1023 range with no section navigation.
- `SignatureLogo3D` (three + R3F + GLB) is imported eagerly by `Navbar` on every page, which breaks hard rule 7.
- Dead files that nothing imports: `components/{AppMarquee,BootLoader,CircuitSVG,Divider,ProjectCard,ProjectSquares,SkillsMatrix,Spacer,StatCounter}.tsx`, `components/ui/{infinite-slider,parallax-floating,progressive-blur}.tsx`, `hooks/use-mouse-position-ref.ts`, and in `lib/utils.ts` the exports `PROJECTS`, `EXPERIENCES`, `SKILLS_MATRIX`, `EASING`, `PAGE_TRANSITION`, `REVEAL_ANIMATION`, `stagger`, `Project`, `Experience`. `AppMarquee` is one of the six email sites.
- `.gitignore` has `.env*`, which also ignores `.env.example`. It needs `!.env.example`.
- `ContactPageClient` has no "SAY HI" watermark today (SPEC A describes an older state).
- `body { overflow-x: hidden }` works with `position: sticky` only because the overflow propagates to the viewport. Foundation changes it to `overflow-x: clip`, which is safe for the laptop sticky stage.

---

## 1. Theme tokens

### 1.1 Decisions
- The **CSS variables are semantic** (`--bg`, `--text` …). The **existing utility names stay the class API** (`text-chalk`, `bg-iron/30`, `border-steel/15`). They are re-pointed at the semantic vars, so roughly 400 existing classes flip with no rewrite. New code uses the same legacy utility names for the 7 base colours, plus the new utilities in 1.4. (One vocabulary for classes, and no mass rename.)
- `data-theme="dark" | "light"` lives **only on `<html>`**. Themed subtrees are not allowed.
- `html.theme-light` and its rules are deleted.

### 1.2 Token table (all values final; contrast is in 1.6)

| Semantic var | Legacy alias / utility | Dark | Light | Use |
|---|---|---|---|---|
| `--bg-deep` | `--void` / `*-void` | `#000000` | `#FFFFFF` | deepest band (html bg, hero, `bg-void` sections) |
| `--bg` | `--carbon` / `*-carbon` | `#0D0D0D` | `#FAFAFA` | page (body) |
| `--surface` | `--iron` / `*-iron` | `#1A1A1A` | `#F0F0F0` | cards, pills, inputs |
| `--line` | `--steel` / `*-steel` | `#2E2E2E` | `#D0D0D0` | dividers (decorative only) |
| `--line-strong` | `*-line-strong` | `#707070` | `#858585` | form-control borders, meaningful UI boundaries (3:1) |
| `--muted` | `--silver` / `*-silver` | `#A8A8A8` | **`#555555`** (was `#666666`) | secondary text |
| `--subtle` | `*-subtle` | `#8A8A8A` | `#6B6B6B` | tertiary text (replaces `text-silver/35…60`) |
| `--text` | `--chalk` / `*-chalk` | `#F2F2F0` | `#111111` | primary text |
| `--accent` | `--accent` / `*-accent` | `#3A6B8A` | `#2A5A7A` | fills, active indicators (not body text in dark) |
| `--accent-fg` | `*-accent-fg` | `#7FAACB` | `#2A5A7A` | accent-coloured **text** and links |
| `--on-accent` | `*-on-accent` | `#F2F2F0` | `#FFFFFF` | text on `bg-accent` |
| `--focus` | `*-focus` | `#7FAACB` | `#2A5A7A` | focus ring |
| `--danger` | `*-danger` | `#FF8A80` | `#B3261E` | field errors, error toast |
| `--success` | `*-success` | `#7FC8A0` | `#1E6B45` | success pulse, success toast |
| `--selection-bg` / `--selection-fg` | — | `#A8A8A8` / `#000000` | `#D0D0D0` / `#111111` | `::selection` |
| `--scrim` | `*-scrim` | `rgb(0 0 0 / 0.65)` | `rgb(250 250 250 / 0.80)` | behind text over imagery or animated backgrounds |
| `--nav-bg` | — | `rgb(13 13 13 / 0.92)` | `rgb(250 250 250 / 0.92)` | Navbar scrolled, section bar |
| `--glass-bg` / `--glass-bg-hover` | — | `rgb(255 255 255 / .07)` / `/.14` | `rgb(17 17 17 / .04)` / `/.08` | SideNav tabs |
| `--glass-border` / `--glass-border-hover` | — | `rgb(255 255 255 / .10)` / `/.22` | `rgb(17 17 17 / .10)` / `/.20` | SideNav tabs |
| `--elev-1` | `shadow-elev-1` | `0 0 0 1px rgb(255 255 255 / .04)` | `0 1px 2px rgb(17 17 17 / .06)` | resting card |
| `--elev-2` | `shadow-elev-2` | `0 0 24px rgb(242 242 240 / .06)` (glow) | `0 2px 4px rgb(17 17 17 / .06), 0 8px 24px rgb(17 17 17 / .08)` | popover, hover card |
| `--elev-3` | `shadow-elev-3` | `0 0 48px rgb(242 242 240 / .08)` | `0 4px 8px rgb(17 17 17 / .06), 0 16px 48px rgb(17 17 17 / .12)` | toast, modal |

`theme-color` meta: dark `#0D0D0D`, light `#FAFAFA`.

**Illustration palettes.** Any token read by canvas or Three.js **must be a 6-digit hex**, because `THREE.Color.set` and canvas parsing are not reliable with `color-mix` or `var()`.

| Var | Dark | Light | Notes |
|---|---|---|---|
| `--pcb-board` / `--pcb-board-hi` | `#15592F` / `#1F6B3A` | same | physical object, does not flip |
| `--pcb-trace` | `#2E7D4A` | same | |
| `--pcb-pad` | `#C8A04A` | same | |
| `--pcb-silk` | `#E7F3D8` | same | 7.28:1 on board |
| `--pcb-chip` / `--pcb-chip-text` | `#17191B` / `#C9C9C4` | same | |
| `--pcb-led-off` / `--pcb-led-on` | `#3B2A1E` / `#FF8A2D` | same | |
| `--pcb-shadow` | `#000000` | `#9A9A9A` | drop shadow under board, use at alpha |
| `--device-shell` / `-hi` / `-lo` | `#2A2B2E` / `#3A3B3F` / `#141517` | `#C9CACD` / `#E4E5E7` / `#9C9DA1` | laptop and DAWNTRACE body gradients |
| `--device-bezel` | `#0A0A0B` | `#0A0A0B` | |
| `--device-screen` | `#0B0C0E` | `#F5F5F2` | on-screen UI flips with theme |
| `--device-screen-text` / `-muted` / `-accent` | `#F2F2F0` / `#A8A8A8` / `#7FAACB` | `#111111` / `#555555` / `#2A5A7A` | |
| `--scene-ground` | `#0D0D0D` | `#ECECEA` | R3F floor and background |
| `--scene-ambient` | `#9AA3AD` | `#FFFFFF` | light colour (intensity stays in code) |
| `--scene-key` | `#FFFFFF` | `#FFFFFF` | |
| `--scene-outline` | `#2E2E2E` | `#D0D0D0` | |
| `--scene-accent` | `#7FAACB` | `#2A5A7A` | |
| `--logo-metal` | `#E0E5EC` | `#5A6068` | `SignatureLogo3D` material |

A stream that needs another illustration token defines it **in its own CSS module**: `.root { --x: …; } :global(:root[data-theme="light"]) .root { --x: …; }`. It must not edit `styles/tokens.css`.

### 1.3 Files and exact wiring (foundation)
`app/globals.css` becomes the following, with existing base and utility rules kept below the imports:
```css
@import "tailwindcss";
@import "../styles/tokens.css";
@import "../styles/motion.css";
@import "../styles/layout.css";
```
`styles/tokens.css`:
```css
:root, :root[data-theme="dark"] { color-scheme: dark; --bg-deep:#000000; --bg:#0D0D0D; /* …every dark value in 1.2… */ }
:root[data-theme="light"]       { color-scheme: light; --bg-deep:#FFFFFF; --bg:#FAFAFA; /* …every light value… */ }
:root { /* legacy aliases for CSS modules and inline styles */
  --void:var(--bg-deep); --carbon:var(--bg); --iron:var(--surface); --steel:var(--line);
  --silver:var(--muted); --chalk:var(--text); }
@theme inline {
  --color-void:var(--bg-deep); --color-carbon:var(--bg); --color-iron:var(--surface);
  --color-steel:var(--line); --color-silver:var(--muted); --color-chalk:var(--text);
  --color-accent:var(--accent); --color-accent-fg:var(--accent-fg); --color-on-accent:var(--on-accent);
  --color-subtle:var(--subtle); --color-line-strong:var(--line-strong); --color-focus:var(--focus);
  --color-danger:var(--danger); --color-success:var(--success); --color-scrim:var(--scrim);
  --shadow-elev-1:var(--elev-1); --shadow-elev-2:var(--elev-2); --shadow-elev-3:var(--elev-3);
  /* fonts: keep the three existing --font-* lines */ }
::selection { background: var(--selection-bg); color: var(--selection-fg); }
```
`@theme inline` makes `text-silver/40` compile to `color-mix(in oklab, var(--muted) 40%, transparent)`, which follows the theme. The `--accent` alias line is not needed because the semantic name is the same. Base rules use the semantic vars: `html{background:var(--bg-deep)}`, `body{background:var(--bg);color:var(--text)}`, scrollbars use `--muted`/`--bg`. The print block keeps its forced black. The theme overlay keyframes (`theme-circle-expand`, `.theme-transition-overlay`) are deleted.

### 1.4 Text rules (AA)
- Text opacity modifiers are **not allowed on readable text**. `text-silver/{70-90}` → `text-silver`; `text-silver/{20-60}` and `text-steel/*` → `text-subtle`; `text-chalk/80` → `text-chalk`. The only exception is purely decorative text marked `aria-hidden="true"`. Opacity modifiers on `bg-*`/`border-*` are fine (decorative).
- Accent-coloured text uses `text-accent-fg`, never `text-accent`. In dark, `--accent` on `--bg` is 3.38:1, which fails body text. The fix is the in-family lighter `#7FAACB`.
- Form controls and other meaningful boundaries use `border-line-strong`. `border-steel` is 1.43:1 and is for decoration only.
- Text over imagery or animated backgrounds sits on `bg-scrim` and uses `text-chalk` only, not muted.
- Global focus ring (in `styles/motion.css`): `:where(a,button,input,select,textarea,summary,[role="button"],[role="switch"],[role="tab"],[role="option"],[tabindex]):focus-visible{outline:2px solid var(--focus);outline-offset:2px}`. `outline-none` is allowed only together with a replacement `focus-visible:` style.
- Tailwind palette literals (`text-white`, `bg-black`, `bg-white`, `text-black`) and hex or `rgba()` in TSX are not allowed outside: `styles/tokens.css`, `lib/theme.ts` (`THEME_COLOR`), logo `background` fields in `lib/data/experience.ts`, and files under `public/`.

### 1.5 Head script, meta, next-themes, ThemeTransition
`lib/theme.ts` (foundation) exports, verbatim:
```ts
export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";
export const THEME_COLOR: Record<Theme, string> = { dark: "#0D0D0D", light: "#FAFAFA" };
export const THEME_INIT_SCRIPT =
  `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t="dark";` +
  `var d=document.documentElement;d.setAttribute("data-theme",t);` +
  `var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"#FAFAFA":"#0D0D0D")}catch(e){}})();`;
```
`app/layout.tsx`:
```tsx
<html lang="en" data-theme="dark" suppressHydrationWarning className="h-full antialiased">
  <head>
    <meta name="theme-color" content="#0D0D0D" suppressHydrationWarning />
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
    {/* existing font <link>s */}
  </head>
  <body className="min-h-full flex flex-col bg-carbon text-chalk">
    <Providers><AsciiEasterEgg /><SideNav />{children}</Providers><Analytics />
  </body>
</html>
```
- The meta is placed **before** the script, so the script can find it. `viewport.themeColor` is **not** used, because Next would emit a second meta in an order we don't control. The layout is a server component, so React never client-renders the `<script>` and no React 19 script warning appears. The default is dark, and system preference is ignored, as SPEC H says.
- `next-themes`: **uninstalled** by foundation, because it duplicates the script, uses a class strategy and is unused. `motion`: **uninstalled** (only a dead file uses it).
- `components/ThemeTransition.tsx` becomes a **compat shim** in wave 0, so `app/page.tsx` keeps compiling: `useThemeTransition()` returns `{ isLight, toggleTheme(e) /* calls toggleTheme({origin: centre of e.currentTarget}) */, overlayStyle: null }`, and `ThemeTransitionOverlay` returns `null`. `landing` removes the usages. `qa` deletes the file in wave 3.

### 1.6 Contrast (WCAG 2.x, computed)
Thresholds: body text 4.5, large text and UI 3.0. Every pair below passes.

| Pair | Dark | Light |
|---|---|---|
| text on bg-deep / bg / surface | 18.73 / 17.34 / 15.53 | 18.88 / 18.09 / 16.57 |
| muted on bg-deep / bg / surface | 8.83 / 8.17 / 7.32 | 7.46 / 7.14 / 6.54 |
| muted on line (`bg-steel` chips) | 5.71 | 4.54 |
| subtle on bg-deep / bg / surface | 6.08 / 5.63 / 5.04 | 5.33 / 5.11 / 4.68 |
| accent-fg on bg-deep / bg / surface | 8.51 / 7.88 / 7.06 | 7.39 / 7.08 / 6.48 |
| on-accent on accent | 5.13 | 7.39 |
| accent (UI fill/indicator) on bg / surface | 3.38 / 3.03 | 7.08 / 6.48 |
| focus on bg / surface (UI) | 7.88 / 7.06 | 7.08 / 6.48 |
| line-strong on bg / surface (UI) | 3.92 / 3.51 | 3.54 / 3.24 |
| danger on bg / surface | 8.51 / 7.62 | 6.26 / 5.74 |
| success on bg / surface | 9.88 / 8.84 | 6.20 / 5.68 |
| text on scrim over worst-case image (white / black) | 6.22 | 11.29 |
| pcb-silk on pcb-board | 7.28 | 7.28 |
| device-screen-text / -muted / -accent on device-screen | 17.46 / 8.23 / 7.93 | 17.29 / 6.83 / 6.76 |

**Existing values that fail, and the fix:** dark `accent` as text is 3.38, fixed by `--accent-fg #7FAACB`. `text-silver/{30,40,50,60}` on `bg` come out at 1.75/2.23/2.84/3.59 in dark and 1.51/1.77/2.08/2.47 in light, fixed by `text-subtle`. `silver/70` is exactly 4.50 in dark and 2.97 in light, so it collapses to `text-silver`. SideNav labels `rgba(200,200,200,.45)` become `text-silver`. Light `--muted` moves from `#666` to `#555`. `#666` passes (5.04 on surface), but it would sit only 0.4:1 away from `--subtle`, so the grey hierarchy would vanish. (A third grey level must stay visible in light mode.)

### 1.7 Switching, View Transitions, fallback
`lib/theme.ts` also exports:
```ts
export function getTheme(): Theme;                       // reads html[data-theme]; "dark" when no document
export function setTheme(next: Theme, opts?: { origin?: { x: number; y: number } }): void;
export function toggleTheme(opts?: { origin?: { x: number; y: number } }): void;
export function subscribeTheme(cb: (t: Theme) => void): () => void; // MutationObserver on data-theme + "storage" event (cross-tab, no animation)
export type TokenName = /* union of every var name in 1.2 without the leading "--" */;
export function readToken(name: TokenName): string;     // getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
```
`setTheme` algorithm:
1. `apply = () => { html.dataset.theme = next; localStorage.setItem("theme", next); meta.content = THEME_COLOR[next]; }`, with storage wrapped in try/catch.
2. If there is no `document.startViewTransition`, call `apply()` immediately with no animation. This is the fallback (Firefox < VT support, old Safari).
3. If reduced motion is set, run `document.startViewTransition(async () => { apply(); await nextFrame(); })` with no clip animation. CSS limits `::view-transition-group(root)` to `animation-duration: var(--dur-reduced)` (a 120 ms crossfade).
4. Otherwise: add `html.classList.add("vt-reveal")`, then `const vt = document.startViewTransition(async () => { apply(); await nextFrame(); })`. `nextFrame` is a double rAF, so that subscribed canvases and R3F scenes redraw before the "new" snapshot. Then `vt.ready.then(() => html.animate({ clipPath: [\`circle(0px at ${x}px ${y}px)\`, \`circle(${r}px at ${x}px ${y}px)\`] }, { duration: DUR.theme, easing: EASE_CSS.inOut, pseudoElement: "::view-transition-new(root)" }))`, where `r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))`. `vt.finished.finally(() => html.classList.remove("vt-reveal"))`.
5. CSS: `html.vt-reveal::view-transition-old(root), html.vt-reveal::view-transition-new(root){animation:none;mix-blend-mode:normal}`.

`hooks/useTheme.ts` (foundation):
```ts
export function useTheme(): { theme: Theme; setTheme: typeof setTheme; toggleTheme: typeof toggleTheme };
// useSyncExternalStore(subscribeTheme, getTheme, () => "dark")
export function useThemeTokens<const K extends TokenName>(names: readonly K[]): Readonly<Record<K, string>>;
// re-reads on theme change; returns the SAME object identity until the theme changes (safe in deps arrays)
```
Canvas and R3F usage pattern (binding):
```ts
const tok = useThemeTokens(["scene-ground", "scene-accent"] as const);
const tokRef = useRef(tok); tokRef.current = tok;      // canvas loops read tokRef.current, never getComputedStyle per frame
// R3F: <color attach="background" args={[tok["scene-ground"]]} />; materials: useEffect(() => { mat.color.set(tok["scene-accent"]); }, [tok]);
```
`components/theme/ThemeToggle.tsx` is an `IconButton` with an `IconSwap` Sun/Moon, `label="Switch to light theme" | "Switch to dark theme"`, and origin = button centre. Foundation mounts it in `Navbar` (right side, before the desktop links on `lg+`, before the hamburger below `lg`).

---

## 2. Motion contract

### 2.1 `lib/motion.ts` (foundation), exact exports
```ts
import type { Transition, Variants } from "framer-motion";
export type Bezier = readonly [number, number, number, number];
export const EASE = { out: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1] } as const satisfies Record<string, Bezier>;
export const EASE_CSS = { out: "cubic-bezier(0.22, 1, 0.36, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)" } as const;
export const DUR = {            // milliseconds
  enter: 240, enterSm: 200, enterLg: 300,       // entrances 200–300
  move: 320, moveSm: 250, moveLg: 400,          // moves 250–400
  dropdown: 220, pressIn: 80, pressOut: 160,
  iconSwap: 180, pulse: 450, check: 300, checkDelay: 100,
  release: 300, theme: 400, reduced: 120,
} as const;
export const EXIT_FACTOR = 0.8;
export const exitMs = (enterMs: number): number => Math.round(enterMs * EXIT_FACTOR); // exitMs(220) === 176
export const sec = (ms: number): number => ms / 1000;
export const PRESS_SCALE = 0.97;
export const POPOVER_FROM_SCALE = 0.95;
export const KNOB_STRETCH = 1.12;
export const STAGGER_MS = 40;                     // allowed 30–50; use 40 unless a layout needs 30 or 50
export const ICON_SWAP = { blurPx: 4, fromScale: 0.8, ms: DUR.iconSwap } as const;
export const PULSE = { scale: [1, 1.15, 1], opacity: [0.5, 0], ms: DUR.pulse } as const;
export const RUBBERBAND_K = 0.55;

/** r(x) = (1 − 1/(x·k/limit + 1))·limit, sign-preserving. Never exceeds `limit`. */
export function rubberband(overshoot: number, limit: number, k = RUBBERBAND_K): number;
/** Inside [min,max] returns value; outside returns bound ± rubberband(excess, limit). */
export function rubberbandClamp(value: number, min: number, max: number, limit: number): number;
/** Quadratic-bezier point; control point offset perpendicular to from→to by bend × distance (default 0.25, sign picks side). */
export function arcPoint(from: Pt, to: Pt, t: number, bend?: number): Pt;
/** "M x0 y0 Q cx cy x1 y1" for SVG paths and CSS offset-path. */
export function arcPath(from: Pt, to: Pt, bend?: number): string;
/** transform-origin string in the content box's coordinates, aimed at the trigger centre. Call on open AND on close. */
export function originFromTrigger(trigger: DOMRect, content: DOMRect): string;
/** delay in seconds for settle order: 0 container, 1 icon, 2 label, 3 secondary details. */
export const settleDelay = (step: number, stepMs = STAGGER_MS): number => sec(step * stepMs);
/** While held or dragging, no tween. */
export const heldOr = (held: boolean, t: Transition): Transition => (held ? T.instant : t);
export const knobStretch = (axis: "x" | "y", moving: boolean) =>
  axis === "x" ? { scaleX: moving ? KNOB_STRETCH : 1 } : { scaleY: moving ? KNOB_STRETCH : 1 };

export const T = {                                   // framer-motion transitions
  enter:   { duration: sec(DUR.enter), ease: EASE.out },
  exit:    { duration: sec(exitMs(DUR.enter)), ease: EASE.out },   // 192 ms
  move:    { duration: sec(DUR.move), ease: EASE.inOut },
  dropdownOpen:  { duration: sec(DUR.dropdown), ease: EASE.out },
  dropdownClose: { duration: sec(exitMs(DUR.dropdown)), ease: EASE.out }, // 176 ms
  pressIn:  { duration: sec(DUR.pressIn), ease: EASE.out },
  pressOut: { duration: sec(DUR.pressOut), ease: EASE.out },
  iconIn:  { duration: sec(DUR.iconSwap), ease: EASE.out },
  iconOut: { duration: sec(exitMs(DUR.iconSwap)), ease: EASE.out },
  release: { duration: sec(DUR.release), ease: EASE.out },        // rubberband return
  arc:     { x: { duration: sec(DUR.move), ease: EASE.inOut }, y: { duration: sec(DUR.move), ease: EASE.out } },
  reduced: { duration: sec(DUR.reduced), ease: "linear" },
  instant: { duration: 0 },
} as const satisfies Record<string, Transition | Record<string, Transition>>;

export const V = {                                   // framer-motion variants
  fadeUp: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: T.enter }, exit: { opacity: 0, y: 8, transition: T.exit } },
  popover: { hidden: { opacity: 0, scale: POPOVER_FROM_SCALE }, visible: { opacity: 1, scale: 1, transition: T.dropdownOpen }, exit: { opacity: 0, scale: POPOVER_FROM_SCALE, transition: T.dropdownClose } },
  iconSwap: { hidden: { opacity: 0, scale: ICON_SWAP.fromScale, filter: "blur(4px)" }, visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: T.iconIn }, exit: { opacity: 0, scale: ICON_SWAP.fromScale, filter: "blur(4px)", transition: T.iconOut } },
  settleContainer: { hidden: {}, visible: { transition: { staggerChildren: sec(STAGGER_MS) } } },
  reducedFade: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: T.reduced }, exit: { opacity: 0, transition: T.reduced } },
} as const satisfies Record<string, Variants>;

/** Returns V.reducedFade when the user prefers reduced motion, else V[name]. */
export function useVariants(name: keyof typeof V): Variants;   // wraps framer's useReducedMotion()
```
Exits use ease-out as well, because an ease-in exit starts slowly and makes dismissals feel laggy. **Springs are not allowed**: no `type: "spring"`, `stiffness` or `damping` anywhere. Use `T.*`. This covers "no bounce".

### 2.2 `styles/motion.css` (foundation)
```css
@theme { --ease-out: cubic-bezier(0.22, 1, 0.36, 1); --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); }
/* overrides Tailwind's ease-out / ease-in-out utilities site-wide and emits the vars on :root */
:root {
  --dur-enter:240ms; --dur-exit:192ms; --dur-move:320ms; --dur-dropdown:220ms; --dur-dropdown-exit:176ms;
  --dur-press-in:80ms; --dur-press-out:160ms; --dur-icon:180ms; --dur-pulse:450ms; --dur-release:300ms;
  --dur-theme:400ms; --dur-reduced:120ms; --stagger:40ms;
  --press-scale:.97; --popover-from:.95; --knob-stretch:1.12;
}
@utility press-scale { transition: transform var(--dur-press-out) var(--ease-out);
  &:active:not(:disabled,[aria-disabled="true"]) { transform: scale(var(--press-scale)); transition-duration: var(--dur-press-in); } }
@utility gutter-anim { transition: padding-left var(--dur-move) var(--ease-in-out), margin-left var(--dur-move) var(--ease-in-out), left var(--dur-move) var(--ease-in-out); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: var(--dur-reduced) !important; animation-iteration-count: 1 !important;
    transition-duration: var(--dur-reduced) !important; transition-property: opacity !important; scroll-behavior: auto !important; }
  ::view-transition-group(root) { animation-duration: var(--dur-reduced); }
}
/* + global :focus-visible rule from 1.4 */
```
Use CSS durations through `duration-(--dur-enter)` and `ease-out` / `ease-in-out`. `lib/motion.test.ts` parses `styles/motion.css` and asserts every `--dur-*` equals its `DUR`/`exitMs` constant, so the two cannot drift.

**Reduced motion (global):** `components/Providers.tsx` wraps the app in `<MotionConfig reducedMotion="user">` (framer drops transform and layout animation and keeps opacity). Every primitive uses `useVariants`. The CSS block above collapses CSS motion to a 120 ms opacity transition. Scroll-scrubbed scenes (laptop, PCB hold-cycle, R3F auto-rotate) render their **final static state** under reduced motion (see 9, Q5).

### 2.3 SPEC B row → contract name

| SPEC B rule | Use exactly |
|---|---|
| Ease-out entrances 200–300 | `T.enter` / `V.fadeUp` / CSS `ease-out duration-(--dur-enter)` |
| Ease-in-out moves 250–400 | `T.move` / CSS `ease-in-out duration-(--dur-move)` |
| Dropdown open 220 | `T.dropdownOpen`, `V.popover` |
| Exit = 0.8 × enter | `exitMs()`, `T.exit`, `T.dropdownClose` (176), `T.iconOut` (144) |
| Press 0.97, 80 in / 160 out | `press-scale` utility (CSS `:active`); framer: `whileTap={{scale: PRESS_SCALE}}` with `T.pressIn`/`T.pressOut` |
| Don't tween while held | `heldOr(isHeld, T.move)`; drag values set via `useMotionValue().set()` directly |
| Knob stretch 12% | `knobStretch(axis, moving)`, `KNOB_STRETCH` |
| Stagger 30–50 | `STAGGER_MS`, `settleDelay(step)`, `V.settleContainer` |
| Arcs | `T.arc` (split x/y easing) for framer; `arcPath()` for SVG/`offset-path`; `arcPoint()` for canvas |
| Pulse to confirm | `<SuccessMark>` (2.4), `PULSE`, check via `clip-path: inset(0 100% 0 0 → 0)` over `DUR.check` after `DUR.checkDelay` |
| Popovers from 0.95 | `V.popover`, `POPOVER_FROM_SCALE` |
| Enter from / exit to trigger | `originFromTrigger()` set as `style.transformOrigin` on open and recomputed before close |
| No bounce | `T.*` only; springs not allowed |
| Overlap old/new | `<AnimatePresence mode="sync">` (never `"wait"`); both states absolutely stacked |
| Masks for reveals | `clip-path` / `mask-image` only (theme reveal 1.7, check draw, label swap in Button) |
| Icon crossfade + blur | `<IconSwap>` / `V.iconSwap` |
| Rubberband | `rubberband()`, `rubberbandClamp()`, release with `T.release` |
| Reduced motion | `useVariants`, `MotionConfig reducedMotion="user"`, CSS block in 2.2 |

### 2.4 Primitives: `components/primitives/` (foundation), barrel `index.ts`
All primitives are client components. They take `ref` as a prop (React 19), merge `className` via `cn()`, use `press-scale`, rely on the global focus ring, and honour `useVariants`.

```ts
// Button.tsx
type ButtonBase = { variant?: "outline" | "solid" | "ghost" | "link"; size?: "sm" | "md" | "lg"; shape?: "pill" | "rect";
  leadingIcon?: React.ReactNode; trailingIcon?: React.ReactNode; loading?: boolean; success?: boolean; children: React.ReactNode; className?: string };
export type ButtonProps =
  | (ButtonBase & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined })
  | (ButtonBase & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string; external?: boolean }); // internal → next/link
// defaults: outline, md, pill. outline = border-line-strong text-chalk hover:bg-iron; solid = bg-accent text-on-accent.
// loading: label clip-path-swapped to spinner, aria-busy. success: renders <SuccessMark active> in place of the label for 1200 ms.

// IconButton.tsx
export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;                // required → aria-label (and title)
  icon: React.ReactNode; swapIcon?: React.ReactNode; swapped?: boolean;   // swap via <IconSwap>
  size?: "sm" | "md" | "lg"; variant?: "ghost" | "outline"; href?: string };  // min hit area 44×44 at md+

// Toggle.tsx  (role="switch")
export type ToggleProps = { checked: boolean; onCheckedChange: (next: boolean) => void; label: string; hideLabel?: boolean;
  size?: "sm" | "md"; disabled?: boolean; id?: string; className?: string };
// Knob is draggable: pointer x bound directly (heldOr), rubberbandClamp(limit 6px) past the ends, knobStretch("x", moving),
// release → snap with T.move. Click/Space/Enter toggles.

// Select.tsx  (button + listbox, built on Popover)
export type SelectOption<V extends string> = { value: V; label: string; description?: string; disabled?: boolean };
export type SelectProps<V extends string> = { value: V | null; onValueChange: (v: V) => void; options: readonly SelectOption<V>[];
  label: string; hideLabel?: boolean; placeholder?: string; name?: string /* renders <input type="hidden"> */;
  invalid?: boolean; describedBy?: string; disabled?: boolean; id?: string; className?: string };
// Keys: ↑/↓, Home/End, typeahead, Enter/Space select, Esc close + return focus. aria-activedescendant.

// Popover.tsx  (portal to document.body; positions itself; flips and clamps to viewport minus gutter and bars)
export type PopoverProps = { open: boolean; onOpenChange: (open: boolean) => void; anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode; side?: "bottom" | "top" | "left" | "right"; align?: "start" | "center" | "end"; offset?: number /*8*/;
  role?: "dialog" | "listbox" | "menu"; ariaLabel?: string; ariaLabelledBy?: string; closeOnOutside?: boolean /*true*/;
  initialFocusRef?: React.RefObject<HTMLElement | null>; className?: string };
// V.popover + originFromTrigger on open and close. Esc closes. Focus returns to anchor.

// Tabs.tsx
export type TabItem<V extends string> = { value: V; label: string; icon?: React.ReactNode; disabled?: boolean };
export type TabsProps<V extends string> = { value: V; onValueChange: (v: V) => void; items: readonly TabItem<V>[];
  ariaLabel: string; idBase: string; className?: string };
export function TabPanel<V extends string>(p: { idBase: string; value: V; current: V; children: React.ReactNode }): React.JSX.Element;
// Indicator: framer layoutId with T.move. Panels crossfade (mode="sync"). Roving tabindex, ←/→/Home/End, automatic activation.

// Toast.tsx
export function ToastProvider(p: { children: React.ReactNode }): React.JSX.Element;   // mounted once in Providers
export function useToast(): { show(t: { title: string; description?: string; tone?: "neutral" | "success" | "error"; durationMs?: number /*4000*/ }): string; dismiss(id: string): void };
// Region fixed bottom-[calc(var(--nav-bar-bottom)+1rem)] right-4; aria-live="polite" (error toasts role="alert"). Enter V.fadeUp, exit T.exit.

// IconSwap.tsx
export function IconSwap(p: { swapped: boolean; a: React.ReactNode; b: React.ReactNode; className?: string }): React.JSX.Element;
// SuccessMark.tsx
export function SuccessMark(p: { active: boolean; size?: number /*20*/; onDone?: () => void; className?: string }): React.JSX.Element;
```
`components/Providers.tsx` = `<MotionConfig reducedMotion="user"><ToastProvider>{children}</ToastProvider></MotionConfig>`.
`components/RevealOnScroll.tsx` (foundation) becomes a real reveal: same props (`children`, `delay?`, `className?`), `V.fadeUp` with `whileInView`, `viewport={{ once: true, margin: "-10% 0px" }}`.
Sandbox: `app/dev/motion/page.tsx` (server; `if (process.env.NODE_ENV === "production") notFound();`) plus `MotionSandbox.tsx`, with one labelled demo per row of 2.3.

### 2.5 Migration of raw buttons
Each stream migrates the raw `<button>`s and click targets **in the files it owns**, in its own wave. The rule: every `<button>` is a primitive or carries `press-scale` plus a token-coloured style; `onClick` on a non-interactive element is not allowed (use `<button>` or `role="button" tabIndex={0}` with key handling).
- foundation: Navbar hamburger → `IconButton`; footer scroll-to-top → `IconButton`.
- landing: home theme/tour pills (theme pill calls `toggleTheme`, or is removed now that the Navbar has the toggle), `PlayingCards` card div.
- theme-audit-1: about vinyl controls, `WorkingOnStack` dots and stack.
- theme-audit-2: `ViewToggle` → `Tabs`, portfolio download, zoom exits, resume PDF overlays.
- spice3d: `SpiceDispenser2D` controls (or delete the file). dice: PCB SVG text targets.

---

## 3. Nav gutter contract

### 3.1 Decisions
- **One breakpoint: 1024px (`lg`).** At ≥1024 there is the side rail plus the Navbar desktop links. Below 1024 there is the Navbar hamburger on every route, plus a bottom **section bar** on rail routes. Foundation moves Navbar's `md:` switches to `lg:`. Landing changes `useDeviceType` to `width < 1024 → tablet`.
- **Rail routes:** `/`, `/about`, `/projects`, `/projects/*`, `/experience`, `/education`. Not on `/resume`, `/contact`, `/card`, `/portfolio-view`, `/dev/*`. Project detail pages get the rail because they live under PROJECTS and are built on a shared shell.
- **Hover-grow is reserved, not pushed.** The gutter always equals base + 14, so a hovered tab grows into reserved space and content never moves on hover. Pushing content on every tab hover would be a layout shift. "Tracks hover-grow" is met because the reservation is defined from the hover width.
- **Shrink-on-scroll is tracked** (home only: 71 → 44 at `scrollY > 100`), animated with `gutter-anim`.
- **No JS on the first-paint path.** SideNav is SSR-rendered (no `mounted` gate, CSS `hidden lg:flex`), exposes `id="side-rail" data-rail="wide|narrow"`, and the variable is derived in CSS with `:has()`. `usePathname()` works during SSR, so the rail exists in the server HTML exactly when it should.
- `--sidenav-gutter` is **renamed** to `--nav-gutter`. Foundation keeps the alias `--sidenav-gutter: var(--nav-gutter)` so the 5 inline consumers keep working. Owners replace them during their waves, and `qa` deletes the alias once `rg sidenav-gutter` finds nothing.

### 3.2 Values

| Viewport | Route | State | Rail tab width (hover) | `--nav-gutter` | `--nav-bar-bottom` |
|---|---|---|---|---|---|
| ≥1024 | `/` | `scrollY ≤ 100` (`data-rail="wide"`) | 57 (71) | **71px** | 0 |
| ≥1024 | rail route | otherwise (`"narrow"`) | 30 (44) | **44px** | 0 |
| ≥1024 | non-rail | no rail | — | 0 | 0 |
| <1024 | rail route | section bar | — | 0 | **calc(3.5rem + env(safe-area-inset-bottom))** |
| <1024 | non-rail | — | — | 0 | 0 |

`--nav-top` (Navbar height) is `4rem` below 640px and `5rem` at ≥640.

`styles/layout.css` (foundation):
```css
:root { --nav-gutter: 0px; --nav-bar-bottom: 0px; --nav-top: 4rem; --sidenav-gutter: var(--nav-gutter); }
@media (min-width: 40rem) { :root { --nav-top: 5rem; } }
@media (min-width: 64rem) {
  :root:has(#side-rail[data-rail="wide"])   { --nav-gutter: 71px; }
  :root:has(#side-rail[data-rail="narrow"]) { --nav-gutter: 44px; }
}
@media (max-width: 63.999rem) { :root:has(#section-bar) { --nav-bar-bottom: calc(3.5rem + env(safe-area-inset-bottom)); } }
@theme inline { --spacing-gutter: var(--nav-gutter); --spacing-navbar: var(--nav-bar-bottom); --spacing-nav-top: var(--nav-top); }
body { padding-bottom: var(--nav-bar-bottom); }
@utility fixed-center-x { left: calc(var(--nav-gutter) + (100vw - var(--nav-gutter)) / 2); translate: -50% 0; }
```
The spacing keys generate `pl-gutter`, `ml-gutter`, `-ml-gutter`, `left-gutter`, `-left-gutter`, `pt-nav-top`, `bottom-navbar`, `pb-navbar` and so on. `lib/site.ts` exports `RAIL = { wide: 57, narrow: 30, hoverGrow: 14, scrollThreshold: 100, breakpoint: 1024 } as const`. `lib/data/data.test.ts` asserts that `layout.css` contains `71px` = wide + hoverGrow and `44px` = narrow + hoverGrow.

First paint: the SSR HTML contains `#side-rail[data-rail="wide"]` on `/` (and `"narrow"` elsewhere), so the CSS resolves the gutter before any JS runs. The one remaining shift is a reload with browser scroll restoration mid-page on `/` (wide → narrow after hydration). It is accepted and listed in 9.

### 3.3 Components (foundation)
- `components/SideNav.tsx`: renders on rail routes only (`isRailRoute(usePathname())` from `lib/site.ts`). The output is `<nav id="side-rail" data-rail={…} aria-label="Sections" className="hidden lg:flex fixed left-0 top-0 h-dvh z-[60] flex-col">`. Glass styles come from the `--glass-*` tokens through a co-located `SideNav.module.css`. Labels use `text-silver` and `hover:text-chalk`. Active tab gets `aria-current="page"`.
- `components/nav/SectionBar.tsx`: rail routes, `<nav id="section-bar" aria-label="Sections" className="lg:hidden fixed inset-x-0 bottom-0 z-[60] h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[var(--nav-bg)] backdrop-blur border-t border-steel">`, with 4 equal links (ABOUT, PROJECTS, EXPERIENCE, EDUCATION). Rendered by `SideNav` so there is a single mount point.
- `components/layout/PageShell.tsx`:
```ts
export type PageShellProps = { children: React.ReactNode; footer?: boolean /*true*/; cursor?: boolean /*true*/;
  top?: "nav" | "none" /*"nav" → pt-nav-top; "none" for heroes under the bar*/; className?: string /* on <main> */ };
// renders: {cursor && <CustomCursor/>}<Navbar/><main id="main" className={cn("relative flex-1 pl-gutter gutter-anim", top==="nav" && "pt-nav-top", className)}>{children}</main>{footer && <Footer/>}
```
- `components/ui/footer.tsx` applies `pl-gutter gutter-anim` itself. Navbar's inner container gets `pl-gutter` (its background bar stays full width and is exempt).

### 3.4 Rules every page must follow
1. A page renders `<PageShell>` and does **not** import `Navbar`, `Footer` or `CustomCursor` directly.
2. Everything inside `<main>` already starts at the gutter. Page titles, sections and full-bleed sections need nothing extra. Do not add `pl-gutter` twice.
3. A decorative background that must reach x=0 (home waves, laptop stage backdrop) goes in `<div aria-hidden data-gutter-exempt className="absolute inset-y-0 -left-gutter right-0 pointer-events-none">`.
4. `position: fixed/absolute` elements positioned against the viewport use `left-gutter` (never `left-0`), `fixed-center-x` for centring, and `bottom-navbar` (or `bottom-[calc(var(--nav-bar-bottom)+1rem)]`) for bottom anchoring. Negative-offset decorations (for example the education year labels at `left-[-100px]`) are not allowed unless they are `data-gutter-exempt` and `aria-hidden`.
5. Full-screen modal overlays (mobile menu, lightbox) cover everything and are exempt. They must sit at `z-[70]` or higher so they cover the rail.

### 3.5 Test (`e2e/gutter.spec.ts`, gutter stream)
For each route in `e2e/routes.ts` × viewports `[360, 768, 1280, 1920]` × theme dark:
- **≥1024 on rail routes:** read `#side-rail`'s rect R, hover each tab and take R.right as the max. Assert `R.right <= gutter` (computed `--nav-gutter`). For every element in `main, footer, body > [style*="fixed"], [class*="fixed"], [class*="absolute"]` that is visible, has non-zero size, is not inside `#side-rail` or `[data-gutter-exempt]`, and is not `aria-hidden`, assert `rect.left >= R.right` or no vertical overlap. Repeat at `scrollY = 0` and after scrolling 400px on `/`.
- **<1024 on rail routes:** read `#section-bar` rect B. Scroll to the bottom and assert the footer's bottom `<= B.top`. Assert no fixed or absolute element (other than exempt ones) intersects B.
- **No rail and no bar on non-rail routes.**

---

## 4. Shared data

### 4.1 Modules
| Module | Exports | Owner after wave 0 |
|---|---|---|
| `lib/site.ts` | `SITE = { name: "Vince Ong", url: "https://vinceong.dev", location: "Vancouver, BC, Canada", github: { url: "https://github.com/maisinxyz", handle: "maisinxyz" }, linkedin: { url: "https://www.linkedin.com/in/vince-ong-9a96a3371/", label: "Vince Ong" }, resumePdf: "/resume.pdf" } as const`; `SECTION_LINKS`, `UTILITY_LINKS` (Navbar), `RAIL_ROUTES`, `isRailRoute(path)`, `RAIL`, `BREAKPOINT = { sm: 640, lg: 1024 }` | foundation |
| `lib/data/projects/types.ts` | types below | foundation |
| `lib/data/projects/<slug>.ts` ×9 | `export const project: Project` | the slug's stream (table in 7) |
| `lib/data/projects/index.ts` | `PROJECTS` (fixed display order), `HARDWARE`, `SOFTWARE`, `getProject(slug)`, `projectHref(slug)`, `DETAIL_SLUGS` | foundation |
| `lib/data/experience.ts` | `Experience`, `ExperienceId`, `experiences` (moved from `app/experience/data.ts`; that file becomes `export * from "@/lib/data/experience"`) | landing |
| `lib/data/education.ts` | `Program`, `Course`, `Recognition`, `PROGRAMS`, `COURSES`, `RECOGNITIONS` | edu-content |

Foundation seeds every entry using **only** facts in RECON/BOARD/SPEC, with `todo: ["TODO(vince): …"]` for gaps. Per-slug files exist so that six streams can edit project copy without touching one file.

```ts
// lib/data/projects/types.ts
export type ProjectSlug = "dawntrace" | "spice" | "dice" | "racerbot" | "yolox-sorting" | "shape-sorting"
                        | "engram" | "stardew-earth" | "cyberbug";
export type ProjectCategory = "hardware" | "software";
export type ProjectStatus = "COMPLETED" | "ACTIVE" | "IN PROGRESS";
export type CourseCode = "MSE 112" | "ENSC 151" | "ENSC 100" | "MSE 281" | "MSE 250" | "ENSC 120";
export interface ProjectLink { kind: "github" | "live" | "video" | "external"; label: string; href: string }
export interface ProjectMedia { kind: "video" | "image" | "component" | "placeholder"; src?: string; poster?: string; alt: string }
export interface Project {
  slug: ProjectSlug; title: string; subtitle?: string; category: ProjectCategory; status: ProjectStatus;
  year: string; dateRange?: string; course?: CourseCode;
  summary: string;            // list card, one line, ≤ 90 chars
  description: string[];      // detail page paragraphs
  tags: string[];             // list shows first 3
  media: ProjectMedia;        // "component" only for dice (renders <DigitalDicePCB compact/>)
  detail: boolean;            // true ⇔ app/projects/<slug>/page.tsx exists (data.test.ts asserts)
  links: ProjectLink[];
  relatedExperience?: ExperienceId[];
  unverified?: string[];      // shown as a "Reconstruction — unverified" note by ProjectShell
  todo?: string[];            // TODO(vince) items, rendered only in development
}
// lib/data/experience.ts: keep every current field so ExperiencePageClient compiles unchanged, and add:
export type ExperienceId = "ey" | "resilient-privacy" | "sfu-racerbot" | "telus-digital-ai" | "mech";
//   id: ExperienceId; impact?: string /* one line for landing cards */; tech?: string[];
//   relatedProjects?: ProjectSlug[]; logoDark?: string /* /logos/*-dark.* when needed */
// lib/data/education.ts
export interface Program { id: "sfu" | "ib"; institution: string; credential: string; field?: string; start: string; end: string; expected?: string; logo: string }
export interface Course { code: CourseCode; title?: string /* only if in repo */; topics: string[]; relatedProjects?: ProjectSlug[] }
export interface Recognition { name: string; date: string; logo?: string /* local file or omit → monogram */ }
```
`lib/data/data.test.ts` (foundation) checks: unique slugs; `detail` matches the filesystem; every `relatedProjects`/`relatedExperience` id resolves; no file under `app/ components/ lib/` matches `/[A-Za-z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|sfu)\./`.

### 4.2 Email (hard rule 4)
**Decision:** the address lives only in env vars. `app/contact/page.tsx` (a server component) reads `process.env.CONTACT_PUBLIC_EMAIL` and passes it as a prop, `<ContactPageClient publicEmail={… ?? null} />`. The client shows the Email row as a `mailto:` link when it is set, and as "Use the form below" (anchor `#contact-form`) when it is null. The error-state `mailto:` fallback uses the same prop and is hidden when the prop is null. Every other email site (footer, `/card`, home, `DynamicPortfolio`) links to `/contact`. `AppMarquee` is deleted.
`CONTACT_PUBLIC_EMAIL` is separate from `CONTACT_TO_EMAIL`, so Vince can publish an alias and keep the delivery inbox private.
**Trade-off:** the address is not in the repo or any JS bundle, but it is in the server-rendered HTML of `/contact`, so scrapers can still read it. The alternative is to show nothing and reveal it only on error from an API, which removes the visible Email row SPEC A asks for.

---

## 5. Project route structure
- **Count:** the brief's list has **nine** names, not eight. There are 9 projects and **8 detail pages**: dawntrace, spice, dice, racerbot, yolox-sorting, shape-sorting, engram, stardew-earth. **Cyberbug is list-only** (`detail: false`, GitHub link). SPEC E gives it no interactive screen, so a page would be a shell around nothing. This matches the BOARD (5 existing projects + Racerbot, YOLOX, shape sorting, Stardew Earth).
- **Static folders, no `[slug]` route.** Each page has a different heavy lazy-loaded screen. Static folders give per-route code splitting and one folder per stream.
- Each detail route:
```
app/projects/<slug>/page.tsx            // server: export const metadata from getProject("<slug>"); renders <XPageClient/>
app/projects/<slug>/<X>PageClient.tsx   // "use client": <ProjectShell slug="<slug>" screen={<Screen/>}>{optional extra sections}</ProjectShell>
app/projects/<slug>/_screen/*           // the unique interactive screen; heavy parts via next/dynamic({ ssr: false, loading: <ScreenSkeleton/> })
public/projects/<slug>/*                // local media (card image or SVG, poster)
```
- `components/projects/ProjectShell.tsx` (foundation):
```ts
export type ProjectShellProps = { slug: ProjectSlug; screen: React.ReactNode; screenLabel?: string /* aria-label, default "<title> interactive demo" */;
  screenAspect?: string /* CSS aspect-ratio reserved before the screen loads, default "16 / 10" */; children?: React.ReactNode };
// PageShell > header (title, subtitle, status, dateRange, course, tags, links as Buttons) > <section aria-label> reserving aspect (no CLS)
// > description paragraphs > unverified note > children > prev/next among DETAIL_SLUGS.
```
- Screens must differ visually and behaviourally (SPEC E). Shared things come from primitives and tokens only, never from another stream's screen.
- `DigitalDicePCB` keeps its path and export name (`components/DigitalDicePCB.tsx`, `export function DigitalDicePCB(p: { compact?: boolean })`). The `dice` stream may re-export from `components/dice/`, so the projects list (landing) never changes its import.

---

## 6. Tooling (foundation does all installs in wave 0; afterwards only the lead edits `package.json` or the lockfile)
- `npm uninstall next-themes motion`
- `npm install zod resend`
- `npm install -D vitest @playwright/test @axe-core/playwright tsx`, then `npx playwright install chromium`
- scripts:
```json
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"check:dice": "tsx scripts/check-dice-layout.ts",
"prebuild": "npm run check:dice",
"verify": "npm run lint && npm run typecheck && npm run test && npm run build"
```
- `vitest.config.ts`: `{ test: { include: ["**/*.test.{ts,tsx}"], exclude: ["node_modules/**", ".next/**", "e2e/**"], environment: "node" }, resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } } }`. Unit tests sit **next to the source** (`lib/motion.test.ts`, `lib/contact/schema.test.ts`, `app/api/contact/route.test.ts`, `components/dice/logic.test.ts`).
- `playwright.config.ts`: `testDir: "e2e"`, Chromium only, `webServer: { command: "npm run start -- -p 3100", url: "http://localhost:3100", reuseExistingServer: true }`, which requires a prior `npm run build`. `e2e/routes.ts` (foundation) exports `ROUTES` (the 15 public routes: `/`, `/about`, `/projects`, the 8 detail pages, `/experience`, `/education`, `/resume`, `/contact`, `/card`, `/portfolio-view`) and `VIEWPORTS = [360, 768, 1280, 1920]`.
- Dice check: `scripts/check-dice-layout.ts` imports the component table from `components/dice/layout.ts` and exits 1 on any overlap of bounding boxes (body ∪ label ∪ trace segments, inflated by 1 viewBox unit). Wave 0 ships a **stub** that prints `dice layout: not yet defined` and exits 0. Ownership then passes to `dice`. `prebuild` runs it on every `npm run build`, including on Vercel.
- Merge gate (hard rule 8): `npm run verify` must be green on the merge result. Streams that own e2e specs also run theirs.

---

## 7. File-ownership map
One owner per file per wave. "→ X" means ownership transfers to X after the current owner's merge. Anything not listed is owned by **nobody**: raise it on the BOARD and the lead assigns it. **Never edit someone else's file.** Post `NEEDS: <owner>` on the BOARD. After the owner's stream has merged, the lead makes small hot-file edits directly on `redesign/v3` between merges.

| Stream | Owns (C = create, M = modify, D = delete) |
|---|---|
| **foundation** (wave 0) | M `app/globals.css`, `app/layout.tsx`, `lib/utils.ts` (keep `cn`, `formatDate`; drop dead exports), `components/SideNav.tsx`, `components/Navbar.tsx` (lazy `SignatureLogo3D` via `next/dynamic` ssr:false with a fixed-size placeholder; ThemeToggle; `lg` breakpoint; tokens), `components/ui/footer.tsx` (gutter; email → `/contact`; remove `/privacy` `/terms` links), `components/SignatureLogo3D.tsx` (`--logo-metal` via `useThemeTokens`), `components/RevealOnScroll.tsx`, `components/ThemeTransition.tsx` (shim), `app/experience/data.ts` (re-export) → theme-audit-1 · C `styles/{tokens,motion,layout}.css`, `components/SideNav.module.css`, `lib/theme.ts`, `lib/theme.test.ts`, `hooks/useTheme.ts`, `lib/motion.ts`, `lib/motion.test.ts`, `components/Providers.tsx`, `components/theme/ThemeToggle.tsx`, `components/primitives/{Button,IconButton,Toggle,Select,Popover,Tabs,Toast,IconSwap,SuccessMark,index}.tsx`, `app/dev/motion/{page,MotionSandbox}.tsx`, `components/nav/SectionBar.tsx`, `components/layout/PageShell.tsx`, `components/projects/ProjectShell.tsx`, `lib/site.ts`, `lib/data/projects/{types,index}.ts`, `lib/data/data.test.ts`, `vitest.config.ts`, `playwright.config.ts`, `e2e/routes.ts`, `package.json`, `package-lock.json` · seeds then transfers: `lib/data/projects/<slug>.ts` ×9 → slug owner, `lib/data/experience.ts` → landing, `lib/data/education.ts` → edu-content, `components/education/types.ts` (`export type LaptopStep = { id: string; title: string; render: (p: { active: boolean }) => React.ReactNode }`) → laptop, `components/education/screens/index.tsx` (`export const EDUCATION_SCREENS: LaptopStep[]` built from current data) → edu-content, `scripts/check-dice-layout.ts` (stub) → dice · D the dead files listed in section 0 (re-grep before deleting) |
| **contact** | C/M `app/contact/**` (page passes `publicEmail`), `app/api/contact/route.ts`, `app/api/contact/route.test.ts`, `lib/contact/{schema,schema.test,rate-limit,send}.ts`, `e2e/contact.spec.ts`, `.env.example` (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `CONTACT_PUBLIC_EMAIL`), `.gitignore` (`!.env.example`), `README.md` |
| **laptop** | M `app/education/EducationPageClient.tsx` (also fixes the year-label overlap), `components/education/types.ts` · C `components/education/{Laptop,LaptopScroll}.tsx`, `components/education/laptop.module.css`, `hooks/useScrollProgress.ts` · D `components/LaptopScrollReveal.tsx` |
| **edu-content** | `lib/data/education.ts` (adds the 6 courses with exactly SPEC C topics, course→project links, local or monogram recognition logos), `components/education/screens/**` (program header, recognitions, course cards rendered inside the screen), `app/education/page.tsx` (drop "3.7 GPA" from metadata) |
| **gutter** (wave 1, merges last) | M `app/about/AboutPageClient.tsx`, `app/experience/ExperiencePageClient.tsx`, `app/experience/experience.module.css`, `app/resume/ResumePageClient.tsx`, `app/card/CardPageClient.tsx`, `app/portfolio-view/PortfolioPageClient.tsx` (adopt PageShell or gutter utilities only; no theme work) → theme-audits · C `e2e/gutter.spec.ts`. Audits every other route and files findings to owners via the BOARD |
| **dice** | `app/projects/dice/**`, `components/DigitalDicePCB.tsx`, `components/dice/**` (`layout.ts`, `logic.ts`, `logic.test.ts`, `DiceBoard.tsx`), `scripts/check-dice-layout.ts`, `lib/data/projects/dice.ts`, `public/projects/dice/**` |
| **spice3d** | `app/projects/spice/**`, `components/spice3d/**`, `components/SpiceDispenser2D.tsx` (keep as no-WebGL fallback or delete), `lib/data/projects/spice.ts`, `public/projects/spice/**` |
| **proj-dawntrace** | `app/projects/dawntrace/**`, `lib/data/projects/dawntrace.ts`, `public/projects/dawntrace/**` |
| **proj-racerbot** | `app/projects/racerbot/**`, `lib/data/projects/racerbot.ts`, `public/projects/racerbot/**` |
| **proj-mse112** | `app/projects/yolox-sorting/**`, `app/projects/shape-sorting/**`, `lib/data/projects/{yolox-sorting,shape-sorting}.ts`, `public/projects/{yolox-sorting,shape-sorting}/**` |
| **proj-engram** | `app/projects/engram/**`, `lib/data/projects/engram.ts`, `public/projects/engram/**` |
| **proj-stardew** | `app/projects/stardew-earth/**`, `lib/data/projects/{stardew-earth,cyberbug}.ts`, `public/projects/{stardew-earth,cyberbug}/**` (no cyberbug page) |
| **landing** | `app/page.tsx`, `app/projects/ProjectsPageClient.tsx`, `app/projects/page.tsx`, `components/cards/{ProjectCard,ExperienceCard}.tsx` (C), `components/PlayingCards.tsx`, `components/ui/{ParticleBackground,Waves}.tsx`, `components/LogosSlider.tsx`, `components/AutoTour.tsx`, `hooks/useDeviceType.ts`, `lib/data/experience.ts` |
| **theme-audit-1** (wave 2) | `app/about/**`, `components/WorkingOnStack.tsx` (DAWNTRACE text from `getProject("dawntrace")`), `app/experience/**` (incl. `data.ts`), `components/CustomCursor.tsx`, `components/AsciiEasterEgg.tsx` |
| **theme-audit-2** (wave 2) | `app/resume/**`, `app/card/**`, `app/portfolio-view/**` (incl. `DynamicPortfolio`, `StaticPortfolio`), `components/ViewToggle.tsx` |
| **qa** (wave 3) | C `e2e/theme.spec.ts` (both themes × 3 viewports screenshots, reload persistence), `e2e/a11y.spec.ts` (axe `color-contrast`, `button-name`, `link-name` on every route × theme) · in wave 3 **all foundation-owned files transfer to qa** for cleanup: D `components/ThemeTransition.tsx`, remove the `--sidenav-gutter` alias, delete `app/experience/data.ts` if unused |
| **lead** only | `public/logos/**`, `docs/redesign/CONTRACT.md`, merges, any post-merge hot-file edit |

Hot files: `globals.css`/`styles/*`, `layout.tsx`, `Navbar.tsx`, `footer.tsx` and `package.json` are foundation's (then the lead's, then qa's in wave 3). `ProjectsPageClient.tsx` is landing's, and it reads data only, so other streams reach it through their `lib/data/projects/<slug>.ts`. Per-stream CSS goes in **co-located CSS modules**; there are no stream files in `styles/`.

---

## 8. Merge order

| Wave | Streams (parallel worktrees, all branched from `redesign/v3` **after** wave 0 merges) | Merge order inside the wave, and why |
|---|---|---|
| 0 | foundation (alone) | Every stream imports tokens, motion, primitives, PageShell, ProjectShell and data types. Stubs and seeds make every later import resolve on day one. |
| 1 | contact, dice, spice3d, proj-dawntrace, proj-racerbot, proj-mse112, proj-engram, proj-stardew, edu-content, laptop, landing, gutter | 1. **contact** (self-contained; proves the test tooling early). 2. **dice** (replaces the prebuild stub; any later build depends on it passing). 3. **edu-content**, then 4. **laptop** (laptop renders edu's screens, so it rebases onto real content and checks fit and overflow). 5. **proj-\*** and **spice3d** in any order (disjoint folders). 6. **landing** (the list and home cards consume every project's final `summary`/`media`). 7. **gutter** last (its e2e spec has to run against every page in final form; failures go back to owners). |
| 2 | theme-audit-1, theme-audit-2 | They take over the page files gutter edited, so they start after gutter merges. Disjoint files, so they run in parallel. |
| 3 | qa | Deletes shims and aliases, runs the full screenshot and axe matrix, and greps the 1.4/2.1 bans. Needs everything else merged. |

If the lead caps concurrency, split wave 1 into 1a (contact, dice, edu-content, laptop, the five proj streams, spice3d) and 1b (landing, gutter). The internal order above already follows that split.

---

## 9. Risks and open questions (with recommendations)

| # | Question / risk | Recommendation |
|---|---|---|
| Q1 | Email: should it be visible on `/contact` (server-rendered from `CONTACT_PUBLIC_EMAIL`, so scrapable) or hidden? | Visible, via the separate env var, so Vince can use an alias (4.2). |
| Q2 | Resend sender: an unverified domain can send only to the Resend account owner. | Launch with `CONTACT_FROM_EMAIL=onboarding@resend.dev` and `CONTACT_TO_EMAIL` = the Resend account email. Verify `vinceong.dev` later. Document both in the README. |
| Q3 | The in-memory rate limit is per serverless instance on Vercel, so it is best-effort. | Accept it for a portfolio, together with the honeypot and fill-time check. Note it in the README. Upstash only if spam appears. |
| Q4 | Hover-grow: reserve the space (no content movement) or push content? | Reserve (3.1). Pushing content on every hover is a layout shift. |
| Q5 | Reduced motion on scroll-scrubbed scenes (laptop lid, R3F auto-rotate). | Show the final state statically: lid open, on-screen steps as a normal stacked list, no auto-rotate. Orbit stays user-driven. |
| Q6 | Grey hierarchy: AA collapses five dim-text levels (`silver/30…/90`) into three (chalk, silver, subtle). Light `--muted` darkens to `#555`. | Accept. It is required by hard rule 6, and the hierarchy can come from size and weight instead. Vince should see it in the qa screenshots. |
| Q7 | Stardew Earth vs FieldTwin naming on the card and page. | Title "STARDEW EARTH", subtitle "FieldTwin · NASA Space Apps", slug `stardew-earth`. Vince to confirm. |
| Q8 | Project detail pages show the side rail (new behaviour). | Yes. It keeps PROJECTS navigation and costs nothing, because ProjectShell applies the gutter. |
| Q9 | Footer links to the non-existent `/privacy` and `/terms`. | Remove them (foundation). Do not create placeholder legal pages. |
| Q10 | `tmp-scripts/` (puppeteer scratch) and `next.log` are tracked in git. | The lead deletes them in a housekeeping commit. They are outside every stream. |
| R1 | About 12 parallel worktrees, each needing its own `npm ci` (about 1 GB) and `next build`. | Cap at about 6 concurrent and use the 1a/1b split. |
| R2 | A reload mid-page on `/` with scroll restoration shifts the gutter from 71 to 44 once after hydration. | Accept it. It is user-scroll-correlated and only on the home page. |
| R3 | View Transitions are missing in some browsers. | An instant swap is the specified fallback, with no overlay hack. |
| R4 | `:has()` gutter needs Safari 15.4+, Chrome 105+, Firefox 121+. | Acceptable. Without `:has` the gutter falls back to 0, so the rail may overlap content, but nothing breaks. |
| R5 | Canvas and R3F colours may lag the VT "new" snapshot. | `setTheme` waits a double rAF inside the VT callback (1.7). Scenes must subscribe through `useThemeTokens`. |
| R6 | Recognition logos are remote Wikimedia hotlinks today. | edu-content renders monograms unless the lead adds local files to `public/logos/`. |
