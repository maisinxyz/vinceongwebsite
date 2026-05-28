"use client";

import { motion, useScroll, useTransform, stagger, useAnimate } from "framer-motion";
import { useRef, useEffect } from "react";
import { ChevronDown, Briefcase, FolderCode, GraduationCap, Mail, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import PlayingCards from "@/components/PlayingCards";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { Waves } from "@/components/ui/Waves";
import { LogosSlider } from "@/components/LogosSlider";

const PILLS = ["EMBEDDED SYSTEMS", "AI / SAAS", "PCB DESIGN"];

const floatingImages = [
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop", title: "Circuit Board Macro" },
  { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop", title: "Robotics Lab" },
  { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop", title: "Mathematics" },
  { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop", title: "AI Brain" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&auto=format&fit=crop", title: "Soldering" },
  { url: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&auto=format&fit=crop", title: "Network" },
  { url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&auto=format&fit=crop", title: "3D Printing" },
  { url: "https://images.unsplash.com/photo-1504610926078-a1611febcad3?w=400&auto=format&fit=crop", title: "Engineering Workspace" },
];




export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) });
  }, [animate]);

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative">
        {/* ═══════════════════════════════════════════
            SECTION 1: HERO (full screen)
        ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Animated wave background */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <Waves strokeColor="#3a3a3a" backgroundColor="#000000" />
          </div>

          {/* Floating parallax images */}
          <div className="absolute inset-0" style={{ zIndex: 1 }} ref={scope}>
            <Floating sensitivity={-1} className="overflow-hidden">
              <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[0].url} alt={floatingImages[0].title} className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[10%] left-[32%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[1].url} alt={floatingImages[1].title} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={2} className="top-[2%] left-[55%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[2].url} alt={floatingImages[2].title} className="w-28 h-40 md:w-40 md:h-52 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[0%] left-[83%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[3].url} alt={floatingImages[3].title} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[40%] left-[2%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[4].url} alt={floatingImages[4].title} className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={2} className="top-[70%] left-[77%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[5].url} alt={floatingImages[5].title} className="w-28 h-28 md:w-36 md:h-48 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={4} className="top-[73%] left-[15%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[6].url} alt={floatingImages[6].title} className="w-40 md:w-52 h-full object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[80%] left-[50%]">
                <motion.img initial={{ opacity: 0 }} src={floatingImages[7].url} alt={floatingImages[7].title} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50" />
              </FloatingElement>
            </Floating>
          </div>

          {/* Hero text content */}
          <div className="relative flex flex-col items-center justify-center pointer-events-none w-full px-4" style={{ zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="inline-block bg-iron/60 backdrop-blur-sm border border-steel/30 rounded-full px-5 py-2 mb-6 pointer-events-auto"
            >
              <p className="font-[family-name:var(--font-space-mono-family)] text-silver text-[11px] tracking-[0.15em]">
                MECHATRONIC SYSTEMS ENGINEER
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk leading-[0.9] tracking-tight text-center"
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
              className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-lg mt-6"
            >
              Firmware · Systems · Products
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="flex flex-wrap justify-center gap-3 mt-6"
            >
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/60 tracking-wider border border-silver/15 rounded-full px-4 py-1.5 hover:bg-iron/60 hover:text-chalk hover:border-silver/30 transition-all duration-200 cursor-default pointer-events-auto"
                >
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Bottom gradient fade */}
          <div
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            style={{ zIndex: 15, height: "25vh", background: "linear-gradient(to bottom, transparent, #000000)" }}
          />

          {/* Scroll indicator */}
          <motion.div
            style={{ opacity: scrollIndicatorOpacity, zIndex: 20 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <div className="relative">
              <div className="flex flex-col items-center gap-3">
                <span
                  className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-[0.3em]"
                  style={{ writingMode: "vertical-rl" }}
                >
                  SCROLL
                </span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <ChevronDown size={14} className="text-silver/30" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            TRANSITION ZONE
        ═══════════════════════════════════════════ */}
        <div className="relative bg-void" style={{ height: "15vh", zIndex: 20 }} />

        {/* ═══════════════════════════════════════════
            SECTION 2: RESUME TEASER (full screen)
        ═══════════════════════════════════════════ */}
        <section className="relative bg-black flex items-start py-32 sm:py-40" style={{ zIndex: 20 }}>
          {/* Horizontal padding to push content inwards */}
          <div className="max-w-[1440px] mx-auto px-12 sm:px-16 md:px-24 lg:px-32 xl:px-48 w-full flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">
            
            {/* Left Column: Resume Preview */}
            <div className="w-full lg:w-[55%]" style={{ transform: "translateX(80px)", display: "flex", flexDirection: "column", gap: "64px" }}>
              
              {/* Intro */}
              <RevealOnScroll>
                <div>
                  <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-7xl tracking-tight leading-none mb-8">
                    Meet Vince
                  </h2>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-base sm:text-lg leading-[2] max-w-xl">
                    Mechatronic Systems Engineering student at SFU, based in Vancouver. 
                    I specialize in bridging hardware and software—from custom PCB design and embedded firmware to deploying full-stack SaaS platforms.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Skills Animated Slider — full width */}
              <RevealOnScroll delay={0.1}>
                <LogosSlider />
              </RevealOnScroll>

              {/* ═══════════════════════════════════════
                  WORK EXPERIENCE — Static header, no animation
              ═══════════════════════════════════════ */}
              <div className="border-t border-steel/15" style={{ paddingTop: "40px", paddingBottom: "12px" }}>
                <div className="flex items-center gap-3 mb-10">
                  <Briefcase className="w-5 h-5 text-silver/50" strokeWidth={1.5} />
                  <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight">
                    Work Experience
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {/* MECH */}
                  <RevealOnScroll delay={0.15}>
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-semibold text-base">
                          Finance & Development Lead
                        </h4>
                        <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider whitespace-nowrap pt-1">
                          AUG 2023 – JUL 2025
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm mb-4">
                        MECH (Medical Envoys for Community Health) · Langley, B.C.
                      </p>
                      <ul className="space-y-3">
                        <li className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/55 text-sm leading-[1.8] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-silver/30">
                          Drove revenue growth through coordinated digital and door-to-door marketing campaigns, scaling organizational net assets by over 250% across 2 years.
                        </li>
                        <li className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/55 text-sm leading-[1.8] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-silver/30">
                          Architected and maintained a custom expenditure tracking database, reducing reporting discrepancies and improving financial visibility.
                        </li>
                      </ul>
                    </div>
                  </RevealOnScroll>

                  {/* PNE */}
                  <RevealOnScroll delay={0.2}>
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-semibold text-base">
                          Games Attendant
                        </h4>
                        <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider whitespace-nowrap pt-1">
                          AUG 2025 – SEP 2025
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm mb-4">
                        Pacific National Exhibition · Vancouver, B.C.
                      </p>
                      <ul className="space-y-3">
                        <li className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/55 text-sm leading-[1.8] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-silver/30">
                          Consistently exceeded daily revenue targets through high-volume customer engagement across a high-traffic 3-week event.
                        </li>
                      </ul>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>

              {/* ═══════════════════════════════════════
                  PROJECTS — Static header, no animation
              ═══════════════════════════════════════ */}
              <div className="border-t border-steel/15" style={{ paddingTop: "40px", paddingBottom: "12px" }}>
                <div className="flex items-center gap-3 mb-10">
                  <FolderCode className="w-5 h-5 text-silver/50" strokeWidth={1.5} />
                  <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight">
                    Projects
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {/* Engram */}
                  <RevealOnScroll delay={0.15}>
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-semibold text-base">
                          Engram
                        </h4>
                        <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider whitespace-nowrap pt-1">
                          APR 2026 – PRESENT
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm leading-[1.8]">
                        B2B AI SaaS leveraging LLM-powered persistent memory to unify workflow data across enterprise systems.
                      </p>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider mt-2">
                        TYPESCRIPT · PYTHON · SUPABASE · RAG
                      </p>
                    </div>
                  </RevealOnScroll>

                  {/* Automatic Spice Dispenser */}
                  <RevealOnScroll delay={0.2}>
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-semibold text-base">
                          Automatic Spice Dispenser
                        </h4>
                        <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider whitespace-nowrap pt-1">
                          SEP 2025 – DEC 2025
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm leading-[1.8]">
                        Embedded dispensing system with sub-degree stepper motor precision and CAD-driven 3D-printed assemblies.
                      </p>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider mt-2">
                        C++ · ARDUINO · CAD · 3D PRINTING
                      </p>
                    </div>
                  </RevealOnScroll>

                  {/* Digital Dice */}
                  <RevealOnScroll delay={0.25}>
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-semibold text-base">
                          Digital Dice
                        </h4>
                        <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider whitespace-nowrap pt-1">
                          SEP 2025 – DEC 2025
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm leading-[1.8]">
                        Mixed-technology PCB with combinational logic decoding binary states into 7-segment LED patterns.
                      </p>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider mt-2">
                        BOOLEAN LOGIC · PCB ASSEMBLY · SMD SOLDERING
                      </p>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>

              {/* ═══════════════════════════════════════
                  EDUCATION — Static header, no animation
              ═══════════════════════════════════════ */}
              <div className="border-t border-steel/15" style={{ paddingTop: "40px", paddingBottom: "12px" }}>
                <div className="flex items-center gap-3 mb-10">
                  <GraduationCap className="w-5 h-5 text-silver/50" strokeWidth={1.5} />
                  <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight">
                    Education
                  </h3>
                </div>

                <RevealOnScroll delay={0.15}>
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-semibold text-base">
                        Simon Fraser University
                      </h4>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-wider whitespace-nowrap pt-1">
                        SEP 2025 – PRESENT
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm">
                      B.A.Sc. Mechatronic Systems Engineering
                    </p>
                  </div>
                </RevealOnScroll>
              </div>

            </div>

            {/* Right Column: Image Placeholder + Contact */}
            <div className="w-full lg:w-[45%] flex flex-col items-end gap-12 lg:sticky lg:top-40">
              <RevealOnScroll delay={0.3} className="w-full flex justify-end">
                <div className="relative aspect-[4/5] w-full max-w-md bg-iron/10 border border-steel/10 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-space-mono-family)] text-silver/20 text-[10px] tracking-widest">
                      IMAGE PLACEHOLDER
                    </p>
                  </div>
                  {/* Decorative element like the white dot in the reference image */}
                  <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-silver/40" />
                </div>
              </RevealOnScroll>

              {/* Contact & Availability — fills dead space below image */}
              <RevealOnScroll delay={0.4} className="w-full max-w-md">
                <div className="space-y-6">
                  {/* Location & Availability */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-silver/40" strokeWidth={1.5} />
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-xs tracking-wide">
                      Vancouver, B.C. · Open to opportunities
                    </p>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-5">
                    <a href="https://linkedin.com/in/vinceong" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-silver/35 hover:text-chalk transition-colors duration-200 group">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-wide group-hover:text-chalk transition-colors">LinkedIn</span>
                    </a>
                    <a href="https://github.com/maisinxyz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-silver/35 hover:text-chalk transition-colors duration-200 group">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-wide group-hover:text-chalk transition-colors">GitHub</span>
                    </a>
                    <a href="mailto:vinceong2020@gmail.com" className="flex items-center gap-2 text-silver/35 hover:text-chalk transition-colors duration-200 group">
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-wide group-hover:text-chalk transition-colors">Email</span>
                    </a>
                  </div>

                  {/* Tagline */}
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/25 text-[11px] leading-relaxed italic">
                    Firmware · Systems · Products
                  </p>
                </div>
              </RevealOnScroll>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 3: PLAYING CARDS NAVIGATION (0.5 screen)
        ═══════════════════════════════════════════ */}
        <div className="relative z-10 bg-void">
          <PlayingCards />
        </div>

      </main>

      <Footer />
    </>
  );
}
