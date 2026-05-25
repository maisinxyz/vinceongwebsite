"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

const TIMELINE = [
  {
    company: "MECH",
    role: "Finance & Development Lead",
    dateRange: "Aug 2023 – Jul 2025",
    type: "LEADERSHIP",
    bullets: [
      "Co-led a government-recognized BC non-profit focused on health awareness through digital platforms and fundraising.",
      "Managed project timelines using GANTT scheduling, coordinated cross-functional teams, and oversaw financial growth of 250%.",
      "Developed organizational infrastructure — digital presence, communication pipelines, and event logistics.",
    ],
  },
  {
    company: "PNE (Pacific National Exhibition)",
    role: "Games Attendant",
    dateRange: "Aug 2025 – Sep 2025",
    type: "WORK",
    bullets: [
      "Operated high-traffic game stations, managing customer interactions and maintaining equipment reliability.",
      "Developed skills in fast-paced problem solving, public communication, and operational efficiency.",
    ],
  },
];

export default function ExperiencePageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HERO */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[18vw] text-silver/[0.03] leading-none ml-[-2vw]">
              EXP
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
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">003 — EXPERIENCE</p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                EXPERIENCE
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

        {/* TIMELINE */}
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="relative">
              <div className="absolute left-[9px] top-2 bottom-0 w-px bg-steel/15" />

              <div className="space-y-20">
                {TIMELINE.map((item, i) => (
                  <RevealOnScroll key={i} delay={i * 0.1}>
                    <div className="relative pl-14">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-2 w-[18px] h-[18px] rounded-full border-2 border-steel/25 bg-carbon flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === "LEADERSHIP" ? "bg-silver/50" : "bg-steel/50"
                        }`} />
                      </div>

                      <div className="bg-iron/30 border border-steel/15 rounded-xl p-8 sm:p-10">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl">{item.company}</h3>
                              <span className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/30 tracking-widest bg-steel/15 rounded-full px-3 py-0.5">{item.type}</span>
                            </div>
                            <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-sm">{item.role}</p>
                          </div>
                          <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-widest shrink-0">{item.dateRange.toUpperCase()}</span>
                        </div>

                        <ul className="space-y-4">
                          {item.bullets.map((bullet, j) => (
                            <li key={j} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-silver/20 mt-2 shrink-0" />
                              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-sm leading-relaxed">{bullet}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PLACEHOLDER — ADDITIONAL EXPERIENCES */}
        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <div className="border border-dashed border-steel/15 rounded-2xl py-16 px-10 text-center">
                <div className="w-10 h-10 mx-auto mb-5 border border-steel/15 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border border-steel/20 rounded-sm" />
                </div>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/20 tracking-[0.2em]">
                  ADDITIONAL EXPERIENCES / VOLUNTEER WORK
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
