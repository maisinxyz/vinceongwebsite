import type { Metadata } from "next";
import "./globals.css";
import AsciiEasterEgg from "@/components/AsciiEasterEgg";
import { Analytics } from "@vercel/analytics/next";

/* ═══════════════════════════════════════════════════
   FONT LOADING
   Loaded via Google Fonts CDN to ensure reliability
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   METADATA — SEO & Open Graph
   ═══════════════════════════════════════════════════ */
export const metadata: Metadata = {
  title: "Vince Ong",
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
      className="h-full antialiased font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-carbon text-chalk">
        <AsciiEasterEgg />
        {children}
        <Analytics /> {/* Added the Analytics component here */}
      </body>
    </html>
  );
}