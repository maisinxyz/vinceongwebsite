"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface DividerProps {
  label?: string;
  className?: string;
  delay?: number;
}

export default function Divider({ label, className = "", delay = 0 }: DividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Label above the line */}
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: delay, duration: 0.4, ease: [0.25, 0, 0, 1] }}
          className="block font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/60 tracking-[0.25em] uppercase mb-3"
        >
          {label}
        </motion.span>
      )}

      {/* Animated horizontal rule */}
      <motion.div
        className="h-px bg-silver/40 w-full"
        style={{
          clipPath: isInView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: `clip-path 0.8s cubic-bezier(0.25, 0, 0, 1) ${delay}s`,
        }}
      />
    </div>
  );
}
