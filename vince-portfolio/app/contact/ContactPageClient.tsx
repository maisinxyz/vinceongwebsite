"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RevealOnScroll from "@/components/RevealOnScroll";

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "vinceong2020@gmail.com",
    href: "mailto:vinceong2020@gmail.com",
  },
  {
    icon: LinkedInIcon,
    label: "LINKEDIN",
    value: "Vince Ong",
    href: "https://www.linkedin.com/in/vince-ong-9a96a3371/",
  },
  {
    icon: GitHubIcon,
    label: "GITHUB",
    value: "maisinxyz",
    href: "https://github.com/maisinxyz",
  },
  {
    icon: MapPin,
    label: "LOCATION",
    value: "Vancouver, BC, Canada",
    href: null,
  },
];

export default function ContactPageClient() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormState("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }

    setTimeout(() => {
      if (formState !== "idle") setFormState("idle");
    }, 5000);
  };

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 sm:pt-32">
        {/* HERO */}
        <section className="py-32 sm:py-44 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
            <span className="font-[family-name:var(--font-syne-family)] font-extrabold text-[18vw] text-silver/[0.03] leading-none ml-[-2vw]">
              SAY HI
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
              className="space-y-5"
            >
              <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-4 py-1.5">
                <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.25em]">
                  004 — CONTACT
                </p>
              </div>
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                GET IN TOUCH
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0, 0, 1] }}
                className="h-px bg-silver/30 w-24 origin-left"
              />
              <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-base max-w-lg">
                Open to internships, co-ops, and collaborative projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FORM + INFO */}
        <section className="pb-32 sm:pb-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
              {/* Form (3 cols) */}
              <RevealOnScroll className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="bg-iron/30 border border-steel/15 rounded-xl p-8 sm:p-10 space-y-6">
                  <div>
                    <label htmlFor="name" className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.2em] block mb-3">
                      NAME
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-steel/10 border border-steel/20 rounded-lg px-5 py-3.5 font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-sm placeholder-silver/20 focus:border-silver/30 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.2em] block mb-3">
                      EMAIL
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-steel/10 border border-steel/20 rounded-lg px-5 py-3.5 font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-sm placeholder-silver/20 focus:border-silver/30 focus:outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-[0.2em] block mb-3">
                      MESSAGE
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-steel/10 border border-steel/20 rounded-lg px-5 py-3.5 font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-sm placeholder-silver/20 focus:border-silver/30 focus:outline-none transition-colors resize-none"
                      placeholder="Tell me about the opportunity..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === "sending" || formState === "sent"}
                    className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-lg font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider transition-all duration-200 ${
                      formState === "sent"
                        ? "bg-green-500/20 border border-green-500/30 text-green-400"
                        : formState === "error"
                        ? "bg-red-500/20 border border-red-500/30 text-red-400"
                        : "bg-chalk text-void hover:bg-silver"
                    }`}
                  >
                    {formState === "sending" && <><Loader2 size={14} className="animate-spin" /> SENDING...</>}
                    {formState === "sent" && <><CheckCircle size={14} /> MESSAGE SENT</>}
                    {formState === "error" && "ERROR — TRY AGAIN"}
                    {formState === "idle" && "SEND MESSAGE"}
                  </button>
                </form>
              </RevealOnScroll>

              {/* Contact cards (2 cols) */}
              <RevealOnScroll delay={0.15} className="lg:col-span-2">
                <div className="space-y-4">
                  {CONTACT_INFO.map((info) => {
                    const Inner = (
                      <div className="group bg-iron/30 border border-steel/15 rounded-xl p-6 flex items-start gap-5 hover:border-silver/20 transition-all duration-200">
                        <div className="w-10 h-10 border border-steel/20 rounded-lg flex items-center justify-center shrink-0 group-hover:border-silver/25 transition-colors">
                          <info.icon size={16} className="text-silver/40 group-hover:text-silver/60 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/30 tracking-[0.2em] block mb-1">
                            {info.label}
                          </span>
                          <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-sm truncate block">
                            {info.value}
                          </span>
                        </div>
                        {info.href && (
                          <ArrowUpRight size={14} className="text-silver/20 shrink-0 ml-auto group-hover:text-silver/50 transition-colors" />
                        )}
                      </div>
                    );

                    if (info.href) {
                      return (
                        <a
                          key={info.label}
                          href={info.href}
                          target={info.label !== "EMAIL" ? "_blank" : undefined}
                          rel={info.label !== "EMAIL" ? "noopener noreferrer" : undefined}
                        >
                          {Inner}
                        </a>
                      );
                    }

                    return <div key={info.label}>{Inner}</div>;
                  })}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
