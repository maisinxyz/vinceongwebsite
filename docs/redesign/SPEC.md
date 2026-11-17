# SPEC: Vince's requirements (hard rules and acceptance criteria)

Transcribed from Vince's overhaul prompt. Where it conflicts with the repo, trust the repo for facts (file names, libraries, tokens) and this document for intent. Lead decisions that refine it are in `BOARD.md`.

## 0. Hard rules
1. Read the repo first.
2. **Keep the existing colour scheme and aesthetic.** Extend it. Do not replace it.
3. **No fabrication.** Do not invent resume facts, grades, metrics, project features or links. If a fact is missing, use a clearly marked placeholder (`TODO(vince): ...`) and report it.
4. **No secrets in code.** The destination email address and API keys live in environment variables only. Never hardcode the personal email in client code or commit `.env*` files. Do not put the phone number anywhere on the site.
5. **Do not hotlink logos or images.** Use files in `public/`. (Vince has since asked the lead to download the company logos into `public/logos/`; only the lead does that.)
6. **Accessibility:** WCAG AA contrast (4.5:1 body, 3:1 large text/UI) in BOTH themes. Visible focus rings. Respect `prefers-reduced-motion` (swap to opacity-only fades). Keyboard operable everywhere.
7. **Performance:** lazy-load heavy code (`next/dynamic`, `ssr:false` for Three.js and canvas). No layout shift from the theme script or the nav gutter.
8. Run lint, typecheck and build after every merged stream. Never merge a red build.
9. Commit per stream with clear messages. Never push to `main`. Work only on `redesign/v3` (or a worktree branched from it).

## A. Contact page: make it actually send email
- Form: name, email, optional topic dropdown (General / Internship or Co-op / Project collaboration), message. Delivered to Vince automatically. No `mailto:` copy-paste flow.
- Server route `POST /api/contact`: validate with zod, trim and length-cap fields, reject header-injection characters in name/email/topic, honeypot field, minimum fill-time check, per-IP rate limit (in-memory), `Reply-To` = sender, typed JSON errors. Provider: Resend (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`).
- Client states: `idle → sending → success | error`, inline field errors, preserved input on failure, and a `mailto:` fallback link shown only on error.
- Look: minimal, left-aligned vertical list with thin dividers, no "SAY HI" watermark, shows GitHub / LinkedIn / Email / location. The form must fit that minimalist language, not look like a generic card.
- `.env.example` documenting variables, plus a short README section for setup and deployment env vars.
- Tests: unit-test the validator and route (mock the provider).

## B. Motion system (ALL buttons and interactive UI)
One shared motion layer (`lib/motion.ts` and CSS variables) and shared primitives (Button, IconButton, Toggle/Knob, Dropdown/Select, Popover, Tabs, Toast). Use the repo's animation library.

| Rule | Implementation |
|---|---|
| Ease-out for entrances | `cubic-bezier(0.22, 1, 0.36, 1)`, 200–300 ms |
| Ease-in-out for moves | `cubic-bezier(0.65, 0, 0.35, 1)`, 250–400 ms |
| Dropdowns 150–250 ms | open 220 ms |
| Exits 20% faster than entrances | exit = 0.8 × enter (dropdown close ≈ 176 ms) |
| Scale to 0.97 on press | `:active` / pointerdown, 80 ms in, 160 ms ease-out back |
| Don't tween while held | While pressed or dragging, bind values directly to the pointer (no easing, no transition). Tween only on release |
| Stretch moving knobs 12% | Toggle/slider knob gets `scaleX(1.12)` along its travel axis while moving, returns to 1 on settle |
| Stagger as details settle | Container first, then icon, label, secondary details at 30–50 ms steps |
| Arcs for moving objects | Anything travelling between two points follows a curved path (offset-path or split x/y easing), not a straight line |
| Pulse to confirm success | One ring pulse (scale 1 → 1.15 → 1 with fading opacity, ~450 ms) plus a check drawn by a mask |
| Start popovers at 0.95 | `scale(0.95)` and `opacity:0` to 1 |
| Enter from trigger / exit to trigger | `transform-origin` computed from the trigger's rect, for open and for close |
| No bounce on everyday UI | Critically damped or pure easing. No overshoot oscillation anywhere |
| Overlap new and old states | Old and new states crossfade simultaneously |
| Masks for reveals and occlusions | `clip-path` or `mask-image` for reveals (theme switch circular reveal, check draw, button label swap) |
| Crossfade icons with blur | Icon swaps use opacity plus `blur(4px → 0)` plus `scale(0.8 → 1)`, 150–200 ms |
| Rubberband past bounds | Resistance `r(x) = (1 − 1/(x·0.55/limit + 1))·limit`, release back with ease-out (no bounce) |

"Rubberband" means resistance and a smooth return, not an elastic wobble. `prefers-reduced-motion` collapses everything to a 120 ms opacity fade.
Deliver a `/dev/motion` sandbox page demonstrating every rule, gated behind `NODE_ENV !== 'production'`.

## C. Education page
1. **Laptop opens as the page scrolls.** Detailed 2D illustration (shading and gradients). Lid angle scrubbed directly by scroll progress: no scroll-jacking, native scrolling. Tall track with a `position: sticky` laptop. Progress 0–0.4 opens the lid; 0.4–1 steps through the content **on the laptop screen**. No easing lag while scrubbing. Small rubberband and settle on the final state.
2. **All education info is rendered on the laptop screen** (looks like a UI inside the screen): program header (BASc Mechatronic Systems Engineering, SFU, Sept 2025, expected 2029), recognitions or scholarships already in the repo, then course cards. Readable in both themes.
3. Fix the left-tab overlap (see D).
4. **Relevant coursework**: add these with ONLY these topics, as concise concrete bullets:
   - **MSE 112**: Python, Raspberry Pi, computer vision
   - **ENSC 151**: C++ programming, version control
   - **ENSC 100**: design project, engineering workflow
   - **MSE 281**: ODEs for circuits, mass-spring-damper (MSD) systems
   - **MSE 250**: circuits
   - **ENSC 120**: laboratory instrumentation
   Existing courses stay. Link a course to a project where one clearly exists (MSE 112 → shape sorting / YOLOX, ENSC 100 → spice dispenser, ENSC 120 → digital dice). No grades or claims.
5. Mobile: laptop scales down, screen content reflows, no horizontal scroll.

## D. Left tabs overlap (all pages)
- A **dynamic reserved gutter**: CSS variable `--nav-gutter` that tracks the tabs' own shrink-on-scroll and hover-grow, applied to the page container, every page title, every footer, every full-bleed section and every `position: fixed/absolute` element.
- Audit EVERY route at 360, 768, 1280 and 1920 px. Nothing may sit under the tabs. On small screens the tabs collapse into a top or bottom bar with its own reserved space.
- A Playwright test asserting no element's bounding box intersects the tab rail on any route.

## E. Projects (list and detail pages)
- Add **Stardew Earth** as the newest software project (card plus detail page) with a graphic (SVG or canvas, site aesthetic, pixel/farm-sim flavour). No invented features.
- **Every project page gets its own unique interactive "screen"**, not a shared template:
  - **Spice dispenser (ENSC 100)**: a real 3D model (react-three-fiber, lazy-loaded) that looks like the physical device, with working buttons and screen (Dispense / Calibrate / Reset / Hopper, display responding). Orbit controls with rubberband bounds. Proportions flagged approximate.
  - **Digital Dice (ENSC 120)**: see F.
  - **DAWNTRACE** (ESP32-S3 sleep companion): interactive device mock with OLED and IR-remote menu, sleep log and sunrise sequence.
  - **Racerbot**: top-down track viewer with animated LiDAR rays and an emergency-brake demo.
  - **MSE 112 YOLOX cat/dog sorting**: detection canvas with bounding boxes and a Nano/Tiny/Small model comparison toggle.
  - **MSE 112 shape sorting (MasterPi)**: OpenCV-style contour overlay demo (circle/triangle/square).
  - **Engram** (RAG search over company knowledge): ingestion-pipeline visualiser (documents → chunks → embeddings → index) plus a mock search UI. Vince's part was the backend ingestion pipeline; make that the focus.
  - **Stardew Earth**: e.g. globe with waypoints, zoom-to-farm.
  Each must differ visually and behaviourally.
- Projects list stays uncluttered (shorter descriptions, fewer tags, more spacing). Missing images use placeholders.

## F. Digital Dice (ENSC 120): faithful and functional
- Current implementation overlaps and is wrong. Rebuild it.
- Research first (web + repo). A first pass found only generic designs (555 oscillator, counter, decoder, display). No SFU-specific spec was found, so do not guess the real board; build from the existing `DigitalDicePCB` plus the generic architecture, clearly flagged unverified.
- **Layout:** single SVG, fixed `viewBox`, a component table (id, x, y, w, h, rotation, pins). A script that fails the build if any two component bounding boxes (including labels and traces) overlap.
- **Behaviour:** logic-level simulation (oscillator → counter wrapping 6→1 → decoder → display), not `Math.random()`. Press-and-hold cycles fast; release latches. Unit tests (all 6 faces, wrap, hold/release).
- The detail page and the Projects list use the same component.

## G. Landing page
- **Readability:** AA contrast, heavier/larger where text is thin, subtle scrim behind text over imagery or animated backgrounds.
- **Projects and Experience sections:** richer cards (logo, role, dates, one-line impact, tech chips, mask hover reveal, staggered entrance). Real facts only. The PNE entry stays removed.
- **Company logos** from `public/logos/` (light/dark variants where needed).
- **Direct-link buttons** from each experience to related projects and from each project to its detail page, plus quick links (GitHub, LinkedIn, Contact, resume).

## H. Light mode (whole site)
- Theme toggle in the nav (icon crossfade with blur, circular `clip-path` reveal via the View Transitions API with a fallback).
- **Persistence:** `localStorage` key `theme: "light" | "dark"`. A **blocking inline script in `<head>`** sets `data-theme` before first paint (no flash). Default dark. Set `color-scheme` and `<meta name="theme-color">` per theme.
- Move every hardcoded colour into semantic CSS variables (`--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`, …) with a dark set and a light set in the same hue family.
- Audit: text, borders, shadows (soft shadows in light mode instead of glows), images and logos, SVG illustrations, Three.js/canvas scenes (read tokens, update on theme change), selection, scrollbars, focus rings, form fields, code blocks, dividers.
- Playwright screenshots of every route in both themes at 3 viewports, plus a reload-persistence test.

## Protocol for every agent
- Start by reading `docs/redesign/BOARD.md`, `RECON.md`, this file and (once it exists) `CONTRACT.md`.
- Edit only files you own under the contract. A problem in someone else's file goes on the BOARD and in your report, never as a silent edit.
- Append BOARD entries in the given format (get the time with `date "+%Y-%m-%d %H:%M"`).
- End with a report: `DONE / OPEN QUESTIONS / PROPOSALS / RISKS / FILES TOUCHED`.
