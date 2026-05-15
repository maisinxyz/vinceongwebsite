import type { Metadata } from "next";
import ExperiencePageClient from "./ExperiencePageClient";

export const metadata: Metadata = {
  title: "Experience — Vince Ong",
  description: "Professional timeline — MECH non-profit leadership, PNE, and Simon Fraser University.",
};

export default function ExperiencePage() {
  return <ExperiencePageClient />;
}
