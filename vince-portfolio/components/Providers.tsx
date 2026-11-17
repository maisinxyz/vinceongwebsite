"use client";

import { MotionConfig } from "framer-motion";
import { ToastProvider } from "@/components/primitives/Toast";

/* ═══════════════════════════════════════════════════
   PROVIDERS (CONTRACT 2.2, 2.4)
   reducedMotion="user": under prefers-reduced-motion framer skips transform
   and layout animations (values jump to their target); opacity still fades.
   Keep the default export; app/layout.tsx imports it.
   ═══════════════════════════════════════════════════ */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
