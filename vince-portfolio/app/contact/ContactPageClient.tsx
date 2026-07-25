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
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Navbar />

      <main 
        className="relative pt-28 sm:pt-32 flex-grow"
        style={{ paddingLeft: "var(--sidenav-gutter)", transition: "padding-left 0.4s cubic-bezier(0.25, 0, 0, 1)" }}
      >
        {/* HERO */}
        <section className="py-24 sm:py-32 relative">
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

        {/* INFO LIST */}
        <section className="pb-32 sm:pb-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl flex flex-col">
              {CONTACT_INFO.map((info, idx) => {
                const isLast = idx === CONTACT_INFO.length - 1;
                
                const Inner = (
                  <div className="group flex items-center justify-between py-6 hover:pl-2 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <info.icon size={20} className="text-silver/50 group-hover:text-chalk transition-colors duration-300 shrink-0" />
                      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-sm sm:text-base group-hover:text-chalk transition-colors duration-300">
                        {info.value}
                      </span>
                    </div>
                    {info.href && (
                      <ArrowUpRight 
                        size={20} 
                        className="text-silver/40 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" 
                      />
                    )}
                  </div>
                );

                const renderContent = () => {
                  if (info.href) {
                    return (
                      <a
                        href={info.href}
                        target={info.label !== "EMAIL" ? "_blank" : undefined}
                        rel={info.label !== "EMAIL" ? "noopener noreferrer" : undefined}
                        className="block outline-none"
                      >
                        {Inner}
                      </a>
                    );
                  }
                  return <div>{Inner}</div>;
                };

                return (
                  <RevealOnScroll key={info.label} delay={idx * 0.1}>
                    {renderContent()}
                    {!isLast && <div className="h-px bg-steel/15 w-full" />}
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
