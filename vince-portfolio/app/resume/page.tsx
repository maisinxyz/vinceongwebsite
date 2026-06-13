import type { Metadata } from "next";
import ResumePageClient from "./ResumePageClient";

export const metadata: Metadata = {
  title: "Resume — Vince Ong",
  description: "View my professional resume, experience, and qualifications.",
};

export default function ResumePage() {
  return <ResumePageClient />;
}
