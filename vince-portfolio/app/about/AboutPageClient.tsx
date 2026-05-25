"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function AboutPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* ═══════════════════════════════════════════
            PAGE HERO
        ═══════════════════════════════════════════ */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[25vw] text-silver/[0.03] leading-none ml-[-2vw]">
              ABOUT
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
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">001 — ABOUT</p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                ABOUT
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0, 0, 1] }}
                className="h-px bg-silver/30 w-24 origin-left"
              />
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-base max-w-md">
                The intersection of hardware and software.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PORTRAIT PLACEHOLDER
        ═══════════════════════════════════════════ */}
        <section className="py-8">
          <div className="max-w-3xl mx-auto px-6">
            <RevealOnScroll>
              <div className="border border-dashed border-steel/15 rounded-2xl h-72 sm:h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border border-steel/15 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border border-steel/20 rounded-md" />
                  </div>
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                    PORTRAIT / PROFILE PHOTO
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BIO
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl space-y-12">
              <RevealOnScroll>
                <div className="bg-iron/30 border border-steel/15 rounded-xl p-8 sm:p-10">
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-base leading-[1.9]">
                    IB Diploma graduate now pursuing Mechatronic Systems Engineering at SFU
                    — one of Canada&apos;s most rigorous interdisciplinary programs. Maintaining
                    a 3.7 GPA while actively shipping projects across firmware, mechanical
                    design, and full-stack software.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <div className="bg-iron/30 border border-steel/15 rounded-xl p-8 sm:p-10">
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-base leading-[1.9]">
                    Co-founded{" "}
                    <a href="https://engram-pi-ruddy.vercel.app" target="_blank" rel="noopener noreferrer"
                      className="text-chalk hover:text-accent transition-colors duration-200 underline underline-offset-4 decoration-silver/20">
                      Engram
                    </a>
                    , a B2B AI SaaS platform. Built an automatic spice dispenser with stepper
                    motor firmware. Designed digital dice using boolean logic and PCB assembly.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — ADDITIONAL CONTENT
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <div className="border border-dashed border-steel/15 rounded-2xl py-20 px-10 text-center">
                <div className="w-10 h-10 mx-auto mb-5 border border-steel/15 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border border-steel/20 rounded-sm" />
                </div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                  ADDITIONAL CONTENT — INTERESTS / HOBBIES / PERSONAL
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
