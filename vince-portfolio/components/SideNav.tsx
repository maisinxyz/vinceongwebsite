"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RAIL, SECTION_LINKS, isActivePath, isRailRoute } from "@/lib/site";
import SectionBar from "@/components/nav/SectionBar";
import styles from "./SideNav.module.css";

/* ═══════════════════════════════════════════════════
   SIDE RAIL (≥ lg) + SECTION BAR (< lg)
   SSR-rendered on rail routes; styles/layout.css derives --nav-gutter from
   #side-rail[data-rail] with :has(), so no JS sits on the first-paint path.
   ═══════════════════════════════════════════════════ */
export default function SideNav() {
  const pathname = usePathname();

  // NEVER initialise from window.scrollY: the server has no window, so the
  // hydration pass must render the same "wide" state as the server did.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > RAIL.scrollThreshold);
    update(); // picks up a restored mid-page scroll position right after hydration
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!isRailRoute(pathname)) return null;

  const rail = pathname === "/" && !scrolled ? "wide" : "narrow";

  return (
    <>
      <nav
        id="side-rail"
        data-rail={rail}
        aria-label="Sections"
        className={`hidden lg:flex fixed left-0 top-0 h-dvh z-[60] flex-col ${styles.rail}`}
      >
        {SECTION_LINKS.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`group ${styles.tab}`}
            >
              <span
                className={`${styles.label} ${active ? "text-chalk" : "text-silver group-hover:text-chalk"}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <SectionBar pathname={pathname} />
    </>
  );
}
