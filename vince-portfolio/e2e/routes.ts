// The public routes (CONTRACT 6.1 lists them; it says "15" but names 17) and the audit
// viewports shared by every committed spec. Five detail routes do not exist until
// their streams add them in wave 1.
export const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/hardware",
  "/projects/software",
  "/projects/agv",
  "/projects/dawntrace",
  "/projects/spice",
  "/projects/dice",
  "/projects/racerbot",
  "/projects/yolox-sorting",
  "/projects/shape-sorting",
  "/projects/engram",
  "/projects/stardew-earth",
  "/experience",
  "/education",
  "/resume",
  "/contact",
  "/card",
  "/portfolio-view",
] as const;

export type Route = (typeof ROUTES)[number];

export const VIEWPORTS = [360, 768, 1280, 1920] as const;
