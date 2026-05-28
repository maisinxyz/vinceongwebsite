"use client";

import { motion, useScroll, useTransform, stagger, useAnimate } from "framer-motion";
import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import PlayingCards from "@/components/PlayingCards";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { Waves } from "@/components/ui/Waves";

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

/* ═══════════════════════════════════════════════════
   RESUME DATA — Deliberately vague teasers
   ═══════════════════════════════════════════════════ */
const RESUME_PROJECTS = [
  { title: "ENGRAM", tagline: "AI SaaS · Semantic Pipelines · RAG", status: "ACTIVE" },
  { title: "SPICE DISPENSER", tagline: "Embedded · Stepper Firmware · 3D Print", status: "COMPLETED" },
  { title: "DIGITAL DICE", tagline: "Boolean Logic · PCB Assembly · SMD", status: "COMPLETED" },
];

const RESUME_SKILLS = ["C++", "Python", "TypeScript", "Soldering", "3D Printing", "PCB Design", "Arduino", "Git", "Supabase", "RAG", "Agile"];

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
        <section className="relative min-h-screen bg-black flex items-center py-32 sm:py-40" style={{ zIndex: 20 }}>
          {/* Drastically increased horizontal padding to push content inwards on all screen sizes */}
          <div className="max-w-[1440px] mx-auto px-12 sm:px-20 md:px-32 lg:px-40 xl:px-56 w-full flex flex-col lg:flex-row items-center gap-24 lg:gap-32">
            
            {/* Left Column: Highly Minimalist & Spacious */}
            <div className="flex-1 w-full space-y-20 pl-8 md:pl-16 lg:pl-24 xl:pl-32">
              
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

              {/* Skills (Purely visual, spaced out nicely) */}
              <RevealOnScroll delay={0.1}>
                <div className="flex flex-wrap gap-4 max-w-lg">
                  {["C++", "Python", "TypeScript", "EAGLE", "Arduino", "Supabase", "PCB Assembly", "3D Printing"].map((skill) => (
                    <span key={skill} className="bg-iron/10 border border-steel/20 rounded-full px-5 py-2.5 font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-sm shadow-sm cursor-default hover:bg-iron/20 hover:text-chalk transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </RevealOnScroll>

              {/* Ultra-Minimalist List (Experience & Projects Combined) */}
              <RevealOnScroll delay={0.2}>
                <div className="border-t border-steel/15 pt-12 space-y-8">
                  
                  {[
                    { title: "Engram", sub: "AI SaaS Platform", detail: "TypeScript, Python" },
                    { title: "Spice Dispenser", sub: "Embedded System", detail: "C++, CAD" },
                    { title: "Digital Dice", sub: "Mixed-Tech PCB", detail: "SMD Soldering" },
                    { title: "MECH", sub: "Finance Lead", detail: "2023 - 2025" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-end justify-between group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                      <div>
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 text-lg mb-1 group-hover:text-chalk transition-colors">{item.title}</h4>
                        <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm block">{item.sub}</span>
                      </div>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-xs tracking-widest uppercase pb-1">
                        {item.detail}
                      </span>
                    </div>
                  ))}

                </div>
              </RevealOnScroll>

            </div>

            {/* Right Column: Image Placeholder */}
            <RevealOnScroll delay={0.3} className="w-full lg:w-[40%] max-w-md mx-auto lg:mx-0">
              <div className="relative aspect-[4/5] bg-iron/10 border border-steel/10 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <p className="font-[family-name:var(--font-space-mono-family)] text-silver/20 text-[10px] tracking-widest">
                    IMAGE PLACEHOLDER
                  </p>
                </div>
                {/* Decorative element like the white dot in the reference image */}
                <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-silver/40" />
              </div>
            </RevealOnScroll>

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
