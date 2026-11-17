"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   ICON SWAP (CONTRACT 2.4, SPEC B "crossfade icons with blur")
   Old and new icons overlap in one grid cell: opacity + blur(4px→0) +
   scale(0.8→1), 180 ms in / 144 ms out. Decorative: the parent names it.
   ═══════════════════════════════════════════════════ */
export function IconSwap(p: { swapped: boolean; a: React.ReactNode; b: React.ReactNode; className?: string }): React.JSX.Element {
  const variants = useVariants("iconSwap");
  return (
    <span aria-hidden="true" className={cn("inline-grid place-items-center", p.className)}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          key={p.swapped ? "b" : "a"}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="inline-flex items-center justify-center"
          style={{ gridArea: "1 / 1" }}
        >
          {p.swapped ? p.b : p.a}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
