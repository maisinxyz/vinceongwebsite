"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

type LedKey = "TL" | "TR" | "ML" | "CC" | "MR" | "BL" | "BR";

interface DigitalDicePCBProps {
  className?: string;
}

const FACE_LEDS: Record<number, LedKey[]> = {
  1: ["CC"],
  2: ["TR", "BL"],
  3: ["TR", "CC", "BL"],
  4: ["TL", "TR", "BL", "BR"],
  5: ["TL", "TR", "CC", "BL", "BR"],
  6: ["TL", "TR", "ML", "MR", "BL", "BR"],
};

const LEDS: Array<{ key: LedKey; ref: string; x: number; y: number }> = [
  { key: "TL", ref: "LED1", x: 318, y: 96 },
  { key: "TR", ref: "LED2", x: 396, y: 96 },
  { key: "ML", ref: "LED3", x: 318, y: 146 },
  { key: "CC", ref: "LED4", x: 357, y: 146 },
  { key: "MR", ref: "LED5", x: 396, y: 146 },
  { key: "BL", ref: "LED6", x: 318, y: 196 },
  { key: "BR", ref: "LED7", x: 396, y: 196 },
];

const SMD_CAPS = [
  [78, 59, "C1"], [128, 59, "C2"], [78, 221, "C3"], [128, 221, "C4"],
  [196, 58, "C5"], [246, 58, "C6"], [196, 222, "C7"], [246, 222, "C8"],
  [298, 250, "C9"], [356, 250, "C10"], [414, 250, "C11"],
] as const;

const RESISTORS = [
  [289, 63, "R1"], [289, 87, "R2"], [289, 111, "R3"], [289, 135, "R4"],
  [289, 159, "R5"], [289, 183, "R6"], [289, 207, "R7"],
] as const;

const AXIAL_RESISTORS = [
  [86, 270, "R8"], [184, 270, "R9"],
] as const;

const DIODES = [
  [90, 244, "D1"], [136, 244, "D2"], [182, 244, "D3"], [228, 244, "D4"],
] as const;

const DIP_PINS = Array.from({ length: 8 }, (_, i) => i);

function SolderPad({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.6} fill="#c8a04a" opacity="0.72" />
      <circle cx={x} cy={y} r={r} fill="url(#solder)" stroke="#f7f1d1" strokeWidth="0.5" />
      <circle cx={x - r * 0.25} cy={y - r * 0.32} r={r * 0.28} fill="#ffffff" opacity="0.55" />
    </g>
  );
}

function SmdPad({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="1.3" fill="url(#smdPad)" stroke="#ecd37a" strokeWidth="0.4" />;
}

export default function DigitalDicePCB({ className }: DigitalDicePCBProps) {
  const [powered, setPowered] = useState(false);
  const [face, setFace] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [settlePulse, setSettlePulse] = useState(0);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [showBoardInfo, setShowBoardInfo] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const rollingRef = useRef(false);

  const activeLeds = powered ? FACE_LEDS[face] : [];

  const positionTooltip = useCallback((event: ReactPointerEvent, text: string) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      text,
      x: Math.min(event.clientX - rect.left + 14, rect.width - 190),
      y: Math.max(event.clientY - rect.top + 14, 8),
    });
  }, []);

  const hover = useCallback(
    (text: string) => ({
      onPointerEnter: (event: ReactPointerEvent<SVGGElement>) => positionTooltip(event, text),
      onPointerMove: (event: ReactPointerEvent<SVGGElement>) => positionTooltip(event, text),
      onPointerLeave: () => setTooltip(null),
    }),
    [positionTooltip]
  );

  const stopRolling = useCallback(() => {
    if (!rollingRef.current) return;
    rollingRef.current = false;
    setRolling(false);
    setFace(Math.floor(Math.random() * 6) + 1);
    setSettlePulse((value) => value + 1);
  }, []);

  const startRolling = useCallback((event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!powered || rollingRef.current) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    rollingRef.current = true;
    lastFrameRef.current = 0;
    setRolling(true);
  }, [powered]);

  useEffect(() => {
    if (!rolling) return;

    const tick = (timestamp: number) => {
      if (!rollingRef.current) return;
      if (timestamp - lastFrameRef.current > 66) {
        lastFrameRef.current = timestamp;
        setFace(Math.floor(Math.random() * 6) + 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [rolling]);

  return (
    <div ref={wrapperRef} className={cn("relative w-full max-w-[480px] mx-auto select-none", className)}>
      <div className="rounded-lg bg-[#101722] shadow-inner shadow-black/40">
        <svg
          viewBox="0 0 480 320"
          role="img"
          aria-label="Interactive SFU ENSC 120 digital dice PCB simulation"
          className="block w-full aspect-[3/2]"
          style={{
            filter: powered
              ? "brightness(1.08) drop-shadow(0 0 13px rgba(39, 214, 112, 0.18))"
              : "brightness(0.72) saturate(0.82)",
            transition: "filter 180ms ease",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="boardSubtle" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#1f7b43" />
              <stop offset="55%" stopColor="#1a6b3a" />
              <stop offset="100%" stopColor="#15592f" />
            </linearGradient>
            <linearGradient id="solder" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="38%" stopColor="#c9c9c4" />
              <stop offset="100%" stopColor="#767d82" />
            </linearGradient>
            <linearGradient id="smdPad" x1="0" x2="1">
              <stop offset="0%" stopColor="#8b6a22" />
              <stop offset="45%" stopColor="#f0ca68" />
              <stop offset="100%" stopColor="#9a7528" />
            </linearGradient>
            <radialGradient id="ledOn" cx="42%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#fff5c0" />
              <stop offset="28%" stopColor="#ff8a2d" />
              <stop offset="78%" stopColor="#e01717" />
              <stop offset="100%" stopColor="#711010" />
            </radialGradient>
            <radialGradient id="ledOff" cx="42%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#78312b" />
              <stop offset="100%" stopColor="#2a1010" />
            </radialGradient>
            <filter id="ledGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="buttonShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.38" />
            </filter>
          </defs>

          <rect x="8" y="8" width="464" height="304" rx="17" fill="url(#boardSubtle)" stroke="#15592f" strokeWidth="3" />
          <rect x="18" y="18" width="444" height="284" rx="12" fill="none" stroke="#7ecf97" strokeWidth="0.5" opacity="0.18" />

          {[30, 450].map((x) => [30, 290].map((y) => <SolderPad key={`${x}-${y}`} x={x} y={y} r={6} />))}

          <g fill="none" stroke="#c8a04a" strokeLinecap="round" strokeLinejoin="round" opacity="0.72">
            <path d="M60 45 H420 V232 H300" strokeWidth="1.6" />
            <path d="M72 236 H270 V96 H305" strokeWidth="1.4" />
            <path d="M160 86 H280 M160 112 H278 M160 139 H278 M160 166 H278 M160 194 H278" strokeWidth="1.15" />
            <path d="M300 72 C325 72 335 78 343 91 M300 96 C325 101 333 114 344 136 M300 120 C324 124 337 155 344 184" strokeWidth="1.1" />
            <path d="M234 234 C264 224 284 213 312 196 M236 246 C270 237 318 218 396 196" strokeWidth="1.1" />
            <path d="M380 248 H430 V106 H412" strokeWidth="1.3" />
            <path d="M116 248 V232 M162 248 V226 M208 248 V232" strokeWidth="1.1" />
          </g>

          <text
            x="37"
            y="48"
            fill="#e7f3d8"
            fontFamily="monospace"
            fontSize="13"
            fontWeight="700"
            className="cursor-pointer"
            onClick={() => setShowBoardInfo((value) => !value)}
          >
            E120-DIE-R2A
          </text>
          <text x="348" y="290" fill="#d8ead0" fontFamily="monospace" fontSize="10" fontWeight="700">SFU ENSC 120</text>

          {showBoardInfo && (
            <g>
              <rect x="38" y="56" width="240" height="44" rx="5" fill="#0d1711" stroke="#d8ead0" strokeWidth="0.7" opacity="0.97" />
              <text x="50" y="73" fill="#f4f7ee" fontFamily="monospace" fontSize="8.6">SFU ENSC 120 Soldering Project</text>
              <text x="50" y="86" fill="#c7d6c1" fontFamily="monospace" fontSize="7.4">Random Dice Roller. Mixed-technology PWB</text>
              <text x="50" y="96" fill="#c7d6c1" fontFamily="monospace" fontSize="7.4">using SMD and through-hole components.</text>
            </g>
          )}

          <g {...hover("U1 — CD4017 decade counter — 16-pin DIP socket")} className="cursor-help">
            <text x="88" y="78" fill="#f2f2f0" fontFamily="monospace" fontSize="9">U1</text>
            <rect x="62" y="82" width="98" height="128" rx="5" fill="#17191b" stroke="#050505" strokeWidth="1.5" />
            <rect x="104" y="88" width="14" height="10" rx="5" fill="#111" stroke="#3b3b3b" strokeWidth="0.5" />
            <text x="111" y="149" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8" transform="rotate(-90 111 149)">CD4017</text>
            {DIP_PINS.map((i) => (
              <g key={`u1-${i}`}>
                <SolderPad x={52} y={96 + i * 14} r={3.2} />
                <SolderPad x={170} y={96 + i * 14} r={3.2} />
                <rect x="57" y={93 + i * 14} width="10" height="6" rx="1" fill="#111" />
                <rect x="155" y={93 + i * 14} width="10" height="6" rx="1" fill="#111" />
              </g>
            ))}
          </g>

          <g {...hover("U2 — display decode logic — 16-pin DIP socket")} className="cursor-help">
            <text x="206" y="78" fill="#f2f2f0" fontFamily="monospace" fontSize="9">U2</text>
            <rect x="180" y="82" width="98" height="128" rx="5" fill="#17191b" stroke="#050505" strokeWidth="1.5" />
            <rect x="222" y="88" width="14" height="10" rx="5" fill="#111" stroke="#3b3b3b" strokeWidth="0.5" />
            <text x="229" y="149" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8" transform="rotate(-90 229 149)">CD4511</text>
            {DIP_PINS.map((i) => (
              <g key={`u2-${i}`}>
                <SolderPad x={170} y={96 + i * 14} r={3.2} />
                <SolderPad x={288} y={96 + i * 14} r={3.2} />
                <rect x="175" y={93 + i * 14} width="10" height="6" rx="1" fill="#111" />
                <rect x="273" y={93 + i * 14} width="10" height="6" rx="1" fill="#111" />
              </g>
            ))}
          </g>

          {SMD_CAPS.map(([x, y, ref]) => (
            <g key={ref} {...hover(`${ref} — 100 nF — decoupling capacitor`)} className="cursor-help">
              <text x={x - 10} y={y - 6} fill="#e7f3d8" fontFamily="monospace" fontSize="7">{ref}</text>
              <SmdPad x={x - 11} y={y - 4} w={8} h={8} />
              <SmdPad x={x + 9} y={y - 4} w={8} h={8} />
              <rect x={x - 5} y={y - 5} width="16" height="10" rx="1.5" fill="#d7c18b" stroke="#816f3c" strokeWidth="0.4" />
            </g>
          ))}

          {RESISTORS.map(([x, y, ref]) => (
            <g key={ref} {...hover(`${ref} — LED current-limiting resistor — SMD 0805`)} className="cursor-help">
              <text x={x - 19} y={y + 3} fill="#e7f3d8" fontFamily="monospace" fontSize="7">{ref}</text>
              <SmdPad x={x - 3} y={y - 6} w={7} h={12} />
              <SmdPad x={x + 25} y={y - 6} w={7} h={12} />
              <rect x={x + 3} y={y - 7} width="24" height="14" rx="2" fill="#b79662" stroke="#6c4c2d" strokeWidth="0.5" />
              <line x1={x + 9} y1={y - 5} x2={x + 9} y2={y + 5} stroke="#7d3f28" />
              <line x1={x + 15} y1={y - 5} x2={x + 15} y2={y + 5} stroke="#111" />
              <line x1={x + 21} y1={y - 5} x2={x + 21} y2={y + 5} stroke="#d4b14a" />
            </g>
          ))}

          {AXIAL_RESISTORS.map(([x, y, ref]) => (
            <g key={ref} {...hover(`${ref} — timing/pull-up resistor — through-hole axial`)} className="cursor-help">
              <text x={x - 16} y={y - 12} fill="#e7f3d8" fontFamily="monospace" fontSize="7">{ref}</text>
              <SolderPad x={x - 23} y={y} r={3.4} />
              <SolderPad x={x + 23} y={y} r={3.4} />
              <line x1={x - 20} y1={y} x2={x + 20} y2={y} stroke="#c9c4ad" strokeWidth="2" />
              <rect x={x - 13} y={y - 5} width="26" height="10" rx="4" fill="#d1b47f" stroke="#7a6440" strokeWidth="0.5" />
              <line x1={x - 6} y1={y - 4} x2={x - 6} y2={y + 4} stroke="#6b2f20" />
              <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="#111" />
              <line x1={x + 6} y1={y - 4} x2={x + 6} y2={y + 4} stroke="#d2a739" />
            </g>
          ))}

          {DIODES.map(([x, y, ref]) => (
            <g key={ref} {...hover(`${ref} — 1N4148 signal diode — through-hole`)} className="cursor-help">
              <text x={x - 11} y={y - 12} fill="#e7f3d8" fontFamily="monospace" fontSize="7">{ref}</text>
              <SolderPad x={x - 16} y={y} r={3.2} />
              <SolderPad x={x + 16} y={y} r={3.2} />
              <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke="#b7b7b0" strokeWidth="2" />
              <rect x={x - 11} y={y - 5} width="22" height="10" rx="5" fill="#e7a25f" opacity="0.78" stroke="#6b3b1b" strokeWidth="0.5" />
              <line x1={x + 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke="#111" strokeWidth="1.5" />
            </g>
          ))}

          <g {...hover("C12 — electrolytic capacitor — timing/bypass")} className="cursor-help">
            <text x="380" y="65" fill="#e7f3d8" fontFamily="monospace" fontSize="7">C12</text>
            <SolderPad x={390} y={82} r={4} />
            <SolderPad x={410} y={82} r={4} />
            <ellipse cx="400" cy="75" rx="19" ry="9" fill="#31363a" />
            <rect x="381" y="75" width="38" height="35" fill="#151719" />
            <ellipse cx="400" cy="110" rx="19" ry="9" fill="#090a0b" stroke="#555" strokeWidth="0.5" />
            <rect x="385" y="76" width="5" height="32" fill="#f5f5f0" opacity="0.8" />
          </g>

          <g {...hover("C13 — electrolytic capacitor — power bypass")} className="cursor-help">
            <text x="423" y="178" fill="#e7f3d8" fontFamily="monospace" fontSize="7">C13</text>
            <SolderPad x={434} y={196} r={4} />
            <SolderPad x={452} y={196} r={4} />
            <ellipse cx="443" cy="190" rx="15" ry="7" fill="#32373a" />
            <rect x="428" y="190" width="30" height="28" fill="#151719" />
            <ellipse cx="443" cy="218" rx="15" ry="7" fill="#090a0b" stroke="#555" strokeWidth="0.5" />
            <rect x="431" y="191" width="4" height="26" fill="#f5f5f0" opacity="0.8" />
          </g>

          <g {...hover("Q1 — N-channel MOSFET — SOT-23 SMD switch")} className="cursor-help">
            <text x="394" y="242" fill="#e7f3d8" fontFamily="monospace" fontSize="7">Q1</text>
            <SmdPad x={404} y={247} w={7} h={6} />
            <SmdPad x={421} y={241} w={7} h={6} />
            <SmdPad x={421} y={253} w={7} h={6} />
            <rect x="409" y="241" width="15" height="19" rx="2" fill="#121314" stroke="#555" strokeWidth="0.4" />
          </g>

          <g {...hover("Q2 — PNP transistor — through-hole TO-92 driver")} className="cursor-help">
            <text x="396" y="31" fill="#e7f3d8" fontFamily="monospace" fontSize="7">Q2</text>
            <SolderPad x={409} y={50} r={3.2} />
            <SolderPad x={421} y={50} r={3.2} />
            <SolderPad x={433} y={50} r={3.2} />
            <path d="M402 43 A18 18 0 0 1 440 43 L440 53 L402 53 Z" fill="#101112" stroke="#555" strokeWidth="0.6" />
            <line x1="409" y1="50" x2="409" y2="58" stroke="#c9c9c4" strokeWidth="1.3" />
            <line x1="421" y1="50" x2="421" y2="58" stroke="#c9c9c4" strokeWidth="1.3" />
            <line x1="433" y1="50" x2="433" y2="58" stroke="#c9c9c4" strokeWidth="1.3" />
          </g>

          <g {...hover("BT1 — 9 V battery snap connector")} className="cursor-help">
            <text x="42" y="291" fill="#e7f3d8" fontFamily="monospace" fontSize="8">BT1 9V</text>
            <SolderPad x={52} y={270} r={4} />
            <SolderPad x={68} y={270} r={4} />
            <path d="M52 270 C35 253 32 236 45 225" stroke="#222" strokeWidth="3" fill="none" />
            <path d="M68 270 C52 250 52 231 68 220" stroke="#b81717" strokeWidth="3" fill="none" />
            <rect x="41" y="216" width="38" height="13" rx="3" fill="#202225" stroke="#8a8a8a" strokeWidth="0.7" />
            <circle cx="52" cy="222.5" r="4" fill="#d7d7cf" />
            <circle cx="68" cy="222.5" r="3" fill="#868982" />
          </g>

          <g
            {...hover(powered ? "SW1 ROLL — hold to clock the counter, release to freeze result" : "SW1 ROLL — connect battery first")}
            onPointerDown={startRolling}
            onPointerUp={stopRolling}
            onPointerCancel={stopRolling}
            className={powered ? "cursor-pointer" : "cursor-not-allowed"}
            filter="url(#buttonShadow)"
          >
            <text x="336" y="278" fill="#e7f3d8" fontFamily="monospace" fontSize="8">SW1 ROLL</text>
            <SolderPad x={326} y={276} r={3.2} />
            <SolderPad x={374} y={276} r={3.2} />
            <SolderPad x={326} y={306} r={3.2} />
            <SolderPad x={374} y={306} r={3.2} />
            <rect x="326" y="274" width="48" height="34" rx="5" fill="#686d71" stroke="#c6c8ca" strokeWidth="1" />
            <rect
              x={rolling ? "338" : "336"}
              y={rolling ? "282" : "280"}
              width="28"
              height="18"
              rx="4"
              fill={powered ? "#b5b9bc" : "#787d80"}
              stroke="#f2f2f0"
              strokeWidth="0.8"
            />
          </g>

          <g>
            <text x="337" y="70" fill="#e7f3d8" fontFamily="monospace" fontSize="8">DICE LEDS</text>
            {LEDS.map((led) => {
              const lit = activeLeds.includes(led.key);
              return (
                <g key={`${led.key}-${settlePulse}`} {...hover(`${led.ref} — ${led.key} dice dot LED — through-hole red/amber`)} className="cursor-help">
                  {lit && <circle cx={led.x} cy={led.y} r="18" fill="#ff3b1f" opacity="0.25" filter="url(#ledGlow)" />}
                  <SolderPad x={led.x - 11} y={led.y + 14} r={2.7} />
                  <SolderPad x={led.x + 11} y={led.y + 14} r={2.7} />
                  <circle
                    cx={led.x}
                    cy={led.y}
                    r="11"
                    fill={lit ? "url(#ledOn)" : "url(#ledOff)"}
                    stroke={lit ? "#ffd88a" : "#4a1d1d"}
                    strokeWidth="1"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: lit && settlePulse ? "pcb-led-settle 220ms ease-out" : undefined,
                    }}
                  />
                  <circle cx={led.x - 4} cy={led.y - 4} r="2.4" fill="#fff" opacity={lit ? "0.65" : "0.18"} />
                  <text x={led.x - 14} y={led.y - 16} fill="#e7f3d8" fontFamily="monospace" fontSize="6.5">{led.ref}</text>
                </g>
              );
            })}
          </g>

          <text x="264" y="290" fill="#f2f2f0" fontFamily="monospace" fontSize="11" fontWeight="700">
            FACE {powered ? face : "-"}
          </text>
        </svg>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 w-[180px] rounded-md border border-silver/15 bg-carbon/95 px-2.5 py-2 text-[9px] leading-snug text-silver shadow-xl shadow-black/40"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 sm:justify-between">
        <button
          type="button"
          onClick={() => {
            if (powered) {
              rollingRef.current = false;
              setRolling(false);
              setFace(1);
            }
            setPowered((value) => !value);
          }}
          className={cn(
            "rounded-md border px-2 py-1 text-[8px] font-bold tracking-[0.12em] transition-colors sm:px-3 sm:text-[10px] sm:tracking-[0.18em]",
            powered
              ? "border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/15"
              : "border-green-400/30 bg-green-500/10 text-green-200 hover:bg-green-500/15"
          )}
        >
          {powered ? "DISCONNECT BATTERY" : "CONNECT BATTERY"}
        </button>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md border border-steel/20 bg-iron/40 px-2 py-1 font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/55 sm:gap-x-3 sm:px-3 sm:text-[9px]">
          <span><span className="text-[#5a2420]">●</span> LED off</span>
          <span><span className="text-[#ff4a22]">●</span> LED on</span>
          <span><span className="text-[#b79662]">◼</span> SMD</span>
          <span><span className="text-[#c9c9c4]">◉</span> Through-hole</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pcb-led-settle {
          0% { transform: scale(1); }
          48% { transform: scale(1.22); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export { DigitalDicePCB };
