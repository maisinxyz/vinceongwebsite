"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import Spacer from "@/components/Spacer";
import { ProjectSquares } from "@/components/ProjectSquares";
import { AppMarquee } from "@/components/AppMarquee";
import SkillsMatrix from "@/components/SkillsMatrix";
import StatCounter from "@/components/StatCounter";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, GitBranch, Search, Crosshair, Truck } from "lucide-react";

export default function GurtPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HEADER */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[20vw] text-silver/[0.03] leading-none ml-[-2vw]">
              GURT
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
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVE</p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                GURT
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0, 0, 1] }}
                className="h-px bg-silver/30 w-24 origin-left"
              />
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-base max-w-md">
                Archived components and sections from previous iterations. Kept here for reference.
              </p>
            </motion.div>
          </div>
        </section>

        <Spacer variant="dots" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: FEATURED PROJECT SQUARES
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — FEATURED PROJECT SQUARES</p>
          </div>
        </div>
        <ProjectSquares />

        <Spacer variant="line" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: STATS BAR
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — STATS BAR</p>
          </div>
        </div>
        <section className="relative bg-iron/50 border-y border-silver/8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {[
                { value: 3.7, suffix: "", label: "GPA — SFU", decimals: 1 },
                { value: 3, suffix: "", label: "PROJECTS", decimals: 0 },
                { value: 250, suffix: "%", label: "ASSET GROWTH", decimals: 0 },
                { value: 2, suffix: "+", label: "YRS LEADERSHIP", decimals: 0 },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`px-8 py-14 sm:py-16 ${
                    i < 3 ? "lg:border-r border-silver/8" : ""
                  } ${i < 2 ? "border-b lg:border-b-0 border-silver/8" : ""} ${i === 2 ? "border-b lg:border-b-0 border-silver/8" : ""}`}
                >
                  <RevealOnScroll delay={i * 0.1}>
                    <div className="text-3xl sm:text-4xl font-bold text-chalk mb-2">
                      <StatCounter target={stat.value} suffix={stat.suffix} decimals={stat.decimals} className="text-3xl sm:text-4xl font-bold text-chalk" />
                    </div>
                    <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.15em]">{stat.label}</p>
                  </RevealOnScroll>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Spacer variant="line" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: PHYSICAL TO DIGITAL TEASER
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — PHYSICAL TO DIGITAL TEASER</p>
          </div>
        </div>
        <section className="py-40 sm:py-56 bg-void">
          <div className="max-w-7xl mx-auto page-padding">
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">
              <RevealOnScroll>
                <div className="space-y-10">
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/40 tracking-[0.3em]">INTERACTIVE EXPERIENCE</p>
                  <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none">
                    Physical to<br />Digital
                  </h2>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm md:text-base leading-relaxed max-w-lg">
                    Interact with a virtual replica of the automatic spice dispenser.
                  </p>
                  <Link href="/projects/spice" className="group inline-flex items-center gap-3 bg-chalk text-void px-9 py-4 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-base tracking-wider hover:bg-silver transition-colors duration-200">
                    LAUNCH MODEL
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <div className="relative aspect-square max-w-md md:max-w-lg mx-auto lg:mx-0 bg-void border border-steel/20 rounded-2xl flex items-center justify-center overflow-hidden line-grid-bg">
                  <div className="text-center">
                    <div className="w-28 h-28 mx-auto mb-6 border border-silver/15 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 border border-silver/20 rounded-md animate-spin" style={{ animationDuration: "8s" }} />
                    </div>
                    <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/20 tracking-[0.3em]">3D MODEL</p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <Spacer variant="line" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: APP MARQUEE
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — APP MARQUEE / CONVEYOR BELT</p>
          </div>
        </div>
        <AppMarquee />

        <Spacer variant="line" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: SKILLS MATRIX
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — SKILLS MATRIX</p>
          </div>
        </div>
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <SkillsMatrix />
          </div>
        </section>

        <Spacer variant="line" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: VALUES / WHAT I BRING
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — VALUES / WHAT I BRING</p>
          </div>
        </div>
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
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

        <Spacer variant="line" height={100} />

        {/* ═══════════════════════════════════════════
            ARCHIVED: HOW I BUILD
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">ARCHIVED — HOW I BUILD</p>
          </div>
        </div>
        <section className="py-20 sm:py-24 border-t border-steel/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-24 text-center">
                HOW I BUILD
              </h2>
            </RevealOnScroll>

            <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-6">
              {[
                { icon: Search, step: "01", label: "RESEARCH", desc: "Understand the problem deeply before writing a single line." },
                { icon: Crosshair, step: "02", label: "PROTOTYPE", desc: "Build fast, fail early. Validate with working systems." },
                { icon: Truck, step: "03", label: "SHIP", desc: "Polish, document, deploy. Not done until it's live." },
              ].map((item, i) => (
                <RevealOnScroll key={i} delay={i * 0.15}>
                  <div className="flex items-center gap-0">
                    <div className="flex flex-col items-center text-center w-52">
                      <div className="w-16 h-16 border border-steel/20 rounded-xl flex items-center justify-center mb-6">
                        <item.icon size={22} className="text-silver/40" />
                      </div>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/25 tracking-widest mb-2">{item.step}</span>
                      <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base mb-3">{item.label}</h3>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-[11px] leading-relaxed">{item.desc}</p>
                    </div>
                    {i < 2 && <div className="hidden md:block w-20 h-px border-t border-dashed border-silver/10 mx-4" />}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <Spacer variant="dots" height={120} />
      </main>

      <Footer />
    </>
  );
}
