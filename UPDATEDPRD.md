# PRD — Portfolio Site UI/UX Revision Pass (v2)

```yaml
document_type: engineering_prd
target_executor: claude_code
repo: https://github.com/maisinxyz/vinceongwebsite
project_root: vince-portfolio/          # ALL paths below are relative to this folder unless stated otherwise
stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion 12 + three.js / @react-three/fiber (partial)
package_manager: npm
author: Vince Ong
version: 2.0
status: READY_FOR_IMPLEMENTATION
```

## 0. HOW TO USE THIS DOCUMENT (READ FIRST — AGENT INSTRUCTIONS)

This PRD is written for an AI coding agent (Claude Code) to execute directly against the existing repository. It is **not** a business PRD — it assumes the codebase already exists and describes exact deltas.

RULES FOR THE EXECUTING AGENT:
1. Work through `PHASE 0` → `PHASE 8` **in order**. Each Phase is independent enough to commit separately, but later phases assume earlier ones are done.
2. Each Task has an `AGENT_PROMPT` block. Treat the text inside as the literal instruction to act on — it is written as a self-contained, unambiguous prompt.
3. Every Task lists `FILES_TOUCHED` (exact paths), `CURRENT_STATE` (what exists today, verified against the real repo), and `TARGET_STATE` (what must be true when done).
4. Do **not** invent content, copy, or data not present in this document or the resume data in `PHASE 5`. Where content is explicitly marked `[PLACEHOLDER]`, implement the placeholder mechanism described — do not fabricate real content.
5. After each Phase, run the `VERIFY` checklist for that phase before moving on.
6. Preserve all existing design tokens, fonts, and animation timing curves unless a task explicitly overrides them (see `## 1. DESIGN SYSTEM — DO NOT DEVIATE`).
7. This site uses **Tailwind v4's CSS-first config** (`app/globals.css`, `@theme` block) — there is no `tailwind.config.ts`. Add new tokens there, not in a config file.

---

## 1. DESIGN SYSTEM — DO NOT DEVIATE

Confirmed from `app/globals.css`. Reuse these exactly; do not introduce new colors/fonts.

```css
--color-void:   #000000
--color-carbon: #0D0D0D   /* primary background */
--color-iron:   #1A1A1A   /* card/panel background */
--color-steel:  #2E2E2E   /* borders */
--color-silver: #A8A8A8   /* secondary text */
--color-chalk:  #F2F2F0   /* primary text */
--color-accent: #3A6B8A   /* hover-only accent */
```

Fonts (already loaded via `next/font`/Google Fonts link in `app/layout.tsx`):
- `var(--font-syne-family)` — headings, bold/extrabold
- `var(--font-ibm-plex-mono-family)` — body/mono text
- `var(--font-space-mono-family)` — data labels, tags, uppercase micro-text

Standard easing curve used sitewide: `[0.25, 0, 0, 1]` (Framer Motion) — reuse this for all new animations in this PRD unless stated otherwise.

Shared components already available — **reuse, do not recreate**:
- `@/components/Navbar`, `@/components/ui/footer` (Footer)
- `@/components/CustomCursor`
- `@/components/RevealOnScroll`
- `@/components/SideNav`
- `@/lib/utils` → `cn()` helper (clsx + tailwind-merge)

---

## PHASE 1 — SIDE NAV: RESERVED CONTENT GUTTER (Item #1)

### Context — CURRENT_STATE (verified)

`components/SideNav.tsx`:
- Fixed, `left-0`, `z-[60]`, hidden below `1024px` (`isMobileOrTablet` check).
- `baseWidth` = `57px` on `/` (home) while unscrolled, `30px` everywhere else / once scrolled past 100px.
- On hover, each tab button grows by **+14px** (`width = isHovered ? baseWidth + 14 : baseWidth`).
- So the tab's rendered width ranges from **30px → 71px** depending on page/scroll/hover state.

Content padding today is **inconsistent and disconnected from `SideNav`'s actual width**:
| Page | Left reserve |
|---|---|
| `/about` | `pl-0 lg:pl-48 xl:pl-64` (0 / 192px / 256px) |
| `/education` | `lg:pl-48 xl:pl-64` (192px / 256px) |
| `/projects` | `lg:pl-[80px]` |
| `/experience` | `lg:pl-[80px]` |
| `/` (home) | **none — 0px, confirmed bug** |

This is why tabs visually "interfere" — the home page hero has no reserved space at all, so hero content sits directly under the fixed nav.

### DECISION (confirmed with user)
The reserved gutter must **dynamically track `SideNav`'s own scroll-based width change** (57px → 30px on home scroll) rather than being a single static value. It must also never be undercut by the +14px hover growth.

### TARGET_STATE
A single source of truth for the gutter width, exposed as a CSS custom property that `SideNav.tsx` updates in real time and every page layout consumes identically.

### Task 1.1 — Expose gutter width as a CSS variable from `SideNav.tsx`

```
FILES_TOUCHED: components/SideNav.tsx
```

**AGENT_PROMPT:**
> In `components/SideNav.tsx`, set a CSS custom property `--sidenav-gutter` on `document.documentElement.style` (or on a wrapping element covering the whole app, e.g. via `document.body.style.setProperty`) every time `baseWidth` changes. The value must equal `baseWidth + 14` (i.e., always sized for the fully-hovered state, so hover growth is ALWAYS inside the reserved gutter and never overlaps content). Update it inside the existing `useEffect` blocks that already track `hasScrolled` and `isMobileOrTablet` — when `isMobileOrTablet` is true, set `--sidenav-gutter: 0px` (nav is hidden on those breakpoints, so no gutter is needed). Use a smooth CSS `transition: <value> 0.4s cubic-bezier(0.25, 0, 0, 1)` on whatever wrapper consumes this variable so the gutter resize feels like part of the same motion as the tabs' own width animation (same cubic-bezier already used in `SideButton`'s inline `transition` style).

Concretely, add near the top of the component:
```ts
useEffect(() => {
  if (!mounted) return;
  const gutter = isMobileOrTablet ? 0 : baseWidth + 14;
  document.documentElement.style.setProperty("--sidenav-gutter", `${gutter}px`);
}, [mounted, isMobileOrTablet, baseWidth]);
```
Note: `baseWidth` is currently computed inline in the render body (`const baseWidth = (isHomePage && !hasScrolled) ? 57 : 30;`) — hoist this computation above the new `useEffect` (or move the `useEffect` below where `baseWidth` is declared) so it can be a dependency.

### Task 1.2 — Add the global CSS variable default + transition

```
FILES_TOUCHED: app/globals.css
```

**AGENT_PROMPT:**
> In `app/globals.css`, add a `:root` (or existing top-level) declaration: `--sidenav-gutter: 71px;` as the default (matches the home-unscrolled max state, so there is never a flash of 0 before JS hydrates). Do not remove any existing custom properties.

### Task 1.3 — Replace every page's ad-hoc left padding with the shared variable

```
FILES_TOUCHED:
  app/about/AboutPageClient.tsx
  app/education/EducationPageClient.tsx
  app/projects/ProjectsPageClient.tsx
  app/experience/ExperiencePageClient.tsx
  app/page.tsx   (home — currently has ZERO gutter, this is the confirmed bug)
```

**AGENT_PROMPT:**
> Replace all manually-tuned left-padding classes that exist solely to avoid the SideNav (`pl-0 lg:pl-48 xl:pl-64`, `lg:pl-48 xl:pl-64`, `lg:pl-[80px]`) with an inline style (Tailwind cannot read CSS vars directly in arbitrary values reliably across all these components, so use inline style) applied to each page's outermost content wrapper:
> ```tsx
> style={{ paddingLeft: "var(--sidenav-gutter)" }}
> ```
> Apply this ONLY at `lg:` breakpoint and above (SideNav is hidden below 1024px) — wrap it in a media-query-safe way: keep existing mobile padding classes (e.g. keep `max-lg:px-[clamp(20px,5vw,96px)]`) and only swap the **desktop** left-padding portion for the CSS variable. On `app/page.tsx` (home page), find the hero's outermost content container (search for the top-level wrapper of the Hero section) and add this same inline style — this page currently has no left padding reserved at all, so this is a net-new addition, not a replacement. Do not remove any existing right padding (`pr-` classes) — only the left side changes.
> After this change, re-check `app/about/AboutPageClient.tsx` line ~506 (`lg:col-span-6 lg:col-start-2 flex flex-col pl-0 lg:pl-48 xl:pl-64`) and `app/education/EducationPageClient.tsx` line ~130 (identical pattern) specifically, since both currently hardcode oversized values there.

### VERIFY — Phase 1
- [ ] `--sidenav-gutter` changes value when navigating from `/` (unscrolled) → scroll past 100px → navigate to `/about` (open devtools, inspect computed style on `:root`)
- [ ] No page content is ever visually underneath a `SideNav` tab, including mid-hover, at any breakpoint ≥1024px
- [ ] Below 1024px, gutter is `0px` and no page has awkward empty left space (since nav is hidden there)
- [ ] Home page hero content no longer starts at the literal left edge of the viewport

---

## PHASE 2 — ABOUT PAGE: "CURRENTLY WORKING ON" AS STACKED OVERLAPPING CARDS (Item #2)

### CURRENT_STATE
`app/about/AboutPageClient.tsx` lines ~567–693: a `grid grid-cols-1 sm:grid-cols-2 gap-4` of 4 flat, non-overlapping cards (Engram, DAWNTRACE, 2× "Coming Soon"), each with a solid gradient "cover" block, title, status pill, description, tags, period.

### DECISION (confirmed with user)
Replace the grid with a **stacked index-card style**: cards overlap top-to-bottom with a slight vertical/rotational offset, the top card is visually "active" (fully readable), and each card contains a **static placeholder preview image** inside it. Clicking a card brings it to the front / makes it active.

### TARGET_STATE
A new component `components/WorkingOnStack.tsx` replacing the inline grid in `AboutPageClient.tsx`.

### Task 2.1 — Build the stacked card component
M
```
FILES_TOUCHED: components/WorkingOnStack.tsx (NEW)
```

**AGENT_PROMPT:**
> Create `components/WorkingOnStack.tsx` as a client component. Keep the exact same 4 data entries currently defined inline in `AboutPageClient.tsx` (Engram, DAWNTRACE, and the two "Coming Soon" placeholders) — move this data array into the new file as an exported `WORKING_ON_PROJECTS` constant, preserving every existing field (`title`, `description`, `tags`, `status`, `href`, `period`, `coverGradient`).
>
> Structure:
> - Render each project as an absolutely-positioned card inside a `relative` container sized to roughly `420px` tall (adjust so the fanned stack + full active card both fit).
> - Track `activeIndex` in React state (`useState<number>(0)`).
> - For each card, compute its stack position: `offset = (index - activeIndex + total) % total`. The card at `offset === 0` is "active" (fully on top, no rotation, no translation, full opacity, pointer-events enabled for its own link). Cards at `offset > 0` are pushed behind: `translateY(offset * 14px)`, `translateX(offset * 6px)`, `rotate(offset * 2.5deg)`, `scale(1 - offset * 0.04)`, decreasing `z-index` (`total - offset`), and reduced opacity (e.g. `1 - offset * 0.15`, floor at `0.4`) so they read as "underneath" without disappearing.
> - Add a static preview inside each card: a `div` with `aspect-[16/9]` sized preview area at the top of the card using the project's existing `coverGradient` as the background (this **is** the static placeholder — do not fetch or generate a real screenshot). Overlay a small centered monospace label reading `PREVIEW — IMAGE PLACEHOLDER` at low opacity (e.g. `text-silver/20 text-[8px] tracking-[0.3em]`) so it's visually obvious to Vince where a real screenshot will later be dropped in (see Phase 6 / Item #7 placeholder convention).
> - Clicking any card behind the top one (`offset > 0`) calls `setActiveIndex(index)` — bring it to front — and should NOT navigate (call `e.preventDefault()` on the wrapping anchor, or don't wrap non-active cards in an `<a>` at all; only the active card's outer link is a real navigable `<a>`/`<Link>`).
> - Clicking the currently-active card DOES navigate (same `href`/target-blank behavior currently implemented in `AboutPageClient.tsx`).
> - Animate position changes with Framer Motion (`motion.div` + `animate` prop keyed on the computed transform values), using the sitewide easing curve `[0.25, 0, 0, 1]`, duration `0.45s`.
> - Add small clickable "dot" indicators below the stack (one per project) as an alternative way to bring a specific card to front — reuse the same `setActiveIndex` handler.

### Task 2.2 — Swap the old grid for the new component in `AboutPageClient.tsx`

```
FILES_TOUCHED: app/about/AboutPageClient.tsx
```

**AGENT_PROMPT:**
> In `app/about/AboutPageClient.tsx`, delete the inline `grid grid-cols-1 sm:grid-cols-2 gap-4` block (lines ~580–692, the `.map()` over the inline project array) and the inline project data array. Import and render `<WorkingOnStack />` from `@/components/WorkingOnStack` in its place, inside the existing `"Currently Working On"` heading wrapper (keep the `<h2>` heading exactly as-is; only replace the grid below it).

### VERIFY — Phase 2
- [ ] 4 cards render, visually overlapping top-to-bottom with a fanned offset
- [ ] Clicking a background card brings it to the front with a smooth animation
- [ ] Clicking the front-most (active) card navigates to its `href` (Engram/DAWNTRACE) exactly as it did before
- [ ] "Coming Soon" cards with `href: null` never attempt navigation, active or not
- [ ] Each card shows a placeholder preview block using its existing gradient + a visible "placeholder" label

---

## PHASE 3 — CONTACT PAGE: MINIMALIST REVAMP (Item #3)

### CURRENT_STATE
`app/contact/ContactPageClient.tsx`: giant faint "SAY HI" watermark text, a "004 — CONTACT" pill + heading (same pattern as other pages' headers), then a `grid grid-cols-1 sm:grid-cols-2` of 4 bordered/rounded cards (`bg-iron/30 border border-steel/15 rounded-2xl`) — visually identical in structure to cards used elsewhere on the site (About's bio card, Projects cards, Experience cards).

### DECISION (confirmed with user)
- Remove the "SAY HI" watermark entirely.
- Replace the card grid with a **vertical minimal list, left-aligned, with thin divider lines between items** — no cards, no borders-as-boxes, no rounded panels. This must look structurally different from every other page's card-grid pattern.

### TARGET_STATE

### Task 3.1 — Remove the watermark

```
FILES_TOUCHED: app/contact/ContactPageClient.tsx
```

**AGENT_PROMPT:**
> In `app/contact/ContactPageClient.tsx`, delete the entire `absolute inset-0 flex items-center justify-start ...` block containing the `SAY HI` `<span>` (inside the HERO `<section>`). Keep the rest of the hero section (the "004 — CONTACT" pill, `CONTACT` heading, divider line, subtext) unchanged.

### Task 3.2 — Replace the card grid with a vertical divided list

```
FILES_TOUCHED: app/contact/ContactPageClient.tsx
```

**AGENT_PROMPT:**
> Replace the entire `<section className="pb-32 sm:pb-40">` INFO GRID block (the `grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10` of `CONTACT_INFO` cards) with a single-column vertical list. Keep the existing `CONTACT_INFO` data array exactly as-is (Email, LinkedIn, GitHub, Location — same icons, same values, same hrefs).
>
> For each entry, render a row (NOT a bordered card):
> ```
> [ ICON ]   LABEL                                    VALUE   [→ arrow, only if href exists]
> ─────────────────────────────────────────────────────────────────────
> ```
> - Each row is a `flex items-center justify-between gap-6 py-8` block.
> - Between rows: a single `h-px bg-steel/15` divider (no divider before the first row or after the last).
> - No `border`, no `rounded-*`, no `bg-iron` panel background on the rows themselves — the page background (`bg-carbon`, inherited from `<body>`) shows through directly.
> - Label (`EMAIL`, `LINKEDIN`, etc.) stays small/muted/tracked-out (reuse existing `font-[family-name:var(--font-space-mono-family)] text-silver/40 text-[10px] tracking-[0.25em]` styling from the old card).
> - Value (the actual email/handle/location) becomes the visually dominant element in the row — large, e.g. `text-2xl sm:text-3xl text-chalk`, using `font-[family-name:var(--font-ibm-plex-mono-family)]`.
> - On hover (for rows with an `href`): value text brightens to full white and a small arrow icon (`ArrowUpRight`, already imported) slides in from the left, reusing the existing hover-arrow behavior from the old cards but simplified to a single inline icon next to the value rather than positioned in a card corner.
> - Entire row remains one clickable `<a>` where `href` exists (same `target`/`rel` logic already present for LinkedIn/GitHub vs. Email).
> - Wrap each row in the existing `RevealOnScroll` component with the same staggered `delay={idx * 0.1}` already used.
> - Constrain the whole list to a `max-w-2xl` container (narrower than the current `max-w-7xl` grid) so it reads as a deliberate, tight, minimal column rather than spanning the full page width like the other pages' grids do — this is the primary structural difference that makes Contact look distinct from About/Projects/Experience.

### VERIFY — Phase 3
- [ ] No "SAY HI" watermark text renders anywhere on `/contact`
- [ ] All 4 contact methods (Email, LinkedIn, GitHub, Location) are present with correct values/links, unchanged from current data
- [ ] Layout is a single narrow left-aligned column with thin horizontal dividers — no rounded bordered cards anywhere on the page
- [ ] Visually, side-by-side with `/about`, `/projects`, `/experience`, Contact reads as a clearly different layout pattern (no repeated card-grid silhouette)

---

## PHASE 4 — PROJECTS LIST PAGE: REDUCE DENSITY (Item #4)

### CURRENT_STATE
`app/projects/ProjectsPageClient.tsx`, `ProjectCard` function (~line 150): each card shows media + title + **full multi-sentence description** + **all skill tags as pills** + "VIEW DETAILS" link, repeated for 5 projects across 2 columns (Hardware/Software).

### DECISION (confirmed with user)
Reduce on all three axes simultaneously: shorter description, fewer tags, more spacing.

### Task 4.1 — Trim descriptions to one short line per project (list view only)

```
FILES_TOUCHED: app/projects/ProjectsPageClient.tsx
```

**AGENT_PROMPT:**
> In the `HARDWARE_PROJECTS` and `SOFTWARE_PROJECTS` data arrays, add a new field `shortDescription: string` to each project — a single short clause (≤ 10 words), written from the existing `description` field content (do not invent new facts, just compress the existing sentence). Example: for DAWNTRACE, existing `description` is "A bedside sleep companion that silently logs sleep data through the night, then wakes with a gradual sunrise light and rising alarm melody. Built on Arduino with sensor fusion and EEPROM data logging." → `shortDescription: "Sunrise-alarm sleep companion with sensor fusion and EEPROM logging."` Apply the same compression pattern to all 5 projects. In `ProjectCard`, render `project.shortDescription` instead of `project.description` in the list view. Keep the full `description` field in the data array — it is needed for the detail pages in Phase 5.

### Task 4.2 — Reduce visible skill tags on the list view

**AGENT_PROMPT:**
> In `ProjectCard`, only render the first **3** entries of `project.skills` (`project.skills.slice(0, 3)`). If the project has more than 3 skills, append one small trailing tag reading `+N` (e.g. `+3`) in the same pill style, where `N` is the remaining count. The full skill list still renders in full on the project's detail page (Phase 5) — do not change the underlying data.

### Task 4.3 — Increase spacing

**AGENT_PROMPT:**
> In `ProjectCard`'s root `motion.div`, increase internal padding from `p-4` to `p-6`. Increase the gap between cards in a column from `gap-[100px]` to `gap-[130px]`. Increase the media-to-content margin from `mb-6` to `mb-8`. Do not change card border, radius, or hover behavior (`hover:border-silver/20`, `whileHover={{ y: -4 }}`) — those stay as-is.

### VERIFY — Phase 4
- [ ] Every project card on `/projects` shows a single short description line, max 3 skill tags (+ overflow badge if applicable), and visibly more breathing room than before
- [ ] Full descriptions and full skill lists are untouched in the underlying data (verify by checking the data arrays still contain the original `description` field and complete `skills` arrays)
- [ ] "VIEW DETAILS" links still work and still only appear where `detailPage: true`

---

## PHASE 5 — PROJECT DETAIL PAGES: PER-PROJECT ELEMENTS (Item #5)

### 5A — Engram: Add Image Gallery (placeholder)

```
CURRENT_STATE: app/projects/engram/EngramPageClient.tsx has NO images at all — only an architecture diagram built from icon nodes (`ARCHITECTURE_NODES`) and text.
FILES_TOUCHED: app/projects/engram/EngramPageClient.tsx
```

**AGENT_PROMPT:**
> In `app/projects/engram/EngramPageClient.tsx`, add a new section titled `PRODUCT GALLERY` directly after the existing architecture-diagram section and before the role-highlights section. Render a `grid grid-cols-1 sm:grid-cols-3 gap-4` of **3 placeholder image slots**, each `aspect-video rounded-lg border border-steel/15 bg-iron/20 flex items-center justify-center`, containing a centered muted label `font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.3em]` reading `SCREENSHOT PLACEHOLDER — IMG 1 OF 3` (increment the number per slot). Wrap the whole gallery in the existing `RevealOnScroll` component. This follows the same placeholder convention as Task 2.1's preview cards and the existing "PHOTO COMING SOON" pattern already used in `ExperiencePageClient.tsx` — do not invent a different placeholder style.

### 5B — Spice Dispenser: Replace 3D model with 2D animated SVG illustration

```
CURRENT_STATE: components/SpiceDispenser3D.tsx is a working Three.js/@react-three/fiber scene (BasePlate, CylindricalBody, Hopper, StepperMotor, DispensingSpout meshes) with 4 working controls: Dispense, Calibrate, Reset, Open/Close Hopper, plus OrbitControls drag-to-rotate. Rendered inside app/projects/spice/SpicePageClient.tsx via next/dynamic (ssr:false).
DECISION: Replace with a flat 2D SVG illustration, same 4 interactions, no 3D mesh, no OrbitControls/camera.
FILES_TOUCHED:
  components/SpiceDispenser2D.tsx (NEW)
  app/projects/spice/SpicePageClient.tsx (swap import)
  components/SpiceDispenser3D.tsx (DELETE after swap confirmed working)
```

**AGENT_PROMPT:**
> Create `components/SpiceDispenser2D.tsx` as a client component that visually represents the same machine as a **flat, side-view SVG illustration** — a stack matching the real device: base plate (rectangle), cylindrical body (rounded rectangle silhouette), hopper/funnel with a lid on top (trapezoid + thin rectangle lid), a stepper motor block on the side with a small shaft indicator, and a dispensing spout at the front-bottom. Use the site's monochrome palette for all fills/strokes (`#4a4a4a`, `#7a7a7a`, `#6a6a6a`, `#8a8a8a`, `#5a5a5a`, `#999` — reuse the exact hex values from the deleted `SpiceDispenser3D.tsx` mesh colors so the illustration keeps the same tonal identity) with `stroke="var(--color-steel)"` outlines.
>
> Preserve **all 4 existing interactions and their exact state machine**, ported 1:1 from `SpiceDispenser3D.tsx`'s handlers (`handleDispense`, `handleCalibrate`, `handleReset`, `handleToggleHopper`) and its `status` text states (`IDLE`, `DISPENSING...`, `DISPENSE COMPLETE`, `CALIBRATING...`, `CALIBRATION COMPLETE`, `RESET`, `HOPPER OPENED`/`HOPPER CLOSED`) — reuse the exact same `setTimeout` durations (1200ms dispense, 3000ms calibrate, 2000ms status-reset windows) so behavior timing is unchanged.
>
> Animate the SVG with CSS transforms driven by React state (no `useFrame`/Three.js needed):
> - **Dispense**: animate a small `<g>` group representing the motor shaft with a CSS `rotate` keyframe animation (spin loop) for the 1200ms duration, and animate 4–6 small circle "particles" falling from the spout opening downward with a fade-out, looped every ~200ms while `isSpinning` is true (use Framer Motion `AnimatePresence` + `motion.circle` for this, it's fine to use Framer Motion here — just not `three`/`@react-three/fiber`).
> - **Calibrate**: oscillate the same shaft group back and forth a few degrees (mirror the existing sine-oscillation logic, just applied as a CSS/Framer Motion `keyframes` array instead of a `useFrame` callback).
> - **Hopper toggle**: animate the lid `<g>` rotating open (`rotate(-45deg)` around its hinge point) / closed (`rotate(0)`) with a `transition: transform 0.4s cubic-bezier(0.25, 0, 0, 1)` — same easing as the rest of the site.
> - **Reset**: snaps all of the above back to idle state instantly (matches current `handleReset` behavior).
>
> Keep the exact same **Controls Panel** (4 buttons: DISPENSE / CALIBRATE / RESET / OPEN HOPPER-CLOSE HOPPER) and the **Status LCD Display** block (`STATUS: {status}` with blinking cursor) unchanged — copy that JSX verbatim from `SpiceDispenser3D.tsx`, only the visual/canvas portion above it changes. Remove the `DRAG TO ROTATE · SCROLL TO ZOOM` corner label (no longer applicable, there's no camera) and remove the `[ PLACEHOLDER — 3D MODEL TO BE REPLACED WITH ACTUAL CAD EXPORT ]` footer note (no longer accurate).
>
> In `app/projects/spice/SpicePageClient.tsx`, change the `dynamic(() => import("@/components/SpiceDispenser3D"), ...)` import to `dynamic(() => import("@/components/SpiceDispenser2D"), ...)` (SSR-disabling dynamic import can likely be removed entirely since this is now pure SVG/CSS with no browser-only 3D context — but keep it disabled only if any layout-measurement hooks require client-only rendering; otherwise a normal import is fine and preferred).
>
> After confirming the new component renders and all 4 interactions work, delete `components/SpiceDispenser3D.tsx`.
>
> **Dependency check:** `components/SignatureLogo3D.tsx` also imports `three`/`@react-three/fiber` for an unrelated feature — do NOT remove the `three`, `@react-three/fiber`, `@react-three/drei`, or `@types/three` packages from `package.json`, they are still required by that component.

### 5C — Digital Dice: Detail page uses the PCB visual instead of the 7-segment simulator

```
CURRENT_STATE: app/projects/dice/DicePageClient.tsx currently renders components/SevenSegmentDisplay.tsx (interactive simulator). components/DigitalDicePCB.tsx (the real working-PCB SVG illustration, already used on the Projects list page) is a separate component.
DECISION: Detail page should show DigitalDicePCB instead.
FILES_TOUCHED: app/projects/dice/DicePageClient.tsx
```

**AGENT_PROMPT:**
> In `app/projects/dice/DicePageClient.tsx`, replace the section that renders `SevenSegmentDisplay` with `DigitalDicePCB` (import from `@/components/DigitalDicePCB`, same import already used in `app/projects/ProjectsPageClient.tsx` for reference). Match the sizing/container treatment used on the Projects list page (`w-full h-full flex items-center justify-center bg-[#101722] rounded-lg overflow-hidden`, `!max-w-none w-full` on the component itself) but scale the container up to a larger hero-sized viewer appropriate for a detail page (e.g. `max-w-2xl mx-auto` centered, rather than the small list-card size). Remove the `SevenSegmentDisplay` import and its dynamic-import wrapper entirely from this file if nothing else on the page uses it. Do not modify `components/DigitalDicePCB.tsx` itself or its usage on `ProjectsPageClient.tsx` — that stays exactly as-is.

### VERIFY — Phase 5
- [ ] Engram detail page shows a 3-slot placeholder image gallery with clearly labeled placeholder text
- [ ] Spice dispenser detail page shows a 2D SVG illustration (no WebGL canvas, no `OrbitControls`) with all 4 original interactions still functioning and the same status readout behavior
- [ ] `package.json` still lists `three`/`@react-three/*` (needed by `SignatureLogo3D.tsx`)
- [ ] Digital Dice detail page shows the same `DigitalDicePCB` visual as the Projects list page, at a larger detail-page-appropriate size
- [ ] `components/SpiceDispenser3D.tsx` no longer exists in the repo; `components/SevenSegmentDisplay.tsx` may remain in the repo unused, or be deleted if confirmed unused elsewhere — check for other imports before deleting

---

## PHASE 6 — EXPERIENCE PAGE: REDESIGN + NEW RESUME ENTRIES (Item #6)

### CURRENT_STATE
`app/experience/ExperiencePageClient.tsx`: only 2 entries (Pacific National Exhibition, MECH), each with a large horizontal hero image + logo + bullets + up to 2 side images, `120px` margin between entries.

### DECISION (confirmed with user)
- **Remove** the Pacific National Exhibition (PNE) entry entirely.
- **Keep** the current rich per-entry layout (photo + logo + bullets + side images) — do not compress it structurally.
- **Tighten spacing** between entries.
- **Add 3 new entries** from the updated resume, in this order (matches resume order, newest role first):
  1. Resilient Privacy — Software Engineer Intern
  2. SFU Racerbot (Autonomous Racing Team) — Software Developer
  3. TELUS Digital AI — Online Data Analyst
- Final entry order top-to-bottom: **Resilient Privacy → SFU Racerbot → TELUS Digital AI → MECH**.

### Task 6.1 — Remove PNE, add the 3 new entries

```
FILES_TOUCHED: app/experience/ExperiencePageClient.tsx
```

**AGENT_PROMPT:**
> In `app/experience/ExperiencePageClient.tsx`, delete the entire Pacific National Exhibition object from the `EXPERIENCES` array. Add 3 new entries **before** the MECH entry, using this exact resume-sourced content (do not paraphrase or add facts not listed here):
>
> ```ts
> {
>   company: "Resilient Privacy",
>   role: "Software Engineer Intern",
>   dateRange: "JUL 2026 – PRESENT",
>   location: "Dallas, TX (Remote)",
>   logo: "/logos/resilient-privacy.png",     // file does not exist yet — see placeholder note below
>   logoBg: "#1a1a2e",
>   logoInitials: "RP",
>   image: undefined,                          // no photo yet — falls back to existing "PHOTO COMING SOON" state
>   bullets: [
>     "Architected secure, asynchronous threat intelligence pipelines in Python and Rust, streamlining the ingestion and analysis of real-world security event data for the KANSHI SaaS cybersecurity platform.",
>     "Engineered scalable backend APIs and optimized relational SQL database schemas, implementing strategic indexing to ensure robust data delivery and high-performance querying for a React frontend.",
>     "Fortified production infrastructure by authoring rigorous unit and integration tests, and championed professional Git workflows to guarantee secure-by-default system deployments.",
>   ],
> },
> {
>   company: "SFU Racerbot",
>   subtitle: "Autonomous Racing Team",
>   role: "Software Developer",
>   dateRange: "JUN 2026 – PRESENT",
>   location: "Burnaby, B.C.",
>   logo: "/logos/sfu-racerbot.png",            // file does not exist yet
>   logoBg: "#A6192E",                          // reuse SFU brand red already used on Education page
>   logoInitials: "SR",
>   image: undefined,
>   bullets: [
>     "Contributed on a C++/Python sensor fusion pipeline using ROS2 to combine 2D LIDAR and camera input for obstacle detection.",
>     "Validated autonomous control algorithms in the F1TENTH Gym simulator, streamlining physical testing and mitigating safety-critical bugs prior to hardware deployment.",
>   ],
> },
> {
>   company: "TELUS Digital AI",
>   role: "Online Data Analyst",
>   dateRange: "JUN 2026 – PRESENT",
>   location: "Remote",
>   logo: "/logos/telus-digital-ai.png",        // file does not exist yet
>   logoBg: "#4b286d",
>   logoInitials: "T",
>   image: undefined,
>   bullets: [
>     "Contributed to the training data integrity of real-world AI/ML mapping systems through labeling and evaluation of large-scale geographical datasets.",
>     "Cross-referenced independent data sources to verify location attributes, resolving discrepancies and flagging edge-case anomalies for downstream AI pipelines.",
>     "Conducted auditory evaluations of text-to-speech (TTS) outputs, assessing delivery, emotional inflection, and phonetic accuracy to refine conversational naturalness of generative audio models.",
>   ],
> },
> ```
>
> `CompanyLogo`'s existing `onError` fallback (hides the broken `<img>`, revealing the colored-initials block underneath) already handles missing logo files gracefully — no code change needed there, just reference logo paths that will 404 until Vince supplies real files. Since these 3 entries have no `image`/`sideImages`, confirm the existing conditional rendering (`{exp.image ? <img.../> : <PHOTO COMING SOON block>}` and `{exp.sideImages && exp.sideImages.length > 0 && (...)}`) already handles `undefined` gracefully — it does, based on current code — no change needed to that logic.

### Task 6.2 — Tighten spacing between entries

**AGENT_PROMPT:**
> Reduce the inline `marginBottom` between experience entries from `'120px'` to `'72px'` (in the `style={{ marginBottom: i !== EXPERIENCES.length - 1 ? '120px' : '0px' }}` block). Reduce the hero image height from `h-[200px] sm:h-[240px]` to `h-[160px] sm:h-[200px]` and its bottom margin from `mb-12` to `mb-8`, to help 4 entries breathe better on one page without changing the fundamental photo+logo+bullets+side-images structure.

### VERIFY — Phase 6
- [ ] PNE entry is completely gone from `/experience`
- [ ] 4 entries render in this exact order: Resilient Privacy, SFU Racerbot, TELUS Digital AI, MECH
- [ ] Each new entry shows correct role/dates/location/bullets matching the resume text above exactly
- [ ] Missing logos (`resilient-privacy.png`, `sfu-racerbot.png`, `telus-digital-ai.png`) gracefully fall back to colored initials blocks, no broken-image icons
- [ ] Missing photos show the existing "PHOTO COMING SOON" placeholder state, not a blank/broken box
- [ ] Vertical spacing between entries is visibly tighter than before

---

## PHASE 7 — IMAGE PLACEHOLDER CONVENTION (Item #7 — applies across Phases 2, 5, 6)

This is not a separate page — it's a **standard** to apply everywhere a real image is pending. Do not invent a different placeholder style per section.

**AGENT_PROMPT (apply as a cross-cutting rule):**
> Wherever a real photo/screenshot is not yet available, use this consistent placeholder pattern already established in `ExperiencePageClient.tsx`'s existing "PHOTO COMING SOON" block: a container with a subtle radial-gradient noise texture (`bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.015),transparent_60%)]`) and a centered, muted, tracked-out monospace label in `text-silver/12` to `text-silver/20` range, reading a short all-caps description of what's missing (e.g. `PHOTO COMING SOON`, `SCREENSHOT PLACEHOLDER`). Reuse this exact visual language for: Engram's gallery slots (Phase 5A), the new Experience entries' missing photos (Phase 6, already inherited automatically), and the "Currently Working On" stack's preview images (Phase 2, using each project's existing `coverGradient` plus this same label convention layered on top).

### VERIFY — Phase 7
- [ ] Every placeholder across the site (Engram gallery, new Experience entries, About stack previews) uses the same visual language (same opacity range, same font, same all-caps tracked-out label style) — no two placeholder styles look different from each other

---

## PHASE 8 — EDUCATION PAGE: SCROLL-LINKED LAPTOP OPENING ANIMATION (Item #8)

### CURRENT_STATE
`app/education/EducationPageClient.tsx`: a fixed full-viewport background image (`/stickerpage.png`) with a `bg-black/65` dark overlay behind all content — this is the "sticker background" the user dislikes. Below it: Academic Background (SFU + IB Diploma), Relevant Coursework, and Recognitions sections, unchanged.

### DECISION (confirmed with user)
- Remove the sticker background image entirely.
- Add a **detailed 2D illustration (with shading/gradients) of a laptop**, closed by default.
- As the user scrolls, the lid's rotation is **directly and continuously tied to scroll position** (a scrubbed animation, using Framer Motion's `useScroll` + `useTransform` — this pattern is already used elsewhere in the codebase via `useScroll` in `SideNav.tsx`, follow the same approach).
- This is **not** scroll-jacking/pinning — the page must keep scrolling normally throughout; the lid's rotation is simply a function of how far the user has scrolled past this section.
- The laptop-opening acts as a **hero/intro** at the top of the page; the existing Academic Background / Coursework / Recognitions sections remain below it, unchanged in content, just without the sticker background.

### Task 8.1 — Remove the sticker background

```
FILES_TOUCHED: app/education/EducationPageClient.tsx
```

**AGENT_PROMPT:**
> Delete the two `<div>` elements responsible for the fixed background image and dark overlay (`style={{ backgroundImage: "url('/stickerpage.png')" }}` and the `bg-black/65` overlay directly below it). The page should fall back to the standard site background (`bg-carbon`, inherited from `<body>` in `app/layout.tsx`) — do not add a replacement background image.

### Task 8.2 — Build the scroll-linked laptop illustration component

```
FILES_TOUCHED: components/LaptopScrollReveal.tsx (NEW)
```

**AGENT_PROMPT:**
> Create `components/LaptopScrollReveal.tsx` as a client component. Build a laptop illustration as layered SVG (or absolutely-positioned divs with `clip-path`/`border-radius`/gradients — whichever renders a cleaner illustrated result) consisting of two parts:
> 1. **Base** (keyboard deck): a wide rounded-rectangle shape, static, does not move.
> 2. **Lid** (screen): a rounded-rectangle hinged at the bottom-back edge of the base, rendered with `transform-style: preserve-3d` and `perspective` on the parent wrapper so the rotation reads as a believable hinge-opening motion rather than a flat 2D squash.
>
> Give both parts a "detailed 2D illustration with shading/gradients" treatment (per the confirmed direction): use multi-stop `linear-gradient`/`radial-gradient` fills in the site's monochrome palette (`--color-iron` → `--color-steel` → `--color-carbon` stops) to imply curvature and material depth on the lid and base surfaces, plus a thin `--color-silver` rim-light stroke along the top edge of the lid, and a soft drop-shadow beneath the base to ground it on the page. The lid's inner "screen" face (visible once opened) should be a flat `--color-void`/`--color-carbon` panel — do not render any content ON the screen itself (per the confirmed direction, this is a hero/intro element, not a content-projection surface).
>
> Wire up the scroll-linked rotation:
> ```tsx
> const ref = useRef<HTMLDivElement>(null);
> const { scrollYProgress } = useScroll({
>   target: ref,
>   offset: ["start end", "end start"], // adjust as needed so the animation completes within a natural scroll distance through this section
> });
> const lidRotation = useTransform(scrollYProgress, [0, 0.6], [-100, -8]);
> // -100deg ≈ closed (lid flat against base), -8deg ≈ fully open (leaves a slight tilt for visual interest rather than a perfect 90°/180°)
> ```
> Apply `rotateX` (or the appropriate axis given how the hinge is oriented in your markup) via `style={{ transform: mv }}` where `mv` is a `useMotionTemplate` or direct `motion.div style={{ rotateX: lidRotation }}` binding — no `useEffect`/manual scroll listeners, use Framer Motion's scroll-linked primitives directly (already a project dependency, already used pattern-adjacent in `SideNav.tsx` via plain `useScroll`).
> The container `ref` should wrap a section roughly `150vh`–`200vh` tall so there's enough scroll distance for the rotation to feel like a deliberate scrub rather than snapping open in one wheel-tick. The page must NOT stop scrolling during this — `position: sticky` is acceptable for keeping the laptop visually centered while its OWN rotation progresses, but do not use scroll-jacking libraries or `preventDefault` on wheel/touch events; if using `position: sticky`, the sticky element still allows the user's scroll to continue driving `scrollYProgress` to completion and then release into the sections below it, so the user experience is a smooth, continuous scroll the whole time.

### Task 8.3 — Mount the laptop hero section on the Education page

```
FILES_TOUCHED: app/education/EducationPageClient.tsx
```

**AGENT_PROMPT:**
> Import `LaptopScrollReveal` from `@/components/LaptopScrollReveal` and render it directly below the existing page `<header>` (the `EDUCATION` title + subtitle block), and above the `DEGREES SECTION`. Do not alter the header or any section below it — this is purely additive as a new hero block between the existing title and the existing content grid.

### VERIFY — Phase 8
- [ ] `/stickerpage.png` background and dark overlay no longer render on `/education`
- [ ] A closed laptop illustration is visible near the top of the page on load
- [ ] Scrolling down smoothly rotates the lid open, tied directly to scroll position (scrubbing up/down reverses the animation accordingly, since it's driven by `scrollYProgress`, not a one-shot trigger)
- [ ] The page never stops responding to scroll input / never scroll-jacks — the user can scroll straight through the laptop section into Academic Background without any lock-up
- [ ] Existing Academic Background, Coursework, and Recognitions sections are visually and functionally unchanged aside from the removed background

---

## 9. FULL EXECUTION CHECKLIST (condensed, for tracking)

- [ ] Phase 1 — SideNav gutter CSS variable + all 5 pages consuming it (incl. home page fix)
- [ ] Phase 2 — `WorkingOnStack.tsx` stacked overlapping cards on About
- [ ] Phase 3 — Contact page vertical minimal list, watermark removed
- [ ] Phase 4 — Projects list density reduction (description/tags/spacing)
- [ ] Phase 5A — Engram placeholder image gallery
- [ ] Phase 5B — Spice dispenser 2D SVG replacing 3D mesh
- [ ] Phase 5C — Digital Dice detail page shows `DigitalDicePCB` instead of `SevenSegmentDisplay`
- [ ] Phase 6 — Experience: PNE removed, 3 new entries added, spacing tightened
- [ ] Phase 7 — Placeholder convention consistent sitewide
- [ ] Phase 8 — Education sticker background removed, scroll-linked laptop illustration added

## 10. OPEN ASSUMPTIONS (flag back to Vince if any are wrong)

- [ASSUMPTION] Gutter width reserves for the fully-hovered state (`baseWidth + 14`) at all times, so hover growth never touches content — confirm this reads correctly rather than feeling like "too much" empty space on non-home pages (30+14=44px) vs home (57+14=71px).
- [ASSUMPTION] Engram gallery uses 3 placeholder slots — adjust the count freely, it's arbitrary.
- [ASSUMPTION] New Experience entries' `logoBg` colors are new arbitrary picks (Resilient Privacy `#1a1a2e`, TELUS `#4b286d`) since no brand color was specified — swap if you have exact brand hex values.
- [ASSUMPTION] Tie-break order for SFU Racerbot vs. TELUS Digital AI (both start June 2026) follows the order they appear in the resume — flag if you want a different order.
- [ASSUMPTION] `components/SevenSegmentDisplay.tsx` is left in the repo (unused) rather than deleted, in case it's wanted elsewhere later — delete it if you'd rather keep the repo clean, after confirming no other page imports it.