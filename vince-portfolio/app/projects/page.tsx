import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects — Vince Ong",
  description:
    "Engineering projects by Vince Ong — Hardware: DAWNTRACE, Automatic Spice Dispenser, Digital Dice. Software: Engram AI SaaS. Embedded systems, full-stack development, PCB design.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
