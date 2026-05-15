"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Decorative spacer component that goes between sections.
 * Adds visual interest in whitespace with subtle geometric elements.
 */

interface SpacerProps {
  variant?: "dots" | "line" | "diamond" | "cross" | "placeholder";
  className?: string;
  /** If placeholder, show a label for what will go here */
  placeholderLabel?: string;
  /** Height in pixels. Defaults to 120 */
  height?: number;
}

export default function Spacer({
  variant = "dots",
  className = "",
  placeholderLabel,
  height = 120,
}: SpacerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  if (variant === "placeholder") {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
          className="border border-dashed border-steel/15 rounded-2xl px-12 py-8 text-center max-w-md"
        >
          <div className="w-10 h-10 mx-auto mb-3 border border-steel/15 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border border-steel/20 rounded-sm" />
          </div>
          <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
            {placeholderLabel || "MEDIA / GRAPHIC PLACEHOLDER"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center ${className}`}
      style={{ height }}
    >
      {variant === "dots" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0, 0, 1] }}
          className="flex items-center gap-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: i * 0.12, duration: 0.4, ease: [0.25, 0, 0, 1] }}
              className="w-1 h-1 rounded-full bg-silver/15"
            />
          ))}
        </motion.div>
      )}

      {variant === "line" && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, ease: [0.25, 0, 0, 1] }}
          className="w-16 h-px bg-silver/10 origin-center"
        />
      )}

      {variant === "diamond" && (
        <motion.div
          initial={{ opacity: 0, rotate: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, rotate: 45, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
          className="w-3 h-3 border border-silver/12"
        />
      )}

      {variant === "cross" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative w-5 h-5"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
            className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-silver/12 origin-center"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0, 0, 1] }}
            className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-silver/12 origin-center"
          />
        </motion.div>
      )}
    </div>
  );
}
