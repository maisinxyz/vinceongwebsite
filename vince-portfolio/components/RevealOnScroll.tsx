"use client";

import { type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  once?: boolean;
  amount?: number;
}

export default function RevealOnScroll({
  children,
  className = "",
}: RevealOnScrollProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
