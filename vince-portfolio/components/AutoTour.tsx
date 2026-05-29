"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL HELPER
   ═══════════════════════════════════════════════════ */
function smoothScrollTo(target: number, duration: number, abortRef: React.RefObject<boolean>): Promise<void> {
  return new Promise((resolve) => {
    const start = window.scrollY;
    const distance = target - start;
    const startTime = performance.now();

    function step(currentTime: number) {
      if (abortRef.current) { resolve(); return; }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
   CLICK A CARD BY INDEX
   ═══════════════════════════════════════════════════ */
function clickCard(index: number, cursorEl: HTMLDivElement, curX: number, curY: number, abortRef: React.RefObject<boolean>): Promise<{ x: number; y: number }> {
  return new Promise(async (resolve) => {
    const wrapper = document.querySelector(`[data-card-index='${index}']`);
    if (!wrapper) { resolve({ x: curX, y: curY }); return; }

    // Find the actual clickable card element inside
    const cardEl = wrapper.querySelector(".cursor-pointer") as HTMLElement | null;
    if (!cardEl) { resolve({ x: curX, y: curY }); return; }

    const rect = cardEl.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Move cursor to card
    await smoothCursorMove(cursorEl, curX, curY, targetX, targetY, 500, abortRef);
    if (abortRef.current) { resolve({ x: targetX, y: targetY }); return; }

    // Pulse cursor on click
    cursorEl.style.transform = "translate(-50%, -50%) scale(1.8)";
    await wait(120, abortRef);
    cursorEl.style.transform = "translate(-50%, -50%) scale(1)";

    // Actually click the card
    cardEl.click();

    resolve({ x: targetX, y: targetY });
  });
}

/* ═══════════════════════════════════════════════════
   MAIN HOOK
   ═══════════════════════════════════════════════════ */
export function useAutoTour() {
  const [isTouring, setIsTouring] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef(false);
  const isTouringRef = useRef(false);
  const tourStartTimeRef = useRef(0);

  // Stop tour on any real user mouse movement (after a 1.5s grace period)
  useEffect(() => {
    function handleUserMouse(e: MouseEvent) {
      // Only abort if the event is a real user event (not dispatched programmatically)
      // and the tour has been running for at least 1.5 seconds
      if (
        isTouringRef.current &&
        e.isTrusted &&
        Date.now() - tourStartTimeRef.current > 1500
      ) {
        abortRef.current = true;
      }
    }
    window.addEventListener("mousemove", handleUserMouse, { capture: true });
    return () => window.removeEventListener("mousemove", handleUserMouse, { capture: true });
  }, []);

  const cleanup = useCallback(() => {
    isTouringRef.current = false;
    setIsTouring(false);
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.style.opacity = "0";
      setTimeout(() => { if (cursor) cursor.style.display = "none"; }, 300);
    }
    // Re-enable navbar pointer events
    document.documentElement.classList.remove("tour-active");
  }, []);

  const startTour = useCallback(async () => {
    if (isTouringRef.current) return;
    isTouringRef.current = true;
    tourStartTimeRef.current = Date.now();
    setIsTouring(true);
    abortRef.current = false;

    const cursor = cursorRef.current;
    if (!cursor) { cleanup(); return; }

    // Disable navbar interference during tour
    document.documentElement.classList.add("tour-active");

    // Show virtual cursor
    cursor.style.display = "block";
    cursor.style.opacity = "1";

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    let curX = vw / 2;
    let curY = vh / 2;
    cursor.style.left = `${curX}px`;
    cursor.style.top = `${curY}px`;

    const check = () => abortRef.current;

    // ═══ PHASE 1: Wave cursor around hero ═══
    const waveResult = await waveCursor(cursor, vw * 0.5, vh * 0.45, 3000, abortRef);
    curX = waveResult.x; curY = waveResult.y;
    if (check()) { cleanup(); return; }

    // ═══ PHASE 2: Gradually scroll through the entire page ═══
    // Scroll slowly to "Meet Vince" section
    await smoothScrollTo(vh * 0.9, 3000, abortRef);
    if (check()) { cleanup(); return; }

    await wait(1200, abortRef);
    if (check()) { cleanup(); return; }

    // Slow scroll through intro text
    await smoothScrollTo(vh * 1.4, 3500, abortRef);
    if (check()) { cleanup(); return; }

    await wait(1500, abortRef); // Pause at "Meet Vince" text
    if (check()) { cleanup(); return; }

    // Scroll through logos slider
    await smoothScrollTo(vh * 1.8, 2500, abortRef);
    if (check()) { cleanup(); return; }

    await wait(800, abortRef);
    if (check()) { cleanup(); return; }

    // Slow scroll through Work Experience
    await smoothScrollTo(vh * 2.3, 3500, abortRef);
    if (check()) { cleanup(); return; }

    await wait(2000, abortRef); // Pause at work experience
    if (check()) { cleanup(); return; }

    // Scroll through more work experience
    await smoothScrollTo(vh * 2.8, 3000, abortRef);
    if (check()) { cleanup(); return; }

    await wait(1000, abortRef);
    if (check()) { cleanup(); return; }

    // Slow scroll through Projects
    await smoothScrollTo(vh * 3.3, 3500, abortRef);
    if (check()) { cleanup(); return; }

    await wait(2000, abortRef); // Pause at projects
    if (check()) { cleanup(); return; }

    // Scroll through more projects
    await smoothScrollTo(vh * 3.8, 3000, abortRef);
    if (check()) { cleanup(); return; }

    await wait(1000, abortRef);
    if (check()) { cleanup(); return; }

    // Scroll through Education
    await smoothScrollTo(vh * 4.2, 2500, abortRef);
    if (check()) { cleanup(); return; }

    await wait(1500, abortRef); // Pause at education
    if (check()) { cleanup(); return; }

    // ═══ PHASE 3: Scroll to cards section ═══
    const maxScroll = document.body.scrollHeight - vh;
    const cardsTarget = Math.min(maxScroll, vh * 4.8);
    await smoothScrollTo(cardsTarget, 3000, abortRef);
    if (check()) { cleanup(); return; }

    await wait(800, abortRef);
    if (check()) { cleanup(); return; }

    // ═══ PHASE 4: Click each card to flip them ═══
    for (let i = 0; i < 4; i++) {
      if (check()) { cleanup(); return; }
      const result = await clickCard(i, cursor, curX, curY, abortRef);
      curX = result.x; curY = result.y;
      await wait(600, abortRef);
      if (check()) { cleanup(); return; }
    }

    await wait(1500, abortRef); // Pause to admire flipped cards
    if (check()) { cleanup(); return; }

    // ═══ PHASE 5: Click logo to go back to top ═══
    const logoEl = document.querySelector("[data-logo-link]") as HTMLElement | null;
    if (logoEl) {
      const logoRect = logoEl.getBoundingClientRect();
      const logoX = logoRect.left + logoRect.width / 2;
      const logoY = logoRect.top + logoRect.height / 2;

      await smoothCursorMove(cursor, curX, curY, logoX, logoY, 800, abortRef);
      if (check()) { cleanup(); return; }

      // Pulse cursor
      cursor.style.transform = "translate(-50%, -50%) scale(1.8)";
      await wait(120, abortRef);
      cursor.style.transform = "translate(-50%, -50%) scale(1)";

      // Click logo
      logoEl.click();
    }

    await wait(500, abortRef);
    if (check()) { cleanup(); return; }

    // ═══ PHASE 6: Reset cards while scrolling up ═══
    // Dispatch a custom event to reset all cards
    window.dispatchEvent(new CustomEvent("tour-reset-cards"));

    // Wait for smooth scroll back to top to finish
    await wait(2000, abortRef);

    // Done!
    cleanup();
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
export function VirtualCursor({ cursorRef }: { cursorRef: React.RefObject<HTMLDivElement | null> }) {
  return (
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
  );
}
