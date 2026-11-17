import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DETAIL_SLUGS, PROJECTS, getProject, projectHref } from "./projects";
import { experiences } from "./experience";
import { COURSES } from "./education";
import { RAIL } from "@/lib/site";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const slugs = new Set(PROJECTS.map((p) => p.slug));
const experienceIds = new Set(experiences.map((e) => e.id));

describe("projects", () => {
  it("has unique slugs", () => {
    expect(slugs.size).toBe(PROJECTS.length);
  });

  it("detail flag matches app/projects/<slug>/page.tsx", () => {
    for (const p of PROJECTS) {
      const exists = existsSync(join(ROOT, "app/projects", p.slug, "page.tsx"));
      expect(exists, `${p.slug}: detail=${p.detail} but page.tsx ${exists ? "exists" : "is missing"}`).toBe(p.detail);
    }
  });

  it("derives DETAIL_SLUGS and projectHref from the detail flag", () => {
    expect(DETAIL_SLUGS).toEqual(PROJECTS.filter((p) => p.detail).map((p) => p.slug));
    for (const p of PROJECTS) expect(projectHref(p.slug)).toBe(p.detail ? `/projects/${p.slug}` : null);
    expect(getProject("dice").slug).toBe("dice");
  });

  it("keeps list summaries to one line (≤ 90 chars)", () => {
    for (const p of PROJECTS) expect(p.summary.length, p.slug).toBeLessThanOrEqual(90);
  });

  it("marks every todo as TODO(vince)", () => {
    for (const p of PROJECTS) for (const t of p.todo ?? []) expect(t, p.slug).toMatch(/^TODO\(vince\): /);
  });
});

describe("cross references resolve", () => {
  it("project → experience", () => {
    for (const p of PROJECTS) for (const id of p.relatedExperience ?? []) expect(experienceIds.has(id), `${p.slug} → ${id}`).toBe(true);
  });
  it("experience → project", () => {
    for (const e of experiences) for (const s of e.relatedProjects ?? []) expect(slugs.has(s), `${e.id} → ${s}`).toBe(true);
  });
  it("course → project", () => {
    for (const c of COURSES) for (const s of c.relatedProjects ?? []) expect(slugs.has(s), `${c.code} → ${s}`).toBe(true);
  });
  it("experience ids are unique", () => {
    expect(experienceIds.size).toBe(experiences.length);
  });
});

describe("nav gutter", () => {
  it("styles/layout.css matches RAIL (tab width + hover grow)", () => {
    const css = readFileSync(join(ROOT, "styles/layout.css"), "utf8");
    expect(css).toContain(`--nav-gutter: ${RAIL.wide + RAIL.hoverGrow}px`);
    expect(css).toContain(`--nav-gutter: ${RAIL.narrow + RAIL.hoverGrow}px`);
  });
});

describe("no personal email in source (hard rule 4)", () => {
  const EMAIL = /[A-Za-z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|sfu)\./;

  // Wave-0 allowlist: files owned by other streams that still carry the address.
  // Each owner removes it in their wave (CONTRACT 4.2); qa deletes this list in wave 3.
  const PENDING_REMOVAL = new Set([
    "app/contact/ContactPageClient.tsx", // contact
    "app/card/CardPageClient.tsx", // theme-audit-2
    "app/portfolio-view/DynamicPortfolio.tsx", // theme-audit-2
    "app/page.tsx", // landing
  ]);

  function walk(dir: string): string[] {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  }

  it("app/, components/ and lib/ hold no address outside the allowlist", () => {
    const offenders = ["app", "components", "lib"]
      .flatMap((d) => walk(join(ROOT, d)))
      .filter((f) => /\.(tsx?|jsx?|mjs|css|json|md)$/.test(f))
      .map((f) => relative(ROOT, f).split(sep).join("/"))
      .filter((rel) => !PENDING_REMOVAL.has(rel) && EMAIL.test(readFileSync(join(ROOT, rel), "utf8")));
    expect(offenders).toEqual([]);
  });
});
