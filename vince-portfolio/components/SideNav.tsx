"use client";

import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDE_LINKS = [
  { href: "/about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/education", label: "EDUCATION" },
];

export default function SideNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 100);
    });
    return () => unsubscribe();
  }, [scrollY]);

  if (!mounted || isMobileOrTablet) return null;

  const validPaths = ["/", "/about", "/projects", "/experience", "/education"];
  if (!validPaths.includes(pathname)) return null;

  // Hero landing page: ~1.5cm ≈ 57px protrusion. Scrolled or Other pages: ~0.8cm ≈ 30px
  const isHomePage = pathname === "/";
  const baseWidth = (isHomePage && !hasScrolled) ? 57 : 30;

  return (
    <nav
      className="fixed left-0 top-0 h-screen z-[60] flex flex-col pointer-events-none"
      aria-label="Side navigation"
    >
      <div
        className="flex flex-col h-full pointer-events-auto"
        style={{ gap: "0px" }}
      >
        {SIDE_LINKS.map((link, i) => (
          <SideButton
            key={link.href}
            href={link.href}
            label={link.label}
            baseWidth={baseWidth}
            index={i}
            total={SIDE_LINKS.length}
          />
        ))}
      </div>
    </nav>
  );
}

function SideButton({
  href,
  label,
  baseWidth,
  index,
  total,
}: {
  href: string;
  label: string;
  baseWidth: number;
  index: number;
  total: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Outer corners rounded, inner edges flush
  const borderRadius = "0 16px 16px 0";

  // Hover adds 14px more protrusion
  const width = isHovered ? baseWidth + 14 : baseWidth;

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="side-nav-button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        overflow: "visible",
        transition:
          "width 0.4s cubic-bezier(0.25, 0, 0, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        // Apple liquid glass: translucent white-tinted grey
        background: isHovered
          ? "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(200,200,210,0.10) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(200,200,210,0.05) 100%)",
        backdropFilter: "blur(28px) saturate(1.8) brightness(1.05)",
        WebkitBackdropFilter: "blur(28px) saturate(1.8) brightness(1.05)",
        border: "1px solid",
        borderLeft: "none",
        borderColor: isHovered
          ? "rgba(255, 255, 255, 0.22)"
          : "rgba(255, 255, 255, 0.10)",
        borderRadius: borderRadius,
        flex: 1,
        minHeight: 0,
        cursor: "pointer",
        textDecoration: "none",
        // Subtle inner glow + outer shadow for glass depth
        boxShadow: isHovered
          ? "inset 0 0 24px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.10), 2px 0 16px rgba(0,0,0,0.12)"
          : "inset 0 0 16px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          transform: "rotate(-90deg)",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-ibm-plex-mono-family)",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.2em",
          color: isHovered
            ? "rgba(242, 242, 240, 0.85)"
            : "rgba(200, 200, 200, 0.45)",
          transition: "color 0.3s ease",
          userSelect: "none",
        }}
      >
        {label}
      </span>
    </Link>
  );
}
