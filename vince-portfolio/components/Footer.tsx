"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative mt-auto pb-12">
      {/* Charging border animation */}
      <div
        className="h-px bg-silver/20 w-full"
        style={{
          clipPath: isInView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 1.2s cubic-bezier(0.25, 0, 0, 1)",
        }}
      />

      <div className="max-w-7xl mx-auto page-padding pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0, 0, 1] }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 font-[family-name:var(--font-space-mono-family)] text-[10px] sm:text-[11px] text-silver/40 tracking-widest uppercase"
        >
          {/* Left - Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <Link href="/" className="hover:text-chalk transition-colors duration-300">HOME</Link>
            <Link href="/about" className="hover:text-chalk transition-colors duration-300">ABOUT</Link>
            <Link href="/projects" className="hover:text-chalk transition-colors duration-300">PROJECTS</Link>
            <Link href="/experience" className="hover:text-chalk transition-colors duration-300">EXPERIENCE</Link>
          </div>
          
          {/* Right - Contact/Socials */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <a href="https://linkedin.com/in/vince-ong-9a96a3371/" target="_blank" rel="noopener noreferrer" className="hover:text-chalk transition-colors duration-300">LINKEDIN</a>
            <a href="https://github.com/maisinxyz" target="_blank" rel="noopener noreferrer" className="hover:text-chalk transition-colors duration-300">GITHUB</a>
            <a href="mailto:vinceong2020@gmail.com" className="hover:text-chalk transition-colors duration-300">EMAIL</a>
          </div>
        </motion.div>
        
        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 text-center font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]"
        >
          VINCE ONG © {new Date().getFullYear()} // BUILT WITH PRECISION
        </motion.div>
      </div>
    </footer>
  );
}
