"use client";

import { useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";

/* ═══════════════════════════════════════════════════
   COMPAT SHIM (CONTRACT 1.5)
   Keeps app/page.tsx compiling on top of lib/theme. The View Transitions
   reveal in lib/theme replaces the old overlay. `landing` removes the
   usages; `qa` deletes this file in wave 3.
   ═══════════════════════════════════════════════════ */
export function useThemeTransition() {
  const { theme, toggleTheme } = useTheme();

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      toggleTheme({ origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
    },
    [toggleTheme],
  );

  return { isLight: theme === "light", toggleTheme: toggle, overlayStyle: null as React.CSSProperties | null };
}

export function ThemeTransitionOverlay(props: { style: React.CSSProperties | null }) {
  void props;
  return null;
}
