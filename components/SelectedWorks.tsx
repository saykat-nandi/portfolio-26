"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { caseStudies } from "@/content/portfolio";
import { polish } from "@/lib/polish";
import { playLatch, playTick } from "@/lib/relayClick";

const FEATURED = caseStudies.slice(0, 3);
const SOCIAL = caseStudies.find((c) => c.id === "social-engine");

type ViewportMode = "architecture" | "preview";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

function packetClass(spiking: boolean, loadSim: boolean) {
  if (!polish("worksPackets")) return undefined;
  const surge =
    loadSim || (spiking && polish("worksTopologyMorph"));
  return `arch-packet${surge ? " is-spiking" : ""}${loadSim ? " is-load-sim" : ""}`;
}

function ArchitectureDiagram({
  index,
  spiking,
  loadSim,
}: {
  index: number;
  spiking: boolean;
  loadSim: boolean;
}) {
  const pkt = packetClass(spiking, loadSim);
  const hot = loadSim ? "arch-node-hot" : undefined;
  const fire = polish("worksNodeFire") && polish("worksPackets");

  if (index === 0) {
    return (
      <svg
        viewBox="0 0 480 300"
        className={`h-full w-full arch-topology${polish("worksTopologyMorph") ? " arch-topology--morph" : ""}`}
        aria-hidden
      >
        <rect width="480" height="300" fill="var(--panel)" />
        <g
          fill="none"
          stroke="rgba(244,244,244,0.28)"
          strokeWidth="1.25"
          className="arch-nodes"
        >
          <rect
            x="28"
            y="48"
            width="88"
            height="44"
            rx="4"
            className={fire ? "arch-node-fire" : undefined}
            style={fire ? { animationDelay: "0s" } : undefined}
          />
          <rect
            x="148"
            y="48"
            width="88"
            height="44"
            rx="4"
            className={[hot, fire ? "arch-node-fire" : ""].filter(Boolean).join(" ") || undefined}
            style={fire ? { animationDelay: "0.35s" } : undefined}
          />
          <rect
            x="268"
            y="48"
            width="88"
            height="44"
            rx="4"
            className={fire ? "arch-node-fire" : undefined}
            style={fire ? { animationDelay: "0.7s" } : undefined}
          />
          <rect
            x="360"
            y="140"
            width="88"
            height="44"
            rx="4"
            className={fire ? "arch-node-fire" : undefined}
            style={fire ? { animationDelay: "1.05s" } : undefined}
          />
          <path d="M116 70 H148 M236 70 H268 M312 92 V140" />
          {pkt && (
            <>
              <path
                className={pkt}
                d="M116 70 H148"
                stroke="var(--signal)"
                strokeWidth="1.75"
              />
              <path
                className={pkt}
                d="M236 70 H268"
                stroke="var(--signal)"
                strokeWidth="1.75"
                style={{ animationDelay: "0.2s" }}
              />
              <path
                className={pkt}
                d="M312 92 V140"
                stroke="var(--signal)"
                strokeWidth="1.75"
                style={{ animationDelay: "0.4s" }}
              />
            </>
          )}
          <path
            d="M72 120 V180 H360"
            stroke="var(--signal)"
            strokeWidth="1.5"
            opacity="0.85"
            className={pkt}
          />
          <circle
            cx="106"
            cy="58"
            r="3.5"
            fill="var(--signal)"
            className={fire ? "arch-led-fire" : undefined}
            style={fire ? { animationDelay: "0s" } : undefined}
          />
          <circle
            cx="226"
            cy="58"
            r="3.5"
            fill="var(--signal)"
            className={[hot, fire ? "arch-led-fire" : ""].filter(Boolean).join(" ") || undefined}
            style={fire ? { animationDelay: "0.35s" } : undefined}
          />
          <circle
            cx="346"
            cy="58"
            r="3.5"
            fill="var(--signal)"
            className={fire ? "arch-led-fire" : undefined}
            style={fire ? { animationDelay: "0.7s" } : undefined}
          />
          <circle
            cx="438"
            cy="150"
            r="3.5"
            fill="var(--signal)"
            className={fire ? "arch-led-fire" : undefined}
            style={fire ? { animationDelay: "1.05s" } : undefined}
          />
        </g>
        <text
          x="72"
          y="73"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
        >
          STREAM
        </text>
        <text
          x="192"
          y="73"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
          className={hot}
        >
          VERIFY
        </text>
        <text
          x="312"
          y="73"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
        >
          BILL
        </text>
        <text
          x="404"
          y="165"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
        >
          OVERLAY
        </text>
        <text
          x="28"
          y="268"
          fill="rgba(244,244,244,0.4)"
          fontSize="11"
          fontFamily="var(--font-archivo), sans-serif"
        >
          BROADCAST → AD ENGINE → BILL → LIVE OVERLAY
        </text>
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg
        viewBox="0 0 480 300"
        className={`h-full w-full arch-topology${polish("worksTopologyMorph") ? " arch-topology--morph" : ""}`}
        aria-hidden
      >
        <rect width="480" height="300" fill="var(--panel)" />
        <g
          fill="none"
          stroke="rgba(244,244,244,0.28)"
          strokeWidth="1.25"
          className="arch-nodes"
        >
          <rect x="32" y="40" width="100" height="72" rx="4" />
          <rect
            x="190"
            y="40"
            width="100"
            height="72"
            rx="4"
            className={hot}
          />
          <rect x="348" y="40" width="100" height="72" rx="4" />
          <path d="M82 112 V150 H240 V112 M240 150 H398 V112" />
          {pkt && (
            <path
              className={pkt}
              d="M82 112 V150 H240 V112 M240 150 H398 V112"
              stroke="var(--signal)"
              strokeWidth="1.5"
            />
          )}
          <rect x="150" y="170" width="180" height="48" rx="4" className={hot} />
          <circle cx="122" cy="50" r="3.5" fill="var(--signal)" />
          <circle
            cx="280"
            cy="50"
            r="3.5"
            fill="var(--signal)"
            className={hot}
          />
          <circle cx="438" cy="50" r="3.5" fill="var(--signal)" />
          <circle cx="320" cy="180" r="3.5" fill="var(--signal)" className={hot} />
        </g>
        <text
          x="82"
          y="80"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
        >
          LOBBY
        </text>
        <text
          x="240"
          y="80"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
          className={hot}
        >
          ESCROW
        </text>
        <text
          x="398"
          y="80"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
        >
          BRACKET
        </text>
        <text
          x="240"
          y="198"
          textAnchor="middle"
          fill="rgba(244,244,244,0.55)"
          fontSize="9"
          fontFamily="var(--font-geist-mono), monospace"
        >
          PAYOUT
        </text>
        <text
          x="32"
          y="268"
          fill="rgba(244,244,244,0.4)"
          fontSize="11"
          fontFamily="var(--font-archivo), sans-serif"
        >
          WEBSOCKET LOBBY → ESCROW LOCK → BRACKET → PAYOUT
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 480 300"
      className={`h-full w-full arch-topology${polish("worksTopologyMorph") ? " arch-topology--morph" : ""}`}
      aria-hidden
    >
      <rect width="480" height="300" fill="var(--panel)" />
      <g
        fill="none"
        stroke="rgba(244,244,244,0.28)"
        strokeWidth="1.25"
        className="arch-nodes"
      >
        <rect x="36" y="56" width="70" height="100" rx="3" />
        <rect x="130" y="72" width="70" height="84" rx="3" />
        <rect x="224" y="48" width="70" height="108" rx="3" />
        <rect x="318" y="80" width="70" height="76" rx="3" />
        <path
          d="M71 168 V210 H353 V168"
          stroke="var(--signal)"
          strokeWidth="1.5"
          className={pkt}
        />
        <circle cx="96" cy="66" r="3.5" fill="var(--signal)" />
        <circle cx="190" cy="82" r="3.5" fill="var(--signal)" />
        <circle cx="284" cy="58" r="3.5" fill="var(--signal)" />
        <circle cx="378" cy="90" r="3.5" fill="var(--signal)" />
      </g>
      {/* Labels centered inside nodes — match 01 / 02 diagrams */}
      <text
        x="71"
        y="110"
        textAnchor="middle"
        fill="rgba(244,244,244,0.55)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), monospace"
      >
        CATALOG
      </text>
      <text
        x="165"
        y="118"
        textAnchor="middle"
        fill="rgba(244,244,244,0.55)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), monospace"
      >
        RENDER
      </text>
      <text
        x="259"
        y="106"
        textAnchor="middle"
        fill="rgba(244,244,244,0.55)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), monospace"
      >
        PACKAGE
      </text>
      <text
        x="353"
        y="122"
        textAnchor="middle"
        fill="rgba(244,244,244,0.55)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), monospace"
      >
        SHIP
      </text>
      <text
        x="36"
        y="268"
        fill="rgba(244,244,244,0.4)"
        fontSize="11"
        fontFamily="var(--font-archivo), sans-serif"
      >
        PUPPETEER WORKERS → RENDER → BUNDLE → STOREFRONT
      </text>
    </svg>
  );
}

const TRAFFIC_SEED = [
  { id: "t1", ip: "185.12.••.41", verdict: "human" as const },
  { id: "t2", ip: "45.88.••.203", verdict: "bot" as const },
  { id: "t3", ip: "102.44.••.17", verdict: "human" as const },
  { id: "t4", ip: "77.91.••.66", verdict: "bot" as const },
  { id: "t5", ip: "213.55.••.9", verdict: "human" as const },
  { id: "t6", ip: "91.200.••.112", verdict: "bot" as const },
];

function GoLivePreview() {
  const reduce = usePrefersReducedMotion();
  const [rows, setRows] = useState(TRAFFIC_SEED.slice(0, 4));
  const [budget, setBudget] = useState(62);
  const tick = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      tick.current += 1;
      const next = TRAFFIC_SEED[tick.current % TRAFFIC_SEED.length];
      setRows((prev) =>
        [{ ...next, id: `${next.id}-${tick.current}` }, ...prev].slice(0, 5)
      );
      setBudget((b) => Math.max(18, Math.min(92, b + (tick.current % 2 ? -3 : 4))));
    }, 1400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex h-full flex-col gap-3 bg-ink p-4 font-mono text-[10px] sm:p-5">
      <div className="flex items-center justify-between text-zinc-500">
        <span className="tracking-[0.14em]">AD-CONTROL // VERIFY FEED</span>
        <span className="text-signal">OVERLAY SYNC · OK</span>
      </div>

      <div className="space-y-1.5 overflow-hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between border border-white/8 bg-panel px-2.5 py-1.5"
          >
            <span className="text-zinc-400">{row.ip}</span>
            {row.verdict === "human" ? (
              <span className="text-on-ink">HUMAN // VERIFIED</span>
            ) : (
              <span className="text-signal">BOT // BLOCKED</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-1.5">
        <div className="flex justify-between text-zinc-500">
          <span>CAMPAIGN BUDGET</span>
          <span className="text-on-ink">{budget}%</span>
        </div>
        <div className="h-1.5 overflow-hidden bg-white/10">
          <div
            className="h-full bg-signal transition-[width] duration-500"
            style={{ width: `${budget}%` }}
          />
        </div>
        <p className="text-[9px] tracking-wide text-zinc-600">
          BROADCAST OVERLAY · LIVE TRIGGER ARMED
        </p>
      </div>
    </div>
  );
}

const ESCROW_STEPS = [
  { key: "entry", label: "ENTRY LOCKED", detail: "Coin escrow hold · 500 CR" },
  { key: "lobby", label: "WS LOBBY (14ms)", detail: "Match room synced · pusher" },
  { key: "kyc", label: "KYC VERIFIED", detail: "Identity gate cleared" },
  { key: "payout", label: "PAYOUT RELEASED", detail: "Winner wallet credited" },
] as const;

function EsportsPreview() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex h-full flex-col gap-3 bg-ink p-4 font-mono text-[10px] sm:p-5">
      <div className="flex items-center justify-between text-zinc-500">
        <span className="tracking-[0.14em]">1v1 MATCH // COIN-ESCROW</span>
        <span className="text-zinc-400">
          STEP {step + 1}/{ESCROW_STEPS.length}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-2 content-start">
        {ESCROW_STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(i)}
              className={`w-full border px-3 py-2.5 text-left transition-[border-color,background,color] duration-200 ${
                active
                  ? "border-signal/70 bg-signal/10 text-on-ink"
                  : done
                    ? "border-white/15 bg-panel text-zinc-300"
                    : "border-white/8 bg-panel text-zinc-500"
              }`}
            >
              <span className="block tracking-[0.12em]">
                {done ? "✓ " : active ? "● " : "○ "}
                {s.label}
              </span>
              <span className="mt-1 block text-[9px] text-zinc-500">
                {s.detail}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setStep((s) => (s + 1) % ESCROW_STEPS.length)}
        className="mt-auto h-9 border border-signal/45 bg-signal/10 text-[11px] tracking-[0.12em] text-signal transition-colors [@media(hover:hover)]:hover:bg-signal/18"
      >
        ADVANCE STATE →
      </button>
    </div>
  );
}

const CLI_LINES = [
  "$ node packager run --catalog forms.json",
  "› launching puppeteer workers ×4",
  "› render  sku:form-01  ok  182ms",
  "› render  sku:form-14  ok  201ms",
  "› qa      contrast+schema  pass",
  "› package sku:form-01 → bundle.zip",
  "› package sku:form-14 → bundle.zip",
  "› render  sku:form-28  ok  176ms",
  "› qa      a11y+fields     pass",
  "› VALIDATED  42/60 bundles",
  "› VALIDATED  58/60 bundles",
  "✓ 60/60 BUNDLES VALIDATED",
];

function PackagerPreview() {
  const reduce = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduce ? CLI_LINES.length : 4);

  useEffect(() => {
    if (reduce) {
      setVisible(CLI_LINES.length);
      return;
    }
    setVisible(4);
    const id = window.setInterval(() => {
      setVisible((n) => (n >= CLI_LINES.length ? 4 : n + 1));
    }, 700);
    return () => window.clearInterval(id);
  }, [reduce]);

  const lines = CLI_LINES.slice(0, visible);

  return (
    <div className="flex h-full flex-col bg-ink p-4 font-mono text-[10px] leading-relaxed sm:p-5">
      <div className="mb-3 flex items-center justify-between text-zinc-500">
        <span className="tracking-[0.14em]">HEADLESS // PUPPETEER CLI</span>
        <span className="text-signal">
          {visible >= CLI_LINES.length ? "60/60 OK" : "RUNNING"}
        </span>
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-hidden text-zinc-400">
        {lines.map((line, i) => (
          <p
            key={`${line}-${i}`}
            className={
              line.startsWith("✓")
                ? "text-signal"
                : line.startsWith("$")
                  ? "text-on-ink"
                  : undefined
            }
          >
            {line}
          </p>
        ))}
        {!reduce && visible < CLI_LINES.length && (
          <span className="inline-block h-3 w-1.5 animate-pulse bg-signal" />
        )}
      </div>
    </div>
  );
}

function LivePreview({ index }: { index: number }) {
  if (index === 0) return <GoLivePreview />;
  if (index === 1) return <EsportsPreview />;
  return <PackagerPreview />;
}

function SpecStrip({
  domain,
  mechanic,
  scale,
}: {
  domain: string;
  mechanic: string;
  scale: string;
}) {
  const cells = [
    { label: "DOMAIN", value: domain },
    { label: "CORE MECHANIC", value: mechanic },
    { label: "SCALE / OUTPUT", value: scale },
  ];

  return (
    <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
      {cells.map((cell) => (
        <div key={cell.label} className="bg-panel px-3 py-3 sm:px-4">
          <p className="font-mono text-[9px] tracking-[0.16em] text-signal">
            {cell.label}
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-on-ink/90 sm:text-[13px]">
            {cell.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function SelectedWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<ViewportMode>("architecture");
  const [spiking, setSpiking] = useState(false);
  const [loadSim, setLoadSim] = useState(false);
  const [workVisible, setWorkVisible] = useState(false);
  const latencyRef = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const prevActive = useRef(active);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setWorkVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    // Center-screen tripwire — survives Lenis flick scrolls past short cards
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(
                a.boundingClientRect.top +
                  a.boundingClientRect.height / 2 -
                  window.innerHeight / 2
              ) -
              Math.abs(
                b.boundingClientRect.top +
                  b.boundingClientRect.height / 2 -
                  window.innerHeight / 2
              )
          );
        if (!visible[0]) return;
        const idx = Number((visible[0].target as HTMLElement).dataset.index);
        if (!Number.isNaN(idx)) setActive(idx);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-45% 0px -45% 0px",
      }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    playTick();
    if (!polish("worksTopologyMorph") || reduce) return;
    setSpiking(true);
    const t = window.setTimeout(() => setSpiking(false), 400);
    return () => window.clearTimeout(t);
  }, [active, reduce]);

  useEffect(() => {
    const el = latencyRef.current;
    if (!loadSim || reduce || !polish("worksLoadSimulate")) {
      if (el) el.textContent = "18ms";
      return;
    }
    let raf = 0;
    let t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const wave = Math.sin(t * 4.2) * 0.5 + Math.sin(t * 7.1) * 0.5;
      if (el) {
        el.textContent = `${Math.round(30 + wave * 12 + Math.random() * 4)}ms`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loadSim, reduce]);

  const study = FEATURED[active] ?? FEATURED[0];
  const canSimulate = polish("worksLoadSimulate") && !reduce;

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`relative z-20 bg-ink text-on-ink${
        workVisible ? "" : " works-ambient-paused"
      }`}
      aria-label="Selected works"
    >
      <div
        className="page-rail section-pad-y"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5 sm:mb-14 sm:pb-6">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal align-middle" />
              02 / SELECTED WORKS
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,6vw,2.75rem)] font-medium tracking-[-0.03em]">
              Systems that held under real traffic
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-zinc-400 sm:text-sm">
            Scroll the case studies — toggle architecture vs live preview for
            the system in focus.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-14">
          <aside
            className="lg:sticky lg:self-start"
            style={{ top: "var(--sticky-top)" }}
          >
            <div className="overflow-hidden rounded-[6px] border border-white/10 bg-panel shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4">
                <span className="font-mono text-[10px] tracking-[0.16em] text-zinc-500">
                  {study.number} /{" "}
                  {mode === "architecture" ? "LIVE ARCHITECTURE" : "LIVE PREVIEW"}
                </span>
                <div
                  className="inline-flex items-center gap-1 border border-white/12 bg-ink p-0.5 font-mono text-[9px] tracking-[0.12em]"
                  role="tablist"
                  aria-label="Viewport mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "architecture"}
                    onClick={() => setMode("architecture")}
                    className={`px-2.5 py-1 transition-colors ${
                      mode === "architecture"
                        ? "bg-signal text-ink"
                        : "text-zinc-500 [@media(hover:hover)]:hover:text-zinc-300"
                    }`}
                  >
                    [ ARCHITECTURE ]
                  </button>
                  <span className="text-zinc-700" aria-hidden>
                    |
                  </span>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "preview"}
                    onClick={() => setMode("preview")}
                    className={`px-2.5 py-1 transition-colors ${
                      mode === "preview"
                        ? "bg-signal text-ink"
                        : "text-zinc-500 [@media(hover:hover)]:hover:text-zinc-300"
                    }`}
                  >
                    [ LIVE PREVIEW ]
                  </button>
                </div>
              </div>

              {canSimulate && mode === "architecture" ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/25 px-3 py-2 sm:px-4">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 font-mono text-[9px] tracking-[0.14em] text-zinc-400">
                    <span
                      className={`ccu-toggle${loadSim ? " is-on" : ""}`}
                      aria-hidden
                    >
                      <span className="ccu-toggle-knob" />
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={loadSim}
                      onChange={(e) => {
                        setLoadSim(e.target.checked);
                        playLatch();
                      }}
                      aria-label="Simulate 10K CCU load"
                    />
                    <span>
                      SIMULATE // 10K CCU{" "}
                      <span className={loadSim ? "text-signal" : "text-zinc-600"}>
                        {loadSim ? "ON" : "OFF"}
                      </span>
                    </span>
                  </label>
                  <p className="font-mono text-[9px] tracking-[0.12em] text-zinc-500">
                    LAT{" "}
                    <span
                      ref={latencyRef}
                      className={
                        loadSim ? "text-signal tabular-nums" : "text-zinc-400"
                      }
                    >
                      18ms
                    </span>
                    <span className="mx-1.5 text-zinc-700">·</span>
                    PKT{" "}
                    <span className={loadSim ? "text-signal" : "text-zinc-400"}>
                      {loadSim ? "SURGE" : "IDLE"}
                    </span>
                  </p>
                </div>
              ) : null}

              <div className="aspect-[480/300] w-full">
                {mode === "architecture" ? (
                  <div
                    key={active}
                    className={
                      polish("worksTopologyMorph")
                        ? "h-full w-full arch-topology-swap"
                        : "h-full w-full animate-[shippedFade_380ms_ease-out]"
                    }
                  >
                    <ArchitectureDiagram
                      index={active}
                      spiking={spiking}
                      loadSim={loadSim && canSimulate}
                    />
                  </div>
                ) : (
                  <div
                    key={`preview-${active}`}
                    className="h-full w-full animate-[shippedFade_380ms_ease-out]"
                  >
                    <LivePreview index={active} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 border-t border-white/10 px-4 py-4">
                <p className="font-[family-name:var(--font-archivo)] text-lg font-semibold tracking-[-0.03em]">
                  {study.title.split("—")[0]?.trim()}
                </p>
                <p className="font-mono text-[11px] tracking-[0.08em] text-signal">
                  {study.diagramLabel}
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-8 lg:space-y-12">
            {FEATURED.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                data-index={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                style={
                  {
                    scrollMarginTop: "6rem",
                  } as CSSProperties
                }
                className={`rounded-[6px] border p-5 transition-[border-color,background,box-shadow] duration-300 sm:p-7 md:p-8 ${
                  active === index
                    ? "border-signal/45 bg-panel shadow-[inset_3px_0_0_0_var(--signal)]"
                    : "border-white/10 bg-panel"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-zinc-500">
                    {item.number} / SHIPPED
                  </p>
                  <p className="text-xs text-zinc-500">{item.role}</p>
                </div>

                <h3 className="mt-4 font-[family-name:var(--font-archivo)] text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold tracking-[-0.03em]">
                  {item.title}
                </h3>

                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                  The Bottleneck
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:text-[15px]">
                  {item.problem}
                </p>

                <SpecStrip
                  domain={item.specs.domain}
                  mechanic={item.specs.mechanic}
                  scale={item.specs.scale}
                />

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                  System Architecture &amp; Execution
                </p>
                <ul className="mt-3 space-y-3">
                  {item.built.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-4 text-sm leading-relaxed text-on-ink/90 before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:bg-signal md:text-[15px]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {item.stack.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(index);
                      setMode("architecture");
                    }}
                    className="inline-flex h-10 items-center rounded-[6px] border border-white/15 bg-white/5 px-4 text-[12px] font-medium text-on-ink transition-[background,border-color,box-shadow] duration-200 [@media(hover:hover)]:hover:border-signal/50 [@media(hover:hover)]:hover:shadow-[0_0_0_1px_var(--signal)]"
                  >
                    Inspect architecture ↗
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(index);
                      setMode("preview");
                    }}
                    className="inline-flex h-10 items-center rounded-[6px] border border-signal/40 bg-signal/10 px-4 text-[12px] font-medium text-signal transition-[background,border-color] duration-200 [@media(hover:hover)]:hover:bg-signal/18"
                  >
                    Open live preview ↗
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {SOCIAL ? (
          <div className="mt-14 border-t border-white/10 pt-10 sm:mt-16">
            <div className="rounded-[6px] border border-white/10 bg-panel p-5 sm:p-6 md:max-w-2xl">
              <p className="font-mono text-[10px] tracking-[0.16em] text-signal">
                {SOCIAL.number} // SECONDARY SYSTEM
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-archivo)] text-lg font-semibold tracking-[-0.03em] sm:text-xl">
                {SOCIAL.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {SOCIAL.problem}
              </p>
              <ul className="mt-4 space-y-2">
                {SOCIAL.built.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 text-sm text-on-ink/85 before:absolute before:left-0 before:top-[0.45em] before:h-1.5 before:w-1.5 before:bg-signal"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {SOCIAL.stack.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/12 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
