import Link from "next/link";
import { SECTION_LINKS, isActivePath } from "@/lib/site";

/* ═══════════════════════════════════════════════════
   SECTION BAR (< lg, rail routes only)
   Rendered by SideNav so there is a single mount point. styles/layout.css
   reserves --nav-bar-bottom whenever #section-bar is in the document.
   ═══════════════════════════════════════════════════ */
export default function SectionBar({ pathname }: { pathname: string }) {
  return (
    <nav
      id="section-bar"
      aria-label="Sections"
      className="lg:hidden fixed inset-x-0 bottom-0 z-[60] h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[var(--nav-bg)] backdrop-blur border-t border-steel"
    >
      <ul className="grid grid-cols-4 h-full">
        {SECTION_LINKS.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <li key={link.href} className="h-full">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center justify-center font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] font-medium tracking-[0.16em] transition-colors duration-200 ${
                  active ? "text-chalk" : "text-silver hover:text-chalk"
                }`}
              >
                {active && <span aria-hidden="true" className="absolute inset-x-4 top-0 h-px bg-accent" />}
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
