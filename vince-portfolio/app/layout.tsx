import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono, Space_Mono, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AsciiEasterEgg from "@/components/AsciiEasterEgg";

/* ═══════════════════════════════════════════════════
   FONT LOADING
   Three typefaces loaded via next/font for zero FOUT
   ═══════════════════════════════════════════════════ */
const syne = Syne({
  variable: "--font-syne-family",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono-family",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono-family",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit-family",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-family",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/* ═══════════════════════════════════════════════════
   METADATA — SEO & Open Graph
   ═══════════════════════════════════════════════════ */
export const metadata: Metadata = {
  title: "Vince Ong — Mechatronic Systems Engineer",
  description:
    "Portfolio of Vince Ong, SFU Mechatronic Systems Engineering student. Embedded systems, AI SaaS, PCB design. Firmware. Systems. Products.",
  keywords: [
    "Mechatronic Engineer",
    "Embedded Systems",
    "PCB Design",
    "AI SaaS",
    "C++",
    "TypeScript",
    "Arduino",
    "Portfolio",
    "Vince Ong",
    "SFU",
  ],
  authors: [{ name: "Vince Ong" }],
  openGraph: {
    title: "Vince Ong — Engineering Portfolio",
    description: "Firmware. Systems. Products.",
    url: "https://vinceong.dev",
    siteName: "Vince Ong Portfolio",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

/* ═══════════════════════════════════════════════════
   ROOT LAYOUT
   ═══════════════════════════════════════════════════ */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ibmPlexMono.variable} ${spaceMono.variable} ${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-carbon text-chalk">
        <AsciiEasterEgg />
        {children}
      </body>
    </html>
  );
}
