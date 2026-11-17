"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { originFromTrigger, useVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   POPOVER (CONTRACT 2.4)
   Portalled to <body>, position: fixed next to `anchorRef`. Flips to the
   other side when it does not fit, then clamps to the viewport minus the
   nav gutter, the Navbar and the section bar (+8 px). Scales from 0.95 with
   transform-origin aimed at the trigger, computed on open AND on close.
   Esc and outside click close it; focus goes back to the anchor.
   The consumer owns aria-expanded / aria-controls on its anchor.
   ═══════════════════════════════════════════════════ */
export type PopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  offset?: number;
  role?: "dialog" | "listbox" | "menu";
  ariaLabel?: string;
  ariaLabelledBy?: string;
  closeOnOutside?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  /** Departure (BOARD CONCERN 18:34): React 19 ref-as-prop, the content element. */
  ref?: React.Ref<HTMLDivElement>;
  /** Departure: extra attributes for the content element (id, aria-activedescendant, onKeyDown, tabIndex…), used by Select. */
  contentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "className" | "children" | "style">;
};

const EDGE = 8;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

type Box = { left: number; top: number; right: number; bottom: number };

/** Usable viewport: right of the nav gutter, below the Navbar, above the section bar. */
function safeBox(): Box {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;visibility:hidden;pointer-events:none;left:var(--nav-gutter,0px);top:var(--nav-top,0px);bottom:var(--nav-bar-bottom,0px);right:0;";
  document.body.appendChild(probe);
  const r = probe.getBoundingClientRect();
  probe.remove();
  return { left: r.left + EDGE, top: r.top + EDGE, right: window.innerWidth - EDGE, bottom: r.bottom - EDGE };
}

type Placement = { left: number; top: number; maxHeight?: number };

function place(a: DOMRect, w: number, h: number, side: NonNullable<PopoverProps["side"]>, align: NonNullable<PopoverProps["align"]>, offset: number): Placement {
  const box = safeBox();
  const alignX = align === "start" ? a.left : align === "end" ? a.right - w : a.left + a.width / 2 - w / 2;
  const alignY = align === "start" ? a.top : align === "end" ? a.bottom - h : a.top + a.height / 2 - h / 2;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, Math.max(lo, hi)));

  let left: number;
  let top: number;
  let maxHeight: number | undefined;

  if (side === "bottom" || side === "top") {
    const below = box.bottom - (a.bottom + offset);
    const above = a.top - offset - box.top;
    const wantBelow = side === "bottom";
    const useBelow = wantBelow ? below >= h || below >= above : !(above >= h || above >= below);
    const room = useBelow ? below : above;
    if (h > room) maxHeight = Math.max(room, 0);
    const hh = Math.min(h, room);
    top = useBelow ? a.bottom + offset : a.top - offset - hh;
    left = clamp(alignX, box.left, box.right - w);
    top = clamp(top, box.top, box.bottom - hh);
  } else {
    const rightRoom = box.right - (a.right + offset);
    const leftRoom = a.left - offset - box.left;
    const wantRight = side === "right";
    const useRight = wantRight ? rightRoom >= w || rightRoom >= leftRoom : !(leftRoom >= w || leftRoom >= rightRoom);
    left = useRight ? a.right + offset : a.left - offset - w;
    left = clamp(left, box.left, box.right - w);
    const room = box.bottom - box.top;
    if (h > room) maxHeight = room;
    top = clamp(alignY, box.top, box.bottom - Math.min(h, room));
  }
  return { left: Math.round(left), top: Math.round(top), maxHeight };
}

export function Popover({
  open,
  onOpenChange,
  anchorRef,
  children,
  side = "bottom",
  align = "start",
  offset = 8,
  role = "dialog",
  ariaLabel,
  ariaLabelledBy,
  closeOnOutside = true,
  initialFocusRef,
  className,
  ref,
  contentProps,
}: PopoverProps) {
  const variants = useVariants("popover");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      contentRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = el;
    },
    [ref],
  );

  /** Positions the content and aims its transform-origin at the anchor. Uses
      offsetWidth/Height so the in-flight scale does not distort the measurement. */
  const reposition = useCallback(() => {
    const el = contentRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor) return;
    el.style.maxHeight = "";
    const a = anchor.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const p = place(a, w, h, side, align, offset);
    el.style.left = `${p.left}px`;
    el.style.top = `${p.top}px`;
    if (p.maxHeight !== undefined) el.style.maxHeight = `${p.maxHeight}px`;
    el.style.transformOrigin = originFromTrigger(a, new DOMRect(p.left, p.top, w, Math.min(h, p.maxHeight ?? h)));
  }, [anchorRef, side, align, offset]);

  // Close: recompute the origin (the anchor may have scrolled) before the exit runs,
  // and hand focus back to the anchor if it was inside the popover.
  useLayoutEffect(() => {
    const el = contentRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor) return;
    if (open) {
      reposition(); // also covers re-opening while the exit is still running
      return;
    }
    const box = new DOMRect(parseFloat(el.style.left) || 0, parseFloat(el.style.top) || 0, el.offsetWidth, el.offsetHeight);
    el.style.transformOrigin = originFromTrigger(anchor.getBoundingClientRect(), box);
    if (el.contains(document.activeElement)) anchor.focus({ preventScroll: true });
  }, [open, anchorRef, reposition]);

  // While open: follow scroll and resize; Esc; outside pointer.
  useEffect(() => {
    if (!open) return;
    const onMove = () => reposition();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      onOpenChangeRef.current(false);
      anchorRef.current?.focus({ preventScroll: true });
    };
    const onPointer = (e: PointerEvent) => {
      if (!closeOnOutside) return;
      const t = e.target as Node;
      if (contentRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      // A <label for=anchor> click is forwarded to the anchor as a click, which toggles it itself;
      // closing here too would make that click reopen it.
      const anchorId = anchorRef.current?.id;
      if (anchorId && t instanceof Element && t.closest(`label[for="${CSS.escape(anchorId)}"]`)) return;
      onOpenChangeRef.current(false);
      // After the browser has moved focus for this click: if it fell to <body>, return it to the anchor.
      setTimeout(() => {
        if (document.activeElement === document.body || document.activeElement === null) anchorRef.current?.focus({ preventScroll: true });
      }, 0);
    };
    const ro = new ResizeObserver(onMove);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("scroll", onMove, { passive: true, capture: true });
    window.addEventListener("resize", onMove);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onMove, { capture: true });
      window.removeEventListener("resize", onMove);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [open, reposition, closeOnOutside, anchorRef]);

  // Tab past either end leaves the popover next to its anchor, not at the end of <body>.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    contentProps?.onKeyDown?.(e);
    if (e.defaultPrevented || e.key !== "Tab") return;
    const el = contentRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => !n.hasAttribute("hidden"));
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (items.length === 0 || active === first || active === el)) {
      e.preventDefault();
      onOpenChange(false);
      anchor.focus({ preventScroll: true });
    } else if (!e.shiftKey && (items.length === 0 || active === last)) {
      // Focus the anchor and let the browser's own Tab move on from there.
      anchor.focus({ preventScroll: true });
      onOpenChange(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <PopoverContent
          key="popover"
          setRefs={setRefs}
          contentRef={contentRef}
          reposition={reposition}
          initialFocusRef={initialFocusRef}
          variants={variants}
          role={role}
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          className={className}
          contentProps={contentProps}
          onKeyDown={onKeyDown}
        >
          {children}
        </PopoverContent>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function PopoverContent(p: {
  setRefs: (el: HTMLDivElement | null) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  reposition: () => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  variants: ReturnType<typeof useVariants>;
  role: NonNullable<PopoverProps["role"]>;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  contentProps?: PopoverProps["contentProps"];
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}) {
  const { reposition, initialFocusRef, contentRef } = p;
  // Before first paint: place it, aim the origin, then move focus in.
  useLayoutEffect(() => {
    reposition();
    const el = contentRef.current;
    if (!el) return;
    const target = initialFocusRef?.current ?? el.querySelector<HTMLElement>(FOCUSABLE) ?? el;
    target.focus({ preventScroll: true });
  }, [reposition, initialFocusRef, contentRef]);

  return (
    <motion.div
      tabIndex={-1}
      {...(p.contentProps as HTMLMotionProps<"div">)}
      ref={p.setRefs}
      role={p.role}
      aria-label={p.ariaLabel}
      aria-labelledby={p.ariaLabelledBy}
      onKeyDown={p.onKeyDown}
      variants={p.variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-popover
      className={cn(
        "fixed left-0 top-0 z-[90] overflow-auto overscroll-contain rounded-xl border border-steel bg-carbon p-1 text-chalk shadow-elev-2",
        "focus-visible:outline-offset-0",
        p.className,
      )}
    >
      {p.children}
    </motion.div>
  );
}
