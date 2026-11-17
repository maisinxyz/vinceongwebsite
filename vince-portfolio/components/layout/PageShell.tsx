import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   PAGE SHELL (CONTRACT 3.3, 3.4)
   Every page renders this instead of importing Navbar / Footer / CustomCursor.
   <main> starts at the gutter, so page content needs nothing extra.
   ═══════════════════════════════════════════════════ */
export type PageShellProps = {
  children: React.ReactNode;
  footer?: boolean;
  cursor?: boolean;
  /** "nav" pads below the fixed Navbar; "none" for heroes that sit under it. */
  top?: "nav" | "none";
  /** Applied to <main>. */
  className?: string;
};

export default function PageShell({ children, footer = true, cursor = true, top = "nav", className }: PageShellProps) {
  return (
    <>
      {cursor && <CustomCursor />}
      <Navbar />
      <main id="main" className={cn("relative flex-1 pl-gutter gutter-anim", top === "nav" && "pt-nav-top", className)}>
        {children}
      </main>
      {footer && <Footer />}
    </>
  );
}
