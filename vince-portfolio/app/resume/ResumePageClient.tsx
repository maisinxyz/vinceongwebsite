"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export default function ResumePageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomedInFullscreen, setIsZoomedInFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        // Fallback if full screen is not supported
        window.open("/ResumeNew.pdf", "_blank");
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setIsZoomedInFullscreen(false); // Reset zoom to fully show when exiting fullscreen
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="min-h-screen bg-black text-chalk selection:bg-silver/30 selection:text-white pt-[250px] relative flex flex-col">
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 pb-24">
          <header className="mb-8 group/header relative">
            <div className="relative">
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-5xl sm:text-6xl tracking-tight uppercase">
                RESUME
              </h1>
              <div className="h-px bg-silver/15 w-24 mt-6" />
            </div>
          </header>

          <div className="w-full flex-1 flex flex-col items-center justify-start pb-10">
            {/* 
                Container is scaled to the exact aspect ratio of an 8.5x11 page when zoomed out.
            */}
            <div 
              ref={containerRef}
              className={`relative group bg-iron/5 border border-steel/15 shadow-sm overflow-hidden flex flex-col transition-all duration-300 mx-auto ${
                isFullscreen ? "w-full h-screen border-none rounded-none" : "aspect-[8.5/11] h-[75vh] max-w-full rounded-xl"
              }`}
            >
              {/* ESC text in top left during fullscreen */}
              {isFullscreen && (
                <div className="absolute top-4 left-4 z-20 pointer-events-none transition-opacity duration-300">
                  <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-white/60 bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10">
                    Press ESC to escape fullscreen
                  </span>
                </div>
              )}

              {/* Zoom Out Button during zoomed fullscreen */}
              {isFullscreen && isZoomedInFullscreen && (
                <button 
                  onClick={() => setIsZoomedInFullscreen(false)}
                  className="absolute top-4 right-8 z-20 flex items-center gap-2 bg-carbon/90 border border-steel/30 rounded-full px-4 py-2 shadow-xl backdrop-blur-md hover:bg-carbon transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-chalk" />
                  <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] tracking-wider text-chalk">
                    ZOOM OUT
                  </span>
                </button>
              )}

              <iframe 
                src={isZoomedInFullscreen ? "/ResumeNew.pdf#view=FitH" : "/ResumeNew.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit"} 
                className={`w-full h-full border-none bg-black ${isZoomedInFullscreen ? "" : "pointer-events-none"}`} 
                title="Resume PDF Viewer"
              />
              
              {/* Click overlay for full screen if NOT in fullscreen */}
              {!isFullscreen && (
                <div 
                  onClick={toggleFullscreen}
                  className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-300 flex items-center justify-center cursor-pointer z-10"
                >
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-3 bg-carbon/90 border border-steel/30 rounded-full px-6 py-3 shadow-xl backdrop-blur-md">
                    <Maximize2 className="w-5 h-5 text-chalk" />
                    <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.15em] text-chalk font-semibold">
                      CLICK TO FULL SCREEN
                    </span>
                  </div>
                </div>
              )}

              {/* Click overlay for zooming in if IN fullscreen but NOT zoomed */}
              {isFullscreen && !isZoomedInFullscreen && (
                <div 
                  onClick={() => setIsZoomedInFullscreen(true)}
                  className="absolute inset-0 bg-transparent flex items-center justify-center cursor-zoom-in z-10"
                >
                  {/* Invisible overlay just to catch clicks and show zoom-in cursor */}
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-3 bg-carbon/90 border border-steel/30 rounded-full px-6 py-3 shadow-xl backdrop-blur-md pointer-events-none">
                    <ZoomIn className="w-5 h-5 text-chalk" />
                    <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-xs tracking-[0.15em] text-chalk font-semibold">
                      CLICK TO ZOOM IN
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
