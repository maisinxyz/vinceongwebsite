"use client";

import { MotionConfig } from "framer-motion";
import { ToastProvider } from "@/components/primitives/Toast";
import { REVEAL_NOSCRIPT_CSS } from "@/components/RevealOnScroll";

/* ═══════════════════════════════════════════════════
   PROVIDERS (CONTRACT 2.2, 2.4)
   reducedMotion="user": under prefers-reduced-motion framer skips transform
   and layout animations (values jump to their target); opacity still fades.
   Keep the default export; app/layout.tsx imports it.
   ═══════════════════════════════════════════════════ */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {/* Without JS nothing ever animates in: show every RevealOnScroll block (SSR emits opacity 0) */}
      <noscript>
        <style>{REVEAL_NOSCRIPT_CSS}</style>
      </noscript>
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
