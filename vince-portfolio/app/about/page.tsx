import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About — Vince Ong",
  description:
    "Mechatronic Systems Engineering student at SFU. Embedded systems, AI SaaS co-founder, hardware-software bridge builder. 3.7 GPA.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
