"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   CARD DATA
   ═══════════════════════════════════════════════════ */
const CARDS = [
  {
    suit: "♠",
    suitName: "spades",
    heading: "ABOUT ME",
    body: "A Mechatronic Systems Engineering student at SFU, building products that bridge hardware and software. I thrive at the intersection of mechanical precision and digital innovation.",
  },
  {
    suit: "♥",
    suitName: "hearts",
    heading: "SKILLS",
    body: "Proficient in C++, Python, and TypeScript. Experienced in embedded systems, PCB design (EAGLE), 3D printing, and full-stack development with React & Supabase.",
  },
  {
    suit: "♦",
    suitName: "diamonds",
    heading: "EXPERIENCE",
    body: "Finance & Dev Lead at MECH. Scaled assets by 250%. Co-founded Engram, an AI SaaS platform with semantic search pipelines.",
  },
  {
    suit: "♣",
    suitName: "clubs",
    heading: "EDUCATION",
    body: "BASc in Mechatronic Systems Engineering, Simon Fraser University (3.7 GPA). Recipient of the BC Achievement Scholarship.",
  },
];

const SUIT_COLOR = "#8a8a8a"; // Changed to grey to match theme

/* ═══════════════════════════════════════════════════
   SUIT CORNERS — top-left and bottom-right (rotated 180)
   ═══════════════════════════════════════════════════ */
function SuitCorners({ suit }: { suit: string }) {
  return (
    <>
      <span
        className="absolute top-2.5 left-3 leading-none select-none"
        style={{ color: SUIT_COLOR, fontSize: "1.3rem", fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {suit}
      </span>
      <span
        className="absolute bottom-2.5 right-3 leading-none select-none"
        style={{
          color: SUIT_COLOR,
          fontSize: "1.3rem",
          fontFamily: "Georgia, 'Times New Roman', serif",
          transform: "rotate(180deg)",
        }}
      >
        {suit}
      </span>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   CARD BACK
   ═══════════════════════════════════════════════════ */
function CardBack({ suit }: { suit: string }) {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#131313]" />

      {/* Outer border */}
      <div className="absolute inset-[5px] rounded-lg border border-silver/15" />

      {/* Inner border */}
      <div className="absolute inset-[11px] rounded-md border border-silver/8" />

      {/* Center ornament */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-silver/20 text-sm">✦</div>
          <div className="grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-[5px] h-[5px] rotate-45 border border-silver/15"
                style={{
                  backgroundColor: i === 4 ? "rgba(168,168,168,0.12)" : "transparent",
                }}
              />
            ))}
          </div>
          <div className="text-silver/20 text-sm">✦</div>
        </div>
      </div>

      {/* Diagonal pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cardDiag" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="8" x2="8" y2="0" stroke="#A8A8A8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cardDiag)" />
      </svg>

      {/* Suit corners */}
      <SuitCorners suit={suit} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CARD FRONT
   ═══════════════════════════════════════════════════ */
function CardFront({ heading, body }: { suit: string; heading: string; body: string }) {
  return (
    <div className="absolute inset-0 rounded-xl bg-black p-[6px]">
      {/* Grey Outline acts as the main container */}
      <div className="relative w-full h-full rounded-lg border border-silver/30 flex flex-col items-center text-center px-3 py-4 overflow-hidden">
        
        {/* Heading */}
        <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base tracking-tight mb-2 shrink-0 mt-1">
          {heading}
        </h3>

        {/* Divider */}
        <div className="w-6 h-px bg-silver/30 mb-3 shrink-0 mx-auto" />

        {/* Body text (scrollable if necessary) */}
        <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col justify-center">
          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/70 leading-[1.8] tracking-[0.02em] m-0 p-0 text-balance">
            {body}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SINGLE CARD COMPONENT
   Pure onClick flip, CSS 3D, no hover gating.
   ═══════════════════════════════════════════════════ */
function Card({
  card,
  isFlipped,
  onClick,
}: {
  card: (typeof CARDS)[0];
  isFlipped: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="cursor-pointer group"
      style={{ perspective: "1000px", width: "180px", height: "260px" }}
      onClick={onClick}
    >
      {/* Hover Lift Layer */}
      <div className="relative w-full h-full transition-all duration-300 group-hover:-translate-y-2 group-hover:drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]">
        {/* 3D Flip Layer */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Back face (default visible) */}
          <div
            className="absolute inset-0 rounded-xl border border-silver/15"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardBack suit={card.suit} />
          </div>

          {/* Front face (hidden until flipped) */}
          <div
            className="absolute inset-0 rounded-xl border border-silver/15"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <CardFront suit={card.suit} heading={card.heading} body={card.body} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLAYING CARDS SECTION
   - Simple rise animation for heading
   - Diamond layout with shifted down spacing
   - Cards reveal on scroll
   ═══════════════════════════════════════════════════ */
import { motion, useInView } from "framer-motion";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

export default function PlayingCards() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleCardClick = useCallback((index: number) => {
    setFlippedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-void flex flex-col items-center justify-center py-24 sm:py-32 overflow-hidden"
    >
      {/* ── Background Layer ── */}
      {isInView && <ParticleBackground />}

      {/* ── ABOUT ME Heading with simple rise animation ── */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
        className="relative z-10 font-[family-name:var(--font-syne-family)] font-extrabold text-chalk tracking-tight text-center mb-6"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
      >
        ABOUT ME
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0, 0, 1] }}
        className="relative z-10 font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-xs tracking-[0.2em] mb-12"
      >
        CLICK A CARD TO REVEAL
      </motion.p>

      {/* ── Diamond Layout — Desktop ── */}
      <div
        className="hidden sm:block relative mt-20 z-10"
        style={{
          width: "604px",
          height: "552px",
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
      >
        {/* Top card */}
        <div
          className="absolute"
          style={{ left: "212px", top: "0px", zIndex: flippedIndex === 0 ? 10 : 1 }}
        >
          <Card card={CARDS[0]} isFlipped={flippedIndex === 0} onClick={() => handleCardClick(0)} />
        </div>

        {/* Left card */}
        <div
          className="absolute"
          style={{ left: "0px", top: "146px", zIndex: flippedIndex === 1 ? 10 : 1 }}
        >
          <Card card={CARDS[1]} isFlipped={flippedIndex === 1} onClick={() => handleCardClick(1)} />
        </div>

        {/* Right card */}
        <div
          className="absolute"
          style={{ left: "424px", top: "146px", zIndex: flippedIndex === 2 ? 10 : 1 }}
        >
          <Card card={CARDS[2]} isFlipped={flippedIndex === 2} onClick={() => handleCardClick(2)} />
        </div>

        {/* Bottom card */}
        <div
          className="absolute"
          style={{ left: "212px", top: "292px", zIndex: flippedIndex === 3 ? 10 : 1 }}
        >
          <Card card={CARDS[3]} isFlipped={flippedIndex === 3} onClick={() => handleCardClick(3)} />
        </div>
      </div>

      {/* ── Mobile Layout — 2×2 Grid ── */}
      <div
        className="sm:hidden grid grid-cols-2 gap-4 px-6 mt-8 relative z-10"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
      >
        {CARDS.map((card, i) => (
          <div key={card.suitName} className="flex justify-center" style={{ zIndex: flippedIndex === i ? 10 : 1 }}>
            <Card card={card} isFlipped={flippedIndex === i} onClick={() => handleCardClick(i)} />
          </div>
        ))}
      </div>

      {/* ── Hover keyframes (injected once) ── */}
      <style>{`
        .card-wrapper:hover > div {
          transform: translateY(-6px);
          filter: drop-shadow(0 16px 32px rgba(0,0,0,0.5));
        }
        .card-wrapper:hover > div[style*="rotateY(180deg)"] {
          transform: rotateY(180deg) translateY(-6px);
        }
      `}</style>
    </section>
  );
}
