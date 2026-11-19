import type { Metadata } from "next";
import { ProjectCategoryPage } from "@/components/projects/ProjectCategoryPage";
import { listedIn } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Hardware Projects — Vince Ong",
  description: `Hardware projects by Vince Ong: ${listedIn("hardware").map((p) => p.title).join(", ")}.`,
};

export default function HardwareProjectsPage() {
  return <ProjectCategoryPage category="hardware" />;
}
