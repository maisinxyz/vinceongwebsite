"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════
   CARD DATA — Now with navigation hrefs
   ═══════════════════════════════════════════════════ */
const CARDS = [
  {
    suit: "♠",
    suitName: "spades",
    heading: "ABOUT ME",
    body: "A Mechatronic Systems Engineering student at SFU, building products that bridge hardware and software.",
    href: "/about",
  },
  {
    suit: "♥",
    suitName: "hearts",
    heading: "PROJECTS",
    body: "Embedded systems, AI SaaS platforms, and PCB design — from concept to functional prototype.",
    href: "/projects",
  },
  {
    suit: "♦",
    suitName: "diamonds",
    heading: "EXPERIENCE",
    body: "Finance & Dev Lead at MECH. Scaled assets by 250%. Co-founded Engram, an AI SaaS platform.",
    href: "/experience",
  },
  {
    suit: "♣",
    suitName: "clubs",
    heading: "EDUCATION",
    body: "BASc in Mechatronic Systems Engineering, Simon Fraser University (3.7 GPA). BC Achievement Scholarship.",
    href: "/education",
  },
];

const SUIT_COLOR = "#8a8a8a";

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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#131313]" />
      <div className="absolute inset-[5px] rounded-lg border border-silver/15" />
      <div className="absolute inset-[11px] rounded-md border border-silver/8" />

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

      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cardDiag" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="8" x2="8" y2="0" stroke="#A8A8A8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cardDiag)" />
      </svg>

      <SuitCorners suit={suit} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CARD FRONT — shows heading, body, and "TAP TO EXPLORE →" hint
   ═══════════════════════════════════════════════════ */
function CardFront({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="absolute inset-0 rounded-xl bg-black p-[6px]">
      <div className="relative w-full h-full rounded-lg border border-silver/30 flex flex-col items-center text-center px-3 py-4 overflow-hidden">
        
        <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base tracking-tight mb-2 shrink-0 mt-1">
          {heading}
        </h3>

        <div className="w-6 h-px bg-silver/30 mb-3 shrink-0 mx-auto" />

        <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col justify-center">
          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/70 leading-[1.8] tracking-[0.02em] m-0 p-0 text-balance">
            {body}
          </p>
        </div>

        {/* Navigation hint */}
        <div className="shrink-0 mt-2 pt-2 border-t border-silver/10 w-full">
          <p className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/30 tracking-[0.15em] animate-pulse">
            TAP TO EXPLORE →
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SINGLE CARD COMPONENT
   First click: flip. Second click (when flipped): navigate.
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
      className="cursor-pointer group w-full aspect-[2.5/3.5]"
      style={{ perspective: "1200px", maxWidth: "280px" }}
      onClick={onClick}
    >
      <div className="relative w-full h-full transition-all duration-300 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl border border-silver/15"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardBack suit={card.suit} />
          </div>

          <div
            className="absolute inset-0 rounded-xl border border-silver/15"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <CardFront heading={card.heading} body={card.body} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLAYING CARDS SECTION
   ═══════════════════════════════════════════════════ */
import { motion, useInView } from "framer-motion";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

export default function PlayingCards() {
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const router = useRouter();

  // Listen for tour reset event to unflip all cards
  useEffect(() => {
    function handleReset() {
      setFlippedIndices([]);
    }
    window.addEventListener("tour-reset-cards", handleReset);
    return () => window.removeEventListener("tour-reset-cards", handleReset);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (flippedIndices.includes(index)) {
      // Card is already flipped — navigate to its page
      router.push(CARDS[index].href);
    } else {
      // Flip the card
      setFlippedIndices(prev => [...prev, index]);
    }
  }, [flippedIndices, router]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-void flex flex-col items-center justify-center py-24 sm:py-32 overflow-hidden"
    >
      {isInView && <ParticleBackground />}

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
        className="relative z-10 font-[family-name:var(--font-syne-family)] font-extrabold text-chalk tracking-tight text-center mb-6"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
      >
        EXPLORE
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0, 0, 1] }}
        className="relative z-10 font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-xs tracking-[0.2em]"
        style={{ marginBottom: "80px" }}
      >
        FLIP A CARD · CLICK AGAIN TO ENTER
      </motion.p>

      {/* Row Layout — Desktop */}
      <div
        className="hidden sm:flex flex-row justify-center items-center gap-6 lg:gap-10 w-full max-w-7xl px-6 lg:px-12 relative z-10"
        style={{
          opacity: isInView ? 1 : 0,
          marginTop: "80px",
          transform: isInView ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
      >
        {CARDS.map((card, i) => (
          <div key={card.suitName} data-card-index={i} className="flex-1 flex justify-center w-full" style={{ zIndex: flippedIndices.includes(i) ? 10 : 1 }}>
            <Card card={card} isFlipped={flippedIndices.includes(i)} onClick={() => handleCardClick(i)} />
          </div>
        ))}
      </div>

      {/* Mobile Layout — 2×2 Grid */}
      <div
        className="sm:hidden grid grid-cols-2 gap-4 px-6 relative z-10 w-full max-w-md"
        style={{
          opacity: isInView ? 1 : 0,
          marginTop: "80px",
          transform: isInView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
      >
        {CARDS.map((card, i) => (
          <div key={card.suitName} data-card-index={i} className="flex justify-center w-full" style={{ zIndex: flippedIndices.includes(i) ? 10 : 1 }}>
            <Card card={card} isFlipped={flippedIndices.includes(i)} onClick={() => handleCardClick(i)} />
          </div>
        ))}
      </div>
    </section>
  );
}
