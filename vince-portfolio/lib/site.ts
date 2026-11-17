/* ═══════════════════════════════════════════════════
   SITE CONSTANTS (CONTRACT 4.1, 3.2)
   No email address here: it lives only in env vars (CONTRACT 4.2).
   ═══════════════════════════════════════════════════ */

export const SITE = {
  name: "Vince Ong",
  url: "https://vinceong.dev",
  location: "Vancouver, BC, Canada",
  github: { url: "https://github.com/maisinxyz", handle: "maisinxyz" },
  linkedin: { url: "https://www.linkedin.com/in/vince-ong-9a96a3371/", label: "Vince Ong" },
  resumePdf: "/resume.pdf",
} as const;

export type NavLink = { readonly href: string; readonly label: string };

/** Rail tabs (≥ lg), section bar (< lg) and the first half of the mobile menu. */
export const SECTION_LINKS = [
  { href: "/about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/education", label: "EDUCATION" },
] as const satisfies readonly NavLink[];

/** Navbar desktop links (≥ lg) and the second half of the mobile menu. */
export const UTILITY_LINKS = [
  { href: "/resume", label: "RESUME" },
  { href: "/contact", label: "CONTACT" },
  { href: "/card", label: "BUSINESS CARD" },
] as const satisfies readonly NavLink[];

/** Routes with the side rail (≥ lg) or the section bar (< lg). `/projects/*` is matched by prefix. */
export const RAIL_ROUTES = ["/", "/about", "/projects", "/experience", "/education"] as const;

/** Pure function of the pathname, so server and client agree during hydration. */
export function isRailRoute(path: string): boolean {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return (RAIL_ROUTES as readonly string[]).includes(p) || p.startsWith("/projects/");
}

/** True when `path` is `href` or below it. */
export function isActivePath(path: string, href: string): boolean {
  return path === href || path.startsWith(href + "/");
}

/** Rail tab widths in px. Gutter = width + hoverGrow (71 wide, 44 narrow), mirrored in styles/layout.css. */
export const RAIL = { wide: 57, narrow: 30, hoverGrow: 14, scrollThreshold: 100, breakpoint: 1024 } as const;

export const BREAKPOINT = { sm: 640, lg: 1024 } as const;
