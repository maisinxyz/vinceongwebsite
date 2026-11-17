"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion, useVariants, V } from "@/lib/motion";

/* ═══════════════════════════════════════════════════
   REVEAL ON SCROLL (CONTRACT 2.4)
   V.fadeUp once, when 10 % inside the viewport. `delay` is in seconds.
   Reduced motion: a 120 ms opacity fade with no delay.
   ═══════════════════════════════════════════════════ */
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
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
