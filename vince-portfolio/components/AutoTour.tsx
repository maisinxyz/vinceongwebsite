"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */
const NAVBAR_HEIGHT = 90; // px — clearance so the navbar doesn't cover content

/* ═══════════════════════════════════════════════════
   DISABLE / RESTORE CSS scroll-behavior
   The stylesheet sets `html { scroll-behavior: smooth }`
   which fights our JS-based scrolling. We need to
   forcefully override it during the tour.
   ═══════════════════════════════════════════════════ */
let injectedStyleEl: HTMLStyleElement | null = null;

function disableCssScrollBehavior() {
  if (injectedStyleEl) return;
  injectedStyleEl = document.createElement("style");
  injectedStyleEl.textContent = "html { scroll-behavior: auto !important; }";
  document.head.appendChild(injectedStyleEl);
}

function restoreCssScrollBehavior() {
  if (injectedStyleEl) {
    injectedStyleEl.remove();
    injectedStyleEl = null;
  }
}

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL HELPER — cubic ease-in-out
   Used for scroll-to-section with a fixed duration.
   ═══════════════════════════════════════════════════ */
function smoothScrollTo(target: number, duration: number, abortRef: React.RefObject<boolean>): Promise<void> {
  return new Promise((resolve) => {
    const start = window.scrollY;
    const distance = target - start;
    if (Math.abs(distance) < 2) { resolve(); return; }
    const startTime = performance.now();

    function step(currentTime: number) {
      if (abortRef.current) { resolve(); return; }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-in-out
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

/* ═══════════════════════════════════════════════════
   STEADY SCROLL — mostly linear with gentle
   ease-in/out at edges. Creates the "slow continuous"
   scroll feel between sections.
   ═══════════════════════════════════════════════════ */
function steadyScrollTo(target: number, pxPerSec: number, abortRef: React.RefObject<boolean>): Promise<void> {
  return new Promise((resolve) => {
    const start = window.scrollY;
    const distance = target - start;
    if (Math.abs(distance) < 2) { resolve(); return; }
    // Calculate duration from distance and speed
    const duration = (Math.abs(distance) / pxPerSec) * 1000;
    const startTime = performance.now();

    function step(currentTime: number) {
      if (abortRef.current) { resolve(); return; }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth-step: 3p² - 2p³ (continuous ease-in/out, mostly linear in middle)
      const ease = progress * progress * (3 - 2 * progress);

      window.scrollTo(0, start + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, target);
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

/* ═══════════════════════════════════════════════════
   SMOOTH CURSOR MOVE HELPER
   ═══════════════════════════════════════════════════ */
function smoothCursorMove(
  cursorEl: HTMLDivElement,
  fromX: number, fromY: number,
  toX: number, toY: number,
  duration: number,
  abortRef: React.RefObject<boolean>,
  dispatchMouse = true
): Promise<{ x: number; y: number }> {
  return new Promise((resolve) => {
    const startTime = performance.now();

    function step(currentTime: number) {
      if (abortRef.current) { resolve({ x: toX, y: toY }); return; }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const x = fromX + (toX - fromX) * ease;
      const y = fromY + (toY - fromY) * ease;

      cursorEl.style.left = `${x}px`;
      cursorEl.style.top = `${y}px`;

      if (dispatchMouse) {
        const target = document.elementFromPoint(x, y);
        if (target) {
          target.dispatchEvent(new MouseEvent("mousemove", {
            clientX: x, clientY: y, bubbles: true,
          }));
        }
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve({ x: toX, y: toY });
      }
    }
    requestAnimationFrame(step);
  });
}

/* ═══════════════════════════════════════════════════
   WAVE CURSOR PATTERN — moves in a smooth figure-8
   ═══════════════════════════════════════════════════ */
function waveCursor(
  cursorEl: HTMLDivElement,
  centerX: number, centerY: number,
  duration: number,
  abortRef: React.RefObject<boolean>
): Promise<{ x: number; y: number }> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const radiusX = window.innerWidth * 0.2;
    const radiusY = window.innerHeight * 0.15;

    function step(currentTime: number) {
      if (abortRef.current) { resolve({ x: centerX, y: centerY }); return; }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const t = progress * Math.PI * 2;

      const x = centerX + Math.sin(t) * radiusX;
      const y = centerY + Math.sin(t * 2) * radiusY * 0.5;

      cursorEl.style.left = `${x}px`;
      cursorEl.style.top = `${y}px`;

      const target = document.elementFromPoint(x, y);
      if (target) {
        target.dispatchEvent(new MouseEvent("mousemove", {
          clientX: x, clientY: y, bubbles: true,
        }));
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve({ x: centerX, y: centerY });
      }
    }
    requestAnimationFrame(step);
  });
}

/* ═══════════════════════════════════════════════════
   WAIT HELPER
   ═══════════════════════════════════════════════════ */
function wait(ms: number, abortRef: React.RefObject<boolean>): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    function check() {
      if (abortRef.current || Date.now() - start >= ms) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    }
    requestAnimationFrame(check);
  });
}

/* ═══════════════════════════════════════════════════
   GET SECTION SCROLL TARGET
   Finds a data-tour-section element and returns its
   absolute Y position minus navbar clearance.
   ═══════════════════════════════════════════════════ */
function getSectionScrollTarget(sectionName: string, offset = 0): number {
  const el = document.querySelector(`[data-tour-section="${sectionName}"]`);
  if (!el) {
    console.warn(`[AutoTour] Section "${sectionName}" not found`);
    return window.scrollY; // stay where we are
  }
  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  return Math.max(0, absoluteTop - NAVBAR_HEIGHT - offset);
}

/* ═══════════════════════════════════════════════════
   CLICK A CARD BY INDEX
   ═══════════════════════════════════════════════════ */
async function clickCard(
  index: number,
  cursorEl: HTMLDivElement,
  curX: number,
  curY: number,
  abortRef: React.RefObject<boolean>
): Promise<{ x: number; y: number }> {
  const wrapper = document.querySelector(`[data-card-index='${index}']`);
  if (!wrapper) return { x: curX, y: curY };

  const cardEl = wrapper.querySelector(".cursor-pointer") as HTMLElement | null;
  if (!cardEl) return { x: curX, y: curY };

  const rect = cardEl.getBoundingClientRect();
  const targetX = rect.left + rect.width / 2;
  const targetY = rect.top + rect.height / 2;

  // Move cursor to card
  await smoothCursorMove(cursorEl, curX, curY, targetX, targetY, 600, abortRef);
  if (abortRef.current) return { x: targetX, y: targetY };

  // Small hover pause
  await wait(200, abortRef);
  if (abortRef.current) return { x: targetX, y: targetY };

  // Pulse cursor on click
  cursorEl.style.transform = "translate(-50%, -50%) scale(1.8)";
  await wait(150, abortRef);
  cursorEl.style.transform = "translate(-50%, -50%) scale(1)";

  // Actually click the card
  cardEl.click();

  // Wait for flip animation
  await wait(700, abortRef);

  return { x: targetX, y: targetY };
}

/* ═══════════════════════════════════════════════════
   SCROLL TO SECTION HELPER — combines target lookup
   with smooth scrolling and a pause at the section.
   ═══════════════════════════════════════════════════ */
async function scrollToSection(
  sectionName: string,
  speed: number,
  pauseMs: number,
  abortRef: React.RefObject<boolean>,
  offset = 10
): Promise<boolean> {
  const target = getSectionScrollTarget(sectionName, offset);
  await steadyScrollTo(target, speed, abortRef);
  if (abortRef.current) return false;

  await wait(pauseMs, abortRef);
  return !abortRef.current;
}

/* ═══════════════════════════════════════════════════
   MAIN HOOK
   ═══════════════════════════════════════════════════ */
const MOUSE_CANCEL_THRESHOLD = 80; // px — user must move mouse this far to cancel tour

export function useAutoTour() {
  const [isTouring, setIsTouring] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef(false);
  const isTouringRef = useRef(false);
  const tourStartTimeRef = useRef(0);
  const mouseAnchorRef = useRef<{ x: number; y: number } | null>(null);

  // Stop tour only when user deliberately moves mouse a significant distance
  useEffect(() => {
    function handleUserMouse(e: MouseEvent) {
      if (!isTouringRef.current || !e.isTrusted) return;

      // During grace period, ignore all movement
      if (Date.now() - tourStartTimeRef.current <= 2000) return;

      // Set anchor to the first mouse position we see after grace period
      if (!mouseAnchorRef.current) {
        mouseAnchorRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      // Only abort if the user has moved significantly from the anchor
      const dx = e.clientX - mouseAnchorRef.current.x;
      const dy = e.clientY - mouseAnchorRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > MOUSE_CANCEL_THRESHOLD) {
        abortRef.current = true;
      }
    }
    window.addEventListener("mousemove", handleUserMouse, { capture: true });
    return () => window.removeEventListener("mousemove", handleUserMouse, { capture: true });
  }, []);

  const cleanup = useCallback(() => {
    isTouringRef.current = false;
    setIsTouring(false);
    restoreCssScrollBehavior();
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.style.opacity = "0";
      setTimeout(() => { if (cursor) cursor.style.display = "none"; }, 300);
    }
    document.documentElement.classList.remove("tour-active");
  }, []);

  const startTour = useCallback(async () => {
    if (isTouringRef.current) return;
    isTouringRef.current = true;
    tourStartTimeRef.current = Date.now();
    setIsTouring(true);
    abortRef.current = false;
    mouseAnchorRef.current = null;

    const cursor = cursorRef.current;
    if (!cursor) { cleanup(); return; }

    // Disable navbar interference during tour
    document.documentElement.classList.add("tour-active");

    // Override CSS scroll-behavior: smooth with !important
    disableCssScrollBehavior();

    // Show virtual cursor
    cursor.style.display = "block";
    cursor.style.opacity = "1";

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let curX = vw / 2;
    let curY = vh / 2;
    cursor.style.left = `${curX}px`;
    cursor.style.top = `${curY}px`;

    const check = () => abortRef.current;

    // Scrolling speeds (px per second)
    const CRUISE = 400;  // normal between-section speed
    const SLOW = 250;    // cinematic approach to explore section

    try {
      // ═══ PHASE 1: Wave cursor around hero ═══
      const waveResult = await waveCursor(cursor, vw * 0.5, vh * 0.45, 3000, abortRef);
      curX = waveResult.x; curY = waveResult.y;
      if (check()) return;

      // ═══ PHASE 2: Scroll to "Meet Vince" ═══
      if (!(await scrollToSection("meet-vince", CRUISE, 2500, abortRef, 20))) return;

      // ═══ PHASE 3: Scroll to Work Experience ═══
      if (!(await scrollToSection("experience", CRUISE, 2500, abortRef))) return;

      // ═══ PHASE 4: Scroll to Projects ═══
      if (!(await scrollToSection("projects", CRUISE, 2500, abortRef))) return;

      // ═══ PHASE 5: Scroll to Education ═══
      if (!(await scrollToSection("education", CRUISE, 2000, abortRef))) return;

      // ═══ PHASE 6: Scroll to Explore cards ═══
      if (!(await scrollToSection("explore", SLOW, 1500, abortRef))) return;

      // ═══ PHASE 7: Click each card to flip them ═══
      for (let i = 0; i < 4; i++) {
        if (check()) return;
        const result = await clickCard(i, cursor, curX, curY, abortRef);
        curX = result.x; curY = result.y;
        if (check()) return;
      }

      // Pause to admire flipped cards
      await wait(2000, abortRef);
      if (check()) return;

      // ═══ PHASE 8: Move cursor to logo ═══
      const logoEl = document.querySelector("[data-logo-link]") as HTMLElement | null;
      if (logoEl) {
        const logoRect = logoEl.getBoundingClientRect();
        const logoX = logoRect.left + logoRect.width / 2;
        const logoY = logoRect.top + logoRect.height / 2;

        await smoothCursorMove(cursor, curX, curY, logoX, logoY, 800, abortRef);
        if (check()) return;

        // Pulse cursor
        cursor.style.transform = "translate(-50%, -50%) scale(1.8)";
        await wait(150, abortRef);
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
      }

      // ═══ PHASE 9: Slow scroll back to top ═══
      window.dispatchEvent(new CustomEvent("tour-reset-cards"));
      await smoothScrollTo(0, 4000, abortRef);
      if (check()) return;

      await wait(500, abortRef);

    } catch (err) {
      console.error("[AutoTour] Error during tour:", err);
    } finally {
      cleanup();
    }
  }, [cleanup]);

  const stopTour = useCallback(() => {
    abortRef.current = true;
    cleanup();
  }, [cleanup]);

  return { isTouring, startTour, stopTour, cursorRef };
}

/* ═══════════════════════════════════════════════════
   VIRTUAL CURSOR COMPONENT
   ═══════════════════════════════════════════════════ */
export function VirtualCursor({ cursorRef, isTouring }: { cursorRef: React.RefObject<HTMLDivElement | null>, isTouring: boolean }) {
  return (
    <>
      <div
        ref={cursorRef}
        style={{
          display: "none",
          position: "fixed",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)",
          boxShadow: "0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2)",
          pointerEvents: "none",
          zIndex: 99996,
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.4s ease, transform 0.1s ease",
        }}
      />
      {/* Tour Cancel Hint */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 99995,
          opacity: isTouring ? 0.6 : 0,
          transition: "opacity 0.6s ease",
          mixBlendMode: "difference",
          color: "#fff",
          fontFamily: "var(--font-space-mono-family)",
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textAlign: "center"
        }}
      >
        Move cursor to exit tour
      </div>
    </>
  );
}
