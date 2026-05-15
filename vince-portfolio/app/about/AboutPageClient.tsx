"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, GitBranch } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import Spacer from "@/components/Spacer";
import SkillsMatrix from "@/components/SkillsMatrix";

export default function AboutPageClient() {
  const eduRef = useRef<HTMLDivElement>(null);
  const eduInView = useInView(eduRef, { once: true, margin: "-100px" });

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* ═══════════════════════════════════════════
            PAGE HERO
        ═══════════════════════════════════════════ */}
        <section className="relative py-32 sm:py-44 overflow-hidden">
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

        <Spacer variant="dots" height={100} />

        {/* ═══════════════════════════════════════════
            PORTRAIT PLACEHOLDER
        ═══════════════════════════════════════════ */}
        <Spacer variant="placeholder" placeholderLabel="PORTRAIT / PROFILE PHOTO" height={350} className="max-w-3xl mx-auto px-6" />

        <Spacer variant="line" height={140} />

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

              <RevealOnScroll delay={0.2}>
                <div className="bg-iron/30 border border-steel/15 rounded-xl p-8 sm:p-10">
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-base leading-[1.9]">
                    Drawn to roles where precision matters — aerospace, robotics, autonomous
                    systems, and AI infrastructure. I build things that move, compute, and scale.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <Spacer variant="diamond" height={180} />

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — WORKSPACE / TOOLS PHOTO
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <RevealOnScroll>
            <div className="border border-dashed border-steel/15 rounded-2xl h-56 sm:h-72 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-steel/15 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 border border-steel/20 rounded-md" />
                </div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                  WORKSPACE / LAB / TOOLS PHOTO
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <Spacer variant="cross" height={180} />

        {/* ═══════════════════════════════════════════
            SKILLS MATRIX
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <div className="flex items-baseline gap-4 mb-16">
                <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight">
                  SKILLS
                </h2>
                <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-widest">HOVER FOR CONTEXT</span>
              </div>
            </RevealOnScroll>
            <SkillsMatrix />
          </div>
        </section>

        <Spacer variant="dots" height={200} />

        {/* ═══════════════════════════════════════════
            EDUCATION
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-16">
                EDUCATION
              </h2>
            </RevealOnScroll>

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

        <Spacer variant="line" height={200} />

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — CERTIFICATIONS / COURSES
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <RevealOnScroll>
            <div className="border border-dashed border-steel/15 rounded-2xl py-14 px-10 text-center">
              <div className="w-10 h-10 mx-auto mb-4 border border-steel/15 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border border-steel/20 rounded-sm" />
              </div>
              <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                CERTIFICATIONS / RELEVANT COURSEWORK
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <Spacer variant="cross" height={200} />

        {/* ═══════════════════════════════════════════
            VALUES
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-16">
                WHAT I BRING
              </h2>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Cpu, title: "HARDWARE ↔ SOFTWARE", description: "Firmware for stepper motors and full-stack AI platforms. End-to-end systems from PCB to deployment." },
                { icon: Zap, title: "SHIP FAST, ITERATE", description: "Concept to prototype in one semester. Working systems over perfect plans." },
                { icon: GitBranch, title: "SYSTEMS THINKER", description: "From GANTT scheduling to RAG architecture — every component within a larger machine." },
              ].map((value, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="group bg-iron/30 border border-steel/15 rounded-xl p-8 hover:border-silver/20 transition-all duration-300 h-full">
                    <value.icon size={22} className="text-silver/30 mb-6 group-hover:text-silver/50 transition-colors duration-300" />
                    <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base mb-3">{value.title}</h3>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <Spacer variant="dots" height={160} />

        {/* CTA */}
        <section className="py-24 border-t border-steel/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <RevealOnScroll>
              <Link href="/projects" className="group inline-flex items-center gap-2.5 bg-chalk text-void px-7 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider hover:bg-silver transition-colors duration-200">
                VIEW PROJECTS
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
