/* ═══════════════════════════════════════════════════
   MOTION (CONTRACT 2.1)
   One source for every easing, duration and framer transition on the site.
   styles/motion.css mirrors the durations as CSS vars; lib/motion.test.ts
   keeps the two (and the literals inlined in lib/theme.ts) in sync.
   No springs anywhere: use T.* only.
   ═══════════════════════════════════════════════════ */
import { useSyncExternalStore } from "react";
import type { Transition, Variants } from "framer-motion";

export type Bezier = readonly [number, number, number, number];
export type Pt = { x: number; y: number };

export const EASE = { out: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1] } as const satisfies Record<string, Bezier>;
export const EASE_CSS = { out: "cubic-bezier(0.22, 1, 0.36, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)" } as const;

/** Milliseconds. */
export const DUR = {
  enter: 240, enterSm: 200, enterLg: 300, // entrances 200–300
  move: 320, moveSm: 250, moveLg: 400, // moves 250–400
  dropdown: 220, pressIn: 80, pressOut: 160,
  iconSwap: 180, pulse: 450, check: 300, checkDelay: 100,
  release: 300, theme: 400, reduced: 120,
} as const;

export const EXIT_FACTOR = 0.8;
/** exitMs(220) === 176 */
export const exitMs = (enterMs: number): number => Math.round(enterMs * EXIT_FACTOR);
export const sec = (ms: number): number => ms / 1000;

export const PRESS_SCALE = 0.97;
export const POPOVER_FROM_SCALE = 0.95;
export const KNOB_STRETCH = 1.12;
/** Allowed 30–50; use 40 unless a layout needs 30 or 50. */
export const STAGGER_MS = 40;
export const ICON_SWAP = { blurPx: 4, fromScale: 0.8, ms: DUR.iconSwap } as const;
export const PULSE = { scale: [1, 1.15, 1], opacity: [0.5, 0], ms: DUR.pulse } as const;
export const RUBBERBAND_K = 0.55;

/** r(x) = (1 − 1/(x·k/limit + 1))·limit, sign-preserving. Never exceeds `limit`. */
export function rubberband(overshoot: number, limit: number, k = RUBBERBAND_K): number {
  if (!(limit > 0) || overshoot === 0 || Number.isNaN(overshoot)) return 0;
  if (!Number.isFinite(overshoot)) return Math.sign(overshoot) * limit;
  const x = Math.abs(overshoot);
  const r = (1 - 1 / ((x * k) / limit + 1)) * limit;
  return Math.sign(overshoot) * Math.min(r, limit);
}

/** Inside [min,max] returns value; outside returns bound ± rubberband(excess, limit). */
export function rubberbandClamp(value: number, min: number, max: number, limit: number): number {
  if (value < min) return min - rubberband(min - value, limit);
  if (value > max) return max + rubberband(value - max, limit);
  return value;
}

function control(from: Pt, to: Pt, bend: number): Pt {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Perpendicular (−dy, dx) has the same length as from→to, so this offsets by bend × distance.
  return { x: (from.x + to.x) / 2 - dy * bend, y: (from.y + to.y) / 2 + dx * bend };
}

/** Quadratic-bezier point; control point offset perpendicular to from→to by bend × distance (default 0.25, sign picks side). */
export function arcPoint(from: Pt, to: Pt, t: number, bend = 0.25): Pt {
  const c = control(from, to, bend);
  const u = 1 - t;
  return {
    x: u * u * from.x + 2 * u * t * c.x + t * t * to.x,
    y: u * u * from.y + 2 * u * t * c.y + t * t * to.y,
  };
}

/** "M x0 y0 Q cx cy x1 y1" for SVG paths and CSS offset-path. */
export function arcPath(from: Pt, to: Pt, bend = 0.25): string {
  const c = control(from, to, bend);
  const n = (v: number) => Number(v.toFixed(2));
  return `M ${n(from.x)} ${n(from.y)} Q ${n(c.x)} ${n(c.y)} ${n(to.x)} ${n(to.y)}`;
}

/** transform-origin string in the content box's coordinates, aimed at the trigger centre. Call on open AND on close. */
export function originFromTrigger(trigger: DOMRect, content: DOMRect): string {
  const x = trigger.left + trigger.width / 2 - content.left;
  const y = trigger.top + trigger.height / 2 - content.top;
  return `${Math.round(x)}px ${Math.round(y)}px`;
}

/** delay in seconds for settle order: 0 container, 1 icon, 2 label, 3 secondary details. */
export const settleDelay = (step: number, stepMs = STAGGER_MS): number => sec(step * stepMs);
/** While held or dragging, no tween. */
export const heldOr = (held: boolean, t: Transition): Transition => (held ? T.instant : t);
export const knobStretch = (axis: "x" | "y", moving: boolean) =>
  axis === "x" ? { scaleX: moving ? KNOB_STRETCH : 1 } : { scaleY: moving ? KNOB_STRETCH : 1 };

/** framer-motion transitions */
export const T = {
  enter: { duration: sec(DUR.enter), ease: EASE.out },
  exit: { duration: sec(exitMs(DUR.enter)), ease: EASE.out }, // 192 ms
  move: { duration: sec(DUR.move), ease: EASE.inOut },
  dropdownOpen: { duration: sec(DUR.dropdown), ease: EASE.out },
  dropdownClose: { duration: sec(exitMs(DUR.dropdown)), ease: EASE.out }, // 176 ms
  pressIn: { duration: sec(DUR.pressIn), ease: EASE.out },
  pressOut: { duration: sec(DUR.pressOut), ease: EASE.out },
  iconIn: { duration: sec(DUR.iconSwap), ease: EASE.out },
  iconOut: { duration: sec(exitMs(DUR.iconSwap)), ease: EASE.out },
  release: { duration: sec(DUR.release), ease: EASE.out }, // rubberband return
  arc: { x: { duration: sec(DUR.move), ease: EASE.inOut }, y: { duration: sec(DUR.move), ease: EASE.out } },
  reduced: { duration: sec(DUR.reduced), ease: "linear" },
  instant: { duration: 0 },
} as const satisfies Record<string, Transition | Record<string, Transition>>;

/** framer-motion variants */
export const V = {
  fadeUp: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: T.enter },
    exit: { opacity: 0, y: 8, transition: T.exit },
  },
  popover: {
    hidden: { opacity: 0, scale: POPOVER_FROM_SCALE },
    visible: { opacity: 1, scale: 1, transition: T.dropdownOpen },
    exit: { opacity: 0, scale: POPOVER_FROM_SCALE, transition: T.dropdownClose },
  },
  iconSwap: {
    hidden: { opacity: 0, scale: ICON_SWAP.fromScale, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: T.iconIn },
    exit: { opacity: 0, scale: ICON_SWAP.fromScale, filter: "blur(4px)", transition: T.iconOut },
  },
  settleContainer: { hidden: {}, visible: { transition: { staggerChildren: sec(STAGGER_MS) } } },
  reducedFade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: T.reduced },
    exit: { opacity: 0, transition: T.reduced },
  },
} as const satisfies Record<string, Variants>;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => (typeof window !== "undefined" && !!window.matchMedia?.(REDUCED_QUERY).matches);
const getServerReduced = () => false;

/**
 * prefers-reduced-motion, hydration-safe: false on the server and during
 * hydration, the real value right after. Use this instead of framer's
 * useReducedMotion() in anything that renders on the server (that one reads
 * matchMedia on the first client render and breaks hydration for reduced-motion users).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, getReduced, getServerReduced);
}

/* V.reducedFade, plus a reset of the transforms the full variants may already have applied
   (an element hydrated with V.fadeUp "hidden" carries y: 12 until something sets it back).
   Under MotionConfig reducedMotion="user" those transform values jump; only opacity fades. */
const REDUCED: Variants = {
  hidden: V.reducedFade.hidden,
  visible: { ...V.reducedFade.visible, x: 0, y: 0, scale: 1 },
  exit: V.reducedFade.exit,
};

/** Returns V.reducedFade (with a transform reset) when the user prefers reduced motion, else V[name]. */
export function useVariants(name: keyof typeof V): Variants {
  return usePrefersReducedMotion() ? REDUCED : (V[name] as Variants);
}
