"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import { DigitalDicePCB } from "@/components/DigitalDicePCB";

/* ═══════════════════════════════════════════════════
   PROJECT DATA
   ═══════════════════════════════════════════════════ */
const PROJECT_ROWS = [
  {
    slug: "spice",
    title: "AUTOMATIC SPICE DISPENSER",
    tagline: "Embedded Systems · C++ · Arduino · 3D Printing",
    description:
      "Designed and built a fully automated spice dispensing system using stepper motor firmware with sub-degree precision. Engineered 3D-printed mechanical assemblies in CAD to house a rotating carousel mechanism, and developed custom C++ Arduino firmware to control dispensing sequences, motor calibration, and user input via push buttons.",
    tags: ["C++", "Arduino", "3D Printing", "Stepper Motors", "CAD"],
    status: "COMPLETED",
    year: "2025",
    mediaType: "video" as const,
    mediaSrc: "/spicedispenserdemovideo.MOV",
  },
  {
    slug: "engram",
    title: "ENGRAM",
    tagline: "B2B AI SaaS · LLM-Powered Enterprise Memory",
    description:
      "Co-founded and developed a B2B AI SaaS platform leveraging LLM-powered persistent memory to unify fragmented workflow data across enterprise systems. Built the full-stack application using TypeScript, Next.js, and Python, with Supabase as the backend. Implemented retrieval-augmented generation (RAG) pipelines to transform unstructured enterprise knowledge into a queryable intelligence layer.",
    tags: ["TypeScript", "Python", "Supabase", "RAG", "LLM", "Next.js"],
    status: "ACTIVE",
    year: "2026",
    mediaType: "video" as const,
    mediaSrc: "/Engramvideodemo.mp4",
  },
  {
    slug: "dice",
    title: "DIGITAL DICE",
    tagline: "Boolean Logic · PCB Assembly · SMD Soldering",
    description:
      "Designed and assembled a mixed-technology PCB using combinational boolean logic to decode binary counter states into 7-segment LED dice patterns. Performed schematic capture and board layout in EAGLE, hand-soldered SMD and through-hole components, and verified circuit behavior against truth tables. Completed as part of SFU ENSC 120.",
    tags: ["Boolean Logic", "PCB", "SMD Soldering", "EAGLE", "ENSC 120"],
    status: "COMPLETED",
    year: "2025",
    mediaType: "pcb" as const,
  },
  {
    slug: "dawntrace",
    title: "DAWNTRACE",
    tagline: "Embedded Systems · Arduino · C++ · Sensor Fusion",
    description:
      "Developing a bedside sleep companion device that silently logs sleep schedules and bedroom environment data through the night, then wakes with a gradual sunrise light and rising alarm melody. Built on an Arduino Uno with DHT11 temperature/humidity sensing, LDR light intrusion detection, EEPROM-based 30-night data logging, and a 4×4 keypad settings interface. Designed a full state machine architecture and custom PCB pin allocation for 15+ components.",
    tags: ["C++", "Arduino", "EEPROM", "Sensor Fusion", "PCB Design"],
    status: "IN PROGRESS",
    year: "2026",
    mediaType: "coming-soon" as const,
  },
];

/* ═══════════════════════════════════════════════════
   MEDIA RENDERER COMPONENT
   ═══════════════════════════════════════════════════ */
function ProjectMedia({ project }: { project: typeof PROJECT_ROWS[number] }) {
  if (project.mediaType === "video") {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-void flex items-center justify-center">
        <video
          src={project.mediaSrc}
          className="w-full h-full object-contain"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Subtle overlay for consistency */}
        <div className="absolute inset-0 pointer-events-none border border-steel/15 rounded-xl" />
      </div>
    );
  }

  if (project.mediaType === "pcb") {
    return <DigitalDicePCB />;
  }

  if (project.mediaType === "coming-soon") {
    return (
      <div className="relative w-full h-full bg-void border border-steel/15 rounded-xl flex items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,168,168,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,168,168,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 border border-silver/15 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border border-silver/20 rounded-md animate-spin" style={{ animationDuration: "8s" }} />
          </div>
          <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/25 tracking-[0.3em] mb-2">
            COMING SOON
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[9px] text-silver/15 max-w-[200px] mx-auto">
            Demo content in development
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {PROJECT_ROWS.map((project, i) => (
                <RevealOnScroll key={project.slug} delay={i * 0.1}>
                  <div
                    id={
                      project.slug === "spice"
                        ? "automatic-spice-dispenser"
                        : project.slug === "dice"
                        ? "digital-dice"
                        : project.slug
                    }
                    className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-iron/20 border border-steel/10 rounded-2xl p-8 sm:p-10 hover:border-silver/15 transition-all duration-500"
                  >
                    {/* Left: Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`font-[family-name:var(--font-space-mono-family)] text-[7px] tracking-widest px-2.5 py-0.5 rounded-full border ${
                              project.status === "ACTIVE" || project.status === "IN PROGRESS"
                                ? "text-green-400/60 border-green-400/20"
                                : "text-silver/30 border-silver/10"
                            }`}
                          >
                            {project.status}
                          </span>
                          <span className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/25 tracking-widest">
                            {project.year}
                          </span>
                        </div>
                        <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-2xl sm:text-3xl tracking-tight mb-3">
                          {project.title}
                        </h2>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-xs tracking-wider mb-4">
                          {project.tagline}
                        </p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm mb-6" style={{ lineHeight: '2' }}>
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[9px] text-silver/35 tracking-wider bg-steel/10 rounded-full px-3 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {project.slug !== "dawntrace" && (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group inline-flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-silver/50 hover:text-chalk transition-colors w-fit"
                        >
                          VIEW DETAILS
                          <ArrowRight
                            size={12}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </Link>
                      )}
                    </div>

                    {/* Right: Media */}
                    <div className="relative rounded-xl flex items-center justify-center overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
                      <ProjectMedia project={project} />
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
