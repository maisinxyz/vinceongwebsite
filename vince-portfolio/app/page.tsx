"use client";

import { motion, useScroll, useTransform, stagger, useAnimate } from "framer-motion";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import Divider from "@/components/Divider";
import Spacer from "@/components/Spacer";
import StatCounter from "@/components/StatCounter";
import ProjectCard from "@/components/ProjectCard";
import PlayingCards from "@/components/PlayingCards";
import { ProjectSquares } from "@/components/ProjectSquares";
import { AppMarquee } from "@/components/AppMarquee";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { Waves } from "@/components/ui/Waves";
import { PROJECTS, EXPERIENCES } from "@/lib/utils";

const PILLS = ["EMBEDDED SYSTEMS", "AI / SAAS", "PCB DESIGN"];

const floatingImages = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop",
    title: "Circuit Board Macro",
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop",
    title: "Robotics Lab",
  },
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop",
    title: "Mathematics",
  },
  {
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop",
    title: "AI Brain",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&auto=format&fit=crop",
    title: "Soldering",
  },
  {
    url: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&auto=format&fit=crop",
    title: "Network",
  },
  {
    url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&auto=format&fit=crop",
    title: "3D Printing",
  },
  {
    url: "https://images.unsplash.com/photo-1504610926078-a1611febcad3?w=400&auto=format&fit=crop",
    title: "Engineering Workspace",
  },
];

const SKILL_TAGS = {
  Programming: ["C++", "Python", "TypeScript"],
  Hardware: ["Soldering", "3D Printing", "PCB Assembly"],
  Tools: ["Git", "Arduino IDE", "Supabase"],
};

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
            HERO SECTION — Waves bg + Floating Images
        ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Layer 0 — Animated wave background (behind everything) */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <Waves
              strokeColor="#3a3a3a"
              backgroundColor="#000000"
            />
          </div>

          {/* Layer 1 — Floating parallax images */}
          <div className="absolute inset-0" style={{ zIndex: 1 }} ref={scope}>
            <Floating sensitivity={-1} className="overflow-hidden">
              <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[0].url}
                  alt={floatingImages[0].title}
                  className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[10%] left-[32%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[1].url}
                  alt={floatingImages[1].title}
                  className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>
              <FloatingElement depth={2} className="top-[2%] left-[55%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[2].url}
                  alt={floatingImages[2].title}
                  className="w-28 h-40 md:w-40 md:h-52 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[0%] left-[83%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[3].url}
                  alt={floatingImages[3].title}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>

              <FloatingElement depth={1} className="top-[40%] left-[2%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[4].url}
                  alt={floatingImages[4].title}
                  className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>
              <FloatingElement depth={2} className="top-[70%] left-[77%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[5].url}
                  alt={floatingImages[5].title}
                  className="w-28 h-28 md:w-36 md:h-48 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>

              <FloatingElement depth={4} className="top-[73%] left-[15%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[6].url}
                  alt={floatingImages[6].title}
                  className="w-40 md:w-52 h-full object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>
              <FloatingElement depth={1} className="top-[80%] left-[50%]">
                <motion.img
                  initial={{ opacity: 0 }}
                  src={floatingImages[7].url}
                  alt={floatingImages[7].title}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-silver/10 hover:scale-105 hover:border-silver/30 duration-200 cursor-pointer transition-all shadow-lg shadow-void/50"
                />
              </FloatingElement>
            </Floating>
          </div>

          {/* Layer 2 — Hero text content (above images + waves) */}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="flex flex-wrap justify-center gap-4 mt-8 pointer-events-auto"
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

          {/* Layer 3 — Bottom gradient fade (wave → black) */}
          <div
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            style={{
              zIndex: 15,
              height: "25vh",
              background: "linear-gradient(to bottom, transparent, #000000)",
            }}
          />

          {/* Layer 4 — Scroll indicator */}
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
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown size={14} className="text-silver/30" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            TRANSITION ZONE — Hero fades into Profile
        ═══════════════════════════════════════════ */}
        <div className="relative bg-void" style={{ height: "15vh", zIndex: 20 }} />

        {/* ═══════════════════════════════════════════
            PAGE 2: FEATURED SQUARES
        ═══════════════════════════════════════════ */}
        <div className="relative z-20 bg-void shadow-[0_20px_50px_rgba(0,0,0,0.8)] pb-24 border-b border-void">
          <ProjectSquares />
        </div>

        {/* ═══════════════════════════════════════════
            PAGE 3: PLAYING CARDS (Parallax Curtain Reveal)
        ═══════════════════════════════════════════ */}
        <div className="relative z-10 bg-void" style={{ height: "100vh" }}>
          <div className="sticky bottom-0 w-full h-screen overflow-hidden">
            <PlayingCards />
          </div>
        </div>

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



        {/* ═══════════════════════════════════════════
            3D VIEWER TEASER
        ═══════════════════════════════════════════ */}
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

        <AppMarquee />

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

      </main>

      <Footer />
    </>
  );
}
