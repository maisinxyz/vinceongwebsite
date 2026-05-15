# PRD: Vince Ong — Personal Resume Website
**Target:** Mechatronic, Software, and Mechanical/Aerospace Engineering Employers  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Three.js  
**Design Direction:** Modern Brutalist — dark engineering aesthetic; raw grid structures with surgical precision, machine-like animations, and monochromatic depth  

---

## 1. VISION & AESTHETIC DIRECTION

### Design Language
- **Palette:** Deep charcoal (`#0D0D0D`), true black (`#000000`), off-white (`#F2F2F0`), silver (`#A8A8A8`), accent steel blue (`#3A6B8A`) for subtle hover cues only
- **Typography:**
  - Display/Headings: `Syne` (geometric, engineered feel) — import from Google Fonts
  - Body: `IBM Plex Mono` (monospaced, technical credibility)
  - Data Labels: `Space Mono` for numbers and metric callouts
- **Motion Philosophy:** Mechanical — think CNC machines, hydraulics, and circuit board traces. No bounce, no spring. Precision linear easing or sharp cubic beziers. Staggered reveals on scroll.
- **Texture:** Subtle noise grain overlay on backgrounds (SVG filter). Horizontal rule dividers that "draw in" via clip-path animation. Fine-grid pattern in hero background (CSS grid lines, low opacity).
- **Unforgettable Element:** A "system boot" loading sequence on first visit — terminal-style text that types out engineering specs before the site appears. Feels like initializing hardware.

---

## 2. SITE ARCHITECTURE (Pages)

```
/                   → Landing / Hero
/about              → Extended About + Skills Matrix
/projects           → Projects Hub (cards grid)
/projects/engram    → Engram deep-dive
/projects/spice     → Spice Dispenser deep-dive (3D model viewer HERE)
/projects/dice      → Digital Dice deep-dive
/experience         → Experience Timeline
/contact            → Contact page
```

All pages share a persistent top navigation bar and footer.

---

## 3. IMPLEMENTATION TASKS — ORDERED & EXHAUSTIVE

---

### PHASE 0 — Project Scaffold

**Task 0.1 — Initialize Next.js Project**
```bash
npx create-next-app@latest vince-portfolio \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd vince-portfolio
```

**Task 0.2 — Install All Dependencies**
```bash
npm install framer-motion three @react-three/fiber @react-three/drei \
  lucide-react clsx tailwind-merge next-themes
npm install --save-dev @types/three
```

**Task 0.3 — Configure Tailwind**
- Extend `tailwind.config.ts` with custom colors:
  ```js
  colors: {
    void: '#000000',
    carbon: '#0D0D0D',
    iron: '#1A1A1A',
    steel: '#2E2E2E',
    silver: '#A8A8A8',
    chalk: '#F2F2F0',
    accent: '#3A6B8A',
  }
  ```
- Add custom font families: `syne`, `ibm-plex-mono`, `space-mono`

**Task 0.4 — Global CSS Setup (`app/globals.css`)**
- CSS custom properties mirroring Tailwind palette
- SVG noise grain overlay as a `::after` pseudo-element on `body` (opacity 0.035)
- Thin horizontal scan line animation (keyframe, very subtle)
- Custom scrollbar: 2px wide, charcoal track, silver thumb
- Selection highlight: silver bg, black text
- CSS grid-line background for hero section (repeating-linear-gradient, opacity 0.04)

**Task 0.5 — Font Loading (`app/layout.tsx`)**
- Load `Syne` (weights 400, 700, 800) and `IBM Plex Mono` (weights 400, 500) and `Space Mono` (weight 400, 700) via `next/font/google`
- Apply as CSS variables: `--font-syne`, `--font-mono`, `--font-data`

**Task 0.6 — Create Utility File (`lib/utils.ts`)**
- `cn()` helper using `clsx` + `tailwind-merge`
- `formatDate()` helper
- `stagger()` helper returning Framer Motion stagger config

---

### PHASE 1 — Shared Components

**Task 1.1 — Boot Loader Screen (`components/BootLoader.tsx`)**

This is the signature first-impression element. Logic:
- Full-screen black overlay on top of everything
- On mount, types out a terminal sequence character by character:
  ```
  INITIALIZING SYSTEM...
  > UNIT: Vince Ong
  > DISCIPLINE: Mechatronic Systems Engineering
  > STATUS: Available for deployment
  > BUILD: v1.0.0 — 2026
  SYSTEM READY.
  ```
- Each line appears sequentially with a 40ms/char typing speed
- A blinking cursor `_` follows the active line
- After the final line, a 600ms pause, then the overlay slides up (Y: 0 → -100%) over 800ms with a sharp ease-in
- Store "booted" flag in `sessionStorage` so it only plays once per session
- Full monospace font, green-tinted silver text (`#C0C0C0`), pure black bg

**Task 1.2 — Navigation Bar (`components/Navbar.tsx`)**
- Fixed top, full width, `z-50`
- Left: `V.ONG` wordmark in Syne 700, white — links to `/`
- Right: nav links in IBM Plex Mono, uppercase, letterspacing 0.2em: `ABOUT / PROJECTS / EXPERIENCE / CONTACT`
- Active link: bottom border 1px solid silver, animates in on hover with clip-path left-to-right reveal
- On scroll past 80px: navbar bg transitions from transparent to `rgba(13,13,13,0.92)` with `backdrop-filter: blur(8px)` — smooth 300ms transition
- Mobile: hamburger icon (3 horizontal lines → X morph animation); menu slides down from top as full-width overlay
- Hamburger lines are CSS-drawn, animate via rotation transform

**Task 1.3 — Footer (`components/Footer.tsx`)**
- Minimal: `VINCE ONG © 2026` left | `BUILT WITH PRECISION` right — both in Space Mono, silver, small
- Center: three icon links (LinkedIn, GitHub, Email) with hover scale + color shift
- Top border: 1px silver, has a "charging" animation on page load — border draws from left to right via clip-path

**Task 1.4 — Cursor (`components/CustomCursor.tsx`)**
- Replace default cursor with two elements:
  1. Small filled circle (6px), follows cursor exactly, no lag
  2. Larger ring (32px), follows with 80ms lerp delay
- On hovering links/buttons: ring expands to 48px, fills with silver at 15% opacity (mix-blend-mode: difference)
- On hovering the 3D model viewer: cursor becomes a crosshair
- Hide on mobile (pointer: coarse media query)

**Task 1.5 — Section Reveal HOC (`components/RevealOnScroll.tsx`)**
- Framer Motion `motion.div` using `useInView` with `once: true`, `margin: "-100px"`
- Default animation: `opacity: 0, y: 30` → `opacity: 1, y: 0`, duration 0.6s, ease `[0.25, 0, 0, 1]`
- Accepts `delay` prop for staggering children
- Wrap every major section in this component

**Task 1.6 — Section Divider (`components/Divider.tsx`)**
- A horizontal rule that animates its width from 0% to 100% when it enters the viewport
- 1px height, silver color, drawn left-to-right over 0.8s
- Optional label prop: renders label centered above the line in Space Mono uppercase

**Task 1.7 — Stat Counter (`components/StatCounter.tsx`)**
- Animates a number from 0 to target when it enters viewport
- Used for: GPA (3.7), Assets Scaled (250%), Years experience, etc.
- Uses `useMotionValue` + `useSpring` from Framer Motion
- Displays value with optional prefix/suffix (e.g., `+250%`, `3.7`)

---

### PHASE 2 — HOME PAGE (`app/page.tsx`)

**Task 2.1 — Hero Section**

Layout: Full viewport height. Left-aligned content, right side has abstract visual element.

Left column content (staggered reveal, 100ms between each):
1. Pre-label: `[ MECHATRONIC SYSTEMS ENGINEER ]` — Space Mono, silver, small caps
2. Name: `VINCE` then `ONG` — massive Syne 800, white, line-height 0.9, very large (clamp 64px–140px)
3. Sub-tagline: `Firmware. Systems. Products.` — IBM Plex Mono, silver
4. Three descriptor pills: `[ EMBEDDED SYSTEMS ]` `[ AI / SAAS ]` `[ PCB DESIGN ]` — monospace, bordered, silver. Hover: fill with iron, text white.
5. Two CTAs: `VIEW WORK →` (filled, chalk bg, black text) and `DOWNLOAD CV` (outline, silver border)
   - `VIEW WORK` scrolls to projects section
   - `DOWNLOAD CV` links to resume PDF (place in `/public/resume.pdf`)

Right column visual:
- A CSS + SVG animated "circuit board trace" graphic — paths that draw themselves using `stroke-dashoffset` animation
- Lines form a minimal abstract PCB layout with nodes (circles) at junction points
- Nodes pulse subtly (scale 1 → 1.2 → 1, 3s loop, staggered starts)
- This is purely decorative and communicates engineering identity immediately

Background:
- Fine dot grid (radial-gradient based, very subtle, 0.06 opacity)
- A large, barely-visible `V` character in Syne 800 behind everything, 5% opacity, silver — creates depth

**Task 2.2 — Scroll Indicator**
- Bottom center of hero: animated chevron pointing down, gentle bounce
- Text: `SCROLL` in Space Mono, rotated 90°, silver
- Fades out when user scrolls past 200px

**Task 2.3 — Stats Bar (between Hero and About strip)**
- Full-width horizontal band, `iron` background, 1px silver borders top and bottom
- Four stat blocks separated by vertical 1px lines:
  - `3.7` GPA / `SIMON FRASER UNIVERSITY`
  - `3` ENGINEERING PROJECTS
  - `250%` ASSET GROWTH AT MECH
  - `2` YEARS LEADERSHIP EXPERIENCE
- Numbers animate via StatCounter component on scroll-into-view
- On mobile: 2×2 grid

**Task 2.4 — About Strip (Homepage)**
- Left: Short paragraph intro — who Vince is, what he's pursuing, one sentence punchy mission statement
  > "I build things that work — from stepper motor firmware to AI platforms. Currently studying Mechatronic Systems Engineering at SFU, with a 3.7 GPA and a bias toward shipping."
- Right: Quick skills tags in two columns: Programming, Hardware, Tools — each tag is a monospace pill
- CTA: `READ MORE ABOUT ME →` links to `/about`

**Task 2.5 — Featured Projects (3 cards)**
- Heading: `SELECTED WORK` with Divider component, animated in
- Three project cards, horizontal row (scrollable on mobile):
  - Engram (featured/large), Spice Dispenser, Digital Dice
- Each card:
  - Background: `iron` with subtle hover transition to `steel`
  - Top: A colored accent bar (1px, full width) — unique color per project (very subtle variation in silver/steel tones)
  - Project name in Syne 700
  - Tech stack tags
  - One-liner description
  - Year badge (Space Mono, top-right)
  - On hover: card lifts 4px (translateY), border changes to silver, an arrow icon slides in from the left
  - Clicking links to project deep-dive page
- The Engram card is visually larger/featured — spans 2 columns on desktop

**Task 2.6 — 3D Viewer Teaser Section**
- A preview strip for the Spice Dispenser 3D model
- Headline: `PHYSICAL TO DIGITAL — INTERACT WITH THE BUILD`
- Sub: `Spin, inspect, and operate a virtual replica of the automatic spice dispenser.`
- A placeholder 3D canvas (see Phase 5 for full implementation)
- CTA button: `LAUNCH INTERACTIVE MODEL →` links to `/projects/spice`
- Background: pure black section, makes the 3D canvas pop

**Task 2.7 — Experience Teaser**
- A compact timeline strip showing 3 experience items (MECH Finance Lead, PNE, SFU)
- Each item: left dot + connecting line + company + role + date range
- CTA: `FULL TIMELINE →` links to `/experience`

**Task 2.8 — Contact CTA Band**
- Full-width section, chalk background, black text (inverted from rest of site)
- Large headline: `LET'S BUILD SOMETHING.`
- Sub: `Open to internships and co-op placements in mechatronic, software, and mechanical/aerospace engineering.`
- Two CTAs: `SEND AN EMAIL` and `CONNECT ON LINKEDIN`

---

### PHASE 3 — ABOUT PAGE (`app/about/page.tsx`)

**Task 3.1 — Page Hero**
- Smaller hero than homepage. Left: `ABOUT` in giant faded background text (Syne, 10% opacity). Foreground: proper heading and one-liner
- Animated underline on `ABOUT` heading that draws from left to right on load

**Task 3.2 — Bio Section**
- 3 paragraphs:
  1. Background: IB diploma, SFU Mechatronics, academic performance
  2. Technical identity: embedded systems, AI SaaS co-founder, hardware-software bridge
  3. Ambition: what kinds of roles and industries excite him (aerospace, robotics, AI infrastructure)

**Task 3.3 — Skills Matrix**
This is the standout element of the About page. Instead of a boring list, render an interactive grid:
- Rows: categories (Languages, Hardware, Software/Tools, Methodologies)
- Columns: proficiency (Familiar → Proficient → Advanced)
- Each cell contains skill tags that the user can hover to see a brief tooltip (e.g., hovering `C++` shows `Used in Spice Dispenser firmware`)
- Cells animate in with stagger on scroll
- The grid borders are silver, 1px, with a "scan line" effect that sweeps across on page load

**Task 3.4 — Education Card**
- Simon Fraser University card:
  - SFU logo placeholder (draw SVG of a mountain/geometric icon)
  - Program, GPA, dates
  - Two badge highlights: `IB DIPLOMA` and `BC ACHIEVEMENT SCHOLARSHIP`
  - Animated border: silver border draws around the card on scroll-in
- Card uses a subtle inner shadow and slight grain texture

**Task 3.5 — Values / What I Bring Section**
- 3 horizontal blocks with icon, title, description:
  1. `HARDWARE ↔ SOFTWARE` — fluent in both domains, bridges mechanical and digital
  2. `SHIP FAST, ITERATE` — demonstrated by Engram and Spice Dispenser timelines
  3. `SYSTEMS THINKER` — from GANTT planning at MECH to RAG architecture in Engram

---

### PHASE 4 — PROJECTS HUB (`app/projects/page.tsx`)

**Task 4.1 — Projects Grid Header**
- `PROJECTS` heading with counter: `[ 003 ]` in Space Mono, positioned top-right of heading
- Filter tabs: `ALL / EMBEDDED / SOFTWARE / HARDWARE` — clicking filters visible cards with Framer Motion layout animation

**Task 4.2 — Project Cards Grid**
- 3 project cards in a masonry-ish layout (2 col desktop, 1 col mobile)
- Each card: identical structure to homepage but with more detail — longer description excerpt, 3 tech tags, project status badge (`COMPLETED` or `ACTIVE`)
- Cards animate in with stagger when filter changes

**Task 4.3 — Process Philosophy Strip**
- Short section below the grid: `HOW I BUILD` — three steps with icons:
  `RESEARCH → PROTOTYPE → SHIP`
- Each step connected by an animated dashed line that draws on scroll

---

### PHASE 5 — SPICE DISPENSER PROJECT PAGE (`app/projects/spice/page.tsx`)

This is the most technically complex and showcase page.

**Task 5.1 — Page Hero**
- Project name: `AUTOMATIC SPICE DISPENSER`
- Tag: `EMBEDDED SYSTEMS · C++ · ARDUINO · 3D PRINTING`
- Date range: `SEPT 2025 – DEC 2025`
- Status badge: `COMPLETED`

**Task 5.2 — 3D Model Viewer (PRIMARY FEATURE)**

This is the crown jewel of the site.

Implementation:
1. Create `components/SpiceDispenser3D.tsx` using `@react-three/fiber` and `@react-three/drei`
2. **Placeholder Phase** (current): Render a procedurally-built 3D model from Three.js primitives:
   - A vertical cylindrical body (gray, metallic material)
   - A hopper/funnel shape on top (wider cylinder tapered)
   - A stepper motor box on the side (box geometry)
   - A small dispensing spout at the bottom (smaller cylinder)
   - A base plate (flat box)
   - Combine with `MeshStandardMaterial` using metalness: 0.8, roughness: 0.3 — silver/steel look
3. Lighting: `ambientLight` (intensity 0.3) + `directionalLight` (intensity 1.5, position [5,10,5]) + `pointLight` (intensity 0.5, position [-5,5,-5])
4. `OrbitControls` from drei: enables click-drag to rotate, scroll to zoom — fully interactive
5. Environment: `Environment preset="studio"` for reflections
6. Background: pure black canvas with subtle grid overlay

**Interactive Controls Panel** (below or beside the canvas):
- Four buttons styled as hardware control buttons (monospace labels, square shape, steel border):
  - `[ DISPENSE ]` — triggers a rotation animation on the stepper motor mesh (rotates the motor box mesh 360° over 1.2s using `useFrame` + state)
  - `[ CALIBRATE ]` — plays a slow back-and-forth rotation (±5°, 3 cycles) simulating calibration loop
  - `[ RESET ]` — returns all parts to default position
  - `[ TOGGLE HOPPER ]` — toggles the hopper lid mesh open (rotates 45°) and closed
- A status readout display below buttons:
  - Black background, monospace text, like an LCD display
  - Shows: `STATUS: IDLE`, changes to `STATUS: DISPENSING...` etc. when buttons pressed
  - A blinking cursor after status text
- Note at bottom: `[ PLACEHOLDER — 3D MODEL TO BE REPLACED WITH ACTUAL CAD EXPORT ]`

**Task 5.3 — Project Details**
- Four achievement blocks (each bullet point from resume, expanded into paragraph form)
- Each block has an icon (gear, code, grid, calendar) and heading
- The blocks reveal with stagger

**Task 5.4 — Tech Stack Breakdown**
- A visual breakdown: three columns (Firmware, Mechanical, Management) with items listed and animated check marks appearing on scroll

**Task 5.5 — Image Gallery Placeholder**
- A row of 3 grey placeholder boxes labeled `PROJECT PHOTO 01`, `02`, `03`
- Note: `[ REPLACE WITH ACTUAL PROJECT PHOTOS ]`
- On click: opens a full-screen lightbox overlay with arrow navigation

---

### PHASE 6 — ENGRAM PROJECT PAGE (`app/projects/engram/page.tsx`)

**Task 6.1 — Page Hero**
- `ENGRAM` in massive Syne 800
- Tagline: `B2B AI SAAS · LLM-POWERED ENTERPRISE MEMORY`
- Status badge: `ACTIVE` with a pulsing green dot animation (2s pulse loop)
- Date: `APRIL 2026 – PRESENT`

**Task 6.2 — Product Overview Section**
- A visual mockup of Engram's concept: a diagram showing enterprise systems → semantic pipeline → knowledge graph → LLM query interface
- Render this as an animated SVG diagram: nodes appear one by one, connecting lines draw, arrows animate
- Labels: `CONFLUENCE` `SLACK` `EMAIL` → `ENGRAM PIPELINE` → `KNOWLEDGE GRAPH` → `EMPLOYEE QUERY`

**Task 6.3 — Technical Architecture Section**
- Three cards: Frontend (TypeScript/RAG UI), Backend (Python/Semantic Pipeline), Infrastructure (Supabase/backboard.io)
- Each card: icon, title, bullet points on what was built

**Task 6.4 — Role Highlight**
- Highlight that Vince co-founded this — "Co-Founder & Full-Stack Engineer"
- Emphasize: built semantic data pipeline, architected RAG search interface, designed multi-source knowledge base

**Task 6.5 — Metrics / Impact**
- Stat cards (using StatCounter):
  - `B2B` — Target Market
  - `2` — Co-Founders
  - `MULTI-SOURCE` — Knowledge Integration
  - `VOICE + TEXT` — Query Modes

---

### PHASE 7 — DIGITAL DICE PROJECT PAGE (`app/projects/dice/page.tsx`)

**Task 7.1 — Page Hero**
- `DIGITAL DICE` heading
- Tags: `BOOLEAN LOGIC · PCB ASSEMBLY · SMD SOLDERING`

**Task 7.2 — Interactive Logic Demo**
- A visual 7-segment display rendered in SVG/HTML+CSS
- User can click a button `[ ROLL ]` — generates a random number 1–6
- The 7-segment display animates to show the rolled value
- Segments light up with silver/white color; inactive segments are very dark
- A binary representation also shows below (e.g., `BINARY: 101`)
- This is a real working web replica of the actual digital dice project — demonstrating the combinational logic

**Task 7.3 — Truth Table Visualization**
- A styled truth table showing binary input → 7-segment output for all 6 faces
- Monospace, dark background, silver borders — looks like a datasheet

**Task 7.4 — PCB Process**
- Three steps: Design → Solder → Validate
- With icons and descriptions from the resume bullets

---

### PHASE 8 — EXPERIENCE PAGE (`app/experience/page.tsx`)

**Task 8.1 — Timeline Component**
- Vertical timeline on desktop, stacked on mobile
- Each entry:
  - Left: Date range (Space Mono, silver)
  - Center: Vertical line with animated dot that "fills" on scroll (clip-path or border animation)
  - Right: Company name (Syne 700), Role (IBM Plex Mono), Location, 2–3 bullet achievements
- Entries animate in from right with stagger as user scrolls
- Three entries: MECH (Finance Lead), PNE (Games Attendant), SFU (Student, ongoing)

**Task 8.2 — Education Block**
- Same SFU card from About page, but expanded with course/skills context
- Awards: BC Achievement Scholarship, IB Diploma — each as a badge with a subtle gold-ish (desaturated warm) tint

**Task 8.3 — Downloadable Resume CTA**
- Full-width dark strip: `WANT THE FULL PICTURE?` + `DOWNLOAD RESUME (PDF)` button
- Button has an animated download arrow icon

---

### PHASE 9 — CONTACT PAGE (`app/contact/page.tsx`)

**Task 9.1 — Hero**
- Headline: `READY TO TALK ENGINEERING?`
- Subhead: `Available for co-op, internships, and project collaborations.`

**Task 9.2 — Contact Cards Grid**
- Three contact method cards:
  1. EMAIL: `vinceong2020@gmail.com` — copy-to-clipboard button with success state animation
  2. LINKEDIN: icon + link + "Connect" CTA
  3. GITHUB: icon + link + "View Code" CTA
- Each card: icon (Lucide), monospace label, subtle hover animation (card lifts, border brightens)

**Task 9.3 — Contact Form**
- Fields: Name, Email, Company/Organization, Message, Position Type (dropdown: Mechatronics / Software / Mechanical/Aerospace / Other)
- All fields styled in the site aesthetic: black background, 1px silver border, IBM Plex Mono font, silver placeholder text
- On focus: border transitions to chalk/white
- Submit button: chalk bg, black text, `SEND MESSAGE →`
- On submit: form fades out, success message types in (typewriter effect): `MESSAGE RECEIVED. I'LL GET BACK TO YOU SOON.`
- Note: Wire to a form handler (Formspree or similar) or leave as UI-only with a comment for the developer

**Task 9.4 — Location / Availability Strip**
- `CURRENTLY BASED IN: LANGLEY, B.C., CANADA`
- `AVAILABILITY: OPEN TO REMOTE & ON-SITE ROLES`
- These display in a horizontal strip with monospace text and a blinking location dot

---

### PHASE 10 — ANIMATIONS & MOTION SYSTEM

**Task 10.1 — Page Transition**
- Implement `AnimatePresence` from Framer Motion in `app/layout.tsx`
- Page transition: outgoing page slides up + fades; incoming page slides in from bottom + fades in
- Duration: 400ms, ease: sharp cubic bezier `[0.76, 0, 0.24, 1]`

**Task 10.2 — Scroll-triggered Section Reveals**
- Every `<section>` wrapped in `RevealOnScroll` component (Task 1.5)
- Headings: `y: 40 → 0`, opacity fade
- Body text: `y: 20 → 0`, opacity fade, 100ms delay after heading
- Cards: staggered, 80ms between each

**Task 10.3 — Hero Circuit Animation**
- SVG with 6–8 PCB trace paths
- Each path uses `stroke-dasharray` = path length, `stroke-dashoffset` animates from full to 0
- Paths animate sequentially with 200ms delay between each
- Nodes (circles) at path endpoints fade in with scale 0 → 1 after their path completes

**Task 10.4 — Number Counter Animations**
- Implemented in Task 1.7, used site-wide
- Trigger: IntersectionObserver, `once: true`

**Task 10.5 — Hover Micro-interactions**
- Navigation links: bottom border draw (clip-path, 200ms)
- Project cards: translateY(-4px) + border brighten (200ms)
- CTA buttons: background shift + slight shadow appear (150ms)
- All micro-interactions: prefer CSS transitions over JS for performance

**Task 10.6 — 3D Model Animations (Three.js)**
- Idle state: very slow model rotation (auto-rotate, speed 0.003 radians/frame)
- Button interactions: use `useSpring` from Three.js or `gsap` for smooth property animations
- Camera: start at `[0, 2, 5]`, smooth zoom on first load (lerp over 60 frames)

---

### PHASE 11 — RESPONSIVE DESIGN

**Task 11.1 — Breakpoints**
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: > 1024px

**Task 11.2 — Mobile Adaptations**
- Navbar: hamburger menu (Task 1.2)
- Hero: name size reduced, circuit SVG hidden on mobile (too complex for small screens)
- Stats bar: 2×2 grid
- Projects: single column cards
- 3D Viewer: reduced canvas height (300px), simplified lighting
- Timeline: vertical, full width
- Custom cursor: disabled on touch devices

**Task 11.3 — Performance**
- Use `next/image` for all images
- `dynamic(() => import('./SpiceDispenser3D'), { ssr: false })` — lazy load Three.js
- Font subsetting via `next/font`
- SVG animations use `will-change: transform` only on active elements

---

### PHASE 12 — SEO & METADATA

**Task 12.1 — Metadata (`app/layout.tsx`)**
```typescript
export const metadata: Metadata = {
  title: 'Vince Ong — Mechatronic Systems Engineer',
  description: 'Portfolio of Vince Ong, SFU Mechatronic Systems Engineering student. Embedded systems, AI SaaS, PCB design.',
  openGraph: {
    title: 'Vince Ong — Engineering Portfolio',
    description: 'Firmware. Systems. Products.',
    url: 'https://vinceong.dev',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};
```

**Task 12.2 — Per-Page Metadata**
- Each page (`about`, `projects/*`, `experience`, `contact`) exports its own `metadata` object

**Task 12.3 — `robots.txt` and `sitemap.xml`**
- Generate via Next.js App Router conventions

---

### PHASE 13 — DEPLOYMENT

**Task 13.1 — Vercel Deployment**
```bash
npm install -g vercel
vercel --prod
```
- Connect to GitHub repo
- Set environment variables if contact form uses external service

**Task 13.2 — Domain**
- Configure custom domain (e.g., `vinceong.dev`) in Vercel dashboard

**Task 13.3 — Final Checklist**
- [ ] Boot loader plays on first session visit only
- [ ] All pages load without console errors
- [ ] 3D viewer works on desktop browsers (Chrome, Firefox, Safari)
- [ ] Mobile navigation functional
- [ ] Resume PDF downloadable
- [ ] Contact form submits or has clear placeholder note
- [ ] All animations trigger correctly on scroll
- [ ] No font FOUT (flash of unstyled text)
- [ ] Lighthouse: Target > 85 performance, > 90 accessibility

---

## 4. FILE STRUCTURE

```
vince-portfolio/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, metadata, BootLoader, Navbar, Footer
│   ├── page.tsx                    # Homepage
│   ├── about/page.tsx
│   ├── projects/
│   │   ├── page.tsx                # Projects hub
│   │   ├── spice/page.tsx          # Spice Dispenser (3D viewer)
│   │   ├── engram/page.tsx
│   │   └── dice/page.tsx
│   ├── experience/page.tsx
│   ├── contact/page.tsx
│   └── globals.css
├── components/
│   ├── BootLoader.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CustomCursor.tsx
│   ├── RevealOnScroll.tsx
│   ├── Divider.tsx
│   ├── StatCounter.tsx
│   ├── CircuitSVG.tsx              # Animated PCB trace graphic
│   ├── ProjectCard.tsx
│   ├── Timeline.tsx
│   ├── SpiceDispenser3D.tsx        # Three.js model (dynamically imported)
│   ├── SevenSegmentDisplay.tsx     # Digital dice interactive demo
│   └── SkillsMatrix.tsx
├── lib/
│   └── utils.ts
├── public/
│   ├── resume.pdf                  # Vince's resume
│   └── og-image.png                # Social preview image
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 5. CONTENT MAP (Exact Resume Data)

| Section | Source Data |
|---|---|
| Name | Vince Ong |
| Email | vinceong2020@gmail.com |
| Phone | 604-833-8384 |
| Education | SFU BApSc Mechatronic Systems Engineering, Sep 2025–Present, GPA 3.7/4.3 |
| Awards | IB Diploma (July 2025), BC Achievement Scholarship (Oct 2025) |
| Languages | C++, Python, TypeScript |
| Software | LTspice, EAGLE, Git, GitHub, Arduino IDE, Supabase, Vercel |
| Hardware | Soldering, Oscilloscopes, DMM, 3D Printing, Microcontrollers, PCB Assembly |
| Project 1 | Automatic Spice Dispenser — C++, Arduino, 3D Print — Sept–Dec 2025 |
| Project 2 | Engram — TypeScript, Python, Supabase — April 2026–Present |
| Project 3 | Digital Dice — Boolean Logic, PCB, SMD Soldering — Sept–Dec 2025 |
| Experience 1 | MECH Finance & Development Lead — Aug 2023–Jul 2025 |
| Experience 2 | PNE Games Attendant — Aug–Sep 2025 |

---

## 6. CREATIVE SIGNATURE ELEMENTS SUMMARY

| Element | Location | Why It's Memorable |
|---|---|---|
| Terminal boot loader | Site entry | Feels like initializing a machine |
| Animated circuit SVG | Hero | Establishes engineering identity instantly |
| 3D interactive model | Spice Dispenser page + homepage teaser | Employer literally operates a virtual version of his project |
| Interactive 7-segment die | Digital Dice page | Shows the actual boolean logic working in browser |
| Animated skill matrix | About page | Visually distinct alternative to bullet-point skill list |
| SVG architecture diagram | Engram page | Communicates system thinking without a wall of text |
| Boot-sequence stat counters | Homepage stats bar | Numbers feel earned, not static |
| Custom magnetic cursor | Site-wide | Subtle luxury UX signal |
| Scan-line overlay | All pages | Reinforces industrial/hardware aesthetic |
| "Charging" footer border | Footer | Every detail is animated, nothing is static |
