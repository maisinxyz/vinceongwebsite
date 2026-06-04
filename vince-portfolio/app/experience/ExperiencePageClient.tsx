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
    company: "Pacific National Exhibition",
    role: "Games Attendant",
    dateRange: "AUG – SEPT 2025",
    location: "Vancouver, B.C.",
    logo: "/logos/pne.png",
    logoBg: "#1a0a6e",
    logoInitials: "PNE",
    image: "/experiences/PNEimage2.jpg",
    imagePosition: "object-[center_45%]",
    bullets: [
      "Demonstrated strong communication and interpersonal skills by actively engaging with a high volume of guests, ensuring a welcoming and entertaining environment to support daily revenue targets.",
      "Collaborated effectively with team members and supervisors to seamlessly manage booth operations, track prize inventory with zero discrepancies, and resolve customer inquiries during a high-traffic, 3-week event.",
      "Maintained strict operational guidelines for safety and game integrity, processing cash and card transactions efficiently to optimize throughput during peak hours.",
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
    bullets: [
      "Spearheaded end-to-end financial operations across multiple fundraising campaigns, including budget allocation, operating margin analysis, and stakeholder reporting, ensuring full fiscal accountability.",
      "Architected and maintained a custom expenditure tracking database, enforcing data standards that reduced reporting discrepancies and improved financial visibility for the entire team.",
      "Drove revenue growth through coordinated digital and door-to-door marketing campaigns, scaling organizational net assets by over 250% across 2-years.",
      "Organized structured outreach and educational programs, coordinating logistics and tracking KPIs to measure the efficacy of community health initiatives.",
    ],
  },
];

/* ═══════════════════════════════════════════════════
   LOGO FALLBACK COMPONENT
   ═══════════════════════════════════════════════════ */
type ExperienceType = typeof EXPERIENCES[number] & { imgClass?: string };

function CompanyLogo({ exp }: { exp: ExperienceType }) {
  return (
    <div
      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0 overflow-hidden border border-steel/20 flex items-center justify-center relative"
      style={{ backgroundColor: exp.logoBg }}
    >
      {/* Initials fallback (always rendered behind) */}
      <span className="text-white/80 text-xs font-bold tracking-wider absolute">
        {exp.logoInitials}
      </span>
      {/* Actual image (covers the initials if it loads) */}
      <img
        src={exp.logo}
        alt={exp.company}
        className={`w-full h-full object-contain p-3 sm:p-4 relative z-10 ${exp.imgClass || ""}`}
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

      <main className="relative pt-48 sm:pt-56 pb-32 min-h-screen">
        
        {/* ── Page Header (Top Left Aligned) ── */}
        <div className="max-w-[1400px] mx-auto px-10 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-48 sm:mb-64"
          >
            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              EXPERIENCE
            </h1>
            <div className="h-px bg-silver/15 w-16 mt-6" />
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto pl-16 sm:pl-32 md:pl-48 lg:pl-48 xl:pl-64 pr-10 sm:pr-16 lg:pr-24">
          {/* ── Experience Entries ── */}
          <div className="relative">

            {/* Timeline vertical line (right side, desktop only) */}
            <div className="hidden lg:block absolute right-0 top-4 bottom-0 w-px bg-steel/10" />

            <div className="space-y-48 sm:space-y-64">
              {EXPERIENCES.map((exp, i) => (
                <div key={i} className="relative">

                    {/* Timeline dot (right side, desktop only) */}
                    <div className="hidden lg:flex absolute -right-[7px] top-[280px] w-[15px] h-[15px] rounded-full border-2 border-steel/20 bg-carbon items-center justify-center z-10">
                      <div className="w-[5px] h-[5px] rounded-full bg-silver/40" />
                    </div>

                    {/* Horizontal Image */}
                    <div className="w-full h-[200px] sm:h-[240px] rounded-xl bg-gradient-to-br from-iron/30 via-carbon to-steel/8 border border-steel/12 mb-12 flex items-center justify-center overflow-hidden relative group">
                      {exp.image ? (
                        <img 
                          src={exp.image} 
                          alt={`${exp.company} experience`} 
                          className={`w-full h-full object-cover ${exp.imagePosition || 'object-center'}`} 
                        />
                      ) : (
                        <>
                          {/* Subtle noise texture */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.015),transparent_60%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.01),transparent_50%)]" />
                          <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/12 tracking-[0.35em] select-none z-10">
                            PHOTO COMING SOON
                          </span>
                        </>
                      )}
                    </div>

                    {/* Content Row */}
                    <div className="flex pr-[25%] sm:pr-[35%] md:pr-[45%] lg:pr-[50%] xl:pr-[55%]">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0 lg:pr-16">

                        {/* Header: Logo + Info */}
                        <div className="flex items-start gap-5 sm:gap-6">
                          <CompanyLogo exp={exp} />

                          <div className="flex-1 min-w-0">
                            {/* Company + Date Row */}
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl sm:text-2xl tracking-tight leading-tight">
                                  {exp.company}
                                </h3>
                                {exp.subtitle && (
                                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/35 text-[11px] mt-1 tracking-wide">
                                    {exp.subtitle}
                                  </p>
                                )}
                              </div>
                              <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-[0.15em] whitespace-nowrap pt-1.5">
                                {exp.dateRange}
                              </span>
                            </div>

                            {/* Role + Location Row */}
                            <div className="flex items-start justify-between gap-4 mt-3">
                              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-sm">
                                {exp.role}
                              </p>
                              <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/25 tracking-[0.15em] whitespace-nowrap">
                                {exp.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-steel/10 mt-10 mb-8 ml-[76px] sm:ml-[88px]" />

                        {/* Bullet Points */}
                        <ul className="space-y-5 pl-[76px] sm:pl-[88px]">
                          {exp.bullets.map((bullet, j) => (
                            <li key={j} className="flex items-start gap-3.5">
                              <div className="w-1 h-1 rounded-full bg-silver/25 mt-[9px] shrink-0" />
                              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-[13px] leading-[2]">
                                {bullet}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Timeline end cap */}
            <div className="hidden lg:flex absolute -right-[5px] bottom-0 w-[11px] h-[11px] rounded-full border border-steel/15 bg-carbon items-center justify-center" />

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
