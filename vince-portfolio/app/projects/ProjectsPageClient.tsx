"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

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
   PCB SCHEMATIC COMPONENT (Digital Dice)
   ═══════════════════════════════════════════════════ */
function DigitalDicePCB() {
  return (
    <div className="w-full h-full bg-[#1a2332] rounded-xl flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <svg
        viewBox="0 0 500 380"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* PCB Board Background */}
        <rect x="10" y="10" width="480" height="360" rx="8" fill="#0a3d1a" stroke="#1a6b2a" strokeWidth="2" />
        {/* Copper traces pattern */}
        <defs>
          <pattern id="pcbGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#1a5c2a" opacity="0.4" />
          </pattern>
        </defs>
        <rect x="10" y="10" width="480" height="360" rx="8" fill="url(#pcbGrid)" />

        {/* Title */}
        <text x="250" y="36" textAnchor="middle" fill="#4aff8a" fontSize="11" fontFamily="monospace" fontWeight="bold">ENSC 120 — DIGITAL DICE PCB</text>

        {/* ── 555 Timer Block ── */}
        <rect x="30" y="60" width="100" height="70" rx="4" fill="#0d2e12" stroke="#3adf6a" strokeWidth="1.5" />
        <text x="80" y="80" textAnchor="middle" fill="#4aff8a" fontSize="10" fontFamily="monospace">555 TIMER</text>
        <text x="80" y="95" textAnchor="middle" fill="#2eb85a" fontSize="8" fontFamily="monospace">CLK GEN</text>
        {/* Pins */}
        <circle cx="40" cy="118" r="3" fill="#c8a84e" stroke="#e8c85e" strokeWidth="1" />
        <circle cx="60" cy="118" r="3" fill="#c8a84e" stroke="#e8c85e" strokeWidth="1" />
        <circle cx="80" cy="118" r="3" fill="#c8a84e" stroke="#e8c85e" strokeWidth="1" />
        <circle cx="100" cy="118" r="3" fill="#c8a84e" stroke="#e8c85e" strokeWidth="1" />
        <circle cx="120" cy="118" r="3" fill="#c8a84e" stroke="#e8c85e" strokeWidth="1" />
        <text x="80" y="112" textAnchor="middle" fill="#2eb85a" fontSize="6" fontFamily="monospace">VCC GND OUT RST TRG</text>

        {/* Trace: 555 → Counter */}
        <path d="M130 95 L170 95" stroke="#3adf6a" strokeWidth="1.5" fill="none" />
        <circle cx="170" cy="95" r="2.5" fill="#3adf6a" />

        {/* ── 3-Bit Counter (74HC93) ── */}
        <rect x="170" y="60" width="120" height="70" rx="4" fill="#0d2e12" stroke="#3adf6a" strokeWidth="1.5" />
        <text x="230" y="80" textAnchor="middle" fill="#4aff8a" fontSize="10" fontFamily="monospace">74HC93</text>
        <text x="230" y="95" textAnchor="middle" fill="#2eb85a" fontSize="8" fontFamily="monospace">3-BIT COUNTER</text>
        {/* Output labels */}
        <text x="200" y="112" textAnchor="middle" fill="#c8a84e" fontSize="7" fontFamily="monospace">Q₀</text>
        <text x="230" y="112" textAnchor="middle" fill="#c8a84e" fontSize="7" fontFamily="monospace">Q₁</text>
        <text x="260" y="112" textAnchor="middle" fill="#c8a84e" fontSize="7" fontFamily="monospace">Q₂</text>
        {/* Pins */}
        {[200, 230, 260].map((cx) => (
          <circle key={cx} cx={cx} cy={118} r="3" fill="#c8a84e" stroke="#e8c85e" strokeWidth="1" />
        ))}

        {/* Traces: Counter → Logic */}
        <path d="M200 121 L200 155 L120 155 L120 190" stroke="#3adf6a" strokeWidth="1.2" fill="none" />
        <path d="M230 121 L230 155 L230 190" stroke="#3adf6a" strokeWidth="1.2" fill="none" />
        <path d="M260 121 L260 155 L340 155 L340 190" stroke="#3adf6a" strokeWidth="1.2" fill="none" />

        {/* ── Combinational Logic Block ── */}
        <rect x="60" y="190" width="370" height="60" rx="4" fill="#0d2e12" stroke="#3adf6a" strokeWidth="1.5" />
        <text x="245" y="212" textAnchor="middle" fill="#4aff8a" fontSize="10" fontFamily="monospace">COMBINATIONAL LOGIC GATES</text>
        <text x="245" y="228" textAnchor="middle" fill="#2eb85a" fontSize="8" fontFamily="monospace">AND · OR · NOT — Boolean Decoding</text>
        {/* Gate symbols inline */}
        {[100, 160, 220, 280, 340, 390].map((cx, i) => (
          <g key={i}>
            <rect x={cx - 12} y={234} width="24" height="12" rx="2" fill="none" stroke="#2eb85a" strokeWidth="0.8" />
            <text x={cx} y={243} textAnchor="middle" fill="#2eb85a" fontSize="6" fontFamily="monospace">
              {["AND", "OR", "NOT", "AND", "OR", "NOR"][i]}
            </text>
          </g>
        ))}

        {/* Traces: Logic → 7-Segment */}
        {[100, 140, 180, 220, 260, 300, 360].map((cx, i) => (
          <path key={i} d={`M${cx} 250 L${cx} 270 L${140 + i * 32} 270 L${140 + i * 32} 290`} stroke="#c8a84e" strokeWidth="1" fill="none" />
        ))}

        {/* ── 7-Segment LED Display ── */}
        <rect x="110" y="290" width="180" height="65" rx="4" fill="#0d2e12" stroke="#e8c85e" strokeWidth="1.5" />
        <text x="200" y="310" textAnchor="middle" fill="#e8c85e" fontSize="10" fontFamily="monospace">7-SEGMENT LED</text>

        {/* Dice face simulation */}
        <g transform="translate(170, 318)">
          {/* Segment A (top) */}
          <rect x="10" y="0" width="20" height="4" rx="1" fill="#ff3333" opacity="0.9" />
          {/* Segment B (top-right) */}
          <rect x="30" y="2" width="4" height="14" rx="1" fill="#ff3333" opacity="0.9" />
          {/* Segment C (bottom-right) */}
          <rect x="30" y="18" width="4" height="14" rx="1" fill="#ff3333" opacity="0.9" />
          {/* Segment D (bottom) */}
          <rect x="10" y="30" width="20" height="4" rx="1" fill="#ff3333" opacity="0.9" />
          {/* Segment E (bottom-left) */}
          <rect x="6" y="18" width="4" height="14" rx="1" fill="#ff3333" opacity="0.3" />
          {/* Segment F (top-left) */}
          <rect x="6" y="2" width="4" height="14" rx="1" fill="#ff3333" opacity="0.3" />
          {/* Segment G (middle) */}
          <rect x="10" y="15" width="20" height="4" rx="1" fill="#ff3333" opacity="0.9" />
        </g>

        {/* ── Power Supply ── */}
        <rect x="340" y="60" width="130" height="70" rx="4" fill="#0d2e12" stroke="#ff6b6b" strokeWidth="1.5" />
        <text x="405" y="80" textAnchor="middle" fill="#ff6b6b" fontSize="10" fontFamily="monospace">POWER</text>
        <text x="405" y="96" textAnchor="middle" fill="#ff6b6b" fontSize="8" fontFamily="monospace" opacity="0.7">5V REG · CAPS</text>
        <text x="405" y="110" textAnchor="middle" fill="#ff6b6b" fontSize="8" fontFamily="monospace" opacity="0.7">100µF + 0.1µF</text>
        {/* Capacitor symbol */}
        <line x1="380" y1="116" x2="380" y2="126" stroke="#ff6b6b" strokeWidth="2" />
        <line x1="386" y1="116" x2="386" y2="126" stroke="#ff6b6b" strokeWidth="2" />

        {/* Power rails */}
        <line x1="340" y1="75" x2="130" y2="75" stroke="#ff6b6b" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <line x1="340" y1="120" x2="430" y2="120" stroke="#ff6b6b" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <line x1="430" y1="120" x2="430" y2="290" stroke="#ff6b6b" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <line x1="430" y1="290" x2="290" y2="290" stroke="#ff6b6b" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

        {/* ── Resistor Array ── */}
        <rect x="330" y="290" width="140" height="65" rx="4" fill="#0d2e12" stroke="#8b7dff" strokeWidth="1.5" />
        <text x="400" y="310" textAnchor="middle" fill="#8b7dff" fontSize="10" fontFamily="monospace">RESISTORS</text>
        <text x="400" y="326" textAnchor="middle" fill="#8b7dff" fontSize="8" fontFamily="monospace" opacity="0.7">330Ω × 7</text>
        {/* Resistor symbols */}
        {[352, 370, 388, 406, 424, 442, 456].map((cx, i) => (
          <g key={i}>
            <rect x={cx - 4} y={334} width="8" height="14" rx="1" fill="none" stroke="#8b7dff" strokeWidth="0.8" />
            <line x1={cx} y1={331} x2={cx} y2={334} stroke="#8b7dff" strokeWidth="0.5" />
            <line x1={cx} y1={348} x2={cx} y2={351} stroke="#8b7dff" strokeWidth="0.5" />
          </g>
        ))}

        {/* Connection line: Resistors → 7-Seg */}
        <line x1="330" y1="320" x2="290" y2="320" stroke="#8b7dff" strokeWidth="1" strokeDasharray="3,2" />

        {/* Board revision label */}
        <text x="470" y="365" textAnchor="end" fill="#1a5c2a" fontSize="7" fontFamily="monospace">REV 1.0</text>
        <text x="30" y="365" fill="#1a5c2a" fontSize="7" fontFamily="monospace">SFU ENSC 120</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MEDIA RENDERER COMPONENT
   ═══════════════════════════════════════════════════ */
function ProjectMedia({ project }: { project: typeof PROJECT_ROWS[number] }) {
  if (project.mediaType === "video") {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-void">
        <video
          src={project.mediaSrc}
          className="w-full h-full object-cover"
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
            <div className="space-y-16">
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
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm leading-relaxed mb-6">
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
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
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
