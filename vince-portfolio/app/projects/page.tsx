import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects — Vince Ong",
  description:
    "Engineering projects by Vince Ong — Hardware: Autonomous Ground Vehicle, DAWNTRACE, Automatic Spice Dispenser, Digital Dice. Software: SFU Racerbot, Engram AI SaaS. Robotics, embedded systems, full-stack development.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
