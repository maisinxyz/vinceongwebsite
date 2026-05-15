import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects — Vince Ong",
  description:
    "Engineering projects by Vince Ong: Engram AI SaaS, Automatic Spice Dispenser, Digital Dice. Embedded systems, full-stack software, PCB design.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
