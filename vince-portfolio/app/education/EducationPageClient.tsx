"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { Activity, PenTool, Database } from "lucide-react";

/* ═══════════════════════════════════════════════════
   EDUCATION DATA
   ═══════════════════════════════════════════════════ */
const EDUCATION = [
  {
    institution: "Simon Fraser University",
    program: "Bachelors of Applied Science",
    major: "Mechatronic Systems Engineering",
    dateRange: "Sept 2025 – Aug 2029",
    logo: "/logos/sfu.png",
    logoContainerClass: "w-[120px] h-[48px] bg-[#A6192E] rounded-sm flex items-center justify-center p-1.5",
  },
  {
    institution: "International Baccalaureate",
    program: "IB Diploma Programme",
    major: "High School Education",
    dateRange: "Sept 2023 – Jul 2025",
    logo: "/logos/ib.png",
    logoContainerClass: "w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center p-[1.5px]",
  },
];

const COURSEWORK = [
  {
    code: "ENSC 120",
    title: "Electronics Laboratory Instruments Operation and Measurement Techniques",
    logo: null,
    icon: <Activity className="w-6 h-6 text-silver/60" />,
  },
  {
    code: "ENSC 151",
    title: "C++ Programming for Engineers",
    logo: null,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-silver/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 15A3.5 3.5 0 1 1 10 9" />
        <path d="M14 12h3" />
        <path d="M15.5 10.5v3" />
        <path d="M18.5 12h3" />
        <path d="M20 10.5v3" />
      </svg>
    ),
  },
  {
    code: "ENSC 100",
    title: "Design Process & Design Lab",
    logo: null,
    icon: <PenTool className="w-6 h-6 text-silver/60" />,
  },
  {
    code: "MSE 112",
    title: "Python, Sensors, Actuators, and Data Acquisition Techniques",
    logo: null,
    icon: <Database className="w-6 h-6 text-silver/60" />,
  },
];

const AWARDS = [
  {
    title: "BC Achievement Scholarship",
    description: "Awarded by the Province of British Columbia in recognition of academic excellence and community leadership during secondary education.",
    date: "OCT 2025",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/21/BC_Government_Logo.svg",
    logoBg: "#003366",
    logoInitials: "BC",
  },
  {
    title: "Rotary Club of Langley Scholarship",
    description: "Received the Annual Rotary Club of Langley Scholarship through an essay competition.",
    date: "2025",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Rotary_International_Logo.svg",
    logoBg: "#005baa",
    logoInitials: "RC",
  },
  {
    title: "Greg and Brad Follett Memorial Scholarship",
    description: "Received the Greg and Brad Follett Memorial Scholarship, awarded to a well-rounded student involved in their school.",
    date: "2025",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/School_icon_-_The_Noun_Project.svg",
    logoBg: "#8b0000",
    logoInitials: "REM",
  },
];

/* ═══════════════════════════════════════════════════
   MAIN PAGE - Ultra Premium Editorial Engineering Layout
   ═══════════════════════════════════════════════════ */
export default function EducationPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="min-h-screen text-chalk selection:bg-silver/30 selection:text-white pt-40 pb-40 relative">
        {/* Background image */}
        <div
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/stickerpage.png')" }}
        />
        {/* Dark overlay — lets colours bleed through while keeping text readable */}
        <div className="fixed inset-0 w-full h-full bg-black/60" />

        {/* All page content sits above the background */}
        <div className="relative z-10">
        {/* ── Page Header ── */}
        <div className="max-w-[1400px] mx-auto px-10 sm:px-16 lg:px-24">
          <header className="mb-24 sm:mb-32">
            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight uppercase">
              EDUCATION
            </h1>
            <div className="h-px bg-silver/15 w-24 mt-8 mb-8" />
            <p className="text-silver/60 font-[family-name:var(--font-ibm-plex-mono-family)] text-sm max-w-xl leading-[1.8] uppercase tracking-widest">
              Academic history, coursework & recognitions.
            </p>
          </header>
        </div>

        <div className="max-w-[1400px] mx-auto px-10 sm:px-16 lg:px-24 h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 w-full">
            <div className="lg:col-span-11 lg:col-start-2 flex flex-col gap-24 pl-16 sm:pl-32 md:pl-48 lg:pl-48 xl:pl-64">
            
            {/* ── DEGREES SECTION ── */}
            <section className="relative">
              {/* Technical Marker */}
              <div className="hidden sm:block absolute left-[-60px] md:left-[-100px] top-1 font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/20 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                SECT. 01 — DEGREES
              </div>

              <div className="inline-flex items-center border border-steel/15 bg-iron/5 px-6 py-3 rounded-lg mb-16 shadow-sm">
                <span className="w-2 h-2 bg-silver/40 inline-block mr-4" />
                <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-xl sm:text-2xl tracking-tight uppercase">
                  ACADEMIC BACKGROUND
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 relative">
                {EDUCATION.map((edu) => (
                  <div key={edu.institution} className="group relative">
                    {/* Minimalist Top Border */}
                    <div className="h-[2px] w-12 bg-white/20 mb-8 transition-all duration-500 group-hover:w-full group-hover:bg-white/40" />
                    
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                      <div className={`shrink-0 ${edu.logoContainerClass}`}>
                        <img
                          src={edu.logo}
                          alt={`${edu.institution} Logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-white text-2xl tracking-tight mb-2">
                          {edu.institution}
                        </h3>
                        <div className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/40 tracking-[0.2em] mb-6">
                          {edu.dateRange}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-sm text-silver/80">
                            {edu.program}
                          </p>
                          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-silver/50">
                            {edu.major}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── COURSEWORK & AWARDS SECTION (2-COL TEXTBOX LAYOUT) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-stretch mt-12 relative">
              
              {/* Technical Marker */}
              <div className="hidden sm:block absolute left-[-60px] md:left-[-100px] top-1 font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/20 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                SECT. 02 — HIGHLIGHTS
              </div>

              {/* COURSEWORK TEXTBOX */}
              <section className="relative h-full">
                <div className="inline-flex items-center border border-steel/15 bg-iron/5 px-6 py-3 rounded-lg mb-10 shadow-sm">
                  <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-xl sm:text-2xl tracking-tight">
                    Relevant Coursework
                  </h2>
                </div>

                <div className="flex flex-col rounded-xl border border-steel/15 overflow-hidden bg-iron/5 shadow-sm">
                  {COURSEWORK.map((course, index) => (
                    <div key={course.code} className={`flex items-start gap-6 group p-6 sm:p-8 hover:bg-white/[0.02] transition-colors ${index !== COURSEWORK.length - 1 ? 'border-b border-steel/15' : ''}`}>
                      <div className="w-12 h-12 rounded-lg bg-carbon border border-steel/20 flex items-center justify-center shrink-0 overflow-hidden relative">
                        {course.logo ? (
                           <img src={course.logo} alt={course.code} className="w-full h-full object-contain p-2" />
                        ) : (
                           course.icon
                        )}
                      </div>
                      <div className="flex-1 mt-1">
                        <div className="font-[family-name:var(--font-syne-family)] font-bold text-white text-[16px] leading-snug mb-1">
                          {course.code}
                        </div>
                        <h4 className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[12px] text-silver/50 leading-[1.8] uppercase">
                          {course.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECOGNITIONS TEXTBOX */}
              <section className="relative h-full">
                <div className="inline-flex items-center border border-steel/15 bg-iron/5 px-6 py-3 rounded-lg mb-10 shadow-sm">
                  <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-xl sm:text-2xl tracking-tight">
                    Recognitions
                  </h2>
                </div>
                
                <div className="flex flex-col rounded-xl border border-steel/15 overflow-hidden bg-iron/5 shadow-sm">
                  {AWARDS.map((award, index) => (
                    <div key={award.title} className={`flex items-start gap-6 group p-6 sm:p-8 hover:bg-white/[0.02] transition-colors ${index !== AWARDS.length - 1 ? 'border-b border-steel/15' : ''}`}>
                      <div 
                        className="w-12 h-12 rounded-lg bg-carbon border border-steel/20 flex items-center justify-center shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: award.logoBg }}
                      >
                        <span className="text-white/80 text-[9px] font-bold tracking-wider absolute">
                          {award.logoInitials}
                        </span>
                        <img 
                          src={award.logo} 
                          alt={award.title} 
                          className="w-full h-full object-contain p-2 relative z-10" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <div className="flex items-start justify-between gap-4 mb-2.5">
                          <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-white text-[16px] leading-snug">
                            {award.title}
                          </h3>
                          <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-[0.2em] whitespace-nowrap pt-1">
                            {award.date}
                          </span>
                        </div>
                        <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[12px] text-silver/50 leading-[1.8]">
                          {award.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
      </div>
    </main>

      <Footer />
    </>
  );
}
