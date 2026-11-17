import type { Project, ProjectSlug } from "./types";
import { project as dawntrace } from "./dawntrace";
import { project as spice } from "./spice";
import { project as dice } from "./dice";
import { project as shapeSorting } from "./shape-sorting";
import { project as yoloxSorting } from "./yolox-sorting";
import { project as stardewEarth } from "./stardew-earth";
import { project as racerbot } from "./racerbot";
import { project as engram } from "./engram";
import { project as cyberbug } from "./cyberbug";

export type * from "./types";

/** Fixed display order: hardware first, then software, newest first within each. */
export const PROJECTS: readonly Project[] = [
  dawntrace,
  spice,
  dice,
  shapeSorting,
  yoloxSorting,
  stardewEarth,
  racerbot,
  engram,
  cyberbug,
];

export const HARDWARE: readonly Project[] = PROJECTS.filter((p) => p.category === "hardware");
export const SOFTWARE: readonly Project[] = PROJECTS.filter((p) => p.category === "software");

const BY_SLUG = new Map<ProjectSlug, Project>(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: ProjectSlug): Project {
  const p = BY_SLUG.get(slug);
  if (!p) throw new Error(`Unknown project slug: ${slug}`);
  return p;
}

/** Detail route for a project, or null while it has no detail page. */
export function projectHref(slug: ProjectSlug): string | null {
  return getProject(slug).detail ? `/projects/${slug}` : null;
}

/** Slugs with a detail page, in display order (ProjectShell prev/next). */
export const DETAIL_SLUGS: readonly ProjectSlug[] = PROJECTS.filter((p) => p.detail).map((p) => p.slug);
