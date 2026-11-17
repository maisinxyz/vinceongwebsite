import type { Metadata, Viewport } from "next";
import "./globals.css";
import AsciiEasterEgg from "@/components/AsciiEasterEgg";
import SideNav from "@/components/SideNav";
import Providers from "@/components/Providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/react";

/* ═══════════════════════════════════════════════════
   FONT LOADING
   Loaded via Google Fonts CDN to ensure reliability
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   VIEWPORT — responsive & iOS safe areas
   theme-color is NOT set here: Next would emit its own meta in an order we
   don't control. The <head> below carries it, before the theme script.
   ═══════════════════════════════════════════════════ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        {/* Meta before the script so the script can find it. Default dark; system preference is ignored.
            itemProp makes React 19 treat it as a plain element instead of a hoistable: a hoistable
            <meta> is matched by its `content`, which the script has already changed, so React would
            append a second, stale theme-color meta during hydration. */}
        <meta name="theme-color" content="#0D0D0D" itemProp="theme-color" suppressHydrationWarning />
        {/* Blocking inline script: sets data-theme before first paint (no flash). Not next/script. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-carbon text-chalk">
        <Providers>
          <AsciiEasterEgg />
          <SideNav />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
