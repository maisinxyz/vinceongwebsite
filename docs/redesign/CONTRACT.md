# CONTRACT: engineering contract for redesign/v3

Author: `architect`, 2026-11-16. Status: **FROZEN** (round 2, after the lead's critique), **amended 2026-11-16 after the foundation-core review** (changelog at the end). Changes go through a BOARD `PROPOSAL` and a lead `DECISION`. `CONTRACT-DRAFT.md` is kept for the record only and is not binding.
Paths are relative to `vince-portfolio/` unless they start with `docs/`. "Must" is binding. Where a choice was made, the reason is one sentence.

**Stream names.** Wave 0 is split into **`foundation-core`** and **`primitives`** (section 8). In the sections below, "foundation" means `foundation-core` unless the file is listed under `primitives` in section 7.

**Lead answers to the open questions (binding):**
- Q1: `CONTACT_PUBLIC_EMAIL`, server-rendered on `/contact` only.
- Q2: Resend onboarding sender first.
- Q3: accept the in-memory rate limit.
- Q4: reserve the hover-grow space, do not push (see 3.1).
- Q5: static final state under reduced motion.
- Q6: accept the AA grey collapse and light `--muted` `#555`.
- Q7: "STARDEW EARTH" with subtitle "FieldTwin". This is a `TODO(vince)` to confirm.
- Q8: rail on project detail pages.
- Q9: remove the `/privacy` and `/terms` links.
- Q10: left to Vince. `tmp-scripts/` and `next.log` are not deleted by any stream and are listed in the final report. eslint ignores `tmp-scripts/**` meanwhile.

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

**Rule for global illustration tokens:** a token belongs in `styles/tokens.css` only if (a) two or more streams consume it, or (b) its only consumer is a `foundation-core` file. Everything else lives in the consuming stream's own CSS module. The tokens that pass this test:
- `--device-*`: shared by laptop and proj-dawntrace.
- `--scene-*`: shared by spice3d and any other R3F scene (proj-stardew if it picks R3F for the globe).
- `--logo-metal`: single consumer `SignatureLogo3D`, a foundation-core file, so case (b).

**There are no global `--pcb-*` tokens.** The dice stream defines its palette in `components/dice/dice.module.css`, starting from the colours in the repo today: board panel `#101722` (`DigitalDicePCB.tsx:138`, `DicePageClient.tsx:77`, `ProjectsPageClient.tsx:123`) and the SVG's silkscreen `#e7f3d8`, pads `#c8a04a`, LED `#ff8a2d`, chips `#17191b`/`#151719`, and so on. The real board colour is unknown, so the existing look is kept, not changed. Any new or changed pcb colour pair that carries text must meet 4.5:1, and the dice stream records the ratios in its report.

| Var | Dark | Light | Notes |
|---|---|---|---|
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

### 1.3 Files and exact wiring (foundation-core)
`app/globals.css` becomes the following, with existing base and utility rules kept below the imports:
```css
@import "tailwindcss";
@import "../styles/tokens.css";
@import "../styles/motion.css";
@import "../styles/layout.css";
```
`foundation-core` creates `styles/motion.css` as a **stub** (a header comment only) so the import resolves. `primitives` owns it from then on and fills in section 2.2. Order matters: `layout.css` is imported after `motion.css`, but it must not depend on it at parse time. Any `var(--dur-*)` or `var(--ease-*)` used in `layout.css` carries a literal fallback.

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
- Text opacity modifiers are **not allowed on readable text**. The existing ones are removed mechanically by the wave-0 codemod (1.8). New code must not reintroduce them. The only exception is purely decorative text marked `aria-hidden="true"`. Opacity modifiers on `bg-*`/`border-*` are fine (decorative).
- Accent-coloured text uses `text-accent-fg`, never `text-accent`. In dark, `--accent` on `--bg` is 3.38:1, which fails body text. The fix is the in-family lighter `#7FAACB`.
- Form controls and other meaningful boundaries use `border-line-strong`. `border-steel` is 1.43:1 and is for decoration only.
- Text over imagery or animated backgrounds sits on `bg-scrim` and uses `text-chalk` only, not muted.
- Global focus ring (in `styles/motion.css`): `:where(a,button,input,select,textarea,summary,[role="button"],[role="switch"],[role="tab"],[role="option"],[tabindex]):focus-visible{outline:2px solid var(--focus);outline-offset:2px}`. `outline-none` is allowed only together with a replacement `focus-visible:` style.
- Tailwind palette literals (`text-white`, `bg-black`, `bg-white`, `text-black`) and hex or `rgba()` in TSX are not allowed outside: `styles/tokens.css`, `lib/theme.ts` (`THEME_COLOR`), logo `background` fields in `lib/data/experience.ts`, and files under `public/`.

### 1.5 Head script, meta, next-themes, ThemeTransition
`lib/theme.ts` (foundation-core) exports, verbatim:
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
    <meta name="theme-color" content="#0D0D0D" itemProp="theme-color" suppressHydrationWarning />
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
    {/* existing font <link>s */}
  </head>
  <body className="min-h-full flex flex-col bg-carbon text-chalk">
    <Providers><AsciiEasterEgg /><SideNav />{children}</Providers><Analytics />
  </body>
</html>
```
- `itemProp` is required (accepted departure). Without it React 19 treats the meta as a hoistable keyed by `content`, which the script has already changed, so hydration appends a second, stale theme-color meta. HTML validators flag `itemprop` alongside `name`; that is accepted. A later cleanup may have the script create the meta itself.
- `<html>` also carries `data-scroll-behavior="smooth"` (accepted departure; Next 15.5's signal to suspend smooth scrolling during route changes).
- The meta is placed **before** the script, so the script can find it. `viewport.themeColor` is **not** used, because Next would emit a second meta in an order we don't control. The default is dark, and system preference is ignored, as SPEC H says.
- **Before first paint (checked by reasoning, not yet by running it):**
  - The root layout is a server component, so the `<script>` is in the streamed HTML `<head>`.
  - It has no `async`, `defer` or `src`, so it is parser-blocking and runs before `<body>` is parsed, which is before first paint.
  - React 19 only hoists or dedupes `<script async src>`. An inline script stays where it is written.
  - `next/script strategy="beforeInteractive"` is **not** an alternative. In the App Router it queues the script through `self.__next_s` for Next's runtime to run, which is after paint.
- **React warning:** React 19's dev warning "Encountered a script tag while rendering React component…" fires only when the client **creates** a `<script>` element.
  - On first load the element is hydrated, not created.
  - The root layout never re-renders on client navigation.
  - So no warning is expected. The one exception is a hydration-error recovery that client-renders the root, and that path is already a bug.
  - `foundation-core` must **verify** both points in `npm run dev`: there must be no console warning on hard reload or across 3 client navigations, and there must be no flash in a light-theme hard reload with a 4× CPU throttle. Paste the result into its report.
  - If a warning does appear, keep the inline script (it is dev-only and harmless) and record it on the BOARD. Do not switch to `next/script`.
- `foundation-core` creates `components/Providers.tsx` as a pass-through stub (`({children}) => children`) so `layout.tsx` is final in wave 0. `primitives` owns it from then on and fills it in (2.4).
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
3. If reduced motion is set, run `document.startViewTransition(async () => { apply(); await yieldTask(); })` with no clip animation. CSS limits `::view-transition-group(root)` to `animation-duration: var(--dur-reduced)` (a 120 ms crossfade).
4. Otherwise: add `html.classList.add("vt-reveal")`, then `const vt = document.startViewTransition(async () => { apply(); await yieldTask(); })`. `yieldTask = () => new Promise<void>(r => setTimeout(r, 0))` is one macrotask: it lets the MutationObserver → `useSyncExternalStore` commit (and layout effects) flush before the "new" snapshot. Canvases then redraw in the capture frame's rAF. **Never await `requestAnimationFrame` inside the update callback.** Rendering is suppressed there, so rAF does not fire, and Chromium stalls about 4 s before giving up (measured: double rAF 4041 ms, `setTimeout(0)` 2 ms). The 400 ms duration and ease-in-out curve are inlined in `lib/theme.ts` (it ships before `lib/motion.ts`), and `lib/motion.test.ts` asserts they equal `DUR.theme` and `EASE_CSS.inOut`. Then `vt.ready.then(() => html.animate({ clipPath: [\`circle(0px at ${x}px ${y}px)\`, \`circle(${r}px at ${x}px ${y}px)\`] }, { duration: DUR.theme, easing: EASE_CSS.inOut, pseudoElement: "::view-transition-new(root)" }))`, where `r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))`. `vt.finished.finally(() => html.classList.remove("vt-reveal"))`.
5. CSS, in `app/globals.css` (theme section; accepted departure, because `motion.css` was a stub in 0a): `html.vt-reveal::view-transition-old(root), html.vt-reveal::view-transition-new(root){animation:none;mix-blend-mode:normal}`.
6. `useThemeTokens` must not cache a snapshot in which any value is `""` (stylesheet not yet applied). It re-reads instead.

`hooks/useTheme.ts` (foundation-core):
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
// R3F: <color attach="background" args={[tok["scene-ground"]]} />; materials: useLayoutEffect(() => { mat.color.set(tok["scene-accent"]); }, [tok]);
// useLayoutEffect, not useEffect: the colour must be committed before the View Transition takes its "new" snapshot.
```
`components/theme/ThemeToggle.tsx` is an `IconButton` with an `IconSwap` Sun/Moon, `label="Switch to light theme" | "Switch to dark theme"`, and origin = button centre. `primitives` owns it and mounts it in `Navbar` (right side, before the desktop links on `lg+`, before the hamburger below `lg`).

---

### 1.8 Wave-0 token codemod (one run, on `redesign/v3`)
**Who and when:** `foundation-core` writes `scripts/codemods/text-tokens.mjs` (Node, no dependencies) but does **not** run it. After merging foundation-core, the **lead** runs `node scripts/codemods/text-tokens.mjs --write` on `redesign/v3`, then runs `npm run verify`, then commits `chore(tokens): codemod legacy text opacity and palette literals`. That happens **before** `primitives` branches, so no worktree ever holds a pre-codemod copy of a page file.

**Scope:** `app/**/*.{ts,tsx}` and `components/**/*.{ts,tsx}`, excluding the two files in the exclusion row. CSS modules are out of scope because they use `var(--silver)`, not classes.

**Inventory on `redesign/v3` today:** I dry-ran the exact patterns below with a read-only script, excluding the dead files (foundation-core deletes them first) and the excluded files. Matches per rule 1–8: **134 / 5 / 18 / 3 / 6 / 3 / 7 / 1**, 177 replacements in total. These include the variant forms `before:text-silver/30` ×5 (home bullets) and `group-hover:text-silver/80` ×1. The 3 `text-white` hits are the `EducationPageClient` headings. The 6 `selection:` hits are on the resume, education and portfolio-view `<main>`s. The 7 `bg-black` hits are the home hero fallback, the home second section, portfolio-view ×2, resume `<main>`, and the resume/static-portfolio PDF iframes. No arbitrary-opacity forms (`text-silver/[…]`) exist. If the lead's run reports different counts, it re-runs `--check` and reads the diff before committing.

Each rule keeps any variant prefix chain (`hover:`, `group-hover:`, `before:`, `sm:`, …). Each regex runs on the whole file text, and the leading capture group preserves the prefix:

| # | Pattern (JS regex, flags `g`) | Replacement |
|---|---|---|
| 1 | `/(?<![\w/-])((?:[\w-]+:)*)text-silver\/(?:20\|25\|30\|35\|40\|45\|50\|55\|60)(?![\w/])/` | `$1text-subtle` |
| 2 | `/(?<![\w/-])((?:[\w-]+:)*)text-steel\/\d+(?![\w/])/` | `$1text-subtle` |
| 3 | `/(?<![\w/-])((?:[\w-]+:)*)text-silver\/(?:70\|80\|90)(?![\w/])/` | `$1text-silver` |
| 4 | `/(?<![\w/-])((?:[\w-]+:)*)text-chalk\/\d+(?![\w/])/` | `$1text-chalk` |
| 5 | `/\s?selection:(?:bg-silver\/30\|text-white)(?![\w/])/` | `` (deleted; the global `::selection` tokens apply) |
| 6 | `/(?<![\w/-])((?:[\w-]+:)*)text-white(?![\w/-])/` (runs after 5) | `$1text-chalk` |
| 7 | `/(?<![\w/-])((?:[\w-]+:)*)bg-black(?![\w/-])/` | `$1bg-void` |
| 8 | `/hover:bg-white hover:text-black/` | `hover:bg-chalk hover:text-void` |
| — | **Excluded files:** `components/LaptopScrollReveal.tsx` (laptop deletes it), `components/PlayingCards.tsx` (`bg-black` is the physical card frame; landing decides) | untouched |

**Not mechanical. These stay with the file owner in their wave:** `text-white/NN` and `bg-black/NN` captions and overlays on media (resume and static portfolio PDF chrome, about), `bg-white` logo tiles (`EducationPageClient.tsx:27`), `hover:bg-white/[0.02]`, `border-white/NN`, `border-black/NN`, `from-white`, `text-[#C0C0C0]`/`text-[#A0A0A0]`, every inline `style={{ color: … }}`, and every hex inside SVG and canvas.

**Proof that it finished:** `node scripts/codemods/text-tokens.mjs --check` exits 0 and prints `0 remaining`. It runs patterns 1–8 without writing and exits 1 listing `file:line` for any hit outside the excluded files. The equivalent manual grep, where any output outside the two excluded files is a failure:
```sh
cd vince-portfolio && rg -nP '(?<![\w/-])(?:[\w-]+:)*(?:text-(?:silver/(?:[2-6][05])|silver/[7-9]0|steel/\d+|chalk/\d+|white(?![\w/-]))|bg-black(?![\w/-])|selection:(?:bg-silver/30|text-white))' app components
```
`qa` re-runs `--check` in wave 3 to catch reintroductions.

### 1.9 Spacing reset removal (wave 0, lead; lead DECISION: option A)
**Why.** `app/globals.css` carried an **unlayered** `* { margin:0; padding:0 }`. Unlayered CSS outranks Tailwind v4's `@layer utilities`, so no `p-*`, `m-*`, `space-*` or `mx-auto` utility has ever applied on this site, and the current look was tuned in that state. Tailwind's preflight already performs the same reset inside `@layer base`, where utilities can override it.

**Sequence, on `redesign/v3`, after the codemod commit (1.8) and before `primitives` branches:**
1. **Baseline (lead).** Build and start `redesign/v3` at the codemod commit.
   - Capture full-page PNGs of the 12 existing routes (`/`, `/about`, `/projects`, `/projects/spice`, `/projects/dice`, `/projects/engram`, `/experience`, `/education`, `/resume`, `/contact`, `/card`, `/portfolio-view`).
   - Widths 360/768/1280/1920, dark theme, `animations: "disabled"`, after `document.fonts.ready`.
   - Save to `/Users/vincee_ong/Desktop/Repos/vinceongwebsite/docs/redesign/baseline/<route-slug>-<width>.png`: in the main checkout, read by absolute path from every worktree, listed in `.git/info/exclude`, never committed.
   - This set is **the reference for "existing aesthetic"** in every later review.
2. **Removal commit (lead)**, `fix(css): drop unlayered universal reset`:
   - delete `margin: 0; padding: 0;` from the unlayered `*` rule in `app/globals.css` (`box-sizing` may stay or go; preflight sets it);
   - delete the five unlayered gutter copies (`.pl-gutter`, `.ml-gutter`, `.-ml-gutter`, `.pt-nav-top`, `.pb-navbar`) and their comment from `styles/layout.css`. The `--spacing-*` keys (3.2) generate layered equivalents, and unlayered copies would block responsive overrides such as `lg:pl-0`;
   - add `lib/styles.test.ts` (proof (a) below).
   `npm run verify` must be green. The visual reflow is expected and does not count as a red build.
3. **Restoration duty.** Each owner brings its routes back to the baseline at all four widths in its own wave. It does this either by deleting spacing classes that never applied, or by keeping those that measurably improve on the baseline. Its report says which, with before/after screenshots.

   | Owner | Wave | Routes / components |
   |---|---|---|
   | primitives | 0b | Navbar, footer |
   | landing | 1 | `/`, `/projects` |
   | laptop | 1 | `/education` |
   | contact | 1 | `/contact` |
   | dice | 1 | `/projects/dice` |
   | spice3d | 1 | `/projects/spice` |
   | proj-engram | 1 | `/projects/engram` |
   | theme-audit-1 | 2 | `/about`, `/experience` |
   | theme-audit-2 | 2 | `/resume`, `/card`, `/portfolio-view` |

   New routes have no baseline. They follow the site's existing spacing rhythm. `gutter` (wave 1) is geometric only and does not restore spacing; it files legacy-page findings to the wave-2 owners.
4. **Proof (qa, wave 3).**
   - (a) `lib/styles.test.ts` (created by the lead in step 2, owned by qa in wave 3) reads `app/globals.css` and `styles/*.css` and removes every `@layer … { … }` block. It fails if any remaining rule whose selector list contains `*` or a bare type selector (`html`, `body`, `h1`–`h6`, `p`, `ul`, `ol`, `li`, `a`, `button`, `input`, `section`, `main`, `div`) declares `margin` or `padding`. The single allowed exception is `body { padding-bottom: var(--nav-bar-bottom) }`. It also fails if `.pl-gutter`, `.ml-gutter`, `.-ml-gutter`, `.pt-nav-top` or `.pb-navbar` appears as an unlayered rule.
   - (b) `e2e/css.spec.ts` (qa): on every route in `ROUTES`, inject `<div id="probe" class="p-4 mx-2 mt-3">` into `<main>` and assert computed `padding-top` = 16px, `margin-left` = 8px and `margin-top` = 12px. This proves utilities apply site-wide.
   - (c) qa compares each of the 12 legacy routes against its baseline PNGs and files any unexplained spacing deviation to the owner.

## 2. Motion contract

### 2.1 `lib/motion.ts` (primitives), exact exports
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
export function useVariants(name: keyof typeof V): Variants;   // wraps usePrefersReducedMotion() (amended: framer's useReducedMotion breaks hydration)
```
Exits use ease-out as well, because an ease-in exit starts slowly and makes dismissals feel laggy. **Springs are not allowed**: no `type: "spring"`, `stiffness` or `damping` anywhere. Use `T.*`. This covers "no bounce".

### 2.2 `styles/motion.css` (primitives; stub created by foundation-core)
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
@media (prefers-reduced-motion: reduce) {
  :where(*:not([data-motion-essential])),
  :where(*:not([data-motion-essential]))::before,
  :where(*:not([data-motion-essential]))::after {
    animation-duration: var(--dur-reduced) !important; animation-delay: 0s !important; animation-iteration-count: 1 !important;
    transition-duration: var(--dur-reduced) !important; transition-delay: 0s !important; transition-property: opacity !important;
    scroll-behavior: auto !important; }
  ::view-transition-group(root) { animation-duration: var(--dur-reduced); }
}
/* + global :focus-visible rule from 1.4 */
```
(`gutter-anim` lives in `layout.css`, owned by foundation-core, with literal fallbacks. See 3.2.)
Use CSS durations through `duration-(--dur-enter)` and `ease-out` / `ease-in-out`. `lib/motion.test.ts` parses `styles/motion.css` and asserts every `--dur-*` equals its `DUR`/`exitMs` constant, so the two cannot drift.

**Reduced motion (global):**
- `components/Providers.tsx` wraps the app in `<MotionConfig reducedMotion="user">`. Framer then skips transform and layout animations: those values **jump to their target**, and opacity still animates.
- Every primitive uses `useVariants`.
- The CSS block above turns CSS motion into a 120 ms opacity transition with no delay. Scroll-scrubbed scenes (laptop, R3F auto-rotate, dice hold-cycle visuals) render their **final static state** under reduced motion (Q5).

**What the CSS block can and cannot break, and the escape hatch:**
- **Transform-only states do not get stuck; they pop.** Limiting `transition-property` to `opacity` means `transform`, `width` and `clip-path` changes apply instantly at their end value. Examples: the Navbar hamburger bars, the `press-scale` release, the SideNav width, accordions driven by `grid-template-rows`. A pop to the final state is the intended reduced-motion behaviour.
- **What really gets stuck** is JavaScript waiting on `transitionend` or `animationend` for a non-opacity property, because those events never fire. The repo has **none** today (I grepped for `onTransitionEnd`, `onAnimationEnd`, `transitionend` and `animationend`). From now on, code that must sequence on a transition uses framer's `onAnimationComplete` or a timeout of `DUR.*`, never a CSS end event.
- **Finite CSS animations** (`draw-line`, `charge-border`, `float-gentle`, `theme-*`) run once in 120 ms and finish on their end keyframe (`forwards` fill is kept). **Infinite decorative loops** (`blink`, `pulse-dot`, `animate-pulse` in Engram and PlayingCards, `marquee`, the ParticleBackground `drawX/drawY/shimmer`) run once and stop. That is correct, since they carry no information.
- **`data-motion-essential`** goes on an element **itself** (it is not inherited, so put it on each animated node). The element keeps its authored animation and transition under reduced motion. It is allowed only for small, non-vestibular indicators that carry state: the `Button` `loading` spinner (primitives), the contact form's sending indicator if it is not the Button spinner (contact), and nothing else today. A new use must be listed in that stream's report. Large-area motion is never essential.
- **Primitives under reduced motion (confirmed against the spec above):**
  - **Toggle:** the knob's `x` is a framer motion value, so on release it jumps to the end. The stretch `scaleX` jumps back to 1. `aria-checked` updates synchronously. **It reaches its end state.**
  - **Select and Popover:** `useVariants` returns `V.reducedFade` (opacity only, 120 ms), so the menu opens fully visible at scale 1. `AnimatePresence` exit completes on the opacity animation, so the element unmounts. **They reach their end state.**
  - **Tabs:** the indicator `layoutId` jumps (layout animation is off) and the panels crossfade in 120 ms.
  - **Toast:** fade only.
  - The mobile menu (framer `y` + `opacity`) and `RevealOnScroll` (`V.fadeUp`) behave the same way: `y` jumps and opacity fades.

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

### 2.4 Primitives: `components/primitives/` (primitives stream), barrel `index.ts`
All primitives are client components. They take `ref` as a prop (React 19), merge `className` via `cn()`, use `press-scale`, rely on the global focus ring, and honour `useVariants`.

```ts
// Button.tsx
type ButtonBase = { variant?: "outline" | "solid" | "ghost" | "link"; size?: "sm" | "md" | "lg"; shape?: "pill" | "rect";
  leadingIcon?: React.ReactNode; trailingIcon?: React.ReactNode; loading?: boolean; success?: boolean; children: React.ReactNode; className?: string };
export type ButtonProps =
  | (ButtonBase & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined })
  | (ButtonBase & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string; external?: boolean }); // internal → next/link
// defaults: outline, md, pill. outline = border-line-strong text-chalk hover:bg-iron; solid = bg-accent text-on-accent.
// loading: label clip-path-swapped to spinner (spinner carries data-motion-essential), aria-busy. success: renders <SuccessMark active> in place of the label for 1200 ms.

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
`components/RevealOnScroll.tsx` (primitives) becomes a real reveal: same props (`children`, `delay?`, `className?`), `V.fadeUp` with `whileInView`, `viewport={{ once: true, margin: "-10% 0px" }}`.
**Amended after the primitives review (lead DECISION, 2026-11-16).** These are binding over the types above:
- every primitive accepts `ref` (button `HTMLButtonElement`, anchor `HTMLAnchorElement`, IconButton `HTMLElement`, Popover content and Tabs tablist `HTMLDivElement`);
- Tabs panels use `AnimatePresence mode="popLayout"` (still simultaneous), and inactive panels stay in the DOM as `hidden`;
- `PopoverProps.contentProps` passes attributes to the content element;
- the Select trigger is `<button role="combobox">`, and Select adds `triggerClassName`, `required` and `defaultValue`;
- Toast `description` is a `ReactNode`, with an optional `action`;
- `lib/motion.ts` exports `usePrefersReducedMotion()`, which anything that renders on the server must use instead of framer's `useReducedMotion()`;
- the global focus ring lives in `@layer base`;
- RevealOnScroll has a no-JS fallback;
- extra exports: `buttonClass`, `iconButtonClass`, `tabId`, `panelId`, `isKnown`.

Sandbox: `app/dev/motion/page.tsx` (server; `if (process.env.NODE_ENV === "production") notFound();`) plus `MotionSandbox.tsx`, with one labelled demo per row of 2.3.

### 2.5 Migration of raw buttons
Each stream migrates the raw `<button>`s and click targets **in the files it owns**, in its own wave. The rule: every `<button>` is a primitive or carries `press-scale` plus a token-coloured style; `onClick` on a non-interactive element is not allowed (use `<button>` or `role="button" tabIndex={0}` with key handling).
- primitives (Navbar and footer transfer to it from foundation-core): Navbar hamburger → `IconButton`; footer scroll-to-top → `IconButton`; mount `ThemeToggle` in Navbar.
- landing: home theme/tour pills (theme pill calls `toggleTheme`, or is removed now that the Navbar has the toggle), `PlayingCards` card div.
- theme-audit-1: about vinyl controls, `WorkingOnStack` dots and stack.
- theme-audit-2: `ViewToggle` → `Tabs`, portfolio download, zoom exits, resume PDF overlays.
- spice3d: `SpiceDispenser2D` controls (or delete the file). dice: PCB SVG text targets.

---

## 3. Nav gutter contract

### 3.1 Decisions
- **One breakpoint: 1024px (`lg`).** At ≥1024 there is the side rail plus the Navbar desktop links. Below 1024 there is the Navbar hamburger on every route, plus a bottom **section bar** on rail routes. Foundation moves Navbar's `md:` switches to `lg:`. Landing changes `useDeviceType` to `width < 1024 → tablet`.
- **Rail routes:** `/`, `/about`, `/projects`, `/projects/*`, `/experience`, `/education`. Not on `/resume`, `/contact`, `/card`, `/portfolio-view`, `/dev/*`. Project detail pages get the rail because they live under PROJECTS and are built on a shared shell.
- **Hover-grow is reserved, not pushed. This is a deliberate reading of SPEC D ("tracks the tabs' own shrink-on-scroll and hover-grow"), approved by the lead (Q4). Reviewers must not mark it as a miss.**
  - The gutter always equals base + 14, the tab's hovered width, so a hovered tab grows into space that is already reserved and content never moves.
  - A literal reading, where the gutter follows the hover state, would shift every page's content sideways each time the pointer crosses a tab. That is a layout shift caused by pointer movement, which hard rule 7 forbids, and it would make the rail feel unstable.
  - The gutter still *tracks* hover-grow, because its value is derived from the hover width (`RAIL.narrow + RAIL.hoverGrow`). It still tracks shrink-on-scroll literally (71 → 44 on `/`).
  - Acceptance: `e2e/gutter.spec.ts` hovers every tab and asserts the grown tab stays inside the gutter (3.5).
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

`styles/layout.css` (foundation-core):
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
@utility gutter-anim { transition: padding-left var(--dur-move, 320ms) var(--ease-in-out, cubic-bezier(0.65,0,0.35,1)),
  margin-left var(--dur-move, 320ms) var(--ease-in-out, cubic-bezier(0.65,0,0.35,1)), left var(--dur-move, 320ms) var(--ease-in-out, cubic-bezier(0.65,0,0.35,1)); }
@utility band-bleed { position: absolute; inset-block: 0; left: calc(var(--nav-gutter) * -1); right: 0; z-index: -1; pointer-events: none; }
```
The spacing keys generate `pl-gutter`, `ml-gutter`, `-ml-gutter`, `left-gutter`, `-left-gutter`, `pt-nav-top`, `bottom-navbar`, `pb-navbar` and so on. `lib/site.ts` exports `RAIL = { wide: 57, narrow: 30, hoverGrow: 14, scrollThreshold: 100, breakpoint: 1024 } as const`. `lib/data/data.test.ts` asserts that `layout.css` contains `71px` = wide + hoverGrow and `44px` = narrow + hoverGrow.

First paint: the SSR HTML contains `#side-rail[data-rail="wide"]` on `/` (and `"narrow"` elsewhere), so the CSS resolves the gutter before any JS runs. The one remaining shift is a reload with browser scroll restoration mid-page on `/` (wide → narrow after hydration). It is accepted and listed in 9.

**Hydration safety of `data-rail` (checked against the code):**
- `usePathname()` returns the same value on the server and in the hydrating client, since there is no middleware and no rewrites (`next.config.ts` is just `{ reactStrictMode: false }`). So the *route* part cannot mismatch.
- The *scroll* part is safe only if the first client render equals the server render. The binding implementation:
```ts
const [scrolled, setScrolled] = useState(false);          // NEVER initialise from window.scrollY (server has no window → mismatch)
useEffect(() => {
  const update = () => setScrolled(window.scrollY > RAIL.scrollThreshold);
  update();                                               // reads a restored mid-page scroll position right after hydration
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}, []);
const rail = pathname === "/" && !scrolled ? "wide" : "narrow";
```
- So `/` always renders `"wide"` on the server and on the hydration pass, and switches only in the effect.
- **The current code has a latent bug that this fixes.** `SideNav.tsx:30-38` updates only on framer `scrollY.on("change")`, and nothing reads the initial position. A page restored mid-scroll can stay "wide" until the user scrolls. Do not reuse that pattern.
- `isRailRoute` must be a pure function of `pathname` only.

### 3.3 Components (foundation-core)
- `components/SideNav.tsx`: renders on rail routes only (`isRailRoute(usePathname())` from `lib/site.ts`). The output is `<nav id="side-rail" data-rail={…} aria-label="Sections" className="hidden lg:flex fixed left-0 top-0 h-dvh z-[60] flex-col">`. Glass styles come from the `--glass-*` tokens through a co-located `SideNav.module.css`. Labels use `text-silver` and `hover:text-chalk`. Active tab gets `aria-current="page"`.
- `components/nav/SectionBar.tsx`: rail routes, `<nav id="section-bar" aria-label="Sections" className="lg:hidden fixed inset-x-0 bottom-0 z-[60] h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[var(--nav-bg)] backdrop-blur border-t border-steel">`, with 4 equal links (ABOUT, PROJECTS, EXPERIENCE, EDUCATION). Rendered by `SideNav` so there is a single mount point.
- `components/layout/PageShell.tsx`:
```ts
export type PageShellProps = { children: React.ReactNode; footer?: boolean /*true*/; cursor?: boolean /*true*/;
  top?: "nav" | "none" /*"nav" → pt-nav-top; "none" for heroes under the bar*/; className?: string /* on <main> */ };
// renders: {cursor && <CustomCursor/>}<Navbar/><main id="main" className={cn("relative flex-1 pl-gutter gutter-anim", top==="nav" && "pt-nav-top", className)}>{children}</main>{footer && <Footer/>}
```
- `components/ui/footer.tsx` applies `pl-gutter gutter-anim` itself. Navbar's inner container gets `pl-gutter` (its background bar stays full width and is exempt).
- `components/layout/Band.tsx` is **the only way to make a full-bleed coloured section band.** Typical uses: the home second section (`bg-void`), the dice and spice stages, the laptop stage.
```ts
export type BandTone = "void" | "carbon" | "iron";
export type BandProps = { tone?: BandTone /*"void"*/; bgClassName?: string /* replaces tone, e.g. gradients or device-* backdrops */;
  as?: "section" | "div" /*"section"*/; id?: string; "aria-label"?: string; "aria-labelledby"?: string; className?: string; children: React.ReactNode };
// renders:
// <Tag data-band className={cn("relative isolate", className)} …aria>
//   <div aria-hidden data-gutter-exempt data-band-bg className={cn("band-bleed", bgClassName ?? `bg-${tone}`)} />
//   {children}
// </Tag>
```
  - **A Band must be a direct child of `<main>`** (or of a full-width wrapper with no horizontal padding, margin or max-width). Width-constrained content (`max-w-*`, `mx-auto`, `px-*`) goes *inside* the Band, never around it. Otherwise `band-bleed`'s `-gutter` offset no longer reaches x=0.
  - The band's own box starts at the gutter edge, because it sits inside `<main class="pl-gutter">`.
  - The `band-bleed` backdrop extends left by `--nav-gutter` to x=0 and sits behind the band's content (`isolate` plus `z-index:-1`), so the band's colour shows through the translucent rail. There is no body-colour strip.
  - Content inside the band needs nothing extra. It already starts at the gutter.
  - For a band that is also edge-to-edge on the right, `<main>` has no right padding, so nothing more is needed.
  - Use `bg-${tone}` through a static map (`{void:"bg-void",carbon:"bg-carbon",iron:"bg-iron"}`), not string interpolation, so Tailwind sees the classes.

### 3.4 Rules every page must follow
1. A page renders `<PageShell>` and does **not** import `Navbar`, `Footer` or `CustomCursor` directly.
2. Everything inside `<main>` already starts at the gutter. Page titles and sections need nothing extra. Do not add `pl-gutter` twice.
3. **A section with its own background colour is a `<Band>`.** A hand-rolled `bg-*` section inside `<main>` is not allowed, because it would leave a body-colour strip behind the rail. A non-colour decorative layer that must reach x=0 (the home waves canvas, a laptop-stage gradient) goes inside a Band as a child with `band-bleed` plus `aria-hidden data-gutter-exempt` (Band's own backdrop is one such layer).
4. `position: fixed/absolute` elements positioned against the viewport use `left-gutter` (never `left-0`), `fixed-center-x` for centring, and `bottom-navbar` (or `bottom-[calc(var(--nav-bar-bottom)+1rem)]`) for bottom anchoring. Negative-offset decorations (for example the education year labels at `left-[-100px]`) are not allowed unless they are `data-gutter-exempt` and `aria-hidden`.
5. Full-screen modal overlays (mobile menu, lightbox) cover everything and are exempt. They must sit at `z-[70]` or higher so they cover the rail and section bar. The Navbar mobile menu overlay is `z-[70]`, and the Navbar itself rises from `z-50` to `z-[80]` only while the menu is open, so its close button stays on top (accepted departure).

### 3.5 Test (`e2e/gutter.spec.ts`, gutter stream)
For each route in `e2e/routes.ts` × viewports `[360, 768, 1280, 1920]` × theme dark:
- **≥1024 on rail routes:** read `#side-rail`'s rect R, hover each tab and take R.right as the max. Assert `R.right <= gutter` (computed `--nav-gutter`). For every element in `main, footer, body > [style*="fixed"], [class*="fixed"], [class*="absolute"]` that is visible, has non-zero size, is not inside `#side-rail` or `[data-gutter-exempt]`, and is not `aria-hidden`, assert `rect.left >= R.right` or no vertical overlap. Repeat at `scrollY = 0` and after scrolling 400px on `/`.
- **<1024 on rail routes:** read `#section-bar` rect B. Scroll to the bottom and assert the footer's bottom `<= B.top`. Assert no fixed or absolute element (other than exempt ones) intersects B.
- **Bands, at every viewport:** for every `[data-band]`:
  - its `[data-band-bg]` child must have `rect.left <= 0.5` and `rect.right >= viewportWidth - 0.5`;
  - its background colour must equal the band's computed background (not `transparent`);
  - its first non-exempt content child must have `rect.left >= gutter`;
  - its parent must be `main#main`, or a block whose computed `padding-inline`, `margin-inline` and `max-width` leave it the full width of `main`'s content box. Otherwise the test fails.
  
  Separately, at ≥1024, with `#side-rail` temporarily set to `visibility:hidden` (otherwise the rail itself is always what gets hit), sample `document.elementFromPoint(gutter / 2, y)` at the vertical centre of each band. It must be that band's `[data-band-bg]`, never `<body>` or `<main>`, which proves there is no strip behind the translucent rail.
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
  detail: boolean;            // true ⇔ app/projects/<slug>/page.tsx exists (data.test.ts asserts both ways). Seeds set true only for
                              // spice, dice, engram; each proj stream flips its own flag in the same commit that adds page.tsx.
  links: ProjectLink[];
  relatedExperience?: ExperienceId[];
  unverified?: string[];      // shown as a "Reconstruction — unverified" note by ProjectShell
  todo?: string[];            // TODO(vince) items, rendered only in development
// No card or page may print a literal "TODO(vince)". Seeds use `year: "TODO(vince)"` where the year is unknown, and any
// field whose value starts with "TODO(vince)" renders as a muted placeholder (e.g. "—"), or is omitted.
// landing (cards) and ProjectShell (primitives) implement this. qa greps the built HTML of every route for "TODO(vince)" and fails on any hit.
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
**Email allowlist (accepted departure).** In wave 0 the email check carries a named allowlist (`PENDING_REMOVAL`) of the 4 files that still hold the address: `app/contact/ContactPageClient.tsx` (contact), `app/card/CardPageClient.tsx` and `app/portfolio-view/DynamicPortfolio.tsx` (theme-audit-2), and `app/page.tsx` (landing). **Each owning stream removes its file's entry from the allowlist in the same commit that removes the address.** That one-line edit to `lib/data/data.test.ts` is explicitly granted to those three streams. qa deletes the allowlist in wave 3.

`lib/data/data.test.ts` (foundation-core) checks: unique slugs; `detail` matches the filesystem; every `relatedProjects`/`relatedExperience` id resolves; no file under `app/ components/ lib/` matches `/[A-Za-z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|sfu)\./`.

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
- `components/projects/ProjectShell.tsx` (primitives; built on foundation-core's `PageShell`, `Band` and data):
```ts
export type ProjectShellProps = { slug: ProjectSlug; screen: React.ReactNode; screenLabel?: string /* aria-label, default "<title> interactive demo" */;
  screenAspect?: string /* CSS aspect-ratio reserved before the screen loads, default "16 / 10" */; children?: React.ReactNode };
// PageShell > header (title, subtitle, status, dateRange, course, tags, links as Buttons) > <section aria-label> reserving aspect (no CLS)
// > description paragraphs > unverified note > children > prev/next among DETAIL_SLUGS.
```
- Screens must differ visually and behaviourally (SPEC E). Shared things come from primitives and tokens only, never from another stream's screen.
- `DigitalDicePCB` keeps its path and export name (`components/DigitalDicePCB.tsx`, `export function DigitalDicePCB(p: { compact?: boolean })`). The `dice` stream may re-export from `components/dice/`, so the projects list (landing) never changes its import.

---

## 6. Tooling, worktrees, verification

### 6.1 Dependencies and scripts (foundation-core does every install; afterwards only the lead edits `package.json` or `package-lock.json`)
- `npm uninstall next-themes motion`
- `npm install zod resend`
- `npm install -D vitest @playwright/test @axe-core/playwright tsx`, then `npx playwright install chromium`. Installed: **vitest ^4** (accepted departure), zod ^4, resend ^6, @playwright/test ^1.65, tsx ^4. `eslint.config.mjs` ignores `tmp-scripts/**` (Q10).
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
- `playwright.config.ts` reads the port from the environment so that parallel worktrees never collide:
```ts
const PORT = Number(process.env.PORT ?? 3100);
export default defineConfig({ testDir: "e2e", projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: { command: `npm run start -- -p ${PORT}`, url: `http://localhost:${PORT}`, reuseExistingServer: false, timeout: 120_000 } });
```
  It requires a prior `npm run build` (done by `verify`). `reuseExistingServer: false` means a stream can never silently test another worktree's server. A busy port is a hard error. `e2e/routes.ts` (foundation-core) exports `ROUTES` (the 17 public routes: `/`, `/about`, `/projects`, the 8 detail pages, `/experience`, `/education`, `/resume`, `/contact`, `/card`, `/portfolio-view`) and `VIEWPORTS = [360, 768, 1280, 1920]`.
- Dice check: `scripts/check-dice-layout.ts` imports the component table from `components/dice/layout.ts` and exits 1 on any overlap of bounding boxes (body ∪ label ∪ trace segments, inflated by 1 viewBox unit). Wave 0 ships a **stub** that prints `dice layout: not yet defined` and exits 0. Ownership then passes to `dice`. `prebuild` runs it on every `npm run build`, including on Vercel.
- Merge gate (hard rule 8): `npm run verify` must be green on the merge result. Streams that own e2e specs also run theirs.

### 6.2 Worktree bootstrap (every stream, first thing)
Each parallel agent gets a fresh worktree branched from `redesign/v3` at the wave's start commit (the lead creates it: `git worktree add ../wt-<stream> -b rd3/<stream> redesign/v3`). The worktree has no `node_modules` and no `.next`. The first commands, verbatim:
```sh
cd <worktree>/vince-portfolio
npm ci                      # exact lockfile install; never `npm install` (only foundation-core changes the lockfile)
export PORT=<your port>     # table 6.3; use it for `npm run dev -- -p $PORT` too
```
- Playwright browsers are installed **once**, machine-wide, by `foundation-core` (`npx playwright install chromium` goes to `~/Library/Caches/ms-playwright`). Other streams never run `playwright install`.
- `.env.local` is gitignored, so it is absent in worktrees. Only `contact` needs env vars, and its tests mock the provider, so no real keys are needed anywhere.

### 6.3 Ports and Playwright permissions
Every stream has a fixed port for both `next dev` and `next start`. **Committed e2e specs** may be written only by their owner. Read-only reviewers may run Playwright with ad-hoc scripts kept in their scratchpad and never committed.

| Port | Stream | Playwright |
|---|---|---|
| 3100 | foundation-core | runs `npx playwright install chromium`; may smoke-run |
| 3101 | primitives | ad-hoc only (checks `/dev/motion` in `next dev`) |
| 3102 | contact | owns `e2e/contact.spec.ts` |
| 3103 | laptop | ad-hoc only |
| 3104 | edu-content | ad-hoc only |
| 3105 | gutter | owns `e2e/gutter.spec.ts`; runs it on all routes |
| 3106 | dice | ad-hoc only |
| 3107 | spice3d | ad-hoc only |
| 3108 | proj-dawntrace | ad-hoc only |
| 3109 | proj-racerbot | ad-hoc only |
| 3110 | proj-mse112 | ad-hoc only |
| 3111 | proj-engram | ad-hoc only |
| 3112 | proj-stardew | ad-hoc only |
| 3113 | landing | ad-hoc only |
| 3114 | theme-audit-1 | ad-hoc (review screenshots) |
| 3115 | theme-audit-2 | ad-hoc (review screenshots) |
| 3116 | qa | owns `e2e/theme.spec.ts`, `e2e/a11y.spec.ts`; runs the full matrix |
| 3117 | reviewer | ad-hoc only |
| 3118 | lead (on `redesign/v3` after each merge) | runs every committed spec |

### 6.4 Done means
A stream reports DONE only after these pass in its worktree, with the output tail pasted into its report:
```sh
cd vince-portfolio && npm run verify                           # lint + typecheck + vitest + prebuild dice check + next build
PORT=<port> npx playwright test e2e/<your-spec>.spec.ts        # only for contact, gutter, qa
node scripts/codemods/text-tokens.mjs --check                  # every stream except foundation-core (whose tree predates the codemod)
```
`gutter` rebases onto the current `redesign/v3` (with all other wave-1 streams merged) before its final spec run.
The lead re-runs `npm run verify` plus all committed specs (`PORT=3118 npm run test:e2e`) on `redesign/v3` after every merge, and never merges red.

---

## 7. File-ownership map
One owner per file per wave. "→ X" means ownership transfers to X after the current owner's merge. Anything not listed is owned by **nobody**: raise it on the BOARD and the lead assigns it. **Never edit someone else's file.** Post `NEEDS: <owner>` on the BOARD. After the owner's stream has merged, the lead makes small hot-file edits directly on `redesign/v3` between merges.

| Stream | Owns (C = create, M = modify, D = delete) |
|---|---|
| **foundation-core** (wave 0a) | M `app/globals.css`, `app/layout.tsx` (final: head script, meta, `<Providers>` stub mount), `lib/utils.ts` (keep `cn`, `formatDate`; drop dead exports), `components/SideNav.tsx` (3.2 hydration-safe implementation), `components/Navbar.tsx` (lazy `SignatureLogo3D` via `next/dynamic` ssr:false with a fixed-size placeholder; `lg` breakpoint; tokens; `pl-gutter`) → primitives, `components/ui/footer.tsx` (gutter; email → `/contact`; remove `/privacy` `/terms`) → primitives, `components/SignatureLogo3D.tsx` (`--logo-metal` via `useThemeTokens`), `components/ThemeTransition.tsx` (shim on `lib/theme`), `app/experience/data.ts` (re-export) → theme-audit-1 · C `styles/tokens.css`, `styles/layout.css`, `components/SideNav.module.css`, `lib/theme.ts`, `lib/theme.test.ts`, `hooks/useTheme.ts`, `components/nav/SectionBar.tsx`, `components/layout/{PageShell,Band}.tsx`, `lib/site.ts`, `lib/data/projects/{types,index}.ts`, `lib/data/data.test.ts`, `scripts/codemods/text-tokens.mjs` (not run by core), `vitest.config.ts`, `playwright.config.ts`, `e2e/routes.ts`, `package.json`, `package-lock.json` · **stubs → primitives:** `styles/motion.css` (comment only), `components/Providers.tsx` (pass-through) · **seeds → other owners:** `lib/data/projects/<slug>.ts` ×9 → slug owner, `lib/data/experience.ts` → landing, `lib/data/education.ts` → edu-content, `components/education/types.ts` (`export type LaptopStep = { id: string; title: string; render: (p: { active: boolean }) => React.ReactNode }`) → laptop, `components/education/screens/index.tsx` (`export const EDUCATION_SCREENS: LaptopStep[]` built from current data) → edu-content, `scripts/check-dice-layout.ts` (stub, exits 0) → dice · D the dead files listed in section 0 (re-grep before deleting) |
| **lead** (between 0a and 0b) | in order: runs `scripts/codemods/text-tokens.mjs --write` and commits (1.8); captures the baseline (1.9 step 1); commits the reset removal: M `app/globals.css`, M `styles/layout.css`, C `lib/styles.test.ts` (1.9 step 2). These touch files whose owners are between streams at that moment |
| **primitives** (wave 0b) | C `lib/motion.ts`, `lib/motion.test.ts`, `components/primitives/{Button,IconButton,Toggle,Select,Popover,Tabs,Toast,IconSwap,SuccessMark,index}.tsx`, `components/theme/ThemeToggle.tsx`, `components/projects/ProjectShell.tsx`, `app/dev/motion/{page,MotionSandbox}.tsx` · M (from stubs or transfers) `styles/motion.css`, `components/Providers.tsx`, `components/RevealOnScroll.tsx`, `components/Navbar.tsx` (mount `ThemeToggle`; hamburger → `IconButton`), `components/ui/footer.tsx` (scroll-to-top → `IconButton`). After merge, Navbar and footer → lead (hot), then qa |
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
| **qa** (wave 3) | C `e2e/css.spec.ts` (1.9 proof b), owns `lib/styles.test.ts` (1.9 proof a), runs the baseline comparison (1.9 proof c), greps built HTML for `TODO(vince)` (4.1), deletes the `data.test.ts` email allowlist (4.1) · C `e2e/theme.spec.ts` (both themes × 3 viewports screenshots, reload persistence), `e2e/a11y.spec.ts` (axe `color-contrast`, `button-name`, `link-name` on every route × theme) · in wave 3 **all foundation-core and primitives files transfer to qa** for cleanup: D `components/ThemeTransition.tsx`, remove the `--sidenav-gutter` alias, delete `app/experience/data.ts` if unused |
| **lead** only | `public/logos/**`, `docs/redesign/CONTRACT.md`, merges, any post-merge hot-file edit |

Hot files: `globals.css`, `styles/tokens.css`, `styles/layout.css`, `layout.tsx` and `package.json` are foundation-core's. `styles/motion.css`, `Providers.tsx`, `Navbar.tsx` and `footer.tsx` are primitives' at the end of wave 0. All of them then pass to the lead (waves 1-2) and to qa (wave 3). `ProjectsPageClient.tsx` is landing's, and it reads data only, so other streams reach it through their `lib/data/projects/<slug>.ts`. Per-stream CSS goes in **co-located CSS modules**; there are no stream files in `styles/`.

---

## 8. Merge order, review, models

### 8.1 Waves

| Step | Streams | Merge order inside the step, and why |
|---|---|---|
| 0a | **foundation-core** (alone) | Tokens, theme, gutter, shells, data seeds, tooling and installs: everything else imports these. It ships the stubs `styles/motion.css` and `Providers.tsx`, so `globals.css` and `layout.tsx` are final in 0a and never touched again in wave 0. |
| 0a→0b | **lead, in this order: (1) codemod** (1.8), **(2) baseline capture, (3) reset removal** (1.9), all on `redesign/v3` | The codemod runs after core merges (dead files are gone, tokens exist). The baseline is captured after the codemod, so it shows token colours with the old spacing. The reset is removed last, so primitives and every wave-1 stream branch with working spacing utilities. Nothing else branches before step 3. |
| 0b | **primitives** (alone, branched after the reset-removal commit) | Sequential, not parallel with core. Every primitive needs core's tokens, `lib/theme`, `cn`, vitest and the `package.json` scripts. `ThemeToggle` needs `IconButton` and `lib/theme`, Navbar has to mount `ThemeToggle`, and `globals.css` imports `motion.css`. Running them in parallel would need stubs in both directions (core → `motion.css`/`Providers`/ThemeToggle slot; primitives → tokens/theme/PageShell) plus a codemod race on Navbar and footer. Running them in sequence needs two one-way stubs. The cost is one primitives run of wall-clock time, which is cheaper than one cross-stub mismatch found in wave 1. |
| 1 | contact, dice, spice3d, proj-dawntrace, proj-racerbot, proj-mse112, proj-engram, proj-stardew, edu-content, laptop, landing, gutter (all branched from `redesign/v3` after 0b) | 1. **contact** (self-contained; proves the test tooling early). 2. **dice** (replaces the prebuild stub; every later build runs its check). 3. **edu-content**, then 4. **laptop** (laptop renders edu's screens, so it rebases onto real content and checks fit and overflow). 5. **proj-\*** and **spice3d** in any order (disjoint folders). 6. **landing** (the list and home cards consume every project's final `summary`/`media`). 7. **gutter** last (its spec has to run against every page in final form; failures go back to owners). |
| 2 | theme-audit-1, theme-audit-2 | They take over the legacy page files gutter edited, so they start after gutter merges. Disjoint files, so they run in parallel. Each also does a read-only review of half the wave-1 routes (8.2). |
| 3 | qa | Deletes shims and aliases, runs the full screenshot and axe matrix, re-runs the codemod `--check`, and greps the 1.4/2.1 bans. Needs everything else merged. |
| final | reviewer | Read-only review of `redesign/v3` against SPEC and this contract. Findings go to the lead. |

If the lead caps concurrency (about 6 recommended, R1), split wave 1 into 1a (contact, dice, edu-content, laptop, spice3d, proj-dawntrace) and 1b (proj-racerbot, proj-mse112, proj-engram, proj-stardew, landing, gutter). The internal order above is preserved.

### 8.2 Theme-audit review scope (SPEC H covers every component in both themes)
Each audit stream **owns** its legacy pages (section 7) and also **reviews read-only** these wave-1 routes and shared components. The review covers both themes at 360/768/1280/1920, against the SPEC H checklist: text, borders, shadows vs glows, images and logos, SVG, canvas and Three.js token updates on toggle, selection, scrollbars, focus rings, form fields, code blocks, dividers.

| Stream | Owns and fixes | Reviews read-only, files findings |
|---|---|---|
| theme-audit-1 | `/about`, `/experience` (+ CustomCursor, AsciiEasterEgg) | `/`, `/projects`, `/education`, `/projects/dice`, `/projects/spice`, `/projects/dawntrace`, and the shared chrome: Navbar, SideNav, SectionBar, footer, ThemeToggle, all primitives on `/dev/motion` (in `next dev`) |
| theme-audit-2 | `/resume`, `/card`, `/portfolio-view` (+ ViewToggle) | `/contact`, `/projects/racerbot`, `/projects/yolox-sorting`, `/projects/shape-sorting`, `/projects/engram`, `/projects/stardew-earth` |

Each finding is one BOARD `REVIEW` entry: route, theme, viewport, element, measured contrast or symptom, and `NEEDS: <owning stream>` (per section 7). By wave 2 the owners have finished. The lead either resumes that owner's agent, or posts a BOARD `DECISION` that transfers the named file(s) to the audit stream for that fix. An audit stream never edits a file without that DECISION.

### 8.3 Models and cross-review pairs
SPEC.md has **no section 4.5** (its sections are 0, A-H and "Protocol"). The pairs below follow the lead's list: primitives↔contact, laptop↔gutter, dice↔spice3d, proj-\*↔landing, theme-audit↔reviewer. The other pairs are mine, based on who consumes whose output. A cross-review is **read-only**, runs on the reviewed branch **before** its merge, and is posted as a BOARD `REVIEW`. The lead does not merge a stream until its reviewer has posted.

| Stream | Model | Reviewed by | Why this reviewer |
|---|---|---|---|
| foundation-core | Opus | architect | it implements this contract |
| primitives | **Opus** (see note) | contact | contact is the first heavy consumer (Select, Button states, Toast) |
| contact | Sonnet | primitives | checks primitive usage and focus/error states |
| laptop | Opus | gutter | the sticky full-bleed stage is the hardest gutter case |
| gutter | Sonnet | laptop | |
| edu-content | Sonnet | laptop | laptop renders its screens |
| dice | Opus | spice3d | both are faithful-device reconstructions with "unverified" flags |
| spice3d | Opus | dice | |
| proj-dawntrace, proj-racerbot, proj-mse112, proj-engram, proj-stardew | Sonnet | landing | landing consumes their data and card media |
| landing | Sonnet | proj-stardew | it owns the newest card and the cyberbug data |
| theme-audit-1, theme-audit-2 | Sonnet | reviewer | |
| qa | Sonnet | reviewer | |
| reviewer (final) | Opus | lead | |

Note: I recommend **Opus for primitives**, against the "Sonnet unless there is a reason" default. The reason: it is the only wave-0 stream besides core that every other stream depends on, and its hard parts (listbox and tab ARIA, focus return, a drag knob with rubberband and stretch, transform-origin-from-trigger on open and close) are exactly where a defect would propagate into twelve streams.

---

## 9. Resolved questions and remaining risks

| # | Question / risk | Resolution (lead, round 2) |
|---|---|---|
| Q1 | Visibility of the email | Visible on `/contact` only, server-rendered from `CONTACT_PUBLIC_EMAIL` (4.2). Every other site links to `/contact`. |
| Q2 | Resend sender | `CONTACT_FROM_EMAIL=onboarding@resend.dev`, `CONTACT_TO_EMAIL` = the Resend account email. Verify `vinceong.dev` later. Documented in the README. |
| Q3 | In-memory rate limit is per instance | Accepted, alongside the honeypot and fill-time check. Noted in the README. |
| Q4 | Hover-grow | Reserve, not push: a deliberate reading of SPEC D, with the reasoning recorded in 3.1. |
| Q5 | Reduced motion on scrubbed scenes | Static final state (lid open, steps as a stacked list, no auto-rotate). Orbit stays user-driven. |
| Q6 | AA grey collapse, light `--muted` `#555` | Accepted. Vince sees it in the qa screenshots. |
| Q7 | Stardew Earth naming | "STARDEW EARTH", subtitle "FieldTwin · NASA Space Apps", slug `stardew-earth`. Carries a `TODO(vince)` to confirm, and the final report lists it. |
| Q8 | Rail on project detail pages | Yes. |
| Q9 | `/privacy`, `/terms` links | Removed by foundation-core. No placeholder pages. |
| Q10 | Tracked `tmp-scripts/`, `next.log` | Left to Vince (lead DECISION). Nobody deletes them; the final report lists them. `eslint.config.mjs` ignores `tmp-scripts/**`. |
| R1 | About 12 parallel worktrees, each with `npm ci` (about 1 GB) and `next build` | Cap at about 6 concurrent (8.1 split). Ports in 6.3. |
| R2 | Reload mid-page on `/` shifts the gutter 71 → 44 once after hydration | Accepted. The hydration-safe implementation is in 3.2. |
| R3 | No View Transitions in some browsers | Instant swap (1.7). |
| R4 | `:has()` needs Safari 15.4+, Chrome 105+, Firefox 121+ | Acceptable. The fallback gutter is 0 (overlap possible, nothing breaks). |
| R5 | Canvas and R3F lag behind the VT snapshot | Double rAF inside the VT callback. Scenes subscribe through `useThemeTokens` (1.7). |
| R6 | Remote Wikimedia recognition logos | Monograms unless the lead adds local files. |
| R7 | The codemod is run by hand by the lead | Its `--check` mode is part of every stream's DONE (6.4) and of qa, so a missed or partial run cannot pass silently. |
| R8 | Inline head-script warning or flash not yet observed in a running app | foundation-core verifies it and reports (1.5). The fallback is to keep the script and log it on the BOARD, never `next/script`. |

---

## Changelog
- **2026-11-16, round 2 (freeze):** wave 0 split into foundation-core and primitives; token codemod (1.8); pcb tokens moved to dice; Band; reduced-motion escape hatch; theme-audit review split (8.2); models and review pairs (8.3); worktree bootstrap, ports and DONE commands (6.2–6.4); lead answers Q1–Q10 recorded.
- **2026-11-16, amended after the foundation-core review (lead DECISION):**
  - **1.9 new:** removal of the unlayered `*` reset (option A), baseline screenshots, per-route restoration owners, three qa proofs. Unlayered gutter-class copies deleted.
  - **1.7:** a macrotask (`setTimeout(0)`) replaces the double rAF inside the View Transition callback (the rAF version stalled about 4 s). `useLayoutEffect` for syncing tokens to materials. No caching of empty token snapshots. Theme duration and easing literals inlined in `lib/theme.ts`, checked by `lib/motion.test.ts`. `vt-reveal` CSS lives in `app/globals.css`.
  - **1.5:** `itemProp` on the theme-color meta and `data-scroll-behavior="smooth"` on `<html>` accepted.
  - **3.3 / 3.5:** a Band must be a direct child of `<main>` (or of a full-width wrapper); the gutter test checks the Band's parent.
  - **3.4:** mobile menu overlay `z-[70]`; Navbar `z-[80]` while the menu is open.
  - **4.1:** email allowlist in `data.test.ts`, each owner removes its own entry, qa deletes the list; no card or page prints a literal `TODO(vince)` (qa greps the built HTML); `detail` flags are flipped by each proj stream.
  - **6.1:** 17 public routes, not 15. vitest ^4 accepted. `tmp-scripts/**` ignored by eslint.
  - **8.1:** the steps between 0a and 0b are codemod → baseline → reset removal; primitives branches after the removal commit.
  - **Q10:** left to Vince; nobody deletes `tmp-scripts/` or `next.log`.
  - **Section 7:** lead and qa rows updated for 1.9.
