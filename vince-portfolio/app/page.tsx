"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BootLoader from "@/components/BootLoader";
import CustomCursor from "@/components/CustomCursor";
import CircuitSVG from "@/components/CircuitSVG";
import RevealOnScroll from "@/components/RevealOnScroll";
import Divider from "@/components/Divider";
import Spacer from "@/components/Spacer";
import StatCounter from "@/components/StatCounter";
import ProjectCard from "@/components/ProjectCard";
import { PROJECTS, EXPERIENCES } from "@/lib/utils";

const PILLS = ["EMBEDDED SYSTEMS", "AI / SAAS", "PCB DESIGN"];
const SKILL_TAGS = {
  Programming: ["C++", "Python", "TypeScript"],
  Hardware: ["Soldering", "3D Printing", "PCB Assembly"],
  Tools: ["Git", "Arduino IDE", "Supabase"],
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <>
      <BootLoader />
      <CustomCursor />
      <Navbar />

      <main className="relative">
        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center hero-grid-bg overflow-hidden"
        >
          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[40vw] text-silver/[0.03] leading-none">
              V
            </span>
          </div>

          <div className="max-w-7xl mx-auto page-padding w-full pt-40 pb-32">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Left */}
              <div className="relative z-10 space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  className="inline-block bg-iron/60 backdrop-blur-sm border border-steel/30 rounded-full px-5 py-2 ml-4 sm:ml-8 lg:ml-12"
                >
                  <p className="font-[family-name:var(--font-space-mono-family)] text-silver text-[11px] tracking-[0.15em]">
                    MECHATRONIC SYSTEMS ENGINEER
                  </p>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                >
                  VINCE
                  <br />
                  ONG
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-lg ml-4 sm:ml-8 lg:ml-12"
                >
                  Firmware · Systems · Products
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  className="flex flex-wrap gap-3 ml-4 sm:ml-8 lg:ml-12"
                >
                  {PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/60 tracking-wider border border-silver/15 rounded-full px-4 py-1.5 hover:bg-iron/60 hover:text-chalk hover:border-silver/30 transition-all duration-200 cursor-default"
                    >
                      {pill}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  className="flex flex-wrap gap-4 pt-4 ml-4 sm:ml-8 lg:ml-12"
                >
                  <Link
                    href="#projects"
                    className="group inline-flex items-center gap-2.5 bg-chalk text-void px-7 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider hover:bg-silver transition-colors duration-200"
                  >
                    VIEW WORK
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 border border-silver/25 text-silver px-7 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider hover:border-chalk/50 hover:text-chalk transition-all duration-200"
                  >
                    <Download size={14} />
                    DOWNLOAD CV
                  </a>
                </motion.div>
              </div>

              {/* Right — Circuit SVG */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 1.2 }}
                className="hidden lg:block relative"
              >
                <CircuitSVG className="opacity-50" />
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span
              className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-[0.3em]"
              style={{ writingMode: "vertical-rl" }}
            >
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={14} className="text-silver/30" />
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS BAR
        ═══════════════════════════════════════════ */}
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

        {/* Spacer */}
        <Spacer variant="dots" height={160} />

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — PORTRAIT / HEADSHOT AREA
        ═══════════════════════════════════════════ */}
        <Spacer variant="placeholder" placeholderLabel="PORTRAIT / HEADSHOT PHOTO" height={300} className="max-w-7xl mx-auto page-padding" />

        <Spacer variant="line" height={120} />

        {/* ═══════════════════════════════════════════
            ABOUT STRIP
        ═══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto page-padding">
            <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
              {/* Bio */}
              <RevealOnScroll className="lg:col-span-3">
                <div className="bg-iron/30 border border-steel/20 rounded-xl p-8 sm:p-10">
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.25em] mb-5">ABOUT</p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/80 text-base leading-[1.8]">
                    I build things that work — from stepper motor firmware to AI platforms.
                    Currently studying Mechatronic Systems Engineering at SFU with a 3.7 GPA
                    and a bias toward shipping.
                  </p>
                  <Link href="/about" className="group inline-flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono-family)] text-sm text-silver/50 hover:text-chalk transition-colors duration-200 mt-6">
                    LEARN MORE
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealOnScroll>

              {/* Skills */}
              <RevealOnScroll delay={0.15} className="lg:col-span-2">
                <div className="space-y-8">
                  {Object.entries(SKILL_TAGS).map(([category, tags]) => (
                    <div key={category}>
                      <h4 className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.2em] mb-3">{category.toUpperCase()}</h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span key={tag} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] text-silver/60 border border-steel/30 rounded-md px-3 py-1.5 hover:text-chalk hover:border-silver/30 transition-all duration-200">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <Spacer variant="diamond" height={180} />

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — FEATURED GRAPHIC / BANNER
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto page-padding">
          <RevealOnScroll>
            <div className="border border-dashed border-steel/15 rounded-2xl h-48 sm:h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-steel/15 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 border border-steel/20 rounded-md" />
                </div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                  FEATURED BANNER / WORKSPACE PHOTO
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <Spacer variant="cross" height={180} />

        {/* ═══════════════════════════════════════════
            FEATURED PROJECTS
        ═══════════════════════════════════════════ */}
        <section id="projects" className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto page-padding">
            <RevealOnScroll>
              <Divider label="SELECTED WORK" className="mb-20" />
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-8">
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} featured={project.featured} />
              ))}
            </div>

            <RevealOnScroll delay={0.4} className="mt-16 text-center">
              <Link href="/projects" className="group inline-flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono-family)] text-sm text-silver/50 hover:text-chalk transition-colors duration-200">
                VIEW ALL PROJECTS
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>

        {/* Spacer */}
        <Spacer variant="dots" height={200} />

        {/* ═══════════════════════════════════════════
            3D VIEWER TEASER
        ═══════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-void">
          <div className="max-w-7xl mx-auto page-padding">
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">
              <RevealOnScroll>
                <div className="space-y-8">
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.25em]">INTERACTIVE EXPERIENCE</p>
                  <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight leading-tight">
                    Physical to Digital
                  </h2>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm leading-relaxed max-w-md">
                    Interact with a virtual replica of the automatic spice dispenser.
                  </p>
                  <Link href="/projects/spice" className="group inline-flex items-center gap-2.5 bg-chalk text-void px-7 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider hover:bg-silver transition-colors duration-200">
                    LAUNCH MODEL
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 bg-void border border-steel/20 rounded-xl flex items-center justify-center overflow-hidden line-grid-bg">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 border border-silver/15 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border border-silver/20 rounded-md animate-spin" style={{ animationDuration: "8s" }} />
                    </div>
                    <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-widest">3D MODEL</p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <Spacer variant="line" height={200} />

        {/* ═══════════════════════════════════════════
            EXPERIENCE TEASER
        ═══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto page-padding">
            <RevealOnScroll>
              <Divider label="EXPERIENCE" className="mb-20" />
            </RevealOnScroll>

            <div className="space-y-0 max-w-2xl">
              {EXPERIENCES.map((exp, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="relative pl-8 pb-14 border-l border-steel/20 last:pb-0">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-silver/30 -translate-x-1/2" />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-6">
                      <div>
                        <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-lg">{exp.company}</h3>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm mt-0.5">{exp.role}</p>
                      </div>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-widest shrink-0 mt-1">{exp.dateRange}</span>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll delay={0.4} className="mt-14">
              <Link href="/experience" className="group inline-flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono-family)] text-sm text-silver/50 hover:text-chalk transition-colors duration-200">
                FULL TIMELINE
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>

        {/* Spacer */}
        <Spacer variant="diamond" height={200} />

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — QUOTE / TESTIMONIAL
        ═══════════════════════════════════════════ */}
        <div className="max-w-3xl mx-auto page-padding">
          <RevealOnScroll>
            <div className="border border-dashed border-steel/15 rounded-2xl py-16 px-10 text-center">
              <div className="w-10 h-10 mx-auto mb-5 border border-steel/15 rounded-lg flex items-center justify-center">
                <span className="font-[family-name:var(--font-syne-family)] text-silver/20 text-xl">&ldquo;</span>
              </div>
              <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                QUOTE / TESTIMONIAL / PERSONAL MOTTO
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <Spacer variant="cross" height={200} />

        {/* ═══════════════════════════════════════════
            CONTACT CTA BAND
        ═══════════════════════════════════════════ */}
        <section className="py-40 sm:py-48 bg-chalk text-void">
          <div className="max-w-7xl mx-auto page-padding text-center">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-void text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-8">
                LET&apos;S BUILD SOMETHING.
              </h2>
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-steel/70 text-sm max-w-lg mx-auto mb-14 leading-relaxed">
                Open to internships and co-op placements in mechatronic, software,
                and aerospace engineering.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:vinceong2020@gmail.com"
                  className="group inline-flex items-center gap-2.5 bg-void text-chalk px-7 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider hover:bg-steel transition-colors duration-200"
                >
                  SEND AN EMAIL
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://www.linkedin.com/in/vince-ong-9a96a3371/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 border border-void/30 text-void px-7 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider hover:bg-void hover:text-chalk transition-all duration-200"
                >
                  CONNECT ON LINKEDIN
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
