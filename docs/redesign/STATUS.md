# Redesign v3: status report (paused 2026-11-16)

Work was paused at Vince's request to save usage. Everything is on branch `redesign/v3`. Nothing is pushed, and `main` is untouched.

## Done (merged on `redesign/v3`, `npm run verify` green after each step)
| Step | Commit(s) | What it gives |
|---|---|---|
| Recon, spec, contract | `a8392bd` and earlier | `SPEC.md` (Vince's rules), `RECON.md`, `CONTRACT.md` (binding plan for every stream), `DICE-RESEARCH.md`, `BOARD.md` (decision log) |
| Wave 0a foundation-core (Opus) | `544f4ea`, fix `2c62548` | Semantic colour tokens with dark and light sets; blocking theme script (no flash); `lib/theme.ts` with the View Transitions reveal; `--nav-gutter` CSS (rail 71/44/0 px, bottom section bar under 1024 px); `PageShell` and `Band`; data moved to `lib/data/**`; vitest, Playwright, axe, zod and resend installed; 13 dead files deleted |
| Token codemod | `967accf` | 171 legacy colour classes moved onto tokens; `--check` prints 0 remaining |
| Spacing reset removed | `4b44433` | The unlayered `* { margin:0; padding:0 }` had silently disabled every Tailwind spacing class. It is removed, and `lib/styles.test.ts` keeps it from coming back. **Pages still on the old layout look looser until their owner stream restores them** against `docs/redesign/baseline/*.png` (local only, not committed) |
| Wave 0b primitives (Opus) | `467ef67` (fixes `f75d21d`) | `lib/motion.ts` (one shared set of eases and durations), Button, IconButton, Toggle, Select, Popover, Tabs, Toast, IconSwap, SuccessMark, the nav ThemeToggle, ProjectShell, the `/dev/motion` sandbox (404 in production), Navbar and footer spacing restored. Reviewed by the contact agent: no blockers |

## In flight / next
1. Primitives is merged. Its last fix commit `f75d21d` (contact-review fixes) passed verify, but the agent was stopped before its browser re-check, so those fixes are **not browser-verified**. Re-check `/dev/motion` (Select, Toast action) and `/contact` with JS disabled.
2. The contract is amended for the accepted primitive departures (CONTRACT 2.4, "Amended after the primitives review").
3. **Not started: wave 1** (the SPEC A–H features). Streams in CONTRACT section 8:
   - 1a: contact (send email), dice (rebuild, using DICE-RESEARCH.md), edu-content, laptop (scroll-scrubbed), spice3d, proj-dawntrace.
   - 1b: proj-racerbot, proj-mse112, proj-engram, proj-stardew, landing, gutter (with its Playwright overlap test).
   - Then wave 2 (theme audits in both themes), wave 3 (qa) and the final review.
   Each stream's files, acceptance criteria and reviewer are already fixed in the contract, so a new session can dispatch them directly.

## TODO(vince): facts only you can supply
- DAWNTRACE: Arduino or ESP32-S3 (the Projects page and the brief disagree); date range.
- YOLOX sorting: year, status, dates, which models were compared, results.
- Shape sorting: year, status, dates; the shapes and vision method; hardware or software.
- Racerbot: your part, results, repo link.
- Stardew Earth (FieldTwin, NASA Space Apps): confirm the display name; year, status, team, role, stack, links.
- Digital dice: a photo, schematic or BOM of the real board, and which display it used (7-segment or pips). The research questions are in DICE-RESEARCH.md section 6.
- Venu: the experience entry is not in the repo. Supply role, dates and description.
- Recognition logos: the BC Mark needs written government approval, and the Rotary logo sits behind a members-only login. Both show as monograms unless you supply permitted files.
- Resilient Privacy: confirm whether "React" belongs in its tech list.

## Defaults the lead took
- Spacing reset removed (option A). Hover-grow of the side rail reserves space but does not push content.
- Contrast: grey tiers collapsed to meet AA; `--accent-fg #7FAACB`; light-mode muted `#555`.
- Email: Resend, sending from `onboarding@resend.dev` at first; env `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. The address is shown only on `/contact`, via `CONTACT_PUBLIC_EMAIL`. The rate limit is in memory.
- cyberbug is list-only: 9 projects, 8 detail pages planned.
- `tmp-scripts/` and the tracked `next.log` are left for you to decide on.

## Known open issues
- Your personal email is still hardcoded in `app/page.tsx`, `ContactPageClient.tsx`, `CardPageClient.tsx` and `DynamicPortfolio.tsx`. A test allowlists these four files until their owners remove the address in wave 1. **Hard rule 4 is not met yet.**
- `EducationPageClient.tsx` still hotlinks three Wikimedia logos (wave 1, laptop/edu-content).
- `DynamicPortfolio.tsx` still uses springs (wave 2).

## Unverified
- Safari and Firefox (only Chromium was tested); real touch drag; screen readers.
- Cross-tab theme sync; gutter measurements at 768 and 1920.
- Dice fidelity: no SFU ENSC 120 source was found, so the rebuild will be a generic reconstruction flagged as unverified.
- Stardew Earth details.
