"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SECTION_LINKS, UTILITY_LINKS, isActivePath } from "@/lib/site";
import { IconButton } from "@/components/primitives/IconButton";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { T, settleDelay, usePrefersReducedMotion } from "@/lib/motion";

const DESKTOP_LINKS = UTILITY_LINKS;
const MOBILE_LINKS = [...SECTION_LINKS, ...UTILITY_LINKS];

// three + R3F + the GLB stay off the first-load bundle (hard rule 7). The
// placeholder matches the canvas box so nothing shifts when it loads.
const SignatureLogo3D = dynamic(() => import("./SignatureLogo3D"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="w-48 h-28" />,
});

// Thin 1px strokes to match the original three-line hamburger.
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="square">
    <path d="M0 4.5h24M0 12h24M0 19.5h24" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="square">
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  // Settle order: overlay first, then each link STAGGER_MS apart (a variant transition would drop the delay).
  const settle = (step: number) => (reduced ? T.reduced : { ...T.enter, delay: settleDelay(step) });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setTimeout(() => setMobileMenuOpen(false), 0);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open; Esc closes it and returns focus to the button.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...T.enter, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 ${mobileMenuOpen ? "z-[80]" : "z-50"} transition-[background-color,border-color] duration-(--dur-move) ease-in-out w-full ${
          scrolled && !isScrolling
            ? "bg-[var(--nav-bg)] backdrop-blur-md border-b border-steel/30"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* The bar's background stays full width; its content starts at the gutter */}
        <div className="w-full pl-gutter gutter-anim">
          <div className="flex items-center justify-between w-full h-16 sm:h-20 relative">

            {/* 3D Asterisk Logo - Perfectly Centered */}
            <div className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <Link
                href="/"
                data-logo-link
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();

                    const start = window.scrollY;
                    if (start === 0) return;
                    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                      window.scrollTo(0, 0);
                      return;
                    }
                    const duration = 2500; // 2.5 seconds for a slower, elegant scroll
                    const startTime = performance.now();

                    // Temporarily disable CSS scroll behavior so it doesn't fight our JS animation
                    const html = document.documentElement;
                    const originalScrollBehavior = html.style.scrollBehavior;
                    html.style.scrollBehavior = "auto";

                    function step(currentTime: number) {
                      const elapsed = currentTime - startTime;
                      const progress = Math.min(elapsed / duration, 1);

                      // Cubic ease-in-out: starts slow, accelerates in the middle, slows down at the end
                      const ease = progress < 0.5
                        ? 4 * Math.pow(progress, 3)
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                      window.scrollTo(0, start * (1 - ease));

                      if (progress < 1) {
                        requestAnimationFrame(step);
                      } else {
                        html.style.scrollBehavior = originalScrollBehavior;
                      }
                    }
                    requestAnimationFrame(step);
                  }
                }}
                className="relative w-48 h-28 flex items-center justify-center group pointer-events-auto"
                // The visible hint (off "/") is the name; on "/" the logo alone needs one.
                aria-label={pathname === "/" ? "Home" : undefined}
              >
                <SignatureLogo3D />
                {pathname !== "/" && (
                  <span className="absolute top-2 max-sm:-top-2 text-[8px] sm:text-[9px] font-[family-name:var(--font-space-mono-family)] tracking-[0.2em] text-subtle whitespace-nowrap">
                    PRESS LOGO TO RETURN TO HOME
                  </span>
                )}
              </Link>
            </div>

            {/* Spacer to push links right */}
            <div className="flex-1" />

            {/* Right cluster: theme toggle, then the desktop links (lg+) or the hamburger (< lg).
                z above the logo box, whose 192 px link area reaches this far on 360 px phones. */}
            <div className="relative z-[51] flex items-center gap-3 lg:mr-6 lg:gap-5">
              <ThemeToggle />

              {/* Desktop Nav Links - Fade on Scroll */}
              <div
                className={`hidden lg:flex items-center justify-end gap-5 transition-opacity duration-300 ${
                  isScrolling ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                {DESKTOP_LINKS.map((link) => {
                  const isActive = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-link-underline font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.12em] transition-colors duration-200 ${
                        isActive
                          ? "text-chalk active"
                          : "text-silver hover:text-chalk"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Hamburger: flush with the viewport edge (baseline), so its focus ring is inset */}
              <IconButton
                ref={menuButtonRef}
                className="lg:hidden text-chalk [&_svg]:h-6 [&_svg]:w-6 focus-visible:outline-offset-[-2px]"
                label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls={mobileMenuOpen ? "mobile-menu" : undefined} // the menu is only in the DOM while open
                data-menu-button=""
                icon={<MenuIcon />}
                swapIcon={<CloseIcon />}
                swapped={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((o) => !o)}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: reduced ? T.reduced : T.enter }}
            exit={{ opacity: 0, y: -20, transition: reduced ? T.reduced : T.exit }}
            className="fixed inset-0 z-[70] bg-carbon/98 backdrop-blur-lg lg:hidden"
          >
            <nav aria-label="Menu" className="flex flex-col items-center justify-center h-full gap-10">
              {MOBILE_LINKS.map((link, index) => {
                const isActive = isActivePath(pathname, link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: settle(index + 1) }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`font-[family-name:var(--font-syne-family)] font-bold text-3xl tracking-tight transition-colors duration-200 ${
                        isActive ? "text-chalk" : "text-silver hover:text-chalk"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile footer info */}
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: settle(MOBILE_LINKS.length + 1) }}
                className="absolute bottom-12 font-[family-name:var(--font-space-mono-family)] text-[10px] text-subtle tracking-widest"
              >
                VINCE.ONG // PORTFOLIO
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
