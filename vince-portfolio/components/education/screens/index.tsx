import type { LaptopStep } from "@/components/education/types";
import { COURSES, PROGRAMS, RECOGNITIONS } from "@/lib/data/education";

/* ═══════════════════════════════════════════════════
   EDUCATION SCREENS (seed from foundation-core; edu-content owns it next)
   Plain renders of lib/data/education.ts for the laptop screen, using the
   device-screen-* tokens so they read in both themes.
   ═══════════════════════════════════════════════════ */
const heading = "font-[family-name:var(--font-syne-family)] font-bold text-[var(--device-screen-text)]";
const meta = "font-[family-name:var(--font-space-mono-family)] text-[11px] tracking-[0.15em] uppercase text-[var(--device-screen-muted)]";

export const EDUCATION_SCREENS: LaptopStep[] = [
  {
    id: "program",
    title: "Program",
    render: () => (
      <ul className="flex flex-col gap-4">
        {PROGRAMS.map((p) => (
          <li key={p.id}>
            <p className={`${heading} text-lg`}>{p.institution}</p>
            <p className="text-sm text-[var(--device-screen-text)]">
              {p.credential}
              {p.field ? `, ${p.field}` : ""}
            </p>
            <p className={meta}>
              {p.start} – {p.end}
            </p>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "recognitions",
    title: "Recognitions",
    render: () => (
      <ul className="flex flex-col gap-3">
        {RECOGNITIONS.map((r) => (
          <li key={r.name} className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-[var(--device-screen-text)]">{r.name}</span>
            <span className={meta}>{r.date}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "courses",
    title: "Coursework",
    render: () => (
      <ul className="grid gap-3 sm:grid-cols-2">
        {COURSES.map((c) => (
          <li key={c.code}>
            <p className={meta}>{c.code}</p>
            {c.title && <p className="text-sm text-[var(--device-screen-text)]">{c.title}</p>}
            <p className="text-xs text-[var(--device-screen-muted)]">{c.topics.join(" · ")}</p>
          </li>
        ))}
      </ul>
    ),
  },
];
