"use client";

/* ═══════════════════════════════════════════════════
   PROVIDERS (CONTRACT 2.4)
   Pass-through stub from foundation-core so app/layout.tsx is final in wave 0.
   Owned by `primitives` from wave 0b: MotionConfig + ToastProvider go here.
   Keep the default export; layout.tsx imports it.
   ═══════════════════════════════════════════════════ */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
