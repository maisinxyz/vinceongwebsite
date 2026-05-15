import type { Metadata } from "next";
import EngramPageClient from "./EngramPageClient";

export const metadata: Metadata = {
  title: "Engram — Vince Ong",
  description: "B2B AI SaaS platform for enterprise knowledge unification. TypeScript, Python, Supabase, RAG architecture.",
};

export default function EngramPage() {
  return <EngramPageClient />;
}
