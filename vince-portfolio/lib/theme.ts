/* ═══════════════════════════════════════════════════
   THEME (CONTRACT 1.5, 1.7)
   data-theme lives only on <html>. The head script sets it before first
   paint; everything else reads and writes it through this module.
   ═══════════════════════════════════════════════════ */

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";
export const THEME_COLOR: Record<Theme, string> = { dark: "#0D0D0D", light: "#FAFAFA" };
export const THEME_INIT_SCRIPT =
  `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t="dark";` +
  `var d=document.documentElement;d.setAttribute("data-theme",t);` +
  `var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"#FAFAFA":"#0D0D0D")}catch(e){}})();`;

/** Every var name in CONTRACT 1.2 (styles/tokens.css), without the leading "--". */
export const TOKEN_NAMES = [
  "bg-deep", "bg", "surface", "line", "line-strong", "muted", "subtle", "text",
  "accent", "accent-fg", "on-accent", "focus", "danger", "success",
  "selection-bg", "selection-fg", "scrim", "nav-bg",
  "glass-bg", "glass-bg-hover", "glass-border", "glass-border-hover",
  "elev-1", "elev-2", "elev-3",
  "device-shell", "device-shell-hi", "device-shell-lo", "device-bezel", "device-screen",
  "device-screen-text", "device-screen-muted", "device-screen-accent",
  "scene-ground", "scene-ambient", "scene-key", "scene-outline", "scene-accent",
  "logo-metal",
] as const;
export type TokenName = (typeof TOKEN_NAMES)[number];

// Mirror DUR.theme and EASE_CSS.inOut in lib/motion.ts (primitives, wave 0b).
// lib/theme.ts ships first, so it cannot import them.
const THEME_DUR_MS = 400;
const THEME_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

type Origin = { x: number; y: number };

const isTheme = (v: unknown): v is Theme => v === "light" || v === "dark";

/** Reads html[data-theme]; "dark" when there is no document. */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const t = document.documentElement.getAttribute("data-theme");
  return isTheme(t) ? t : "dark";
}

// A macrotask, not requestAnimationFrame: rendering is suppressed inside the
// startViewTransition update callback, so rAF would not fire until Chromium's
// ~4 s timeout and the page would freeze. A setTimeout(0) lets subscribers'
// effects (canvas, R3F) run before the "new" snapshot is captured.
const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export function setTheme(next: Theme, opts?: { origin?: Origin }): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;

  const apply = () => {
    html.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked: the theme still applies for this page */
    }
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLOR[next];
  };

  if (typeof document.startViewTransition !== "function") {
    apply();
    return;
  }

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduced) {
    // Plain crossfade; motion.css limits ::view-transition-group(root) to --dur-reduced.
    document.startViewTransition(async () => {
      apply();
      await nextTick();
    });
    return;
  }

  const x = opts?.origin?.x ?? window.innerWidth / 2;
  const y = opts?.origin?.y ?? window.innerHeight / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  html.classList.add("vt-reveal");
  const vt = document.startViewTransition(async () => {
    apply();
    await nextTick(); // lets subscribed canvases and R3F scenes update before the "new" snapshot
  });
  vt.ready
    .then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: THEME_DUR_MS, easing: THEME_EASE, pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => html.classList.remove("vt-reveal")).catch(() => {});
}

export function toggleTheme(opts?: { origin?: Origin }): void {
  setTheme(getTheme() === "dark" ? "light" : "dark", opts);
}

/** MutationObserver on data-theme, plus the "storage" event for other tabs (no animation). */
export function subscribeTheme(cb: (t: Theme) => void): () => void {
  if (typeof document === "undefined") return () => {};
  const html = document.documentElement;
  const observer = new MutationObserver(() => cb(getTheme()));
  observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY || !isTheme(e.newValue) || e.newValue === getTheme()) return;
    html.dataset.theme = e.newValue;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLOR[e.newValue];
  };
  window.addEventListener("storage", onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

export function readToken(name: TokenName): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}
