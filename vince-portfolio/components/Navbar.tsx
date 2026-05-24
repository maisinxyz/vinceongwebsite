"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/contact", label: "CONTACT" },
];

const CuboidArm = ({ rotateZ = 0, rotateX = 0, rotateY = 0 }: { rotateZ?: number, rotateX?: number, rotateY?: number }) => {
  const w = 6;
  const h = 32;
  const d = 6;
  
  const baseClasses = "absolute flex items-center justify-center border border-silver/30";
  
  return (
    <div 
      className="absolute top-1/2 left-1/2" 
      style={{ 
        transformStyle: "preserve-3d", 
        transform: `translate(-50%, -50%) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` 
      }}
    >
      {/* Front (Light) */}
      <div className={`${baseClasses} bg-zinc-600`} style={{ width: w, height: h, transform: `translate(-50%, -50%) translateZ(${d/2}px)` }} />
      {/* Back (Darker) */}
      <div className={`${baseClasses} bg-zinc-900`} style={{ width: w, height: h, transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${d/2}px)` }} />
      {/* Left (Mid-shadow) */}
      <div className={`${baseClasses} bg-zinc-800`} style={{ width: d, height: h, transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${w/2}px)` }} />
      {/* Right (Mid-light) */}
      <div className={`${baseClasses} bg-zinc-700`} style={{ width: d, height: h, transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${w/2}px)` }} />
      {/* Top (Brightest) */}
      <div className={`${baseClasses} bg-zinc-500`} style={{ width: w, height: d, transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${h/2}px)` }} />
      {/* Bottom (Darkest) */}
      <div className={`${baseClasses} bg-zinc-950`} style={{ width: w, height: d, transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${h/2}px)` }} />
    </div>
  );
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

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
    setMobileMenuOpen(false);
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="relative w-14 h-14 flex items-center justify-center group"
                style={{ perspective: "800px" }}
                aria-label="Home"
              >
                <motion.div
                  style={{ rotateY, transformStyle: "preserve-3d" }}
                  className="w-full h-full relative flex items-center justify-center drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                >
                  <CuboidArm rotateZ={0} rotateX={25} />
                  <CuboidArm rotateZ={45} rotateY={25} />
                  <CuboidArm rotateZ={90} rotateX={-25} />
                  <CuboidArm rotateZ={135} rotateY={-25} />
                </motion.div>
              </Link>
            </div>

            {/* Spacer to push links right */}
            <div className="flex-1" />

            {/* Desktop Nav Links - Right Aligned & Fade on Scroll */}
            <div 
              className={`hidden md:flex items-center justify-end gap-8 transition-opacity duration-300 ${
                isScrolling ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
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
                className="relative w-8 h-8 flex items-center justify-center"
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
