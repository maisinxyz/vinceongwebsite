"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail } from "lucide-react";

/* Inline brand SVGs since lucide-react dropped brand icons */
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    icon: LinkedInIcon,
    href: "https://www.linkedin.com/in/vince-ong-9a96a3371/",
    label: "LinkedIn",
  },
  {
    icon: GitHubIcon,
    href: "https://github.com/maisinxyz",
    label: "GitHub",
  },
  {
    icon: Mail,
    href: "mailto:vinceong2020@gmail.com",
    label: "Email",
  },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative mt-auto">
      {/* Charging border animation */}
      <div
        className="h-px bg-silver/40 w-full"
        style={{
          clipPath: isInView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 1.2s cubic-bezier(0.25, 0, 0, 1)",
        }}
      />

      <div className="max-w-7xl mx-auto page-padding py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/60 tracking-widest"
          >
            VINCE ONG © {new Date().getFullYear()}
          </motion.p>

          {/* Center — Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="flex items-center gap-6"
          >
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="group relative text-silver hover:text-chalk transition-all duration-200"
              >
                <link.icon
                  size={16}
                />
              </a>
            ))}
          </motion.div>

          {/* Right */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/60 tracking-widest"
          >
            BUILT WITH PRECISION
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
