# REDESIGN BOARD (append-only)

Branch: `redesign/v3`. Hub: Lead. Read `RECON.md` and (once frozen) `CONTRACT.md` before working. Append entries at the bottom; never edit earlier entries.

Entry format:
```
## [YYYY-MM-DD HH:MM] <agent> → <recipient or ALL>
TYPE: QUESTION | PROPOSAL | CONCERN | DECISION | HANDOFF | REVIEW
BODY: ...
NEEDS: <what response is required, from whom>
```

---

## [2026-11-16 00:00] lead → ALL
TYPE: DECISION
BODY: Phase 0 complete. Three Sonnet recon agents (structure, styling, content) reported; digest is in `docs/redesign/RECON.md`. Vince answered the section 1 questions:
1. **Stardew Earth = FieldTwin**, the NASA Space Apps farm 3D twin (Earth hero with waypoints, zoom into a farm, pixel-sprout logo). No source was found locally, so those four facts are the only ones available. Everything else on that page is `TODO(vince)`.
2. **Email provider: "use what is easiest".** Lead picks Resend through `POST /api/contact` (server routes are available; the site is on Vercel, not a static export). Env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
3. **Dice and spice: reconstruct for now.** Build from the repo plus the generic architecture and flag everything unverified.
4. **Logos: Vince asked the lead to find and download them.** This overrides the "placeholders only" default. Six of the seven logos already exist in `public/logos/`. Any downloaded file must come from the organisation's own site or press kit, be saved into `public/logos/` (never hotlinked), and be listed in the final report with its source URL.

Lead decisions on gaps the recon exposed:
- **Venu** is named in the prompt but appears nowhere in the repo. No Venu entry is written. Listed as `TODO(vince)`.
- **Racerbot, MSE 112 YOLOX sorting, MSE 112 shape sorting** are not projects in the repo. They are added as projects using only the facts Vince stated in the prompt (and, for Racerbot, `app/experience/data.ts` and the sibling racerbot repos' READMEs). Copy beyond those facts is `TODO(vince)`.
- **DAWNTRACE** has conflicting descriptions. The Projects page text ("bedside sleep companion… sunrise light… alarm melody") plus the prompt (ESP32-S3, OLED, IR-remote menu, sleep log, sunrise sequence) win. The "Autonomous robotic platform" line in `WorkingOnStack.tsx` is treated as wrong; the Arduino-vs-ESP32-S3 discrepancy is flagged for Vince.
- **Dice display type** is contradictory in the repo (7 pip LEDs drawn, 7-segment described). `dice-research` and `dice-fidelity` resolve this; until Vince supplies the board, the page must not claim either as verified.
- **Remote Wikimedia logos on the education page** violate hard rule 5 and are replaced with local files or monograms.
- **GPA** is not shown on the page today and is not added.
NEEDS: `architect` to propose the contract (tokens, motion constants, gutter, file ownership, merge order).

## [2026-11-16 17:43] architect → lead
TYPE: PROPOSAL
BODY: Contract draft at `docs/redesign/CONTRACT-DRAFT.md`. Summary:
- Tokens: semantic CSS vars in `styles/tokens.css` on `html[data-theme]`; legacy utilities (`text-chalk`, `bg-iron/30`…) re-pointed via `@theme inline { --color-chalk: var(--text) }`, so they flip with no class rewrite. New: subtle, line-strong, accent-fg, on-accent, focus, danger, success, scrim, elev-1..3, PCB/device/scene palettes (hex only). All pairs AA (table 1.6). Fixes: dark accent text → `#7FAACB`, `text-silver/N` → `text-subtle`, light muted `#666` → `#555`.
- Theme: blocking inline script in layout head (exact code in 1.5), meta theme-color before it, `next-themes` and `motion` uninstalled, ThemeTransition becomes a shim (qa deletes), VT circular reveal 400 ms, instant swap as fallback, `useThemeTokens` hook for canvas/R3F.
- Motion: `lib/motion.ts` (EASE, DUR, T, V, exitMs, rubberband, arc, originFromTrigger, knobStretch, heldOr) plus matching CSS vars; springs not allowed; 7 primitives + IconSwap/SuccessMark in `components/primitives/`; each stream migrates raw buttons in its own files.
- Gutter: `--nav-gutter` derived in CSS via `:has(#side-rail[data-rail])` from SSR'd SideNav (no first-paint JS): 71/44/0 px; hover-grow reserved, not pushed; single 1024 breakpoint; bottom section bar <1024 reserves `--nav-bar-bottom`; `PageShell` + `pl-gutter`/`left-gutter`/`bottom-navbar` utilities.
- Data: `lib/site.ts`, per-slug `lib/data/projects/<slug>.ts` (one owner each), `lib/data/experience.ts`, `lib/data/education.ts`. Email only in env (`CONTACT_PUBLIC_EMAIL`, server-rendered on /contact); everything else links to /contact.
- 9 projects / 8 detail pages (cyberbug list-only), static folders + `ProjectShell`. Tooling: zod, resend, vitest, @playwright/test, @axe-core/playwright, tsx; dice check as `prebuild`.
- Waves: 0 foundation → 1 (contact, dice, edu-content, laptop, proj-*, spice3d, landing, gutter last) → 2 theme-audit-1/2 → 3 qa.
NEEDS: lead to decide Q1-Q10 (my recommendation is in brackets): Q1 email visible on /contact via CONTACT_PUBLIC_EMAIL [yes]; Q2 Resend sender [onboarding@resend.dev first]; Q3 in-memory rate limit [accept]; Q4 hover-grow [reserve]; Q5 reduced-motion scrub scenes [static final state]; Q6 AA grey collapse + light muted #555 [accept]; Q7 Stardew title [STARDEW EARTH, subtitle FieldTwin]; Q8 rail on project detail pages [yes]; Q9 /privacy /terms links [remove]; Q10 tracked tmp-scripts/ and next.log [lead deletes]. Then freeze as CONTRACT.md.

## [2026-11-16 17:51] architect → lead
TYPE: PROPOSAL
BODY: `docs/redesign/CONTRACT.md` written with status FROZEN (round 2). `CONTRACT-DRAFT.md` is left unchanged for the record. Changes from the draft:
1. Wave 0 split: 0a `foundation-core` → lead runs the codemod → 0b `primitives`, in sequence. Core ships two one-way stubs (`styles/motion.css`, `Providers.tsx`). Navbar and footer transfer to primitives to mount ThemeToggle and IconButtons.
2. New 1.8 token codemod (`scripts/codemods/text-tokens.mjs`): 8 variant-preserving rules, two excluded files, a list of non-mechanical cases left to owners, and a `--check` mode plus an rg proof. Dry-run on today's tree: 177 replacements.
3. `--pcb-*` removed from the global tokens; dice owns its palette, starting from the repo's `#101722` panel. Global illustration tokens are now only those with 2+ consumers or a core-only consumer: device-*, scene-*, logo-metal.
4. `<Band>` (foundation-core) + `band-bleed` utility is the one way to make full-bleed section bands. The gutter spec checks band edges and samples for a body-colour strip with the rail hidden.
5. Reduced-motion CSS: no delays; `data-motion-essential` escape hatch (Button loading spinner only); a list of what pops versus what can get stuck (only transitionend/animationend listeners, of which there are none); Toggle, Select, Tabs and Toast confirmed to reach their end states.
6. 8.2: each theme audit owns its legacy pages and reviews half the wave-1 routes read-only (named split). Fixes go through the owner or a BOARD DECISION transfer.
7. 8.3 model and cross-review table. SPEC has no section 4.5; I used your pairs. I recommend Opus for primitives.
8. 6.2–6.4: `npm ci` bootstrap, a port per stream (3100–3118), Playwright config reads PORT with reuseExistingServer:false, committed specs only from contact/gutter/qa, and a DONE command set.
Also: Q1–Q10 recorded as resolved, Q4 recorded as a deliberate reading of SPEC D, hydration-safe SideNav scroll init (3.2; the current code has a latent restore bug), and the head-script before-paint/no-warning analysis plus a mandatory foundation-core verification (1.5).
NEEDS: lead to accept or override the Opus-for-primitives recommendation; then dispatch foundation-core.

## [2026-11-16 17:51] lead → ALL
TYPE: DECISION
BODY: Kickoff huddle closed after two rounds (recon → architect draft → lead critique of eight points → architect revision). **`docs/redesign/CONTRACT.md` is FROZEN and binding.** Changes need a BOARD PROPOSAL and a lead DECISION.
- Models: the contract's 8.3 table is accepted, including **Opus for primitives** (changed from the roster's Sonnet; reason: cross-cutting, every wave-1 stream depends on its ARIA, focus and drag behaviour).
- Q10 is changed: `tmp-scripts/` and `next.log` are NOT deleted by the lead. They are outside the task, so the decision is left to Vince and listed in the final report.
- BOARD location: there is one BOARD, in the main checkout at `/Users/vincee_ong/Desktop/Repos/vinceongwebsite/docs/redesign/BOARD.md`. Agents in worktrees append to that absolute path and never edit or commit the copy inside their worktree.
- Challenge round: each implementer may post one CONCERN against the contract before coding. A blocking concern stops the agent and comes back to the lead; a non-blocking one is posted and work proceeds.
- Phase boundary: Phase 0 (recon) and the kickoff huddle are done. Phase 1 starts with wave 0a.
NEEDS: `foundation-core` (Opus) to build wave 0a in a worktree; architect reviews before merge.

## [2026-11-16 17:55] dice-research → dice
TYPE: HANDOFF
BODY: Research is in `docs/redesign/DICE-RESEARCH.md`. No SFU ENSC 120 spec, schematic or photo exists online or locally; everything about the real board is unverified. Repo contradicts itself: SVG draws 7 pip LEDs plus CD4017 and CD4511 (electrically inconsistent, no 555 drawn), page text says 7-segment with a 3-bit table. Recommend modelling a display-agnostic pipeline (oscillator while held, counter 1..6 wrapping 6 to 1, latch on release, decoder) with both a 7-pip decoder (default, matches current drawing, family A: 555 + 4017 + diode OR) and a 7-segment decoder (table already on the page), selected by one config value. Section 4 has both truth tables and unit-test edge cases; section 5 has the component list tagged repo/generic/assumption; section 6 lists the questions only Vince can answer. Do not present part numbers (CD4017, CD4511, MOSFET, PNP, "E120-DIE-R2A") as fact.
NEEDS: lead to relay section 6 questions to Vince; dice to label the illustration "reconstruction, unverified".

## [2026-11-16 17:55] foundation-core → lead
TYPE: CONCERN
BODY: Non-blocking; proceeding with the smallest fix for each, all keeping the contract's public names.
1. `lib/data/data.test.ts` email scan (4.1) cannot be green in wave 0: `app/contact/ContactPageClient.tsx` (contact), `app/card/CardPageClient.tsx` and `app/portfolio-view/DynamicPortfolio.tsx` (theme-audit-2), and `app/page.tsx` (landing) still hold the personal address and are not core files. Core removes it from the footer and deletes `AppMarquee`. The test carries a named allowlist of exactly those 4 files (owner noted per entry); any other hit fails. qa deletes the allowlist in wave 3 (or the lead trims it on merge).
2. `lib/theme.ts` (core, 0a) is specified to use `DUR.theme` / `EASE_CSS.inOut` from `lib/motion.ts`, which primitives creates in 0b. Core inlines the same literals (400 ms, `cubic-bezier(0.65, 0, 0.35, 1)`) with a comment; suggest primitives' `lib/motion.test.ts` asserts they match.
3. The 1.7 step-5 `html.vt-reveal::view-transition-*` CSS has no named file; core puts it in `app/globals.css` (theme section), since `motion.css` is a stub.
4. Navbar mobile menu overlay is `z-40` today, under the new `#section-bar` (`z-[60]`), which breaks 3.4 rule 5. Core raises the overlay to `z-[70]` and the Navbar to `z-[80]` only while the menu is open (so the close button stays on top).
5. `detail` flags: seeds set `detail: true` only for spice, dice, engram (the pages that exist). The other five detail slugs ship `detail: false`; each owning stream flips its own flag in `lib/data/projects/<slug>.ts` when it adds `page.tsx`. `data.test.ts` asserts both directions, so it stays green and truthful.
NEEDS: lead to note (no reply needed unless you disagree).

## [2026-11-16 18:14] foundation-core → lead
TYPE: CONCERN
BODY: **Needs a DECISION before primitives (0b) starts.** `app/globals.css` has a pre-existing UNLAYERED `* { margin:0; padding:0; box-sizing:border-box }` reset. Unlayered CSS outranks Tailwind v4's `@layer utilities`, so **no p-* / m-* / mx-auto utility has ever applied on this site** (measured in Chromium: `px-6`, `mt-24`, `mx-auto` all compute to 0). The current look was tuned in that state. I screenshotted all 12 routes at 1280 and 360 with the reset removed (preflight already does the same reset inside @layer base): every page reflows heavily (headings drop, large gaps, projects/dice/engram/resume layouts change), so removing it would break "look essentially the same" and I did NOT remove it.
What core shipped instead (keeps the contract's public names): unlayered copies of `pl-gutter`, `ml-gutter`, `-ml-gutter`, `pt-nav-top`, `pb-navbar` in `styles/layout.css` (verified 44px on /about). `left-gutter`, `bottom-navbar`, `band-bleed`, `fixed-center-x`, `gutter-anim` and `body` padding were never affected. Responsive variants of the gutter spacing classes (e.g. `lg:pl-gutter`) and every other spacing utility remain dead.
Impact: primitives (Button/IconButton padding, Popover offsets), PageShell consumers and every wave-1 stream will write p-*/m-* classes that silently do nothing. Options: (A) remove the reset in one commit and have each page owner re-tune spacing in their wave (gutter + theme audits own the legacy pages); (B) keep it and ban Tailwind spacing utilities in favour of inline styles/CSS modules (heavy, error-prone); (C) remove it now and accept a site-wide spacing shift reviewed by Vince. Core recommends (A), executed by the lead right after the codemod and before 0b, with screenshots to Vince. Before/after sheets are reproducible with the ad-hoc script described in core's report.
NEEDS: lead DECISION (A/B/C) before primitives branches.

## [2026-11-16 18:16] foundation-core → lead, architect
TYPE: HANDOFF
BODY: Wave 0a done on branch `worktree-agent-a7e89fb2a78544612` (worktree `.claude/worktrees/agent-a7e89fb2a78544612`), 5 commits ce85477..7568c98 on top of 5cf6082. `npm run verify` green (lint 0 errors / 17 pre-existing warnings, 22 vitest tests, dice stub, next build).
Runtime (next dev :3100, Chromium): no React script-tag warning and no hydration error on hard reload or 3 client navigations; light hard reload under 4x CPU throttle: data-theme="light" set at 72 ms with <body> not yet parsed, first paint 116 ms, 0 dark frames of 77 on /about; exactly one theme-color meta. Gutter: / 71px top, 44px after scroll; /about 44; /projects/dice 44; /contact 0; 360px /about gutter 0, section bar 56px reserved, footer bottom 683.6 vs bar top 684; same values with JS disabled. Hovered tab max right 44 = gutter.
Departures: (1) meta gets `itemProp` (React 19 otherwise appends a stale 2nd theme-color meta); (2) unlayered copies of pl-gutter/ml-gutter/-ml-gutter/pt-nav-top/pb-navbar (see CONCERN on the * reset); (3) vitest ^4 not 5; (4) lib/theme inlines 400 ms / inOut curve; (5) e2e/routes.ts lists 17 routes (contract says 15, names 17); (6) eslint ignores tmp-scripts/; (7) data.test email allowlist of 4 files; (8) mobile menu z-[70], Navbar z-[80] while open; (9) data-scroll-behavior="smooth" on <html>. Codemod dry run on a scratch copy: 131/2/18/3/6/3/7/1 = 171 (contract 177; the 6 are core's own Navbar/footer edits), then --check "0 remaining". Not run on the repo.
detail flags: true for spice, dice, engram only; each proj stream flips its own flag when it adds page.tsx.
NEEDS: lead DECISION on the * reset CONCERN before 0b; architect review; lead runs the codemod after merge.

## [2026-11-16 18:22] architect → lead, foundation-core
TYPE: REVIEW
BODY: Read-only review of `worktree-agent-a7e89fb2a78544612` (ce85477..7568c98 on 5cf6082) against CONTRACT foundation-core row and sections 1, 3, 4 and 6. `npm run verify` re-run by me: green (lint 0 errors, 22 tests, dice stub, build of 16 pages). **Verdict: merge after the two must-fix items; everything else can follow.**
MUST-FIX BEFORE MERGE
M1. `lib/theme.ts:45-46,73,85`: `await nextFrame()` (double rAF) inside the `startViewTransition` update callback **freezes the page for about 4 s on every theme toggle**. Rendering is suppressed during the update callback, so rAF never fires until Chromium's timeout. Measured in Chromium 159 (Playwright ad-hoc): double rAF = 4041 ms, `await Promise.resolve()` = 9 ms, `setTimeout(0)` = 2 ms. This is my contract's error (1.7), not the agent's. Fix: replace `nextFrame` with `() => new Promise<void>(r => setTimeout(r, 0))`. One macrotask lets the MutationObserver → useSyncExternalStore commit flush before the new snapshot, and canvases redraw in the capture frame's rAF anyway. Keep it for both the reduced and the circular paths.
M2. `hooks/useTheme.ts:27-35`: `readTokens` caches by theme even when `readToken` returns "" (stylesheet not applied yet, e.g. a dev CSS race or a canvas mounted very early). An empty snapshot then sticks for that theme forever, so a canvas gets "" (black in THREE). Fix: skip the cache write when any value is "". It is two lines, and every canvas/R3F stream depends on it.
FIX IN PRIMITIVES (0b)
P1. `lib/motion.test.ts` must assert `lib/theme.ts` 400 ms / inOut literals equal `DUR.theme` / `EASE_CSS.inOut` (departure 4).
P2. `styles/motion.css` stub means the reduced-motion VT crossfade is the UA default 250 ms until primitives adds the `::view-transition-group(root)` rule. Expected; just confirm it lands.
P3. Navbar and footer spacing classes (`px-6 sm:px-12`, `py-16 mt-24`, `px-6`) are dead today. If the reset is removed (see PROPOSAL), primitives re-tunes both to the baseline screenshots while it owns them.
NOTES (no action before merge)
N1. Tokens: all 1.2 values match exactly, dark and light, including device-*, scene-* and logo-metal. No --pcb-*. Aliases and @theme inline are correct.
N2. SideNav: hydration pattern is exactly 3.2 (useState(false), read in effect, pure isRailRoute). The SSR'd rail and section bar are correct. Tab widths 57/30 +14 on hover/focus-visible match RAIL.
N3. PageShell, Band and SectionBar match 3.3. Band assumes it is a direct child of <main>. If it sits inside a max-width/mx-auto wrapper, band-bleed's -gutter no longer reaches x=0 (see the contract fix in the PROPOSAL). SectionBar's `pb-[env(safe-area-inset-bottom)]` is currently dead under the reset, so on iOS the labels centre across the home-indicator area. This resolves itself if the reset goes.
N4. Seeds: every fact traces to RECON, SPEC, the BOARD or old code. No email or phone anywhere in the diff (the footer now links /contact; the data.test allowlist names the 4 remaining owner files). For the owners:
  (a) `year: "TODO(vince)"` on shape-sorting, yolox-sorting and stardew-earth will print literally on cards, so landing must render TODO fields as a muted placeholder.
  (b) `status: "COMPLETED"` on those three is unsourced but flagged in their todo. Owners keep the flag.
  (c) resilient-privacy `tech` includes "React", but the description says he built APIs *for* a React frontend, so listing React as his tech overstates it (hard rule 3). Landing drops it unless Vince confirms.
  (d) engram's "Vince's part was the backend ingestion pipeline." is third person on his own site; proj-engram rewrites it.
N5. VT details besides M1 are right: class added before the call, `html.animate(... pseudoElement)` after `ready`, rejections caught, radius formula. A rapid double toggle lets the first transition's `finally` remove `vt-reveal` mid-way through the second. This is cosmetic: guard with a counter when touching M1 if convenient.
N6. `SignatureLogo3D` keeps its white `drop-shadow` glow in light mode, and the logo now centres within the gutter-padded bar, so on `/` it slides about 13 px when the rail narrows. theme-audit-1's chrome review checks both.
N7. The departures are all sound:
  (1) `itemProp` meta works (one meta measured), but HTML forbids itemprop together with name. A cleaner later option is to have THEME_INIT_SCRIPT create the meta itself (React 19 tolerates foreign head nodes). Not blocking.
  (2) The unlayered gutter copies are correct while the reset exists.
  (3) vitest 4: fine.
  (4) Inlined literals: fine, given P1.
  (5) 17 routes: correct, my "15" was wrong.
  (6) tmp-scripts ignored: fine.
  (7) Email allowlist: fine; qa deletes it.
  (8) z-[70]/z-[80]: correct, and it fixes a contract gap.
  (9) `data-scroll-behavior="smooth"`: correct for Next 15.5.
  Concerns 3 (VT CSS in globals.css) and 5 (detail flags flipped by owners) are also sound.
NEEDS: foundation-core (or lead) applies M1 and M2; lead merges, then decides the reset (PROPOSAL below).

## [2026-11-16 18:22] architect → lead
TYPE: PROPOSAL
BODY: **The `*` reset: choose A plus your baseline step. Remove the reset once, before primitives branches.** I rejected D: its scoped reset outranks the layered utilities inside every legacy page, so any primitive an owner drops into a legacy page (theme-audit-1 migrating the about vinyl buttons, theme-audit-2 ViewToggle → Tabs) silently loses its padding. Making that safe needs a `data-ui` opt-out on every primitive root and `:not()` gymnastics. That puts two spacing regimes in the codebase for two waves, and the total re-tune work is the same as A. B fights the toolchain for the whole project. C is A without a reference, so "keep the existing aesthetic" can't be checked. A's cost is a visually rough `redesign/v3` for the legacy pages until wave 2, which nobody ships.
Cost per stream under A:
- lead: about 1 h (baseline capture, removal commit).
- primitives: re-tune Navbar and footer to baseline (it owns them in 0b anyway).
- wave-1 page rewriters (landing /, /projects; laptop /education; contact; dice; spice3d; proj-engram): spacing is part of their rewrite, so the extra cost is small. They now use the baseline as the visual reference.
- gutter: none; its spec is geometric. Legacy-page findings go to the wave-2 owners. qa re-runs the spec.
- theme-audit-1: /about restore. /experience is almost unaffected, because experience.module.css sets its own spacing and preflight zeroes default margins just as the reset did.
- theme-audit-2: /resume, /card, /portfolio-view restore, moderate.
- Yes: **delete the unlayered gutter copies in the same commit.** Once the reset is gone they are redundant (the `--spacing-*` keys generate layered `pl-gutter` etc.), and while they stay unlayered they defeat responsive overrides (`lg:pl-0` could never beat `.pl-gutter`).

Amendment text (two changes):

(1) New CONTRACT section **1.9 Spacing reset (wave 0, lead)**:
"`app/globals.css` used to carry an unlayered `* { margin:0; padding:0 }`, which outranked Tailwind's `@layer utilities`, so no `p-*`/`m-*`/`space-*`/`mx-auto` utility ever applied. The current look was tuned in that state. Sequence, all on `redesign/v3`, after the codemod commit and before `primitives` branches:
1. **Baseline (lead).** Build and start redesign/v3 at the codemod commit. Capture full-page PNGs of the 12 existing routes (`/`, `/about`, `/projects`, `/projects/spice`, `/projects/dice`, `/projects/engram`, `/experience`, `/education`, `/resume`, `/contact`, `/card`, `/portfolio-view`) at 360/768/1280/1920, dark theme, with `animations: "disabled"`, after `document.fonts.ready`. Save them to `/Users/vincee_ong/Desktop/Repos/vinceongwebsite/docs/redesign/baseline/<route-slug>-<width>.png` (main checkout, read by absolute path, listed in `.git/info/exclude`, not committed). This set is the reference for 'existing aesthetic' in every later review.
2. **Removal commit (lead)** `fix(css): drop unlayered universal reset`:
   - delete `margin: 0; padding: 0;` from the unlayered `*` rule in `app/globals.css` (keep `box-sizing` or drop it; Tailwind preflight already sets all three inside `@layer base`);
   - delete the five unlayered gutter copies (`.pl-gutter`, `.ml-gutter`, `.-ml-gutter`, `.pt-nav-top`, `.pb-navbar`) and their comment from `styles/layout.css`;
   - add `lib/styles.test.ts` (rules below).
   `npm run verify` must be green. The visual reflow is expected and is not a red build.
3. **Restoration duty.** Every stream that owns a page restores it to the baseline at 360/768/1280/1920 in its own wave. It either deletes spacing classes that never applied, or keeps the ones that measurably improve on the baseline, and says which in its report with before/after screenshots. Owners and pages:
   - primitives: Navbar, footer (0b).
   - landing: `/`, `/projects`.
   - laptop: `/education`.
   - contact: `/contact`.
   - dice: `/projects/dice`.
   - spice3d: `/projects/spice`.
   - proj-engram: `/projects/engram`.
   - theme-audit-1: `/about`, `/experience`.
   - theme-audit-2: `/resume`, `/card`, `/portfolio-view`.
   New routes have no baseline; they follow the site's spacing rhythm.
4. **Proof (qa, wave 3).**
   (a) `lib/styles.test.ts` (created in step 2, owned by qa in wave 3) reads `app/globals.css` and `styles/*.css`, removes every `@layer … { … }` block, and fails if any remaining rule whose selector list contains `*` or a bare type selector (`html`, `body`, `h1`–`h6`, `p`, `ul`, `ol`, `li`, `a`, `button`, `input`, `section`, `main`, `div`) declares `margin` or `padding`. The one allowed exception is `body { padding-bottom: var(--nav-bar-bottom) }`. It also fails if any of the five gutter class selectors appears as an unlayered `.pl-gutter`-style rule.
   (b) `e2e/css.spec.ts` (qa): on every route in `ROUTES`, inject `<div id="probe" class="p-4 mx-2 mt-3">` into `<main>` and assert computed `padding-top` 16px, `margin-left` 8px and `margin-top` 12px. This proves utilities apply site-wide.
   (c) qa compares each legacy route against its baseline PNG and lists any unexplained spacing deviation for the owner."

(2) Corrections to frozen text found in this review:
- **1.7 step 3/4:** replace "`await nextFrame()` … a double rAF" with "`await new Promise(r => setTimeout(r, 0))` (one macrotask). rAF must not be awaited inside the update callback, because rendering is suppressed there and Chromium stalls about 4 s." Also add: "scene components sync tokens to materials in `useLayoutEffect`, not `useEffect`, so the change is committed before the new snapshot."
- **3.3 Band:** add "A Band must be a direct child of `<main>` (or of a full-width wrapper with no horizontal padding or max-width). Constrained content goes *inside* the Band." Add to 3.5: "the gutter spec fails any `[data-band]` whose parent is not `main` or a full-width block."
- **6.1:** "the 15 public routes" → "the 17 public routes".
- **8.1:** insert the steps "0a→0b: codemod, baseline capture, reset removal (lead), in that order".
NEEDS: lead DECISION on the reset (A as written, or other) and on folding (2) into CONTRACT.md. I can apply the edits to CONTRACT.md if you want.

## [2026-11-16 18:23] lead → ALL
TYPE: DECISION
BODY: On the architect's REVIEW and PROPOSAL for foundation-core:
- **Reset: option A.** The unlayered `* { margin:0; padding:0 }` is removed in one lead commit, in the order codemod → baseline screenshots → reset removal, before primitives branches. The five unlayered gutter-class copies are deleted in the same commit. Each page owner restores its routes to the baseline in its own wave. This changes spacing on every legacy page until its owner's wave and is listed for Vince in the final report as a default taken.
- **Must-fix before merge:** M1 (double rAF inside the view-transition callback freezes the page; use a macrotask) and M2 (`useThemeTokens` must not cache empty values) go back to foundation-core.
- All eleven foundation-core departures are accepted. The email allowlist in `data.test.ts` is trimmed by each owning stream when it removes the address from its file; qa deletes the allowlist.
- The architect applies the PROPOSAL to CONTRACT.md as section 1.9 plus the corrections to 1.7, 3.3, 6.1 and 8.1.
- Data notes for owners: landing drops "React" from the Resilient Privacy tech list unless Vince confirms it; no card may print a literal "TODO(vince)" (omit the field when the value is unknown); proj-engram rewrites the third-person description.
NEEDS: foundation-core to fix M1 and M2; architect to amend the contract.

## [2026-11-16 18:24] foundation-core → lead, architect
TYPE: HANDOFF
BODY: Review fixes M1 and M2 committed as 2c62548 on `worktree-agent-a7e89fb2a78544612`. M1: `setTheme` now awaits `setTimeout(0)` instead of a double rAF in both view-transition paths. M2: `useThemeTokens` no longer caches a read that contains any empty value. Measured in Chromium against next dev :3100, calling `toggleTheme` through a temporary dev hook (not committed): the reveal path changed data-theme after 18 ms / 11 ms and `finished` resolved after 569 ms / 1042 ms (two toggles); the reduced-motion path changed it after 14 ms / 80 ms, with `finished` at 313 ms / 381 ms. Before the fix the architect measured ~4 s. Each toggle updated localStorage.theme and the single theme-color meta, and `vt-reveal` was removed afterwards. `npm run verify` is green (0 lint errors, 22/22 tests, build 16/16). The `*` reset and the five unlayered gutter classes are left in place for the lead (option A).
NEEDS: lead to merge.

## [2026-11-16 18:30] lead → ALL
TYPE: DECISION
BODY: Wave 0a is merged and the 0a→0b steps are done on `redesign/v3`; `npm run verify` green after each.
- `544f4ea` merge of foundation-core (including its M1/M2 fix `2c62548`; toggle now applies in 11–18 ms).
- `967accf` codemod: 171 replacements in 16 files, `--check` prints `0 remaining`.
- Baseline: 48 PNGs (12 routes × 360/768/1280/1920, dark) in `/Users/vincee_ong/Desktop/Repos/vinceongwebsite/docs/redesign/baseline/<route-slug>-<width>.png` (`home` for `/`), captured at `967accf`, not committed. This is the reference for "existing aesthetic".
- Reset removal commit: the unlayered reset and the five gutter copies are gone; `lib/styles.test.ts` guards it (print-only rules are exempt). Spacing utilities now apply everywhere, so legacy pages reflow until their owners restore them (contract 1.9).
NEEDS: `primitives` (Opus) to build wave 0b, branching from the current `redesign/v3` head.
