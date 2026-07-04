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
    sideImages: [
      { src: "/experiences/PNEimage1.jpg" },
      { src: "/experiences/PNEimage2.jpg" }
    ],
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
    sideImages: [
      { src: "/experiences/MECHimage2.jpg" },
      { src: "/experiences/MECHimage3.jpg", position: "object-[center_40%]" }
    ],
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
type ExperienceType = typeof EXPERIENCES[number] & { imgClass?: string, sideImages?: { src: string, position?: string }[] };

function CompanyLogo({ exp }: { exp: ExperienceType }) {
  return (
    <div
      className="w-16 h-16 rounded-xl shrink-0 overflow-hidden border border-steel/20 flex items-center justify-center relative max-lg:ml-0 lg:ml-[24px]"
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
        className={`w-full h-full object-contain p-4 relative z-10 ${exp.imgClass || ""}`}
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

      <main className="relative max-lg:pt-[clamp(120px,15vw,224px)] lg:pt-48 xl:pt-56 pb-32 min-h-screen lg:pl-[80px] lg:pr-[80px]">

        {/* ── Page Header (Top Left Aligned) ── */}
        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-24 sm:mb-48 lg:mb-64"
          >
            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              EXPERIENCE
            </h1>
            <div className="h-px bg-silver/15 w-16 mt-6" />
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          {/* ── Experience Entries ── */}
          <div className="relative">

            {/* Timeline vertical line (right side, desktop only) */}
            <div className="hidden lg:block absolute right-0 top-4 bottom-0 w-px bg-steel/10" />

            <div>
              {EXPERIENCES.map((exp, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{ marginBottom: i !== EXPERIENCES.length - 1 ? '120px' : '0px' }}
                >

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
                  <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:pr-8 xl:pr-16">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">

                      {/* Header: Logo + Info */}
                      <div className="flex max-lg:flex-col lg:flex-row items-start max-lg:gap-[clamp(12px,3vw,24px)] lg:gap-[24px]">
                        <CompanyLogo exp={exp} />

                        <div className="flex-1 min-w-0">
                          {/* Company + Date Row */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl sm:text-2xl tracking-tight leading-tight">
                                {exp.company}
                              </h3>
                              {exp.subtitle && (
                                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/35 text-xs mt-1 tracking-wide">
                                  {exp.subtitle}
                                </p>
                              )}
                            </div>
                            <span className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/40 tracking-[0.15em] whitespace-nowrap pt-1.5">
                              {exp.dateRange}
                            </span>
                          </div>

                          {/* Role + Location Row */}
                          <div className="flex items-start justify-between gap-4 mt-3">
                            <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-[15px]">
                              {exp.role}
                            </p>
                            <span className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/25 tracking-[0.15em] whitespace-nowrap">
                              {exp.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-steel/10 mt-8 sm:mt-10 mb-6 sm:mb-8 max-lg:ml-[clamp(0px,10vw,112px)] lg:ml-[112px]" />

                      {/* Bullet Points */}
                      <ul className="flex flex-col gap-6 sm:gap-8 lg:gap-10 max-lg:pl-[clamp(0px,10vw,112px)] lg:pl-[112px]">
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

                    {/* Right Side Images */}
                    {exp.sideImages && exp.sideImages.length > 0 && (
                      <div className="w-full lg:w-[35%] xl:w-[40%] flex flex-col gap-6 pt-4 lg:pt-0">
                        {exp.sideImages.map((img, idx) => (
                          <div key={idx} className="w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden border border-steel/12 bg-carbon relative">
                            <img src={img.src} alt={`${exp.company} image ${idx + 1}`} className={`w-full h-full object-cover ${'position' in img ? img.position : 'object-center'}`} />
                          </div>
                        ))}
                      </div>
                    )}
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
