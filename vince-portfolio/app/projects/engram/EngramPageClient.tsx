"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Database, Brain, Search, Layers, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";
import Divider from "@/components/Divider";

const ARCHITECTURE_NODES = [
  { label: "Data Sources", desc: "Slack, Notion, Drive, Email", icon: Database, x: 10, y: 25 },
  { label: "Ingestion Pipeline", desc: "Semantic chunking & embedding", icon: Layers, x: 35, y: 25 },
  { label: "Vector Store", desc: "Supabase pgvector", icon: Database, x: 60, y: 25 },
  { label: "RAG Engine", desc: "Contextual retrieval + LLM", icon: Brain, x: 85, y: 25 },
  { label: "Search Interface", desc: "Natural language queries", icon: Search, x: 60, y: 70 },
];

const ROLE_HIGHLIGHTS = [
  { title: "Co-Founder & Engineer", desc: "Led technical architecture decisions and full-stack implementation from day one." },
  { title: "Data Pipeline Design", desc: "Built semantic data pipelines that transform fragmented enterprise knowledge into unified, queryable vectors." },
  { title: "RAG Architecture", desc: "Architected retrieval-augmented generation search interfaces for contextual, accurate answers." },
  { title: "Multi-Source Integration", desc: "Designed the knowledge base integration layer supporting multiple enterprise data connectors." },
];

export default function EngramPageClient() {
  const archRef = useRef<HTMLDivElement>(null);
  const archInView = useInView(archRef, { once: true, margin: "-100px" });

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
                {["TYPESCRIPT", "PYTHON", "SUPABASE", "RAG"].map((tag) => (
                  <span key={tag} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/50 tracking-wider bg-steel/15 rounded-full px-4 py-1.5">{tag}</span>
                ))}
              </div>

              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
                ENGRAM
              </h1>
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-base max-w-lg">
                B2B AI SaaS — LLM-powered enterprise memory.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <div className="flex items-center gap-2 bg-green-500/8 border border-green-500/15 rounded-full px-4 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/70 animate-pulse" />
                  <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-green-400/70 tracking-widest">ACTIVE</span>
                </div>
                <a
                  href="https://engram-pi-ruddy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-chalk text-void px-5 py-2.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-wider hover:bg-silver transition-colors"
                >
                  VISIT LIVE SITE
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ARCHITECTURE DIAGRAM */}
        <section className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-14">
                ARCHITECTURE
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div ref={archRef} className="bg-iron/30 border border-steel/15 rounded-xl p-8 sm:p-12 overflow-hidden">
                {/* Flow diagram */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {ARCHITECTURE_NODES.slice(0, 4).map((node, i) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={archInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.25, 0, 0, 1] }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 mx-auto mb-4 border border-steel/20 rounded-xl flex items-center justify-center bg-steel/10">
                        <node.icon size={20} className="text-silver/50" />
                      </div>
                      <h4 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-sm mb-1">{node.label}</h4>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/35 text-[10px]">{node.desc}</p>
                      {i < 3 && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={archInView ? { scaleX: 1 } : {}}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                          className="hidden md:block absolute right-0 top-1/2 w-8 h-px bg-silver/15 origin-left"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Connection arrows */}
                <div className="hidden md:flex items-center justify-center gap-1 -mt-8 mb-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={archInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                      className="flex items-center"
                      style={{ width: "20%" }}
                    >
                      <div className="h-px bg-silver/15 flex-1" />
                      <div className="w-1.5 h-1.5 rounded-full bg-silver/20" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* MY ROLE */}
        <section className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <RevealOnScroll>
              <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight mb-14">
                MY ROLE
              </h2>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-6">
              {ROLE_HIGHLIGHTS.map((item, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="bg-iron/30 border border-steel/15 rounded-xl p-7 sm:p-8 h-full">
                    <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base mb-3">
                      {item.title}
                    </h3>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-sm leading-relaxed">
                      {item.desc}
                    </p>
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
                { category: "FRONTEND", items: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"] },
                { category: "BACKEND", items: ["Supabase", "PostgreSQL", "pgvector", "Edge Functions"] },
                { category: "AI / ML", items: ["OpenAI API", "RAG Pipeline", "Semantic Embeddings", "Vector Search"] },
              ].map((col, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="bg-iron/30 border border-steel/15 rounded-xl p-7">
                    <h3 className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.25em] mb-5 pb-3 border-b border-steel/10">
                      {col.category}
                    </h3>
                    <ul className="space-y-3">
                      {col.items.map((item) => (
                        <li key={item} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-sm">{item}</li>
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
