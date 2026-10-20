"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ViewToggle from "@/components/ViewToggle";
import DynamicPortfolio from "./DynamicPortfolio";
import { Download } from "lucide-react";

export default function PortfolioPageClient() {
  const [viewMode, setViewMode] = useState<"dynamic" | "static">("dynamic");

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <CustomCursor />
      
      {/* Only show Navbar in dynamic mode */}
      <AnimatePresence>
        {viewMode === "dynamic" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="fixed inset-0 bg-black text-chalk selection:bg-silver/30 selection:text-white overflow-hidden flex flex-col">
        {/* Spacer for navbar (only in dynamic) */}
        {viewMode === "dynamic" && (
          <div className="h-16 sm:h-20 shrink-0" />
        )}

        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {viewMode === "dynamic" ? (
              <motion.div
                key="dynamic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
                className="absolute inset-0"
              >
                <DynamicPortfolio animated={true} />
              </motion.div>
            ) : (
              <motion.div
                key="static"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
                className="absolute inset-0 bg-black pt-8"
              >
                <DynamicPortfolio animated={false} />
                
                {/* Download Button overlay for Static View */}
                <button
                  onClick={handleDownload}
                  className="absolute top-10 right-10 z-[100] flex items-center gap-2 bg-iron/90 backdrop-blur-md border border-steel/50 text-chalk px-5 py-3 rounded-full hover:bg-white hover:text-black transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.5)] group force-system-cursor print:hidden"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
                  <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs font-bold tracking-wider">
                    DOWNLOAD PORTFOLIO
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Toggle — fixed at bottom center */}
      <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
    </>
  );
}
