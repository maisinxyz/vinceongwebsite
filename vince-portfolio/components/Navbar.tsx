"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/resume", label: "RESUME" },
  { href: "/contact", label: "CONTACT" },
];

import SignatureLogo3D from "./SignatureLogo3D";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0, 0, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${
          scrolled && !isScrolling
            ? "bg-[rgba(13,13,13,0.92)] backdrop-blur-md border-b border-steel/30"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="w-full px-6 sm:px-12">
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
                aria-label="Home"
              >
                <SignatureLogo3D />
                {pathname !== "/" && (
                  <span className="absolute bottom-2 text-[9px] font-[family-name:var(--font-space-mono-family)] tracking-[0.2em] text-silver/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    RETURN TO HOME
                  </span>
                )}
              </Link>
            </div>

            {/* Spacer to push links right */}
            <div className="flex-1" />

            {/* Desktop Nav Links - Right Aligned & Fade on Scroll */}
            <div 
              className={`hidden md:flex items-center justify-end gap-8 transition-opacity duration-300 ${
                isScrolling ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{ marginRight: '24px' }}
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link-underline font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.2em] transition-colors duration-200 ${
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

            {/* Mobile Hamburger (Right Aligned on mobile) */}
            <div className="md:hidden flex-1 flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-11 h-11 flex items-center justify-center"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative w-6 h-4 flex flex-col justify-between">
                  <span
                    className={`block w-full h-px bg-chalk transition-all duration-300 origin-center ${
                      mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-px bg-chalk transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-px bg-chalk transition-all duration-300 origin-center ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
            className="fixed inset-0 z-40 bg-carbon/98 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-10">
              {NAV_LINKS.map((link, index) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.4,
                      ease: [0.25, 0, 0, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="absolute bottom-12 font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-widest"
              >
                VINCE.ONG // PORTFOLIO
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
