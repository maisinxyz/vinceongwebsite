"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { cn } from "@/lib/utils";
import { DigitalDicePCB } from "@/components/DigitalDicePCB";

/* ═══════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════ */
interface Project {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  skills: string[];
  status: "COMPLETED" | "ACTIVE" | "IN PROGRESS";
  year: string;
  mediaType: "video" | "pcb" | "coming-soon" | "placeholder" | "image";
  mediaSrc?: string;
  detailPage?: boolean;
  href?: string;
}

/* ═══════════════════════════════════════════════════
   PROJECT DATA
   ═══════════════════════════════════════════════════ */
const HARDWARE_PROJECTS: Project[] = [
  {
    slug: "dawntrace",
    title: "DAWNTRACE",
    description:
      "A bedside sleep companion that silently logs sleep data through the night, then wakes with a gradual sunrise light and rising alarm melody. Built on Arduino with sensor fusion and EEPROM data logging.",
    shortDescription: "Sunrise-alarm sleep companion with sensor fusion and EEPROM logging.",
    skills: ["C++", "Arduino", "Sensor Fusion", "PCB Design", "EEPROM"],
    status: "IN PROGRESS",
    year: "2026",
    mediaType: "coming-soon",
    detailPage: false,
  },
  {
    slug: "spice",
    title: "AUTOMATIC SPICE DISPENSER",
    description:
      "A fully automated spice dispensing system using stepper motor firmware with sub-degree precision. Features 3D-printed mechanical assemblies and custom C++ Arduino firmware.",
    shortDescription: "Automated spice dispenser with stepper motors and sub-degree precision.",
    skills: ["C++", "Arduino", "3D Printing", "Stepper Motors", "CAD"],
    status: "COMPLETED",
    year: "2025",
    mediaType: "video",
    mediaSrc: "/spicedispenserdemovideo.MOV",
    detailPage: true,
  },
  {
    slug: "dice",
    title: "DIGITAL DICE",
    description:
      "A mixed-technology PCB using combinational boolean logic to decode binary counter states into 7-segment LED dice patterns. Hand-soldered SMD and through-hole components.",
    shortDescription: "Mixed-technology PCB decoding binary states into 7-segment LED dice.",
    skills: ["Boolean Logic", "PCB", "SMD Soldering", "EAGLE"],
    status: "COMPLETED",
    year: "2025",
    mediaType: "pcb",
    detailPage: true,
  },
];

const SOFTWARE_PROJECTS: Project[] = [
  {
    slug: "engram",
    title: "ENGRAM",
    description:
      "A B2B AI SaaS platform leveraging LLM-powered persistent memory to unify fragmented workflow data across enterprise systems. Built with RAG pipelines and full-stack TypeScript.",
    shortDescription: "B2B AI SaaS unifying workflow data using LLM persistent memory.",
    skills: ["TypeScript", "Python", "Supabase", "RAG", "LLM", "Next.js"],
    status: "ACTIVE",
    year: "2026",
    mediaType: "video",
    mediaSrc: "/Engramvideodemo.mp4",
    detailPage: true,
  },
  {
    slug: "cyberbug",
    title: "CYBERBUG 2077",
    description:
      "A fast-paced indie 2D platformer. You play as an anomaly running around in an infinite codeworld. Dodge debuggers, grab invisibility orbs, and cause as much dismay (Corruption) as possible.",
    shortDescription: "Fast-paced indie 2D platformer set in an infinite glitchy codeworld.",
    skills: ["Game Dev", "C#", "Unity", "Pixel Art"],
    status: "COMPLETED",
    year: "2024",
    mediaType: "image",
    mediaSrc: "/cyberbug2077.png",
    detailPage: false,
    href: "https://github.com/maisinxyz/CyberBug2077"
  },
];

/* ═══════════════════════════════════════════════════
   MEDIA RENDERER COMPONENT
   ═══════════════════════════════════════════════════ */
function ProjectMedia({ project }: { project: Project }) {
  if (project.mediaType === "video" && project.mediaSrc) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-void flex items-center justify-center">
        <video
          src={project.mediaSrc}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    );
  }

  if (project.mediaType === "pcb") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#101722] rounded-lg overflow-hidden">
        <DigitalDicePCB className="!max-w-none w-full" />
      </div>
    );
  }

  if (project.mediaType === "image" && project.mediaSrc) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.mediaSrc}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (project.mediaType === "coming-soon" || project.mediaType === "placeholder") {
    return (
      <div className="relative w-full h-full bg-iron/30 border border-steel/10 rounded-lg flex items-center justify-center overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,168,168,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,168,168,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="text-center relative z-10">
          <div className="w-10 h-10 mx-auto mb-3 border border-silver/10 rounded-full flex items-center justify-center">
            <div className="w-3.5 h-3.5 border border-silver/15 rounded-sm" />
          </div>
          <p className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/20 tracking-[0.3em]">
            COMING SOON
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════
   PROJECT CARD COMPONENT
   ═══════════════════════════════════════════════════ */
function ProjectCard({ project }: { project: Project; index: number }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
      className="group border border-steel/12 rounded-xl p-6 hover:border-silver/20 transition-colors duration-300"
    >
      {/* Media */}
      {project.detailPage || project.href ? (
        <Link
          href={project.detailPage ? `/projects/${project.slug}` : (project.href || "#")}
          target={project.href ? "_blank" : undefined}
          className="block"
        >
          <div
            className={cn(
              "relative rounded-lg overflow-hidden mb-8 bg-void/50",
              project.mediaType === "pcb" ? "aspect-[480/380]" : "aspect-[3/2]"
            )}
          >
            <ProjectMedia project={project} />
          </div>
        </Link>
      ) : (
        <div
          className={cn(
            "relative rounded-lg overflow-hidden mb-8 bg-void/50",
            project.mediaType === "pcb" ? "aspect-[480/380]" : "aspect-[3/2]"
          )}
        >
          <ProjectMedia project={project} />
        </div>
      )}

      {/* Content */}
      <div className="space-y-2.5">
        {/* Title */}
        <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base tracking-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-[10px] leading-[1.8]">
          {project.shortDescription}
        </p>

        {/* Skills */}
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {project.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[7px] text-silver/30 tracking-wider bg-steel/8 rounded-full px-2 py-0.5"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span
                className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[7px] text-silver/30 tracking-wider bg-steel/8 rounded-full px-2 py-0.5"
              >
                +{project.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View details / External link */}
        {(project.detailPage || project.href) && (
          <Link
            href={project.detailPage ? `/projects/${project.slug}` : (project.href || "#")}
            target={project.href ? "_blank" : undefined}
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-ibm-plex-mono-family)] text-[9px] text-silver/35 hover:text-chalk transition-colors pt-1"
          >
            {project.detailPage ? "VIEW DETAILS" : "VIEW PROJECT"}
            <ArrowRight
              size={9}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COLUMN HEADER COMPONENT
   ═══════════════════════════════════════════════════ */
function ColumnHeader({
  label,
  count,
  delay,
}: {
  label: string;
  count: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0, 0, 1] }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-3">
        <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-2xl sm:text-3xl tracking-tight">
          {label}
        </h2>
        <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/25 tracking-widest self-end mb-1">
          ({String(count).padStart(2, "0")})
        </span>
      </div>
      <div className="h-px bg-steel/20" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function ProjectsPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative max-lg:pt-[clamp(120px,15vw,224px)] lg:pt-48 xl:pt-56 pb-32 min-h-screen lg:pr-[80px]" style={{ paddingLeft: "var(--sidenav-gutter)", transition: "padding-left 0.4s cubic-bezier(0.25, 0, 0, 1)" }}>
        {/* ── Page Header ── */}
        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-[160px] lg:mb-[220px]"
          >
            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              PROJECTS
            </h1>
            <div className="h-px bg-silver/15 w-16 mt-6" />
          </motion.div>
        </div>

        {/* ── Split Columns ── */}
        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 relative">
            {/* Vertical divider (desktop only) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-silver/20 -translate-x-px" />

            {/* ── LEFT: Hardware Projects ── */}
            <div className="lg:pr-10">
              <ColumnHeader
                label="HARDWARE"
                count={HARDWARE_PROJECTS.length}
                delay={0.1}
              />
              <div className="flex flex-col gap-[130px]">
                {HARDWARE_PROJECTS.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </div>
            </div>

            {/* ── RIGHT: Software Projects ── */}
            <div className="lg:pl-10">
              <ColumnHeader
                label="SOFTWARE"
                count={SOFTWARE_PROJECTS.length}
                delay={0.15}
              />
              <div className="flex flex-col gap-[130px]">
                {SOFTWARE_PROJECTS.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
