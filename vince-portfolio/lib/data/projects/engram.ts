import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx, lib/utils.ts (old PROJECTS) and SPEC E. Owner: proj-engram.
export const project: Project = {
  slug: "engram",
  title: "ENGRAM",
  category: "software",
  status: "ACTIVE",
  year: "2026",
  dateRange: "APRIL 2026 – PRESENT",
  summary: "B2B AI SaaS unifying workflow data using LLM persistent memory.",
  description: [
    "A B2B AI SaaS platform leveraging LLM-powered persistent memory to unify fragmented workflow data across enterprise systems. Built with RAG pipelines and full-stack TypeScript.",
    "Vince's part was the backend ingestion pipeline.",
  ],
  tags: ["TypeScript", "Python", "Supabase", "RAG", "LLM", "Next.js"],
  media: { kind: "video", src: "/Engramvideodemo.mp4", alt: "Engram demo video" },
  detail: true,
  links: [{ kind: "live", label: "Live site", href: "https://engram-pi-ruddy.vercel.app" }],
};
