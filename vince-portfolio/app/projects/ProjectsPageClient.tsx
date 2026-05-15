"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Crosshair, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import Spacer from "@/components/Spacer";
import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/utils";

const FILTERS = ["ALL", "EMBEDDED", "SOFTWARE", "HARDWARE"] as const;
type FilterType = (typeof FILTERS)[number];

export default function ProjectsPageClient() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const filteredProjects =
    activeFilter === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(activeFilter));

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

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="flex flex-wrap gap-3 mt-14"
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] tracking-[0.12em] px-5 py-2.5 rounded-full border transition-all duration-200 ${
                    activeFilter === filter
                      ? "border-silver/40 text-chalk bg-steel/30"
                      : "border-steel/20 text-silver/40 hover:text-silver hover:border-silver/25"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <Spacer variant="dots" height={100} />

        {/* GRID */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
                className="grid md:grid-cols-2 gap-8"
              >
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} featured={project.featured} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="text-center py-28">
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/30 text-sm">No projects match this filter.</p>
              </div>
            )}
          </div>
        </section>

        <Spacer variant="line" height={200} />

        {/* ═══════════════════════════════════════════
            PLACEHOLDER — PROJECT GALLERY / PHOTOS
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <RevealOnScroll>
            <div className="grid sm:grid-cols-3 gap-4">
              {["PROJECT PHOTO 01", "PROJECT PHOTO 02", "PROJECT PHOTO 03"].map((label) => (
                <div key={label} className="border border-dashed border-steel/15 rounded-2xl h-48 sm:h-56 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 border border-steel/15 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 border border-steel/20 rounded-sm" />
                    </div>
                    <p className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/20 tracking-[0.2em]">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        <Spacer variant="diamond" height={200} />

        {/* PROCESS */}
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
