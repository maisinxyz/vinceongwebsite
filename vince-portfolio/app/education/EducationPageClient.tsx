"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function EducationPageClient() {
  const eduRef = useRef<HTMLDivElement>(null);
  const eduInView = useInView(eduRef, { once: true, margin: "-100px" });

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HERO */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[18vw] text-silver/[0.03] leading-none ml-[-2vw]">
              EDU
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="space-y-6"
            >
              <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">004 — EDUCATION</p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                EDUCATION
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0, 0, 1] }}
                className="h-px bg-silver/30 w-24 origin-left"
              />
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SFU — MAIN EDUCATION CARD
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll delay={0.1}>
              <div ref={eduRef} className="relative max-w-2xl">
                <div
                  className="absolute inset-0 border border-silver/20 rounded-xl pointer-events-none"
                  style={{
                    clipPath: eduInView ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)",
                    transition: "clip-path 1.2s cubic-bezier(0.25, 0, 0, 1) 0.3s",
                  }}
                />
                <div className="p-8 sm:p-10 bg-iron/30 rounded-xl">
                  <div className="flex items-start gap-5 mb-8">
                    <div className="w-12 h-12 flex items-center justify-center border border-silver/15 rounded-lg shrink-0">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-silver/50">
                        <path d="M14 4L26 24H2L14 4Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M14 10L20 22H8L14 10Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl">Simon Fraser University</h3>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm mt-1">BASc Mechatronic Systems Engineering</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em] block mb-2">GPA</span>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-chalk text-2xl font-bold">3.7<span className="text-silver/30 text-sm">/4.3</span></span>
                    </div>
                    <div>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em] block mb-2">DATES</span>
                      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-sm">Sep 2025 – Present</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {[{ label: "IB DIPLOMA", date: "JUL 2025" }, { label: "BC ACHIEVEMENT SCHOLARSHIP", date: "OCT 2025" }].map((award) => (
                      <div key={award.label} className="flex items-center gap-2 bg-[#8B7355]/8 border border-[#8B7355]/15 rounded-full px-4 py-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C4A86B]/50" />
                        <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-[#C4A86B]/70 tracking-widest">{award.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — COURSEWORK
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <div className="border border-dashed border-steel/15 rounded-2xl py-16 px-10 text-center">
                <div className="w-10 h-10 mx-auto mb-5 border border-steel/15 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border border-steel/20 rounded-sm" />
                </div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                  RELEVANT COURSEWORK
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — CERTIFICATIONS
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <div className="border border-dashed border-steel/15 rounded-2xl py-16 px-10 text-center">
                <div className="w-10 h-10 mx-auto mb-5 border border-steel/15 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border border-steel/20 rounded-sm" />
                </div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                  CERTIFICATIONS / ADDITIONAL QUALIFICATIONS
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
