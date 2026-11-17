# RECON DIGEST (Phase 0)

Condensed from three read-only recon agents (Sonnet) on 2026-11-16. Paths are relative to `vince-portfolio/` unless they start with `../`. Verify against the code before relying on a line number.

## Stack
- Next 15.5.28 App Router, React 19.0.0, TS strict, alias `@/*` → `./*`. `next.config.ts` is `{ reactStrictMode: false }`: **no `output: 'export'`**, so server routes work. Hosted on Vercel (`../.vercel/`, `@vercel/analytics`).
- Tailwind v4 via `@tailwindcss/postcss`, no `tailwind.config.*`; theme lives in `app/globals.css` under `@theme inline`. One CSS module: `app/experience/experience.module.css`.
- `framer-motion` ^12.38 (27 files) and `motion` ^12.40 (only `components/ui/parallax-floating.tsx`). No gsap.
- `three` 0.169, `@react-three/fiber` ^9.6, `@react-three/drei` ^10.7. Only real use: `components/SignatureLogo3D.tsx` (loads `public/vinceonglogo.glb`).
- `next-themes` installed, never imported. `lucide-react`, `clsx`, `tailwind-merge` (`lib/utils.ts` `cn()`).
- Absent: zod, any email SDK, Upstash, any test runner, Playwright. No `app/api/`, no middleware.
- Scripts: `dev`, `build`, `start`, `lint` (`eslint`). No `typecheck`, no `test`. `npx eslint .` is currently clean. No CI, no tests, no `docs/`, no `.claude/`, no CLAUDE.md. README is create-next-app boilerplate.
- `.env.local` exists (gitignored via `.env*`), holds only a Vercel OIDC token.

## Routes
One root layout `app/layout.tsx` (server): Google Fonts via CDN `<link>` (IBM Plex Mono, Outfit, Space Grotesk, Space Mono, Syne), body `min-h-full flex flex-col bg-carbon text-chalk`, renders `AsciiEasterEgg`, `SideNav`, children, `Analytics`. No ThemeProvider, no `suppressHydrationWarning`.

Each route = server `page.tsx` (metadata) + `*PageClient.tsx`. `/` is itself `"use client"`. Every page renders its own `Navbar`, `CustomCursor` and (mostly) `Footer` (`components/ui/footer.tsx`).

| Route | Client file | Notable components |
|---|---|---|
| `/` | `app/page.tsx` (488 lines) | Waves canvas hero, LogosSlider, PlayingCards, AutoTour, ThemeTransition |
| `/about` | `app/about/AboutPageClient.tsx` | WorkingOnStack, vinyl player (61 hardcoded colours) |
| `/projects` | `app/projects/ProjectsPageClient.tsx` | inline `HARDWARE_PROJECTS` / `SOFTWARE_PROJECTS`, DigitalDicePCB |
| `/projects/dice` | `app/projects/dice/DicePageClient.tsx` | DigitalDicePCB |
| `/projects/engram` | `app/projects/engram/EngramPageClient.tsx` | |
| `/projects/spice` | `app/projects/spice/SpicePageClient.tsx` | SpiceDispenser2D |
| `/experience` | `app/experience/ExperiencePageClient.tsx` | `data.ts`, `experience.module.css` |
| `/education` | `app/education/EducationPageClient.tsx` | LaptopScrollReveal |
| `/resume` | `app/resume/ResumePageClient.tsx` | embeds `/resume.pdf`, `bg-black` |
| `/contact` | `app/contact/ContactPageClient.tsx` | static list, no form |
| `/card` | `app/card/CardPageClient.tsx` | no footer |
| `/portfolio-view` | `app/portfolio-view/PortfolioPageClient.tsx` | `fixed inset-0` main, ViewToggle, Dynamic/StaticPortfolio |

Footer links to `/privacy` and `/terms`, which do not exist.

## Navigation
- `components/SideNav.tsx`: `fixed left-0 top-0 h-screen z-[60]`, four tabs (ABOUT, PROJECTS, EXPERIENCE, EDUCATION) each `flex:1`. Rendered only when `innerWidth >= 1024` and only on `/`, `/about`, `/projects`, `/experience`, `/education`. Returns null before mount.
- Width: 57px on unscrolled home, else 30px (`scrollY > 100`); +14px on hover per tab. Inline glass styles with hardcoded dark rgba.
- Sets `--sidenav-gutter` on `documentElement` in an effect (`baseWidth + 14`, or 0 under 1024px). Default in `globals.css:39` is 71px. The effect runs on every route, including those with no rail.
- Consumers: `app/page.tsx:76`, `AboutPageClient.tsx:507`, `ProjectsPageClient.tsx:299`, `EducationPageClient.tsx:126`, `ContactPageClient.tsx:66`. Not used by `/experience`, `/resume`, `/card`, project subpages, the home second section, or the footer.
- Likely colliders: `EducationPageClient.tsx:131,183` year labels at `left-[-60px] md:left-[-100px]`; footer (full width); `LaptopScrollReveal` sticky full-width stage; `/about` h1 (outside the gutter column).
- `components/Navbar.tsx`: `fixed top-0 left-0 right-0 z-50`, links RESUME / CONTACT / BUSINESS CARD on `md+`, hamburger overlay below `md` listing all routes. Scrolled bg `rgba(13,13,13,0.92)`.
- Breakpoints disagree: Navbar `md` (768), SideNav 1024, `hooks/useDeviceType.ts` 640 and 1024. Between 768 and 1023 there is no side rail and no link to ABOUT/PROJECTS/EXPERIENCE/EDUCATION in the top bar.

## Theme (today)
- Tokens in `app/globals.css`: `--void #000000`, `--carbon #0D0D0D`, `--iron #1A1A1A`, `--steel #2E2E2E`, `--silver #A8A8A8`, `--chalk #F2F2F0`, `--accent #3A6B8A`.
- Declared twice: `@theme inline` (lines ~6-20, literal hex, generates `bg-carbon` etc.) and `:root` (lines ~26-40). Because `@theme inline` holds literals, the utilities do **not** follow variable overrides.
- Half-built light mode: `html.theme-light` (lines ~45-80) overrides `:root` vars (`--void #FFFFFF`, `--carbon #FAFAFA`, `--iron #F0F0F0`, `--steel #D0D0D0`, `--silver #666666`, `--chalk #111111`, `--accent #2A5A7A`), plus selection and scrollbar.
- `components/ThemeTransition.tsx`: circle-reveal overlay (800ms, hardcoded `#FAFAFA`/`#0D0D0D`), toggles `theme-light` class; no persistence. The home button (`app/page.tsx:107-118`) calls `handleLightClick`, which only shows an "In progress" notice; `toggleTheme` is never called.
- Token class usage is heavy and uses opacity modifiers: `text-chalk` ×115, `border-steel/15` ×33, `text-silver/{30,40,50,60}`, `bg-iron/{5,30,60}`, `bg-void` ×15.
- Hardcoded colour hot spots (count): `DigitalDicePCB.tsx` 112, `AboutPageClient.tsx` 61, `SpiceDispenser2D.tsx` 27, `globals.css` 26, `CardPageClient.tsx` 20, `DynamicPortfolio.tsx` 15, `EducationPageClient.tsx` 15, `ViewToggle.tsx` 14, `SideNav.tsx` 13, `LaptopScrollReveal.tsx` 13, `app/page.tsx` 9, `AppMarquee.tsx` 8, `ResumePageClient.tsx` 8, `PlayingCards.tsx` 7, then a long tail of 1-6.
- `bg-black` ×9 (home, resume, portfolio-view, PlayingCards, LaptopScrollReveal, about); `text-white`/`bg-white` heavy in `EducationPageClient`.
- Canvas/3D: `Waves.tsx` (stroke/bg props, home passes `#3a3a3a`/`#000000`), `ParticleBackground.tsx` (`#fafafa`), `SignatureLogo3D.tsx` (material `0xe0e5ec`, white drop-shadow glow).
- Focus rings: essentially none (only `.shell a:focus-visible` in the experience CSS). Two places remove outlines with no replacement (`ProjectSquares.tsx:62`, `ContactPageClient.tsx:129`).
- `prefers-reduced-motion`: only in `experience.module.css`. Nothing global.
- Print CSS forces a black background.

## Motion (today)
- Dominant curve `[0.25, 0, 0, 1]` (42 framer uses, 11 CSS). Durations mostly 0.4-0.6s; Tailwind `duration-300` ×42.
- Springs with overshoot potential: `DynamicPortfolio.tsx` (stiffness 300, damping 20/25), `StatCounter.tsx`.
- `lib/utils.ts:63-72` has an unused `EASING` object and `PAGE_TRANSITION`.
- `RevealOnScroll.tsx` is a no-op wrapper.
- No shared primitives at all (no Button, Toggle, Dropdown, Tabs, Popover, Toast, Input). No form elements anywhere.
- Raw buttons: home theme/tour pills, about player controls, `ViewToggle`, `SpiceDispenser2D` controls, `WorkingOnStack` dots, Navbar hamburger, footer scroll-to-top, portfolio download, zoom exits. Non-button click targets: `PlayingCards` card div, `WorkingOnStack` stack, `DigitalDicePCB` SVG text, PDF overlays.

## Content facts (the only facts that may be used)
### Projects (live list: `app/projects/ProjectsPageClient.tsx`)
- `dawntrace` DAWNTRACE, hardware, IN PROGRESS 2026, no detail page. "A bedside sleep companion that silently logs sleep data through the night, then wakes with a gradual sunrise light and rising alarm melody. Built on Arduino with sensor fusion and EEPROM data logging." Skills: C++, Arduino, Sensor Fusion, PCB Design, EEPROM. GitHub `https://github.com/maisinxyz/DAWNTRACE` (from `WorkingOnStack.tsx`). **Conflict:** `WorkingOnStack.tsx` calls it an "Autonomous robotic platform"; the overhaul prompt calls it an ESP32-S3 device with OLED and IR remote.
- `spice` AUTOMATIC SPICE DISPENSER, hardware, COMPLETED 2025 (Sept-Dec 2025), `/projects/spice`, video `/spicedispenserdemovideo.MOV` (31 MB). Stepper motor firmware, 3D-printed assemblies, C++ Arduino.
- `dice` DIGITAL DICE, hardware, COMPLETED 2025 (Sept-Dec 2025), `/projects/dice`. "A mixed-technology PCB using combinational boolean logic to decode binary counter states into 7-segment LED dice patterns. Hand-soldered SMD and through-hole components." Skills: Boolean Logic, PCB, SMD Soldering, EAGLE.
- `engram` ENGRAM, software, ACTIVE 2026 (April 2026 - present), `/projects/engram`, video `/Engramvideodemo.mp4`, live `https://engram-pi-ruddy.vercel.app`. RAG, Supabase pgvector, TypeScript, Python. Gallery is placeholders only.
- `cyberbug` CYBERBUG 2077, software, COMPLETED 2024, no detail page, `https://github.com/maisinxyz/CyberBug2077`, image `/cyberbug2077.png`. Unity/C# 2D platformer.
- **Not in the repo as projects:** Racerbot, MSE 112 YOLOX sorting, MSE 112 shape sorting, Stardew Earth.
- Duplicated, out-of-sync project copy also lives in `lib/utils.ts` (`PROJECTS`, apparently unused), `components/ProjectSquares.tsx`, `components/WorkingOnStack.tsx`, `app/portfolio-view/DynamicPortfolio.tsx`, `app/page.tsx:309-367`.

### Digital dice (`components/DigitalDicePCB.tsx`, 442 lines)
- One inline SVG, `viewBox="0 0 480 380"`. Roll is `Math.random()` every ~66ms while SW1 is held, random again on release. Chips labelled CD4017 and CD4511 are decorative.
- Seven dot LEDs in a dice-pip layout (TL, TR, ML, CC, MR, BL, BR), not a 7-segment display, while the page copy and truth table describe a 7-segment display. Silkscreen "E120-DIE-R2A", "SFU ENSC 120", "BT1 9V". Info text: "SFU ENSC 120 Soldering Project / Random Dice Roller. Mixed-technology PWB using SMD and through-hole components."
- Inferred overlaps: LED2 on C12; "DICE LEDS" label on C12; LED7 pads on C13; R2-R6 left pads on U2's right pins; Q1 pads on C11; U1 right pins and U2 left pins share x=170; info popup under C1/C2/C5/C6.
- No photo, schematic, BOM or report anywhere. All part numbers are unverified.

### Spice dispenser (`components/SpiceDispenser2D.tsx`, 204 lines)
- SVG `viewBox="0 0 200 240"`: three hopper tubes with lids, motor block with three circles, shelf, cup, base with LED, LCD ("Spice 1" / "Dill Weed") and a "FLAVOURINATOR" label.
- Buttons: DISPENSE, CALIBRATE, RESET, OPEN/CLOSE HOPPER. Status strings: IDLE, DISPENSING..., DISPENSE COMPLETE, CALIBRATING..., CALIBRATION COMPLETE, RESET, HOPPER OPENED/CLOSED.
- No CAD, no dimensions. Reference material: `../spice_frame.jpg` (1080x1920 video frame at repo root) and the demo video.

### Education (`app/education/EducationPageClient.tsx`)
- SFU, "Bachelors of Applied Science", "Mechatronic Systems Engineering", "Sept 2025 – Aug 2029", logo `/logos/sfu.png`.
- IB Diploma Programme, "Sept 2023 – Jul 2025", logo `/logos/ib.png`.
- Coursework today (code + title only): ENSC 120 "Electronics Laboratory Instruments Operation and Measurement Techniques"; ENSC 151 "C++ Programming for Engineers"; ENSC 100 "Design Process & Design Lab"; MSE 112 "Python, Sensors, Actuators, and Data Acquisition Techniques". MSE 281 and MSE 250 are not present.
- Recognitions: BC Achievement Scholarship (OCT 2025); Rotary Club of Langley Scholarship (2025); Greg and Brad Follett Memorial Scholarship (2025). Their logos are **remote Wikimedia URLs** (hotlinks).
- "3.7 GPA" appears only in page metadata and `lib/utils.ts`, not on the page.
- `components/LaptopScrollReveal.tsx` (90 lines): CSS-3D div laptop, `h-[200vh]` sticky stage, lid rotateX -100° → -8° on scroll, empty black screen.

### Experience (`app/experience/data.ts`)
One `description` paragraph each, no bullets, no tech arrays, no links.
1. Ernst & Young, Technology Consulting Intern (Microsoft Technology Consulting), May 2027 - Aug 2027, Vancouver, `incoming: true`, `/logos/ey.svg`.
2. Resilient Privacy, Software Engineer Intern, Jul 2026 - Present, Dallas TX remote, `/logos/resilient-privacy.png`. Python and Rust threat-intel pipelines for KANSHI, backend APIs, SQL schemas, tests.
3. SFU Racerbot, Software Developer (Autonomous Racing Team), Jun 2026 - Present, Burnaby, `/logos/sfu-racerbot.png`. C++/Python sensor fusion with ROS2, 2D LIDAR + camera obstacle detection, F1TENTH Gym validation.
4. TELUS Digital AI, Online Data Analyst, Jun 2026 - Present, Remote, `/logos/telus-digital-ai.png`.
5. MECH (Medical Envoys for Community Health), Finance & Development Lead, Aug 2023 - Jul 2025, Langley, `/logos/mech.png`.
- **Venu is not in the repo anywhere.**
- PNE is gone from `data.ts` but survives in `lib/utils.ts` (`EXPERIENCES`), `public/logos/pne.png`, `public/experiences/PNEimage*.jpg`.
- The landing page (`app/page.tsx:214-295`) has its own experience copy (EY, Resilient Privacy, TELUS only) that differs from `data.ts`.

### Assets
- `public/logos/`: `ey.svg`, `ib.png`, `mech.png`, `pne.png`, `resilient-privacy.png`, `sfu-racerbot.png`, `sfu.png`, `telus-digital-ai.png`. No light/dark variants. No Venu logo.
- `public/projects/` does not exist. Resume PDFs: `/resume.pdf` (used by `/resume` and footer) and `/ResumeNew.pdf` (portfolio-view).
- Canonical links: LinkedIn `https://www.linkedin.com/in/vince-ong-9a96a3371/`, GitHub `https://github.com/maisinxyz`. The personal email is hardcoded in `ContactPageClient`, `CardPageClient`, `app/page.tsx`, `DynamicPortfolio`, `AppMarquee`, `footer.tsx`. No phone number in source.

### Stardew Earth
- Nothing in this repo. Sibling `../../NASA-Space-Apps-Challenge` holds only build leftovers (`apps/web/.next`, a tsbuildinfo), no source or README.
- Sibling repos that do exist and may hold project facts: `../../racerbot`, `../../racerbot(personal)`, `../../racerbot_a` (README: "Racerbot Team A is the primary software team at the SFU Racerbot Club, building reactive and mapping algorithms for Roboracer Autonomous Racing Competitions…").
