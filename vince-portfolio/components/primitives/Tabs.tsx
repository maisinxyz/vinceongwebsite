"use client";

import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, type Variants } from "framer-motion";
import { T, V, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   TABS (CONTRACT 2.4)
   Roving tabindex, ←/→/Home/End with automatic activation. Tab ids are
   `${idBase}-tab-${value}`, panel ids `${idBase}-panel-${value}`; render one
   <TabPanel> per item with the same idBase. The indicator slides with a
   framer layoutId (T.move). Panels crossfade: old and new overlap, the old
   one popped out of layout (AnimatePresence mode="popLayout", see BOARD
   CONCERN 18:34). Inactive panels stay in the DOM, `hidden`.
   ═══════════════════════════════════════════════════ */
export type TabItem<V extends string> = { value: V; label: string; icon?: React.ReactNode; disabled?: boolean };
export type TabsProps<V extends string> = {
  value: V;
  onValueChange: (v: V) => void;
  items: readonly TabItem<V>[];
  ariaLabel: string;
  idBase: string;
  className?: string;
  /** Departure (BOARD CONCERN 18:34): React 19 ref-as-prop, the tablist element. */
  ref?: React.Ref<HTMLDivElement>;
};

export const tabId = (idBase: string, value: string) => `${idBase}-tab-${value}`;
export const panelId = (idBase: string, value: string) => `${idBase}-panel-${value}`;

export function Tabs<V extends string>({ value, onValueChange, items, ariaLabel, idBase, className, ref }: TabsProps<V>) {
  const tabRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const enabled = items.filter((i) => !i.disabled);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = enabled.findIndex((i) => i.value === value);
    let next: TabItem<V> | undefined;
    if (e.key === "ArrowRight") next = enabled[(idx + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    tabRefs.current.get(next.value)?.focus();
    if (next.value !== value) onValueChange(next.value);
  };

  return (
    <LayoutGroup id={idBase}>
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className={cn("relative inline-flex items-center gap-1 rounded-full border border-steel p-1", className)}
      >
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current.set(item.value, el);
              }}
              type="button"
              role="tab"
              id={tabId(idBase, item.value)}
              aria-selected={selected}
              aria-controls={panelId(idBase, item.value)}
              aria-disabled={item.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => !item.disabled && !selected && onValueChange(item.value)}
              className={cn(
                "press-scale relative inline-flex h-11 items-center gap-2 rounded-full px-4",
                "font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.12em] uppercase",
                selected ? "text-chalk" : "text-silver hover:text-chalk",
                item.disabled && "cursor-not-allowed text-subtle hover:text-subtle",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="tab-indicator"
                  transition={T.move}
                  aria-hidden="true"
                  data-tab-indicator
                  className="absolute inset-0 rounded-full border border-line-strong bg-iron"
                />
              )}
              {item.icon && (
                <span aria-hidden="true" className="relative inline-flex [&_svg]:h-4 [&_svg]:w-4">
                  {item.icon}
                </span>
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

const PANEL: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: T.enter },
  exit: { opacity: 0, transition: T.exit },
};

export function TabPanel<V extends string>(p: { idBase: string; value: V; current: V; children: React.ReactNode }): React.JSX.Element {
  const active = p.value === p.current;
  const reduced = usePrefersReducedMotion();
  // `hidden` stub appears only once the exit has finished, so ids never duplicate.
  const [exitDone, setExitDone] = useState(true);
  const [prevActive, setPrevActive] = useState(active);
  if (prevActive !== active) {
    setPrevActive(active);
    if (!active) setExitDone(false);
  }
  const ids = { id: panelId(p.idBase, p.value), "aria-labelledby": tabId(p.idBase, p.value) };

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false} onExitComplete={() => setExitDone(true)}>
        {active && (
          <motion.div
            key="panel"
            role="tabpanel"
            tabIndex={0}
            {...ids}
            variants={reduced ? V.reducedFade : PANEL}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {p.children}
          </motion.div>
        )}
      </AnimatePresence>
      {!active && exitDone && <div role="tabpanel" hidden {...ids} />}
    </>
  );
}
