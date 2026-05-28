"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cog, Code, LayoutGrid, Calendar, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

const SpiceDispenser3D = dynamic(
  () => import("@/components/SpiceDispenser3D"),
  { ssr: false, loading: () => (
    <div className="w-full aspect-[4/3] md:aspect-[16/10] bg-void border border-steel/15 rounded-xl flex items-center justify-center line-grid-bg">
      <div className="text-center">
        <div className="w-8 h-8 border border-silver/20 rounded-lg animate-spin mx-auto mb-3" style={{ animationDuration: "3s" }} />
        <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/25 tracking-widest">LOADING 3D ENGINE...</p>
      </div>
    </div>
  )}
);

const DETAILS = [
  { icon: Cog, title: "STEPPER MOTOR FIRMWARE", desc: "Precise C++ motor control with acceleration curves and micro-stepping for accurate spice dosing." },
  { icon: Code, title: "EMBEDDED CONTROL", desc: "Full state machine architecture for dispensing sequences, calibration routines, and error handling." },
  { icon: LayoutGrid, title: "3D-PRINTED DESIGN", desc: "Custom mechanical assemblies for dispensing mechanism, hopper, and enclosure with tight tolerances." },
  { icon: Calendar, title: "ONE SEMESTER", desc: "Complete system delivered Sept–Dec 2025: design, sourcing, assembly, testing, and documentation." },
];

export default function SpicePageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HERO */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-10">
              <Link href="/projects" className="group inline-flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-silver/40 hover:text-silver transition-colors">
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                BACK TO PROJECTS
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}>
              <div className="flex flex-wrap gap-2 mb-5">
                {["EMBEDDED SYSTEMS", "C++", "ARDUINO", "3D PRINTING"].map((tag) => (
                  <span key={tag} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/50 tracking-wider bg-steel/15 rounded-full px-4 py-1.5">{tag}</span>
                ))}
              </div>

              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
                AUTOMATIC SPICE<br />DISPENSER
              </h1>
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-base max-w-lg">
                Precision dispensing system with stepper motor firmware and 3D-printed mechanical assemblies.
              </p>

              <div className="flex items-center gap-2 mt-8 bg-silver/5 border border-silver/10 rounded-full px-4 py-1.5 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-silver/30" />
                <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-widest">COMPLETED · 2025</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3D MODEL */}
        <section className="py-12 sm:py-16 bg-void">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <SpiceDispenser3D />
            </RevealOnScroll>
          </div>
        </section>

        {/* DETAILS */}
        <section className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-14">
                DETAILS
              </h2>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-6">
              {DETAILS.map((item, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="bg-iron/30 border border-steel/15 rounded-xl p-7 sm:p-8 h-full">
                    <item.icon size={20} className="text-silver/35 mb-5" />
                    <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base mb-3">{item.title}</h3>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="py-28 sm:py-36 border-t border-steel/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-14">
                TECH STACK
              </h2>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { category: "FIRMWARE", items: ["C++ (Arduino)", "Stepper Motor Library", "State Machine Pattern", "Serial Debugging"] },
                { category: "MECHANICAL", items: ["3D Printing (FDM)", "Custom Enclosure", "Gravity Feed System", "Motor Mounting"] },
                { category: "MANAGEMENT", items: ["GANTT Scheduling", "Milestone Tracking", "Iterative Prototyping", "Documentation"] },
              ].map((col, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="bg-iron/30 border border-steel/15 rounded-xl p-7">
                    <h3 className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.25em] mb-5 pb-3 border-b border-steel/10">
                      {col.category}
                    </h3>
                    <ul className="space-y-3">
                      {col.items.map((item, j) => (
                        <TechItem key={j} label={item} delay={i * 0.1 + j * 0.06} />
                      ))}
                    </ul>
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

function TechItem({ label, delay }: { label: string; delay: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4, ease: [0.25, 0, 0, 1] }}
      className="flex items-center gap-3"
    >
      <Check size={13} className="text-silver/30 shrink-0" />
      <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/55 text-sm">{label}</span>
    </motion.li>
  );
}
