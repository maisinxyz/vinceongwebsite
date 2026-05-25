"use client";

import { useEffect, useState, useCallback } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Detect touch device
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setTimeout(() => setIsTouchDevice(isTouch), 0);
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  // Lerp ring follow
  useEffect(() => {
    if (isTouchDevice) return;

    let animationId: number;
    const lerp = () => {
      setRingPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      animationId = requestAnimationFrame(lerp);
    };
    animationId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationId);
  }, [position, isTouchDevice]);

  // Event listeners
  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove);
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Hover detection
    const handleElementHover = () => {
      const updateHoverState = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive =
          target.closest("a, button, [role='button'], input, textarea, select, label") !== null;
        const is3DViewer = target.closest(".viewer-3d") !== null;
        
        setIsHovering(isInteractive);
        setIsViewer(is3DViewer);
      };
      document.addEventListener("mouseover", updateHoverState);
      return () => document.removeEventListener("mouseover", updateHoverState);
    };
    const cleanup = handleElementHover();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cleanup();
    };
  }, [handleMouseMove, isTouchDevice]);

  // Add cursor-hiding class to body
  useEffect(() => {
    if (!isTouchDevice) {
      document.body.classList.add("custom-cursor-active");
    }
    return () => {
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Small dot — follows exactly */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference"
        style={{
          transform: `translate(${position.x - 3}px, ${position.y - 3}px)`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        <div
          className={`rounded-full bg-chalk transition-all duration-150 ${
            isViewer ? "w-0 h-0" : "w-1.5 h-1.5"
          }`}
        />
      </div>

      {/* Larger ring — follows with lerp delay */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9996] mix-blend-difference"
        style={{
          transform: `translate(${ringPosition.x - (isHovering ? 24 : 16)}px, ${
            ringPosition.y - (isHovering ? 24 : 16)
          }px)`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isViewer
              ? "w-10 h-10 border-chalk/40"
              : isHovering
              ? "w-12 h-12 border-chalk/60 bg-silver/15"
              : "w-8 h-8 border-chalk/30"
          }`}
          style={{
            ...(isViewer && {
              borderRadius: 0,
              borderStyle: "dashed",
            }),
          }}
        />
      </div>
    </>
  );
}
