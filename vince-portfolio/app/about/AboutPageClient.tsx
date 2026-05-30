"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";

/* ═══════════════════════════════════════════════════
   ALBUM DATA
   ═══════════════════════════════════════════════════ */
// Using a placeholder audio track so the play button actually plays music!
const PLACEHOLDER_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const ALBUMS = [
  {
    title: "The Bends",
    artist: "Radiohead",
    year: 1995,
    color: "#C4A265",
    accent: "#8B6914",
    coverBg: "linear-gradient(135deg, #D4B896 0%, #8B6914 50%, #C4A265 100%)",
    image: "/album covers/the bends.png",
    tracks: [
      { name: "Planet Telex", duration: 259, audioSrc: PLACEHOLDER_AUDIO },
      { name: "The Bends", duration: 240, audioSrc: PLACEHOLDER_AUDIO },
      { name: "High and Dry", duration: 258, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Fake Plastic Trees", duration: 290, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Street Spirit (Fade Out)", duration: 251, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "Channel Orange",
    artist: "Frank Ocean",
    year: 2012,
    color: "#E8A317",
    accent: "#D4760A",
    coverBg: "linear-gradient(135deg, #FFB84D 0%, #D4760A 50%, #E8A317 100%)",
    image: "/album covers/channel orange.png",
    tracks: [
      { name: "Thinkin Bout You", duration: 200, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Super Rich Kids", duration: 305, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Pyramids", duration: 594, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Lost", duration: 237, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Forrest Gump", duration: 192, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "IGOR",
    artist: "Tyler, The Creator",
    year: 2019,
    color: "#F5B7C5",
    accent: "#E85D8A",
    coverBg: "linear-gradient(135deg, #FFD4E0 0%, #E85D8A 50%, #F5B7C5 100%)",
    image: "/album covers/igor.png",
    tracks: [
      { name: "IGOR'S THEME", duration: 191, audioSrc: PLACEHOLDER_AUDIO },
      { name: "EARFQUAKE", duration: 190, audioSrc: PLACEHOLDER_AUDIO },
      { name: "I THINK", duration: 216, audioSrc: PLACEHOLDER_AUDIO },
      { name: "NEW MAGIC WAND", duration: 196, audioSrc: PLACEHOLDER_AUDIO },
      { name: "ARE WE STILL FRIENDS?", duration: 254, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "Random Access Memories",
    artist: "Daft Punk",
    year: 2013,
    color: "#2C2C2C",
    accent: "#D4AF37",
    coverBg: "linear-gradient(135deg, #444 0%, #D4AF37 40%, #2C2C2C 100%)",
    image: "/album covers/RAM.png",
    tracks: [
      { name: "Give Life Back to Music", duration: 275, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Get Lucky", duration: 369, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Instant Crush", duration: 337, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Lose Yourself to Dance", duration: 354, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Touch", duration: 498, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "In the Court of the Crimson King",
    artist: "King Crimson",
    year: 1969,
    color: "#D93232",
    accent: "#8B0000",
    coverBg: "linear-gradient(135deg, #FF4444 0%, #8B0000 40%, #D93232 100%)",
    image: "/album covers/King crimson.png",
    tracks: [
      { name: "21st Century Schizoid Man", duration: 449, audioSrc: PLACEHOLDER_AUDIO },
      { name: "I Talk to the Wind", duration: 360, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Epitaph", duration: 509, audioSrc: PLACEHOLDER_AUDIO },
      { name: "The Court of the Crimson King", duration: 567, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "The New Abnormal",
    artist: "The Strokes",
    year: 2020,
    color: "#4A6FA5",
    accent: "#B8D4E3",
    coverBg: "linear-gradient(135deg, #6B8FC4 0%, #2A4F7A 50%, #B8D4E3 100%)",
    image: "/album covers/the new abnormal.png",
    tracks: [
      { name: "The Adults Are Talking", duration: 305, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Bad Decisions", duration: 249, audioSrc: PLACEHOLDER_AUDIO },
      { name: "At the Door", duration: 309, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Brooklyn Bridge to Chorus", duration: 224, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Ode to the Mets", duration: 351, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "good kid, m.A.A.d city",
    artist: "Kendrick Lamar",
    year: 2012,
    color: "#1C1C1C",
    accent: "#8C8C8C",
    coverBg: "linear-gradient(135deg, #3A3A3A 0%, #0D0D0D 50%, #2A2A2A 100%)",
    image: "/album covers/gkmc.png",
    tracks: [
      { name: "Bitch, Don't Kill My Vibe", duration: 319, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Swimming Pools (Drank)", duration: 313, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Poetic Justice", duration: 305, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Money Trees", duration: 387, audioSrc: PLACEHOLDER_AUDIO },
      { name: "m.A.A.d city", duration: 348, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
  {
    title: "The Black Parade",
    artist: "My Chemical Romance",
    year: 2006,
    color: "#1A1A1A",
    accent: "#E8E8E8",
    coverBg: "linear-gradient(135deg, #333 0%, #0a0a0a 50%, #222 100%)",
    image: "/album covers/the black parade.png",
    tracks: [
      { name: "The End.", duration: 60, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Dead!", duration: 196, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Welcome to the Black Parade", duration: 311, audioSrc: PLACEHOLDER_AUDIO },
      { name: "I Don't Love You", duration: 230, audioSrc: PLACEHOLDER_AUDIO },
      { name: "Famous Last Words", duration: 290, audioSrc: PLACEHOLDER_AUDIO },
    ],
  },
];

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ═══════════════════════════════════════════════════
   RECORD PLAYER COMPONENT
   ═══════════════════════════════════════════════════ */
function RecordPlayer() {
  const [albumIndex, setAlbumIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const album = ALBUMS[albumIndex];
  const track = album.tracks[trackIndex];

  // Update progress bar based on actual audio playback
  const updateProgress = useCallback(() => {
    if (audioRef.current && track.duration > 0) {
      const currentProgress = audioRef.current.currentTime / track.duration;
      setProgress(Math.min(currentProgress, 1));
      
      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Track ended
        setIsPlaying(false);
        setProgress(0);
        // Auto-skip logic can go here
      }
    }
  }, [track.duration]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(true);
    animationRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  const togglePlay = useCallback(() => {
    if (isPlaying) stopPlayback();
    else startPlayback();
  }, [isPlaying, startPlayback, stopPlayback]);

  const skipTrack = useCallback(() => {
    stopPlayback();
    setProgress(0);
    setTrackIndex((prev) => (prev + 1) % ALBUMS[albumIndex].tracks.length);
    // Auto-play next track if it was already playing
    if (isPlaying) {
      setTimeout(() => startPlayback(), 100);
    }
  }, [albumIndex, isPlaying, startPlayback, stopPlayback]);

  const changeAlbum = useCallback(() => {
    stopPlayback();
    setProgress(0);
    setTrackIndex(0);
    setAlbumIndex((prev) => (prev + 1) % ALBUMS.length);
    // Don't auto-play when swapping albums unless desired
  }, [stopPlayback]);

  // Clean up
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={track.audioSrc}
        preload="auto"
        onEnded={skipTrack}
      />

      {/* 3D Scene Container */}
      <div 
        style={{ perspective: "1200px" }} 
        className="w-full flex justify-center items-center h-[380px] mb-6"
      >
        <div 
          style={{ 
            transformStyle: "preserve-3d", 
            transform: "rotateX(20deg) rotateY(-15deg)"
          }}
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 hover:rotate-x-[15deg] hover:rotate-y-[-5deg]"
        >
          
          {/* Floor Shadow */}
          <div 
            className="absolute bg-black/60 blur-[40px] rounded-full" 
            style={{ 
              width: "350px", height: "300px", 
              transform: "translateZ(-80px) translateY(80px) translateX(-20px)",
              pointerEvents: "none"
            }} 
          />

          {/* Album Cover Sleeve (3D Box) */}
          <div 
            className="absolute flex items-center justify-center" 
            style={{ 
              transformStyle: "preserve-3d",
              transform: "translateX(-80px) translateZ(10px)",
              zIndex: 3
            }}
          >
            {/* Front Face */}
            <div 
              className="absolute rounded-sm overflow-hidden flex items-center justify-center bg-carbon"
              style={{
                width: "230px", height: "230px",
                transform: "translateZ(4px)",
                background: `url("${album.image}") center/cover, ${album.coverBg}`,
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)",
                backfaceVisibility: "hidden"
              }}
            >
              {/* Fallback content */}
              <div className="w-full h-full flex flex-col items-center justify-end p-5 text-center"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)", opacity: album.image ? 0 : 1 }}>
                <p className="font-[family-name:var(--font-syne-family)] font-bold text-[14px] leading-tight text-white/90 drop-shadow-md">
                  {album.title}
                </p>
                <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] mt-1 text-white/50">
                  {album.artist}
                </p>
              </div>
            </div>

            {/* Back Face */}
            <div 
              className="absolute bg-iron rounded-sm"
              style={{
                width: "230px", height: "230px",
                transform: "translateZ(-4px) rotateY(180deg)",
              }}
            />

            {/* Right Edge (Spine) */}
            <div 
              className="absolute bg-steel/40"
              style={{
                width: "8px", height: "230px",
                right: "-4px",
                transform: "rotateY(90deg)",
              }}
            />
            {/* Top Edge */}
            <div 
              className="absolute bg-steel/30"
              style={{
                width: "230px", height: "8px",
                top: "-4px",
                transform: "rotateX(90deg)",
              }}
            />
          </div>

          {/* 3D Vinyl Record */}
          <div 
            className="absolute flex items-center justify-center"
            style={{ 
              transformStyle: "preserve-3d",
              transform: "translateX(60px)",
              zIndex: 1
            }}
          >
            <motion.div
              animate={{ rotateZ: isPlaying ? 360 : 0 }}
              transition={{ duration: 1.8, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              className="relative rounded-full bg-[#111]"
              style={{ 
                width: "220px", height: "220px",
                transformStyle: "preserve-3d",
                boxShadow: "0 0 1px rgba(255,255,255,0.1), inset 0 0 5px #000"
              }}
            >
              {/* Record Extrusion (Multiple layers to simulate thickness) */}
              {[1, 2, 3, 4].map(z => (
                <div key={z} className="absolute inset-0 rounded-full border border-[#000]" style={{ transform: `translateZ(-${z}px)`, backgroundColor: "#0a0a0a" }} />
              ))}

              {/* Vinyl Grooves Texture */}
              <div className="absolute inset-0 rounded-full opacity-90" style={{
                background: `repeating-radial-gradient(
                  #111,
                  #111 3px,
                  #161616 4px,
                  #161616 5px
                )`,
                transform: "translateZ(1px)"
              }} />

              {/* Lighting Highlight (Static, doesn't spin with record) */}
              <div className="absolute inset-0 rounded-full mix-blend-screen opacity-40 pointer-events-none" style={{
                background: `conic-gradient(
                  from 45deg, 
                  transparent 0deg, 
                  rgba(255,255,255,0.3) 30deg, 
                  transparent 60deg, 
                  transparent 180deg, 
                  rgba(255,255,255,0.3) 210deg, 
                  transparent 240deg
                )`,
                transform: "translateZ(2px)"
              }} />

              {/* Center Record Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
                style={{ 
                  width: "72px", 
                  height: "72px", 
                  backgroundColor: album.color, 
                  transform: "translateZ(2px)",
                  boxShadow: `inset 0 0 10px rgba(0,0,0,0.8)` 
                }}
              >
                <div className="absolute inset-0 rounded-full border border-black/20 m-1" />
                <div className="absolute inset-0 rounded-full border border-black/10 m-2" />
                {/* Spindle hole */}
                <div className="w-2.5 h-2.5 rounded-full bg-void" style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,1)" }} />
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>

      {/* Controls Container (Visually centered under the 3D mass) */}
      <div className="w-full flex flex-col items-center translate-x-[-15px]">
        
        {/* Swap Album Button */}
        <button 
          onClick={changeAlbum}
          className="mb-8 group flex items-center gap-3 px-5 py-2.5 rounded-full border border-steel/20 text-silver/60 hover:text-chalk hover:border-steel/40 hover:bg-iron/30 transition-all shadow-sm"
          aria-label="Change Album"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] tracking-[0.2em]">
            SWAP ALBUM
          </span>
        </button>

        {/* Track Info */}
        <div className="text-center mb-10 w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div key={`${albumIndex}-${trackIndex}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-base tracking-tight mb-1">{track.name}</p>
              <p className="font-[family-name:var(--font-space-mono-family)] text-silver/50 text-[11px] tracking-wider">
                {album.artist} — {album.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Track Controls: Play/Pause | Skip Track */}
        <div className="flex items-center justify-center gap-12 mb-8 w-full max-w-xs">
          
          <button onClick={togglePlay}
            className="flex flex-col items-center gap-2.5 text-silver/40 hover:text-chalk transition-colors group"
            aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
            <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
              {isPlaying ? "PAUSE" : "PLAY"}
            </span>
          </button>

          <button onClick={skipTrack}
            className="flex flex-col items-center gap-2.5 text-silver/40 hover:text-chalk transition-colors group"
            aria-label="Skip track">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
              SKIP
            </span>
          </button>
          
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          {isPlaying && (
            <p className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[9px] tracking-[0.2em] text-center mb-3">
              NOW PLAYING
            </p>
          )}
          <div className="w-full h-[3px] bg-steel/15 rounded-full overflow-hidden shadow-inner">
            <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: album.accent, transition: "width 0.1s linear" }} />
          </div>
          <div className="flex justify-between mt-3">
            <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[10px]">{formatTime(progress * track.duration)}</span>
            <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[10px]">{formatTime(track.duration)}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function AboutPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative pt-48 sm:pt-56 pb-32 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-20 h-full flex flex-col">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 w-full">
            
            {/* ── LEFT COLUMN: Bio + Projects (Wider side) ── */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* ABOUT Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
                className="mb-20"
              >
                <div className="inline-block bg-iron/60 border border-steel/20 rounded-full px-5 py-2 mb-8">
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/60 tracking-[0.25em]">001 — ABOUT</p>
                </div>
                <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-6xl sm:text-7xl lg:text-8xl tracking-tight">
                  ABOUT
                </h1>
                <div className="h-px bg-silver/15 w-24 mt-8" />
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="ml-0 sm:ml-12 lg:ml-20 mb-24"
              >
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-base sm:text-lg leading-[2.2] mb-8 max-w-2xl">
                  I&apos;m Vince Ong — a Mechatronic Systems Engineering student at Simon Fraser University.
                  I build at the intersection of hardware and software: embedded firmware, PCB design,
                  full-stack web applications, and AI-powered SaaS platforms.
                </p>
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-base sm:text-lg leading-[2.2] max-w-2xl">
                  IB Diploma graduate maintaining a 3.7 GPA while actively shipping projects
                  across multiple disciplines. Based in Vancouver, B.C.
                </p>
              </motion.div>

              {/* Portrait Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="ml-0 sm:ml-12 lg:ml-20 border-t border-b border-steel/10 py-16 mb-28 flex items-center justify-center bg-iron/5 max-w-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-5 border border-steel/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 border border-steel/30 rounded-sm" />
                  </div>
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/30 tracking-[0.25em]">
                    PORTRAIT IMAGE
                  </p>
                </div>
              </motion.div>

              {/* Currently Working On */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="ml-0 sm:ml-12 lg:ml-20"
              >
                <div className="mb-14">
                  <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-[0.25em] mb-5">
                    002 — ACTIVE
                  </p>
                  <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-3xl sm:text-4xl tracking-tight">
                    Currently Working On
                  </h2>
                </div>

                <div className="flex flex-col gap-12">
                  {/* Engram */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 gap-2">
                      <a href="https://engram-pi-ruddy.vercel.app" target="_blank" rel="noopener noreferrer"
                        className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl sm:text-2xl hover:text-accent transition-colors group flex items-center gap-3">
                        Engram
                        <span className="text-silver/25 group-hover:text-accent transition-colors text-base">↗</span>
                      </a>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/30 tracking-[0.15em]">
                        2024 — PRESENT
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-[15px] leading-relaxed max-w-xl mb-6">
                      B2B AI SaaS platform · Co-founded, full-stack development · LLM integration, enterprise dashboard, analytics pipeline.
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                      {["NEXT.JS", "TYPESCRIPT", "AI/LLM", "SAAS"].map((t) => (
                        <span key={t} className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-[0.2em]">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="h-px w-full max-w-2xl bg-steel/15" />

                  {/* DAWNTRACE */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 gap-2">
                      <a href="https://github.com/maisinxyz/DAWNTRACE" target="_blank" rel="noopener noreferrer"
                        className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl sm:text-2xl hover:text-accent transition-colors group flex items-center gap-3">
                        DAWNTRACE
                        <span className="text-silver/25 group-hover:text-accent transition-colors text-base">↗</span>
                      </a>
                      <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/30 tracking-[0.15em]">
                        2025 — PRESENT
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/60 text-[15px] leading-relaxed max-w-xl mb-6">
                      Autonomous robotic platform · Custom PCB design, embedded firmware (C/C++), sensor fusion, motion control systems.
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                      {["ROBOTICS", "C/C++", "PCB", "FIRMWARE", "SENSORS"].map((t) => (
                        <span key={t} className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-[0.2em]">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>


            {/* ── RIGHT COLUMN: Record Player + Facts (Narrower side) ── */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Record Player Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex flex-col items-center mb-28"
              >
                <RecordPlayer />
              </motion.div>

              {/* Quick Facts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm translate-x-[-15px]"
              >
                <div className="h-px bg-steel/20 mb-12" />
                <div className="grid grid-cols-2 gap-x-10 gap-y-12">
                  {[
                    { label: "LOCATION", value: "Vancouver, B.C." },
                    { label: "UNIVERSITY", value: "Simon Fraser University" },
                    { label: "PROGRAM", value: "Mechatronic Systems Eng." },
                    { label: "GPA", value: "3.7 / 4.33" },
                    { label: "INTERESTS", value: "Firmware · Robotics · AI" },
                    { label: "LANGUAGES", value: "C/C++ · Python · TS" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-[0.25em] mb-3">
                        {item.label}
                      </p>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk/80 text-[14px] leading-snug">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
