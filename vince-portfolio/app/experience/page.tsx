import type { Metadata } from "next";
import ExperiencePageClient from "./ExperiencePageClient";

export const metadata: Metadata = {
  title: "Experience — Vince Ong",
  description: "Engineering, technology, and community leadership experience at EY, Resilient Privacy, SFU Racerbot, TELUS Digital AI, and MECH.",
};

export default function ExperiencePage() {
  return <ExperiencePageClient />;
}
