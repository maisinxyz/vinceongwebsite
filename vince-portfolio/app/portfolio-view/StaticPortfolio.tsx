"use client";

import { useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react";

export default function StaticPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomedInFullscreen, setIsZoomedInFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          window.open("/ResumeNew.pdf", "_blank");
        });
      } else {
        window.open("/ResumeNew.pdf", "_blank");
      }
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setIsZoomedInFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 pb-24">
      {/* Download button */}
      <div className="flex justify-end mb-6">
        <a
          href="/ResumeNew.pdf"
          download="Vince_Ong_Engineering_Portfolio.pdf"
          className="group inline-flex items-center gap-2.5 font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] tracking-[0.15em] text-silver/60 border border-silver/15 rounded-full px-6 py-3 hover:bg-iron/60 hover:text-chalk hover:border-silver/30 transition-all duration-300"
        >
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
          DOWNLOAD PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="w-full flex-1 flex flex-col items-center justify-start">
        <div
          ref={containerRef}
          className={`relative group bg-iron/5 border border-steel/15 shadow-sm overflow-hidden flex flex-col transition-all duration-300 mx-auto ${
            isFullscreen
              ? "w-full h-screen border-none rounded-none"
              : "w-full aspect-[8.5/11] rounded-xl"
          }`}
          style={
            !isFullscreen
              ? { maxWidth: "min(100%, calc(75vh * 8.5 / 11))" }
              : {}
          }
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
            src={
              isZoomedInFullscreen
                ? "/ResumeNew.pdf#view=FitH"
                : "/ResumeNew.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit"
            }
            className={`w-full h-full border-none bg-black ${
              isZoomedInFullscreen ? "" : "pointer-events-none"
            }`}
            title="Engineering Portfolio PDF Viewer"
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
  );
}
