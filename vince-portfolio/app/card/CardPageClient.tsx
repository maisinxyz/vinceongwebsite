"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   INLINE SVG ICONS — no extra deps
   ═══════════════════════════════════════════════════ */
function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function MailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT LINKS
   ═══════════════════════════════════════════════════ */
const LINKS = [
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vince-ong-9a96a3371/",
  },
  {
    icon: MailIcon,
    label: "Email",
    href: "mailto:vinceong2020@gmail.com",
  },
  {
    icon: GitHubIcon,
    label: "Github",
    href: "https://github.com/maisinxyz",
  },
];

/* ═══════════════════════════════════════════════════
   CARD PAGE — full-viewport, mobile-first
   ═══════════════════════════════════════════════════ */
export default function CardPageClient() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      {/* ── Logo → Home ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
        }}
      >
        <Link href="/" aria-label="Back to home">
          <Image
            src="/icon.png"
            alt="Vince Ong logo"
            width={40}
            height={40}
            style={{
              opacity: 0.6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
          />
        </Link>
      </motion.div>
      {/* ── Business Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
        style={{
          width: "100%",
          maxWidth: "320px",
          backgroundImage: "url(/card-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "1px solid #3a3a3a",
          borderRadius: "16px",
          boxShadow:
            "0 4px 24px rgba(0, 0, 0, 0.6), 0 8px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "36px 28px 32px",
          gap: "0px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Photo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0, 0, 1] }}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #3a3a3a",
            boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
            flexShrink: 0,
            marginBottom: "20px",
          }}
        >
          <Image
            src="/blue-sweater-photo.png"
            alt="Vince Ong"
            width={120}
            height={120}
            priority
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </motion.div>

        {/* ── Name + Title with blur backdrop ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{
            background: "rgba(13, 13, 13, 0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "12px",
            padding: "14px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-syne-family), sans-serif",
              fontWeight: 700,
              fontSize: "22px",
              color: "#F2F2F0",
              letterSpacing: "-0.01em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Vince Ong
          </h1>

          <p
            style={{
              fontFamily: "var(--font-ibm-plex-mono-family), monospace",
              fontSize: "11px",
              color: "#A8A8A8",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              margin: "6px 0 0 0",
            }}
          >
            Mechatronic Systems Engineering
          </p>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0, 0, 1] }}
          style={{
            width: "48px",
            height: "1px",
            background: "#3a3a3a",
            margin: "24px 0",
            transformOrigin: "center",
          }}
        />

        {/* ── Contact Links ── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label !== "Email" ? "_blank" : undefined}
              rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.45 + i * 0.1,
                duration: 0.4,
                ease: [0.25, 0, 0, 1],
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                background: "#1A1A1A",
                border: "1px solid #2E2E2E",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#F2F2F0",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#555";
                el.style.background = "#222";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#2E2E2E";
                el.style.background = "#1A1A1A";
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border: "1px solid #2E2E2E",
                  color: "#A8A8A8",
                  flexShrink: 0,
                }}
              >
                <link.icon size={18} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex-mono-family), monospace",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                }}
              >
                {link.label}
              </span>
              {/* Arrow indicator */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: "auto", color: "#555", flexShrink: 0 }}
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
