"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";

/* ═══════════════════════════════════════════════════
   ALBUM DATA
   ═══════════════════════════════════════════════════ */
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
      { name: "Fake Plastic Trees", duration: 290 },
      { name: "Planet Telex", duration: 259 },
      { name: "High and Dry", duration: 258 },
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
      { name: "Thinkin Bout You", duration: 200 },
      { name: "Super Rich Kids", duration: 305 },
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
      { name: "EARFQUAKE", duration: 190 },
      { name: "IGOR'S THEME", duration: 191 },
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
      { name: "Get Lucky", duration: 369 },
      { name: "Give Life Back to Music", duration: 275 },
      { name: "Instant Crush", duration: 337 },
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
      { name: "21st Century Schizoid Man", duration: 449 },
      { name: "Epitaph", duration: 509 },
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
      { name: "The Adults Are Talking", duration: 305 },
      { name: "Bad Decisions", duration: 249 },
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
      { name: "Swimming Pools (Drank)", duration: 313 },
      { name: "Money Trees", duration: 387 },
      { name: "m.A.A.d city", duration: 348 },
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
      { name: "Welcome to the Black Parade", duration: 311 },
      { name: "Famous Last Words", duration: 290 },
    ],
  },
];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
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
  const [duration, setDuration] = useState(0);
  
  const [audioUrl, setAudioUrl] = useState<string>("");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const album = ALBUMS[albumIndex];
  const track = album.tracks[trackIndex];

  // Dynamically fetch actual 30s preview from iTunes API
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const query = encodeURIComponent(`${track.name} ${album.artist}`);
        const fetchUrl = `https://itunes.apple.com/search?term=${query}&media=music&limit=1`;
        
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
          setAudioUrl(data.results[0].previewUrl);
        } else {
          setAudioUrl("");
        }
      } catch (err) {
        console.error("Failed to fetch preview:", err);
        setAudioUrl("");
      }
    };
    fetchPreview();
  }, [track.name, album.artist]);

  // Update progress bar based on actual audio playback
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration || 30; // iTunes previews are ~30s
      const currentTime = audioRef.current.currentTime;
      setDuration(audioDuration);
      
      setProgress(audioDuration > 0 ? currentTime / audioDuration : 0);
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, updateProgress]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    } else if (!audioUrl) {
      console.warn("No audio URL available for this track yet.");
    }
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    if (isPlaying) stopPlayback();
    else startPlayback();
  }, [isPlaying, startPlayback, stopPlayback]);

  const skipTrack = useCallback(() => {
    stopPlayback();
    setProgress(0);
    setTrackIndex((prev) => (prev + 1) % ALBUMS[albumIndex].tracks.length);
  }, [albumIndex, stopPlayback]);

  const changeAlbum = useCallback(() => {
    stopPlayback();
    setProgress(0);
    setTrackIndex(0);
    setAlbumIndex((prev) => (prev + 1) % ALBUMS.length);
  }, [stopPlayback]);

  // Auto-play next track when current one ends
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    skipTrack();
  }, [skipTrack]);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={audioUrl || undefined}
        preload="auto"
        onEnded={handleAudioEnded}
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
            disabled={!audioUrl}
            className={`flex flex-col items-center gap-2.5 transition-colors group ${!audioUrl ? 'text-steel/20 cursor-not-allowed' : 'text-silver/40 hover:text-chalk'}`}
            aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
            <span className={`font-[family-name:var(--font-space-mono-family)] text-[9px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity ${!audioUrl ? 'hidden' : ''}`}>
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
          <div className="w-full h-[3px] bg-steel/15 rounded-full overflow-hidden shadow-inner">
            <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: album.accent, transition: "width 0.1s linear" }} />
          </div>
          <div className="flex justify-between mt-3">
            <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[10px]">{formatTime(progress * (duration || 30))}</span>
            <span className="font-[family-name:var(--font-space-mono-family)] text-silver/30 text-[10px]">{formatTime(duration || 30)}</span>
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

      <main className="relative pt-48 sm:pt-56 pb-[250px] lg:pb-[400px] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-10 sm:px-16 lg:px-24 h-full flex flex-col">
          
          {/* ABOUT Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-20"
          >

            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-6xl sm:text-7xl lg:text-8xl tracking-tight">
              ABOUT
            </h1>
            <div className="h-px bg-silver/15 w-24 mt-8" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 w-full">
            
            {/* ── LEFT COLUMN: Bio + Projects (Wider side) ── */}
            <div className="lg:col-span-6 lg:col-start-2 flex flex-col pl-16 sm:pl-32 md:pl-48 lg:pl-48 xl:pl-64">

              {/* Bio: Floating Textbox */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ marginTop: '80px', marginBottom: '100px' }}
              >
                <div
                  className="border border-steel/20 bg-iron/10 p-10 sm:p-14 shadow-[0_4px_40px_rgba(0,0,0,0.3)]"
                  style={{ marginLeft: '-60px', marginRight: '-60px' }}
                >
                  <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-3xl sm:text-4xl tracking-tight mb-8">
                    Vince Ong
                  </h2>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[12px] leading-[2.2] mb-6">
                    Mechatronic Systems Engineering student at Simon Fraser University.
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[12px] leading-[2.2] mb-6">
                    I am passionate about building end-to-end systems which integrate hardware and software.
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[12px] leading-[2.2] mb-10">
                    I have experience designing custom PCB&apos;s, developing firmware in C++ via raspberry pi and arduino systems, and using frameworks such as React and Next.js.
                  </p>
                  
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[12px] leading-[2.2] mb-10">
                    Currently, I am focused on creating more technical projects, which integrate LLMs, specifically with DAWNTRACE, a project I am working on.
                  </p>
                  
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[12px] leading-[2.2] mb-6">
                    On top of my projects, I maintain a 3.7 GPA while actively participating in hackathons.
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[12px] leading-[2.2] mb-10">
                    Based in Vancouver, B.C., looking for experiences to connect and gain new experiences with people, feel free to message me on linkedin!
                  </p>

                  <div className="h-px bg-steel/15 mb-10" />

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-chalk tracking-[0.2em] mb-2">FOCUS</p>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-[12px] leading-relaxed">
                        Firmware · Robotics · Full-Stack · AI/ML
                      </p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-chalk tracking-[0.2em] mb-2">EDUCATION</p>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-[12px] leading-relaxed">
                        SFU · IB Diploma · 3.7 GPA
                      </p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-chalk tracking-[0.2em] mb-2">BASED IN</p>
                      <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-chalk text-[12px] leading-relaxed">
                        Vancouver, B.C.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Currently Working On — Notion Gallery View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-10">
                  <h2 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-2xl sm:text-3xl lg:text-3xl tracking-tight">
                    Currently Working On
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Engram",
                      description: "B2B AI SaaS platform with LLM-powered persistent memory for enterprise workflows.",
                      tags: ["NEXT.JS", "TYPESCRIPT", "AI/LLM"],
                      status: "In Progress",
                      href: "https://engram-pi-ruddy.vercel.app",
                      period: "2024 —",
                      coverGradient: "linear-gradient(145deg, #1a1f2e 0%, #0f1318 60%, #1c2230 100%)",
                    },
                    {
                      title: "DAWNTRACE",
                      description: "Autonomous robotic platform with custom PCB design and embedded firmware.",
                      tags: ["C/C++", "PCB", "FIRMWARE"],
                      status: "In Progress",
                      href: "https://github.com/maisinxyz/DAWNTRACE",
                      period: "2025 —",
                      coverGradient: "linear-gradient(145deg, #1f1a1a 0%, #141010 60%, #231c1c 100%)",
                    },
                    {
                      title: "Coming Soon",
                      description: "Details to be announced.",
                      tags: [],
                      status: "Planned",
                      href: null,
                      period: "",
                      coverGradient: "linear-gradient(145deg, #171717 0%, #0d0d0d 60%, #1a1a1a 100%)",
                    },
                    {
                      title: "Coming Soon",
                      description: "Details to be announced.",
                      tags: [],
                      status: "Planned",
                      href: null,
                      period: "",
                      coverGradient: "linear-gradient(145deg, #171717 0%, #0d0d0d 60%, #1a1a1a 100%)",
                    },
                  ].map((project, i) => {
                    const cardContent = (
                      <div
                        key={i}
                        className={`group border border-steel/20 bg-iron/10 transition-all duration-200 ${
                          project.href
                            ? "hover:border-steel/40 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                            : ""
                        }`}
                      >
                        {/* Cover area */}
                        <div
                          className="w-full h-[120px]"
                          style={{ background: project.coverGradient }}
                        />

                        {/* Card body */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-[16px] tracking-tight">
                              {project.title}
                            </h3>
                            <span
                              className={`font-[family-name:var(--font-space-mono-family)] text-[8px] tracking-[0.15em] px-2 py-0.5 border ${
                                project.status === "In Progress"
                                  ? "text-silver/50 border-steel/25"
                                  : "text-silver/30 border-steel/15"
                              }`}
                            >
                              {project.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-[12px] leading-[1.8] mb-4">
                            {project.description}
                          </p>

                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                              {project.tags.map((t) => (
                                <span
                                  key={t}
                                  className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.15em]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.period && (
                            <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/25 tracking-[0.1em] mt-4">
                              {project.period}
                            </p>
                          )}
                        </div>
                      </div>
                    );

                    if (project.href) {
                      return (
                        <a
                          key={i}
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          {cardContent}
                        </a>
                      );
                    }
                    return cardContent;
                  })}
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
                    { label: "INTERESTS", value: "Robotics · Firmware · End-to-End Design" },
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
