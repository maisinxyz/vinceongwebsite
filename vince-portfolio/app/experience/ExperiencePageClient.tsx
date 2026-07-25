"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

/* ═══════════════════════════════════════════════════
   EXPERIENCE DATA (from resume)
   ═══════════════════════════════════════════════════ */
const EXPERIENCES = [
  {
    company: "Resilient Privacy",
    role: "Software Engineer Intern",
    dateRange: "JUL 2026 – PRESENT",
    location: "Dallas, TX (Remote)",
    logo: "/logos/resilient-privacy.png",
    logoBg: "#1a1a2e",
    logoInitials: "RP",
    image: undefined,
    bullets: [
      "Architected secure, asynchronous threat intelligence pipelines in Python and Rust, streamlining the ingestion and analysis of real-world security event data for the KANSHI SaaS cybersecurity platform.",
      "Engineered scalable backend APIs and optimized relational SQL database schemas, implementing strategic indexing to ensure robust data delivery and high-performance querying for a React frontend.",
      "Fortified production infrastructure by authoring rigorous unit and integration tests, and championed professional Git workflows to guarantee secure-by-default system deployments.",
    ],
  },
  {
    company: "SFU Racerbot",
    subtitle: "Autonomous Racing Team",
    role: "Software Developer",
    dateRange: "JUN 2026 – PRESENT",
    location: "Burnaby, B.C.",
    logo: "/logos/sfu-racerbot.png",
    logoBg: "#A6192E",
    logoInitials: "SR",
    image: undefined,
    bullets: [
      "Contributed on a C++/Python sensor fusion pipeline using ROS2 to combine 2D LIDAR and camera input for obstacle detection.",
      "Validated autonomous control algorithms in the F1TENTH Gym simulator, streamlining physical testing and mitigating safety-critical bugs prior to hardware deployment.",
    ],
  },
  {
    company: "TELUS Digital AI",
    role: "Online Data Analyst",
    dateRange: "JUN 2026 – PRESENT",
    location: "Remote",
    logo: "/logos/telus-digital-ai.png",
    logoBg: "#4b286d",
    logoInitials: "T",
    image: undefined,
    bullets: [
      "Contributed to the training data integrity of real-world AI/ML mapping systems through labeling and evaluation of large-scale geographical datasets.",
      "Cross-referenced independent data sources to verify location attributes, resolving discrepancies and flagging edge-case anomalies for downstream AI pipelines.",
      "Conducted auditory evaluations of text-to-speech (TTS) outputs, assessing delivery, emotional inflection, and phonetic accuracy to refine conversational naturalness of generative audio models.",
    ],
  },
  {
    company: "MECH",
    subtitle: "Medical Envoys for Community Health",
    role: "Finance & Development Lead",
    dateRange: "AUG 2023 – JUL 2025",
    location: "Langley, B.C.",
    logo: "/logos/mech.png",
    logoBg: "#2d6b5a",
    logoInitials: "M",
    image: "/experiences/MECHimage1.jpg",
    imagePosition: "object-[center_5%]",
    sideImages: [
      { src: "/experiences/MECHimage2.jpg" },
      { src: "/experiences/MECHimage3.jpg", position: "object-[center_40%]" }
    ],
    bullets: [
      "Spearheaded end-to-end financial operations across multiple fundraising campaigns, including budget allocation, operating margin analysis, and stakeholder reporting, ensuring full fiscal accountability.",
      "Drove revenue growth through coordinated digital and door-to-door marketing campaigns, scaling organizational net assets by over 250% across 2-years.",
    ],
  },
];

/* ═══════════════════════════════════════════════════
   LOGO FALLBACK COMPONENT
   ═══════════════════════════════════════════════════ */
type ExperienceType = typeof EXPERIENCES[number];

function CompanyBadge({ exp }: { exp: ExperienceType }) {
  return (
    <div
      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md shrink-0 overflow-hidden border border-steel/20 flex items-center justify-center relative translate-y-[1px]"
      style={{ backgroundColor: exp.logoBg }}
    >
      {/* Initials fallback (always rendered behind) */}
      <span className="text-white/90 text-[8px] sm:text-[9px] font-bold tracking-wider absolute">
        {exp.logoInitials}
      </span>
      {/* Actual image (covers the initials if it loads) */}
      <img
        src={exp.logo}
        alt={exp.company}
        className="w-full h-full object-contain p-1 relative z-10"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function ExperiencePageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative max-lg:pt-[clamp(180px,15vw,284px)] lg:pt-[252px] xl:pt-[284px] pb-32 min-h-screen lg:pr-[80px]" style={{ paddingLeft: "var(--sidenav-gutter)", transition: "padding-left 0.4s cubic-bezier(0.25, 0, 0, 1)" }}>

        {/* ── Page Header ── */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-16 sm:mb-24 lg:mb-28"
          >
            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              EXPERIENCE
            </h1>
            <div className="h-px bg-silver/15 w-16 mt-6" />
          </motion.div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-24">
          {/* ── Experience Entries ── */}
          <div className="group flex flex-col gap-[60px]">
            {EXPERIENCES.map((exp, i) => (
              <RevealOnScroll key={i} delay={i * 0.05}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] gap-6 md:gap-12 py-10 sm:py-14 border-b border-steel/15 transition-opacity duration-300 hover:!opacity-100 group-hover:opacity-30`}
                >
                  
                  <div className="flex flex-col gap-3 pt-1">
                    <div className="flex items-center">
                      <div className="w-[14px] flex-shrink-0">
                        {/* Present indicator dot */}
                        {exp.dateRange.toLowerCase().includes("present") && (
                          <div className="w-1.5 h-1.5 rounded-full bg-silver/60" />
                        )}
                      </div>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/60 tracking-[0.05em] uppercase">
                        {exp.dateRange}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 pl-[14px]">
                      {exp.location === "Remote" ? (
                        <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-[0.2em] uppercase">
                          REMOTE
                        </span>
                      ) : (
                        exp.location.split("(").map((part, idx) => (
                          <span key={idx} className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-[0.2em] uppercase">
                            {part.replace(")", "").trim()}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="flex flex-col">
                    {/* Header: Role · Company */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-lg sm:text-xl tracking-tight leading-tight flex items-center gap-3">
                        {exp.role} 
                        <span className="text-silver/40 font-normal">·</span>
                        <span className="text-silver/60 flex items-center gap-2.5">
                          {exp.company}
                          <CompanyBadge exp={exp} />
                        </span>
                      </h3>
                    </div>

                    {/* Subtitle / Department (optional) */}
                    {exp.subtitle && (
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-[13px] mb-5">
                        {exp.subtitle}
                      </p>
                    )}

                    {/* Bullets */}
                    <ul className="flex flex-col gap-4 sm:gap-5 mt-2">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-4">
                          <span className="text-silver/40 font-bold select-none mt-[2px]">—</span>
                          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-[13px] sm:text-[14px] leading-[1.8]">
                            {bullet}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
