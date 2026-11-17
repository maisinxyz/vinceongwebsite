import type { ReactNode } from "react";

/** One step on the education laptop's screen (CONTRACT 7: laptop owns this type, edu-content fills the steps). */
export type LaptopStep = { id: string; title: string; render: (p: { active: boolean }) => ReactNode };
