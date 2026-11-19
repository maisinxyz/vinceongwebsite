import type { Metadata } from "next";
import { ProjectCategoryPage } from "@/components/projects/ProjectCategoryPage";
import { listedIn } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Software Projects — Vince Ong",
  description: `Software projects by Vince Ong: ${listedIn("software").map((p) => p.title).join(", ")}.`,
};

export default function SoftwareProjectsPage() {
  return <ProjectCategoryPage category="software" />;
}
