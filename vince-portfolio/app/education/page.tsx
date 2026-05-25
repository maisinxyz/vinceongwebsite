import type { Metadata } from "next";
import EducationPageClient from "./EducationPageClient";

export const metadata: Metadata = {
  title: "Education — Vince Ong",
  description:
    "BASc Mechatronic Systems Engineering at Simon Fraser University. IB Diploma, BC Achievement Scholarship. 3.7 GPA.",
};

export default function EducationPage() {
  return <EducationPageClient />;
}
