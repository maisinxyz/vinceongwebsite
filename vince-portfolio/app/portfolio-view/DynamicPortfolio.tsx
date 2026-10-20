"use client";

import { motion, Variants } from "framer-motion";
import { Briefcase, FolderCode, GraduationCap, Mail, MapPin, ExternalLink } from "lucide-react";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */
const EXPERIENCES = [
  {
    role: "Software Engineer Intern",
    company: "Resilient Privacy",
    date: "JUL 2026 – PRESENT",
    logo: "/logos/resilient-privacy.png",
    logoBg: "#1a1a2e",
    logoInitials: "RP",
    bullet: "Architected threat intelligence pipelines in Python & Rust for the KANSHI cybersecurity platform.",
  },
  {
    role: "Software Developer",
    company: "SFU Racerbot",
    date: "JUN 2026 – PRESENT",
    logo: "/logos/sfu-racerbot.png",
    logoBg: "#A6192E",
    logoInitials: "SR",
    bullet: "C++/Python sensor fusion pipeline using ROS2 for autonomous obstacle detection.",
  },
  {
    role: "Online Data Analyst",
    company: "TELUS Digital AI",
    date: "JUN 2026 – PRESENT",
    logo: "/logos/telus-digital-ai.png",
    logoBg: "#4b286d",
    logoInitials: "T",
    bullet: "Training data integrity for AI/ML mapping systems; TTS auditory evaluation.",
  },
];

const PROJECTS = [
  {
    title: "ENGRAM",
    description: "B2B AI SaaS — LLM-powered persistent memory for enterprise workflows.",
    tech: "TS · Python · Supabase · RAG",
    status: "ACTIVE",
    image: undefined,
    video: "/Engramvideodemo.mp4",
    href: "/projects/engram",
  },
  {
    title: "SPICE DISPENSER",
    description: "Automated dispensing with sub-degree stepper motor precision.",
    tech: "C++ · Arduino · CAD",
    status: "COMPLETED",
    image: undefined,
    video: "/spicedispenserdemovideo.MOV",
    href: "/projects/spice",
  },
  {
    title: "DIGITAL DICE",
    description: "Mixed-tech PCB — combinational logic to 7-segment LED patterns.",
    tech: "PCB · SMD · EAGLE",
    status: "COMPLETED",
    image: undefined,
    video: undefined,
    href: "/projects/dice",
  },
  {
    title: "CYBERBUG 2077",
    description: "Fast-paced 2D platformer in an infinite glitchy codeworld.",
    tech: "C# · Unity · Pixel Art",
    status: "COMPLETED",
    image: "/cyberbug2077.png",
    video: undefined,
    href: "https://github.com/maisinxyz/CyberBug2077",
  },
];

const SKILLS = [
  "C/C++", "Python", "TypeScript", "Rust", "SQL",
  "Arduino", "STM32", "ROS2", "PCB Design",
  "Next.js", "React", "Supabase", "Git",
];

/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════ */
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

/* ═══════════════════════════════════════════════════
   HELPER: Company Badge
   ═══════════════════════════════════════════════════ */
function Badge({ exp }: { exp: (typeof EXPERIENCES)[number] }) {
  return (
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shrink-0 overflow-hidden border border-steel/20 flex items-center justify-center relative"
      style={{ backgroundColor: exp.logoBg }}
    >
      <span className="text-white/90 text-[9px] sm:text-[10px] font-bold absolute">{exp.logoInitials}</span>
      <img
        src={exp.logo}
        alt={exp.company}
        className="w-full h-full object-contain p-1.5 relative z-10"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
interface DynamicPortfolioProps {
  animated?: boolean;
}

export default function DynamicPortfolio({ animated = true }: DynamicPortfolioProps) {
  const Wrap = animated ? motion.div : "div";
  const wrapProps = animated
    ? { variants: fadeIn, initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true } }
    : {};
  const hoverLift = animated
    ? { whileHover: { y: -4 }, transition: { type: "spring" as const, stiffness: 300, damping: 25 } }
    : {};

  return (
    <div className="w-full h-full flex flex-row overflow-hidden max-w-[1600px] mx-auto gap-8 sm:gap-12 px-6 sm:px-12">

      {/* ═══════════════════════════════════════════════
          COLUMN 1 — Identity Card + Experience
      ═══════════════════════════════════════════════ */}
      <div className={`flex-[1.2] min-w-0 flex flex-col py-10 gap-8 custom-scrollbar ${animated ? "overflow-y-auto" : "overflow-hidden"}`}>

        {/* ── Index Card (from About page) ── */}
        <Wrap {...wrapProps}>
          <div className="border border-steel/20 bg-iron/10 p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.25)] rounded-xl">
            <div className="flex items-start gap-5 mb-6">
              {/* Profile Photo */}
              {animated ? (
                <motion.div
                  whileHover={{ scale: 1.03, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden border border-steel/15 shrink-0"
                >
                  <img src="/profile.jpg" alt="Vince Ong" className="w-full h-full object-cover" />
                </motion.div>
              ) : (
                <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden border border-steel/15 shrink-0">
                  <img src="/profile.jpg" alt="Vince Ong" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-3xl sm:text-4xl tracking-tight leading-none">
                  VINCE ONG
                </h1>
                <p className="font-[family-name:var(--font-space-mono-family)] text-silver/40 text-xs sm:text-sm tracking-[0.2em] mt-3 mb-4">
                  ENGINEERING PORTFOLIO
                </p>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} /> Vancouver, B.C.
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Facts Grid */}
            <div className="h-px bg-steel/15 my-6" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] sm:text-[10px] text-silver/35 tracking-[0.2em] mb-2">FOCUS</p>
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk/80 text-xs sm:text-sm leading-snug">
                  Firmware · Robotics · Full-Stack
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] sm:text-[10px] text-silver/35 tracking-[0.2em] mb-2">EDUCATION</p>
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk/80 text-xs sm:text-sm leading-snug">
                  SFU · MSE · 3.7 GPA
                </p>
              </div>
            </div>
          </div>
        </Wrap>

        {/* ── About ── */}
        <Wrap {...wrapProps}>
          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-sm sm:text-base leading-[1.8] px-2">
            Mechatronic Systems Engineering student specializing in bridging hardware and software—from custom PCB design and embedded firmware to full-stack SaaS platforms.
          </p>
        </Wrap>

        {/* ── Experience ── */}
        <Wrap {...wrapProps}>
          <div className="flex items-center gap-3 mt-4 mb-2">
            <Briefcase className="w-5 h-5 text-silver/40" strokeWidth={1.5} />
            <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight">
              Experience
            </h2>
          </div>
        </Wrap>

        {EXPERIENCES.map((exp) => (
          <Wrap key={exp.company} {...wrapProps}>
            {animated ? (
              <motion.div
                {...hoverLift}
                className="bg-iron/5 border border-steel/10 rounded-xl p-5 hover:border-steel/25 hover:shadow-[0_4px_20px_rgba(58,107,138,0.06)] transition-all duration-300"
              >
                <ExpContent exp={exp} />
              </motion.div>
            ) : (
              <div className="bg-iron/5 border border-steel/10 rounded-xl p-5">
                <ExpContent exp={exp} />
              </div>
            )}
          </Wrap>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════
          COLUMN 2 — Projects (with media)
      ═══════════════════════════════════════════════ */}
      <div className={`flex-[1.4] min-w-0 flex flex-col py-10 gap-8 custom-scrollbar ${animated ? "overflow-y-auto" : "overflow-hidden"}`}>
        <Wrap {...wrapProps}>
          <div className="flex items-center gap-3 mb-2">
            <FolderCode className="w-5 h-5 text-silver/40" strokeWidth={1.5} />
            <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight">Projects</h2>
          </div>
        </Wrap>

        {PROJECTS.map((project) => (
          <Wrap key={project.title} {...wrapProps}>
            {animated ? (
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group bg-iron/5 border border-steel/10 rounded-xl overflow-hidden hover:border-steel/25 hover:shadow-[0_8px_30px_rgba(58,107,138,0.08)] transition-all duration-300"
              >
                <ProjectContent project={project} animated={true} />
              </motion.div>
            ) : (
              <div className="bg-iron/5 border border-steel/10 rounded-xl overflow-hidden">
                <ProjectContent project={project} animated={false} />
              </div>
            )}
          </Wrap>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════
          COLUMN 3 — Skills + Contact
      ═══════════════════════════════════════════════ */}
      <div className={`w-[280px] sm:w-[340px] shrink-0 flex flex-col px-6 py-10 gap-10 custom-scrollbar bg-white/[0.03] rounded-xl my-6 ${animated ? "overflow-y-auto" : "overflow-hidden"}`}>

        {/* Skills */}
        <Wrap {...wrapProps}>
          <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight mb-5">Skills</h2>
          <div className="flex flex-wrap gap-2.5">
            {SKILLS.map((skill) =>
              animated ? (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05, borderColor: "rgba(168,168,168,0.4)" }}
                  className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-xs bg-iron/20 border border-steel/15 rounded-full px-4 py-1.5 cursor-default transition-colors"
                >
                  {skill}
                </motion.span>
              ) : (
                <span key={skill} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-xs bg-iron/20 border border-steel/15 rounded-full px-4 py-1.5">
                  {skill}
                </span>
              )
            )}
          </div>
        </Wrap>

        {/* Contact */}
        <Wrap {...wrapProps}>
          <div className="h-px bg-steel/15 my-2" />
          <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl tracking-tight mb-5">Contact</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "EMAIL", href: "mailto:vinceong2020@gmail.com", icon: <Mail className="w-4 h-4" strokeWidth={1.5} /> },
              {
                label: "LINKEDIN",
                href: "https://www.linkedin.com/in/vince-ong-9a96a3371/",
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
              },
              {
                label: "GITHUB",
                href: "https://github.com/maisinxyz",
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>,
              },
            ].map((link) => (
              <Wrap key={link.label} {...wrapProps}>
                {animated ? (
                  <motion.a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-flex items-center gap-3 font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.1em] text-silver/60 border border-steel/15 rounded-full px-5 py-3 hover:bg-iron/40 hover:text-chalk hover:border-steel/30 transition-all duration-200 force-system-cursor"
                  >
                    {link.icon}
                    {link.label}
                  </motion.a>
                ) : (
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-3 font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.1em] text-silver/60 border border-steel/15 rounded-full px-5 py-3 force-system-cursor"
                  >
                    {link.icon}
                    {link.label}
                  </a>
                )}
              </Wrap>
            ))}
          </div>
        </Wrap>

        {/* Tagline */}
        <div className="mt-auto pt-8">
          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/25 text-xs italic">
            Firmware · Systems · Products
          </p>
          <p className="font-[family-name:var(--font-space-mono-family)] text-silver/20 text-[10px] tracking-wider mt-2">
            vinceong.dev
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */
function ExpContent({ exp }: { exp: (typeof EXPERIENCES)[number] }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-3">
        <Badge exp={exp} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/90 font-medium text-sm truncate">
              {exp.role}
            </h3>
            <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[9px] sm:text-[10px] tracking-wider whitespace-nowrap">
              {exp.date}
            </span>
          </div>
          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-xs mt-1">
            {exp.company}
          </p>
        </div>
      </div>
      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-xs leading-[1.8] pl-[56px] sm:pl-[64px]">
        {exp.bullet}
      </p>
    </>
  );
}

function ProjectContent({ project, animated }: { project: (typeof PROJECTS)[number]; animated: boolean }) {
  const statusColor =
    project.status === "ACTIVE"
      ? "text-emerald-400/80 border-emerald-400/20"
      : project.status === "IN PROGRESS"
      ? "text-amber-400/80 border-amber-400/20"
      : "text-silver/40 border-steel/20";

  const hasMedia = project.video || project.image;

  return (
    <div className="flex flex-col sm:flex-row gap-0">
      {/* Media thumbnail */}
      {hasMedia && (
        <div className="w-full sm:w-[160px] md:w-[180px] shrink-0 bg-iron/10 overflow-hidden relative">
          {project.video ? (
            <video
              src={project.video}
              className={`w-full h-full object-cover aspect-video sm:aspect-auto ${animated ? "group-hover:scale-110 transition-transform duration-700" : ""}`}
              muted
              loop
              playsInline
              autoPlay
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className={`w-full h-full object-cover aspect-video sm:aspect-auto ${animated ? "group-hover:scale-110 transition-transform duration-700" : ""}`}
            />
          ) : null}

          {/* Hover overlay */}
          {animated && project.href && (
            <a
              href={project.href}
              target={project.href.startsWith("http") ? "_blank" : undefined}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center force-system-cursor"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ExternalLink className="w-6 h-6 text-chalk" strokeWidth={1.5} />
              </div>
            </a>
          )}
        </div>
      )}

      {/* Text content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-sm sm:text-base tracking-tight">
            {project.title}
          </h3>
          <span className={`shrink-0 font-[family-name:var(--font-space-mono-family)] text-[9px] sm:text-[10px] tracking-[0.1em] border rounded-full px-2.5 py-1 ${statusColor}`}>
            {project.status}
          </span>
        </div>
        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-xs sm:text-sm leading-[1.7] mb-3 flex-1">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[10px] sm:text-xs tracking-wider">
            {project.tech}
          </span>
          {project.href && !animated && (
            <a href={project.href} target={project.href.startsWith("http") ? "_blank" : undefined} className="text-silver/40 hover:text-chalk transition-colors force-system-cursor">
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
