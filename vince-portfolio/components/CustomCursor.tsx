"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Use refs for tracking to avoid React re-renders at 60fps
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  
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
    mousePos.current = { x: e.clientX, y: e.clientY };
    if (!isVisible) setIsVisible(true);
    
    // Update dot immediately
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    }
  }, [isVisible]);

  // Lerp ring follow
  useEffect(() => {
    if (isTouchDevice) return;

    let animationId: number;
    const lerp = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      
      if (ringRef.current) {
        // The offset depends on hovering state, but we apply a generic offset here
        // and handle size changes via CSS classes
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      animationId = requestAnimationFrame(lerp);
    };
    animationId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationId);
  }, [isTouchDevice]);

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
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference"
        style={{
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
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9996] mix-blend-difference -ml-4 -mt-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isViewer
              ? "w-10 h-10 border-chalk/40 -ml-1 -mt-1"
              : isHovering
              ? "w-12 h-12 border-chalk/60 bg-silver/15 -ml-2 -mt-2"
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
