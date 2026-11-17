"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Info, X } from "lucide-react";
import { IconButton } from "./IconButton";
import { T, useVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   TOAST (CONTRACT 2.4)
   <ToastProvider> is mounted once in components/Providers.tsx.
   const { show, dismiss } = useToast(); show({ title, tone: "success" }).
   The region is always in the DOM (aria-live="polite"), so additions are
   announced; error toasts are role="alert". Bottom-right, above the
   section bar. Timers pause while hovered or focused.
   ═══════════════════════════════════════════════════ */
export type ToastTone = "neutral" | "success" | "error";
export type ToastOptions = { title: string; description?: string; tone?: ToastTone; durationMs?: number };
type ToastApi = { show(t: ToastOptions): string; dismiss(id: string): void };
type ToastItem = Required<Omit<ToastOptions, "description">> & { id: string; description?: string };

const DEFAULT_MS = 4000;
const MAX_VISIBLE = 3;
const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast() needs <ToastProvider> (components/Providers.tsx)");
  return api;
}

export function ToastProvider(p: { children: React.ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: string) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);
  const show = useCallback((t: ToastOptions) => {
    const id = `toast-${++seq.current}`;
    const item: ToastItem = { id, title: t.title, description: t.description, tone: t.tone ?? "neutral", durationMs: t.durationMs ?? DEFAULT_MS };
    setToasts((ts) => [...ts, item].slice(-MAX_VISIBLE));
    return id;
  }, []);
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {p.children}
      <section
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-[calc(var(--nav-bar-bottom)+1rem)] z-[65] flex w-[min(22rem,calc(100vw-2rem))] flex-col items-stretch gap-2"
      >
        <ol aria-live="polite" aria-relevant="additions text" className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

const TONE = {
  neutral: { Icon: Info, cls: "text-silver" },
  success: { Icon: Check, cls: "text-success" },
  error: { Icon: AlertCircle, cls: "text-danger" },
} as const;

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const variants = useVariants("fadeUp");
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.durationMs);

  useEffect(() => {
    if (paused || toast.durationMs <= 0 || !Number.isFinite(toast.durationMs)) return;
    const started = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [paused, toast.id, toast.durationMs, onDismiss]);

  const { Icon, cls } = TONE[toast.tone];
  return (
    <motion.li
      layout="position"
      transition={{ layout: T.move }}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-toast={toast.tone}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex items-start gap-3 rounded-xl border border-steel bg-iron py-3 pr-2 pl-4 text-chalk shadow-elev-3"
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", cls)} />
      <div role={toast.tone === "error" ? "alert" : undefined} className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-sm text-chalk">{toast.title}</p>
        {toast.description && <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-silver">{toast.description}</p>}
      </div>
      <IconButton size="sm" label="Dismiss notification" icon={<X />} onClick={() => onDismiss(toast.id)} className="-my-1" />
    </motion.li>
  );
}
