"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

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

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "vinceong2020@gmail.com",
    href: "mailto:vinceong2020@gmail.com",
  },
  {
    icon: LinkedInIcon,
    label: "LINKEDIN",
    value: "Vince Ong",
    href: "https://www.linkedin.com/in/vince-ong-9a96a3371/",
  },
  {
    icon: GitHubIcon,
    label: "GITHUB",
    value: "maisinxyz",
    href: "https://github.com/maisinxyz",
  },
  {
    icon: MapPin,
    label: "LOCATION",
    value: "Vancouver, BC, Canada",
    href: null,
  },
];

export default function ContactPageClient() {

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HERO */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[18vw] text-silver/[0.03] leading-none ml-[-2vw]">
              SAY HI
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="space-y-5"
            >
              <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">
                  004 — CONTACT
                </p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                CONTACT
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0, 0, 1] }}
                className="h-px bg-silver/30 w-24 origin-left"
              />
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-base max-w-lg">
                Open to internships, co-ops, and collaborative projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* INFO GRID */}
        <section className="pb-32 sm:pb-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
              {CONTACT_INFO.map((info, idx) => {
                const Inner = (
                  <div className="group h-full bg-iron/30 border border-steel/15 rounded-2xl p-8 sm:p-12 flex flex-col items-start gap-8 hover:border-silver/30 hover:bg-iron/50 hover:scale-[1.02] transition-all duration-300">
                    <div className="w-16 h-16 border border-steel/20 rounded-xl flex items-center justify-center shrink-0 group-hover:border-silver/40 group-hover:bg-silver/5 transition-all duration-300">
                      <info.icon size={24} className="text-silver/50 group-hover:text-chalk transition-colors duration-300" />
                    </div>
                    <div className="min-w-0 w-full mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] sm:text-xs text-silver/40 tracking-[0.25em] block">
                          {info.label}
                        </span>
                        {info.href && (
                          <ArrowUpRight size={18} className="text-silver/20 shrink-0 group-hover:text-chalk group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
                        )}
                      </div>
                      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-lg sm:text-xl lg:text-2xl truncate block group-hover:text-white transition-colors duration-300">
                        {info.value}
                      </span>
                    </div>
                  </div>
                );

                if (info.href) {
                  return (
                    <RevealOnScroll key={info.label} delay={idx * 0.1}>
                      <a
                        href={info.href}
                        target={info.label !== "EMAIL" ? "_blank" : undefined}
                        rel={info.label !== "EMAIL" ? "noopener noreferrer" : undefined}
                        className="block h-full outline-none"
                      >
                        {Inner}
                      </a>
                    </RevealOnScroll>
                  );
                }

                return (
                  <RevealOnScroll key={info.label} delay={idx * 0.1}>
                    <div className="h-full">{Inner}</div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
