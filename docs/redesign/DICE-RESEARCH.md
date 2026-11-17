# DICE-RESEARCH: Digital Dice (ENSC 120), evidence and modelling guide

Author: `dice-research`. Audience: the `dice` builder. Date: 2026-11-16.
Labels used throughout: **[REPO]** seen in this repo, **[WEB]** from a cited URL, **[GENERIC]** standard electronics knowledge not tied to Vince's board, **[ASSUMPTION]** a guess. Nothing here has been verified against Vince's real board. Nobody on the project has seen it.

## 0. Bottom line

- No SFU ENSC 120 specification, lab handout, schematic or photo was found, online or on this machine. The web search for it returned only unrelated pages (an SFU ENSC 351 soldering guide, other schools' dice kits). Say "unverified reconstruction" on the page.
- The repo contradicts itself on display type (section 1.4). The part numbers drawn in the SVG are not electrically consistent (section 1.5), and their origin is unknown. They may be AI-written placeholders, so treat them as weak evidence.
- Recommendation: model the **logic** as a generic, display-agnostic pipeline (oscillator, 1..6 counter, decoder, display) and ship **both** decoders (7-pip and 7-segment) behind one `displayType` setting, defaulting to the 7-pip drawing the repo currently shows. Switch the default only when Vince answers question 1 in section 6.
- Closest family to the repo drawing: **A, 555 + CD4017 + diode-OR to 7 pip LEDs** (confidence about 50 percent that this matches the real board, about 80 percent that it is the best match to the *drawing*). Family C (binary counter + gates to a 7-segment digit) is the best match to the *page text*. Both stay unverified.

## 1. Repo evidence

Paths are relative to `vince-portfolio/` unless stated. A second copy of the same files exists under `.claude/worktrees/agent-a7e89fb2a78544612/`; it is a worktree and is ignored here.

### 1.1 Facts about the project (copy)
| Claim | Where |
|---|---|
| Course "ENSC 120", title "Electronics Laboratory Instruments Operation and Measurement Techniques" | `app/education/EducationPageClient.tsx:33-35` |
| "A mixed-technology PCB using combinational boolean logic to decode binary counter states into 7-segment LED dice patterns. Hand-soldered SMD and through-hole components." Tags Boolean Logic, PCB, SMD Soldering, EAGLE. COMPLETED 2025 | `app/projects/ProjectsPageClient.tsx:59-69` |
| "Engineered a digital dice using combinational logic and PCB assembly. Designed boolean logic circuits, assembled surface-mount components, and validated circuit behavior through systematic testing." Dates SEPT 2025 to DEC 2025 | `lib/utils.ts:166-177` |
| Skill tooltips: "SMD & through-hole for Digital Dice PCB", "Full assembly pipeline for Digital Dice", "PCB design for Digital Dice" (EAGLE) | `lib/utils.ts:237,244,259` |
| Page hero: "Combinational logic circuit with 7-segment display output." Demo caption: "Roll the dice, watch the 7-segment display decode the binary output." | `app/projects/dice/DicePageClient.tsx:51,71` |
| Details cards: "Designed the PCB layout in EAGLE with boolean logic gates and 7-segment decoder"; "Hand-soldered surface-mount components and validated each circuit stage systematically"; "Verified circuit behavior against truth table outputs for all six dice states" | `DicePageClient.tsx:148-150` |
| Truth table with 3-bit input `001`..`110`, decimal 1..6, segments a..g | `DicePageClient.tsx:14-21` |
| Original plan: 7-segment SVG die, `[ ROLL ]` button, random 1..6, "binary representation below" | `../PRD.md:376-392` |
| Decision to show the PCB SVG instead of the simulator on the detail page | `../UPDATEDPRD.md:318-333` |
| Old `SevenSegmentDisplay.tsx` (random 1..6, 12-step animation, segment map for 0..6) existed in git (commit `2563361`), no longer in the tree | `git show 2563361:vince-portfolio/components/SevenSegmentDisplay.tsx` |

### 1.2 Facts drawn in the SVG (`components/DigitalDicePCB.tsx`, 442 lines)
| Claim | Line |
|---|---|
| viewBox `0 0 480 380`, board green gradient `#1f7b43` to `#15592f` | 140, 157-161 |
| Silkscreen "E120-DIE-R2A" (click toggles an info box), "SFU ENSC 120", "BT1 9V" | 219, 221, 347 |
| Info box: "SFU ENSC 120 Soldering Project / Random Dice Roller. Mixed-technology PWB using SMD and through-hole components." | 226-228 |
| U1 = CD4017, "decade counter, 16-pin DIP socket" | 232-236 |
| U2 = CD4511, tooltip "display decode logic, 16-pin DIP socket" | 247-251 |
| C1..C11: 100 nF SMD decoupling (11 of them), positions in `SMD_CAPS` | 31-35, 263 |
| R1..R7: "LED current-limiting resistor, SMD 0805" (7) | 37-40, 272 |
| R8, R9: "timing/pull-up resistor, through-hole axial" | 42-44, 284 |
| D1..D4: 1N4148 through-hole signal diodes (4) | 46-48, 297 |
| C12, C13: electrolytic, "timing/bypass" and "power bypass" | 307-325 |
| Q1: N-channel MOSFET SOT-23 "switch"; Q2: PNP TO-92 "driver" | 327-344 |
| BT1: 9 V snap connector | 346-357 |
| SW1 ROLL: "hold to clock the counter, release to freeze result" | 360 |
| 7 pip LEDs LED1..LED7 at TL, TR, ML, CC, MR, BL, BR | 6, 21-29 |
| Face map: 1=CC; 2=TR,BL; 3=TR,CC,BL; 4=TL,TR,BL,BR; 5=+CC; 6=TL,TR,ML,MR,BL,BR | 12-19 |
| Behaviour: `Math.random()` per 66 ms while held, `Math.random()` on release | 104, 125 |
| Traces are decorative paths that do not connect the drawn pads | 199-207 |
| There is **no 555** or any oscillator chip drawn | whole file |

### 1.3 Facts from RECON/CONTRACT
`docs/redesign/RECON.md:77-80` lists the same items and the inferred overlaps (LED2 on C12, "DICE LEDS" label on C12, LED7 pads on C13, R2-R6 left pads on U2's right pins, Q1 pads on C11, U1 right pins and U2 left pins both at x=170, info popup under C1/C2/C5/C6). `CONTRACT.md:79` says the dice palette lives in `components/dice/dice.module.css`, with no global `--pcb-*` tokens, starting from the repo colours.

### 1.4 Contradiction: display type
- SVG, face map, tooltips, hover text: **7 separate pip LEDs** (dice layout).
- Hero copy, demo caption, project descriptions, truth table, old simulator, PRD: **7-segment display**.
These cannot both describe one board. A 7-segment digit and a 7-pip die are different parts. The page truth table is also **3-bit input to a-g segments**, which is not a 4511 (4-bit BCD input).

### 1.5 Contradictions inside the drawing
1. CD4017 outputs are one-hot decimal lines. A CD4511 needs 4-bit BCD input. A 4017 cannot feed a 4511 without an encoder (a diode OR network or an encoder IC would be needed) [GENERIC].
2. A 4511 drives one 7-segment digit, not seven pips. Seven pip LEDs plus 7 resistors R1-R7 is consistent with the 4017 diode-OR design, not with the 4511.
3. A 4017 design needs a clock source (usually a 555). None is drawn. R8/R9 and C12 are labelled "timing", but no chip exists to time.
4. The page text says "boolean logic gates" and "combinational logic". The drawing has no gate chip (no 74xx or CD40xx gate). The "U2 display decode logic" label is generic, and the CD4511 label sits only in the rotated chip text (line 251).
5. Q1 (N-MOSFET) and Q2 (PNP) have no clear role in any common dice design. 11 decoupling capacitors for two chips is far more than any real design needs.
6. No schematic, EAGLE file, report or photo exists anywhere in the repo or its git history that backs up any part number.

### 1.6 Sibling directories and local files
Searched `/Users/vincee_ong/Desktop/Repos/` (InternshipSearching, MSE-Course-schedule, MSE-Course-schedule-1, NASA-Space-Apps-Challenge, racerbot, racerbot(personal), racerbot_a, system-of-eqn) for "dice" and "ensc" (case-insensitive, excluding node_modules, .git, .next). Only hits: `racerbot_a` C++ headers (the word "indices", false positive). Also looked for EAGLE/KiCad/Fritzing file names on Desktop, Documents and Downloads, with no matches. **There is nothing dice- or ENSC-120-related outside this repo.** Not searched: iCloud, Google Drive, email, phone photos.

## 2. Web research

Search tool coverage: web search worked (US-only); some pages were fetched, two TI PDFs could not be decoded (so pin numbers below marked "datasheet not read" come from general knowledge and must be checked against the TI datasheets `https://www.ti.com/lit/ds/symlink/cd4017b.pdf` and `https://www.ti.com/lit/ds/symlink/cd4511b.pdf`).

### 2.0 SFU-specific search: nothing found
Query "SFU ENSC 120 digital dice soldering project lab" returned no ENSC 120 dice material. The closest SFU result was an ENSC 351 soldering guide (different course): https://opencoursehub.cs.sfu.ca/mba200/grav-cms/ensc351/guides/files/Soldering351.pdf. Reliability: real SFU document, **irrelevant to the dice**. The course catalogue entry for ENSC 120 was not retrieved. The only SFU-specific text is what is in this repo. Conclusion: the actual circuit is unknown.

### 2.1 Family A: 555 astable + CD4017 (reset at Q6) + diodes to 7 pip LEDs
Block: `[SW] -> [555 astable] -> CLK [CD4017 (Q0..Q5, Q6->RESET)] -> [diode OR groups] -> 7 pip LEDs (+R each)`.
- Parts [WEB]: NE555, CD4017B, 1N4148 diodes, 7 red 5 mm LEDs, 9 V battery; one listing has 10 kOhm and 47 uF around the 555 (https://circuitdigest.com/electronic-circuits/digital-dice-circuit-using-ic-555 lists 1 kOhm x2, RV1 10 kOhm, C1 10 uF, f = 1.44/((R1+2*RV1)*C1)). Value choices differ by source, so they are **per-source, not standard**.
- Wrap: only Q0..Q5 used; Q6 (pin 5) wired to RESET (pin 15), so the sequence restarts after the sixth state (https://www.engineersgarage.com/electronic-dice-circuit/, https://circuitdigest.com/...).
- Decode to pips [WEB]: engineersgarage describes each LED fed by several counter outputs through diodes (for example Q1, Q3 and Q5 together drive one LED), and that starting the sequence at 2 saves diodes. The exact wiring from the schematic image was not readable. The truth table in 4.3 is derived from standard pip layout [GENERIC], not copied from any one page.
- Press/hold/release [WEB]: engineersgarage says the switch controls the counter's disable (clock inhibit) input, so counting runs while held and freezes on release. circuitdigest says only that LEDs cycle while held and stop on release; it does not show the switch wiring. Common alternatives [GENERIC]: switch supplies power or enable to the 555 so it only clocks while held.
- Clock rate [WEB]: about 5 kHz (engineersgarage), 48 Hz (another listing in the search results). At several kHz the human eye sees all LEDs lit, which is why it feels random. Pick the web animation rate for visibility (section 4), not the real value.
- Reliability: engineersgarage and circuitdigest are hobby sites with schematics as images, partly unreadable here, and one typo ("CD4107"); medium reliability. The search snippet from industrialmonitordirect has pin labels that conflict with the 4017 pinout; **do not use it**.

### 2.2 Family B: counter (74LS90/7490, 4029/4518, 4510) + gates to pips or 7-segment
- 7490 variant: the counter resets when outputs QB and QC go high (binary 6), giving 0..5 or 1..6 depending on offset [WEB, search summary of electronicsforu.com, not independently fetched]. URLs: https://www.electronicsforu.com/electronics-projects/electronic-dice, https://www.electronicsforu.com/?p=16436. Reliability: magazine hobby article, medium.
- 4510 down-counter variant (Kitronik) [WEB, fetched]: 555 clocks a 4510B BCD up/down counter set to count down, parallel-load value 6, TC (active low) inverted by an NPN to drive PL so it reloads 6 when it hits 0; a CD4511 then drives a 7-segment digit. Button releases the 555 from reset only while held; release stops the clock and the display holds. Source: https://kitronik.co.uk/blogs/resources/how-to-make-a-7-segment-electronic-dice. Reliability: commercial kit instructions, fairly good; the page itself notes a possible brief 0 during reload (inferred in its text, not stated).
- 0..5 plus adder variant [WEB, search summary]: count 0..5 (reset at binary 6) then add 1 with a 7483, feeding a 7447. URL: https://www.electronicsforu.com/?p=12966 (from the search result list). Reliability: hobby site, not fetched.
- Block: `[SW] -> [555] -> [binary counter] -> [reset gate at 6 or 7 or load] -> [pip logic gates | BCD-to-7seg decoder] -> display`.

### 2.3 Family C: binary counter + BCD-to-7-segment decoder (4511 or 7447) + one 7-segment digit
- Reset at 7: AND the Q0..Q2 outputs so that when the counter reaches binary 7 the AND output resets it, giving 0..6 or, with a preset, 1..6 (https://www.electro-tech-online.com/threads/limit-7-seg-electronic-dice-from-0-9-to-1-6.112743, forum, low reliability). Another forum approach resets when the decoder tries to light segment B for 7 (https://forum.allaboutcircuits.com/threads/electronic-dice.112902/, forum, low reliability).
- CD4026/CD4033 decade counter with built-in 7-segment output and reset after 6 pulses on pin 15, throw button briefly charges a capacitor so the clock keeps running after release (https://www.electronicsforu.com/electronics-projects/hardware-diy/7-segment-display-dice). Fetched. Counts 0..6 (a zero is possible). Reliability: magazine article, medium. This one **does not "latch on release"** the way the owner wants (it coasts on a capacitor).
- 4511 vs 7447: the 4511 has active-high outputs for common-cathode displays; the 7447 has open-collector active-low outputs for common-anode displays [GENERIC, also the search summary]. Datasheet not read.
- Fits the page text "decode binary counter states into 7-segment patterns" and the 3-bit table (a binary counter holding 1..6 in 3 bits is exactly the table's 001..110 inputs). A 4511 uses 4 input bits (D=0 for 1..6).

### 2.4 Teaching context
A PLTW class built a seven-LED random number generator ([WEB], from the same search) and Makezine documents a microcontroller dice (https://makezine.com/projects/2d6-smt-dice). These show seven-LED dice are a standard hobby design; they say nothing about SFU.

## 3. Which design does the repo drawing most plausibly match

Ranked, all unverified:
1. **Family A (555 + 4017 + diodes + 7 pips).** Matches: CD4017 as U1, diodes D1-D4 (a full OR network needs about 11, see 4.3, so the drawing is incomplete either way), 7 pip LEDs with 7 current-limit resistors, 9 V battery, hold-to-roll. Mismatches: no 555, CD4511 as U2, MOSFET, PNP.
2. **Family C (binary counter + 4511/gates + 7-segment).** Matches the page copy, the 3-bit table, "boolean logic", "SMD". Mismatches: the drawing shows pips.
3. Family B is plausible for either display.

Confidence the drawing matches the real board: **low (roughly 30 to 50 percent for family A's general shape, under 20 percent for any specific part number)**. The silkscreen name "E120-DIE-R2A" and part values may have been generated by an earlier AI pass; do not present them as real. Unverified until Vince confirms.

## 4. Recommended logical model

State the model so it works for either display, with the display type a config value.

### 4.1 State machine
- State `count` in {1..6}. Initial value: 1 [ASSUMPTION; real boards often power up at a random state, but a deterministic 1 is testable].
- Inputs: `pressed` (boolean), `tick` (clock edges).
- Oscillator: runs only while `pressed` is true (models the "disable/enable while held" approaches in 2.1 and 2.2). Web animation rate: about 15 to 20 Hz (`period` 50 to 66 ms) so faces are readable; a real board is faster [WEB, 2.1]. Document that the rate is cosmetic.
- On each rising clock edge while pressed: `count = count == 6 ? 1 : count + 1`. (A real 4017 counts Q0..Q5 then resets on Q6; the model hides that one-hot index `q = count - 1` and the 7th state is never shown. Optional: show a glitch-free reset since the 4017 reset is asynchronous and Q6 is high for nanoseconds only [GENERIC, datasheet not read].)
- On release: clock stops, `count` holds, display latches it. No `Math.random()` anywhere; the result depends on press duration (deterministic given tick count). To make results feel random, derive tick timing from real elapsed ms at press, which is naturally non-deterministic, but the *simulation function* takes an explicit tick count so tests are exact.
- Power: when unpowered, display blank, state kept.
- API suggestion: `step(state)`, `decode(count, displayType) -> boolean[]`, `ticksForHold(ms, period)` pure functions, so unit tests do not need timers.

### 4.2 Counter output lines
One-hot (family A): `Q0..Q5` with `Qn` high when `count == n+1`. Binary (family C): `C B A = count` as 3 bits (1=001 ... 6=110).

### 4.3 Decoder truth table, 7-pip layout (matches the repo's `FACE_LEDS`)
Pip positions: TL, TR / ML, CC, MR / BL, BR. Face 1 = CC only, and so on.
| count | one-hot | TL | TR | ML | CC | MR | BL | BR |
|---|---|---|---|---|---|---|---|---|
| 1 | Q0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 2 | Q1 | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| 3 | Q2 | 0 | 1 | 0 | 1 | 0 | 1 | 0 |
| 4 | Q3 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| 5 | Q4 | 1 | 1 | 0 | 1 | 0 | 1 | 1 |
| 6 | Q5 | 1 | 1 | 1 | 0 | 1 | 1 | 1 |
Grouped logic [GENERIC, derived, checked row by row]: `CC = Q0|Q2|Q4`; `TR = BL = Q1|Q2|Q3|Q4|Q5`; `TL = BR = Q3|Q4|Q5`; `ML = MR = Q5`. In diode form each OR group needs one diode per source line: 3 (CC), 5 (TR/BL), 3 (TL/BR), 0 (ML/MR, driven by Q5 directly), so 11 diodes if each group is shared by its LED pair. The repo draws only D1-D4, so the drawing cannot be a complete diode OR network; do not claim a diode count for the real board. [ASSUMPTION] The repo's existing mapping (TR and BL for 2) is the standard Western die; some boards use TL/BR, with no source on this board.

### 4.4 Decoder truth table, 7-segment digit
Segments a (top), b (top right), c (bottom right), d (bottom), e (bottom left), f (top left), g (middle). Same as `DicePageClient.tsx:14-21` and verified against the standard digit shapes.
| count | C B A | a | b | c | d | e | f | g |
|---|---|---|---|---|---|---|---|---|
| 1 | 001 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 2 | 010 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 3 | 011 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| 4 | 100 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 5 | 101 | 1 | 0 | 1 | 1 | 0 | 1 | 1 |
| 6 | 110 | 1 | 0 | 1 | 1 | 1 | 1 | 1 |
Note: the 6 with the top bar (segment a on) is the common form; a 4511 draws it with a on [GENERIC from memory, datasheet not read]. Out-of-range input (0, 7, and BCD 10..15) must be handled explicitly: the model should show blank for non-1..6 states. A 4511 blanks 10..15 [GENERIC from memory].

### 4.5 Edge cases to unit-test
1. Faces 1..6 each decode to exactly the tables above, for both display types (twelve assertions).
2. Wrap: from 6 one tick gives 1; never 0 or 7; after 6 ticks from any state, back to the same state.
3. Tick count n from state s gives `((s - 1 + n) mod 6) + 1` (n up to 1000).
4. Hold then release: after release further ticks do nothing; display equals the last face; state unchanged by a second release.
5. Press while powered off: no change. Power on restores the held face (or blank, choose and document).
6. Zero-length press (down and up in the same frame): count may be unchanged (0 ticks) or advance by one; define it and test it. [ASSUMPTION: unchanged.]
7. Pointer cancel or leaving the button during a hold behaves as a release (the current code uses `pointercancel`).
8. Keyboard: Space/Enter down and up act as press and release; key repeat must not double-clock.
9. Long hold (more than 10 s) does not drift or leak timers; unmount mid-hold cleans up.
10. Pip counts per face are 1..6 (so a `lit.length === face`), the pip layout is symmetric under 180 degree rotation for faces 2..6 (a sanity check of the table).
11. Reduced motion: results identical, only the animation differs.

## 5. Recommended component list for the illustration

Units are board units on the fixed `viewBox 0 0 480 380` (1 unit approx 0.25 mm if 120 mm wide [ASSUMPTION, cosmetic only]). Proportions come from the existing drawing unless noted. Every part carries a bounding box that includes its own label and pads, so the overlap checker can run. "Nets" use one-hot names (`Q0..Q5`).

Source tag legend: **R** from repo, **G** from generic design, **A** assumption.

| id | type | label | pins | footprint (w x h units) | nets | source |
|---|---|---|---|---|---|---|
| BT1 | 9 V snap connector | BT1 9V | 2 | 38 x 13 body plus 2 pads | VCC (red), GND (black) | R (BT1), G (value) |
| SW1 | tactile push button | SW1 ROLL | 4 (2 pairs) | 48 x 34 | `ROLL` to GND / enable net | R (name, hold/release), A (placement and nets) |
| U3 | NE555 timer, DIP-8 | U3 | 8 | 50 x 64 (same pitch 14, 4 per side) | VCC, GND, `CLK` out, RC nodes | **G only. Not in the repo.** Mark "assumed; the repo shows no oscillator chip" |
| R10 | 555 timing resistor | R10 | 2 | axial 46 x 10 | VCC to 555 | G (A for the id) |
| C14 | 555 timing capacitor | C14 | 2 | 20 x 12 | 555 to GND | G (A for the id) |
| U1 | CD4017 decade counter, DIP-16 | U1 CD4017 | 16 | 98 x 128 (from repo) | `CLK` in, `RESET` from Q6, Q0..Q5 out, VDD, VSS, clock-inhibit | R (part number and size), G (pins) |
| U2 | decode block | U2 | 16 | 98 x 128 | Q0..Q5 to pips | R positions, but **the CD4511 label is an unverified, electrically inconsistent claim**. Label it "display decode (assumed)" and keep part number out of public copy. |
| D1..Dn | 1N4148 diode (OR groups) | D1..Dn | 2 | axial 46 x 12 | Q-line to pip group node | R (D1-D4 exist), A (count; 4 is too few for a full OR network) |
| R1..R7 | LED resistor 0805 | R1..R7 | 2 | 32 x 14 | pip group to LED anode | R (7) |
| LED1..LED7 | 5 mm pip LED | LED1..LED7 | 2 | circle r 11 plus 22 x 8 pad span | TL, TR, ML, CC, MR, BL, BR | R |
| C1..C11 | SMD decoupling 0805 | C1..C11 | 2 | 28 x 10 | VCC to GND | R (count), **A (values; 11 is far more than needed, consider showing 2 to 4 only and confirm with Vince)** |
| C12, C13 | electrolytic | C12, C13 | 2 | 38 x 35 / 30 x 28 (as drawn) | VCC bypass | R |
| Q1, Q2 | MOSFET SOT-23 / PNP TO-92 | Q1, Q2 | 3 | 15 x 19 / 36 x 16 | undetermined | R (parts). **Role unknown; recommend omitting or marking "function unverified"** |
| H1..H4 | corner mounting pad | none | 1 | r 6 | none | R (the four corner pads) |
| Silk | text | E120-DIE-R2A, SFU ENSC 120 | n/a | text boxes | none | R (text), A (whether it is real) |

If the owner confirms a 7-segment digit, replace LED1..LED7 with one `DS1` display (about 36 x 56, 10 pins in two rows of 5, 7 segments plus decimal point plus 2 commons) and a `U2` decoder. Keep R1..R7 as segment resistors (7).

Layout rule for the builder [GENERIC advice]: use a component table with fixed x, y, w, h, rotation, and pin positions in a local grid; compute pad positions from the table; route every trace from the table (nets) rather than free-form paths; and run the overlap check over the union of body, pads, label and trace boxes. The existing overlaps in RECON come from hard-coded coordinates that disagree with each other.

## 6. Questions for Vince (only he can answer)
1. **Display:** seven separate pip LEDs shaped like a die, or one 7-segment digit?
2. **Chips:** the part numbers on the real board (counter, decoder or gates, 555 or other oscillator). Are CD4017 and CD4511 real or placeholders?
3. **Counter type and wrap:** does it count 1..6 directly, or 0..5 plus one? Does it ever show 0 or 7?
4. **Button:** does it start the clock only while held, or inhibit the counter? Does the roll coast after release?
5. **Power:** 9 V battery, 5 V regulated, or something else? Is there a switch?
6. **Board:** colour (green? other), size, which parts are SMD vs through-hole, a photo of the top side, and the real board name on the silkscreen (is "E120-DIE-R2A" real?).
7. **EAGLE files or the lab report/schematic:** can they be dropped into the repo?
8. **Transistors Q1/Q2 and diodes D1-D4:** do they exist on the real board, and what do they do?
9. **Clock speed** if known, and any LED colour.
10. Is it fine to publish the course name "ENSC 120" and the "Soldering Project" text?
