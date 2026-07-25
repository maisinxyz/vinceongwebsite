"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LaptopScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  // The container is 200vh tall to give us plenty of scroll distance to scrub the animation.
  // We track scroll progress through this container.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // -100deg: lid is closed and pointing slightly downwards towards the user, revealing the outer lid.
  // -8deg: lid is fully open (slightly tilted back for realism).
  const lidRotation = useTransform(scrollYProgress, [0, 0.7], [-100, -8]);

  return (
    <div ref={containerRef} className="h-[200vh] w-full relative -mt-16 sm:-mt-24 mb-32 z-20">
      {/* Sticky container holds the laptop in place while we scroll through the 200vh */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Perspective wrapper */}
        <div style={{ perspective: "1500px" }} className="relative w-[85vw] max-w-[700px] xl:max-w-[800px] flex flex-col items-center justify-center -translate-y-16 lg:translate-y-0">
          
          {/* LID */}
          <motion.div
            style={{ 
              rotateX: lidRotation, 
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d"
            }}
            className="w-full aspect-[16/10] relative z-10"
          >
            {/* INNER SCREEN (Front Face) */}
            <div 
              className="absolute inset-0 rounded-t-3xl rounded-b-sm bg-void flex items-center justify-center p-3 sm:p-4 border-[2px] border-[#15171a]"
              style={{
                backfaceVisibility: "hidden",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.8), 0 -1px 2px rgba(255,255,255,0.15)"
              }}
            >
              {/* Screen Bezel / Glass */}
              <div className="w-full h-full rounded-t-xl rounded-b-sm bg-black relative overflow-hidden">
                {/* Glow/Reflection */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* OUTER LID (Back Face) */}
            <div 
              className="absolute inset-0 rounded-t-3xl rounded-b-sm"
              style={{
                background: "linear-gradient(to bottom, var(--color-steel), var(--color-carbon))",
                transform: "rotateY(180deg) rotateZ(180deg)",
                backfaceVisibility: "hidden",
                boxShadow: "inset 0 2px 2px rgba(255,255,255,0.15), inset 0 0 40px rgba(0,0,0,0.8)"
              }}
            >
              {/* Subtle metallic noise on the outer lid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_60%)]" />
              
              {/* Minimalist Logo on the back */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-silver/10 bg-iron/5 shadow-inner" />
              </div>
            </div>
          </motion.div>

          {/* BASE (Keyboard Deck Front Lip) */}
          <div className="w-[105%] h-4 sm:h-5 lg:h-6 relative z-20 -mt-[1px]">
            <div 
              className="w-full h-full bg-gradient-to-b from-iron/90 to-carbon rounded-b-[1.5rem] shadow-2xl relative overflow-hidden"
              style={{
                boxShadow: "0 30px 60px -10px rgba(0,0,0,1), inset 0 1px 2px rgba(255,255,255,0.2)"
              }}
            >
              {/* Trackpad Indentation */}
              <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 w-1/4 h-2 sm:h-2.5 rounded-[3px] bg-black/40 border-t border-white/10" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
