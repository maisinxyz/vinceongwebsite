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
