"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DUR, EASE, PULSE, sec, T, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   SUCCESS MARK (CONTRACT 2.4, SPEC B "pulse to confirm success")
   One ring pulse (scale 1 → 1.15 → 1, opacity 0.5 → 0, 450 ms) and a check
   drawn by a clip-path mask over 300 ms after 100 ms. Reduced motion: a
   120 ms fade. Decorative; announce success through text or a Toast.
   ═══════════════════════════════════════════════════ */
export function SuccessMark(p: { active: boolean; size?: number; onDone?: () => void; className?: string }): React.JSX.Element {
  const { active, size = 20, onDone, className } = p;
  const reduced = usePrefersReducedMotion();
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!active) return;
    const total = reduced ? DUR.reduced : Math.max(DUR.pulse, DUR.checkDelay + DUR.check);
    const t = setTimeout(() => onDoneRef.current?.(), total);
    return () => clearTimeout(t);
  }, [active, reduced]);

  return (
    <span
      aria-hidden="true"
      data-success-mark={active ? "active" : "idle"}
      className={cn("relative inline-grid place-items-center text-success", className)}
      style={{ width: size, height: size }}
    >
      {active && (
        <>
          {!reduced && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-current"
              initial={{ scale: PULSE.scale[0], opacity: PULSE.opacity[0] }}
              animate={{ scale: [...PULSE.scale], opacity: [...PULSE.opacity] }}
              transition={{ duration: sec(PULSE.ms), ease: EASE.out }}
            />
          )}
          <motion.svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
            transition={reduced ? T.reduced : { duration: sec(DUR.check), delay: sec(DUR.checkDelay), ease: EASE.out }}
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </motion.svg>
        </>
      )}
    </span>
  );
}
