import type { ExperienceId } from "@/lib/data/experience";

export type ProjectSlug =
  | "dawntrace"
  | "spice"
  | "dice"
  | "racerbot"
  | "yolox-sorting"
  | "shape-sorting"
  | "engram"
  | "stardew-earth"
  | "cyberbug";
export type ProjectCategory = "hardware" | "software";
export type ProjectStatus = "COMPLETED" | "ACTIVE" | "IN PROGRESS";
export type CourseCode = "MSE 112" | "ENSC 151" | "ENSC 100" | "MSE 281" | "MSE 250" | "ENSC 120";

export interface ProjectLink {
  kind: "github" | "live" | "video" | "external";
  label: string;
  href: string;
}

export interface ProjectMedia {
  kind: "video" | "image" | "component" | "placeholder";
  src?: string;
  poster?: string;
  alt: string;
}

export interface Project {
  slug: ProjectSlug;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  dateRange?: string;
  course?: CourseCode;
  /** List card, one line, ≤ 90 chars. */
  summary: string;
  /** Detail page paragraphs. */
  description: string[];
  /** The list shows the first 3. */
  tags: string[];
  /** "component" only for dice (renders <DigitalDicePCB compact/>). */
  media: ProjectMedia;
  /** true ⇔ app/projects/<slug>/page.tsx exists (data.test.ts asserts). */
  detail: boolean;
  links: ProjectLink[];
  relatedExperience?: ExperienceId[];
  /** Shown as a "Reconstruction — unverified" note by ProjectShell. */
  unverified?: string[];
  /** TODO(vince) items, rendered only in development. */
  todo?: string[];
}
