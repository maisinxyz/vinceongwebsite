"use client";

import { useState, useEffect, useCallback } from "react";

export type DeviceType = "phone" | "tablet" | "desktop";

const BREAKPOINTS = {
  phone: 640,   // ≤ 640px
  tablet: 1024, // 641px–1024px
  // desktop: 1025px+
};

function getDeviceType(width: number): DeviceType {
  if (width <= BREAKPOINTS.phone) return "phone";
  if (width <= BREAKPOINTS.tablet) return "tablet";
  return "desktop";
}

export function useDeviceType() {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  const update = useCallback(() => {
    setDevice(getDeviceType(window.innerWidth));
  }, []);

  useEffect(() => {
    // Initial detection
    update();
    setIsTouchDevice(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    );

    // Listen to resize (handles orientation changes too)
    window.addEventListener("resize", update);

    // Also listen to matchMedia changes for touch detection
    const touchQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    const handleTouchChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };
    touchQuery.addEventListener("change", handleTouchChange);

    return () => {
      window.removeEventListener("resize", update);
      touchQuery.removeEventListener("change", handleTouchChange);
    };
  }, [update]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { device, isTouchDevice, mounted };
}
