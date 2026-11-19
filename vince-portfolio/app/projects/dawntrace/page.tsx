import type { Metadata } from "next";
import DawntracePageClient from "./DawntracePageClient";

export const metadata: Metadata = {
  title: "DAWNTRACE — Vince Ong",
  description: "DAWNTRACE: a sunrise-alarm sleep companion on Arduino with sensor fusion and EEPROM logging. Prototype photos and video.",
};

export default function DawntracePage() {
  return <DawntracePageClient />;
}
