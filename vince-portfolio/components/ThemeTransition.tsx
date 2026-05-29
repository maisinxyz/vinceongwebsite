"use client";

import { useState, useCallback } from "react";

export function useThemeTransition() {
  const [isLight, setIsLight] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties | null>(null);

  const toggleTheme = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const targetIsLight = !isLight;

    // Set the overlay with the target theme's background color
    setOverlayStyle({
      position: "fixed",
      inset: 0,
      zIndex: 99997,
      backgroundColor: targetIsLight ? "#FAFAFA" : "#0D0D0D",
      pointerEvents: "none" as const,
      ["--cx" as string]: `${cx}px`,
      ["--cy" as string]: `${cy}px`,
    });

    // After animation completes, apply the actual theme and remove overlay
    setTimeout(() => {
      if (targetIsLight) {
        document.documentElement.classList.add("theme-light");
      } else {
        document.documentElement.classList.remove("theme-light");
      }
      setIsLight(targetIsLight);
      setOverlayStyle(null);
    }, 800);
  }, [isLight]);

  return { isLight, toggleTheme, overlayStyle };
}

export function ThemeTransitionOverlay({ style }: { style: React.CSSProperties | null }) {
  if (!style) return null;
  return (
    <div
      className="theme-transition-overlay"
      style={style}
    />
  );
}
