"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion, useVariants, V } from "@/lib/motion";

/* ═══════════════════════════════════════════════════
   REVEAL ON SCROLL (CONTRACT 2.4)
   V.fadeUp once, as soon as any part enters the viewport (no shrunk
   bottom edge, so content near the bottom of a short page still reveals).
   `delay` is in seconds. Reduced motion: a 120 ms opacity fade, no delay.
   No JS: SSR emits opacity 0, so Providers renders a <noscript> style that
   forces every [data-reveal] visible (REVEAL_NOSCRIPT_CSS below).
   ═══════════════════════════════════════════════════ */
/** Rendered once inside <noscript> by components/Providers.tsx. */
export const REVEAL_NOSCRIPT_CSS = "[data-reveal]{opacity:1!important;transform:none!important}";

export default function RevealOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const base = useVariants("fadeUp");
  const reduced = usePrefersReducedMotion();
  // The delay has to live inside the variant: a variant's own transition beats the transition prop.
  const variants = useMemo<Variants>(() => {
    if (reduced || !delay) return base;
    return { ...base, visible: { ...V.fadeUp.visible, transition: { ...V.fadeUp.visible.transition, delay } } };
  }, [base, delay, reduced]);
  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
    >
      {children}
    </motion.div>
  );
}
