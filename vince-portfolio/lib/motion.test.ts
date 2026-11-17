import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DUR,
  EASE,
  EASE_CSS,
  EXIT_FACTOR,
  KNOB_STRETCH,
  POPOVER_FROM_SCALE,
  PRESS_SCALE,
  STAGGER_MS,
  T,
  V,
  arcPath,
  arcPoint,
  exitMs,
  heldOr,
  knobStretch,
  originFromTrigger,
  rubberband,
  rubberbandClamp,
  sec,
  settleDelay,
} from "./motion";

const root = fileURLToPath(new URL("..", import.meta.url));
const motionCss = readFileSync(`${root}styles/motion.css`, "utf8");
const themeTs = readFileSync(`${root}lib/theme.ts`, "utf8");

const cssVar = (name: string): string | undefined =>
  motionCss.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
const ms = (v: string | undefined) => {
  expect(v, "value present").toBeDefined();
  expect(v).toMatch(/^\d+ms$/);
  return Number(v!.replace("ms", ""));
};

describe("styles/motion.css matches lib/motion.ts", () => {
  it.each([
    ["dur-enter", DUR.enter],
    ["dur-exit", exitMs(DUR.enter)],
    ["dur-move", DUR.move],
    ["dur-dropdown", DUR.dropdown],
    ["dur-dropdown-exit", exitMs(DUR.dropdown)],
    ["dur-press-in", DUR.pressIn],
    ["dur-press-out", DUR.pressOut],
    ["dur-icon", DUR.iconSwap],
    ["dur-pulse", DUR.pulse],
    ["dur-release", DUR.release],
    ["dur-theme", DUR.theme],
    ["dur-reduced", DUR.reduced],
    ["stagger", STAGGER_MS],
  ])("--%s = %d ms", (name, expected) => {
    expect(ms(cssVar(name))).toBe(expected);
  });

  it("declares no --dur-* var without a constant", () => {
    const declared = [...motionCss.matchAll(/--(dur-[a-z-]+):/g)].map((m) => m[1]).sort();
    expect(declared).toEqual(
      ["dur-enter", "dur-exit", "dur-move", "dur-dropdown", "dur-dropdown-exit", "dur-press-in", "dur-press-out",
        "dur-icon", "dur-pulse", "dur-release", "dur-theme", "dur-reduced"].sort(),
    );
  });

  it("scale vars equal the constants", () => {
    expect(Number(cssVar("press-scale"))).toBe(PRESS_SCALE);
    expect(Number(cssVar("popover-from"))).toBe(POPOVER_FROM_SCALE);
    expect(Number(cssVar("knob-stretch"))).toBe(KNOB_STRETCH);
  });

  it("easing vars equal EASE_CSS", () => {
    expect(cssVar("ease-out")).toBe(EASE_CSS.out);
    expect(cssVar("ease-in-out")).toBe(EASE_CSS.inOut);
  });

  it("carries the reduced-motion block, the escape hatch and the focus ring", () => {
    expect(motionCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(motionCss).toContain(':where(*:not([data-motion-essential]))');
    expect(motionCss).toContain("transition-property: opacity !important");
    expect(motionCss).toMatch(/::view-transition-group\(root\)\s*\{\s*animation-duration: var\(--dur-reduced\)/);
    expect(motionCss).toMatch(/:focus-visible\s*\{\s*outline: 2px solid var\(--focus\);\s*outline-offset: 2px;/);
  });
});

describe("lib/theme.ts inlined literals (CONTRACT 1.7)", () => {
  it("THEME_DUR_MS equals DUR.theme", () => {
    expect(Number(themeTs.match(/const THEME_DUR_MS = (\d+);/)?.[1])).toBe(DUR.theme);
  });
  it("THEME_EASE equals EASE_CSS.inOut", () => {
    expect(themeTs.match(/const THEME_EASE = "([^"]+)";/)?.[1]).toBe(EASE_CSS.inOut);
  });
});

describe("constants", () => {
  it("EASE_CSS spells the EASE tuples", () => {
    expect(EASE_CSS.out).toBe(`cubic-bezier(${EASE.out.join(", ")})`);
    expect(EASE_CSS.inOut).toBe(`cubic-bezier(${EASE.inOut.join(", ")})`);
  });
  it("durations sit in the SPEC B ranges", () => {
    const within = (d: number, lo: number, hi: number) => expect(d >= lo && d <= hi, `${d} in ${lo}–${hi}`).toBe(true);
    for (const d of [DUR.enter, DUR.enterSm, DUR.enterLg]) within(d, 200, 300);
    for (const d of [DUR.move, DUR.moveSm, DUR.moveLg]) within(d, 250, 400);
    expect(DUR.dropdown).toBeGreaterThanOrEqual(150);
    expect(DUR.dropdown).toBeLessThanOrEqual(250);
    expect(DUR.iconSwap).toBeGreaterThanOrEqual(150);
    expect(DUR.iconSwap).toBeLessThanOrEqual(200);
    expect(STAGGER_MS).toBeGreaterThanOrEqual(30);
    expect(STAGGER_MS).toBeLessThanOrEqual(50);
  });
  it("exits are 0.8 × enter", () => {
    expect(EXIT_FACTOR).toBe(0.8);
    expect(exitMs(220)).toBe(176);
    expect(T.exit.duration).toBeCloseTo(0.192);
    expect(T.dropdownClose.duration).toBeCloseTo(0.176);
    expect(T.iconOut.duration).toBeCloseTo(0.144);
    expect(sec(DUR.dropdown)).toBe(0.22);
  });
  it("settleDelay steps by STAGGER_MS", () => {
    expect(settleDelay(0)).toBe(0);
    expect(settleDelay(3)).toBeCloseTo(0.12);
    expect(settleDelay(2, 30)).toBeCloseTo(0.06);
  });
  it("heldOr is instant while held", () => {
    expect(heldOr(true, T.move)).toBe(T.instant);
    expect(heldOr(false, T.move)).toBe(T.move);
  });
  it("knobStretch stretches along the travel axis only", () => {
    expect(knobStretch("x", true)).toEqual({ scaleX: 1.12 });
    expect(knobStretch("x", false)).toEqual({ scaleX: 1 });
    expect(knobStretch("y", true)).toEqual({ scaleY: 1.12 });
  });
  it("variants start popovers at 0.95 and icons blurred", () => {
    expect(V.popover.hidden.scale).toBe(0.95);
    expect(V.iconSwap.hidden.filter).toBe("blur(4px)");
    expect(V.reducedFade.visible.transition.duration).toBe(0.12);
  });
});

describe("rubberband", () => {
  it("follows r(x) = (1 − 1/(x·0.55/limit + 1))·limit", () => {
    const limit = 10;
    for (const x of [1, 5, 10, 40]) expect(rubberband(x, limit)).toBeCloseTo((1 - 1 / ((x * 0.55) / limit + 1)) * limit);
  });
  it("never exceeds the limit and preserves sign", () => {
    for (const x of [0.1, 1, 10, 100, 1e6, 1e12, Infinity]) {
      expect(rubberband(x, 6)).toBeLessThanOrEqual(6);
      expect(rubberband(-x, 6)).toBeGreaterThanOrEqual(-6);
      expect(Math.sign(rubberband(-x, 6))).toBe(-1);
    }
    expect(rubberband(0, 6)).toBe(0);
    expect(rubberband(5, 0)).toBe(0);
    expect(rubberband(Number.NaN, 6)).toBe(0);
  });
  it("is monotonic", () => {
    let prev = 0;
    for (let x = 0.5; x < 200; x += 0.5) {
      const r = rubberband(x, 6);
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });
  it("rubberbandClamp passes through inside and resists outside", () => {
    expect(rubberbandClamp(5, 0, 20, 6)).toBe(5);
    expect(rubberbandClamp(-30, 0, 20, 6)).toBeGreaterThanOrEqual(-6);
    expect(rubberbandClamp(-30, 0, 20, 6)).toBeLessThan(0);
    expect(rubberbandClamp(500, 0, 20, 6)).toBeLessThanOrEqual(26);
    expect(rubberbandClamp(500, 0, 20, 6)).toBeGreaterThan(20);
  });
});

describe("arcs", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 100, y: 0 };
  it("starts and ends on the endpoints", () => {
    expect(arcPoint(a, b, 0)).toEqual(a);
    expect(arcPoint(a, b, 1)).toEqual(b);
  });
  it("bows perpendicular by bend × distance at the control point (half of it at t=0.5)", () => {
    const mid = arcPoint(a, b, 0.5);
    expect(mid.x).toBeCloseTo(50);
    expect(mid.y).toBeCloseTo(12.5); // control at y=25, quadratic midpoint is half
    expect(arcPoint(a, b, 0.5, -0.25).y).toBeCloseTo(-12.5);
  });
  it("arcPath is an SVG quadratic", () => {
    expect(arcPath(a, b)).toBe("M 0 0 Q 50 25 100 0");
  });
});

describe("originFromTrigger", () => {
  const rect = (left: number, top: number, width: number, height: number) =>
    ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {} }) as DOMRect;
  it("aims at the trigger centre in the content's coordinates", () => {
    expect(originFromTrigger(rect(100, 50, 40, 20), rect(90, 78, 200, 120))).toBe("30px -18px");
  });
});

describe("no springs in the motion layer and primitives", () => {
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = `${dir}/${f}`;
      return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
    });
  const scope = [
    `${root}lib/motion.ts`,
    ...files(`${root}components/primitives`),
    `${root}components/theme/ThemeToggle.tsx`,
    `${root}components/RevealOnScroll.tsx`,
    `${root}components/Navbar.tsx`,
    `${root}components/ui/footer.tsx`,
  ];
  it.each(scope.map((f) => [f.replace(root, "")]))("%s", (rel) => {
    const src = readFileSync(root + rel, "utf8");
    expect(src).not.toMatch(/type:\s*["']spring["']|stiffness\s*:|damping\s*:/);
  });
});
