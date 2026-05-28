"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CircuitBoard, Cpu, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

const SevenSegmentDisplay = dynamic(
  () => import("@/components/SevenSegmentDisplay"),
  { ssr: false, loading: () => (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="w-32 h-40 bg-iron/50 border border-steel/20 rounded-xl animate-pulse" />
      <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/25 tracking-widest">LOADING...</p>
    </div>
  )}
);

const TRUTH_TABLE = [
  { input: "001", dec: "1", a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  { input: "010", dec: "2", a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
  { input: "011", dec: "3", a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
  { input: "100", dec: "4", a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
  { input: "101", dec: "5", a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
  { input: "110", dec: "6", a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
];

export default function DicePageClient() {
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
                {["BOOLEAN LOGIC", "PCB", "SMD SOLDERING", "EAGLE"].map((tag) => (
                  <span key={tag} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/50 tracking-wider bg-steel/15 rounded-full px-4 py-1.5">{tag}</span>
                ))}
              </div>

              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
                DIGITAL DICE
              </h1>
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-base max-w-lg">
                Combinational logic circuit with 7-segment display output.
              </p>

              <div className="flex items-center gap-2 mt-8 bg-silver/5 border border-silver/10 rounded-full px-4 py-1.5 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-silver/30" />
                <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-widest">COMPLETED · 2025</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* INTERACTIVE DISPLAY */}
        <section className="py-28 sm:py-36 bg-void">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <div className="text-center mb-14">
                <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-4">
                  INTERACTIVE DEMO
                </h2>
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-sm">
                  Roll the dice — watch the 7-segment display decode the binary output.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="bg-iron/30 border border-steel/15 rounded-xl p-10 sm:p-14 max-w-lg mx-auto">
                <SevenSegmentDisplay />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* TRUTH TABLE */}
        <section className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-14">
                TRUTH TABLE
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="bg-iron/30 border border-steel/15 rounded-xl overflow-hidden max-w-3xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-steel/10">
                      <th className="p-4 text-left font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em]">BINARY</th>
                      <th className="p-4 text-left font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em]">DEC</th>
                      {["a", "b", "c", "d", "e", "f", "g"].map((seg) => (
                        <th key={seg} className="p-4 text-center font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em]">{seg}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TRUTH_TABLE.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="border-b border-steel/8 last:border-b-0"
                      >
                        <td className="p-4 font-[family-name:var(--font-space-mono-family)] text-chalk text-sm tracking-widest">{row.input}</td>
                        <td className="p-4 font-[family-name:var(--font-space-mono-family)] text-silver/60 text-sm">{row.dec}</td>
                        {[row.a, row.b, row.c, row.d, row.e, row.f, row.g].map((val, j) => (
                          <td key={j} className="p-4 text-center">
                            <span className={`font-[family-name:var(--font-space-mono-family)] text-sm ${val ? "text-chalk" : "text-steel/40"}`}>{val}</span>
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* DETAILS */}
        <section className="py-28 sm:py-36 border-t border-steel/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-14">
                DETAILS
              </h2>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: CircuitBoard, title: "PCB Design", desc: "Designed the PCB layout in EAGLE with boolean logic gates and 7-segment decoder." },
                { icon: Cpu, title: "SMD Assembly", desc: "Hand-soldered surface-mount components and validated each circuit stage systematically." },
                { icon: CheckCircle, title: "Testing", desc: "Verified circuit behavior against truth table outputs for all six dice states." },
              ].map((item, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="bg-iron/30 border border-steel/15 rounded-xl p-7 h-full">
                    <item.icon size={20} className="text-silver/35 mb-5" />
                    <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base mb-3">{item.title}</h3>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-sm leading-relaxed">{item.desc}</p>
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
