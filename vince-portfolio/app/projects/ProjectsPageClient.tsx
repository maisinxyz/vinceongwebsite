"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

const PROJECT_ROWS = [
  {
    slug: "spice",
    title: "AUTOMATIC SPICE DISPENSER",
    tagline: "Embedded Systems · C++ · Arduino · 3D Printing",
    description: "Precision dispensing system with stepper motor firmware and 3D-printed mechanical assemblies.",
    tags: ["C++", "Arduino", "3D Printing", "Stepper Motors"],
    status: "COMPLETED",
    year: "2025",
    interactiveLabel: "3D MODEL",
    interactiveHint: "Interactive 3D mesh — spin, zoom, click buttons",
  },
  {
    slug: "engram",
    title: "ENGRAM",
    tagline: "B2B AI SaaS · LLM-Powered Enterprise Memory",
    description: "AI platform transforming fragmented enterprise knowledge into a unified, queryable intelligence layer.",
    tags: ["TypeScript", "Python", "Supabase", "RAG", "LLM"],
    status: "ACTIVE",
    year: "2026",
    interactiveLabel: "DEMO VIDEO",
    interactiveHint: "Live demo walkthrough of the Engram platform",
  },
  {
    slug: "dice",
    title: "DIGITAL DICE",
    tagline: "Boolean Logic · PCB Assembly · SMD Soldering",
    description: "Digital dice using combinational logic and PCB assembly. ENSC 120 project.",
    tags: ["Boolean Logic", "PCB", "SMD Soldering", "EAGLE"],
    status: "COMPLETED",
    year: "2025",
    interactiveLabel: "PCB SIMULATION",
    interactiveHint: "Interactive simulation of the digital dice circuit",
  },
];

export default function ProjectsPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HEADER */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[20vw] text-silver/[0.03] leading-none ml-[-2vw]">
              WORK
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
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">002 — PROJECTS</p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                PROJECTS
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

        {/* PROJECT ROWS */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="space-y-16">
              {PROJECT_ROWS.map((project, i) => (
                <RevealOnScroll key={project.slug} delay={i * 0.1}>
                  <div id={project.slug === "spice" ? "automatic-spice-dispenser" : project.slug === "dice" ? "digital-dice" : project.slug} className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-iron/20 border border-steel/10 rounded-2xl p-8 sm:p-10 hover:border-silver/15 transition-all duration-500">
                    {/* Left: Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`font-[family-name:var(--font-space-mono-family)] text-[7px] tracking-widest px-2.5 py-0.5 rounded-full border ${
                            project.status === "ACTIVE"
                              ? "text-green-400/60 border-green-400/20"
                              : "text-silver/30 border-silver/10"
                          }`}>
                            {project.status}
                          </span>
                          <span className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/25 tracking-widest">{project.year}</span>
                        </div>
                        <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-2xl sm:text-3xl tracking-tight mb-3">
                          {project.title}
                        </h2>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-xs tracking-wider mb-4">
                          {project.tagline}
                        </p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm leading-relaxed mb-6">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tags.map((tag) => (
                            <span key={tag} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[9px] text-silver/35 tracking-wider bg-steel/10 rounded-full px-3 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-silver/50 hover:text-chalk transition-colors w-fit"
                      >
                        VIEW DETAILS
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Right: Interactive Placeholder */}
                    <div className="relative aspect-[4/3] bg-void border border-steel/15 rounded-xl flex items-center justify-center overflow-hidden">
                      {/* Grid background pattern */}
                      <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: "linear-gradient(rgba(168,168,168,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,168,168,1) 1px, transparent 1px)",
                          backgroundSize: "40px 40px",
                        }}
                      />
                      <div className="text-center relative z-10">
                        <div className="w-16 h-16 mx-auto mb-4 border border-silver/15 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border border-silver/20 rounded-md animate-spin" style={{ animationDuration: "8s" }} />
                        </div>
                        <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/25 tracking-[0.3em] mb-2">{project.interactiveLabel}</p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[9px] text-silver/15 max-w-[200px] mx-auto">{project.interactiveHint}</p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
