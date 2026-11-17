"use client";

import { useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Bell, Check, Copy, Pause, Play, Send, Sparkles } from "lucide-react";
import {
  Button,
  IconButton,
  IconSwap,
  Popover,
  Select,
  SuccessMark,
  TabPanel,
  Tabs,
  Toggle,
  useToast,
  type SelectOption,
} from "@/components/primitives";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  DUR,
  EASE_CSS,
  KNOB_STRETCH,
  PRESS_SCALE,
  STAGGER_MS,
  T,
  arcPath,
  exitMs,
  rubberbandClamp,
  settleDelay,
  useVariants,
 usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   /dev/motion: one labelled demo per SPEC B row (CONTRACT 2.3).
   Every demo carries data-demo="<row>" for the ad-hoc Playwright checks.
   ═══════════════════════════════════════════════════ */

const MONO = "font-[family-name:var(--font-ibm-plex-mono-family)]";
const DATA = "font-[family-name:var(--font-space-mono-family)]";

function Row(p: { n: number; rule: string; impl: string; demo: string; children: React.ReactNode }) {
  const id = `row-${p.demo}`;
  return (
    <section aria-labelledby={id} data-demo={p.demo} className="grid gap-6 border-t border-steel py-10 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="flex flex-col gap-2">
        <p className={`${DATA} text-[10px] uppercase tracking-[0.2em] text-subtle`}>Rule {String(p.n).padStart(2, "0")}</p>
        <h2 id={id} className="font-[family-name:var(--font-syne-family)] text-xl font-bold tracking-tight text-chalk">
          {p.rule}
        </h2>
        <p className={`${MONO} text-xs leading-relaxed text-silver`}>{p.impl}</p>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-4">{p.children}</div>
    </section>
  );
}

const Stage = ({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...rest} className={cn("relative rounded-xl border border-steel bg-void", className)}>
    {children}
  </div>
);

/* 01 entrances */
function EnterDemo() {
  const [k, setK] = useState(0);
  const variants = useVariants("fadeUp");
  return (
    <>
      <Button size="sm" onClick={() => setK((v) => v + 1)}>Replay entrance</Button>
      <motion.div key={k} data-enter-card variants={variants} initial="hidden" animate="visible" className={`${MONO} rounded-xl border border-steel bg-iron px-5 py-4 text-sm text-chalk`}>
        Entered with V.fadeUp · {DUR.enter} ms ease-out
      </motion.div>
    </>
  );
}

/* 02 moves */
function MoveDemo() {
  const [right, setRight] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setRight((r) => !r)}>Move</Button>
      <Stage className={cn("flex h-14 w-72 max-w-full items-center px-2", right ? "justify-end" : "justify-start")}>
        <motion.span layout transition={T.move} data-move-dot className="block h-8 w-8 rounded-full bg-accent" />
      </Stage>
    </>
  );
}

/* 03 dropdown + form */
type Topic = "general" | "internship" | "collab";
const TOPICS: readonly SelectOption<Topic>[] = [
  { value: "general", label: "General" },
  { value: "internship", label: "Internship or Co-op" },
  { value: "collab", label: "Project collaboration", description: "Hardware or software" },
  { value: "disabled" as Topic, label: "Disabled option", disabled: true },
];
function DropdownDemo() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      data-select-form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setSubmitted(`${fd.get("topic") ?? ""}|${fd.get("topic2") ?? ""}|${fd.has("topic3") ? "posted" : "absent"}`);
      }}
    >
      <Select id="demo-topic" label="Topic" name="topic" placeholder="Choose a topic" value={topic} onValueChange={setTopic} options={TOPICS} required />
      <Select
        id="demo-topic-min"
        label="Uncontrolled, minimal trigger"
        name="topic2"
        defaultValue="general"
        options={TOPICS}
        triggerClassName="h-10 rounded-none border-0 border-b px-0 hover:bg-transparent"
      />
      <Select id="demo-topic-off" label="Disabled" name="topic3" defaultValue="collab" options={TOPICS} disabled />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">Submit form</Button>
        <output data-submitted className={`${DATA} text-xs text-silver`}>{submitted === null ? "not submitted" : `topic=${submitted || "(empty)"}`}</output>
      </div>
    </form>
  );
}

/* 04 exits + toast */
function ExitDemo() {
  const [shown, setShown] = useState(true);
  const variants = useVariants("fadeUp");
  const toast = useToast();
  return (
    <>
      <Button size="sm" onClick={() => setShown((s) => !s)}>{shown ? "Hide" : "Show"}</Button>
      <div className="relative h-14 w-56">
        <AnimatePresence initial={false}>
          {shown && (
            <motion.div data-exit-card variants={variants} initial="hidden" animate="visible" exit="exit" className={`${MONO} absolute inset-0 flex items-center rounded-xl border border-steel bg-iron px-4 text-xs text-chalk`}>
              in {DUR.enter} ms · out {exitMs(DUR.enter)} ms
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button size="sm" variant="ghost" leadingIcon={<Bell />} onClick={() => toast.show({ title: "Saved draft", description: "Neutral toast, 4 s" })}>Toast</Button>
      <Button size="sm" variant="ghost" onClick={() => toast.show({ title: "Message sent", tone: "success" })}>Success toast</Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          toast.show({
            title: "Could not send",
            description: <>Error toasts are <code>role=alert</code>, outside the polite region.</>,
            tone: "error",
            durationMs: 0,
            action: { label: "Use the contact page", href: "/contact" },
          })
        }
      >
        Error toast
      </Button>
    </>
  );
}

/* 05 press */
function PressDemo() {
  return (
    <>
      <Button data-press-target>Outline</Button>
      <Button variant="solid">Solid</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link" href="#row-press">Link</Button>
      <Button size="sm" shape="rect">Small rect</Button>
      <Button size="lg" trailingIcon={<Send />}>Large</Button>
      <Button disabled>Disabled</Button>
      <IconButton label="Sparkle (outline)" variant="outline" icon={<Sparkles />} />
      <IconButton label="Sparkle (ghost, sm)" size="sm" icon={<Sparkles />} />
    </>
  );
}

/* 06 held: values bound to the pointer, tween only on release */
function HeldDemo() {
  const TRACK = 256;
  const KNOB = 28;
  const max = TRACK - KNOB;
  const x = useMotionValue(0);
  const [held, setHeld] = useState(false);
  const start = useRef<{ px: number; x: number } | null>(null);
  return (
    <>
      <Stage className="h-12" style={{ width: TRACK }}>
        <motion.span
          data-held-knob
          role="presentation"
          className="absolute top-1/2 -mt-[14px] block h-7 w-7 cursor-grab touch-none rounded-full bg-chalk active:cursor-grabbing"
          style={{ x }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            x.stop();
            start.current = { px: e.clientX, x: x.get() };
            setHeld(true);
          }}
          onPointerMove={(e) => {
            if (!start.current) return;
            x.set(Math.min(max, Math.max(0, start.current.x + e.clientX - start.current.px))); // direct, no tween
          }}
          onPointerUp={() => {
            start.current = null;
            setHeld(false);
            const stops = [0, max / 2, max];
            const target = stops.reduce((a, b) => (Math.abs(b - x.get()) < Math.abs(a - x.get()) ? b : a));
            animate(x, target, T.move);
          }}
        />
      </Stage>
      <span data-held-state className={`${DATA} text-xs text-silver`}>{held ? "held: bound to pointer" : "released: snaps with T.move"}</span>
    </>
  );
}

/* 07 knob stretch */
function KnobDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const [c, setC] = useState(false);
  return (
    <>
      <Toggle id="demo-toggle" label="Notifications" checked={a} onCheckedChange={setA} />
      <Toggle label="Compact (sm)" size="sm" checked={b} onCheckedChange={setB} />
      <Toggle label="Hidden label" hideLabel checked={c} onCheckedChange={setC} />
      <Toggle label="Disabled" disabled checked={false} onCheckedChange={() => {}} />
      <span className={`${DATA} text-xs text-silver`}>scaleX {KNOB_STRETCH} while moving</span>
    </>
  );
}

/* 08 stagger */
function StaggerDemo() {
  const [k, setK] = useState(0);
  const reduced = usePrefersReducedMotion();
  const step = (n: number) => (reduced ? T.reduced : { ...T.enter, delay: settleDelay(n) });
  const from = reduced ? { opacity: 0 } : { opacity: 0, y: 8 };
  return (
    <>
      <Button size="sm" onClick={() => setK((v) => v + 1)}>Replay settle</Button>
      <motion.div key={k} data-stagger initial={{ opacity: 0 }} animate={{ opacity: 1, transition: step(0) }} className="flex items-center gap-4 rounded-xl border border-steel bg-iron px-5 py-4">
        <motion.span data-step="1" initial={from} animate={{ opacity: 1, y: 0, transition: step(1) }} className="text-accent-fg">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </motion.span>
        <div className="flex flex-col gap-1">
          <motion.span data-step="2" initial={from} animate={{ opacity: 1, y: 0, transition: step(2) }} className={`${MONO} text-sm text-chalk`}>
            Label settles third
          </motion.span>
          <motion.span data-step="3" initial={from} animate={{ opacity: 1, y: 0, transition: step(3) }} className={`${MONO} text-xs text-silver`}>
            Secondary details last · {STAGGER_MS} ms steps
          </motion.span>
        </div>
      </motion.div>
    </>
  );
}

/* 09 arcs */
function ArcDemo() {
  const [there, setThere] = useState(false);
  const W = 260;
  const H = 110;
  const from = { x: 14, y: H - 14 };
  const to = { x: W - 14, y: 14 };
  const path = arcPath(from, to, -0.25);
  return (
    <>
      <Button size="sm" onClick={() => setThere((t) => !t)}>Send along arc</Button>
      <Stage style={{ width: W, height: H }}>
        <svg aria-hidden="true" className="absolute inset-0 text-steel" width={W} height={H}>
          <path d={path} fill="none" stroke="currentColor" strokeDasharray="3 4" />
        </svg>
        {/* CSS offset-path, eased with --ease-in-out over --dur-move */}
        <span
          data-arc-css
          className="absolute top-0 left-0 block h-3 w-3 rounded-full bg-accent transition-[offset-distance] duration-(--dur-move) ease-in-out"
          style={{ offsetPath: `path("${path}")`, offsetDistance: there ? "100%" : "0%", offsetRotate: "0deg" }}
        />
        {/* framer T.arc: split x/y easing bends a straight tween */}
        <motion.span
          data-arc-framer
          className="absolute top-0 left-0 -mt-1.5 -ml-1.5 block h-3 w-3 rounded-full border border-chalk"
          initial={false}
          animate={there ? { x: to.x, y: to.y } : { x: from.x, y: from.y }}
          transition={T.arc}
        />
      </Stage>
    </>
  );
}

/* 10 pulse + check */
function PulseDemo() {
  const [k, setK] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [done, setDone] = useState(0);
  return (
    <>
      <Button size="sm" onClick={() => setK((v) => v + 1)}>Replay mark</Button>
      <span data-success-demo className="inline-flex h-10 w-10 items-center justify-center">
        <SuccessMark key={k} active size={28} onDone={() => setDone((d) => d + 1)} />
      </span>
      <span className={`${DATA} text-xs text-silver`}>onDone ×{done}</span>
      <Button
        data-save-button
        variant="solid"
        loading={state === "loading"}
        success={state === "success"}
        onClick={() => {
          setState("loading");
          setTimeout(() => setState("success"), 900);
          setTimeout(() => setState("idle"), 2400);
        }}
      >
        Save changes
      </Button>
    </>
  );
}

/* 11 + 12 popovers */
function PopoverDemo({ side, align, label }: { side: "bottom" | "top" | "left" | "right"; align: "start" | "center" | "end"; label: string }) {
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const anchor = useRef<HTMLButtonElement | null>(null);
  const id = `pop-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <>
      <Button ref={anchor} size="sm" aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="dialog" onClick={() => setOpen((o) => !o)} data-popover-trigger={label}>
        {label}
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchorRef={anchor} side={side} align={align} ariaLabel={`${label} popover`} className="w-64 p-4" contentProps={{ id }}>
        <div className="flex flex-col gap-4">
          <p className={`${MONO} text-sm text-chalk`}>Scaled from 0.95, origin aimed at the trigger.</p>
          <Toggle label="Inside popover" size="sm" checked={on} onCheckedChange={setOn} />
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Popover>
    </>
  );
}

/* 13 no bounce */
function NoBounceDemo() {
  const x = useMotionValue(0);
  const [peak, setPeak] = useState(0);
  const target = useRef(0);
  useMotionValueEvent(x, "change", (v) => {
    if (target.current > 0) setPeak((p) => Math.max(p, v));
  });
  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          target.current = target.current ? 0 : 200;
          setPeak(0);
          animate(x, target.current, T.move);
        }}
      >
        Run T.move
      </Button>
      <Stage className="h-10 w-[232px]">
        <motion.span data-nobounce-marker className="absolute top-1/2 left-1 -mt-3 block h-6 w-6 rounded bg-chalk" style={{ x }} />
      </Stage>
      <span data-nobounce-peak className={`${DATA} text-xs text-silver`}>peak {peak.toFixed(2)} / 200</span>
    </>
  );
}

/* 14 overlap */
type Pane = "overview" | "specs" | "notes";
function OverlapDemo() {
  const [tab, setTab] = useState<Pane>("overview");
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Tabs
        idBase="demo-tabs"
        ariaLabel="Demo sections"
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "overview", label: "Overview" },
          { value: "specs", label: "Specs" },
          { value: "notes", label: "Notes" },
          { value: "locked" as Pane, label: "Locked", disabled: true },
        ]}
      />
      <div className={`${MONO} relative rounded-xl border border-steel p-5 text-sm text-silver`}>
        <TabPanel idBase="demo-tabs" value="overview" current={tab}>
          <p>Old and new panels crossfade at the same time; the old one is popped out of layout.</p>
        </TabPanel>
        <TabPanel idBase="demo-tabs" value="specs" current={tab}>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>Indicator: layoutId, T.move</li>
            <li>Panels: opacity, T.enter / T.exit</li>
            <li>Keys: ←/→, Home, End</li>
          </ul>
        </TabPanel>
        <TabPanel idBase="demo-tabs" value="notes" current={tab}>
          <p>Reduced motion: the indicator jumps and panels fade for 120 ms.</p>
        </TabPanel>
        <TabPanel idBase="demo-tabs" value={"locked" as Pane} current={tab}>
          <p>Locked</p>
        </TabPanel>
      </div>
    </div>
  );
}

/* 15 masks */
function MaskDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <ThemeToggle />
      <span className={`${MONO} text-xs text-silver`}>circular clip-path reveal ({DUR.theme} ms)</span>
      <Button
        data-loading-button
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
      >
        Masked label swap
      </Button>
    </>
  );
}

/* 16 icon crossfade */
function IconDemo() {
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <IconButton
        data-iconswap-button
        variant="outline"
        label={copied ? "Copied" : "Copy"}
        icon={<Copy />}
        swapIcon={<Check />}
        swapped={copied}
        onClick={() => setCopied((c) => !c)}
      />
      <IconButton label={playing ? "Pause" : "Play"} icon={<Play />} swapIcon={<Pause />} swapped={playing} onClick={() => setPlaying((p) => !p)} />
      <IconSwap swapped={playing} a={<span className={`${DATA} text-xs text-silver`}>idle</span>} b={<span className={`${DATA} text-xs text-chalk`}>live</span>} />
    </>
  );
}

/* 17 rubberband */
function RubberDemo() {
  const TRACK = 260;
  const BOX = 40;
  const max = TRACK - BOX;
  const LIMIT = 24;
  const x = useMotionValue(0);
  const [over, setOver] = useState(0);
  const [peakOver, setPeakOver] = useState(0);
  const start = useRef<{ px: number; x: number } | null>(null);
  useMotionValueEvent(x, "change", (v) => {
    const o = v < 0 ? -v : v > max ? v - max : 0;
    setOver(o);
    setPeakOver((p) => Math.max(p, o));
  });
  return (
    <>
      <Stage className="h-14" style={{ width: TRACK }}>
        <motion.span
          data-rubber-box
          role="presentation"
          className="absolute top-1/2 -mt-5 block h-10 w-10 cursor-grab touch-none rounded-lg bg-accent"
          style={{ x }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            x.stop();
            start.current = { px: e.clientX, x: x.get() };
          }}
          onPointerMove={(e) => {
            if (!start.current) return;
            x.set(rubberbandClamp(start.current.x + e.clientX - start.current.px, 0, max, LIMIT));
          }}
          onPointerUp={() => {
            start.current = null;
            const v = x.get();
            if (v < 0 || v > max) animate(x, v < 0 ? 0 : max, T.release);
          }}
        />
      </Stage>
      <span data-rubber-readout data-limit={LIMIT} data-peak={peakOver.toFixed(3)} className={`${DATA} text-xs text-silver`}>
        overshoot {over.toFixed(1)} px (peak {peakOver.toFixed(1)}, limit {LIMIT})
      </span>
    </>
  );
}

function ReducedRow() {
  const reduced = usePrefersReducedMotion();
  return (
    <span data-reduced={reduced ? "on" : "off"} className={`${DATA} text-xs text-silver`}>
      prefers-reduced-motion: {reduced ? "reduce (120 ms opacity fades, transforms jump)" : "no-preference"}
    </span>
  );
}

export default function MotionSandbox() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-24 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-3 pb-10">
        <p className={`${DATA} text-[10px] uppercase tracking-[0.2em] text-subtle`}>dev only · 404 in production</p>
        <h1 className="font-[family-name:var(--font-syne-family)] text-4xl font-extrabold tracking-tight text-chalk sm:text-5xl">Motion sandbox</h1>
        <p className={`${MONO} max-w-2xl text-sm text-silver`}>
          One demo per SPEC B rule. Ease-out {EASE_CSS.out}; ease-in-out {EASE_CSS.inOut}; press {PRESS_SCALE}.
        </p>
      </header>

      <Row n={1} demo="enter" rule="Ease-out for entrances" impl={`T.enter / V.fadeUp · ${DUR.enter} ms (200–300)`}><EnterDemo /></Row>
      <Row n={2} demo="move" rule="Ease-in-out for moves" impl={`T.move · ${DUR.move} ms (250–400)`}><MoveDemo /></Row>
      <Row n={3} demo="dropdown" rule="Dropdowns 150–250 ms" impl={`Select on Popover · open ${DUR.dropdown} ms; posts through a hidden input`}><DropdownDemo /></Row>
      <Row n={4} demo="exit" rule="Exits 20% faster than entrances" impl={`exitMs(): ${DUR.enter}→${exitMs(DUR.enter)}, ${DUR.dropdown}→${exitMs(DUR.dropdown)}, ${DUR.iconSwap}→${exitMs(DUR.iconSwap)} · Toast exits with T.exit`}><ExitDemo /></Row>
      <Row n={5} demo="press" rule="Scale to 0.97 on press" impl={`press-scale utility · ${DUR.pressIn} ms in, ${DUR.pressOut} ms out`}><PressDemo /></Row>
      <Row n={6} demo="held" rule="Don't tween while held" impl="Pointer bound via motionValue.set(); T.move only on release"><HeldDemo /></Row>
      <Row n={7} demo="knob" rule="Stretch moving knobs 12%" impl="Toggle: drag, click, Space or Enter · knobStretch('x')"><KnobDemo /></Row>
      <Row n={8} demo="stagger" rule="Stagger as details settle" impl={`settleDelay(step) · container, icon, label, details · ${STAGGER_MS} ms`}><StaggerDemo /></Row>
      <Row n={9} demo="arc" rule="Arcs for moving objects" impl="CSS offset-path from arcPath() · framer T.arc split x/y easing"><ArcDemo /></Row>
      <Row n={10} demo="pulse" rule="Pulse to confirm success" impl={`SuccessMark · ring ${DUR.pulse} ms, check mask ${DUR.check} ms after ${DUR.checkDelay} ms`}><PulseDemo /></Row>
      <Row n={11} demo="popover" rule="Start popovers at 0.95" impl="V.popover · scale 0.95 + opacity 0 → 1"><PopoverDemo side="bottom" align="start" label="Open popover" /></Row>
      <Row n={12} demo="origin" rule="Enter from trigger / exit to trigger" impl="originFromTrigger() on open and again on close; flips and clamps to the safe viewport">
        <PopoverDemo side="top" align="end" label="Top · end" />
        <PopoverDemo side="right" align="center" label="Right · center" />
      </Row>
      <Row n={13} demo="nobounce" rule="No bounce on everyday UI" impl="T.* only; springs are banned (lib/motion.test.ts)"><NoBounceDemo /></Row>
      <Row n={14} demo="overlap" rule="Overlap new and old states" impl="Tabs: panels crossfade together (AnimatePresence popLayout, never wait)"><OverlapDemo /></Row>
      <Row n={15} demo="mask" rule="Masks for reveals and occlusions" impl="Theme reveal (View Transitions clip-path), Button label clip-path, check draw"><MaskDemo /></Row>
      <Row n={16} demo="icon" rule="Crossfade icons with blur" impl={`IconSwap · opacity + blur(4px→0) + scale(0.8→1), ${DUR.iconSwap} ms`}><IconDemo /></Row>
      <Row n={17} demo="rubberband" rule="Rubberband past bounds" impl={`rubberbandClamp(limit 24) while dragging · T.release (${DUR.release} ms ease-out) back`}><RubberDemo /></Row>
      <Row n={18} demo="reduced" rule="Reduced motion" impl="MotionConfig reducedMotion='user' + useVariants + the CSS block in styles/motion.css"><ReducedRow /></Row>
    </div>
  );
}
