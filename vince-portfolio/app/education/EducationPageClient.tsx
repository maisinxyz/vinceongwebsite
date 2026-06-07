"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";

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
    logoContainerClass: "w-[140px] h-[56px] bg-[#A6192E] rounded-sm flex items-center justify-center p-2",
  },
  {
    institution: "International Baccalaureate",
    program: "IB Diploma Programme",
    major: "High School Education",
    dateRange: "Sept 2023 – Jul 2025",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/IB_LOGO.png",
    logoContainerClass: "w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center p-[2px]",
  },
];

const COURSEWORK = [
  {
    code: "ENSC 120",
    title: "Electronics Laboratory Instruments Operation and Measurement Techniques",
  },
  {
    code: "ENSC 151",
    title: "C++ Programming for Engineers",
  },
  {
    code: "ENSC 100",
    title: "Design Process & Design Lab",
  },
  {
    code: "MSE 112",
    title: "Python, Sensors, Actuators, and Data Acquisition Techniques",
  },
];

const AWARDS = [
  {
    title: "BC Achievement Scholarship",
    description: "Awarded by the Province of British Columbia in recognition of academic excellence and community leadership during secondary education.",
    date: "OCT 2025",
  },
  {
    title: "Rotary Club of Langley Scholarship",
    description: "Received the Annual Rotary Club of Langley Scholarship through an essay competition.",
    date: "2025",
  },
  {
    title: "Greg and Brad Follett Memorial Scholarship",
    description: "Received the Greg and Brad Follett Memorial Scholarship, awarded to a well-rounded student involved in their school.",
    date: "2025",
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

      <main className="min-h-screen bg-void text-chalk font-mono selection:bg-silver/30 selection:text-white pt-40 pb-40">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
          
          {/* HEADER SECTION */}
          <header className="mb-32">
            <h1 className="font-syne font-extrabold text-chalk text-6xl sm:text-7xl lg:text-8xl tracking-tight uppercase">
              EDUCATION
            </h1>
            <div className="h-px bg-silver/15 w-24 mt-8 mb-8" />
            <p className="text-silver/60 font-mono text-sm max-w-xl leading-[1.8] uppercase tracking-widest">
              Academic history, coursework & recognitions.
            </p>
          </header>

          <div className="flex flex-col gap-40">
            
            {/* ── DEGREES SECTION ── */}
            <section className="relative">
              {/* Technical Marker */}
              <div className="absolute -left-4 sm:-left-8 top-1 font-data text-[10px] text-silver/20 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                SECT. 01 — DEGREES
              </div>

              <h2 className="font-syne text-xl text-white mb-16 flex items-center gap-4">
                <span className="w-2 h-2 bg-silver/40 inline-block" />
                ACADEMIC BACKGROUND
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 relative">
                {EDUCATION.map((edu, idx) => (
                  <div key={edu.institution} className="group relative">
                    {/* Minimalist Top Border */}
                    <div className="h-[2px] w-12 bg-white/20 mb-8 transition-all duration-500 group-hover:w-full group-hover:bg-white/40" />
                    
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                      <div className={`shrink-0 ${edu.logoContainerClass} grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500`}>
                        <img
                          src={edu.logo}
                          alt={`${edu.institution} Logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-syne font-bold text-white text-2xl tracking-tight mb-2">
                          {edu.institution}
                        </h3>
                        <div className="font-data text-[11px] text-silver/40 tracking-[0.2em] mb-6">
                          {edu.dateRange}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-mono text-sm text-silver/80">
                            {edu.program}
                          </p>
                          <p className="font-mono text-xs text-silver/50">
                            {edu.major}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── COURSEWORK SECTION ── */}
            <section className="relative">
              <div className="absolute -left-4 sm:-left-8 top-1 font-data text-[10px] text-silver/20 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                SECT. 02 — CURRICULUM
              </div>

              <h2 className="font-syne text-xl text-white mb-16 flex items-center gap-4">
                <span className="w-2 h-2 bg-silver/40 inline-block" />
                RELEVANT COURSEWORK
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {COURSEWORK.map((course) => (
                  <div key={course.code} className="flex flex-col">
                    <div className="font-data text-white/90 text-xs tracking-[0.15em] mb-4 pb-4 border-b border-white/10">
                      {course.code}
                    </div>
                    <h4 className="font-mono text-[13px] text-silver/60 leading-relaxed uppercase">
                      {course.title}
                    </h4>
                  </div>
                ))}
              </div>
            </section>

            {/* ── AWARDS SECTION ── */}
            <section className="relative">
              <div className="absolute -left-4 sm:-left-8 top-1 font-data text-[10px] text-silver/20 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                SECT. 03 — AWARDS
              </div>

              <h2 className="font-syne text-xl text-white mb-16 flex items-center gap-4">
                <span className="w-2 h-2 bg-silver/40 inline-block" />
                RECOGNITIONS
              </h2>
              
              <div className="flex flex-col">
                <div className="hidden sm:grid grid-cols-12 gap-8 pb-6 border-b border-white/10 font-data text-[10px] text-silver/40 tracking-[0.2em]">
                  <div className="col-span-3">AWARD</div>
                  <div className="col-span-7">DESCRIPTION</div>
                  <div className="col-span-2 text-right">DATE</div>
                </div>

                {AWARDS.map((award) => (
                  <div
                    key={award.title}
                    className="group grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 py-8 sm:py-10 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="col-span-1 sm:col-span-3">
                      <h3 className="font-syne font-bold text-white text-lg leading-snug group-hover:text-silver transition-colors">
                        {award.title}
                      </h3>
                    </div>
                    <div className="col-span-1 sm:col-span-7">
                      <p className="font-mono text-sm text-silver/60 leading-[1.8]">
                        {award.description}
                      </p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex items-start sm:justify-end">
                      <span className="font-data text-[11px] text-silver/40 tracking-[0.2em]">
                        {award.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
