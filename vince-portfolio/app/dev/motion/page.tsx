import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import MotionSandbox from "./MotionSandbox";

/* /dev/motion: one labelled demo per SPEC B row (CONTRACT 2.3/2.4).
   Development only: 404 in production builds. */
export const metadata: Metadata =
  process.env.NODE_ENV === "production" ? {} : { title: "Motion sandbox · dev", robots: { index: false, follow: false } };

export default function MotionSandboxPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <PageShell cursor={false}>
      <MotionSandbox />
    </PageShell>
  );
}
