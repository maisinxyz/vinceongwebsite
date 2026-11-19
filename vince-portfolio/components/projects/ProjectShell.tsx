import { ArrowLeft, ArrowRight, Code, ExternalLink } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/primitives/Button";
import { DETAIL_SLUGS, getProject, projectHref, type ProjectLink, type ProjectSlug } from "@/lib/data/projects";

/* ═══════════════════════════════════════════════════
   PROJECT SHELL (CONTRACT 5)
   PageShell > header > screen (aspect reserved, no CLS) > description >
   unverified note > children > prev/next among DETAIL_SLUGS.
   Never prints "TODO(vince)": any value containing it is omitted, and
   `todo` items render only in development (prefix stripped).
   `children` render as direct children of <main>, so a <Band> works there.
   ═══════════════════════════════════════════════════ */
export type ProjectShellProps = {
  slug: ProjectSlug;
  screen: React.ReactNode;
  /** aria-label, default "<title> interactive demo" */
  screenLabel?: string;
  /** CSS aspect-ratio reserved before the screen loads, default "16 / 10" */
  screenAspect?: string;
  children?: React.ReactNode;
};

const TODO_MARK = "TODO(vince)";
/** A value we may print: present, non-blank, and not a TODO(vince) placeholder. */
export const isKnown = (v: string | undefined | null): v is string => !!v && v.trim() !== "" && !v.includes(TODO_MARK);
const known = (vs: readonly string[] | undefined) => (vs ?? []).filter(isKnown);

const LABEL = "font-[family-name:var(--font-space-mono-family)] text-[10px] uppercase tracking-[0.2em] text-subtle";
const MONO = "font-[family-name:var(--font-ibm-plex-mono-family)]";
const WRAP = "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12";

function LinkIcon({ kind }: { kind: ProjectLink["kind"] }) {
  return kind === "github" ? <Code strokeWidth={1.5} /> : <ExternalLink strokeWidth={1.5} />;
}

export function ProjectShell({ slug, screen, screenLabel, screenAspect = "16 / 10", children }: ProjectShellProps) {
  const p = getProject(slug);
  const title = isKnown(p.title) ? p.title : "Project";
  const when = isKnown(p.dateRange) ? p.dateRange : isKnown(p.year) ? p.year : null;
  const facts: { label: string; value: string | null }[] = [
    { label: "Status", value: p.status },
    { label: "When", value: when },
    { label: "Course", value: isKnown(p.course) ? p.course : null },
  ];
  const tags = known(p.tags);
  const links = p.links.filter((l) => isKnown(l.href) && isKnown(l.label));
  const description = known(p.description);
  const unverified = known(p.unverified);
  const todos = process.env.NODE_ENV === "development" ? (p.todo ?? []).map((t) => t.replace(/^\s*TODO\(vince\):?\s*/, "")) : [];

  const i = DETAIL_SLUGS.indexOf(slug);
  const prev = i > 0 ? getProject(DETAIL_SLUGS[i - 1]) : null;
  const next = i >= 0 && i < DETAIL_SLUGS.length - 1 ? getProject(DETAIL_SLUGS[i + 1]) : null;

  return (
    <PageShell>
      <header className={`${WRAP} pt-12 pb-10 sm:pt-16`}>
        <Button href="/projects" variant="link" leadingIcon={<ArrowLeft />} className="mb-10 text-xs text-subtle hover:text-silver">
          BACK TO PROJECTS
        </Button>

        {tags.length > 0 && (
          <ul aria-label="Tags" className="mb-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t} className={`${MONO} rounded-full bg-steel/15 px-4 py-1.5 text-[10px] tracking-wider text-silver`}>
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Scales down on narrow screens so a long word ("AUTONOMOUS") never overflows the column */}
        <h1 className="font-[family-name:var(--font-syne-family)] text-[clamp(1.25rem,calc(8vw-4px),2.25rem)] font-extrabold tracking-tight text-chalk sm:text-[clamp(2.25rem,calc(8vw-8px),3rem)] lg:text-6xl">
          {title}
        </h1>
        {isKnown(p.subtitle) && <p className={`${MONO} mt-3 text-base text-silver`}>{p.subtitle}</p>}

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <dt className={LABEL}>{f.label}</dt>
              {/* Unknown values show a muted placeholder, never the TODO text */}
              <dd className={`${MONO} text-sm ${f.value ? "text-chalk" : "text-subtle"}`}>
                {f.value ?? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Not yet available</span>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((l) => (
              <Button key={l.href} href={l.href} external size="sm" leadingIcon={<LinkIcon kind={l.kind} />}>
                {l.label}
              </Button>
            ))}
          </div>
        )}
      </header>

      <div className={WRAP}>
        <section
          aria-label={screenLabel ?? `${title} interactive demo`}
          data-project-screen
          className="relative w-full overflow-hidden rounded-2xl border border-steel bg-void"
          style={{ aspectRatio: screenAspect }}
        >
          {screen}
        </section>
      </div>

      {(description.length > 0 || unverified.length > 0 || todos.length > 0) && (
        <div className={`${WRAP} flex flex-col gap-10 py-16`}>
          {description.length > 0 && (
            <div className="flex max-w-3xl flex-col gap-5">
              {description.map((d, k) => (
                <p key={k} className={`${MONO} text-base leading-relaxed text-silver`}>
                  {d}
                </p>
              ))}
            </div>
          )}

          {unverified.length > 0 && (
            <aside aria-label="Reconstruction, unverified" className="max-w-3xl rounded-xl border border-dashed border-line-strong p-5">
              <p className={LABEL}>Reconstruction — unverified</p>
              <ul className={`${MONO} mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-silver`}>
                {unverified.map((u, k) => (
                  <li key={k}>{u}</li>
                ))}
              </ul>
            </aside>
          )}

          {todos.length > 0 && (
            <aside aria-label="Open questions (development only)" className="max-w-3xl rounded-xl border border-dashed border-danger p-5">
              <p className={LABEL}>Open questions for Vince · dev only</p>
              <ul className={`${MONO} mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-silver`}>
                {todos.map((t, k) => (
                  <li key={k}>{t}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}

      {children}

      {(prev || next) && (
        <nav aria-label="More projects" className={`${WRAP} flex flex-wrap items-center justify-between gap-4 border-t border-steel py-10`}>
          {prev ? (
            <Button href={projectHref(prev.slug) ?? "/projects"} variant="ghost" leadingIcon={<ArrowLeft />}>
              <span className="sr-only">Previous project: </span>
              {isKnown(prev.title) ? prev.title : "Previous project"}
            </Button>
          ) : (
            <span />
          )}
          {next && (
            <Button href={projectHref(next.slug) ?? "/projects"} variant="ghost" trailingIcon={<ArrowRight />}>
              <span className="sr-only">Next project: </span>
              {isKnown(next.title) ? next.title : "Next project"}
            </Button>
          )}
        </nav>
      )}
    </PageShell>
  );
}

export default ProjectShell;
