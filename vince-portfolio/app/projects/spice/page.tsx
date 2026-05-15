import type { Metadata } from "next";
import SpicePageClient from "./SpicePageClient";

export const metadata: Metadata = {
  title: "Automatic Spice Dispenser — Vince Ong",
  description:
    "Interactive 3D model viewer of an automatic spice dispensing system. C++, Arduino, stepper motors, 3D printing.",
};

export default function SpicePage() {
  return <SpicePageClient />;
}
