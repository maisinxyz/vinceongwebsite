"use client";

import { useEffect, useId, useRef } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { EASE, KNOB_STRETCH, T, rubberbandClamp, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   TOGGLE (CONTRACT 2.4): role="switch"
   Click, Space and Enter toggle (native <button>). The knob is draggable:
   while held its x is bound straight to the pointer (no tween), resisted
   with rubberbandClamp (6 px) past either end and stretched 12 % along x.
   On release it snaps with T.move (T.release when coming back from past an
   end). A drag never also fires the click toggle.
   Reduced motion: the knob jumps to its end, aria-checked is synchronous.
   ═══════════════════════════════════════════════════ */
export type ToggleProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: string;
  hideLabel?: boolean;
  size?: "sm" | "md";
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Departure (BOARD CONCERN 18:34): React 19 ref-as-prop, the switch button. */
  ref?: React.Ref<HTMLButtonElement>;
};

const DIMS = {
  md: { w: 44, h: 24, knob: 18, pad: 3 },
  sm: { w: 36, h: 20, knob: 14, pad: 3 },
} as const;
const RUBBER_LIMIT = 6;
const DRAG_SLOP = 3;
const STRETCH = KNOB_STRETCH; // knobStretch("x", moving) as a raw value for useMotionValue

export function Toggle({ checked, onCheckedChange, label, hideLabel = false, size = "md", disabled = false, id, className, ref }: ToggleProps) {
  const autoId = useId();
  const switchId = id ?? `toggle-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const labelId = `${switchId}-label`;
  const d = DIMS[size];
  const travel = d.w - d.knob - 2 * d.pad;

  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(checked ? travel : 0);
  const scaleX = useMotionValue(1);
  const drag = useRef<{ pointerId: number; startX: number; startKnob: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const fromDrag = useRef(false);

  // Follow `checked`. Never runs a tween while the knob is held.
  useEffect(() => {
    if (drag.current?.moved) return;
    const target = checked ? travel : 0;
    const wasDrag = fromDrag.current;
    fromDrag.current = false;
    if (reduced) {
      x.set(target);
      scaleX.set(1);
      return;
    }
    const from = x.get();
    if (from === target) {
      if (scaleX.get() !== 1) {
        const s = animate(scaleX, 1, T.release);
        return () => s.stop();
      }
      return;
    }
    const outside = from < 0 || from > travel;
    const ax = animate(x, target, outside ? T.release : T.move);
    const as = wasDrag
      ? animate(scaleX, 1, outside ? T.release : T.move)
      : animate(scaleX, [1, STRETCH, STRETCH, 1], { duration: T.move.duration, times: [0, 0.3, 0.7, 1], ease: EASE.inOut });
    return () => {
      ax.stop();
      as.stop();
    };
  }, [checked, travel, reduced, x, scaleX]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    suppressClick.current = false;
    if (disabled || e.button !== 0) return;
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startKnob: x.get(), moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const g = drag.current;
    if (!g || e.pointerId !== g.pointerId) return;
    const dx = e.clientX - g.startX;
    if (!g.moved) {
      if (Math.abs(dx) < DRAG_SLOP) return;
      g.moved = true;
      x.stop();
      scaleX.stop();
      scaleX.set(reduced ? 1 : STRETCH); // held: set directly, no tween
    }
    x.set(rubberbandClamp(g.startKnob + dx, 0, travel, RUBBER_LIMIT));
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const g = drag.current;
    if (!g || e.pointerId !== g.pointerId) return;
    drag.current = null;
    if (!g.moved) return;
    suppressClick.current = true; // the click that follows this pointerup is not a toggle
    const next = cancelled ? checked : x.get() > travel / 2;
    fromDrag.current = true;
    if (next !== checked) {
      onCheckedChange(next);
      return;
    }
    // Same state: snap back here (the effect will not re-run).
    fromDrag.current = false;
    const target = checked ? travel : 0;
    if (reduced) {
      x.set(target);
      scaleX.set(1);
      return;
    }
    const from = x.get();
    const t = from < 0 || from > travel ? T.release : T.move;
    animate(x, target, t);
    animate(scaleX, 1, t);
  };

  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (!disabled) onCheckedChange(!checked);
  };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {!hideLabel && (
        <label
          id={labelId}
          htmlFor={switchId}
          className={cn(
            "cursor-pointer select-none font-[family-name:var(--font-ibm-plex-mono-family)] text-sm text-chalk",
            disabled && "cursor-not-allowed text-subtle",
          )}
        >
          {label}
        </label>
      )}
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={hideLabel ? undefined : labelId}
        aria-label={hideLabel ? label : undefined}
        disabled={disabled}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e, false)}
        onPointerCancel={(e) => endDrag(e, true)}
        onClick={onClick}
        data-state={checked ? "on" : "off"}
        className="press-scale group relative inline-flex h-11 min-w-11 touch-pan-y items-center justify-center rounded-full disabled:cursor-not-allowed"
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative block rounded-full border transition-colors duration-(--dur-move) ease-in-out",
            checked ? "border-accent bg-accent" : "border-line-strong bg-iron",
            "group-disabled:border-steel group-disabled:bg-iron",
          )}
          style={{ width: d.w, height: d.h }}
        >
          <motion.span
            data-knob
            className={cn(
              "absolute block rounded-full transition-colors duration-(--dur-move) ease-in-out",
              checked ? "bg-on-accent" : "bg-chalk",
              "group-disabled:bg-subtle",
            )}
            style={{ x, scaleX, width: d.knob, height: d.knob, left: d.pad - 1, top: (d.h - 2 - d.knob) / 2 }}
          />
        </span>
      </button>
    </div>
  );
}
