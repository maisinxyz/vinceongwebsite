"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/primitives/IconButton";
import { useTheme } from "@/hooks/useTheme";

/* ═══════════════════════════════════════════════════
   THEME TOGGLE (CONTRACT 1.7)
   IconButton + IconSwap (Sun ↔ Moon). The circular reveal starts at the
   button's centre (setTheme → View Transition; instant without the API).
   Shows the icon of the theme it switches TO.
   ═══════════════════════════════════════════════════ */
export default function ThemeToggle({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <IconButton
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      icon={<Sun strokeWidth={1.5} />}
      swapIcon={<Moon strokeWidth={1.5} />}
      swapped={!isDark}
      size={size}
      data-theme-toggle=""
      className={className}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(isDark ? "light" : "dark", { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
      }}
    />
  );
}
