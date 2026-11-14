"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  usePrefersReducedMotion,
  useRecorderMode,
} from "@/components/orvante/useU";
import { polish } from "@/lib/polish";
import { playTick } from "@/lib/relayClick";

const STACK = [
  { short: "TS", name: "TypeScript", tag: "Typed full-stack contracts" },
  { short: "Next", name: "Next.js", tag: "App Router production surfaces" },
  { short: "Node", name: "Node.js", tag: "Workers & headless pipelines" },
  { short: "PHP", name: "PHP", tag: "Ad-control & tournament backends" },
  { short: "WS", name: "WebSockets", tag: "Lobby state sync <20ms" },
  { short: "PG", name: "PostgreSQL", tag: "Relational escrow schemas" },
  { short: "Pupp", name: "Puppeteer", tag: "Headless QA at scale" },
  { short: "TW", name: "Tailwind", tag: "Dense product UI systems" },
] as const;

/** Dependency map for hover coupling traces */
const STACK_DEPS: Record<string, readonly string[]> = {
  Next: ["TS", "Node"],
  Node: ["TS", "PG", "Pupp"],
  WS: ["Node", "PG"],
  PHP: ["PG"],
  Pupp: ["Node", "TS"],
  TW: ["Next", "TS"],
  TS: ["Next", "Node"],
  PG: ["Node", "PHP"],
};

const LAB_BUILDS = [
  {
    id: "ffb",
    title: "DIY Force-Feedback Racing Wheel",
    status: "ENCODER · LIVE",
  },
  {
    id: "mtm",
    title: "Dual-MTM Acoustic Tower System",
    status: "XO · TUNED",
  },
  {
    id: "peltier",
    title: "Thermoelectric Peltier Cooling Rigs",
    status: "ΔT · ACTIVE",
  },
] as const;

type LabId = (typeof LAB_BUILDS)[number]["id"];

const TRACK_RECORD = [
  {
    index: "01",
    label: "PRODUCTION EXPERIENCE",
    title: "Cyprus Technology Team",
    body: "Shipping custom web platforms, ad-control dashboards, and backend APIs in asynchronous remote product workflows.",
  },
  {
    index: "02",
    label: "CORE ARCHITECTURE",
    title: "Real-Time & Transactional Systems",
    body: "Designing relational schemas, WebSocket match lobbies, escrow wallet locks, KYC verification, and headless automation.",
  },
  {
    index: "03",
    label: "PRODUCT & BUSINESS LENS",
    title: "Engineering + BBA Foundation",
    body: "Combining Bachelor of Business Administration training with full-stack engineering to build around retention and monetization.",
  },
] as const;

function CountUp({
  value,
  suffix = "",
  active,
}: {
  value: number;
  suffix?: string;
  active: boolean;
}) {
  const [n, setN] = useState(0);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, value]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

/** Puppeteer worker queue / bundle throughput — matches 60+ automation caption */
function PuppeteerBundlesSchematic() {
  const reduce = usePrefersReducedMotion();

  return (
    <svg viewBox="0 0 200 120" className="ov-schematic" aria-hidden>
      <text x="8" y="14" className="ov-schematic-label">
        WORKER QUEUE · PUPPETEER
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={12 + i * 28}
          y={28}
          width={22}
          height={14}
          rx={2}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.1"
        />
      ))}
      <path
        className={reduce ? undefined : "ov-schematic-draw"}
        d="M122 35 H148 V42"
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <rect
        x="148"
        y="36"
        width="40"
        height="28"
        rx={2}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.35"
      />
      <text x="152" y="54" className="ov-schematic-label" fontSize="7">
        RENDER
      </text>
      <text x="8" y="78" className="ov-schematic-label">
        BUNDLE THROUGHPUT / RUN
      </text>
      <path
        className={
          reduce ? undefined : "ov-schematic-draw ov-schematic-draw--slow"
        }
        d="M12 100 H40 V88 H68 V104 H96 V84 H124 V100 H152 V90 H188"
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.55"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Section 4 — panoramic engineering bento (#stack), after Selected Works. */
export function OrvanteTrust() {
  const rootRef = useRef<HTMLElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [docked, setDocked] = useState(false);
  const [hoveredStack, setHoveredStack] = useState<string | null>(null);
  const [scanFocus, setScanFocus] = useState<string>("Next");
  const [labBuild, setLabBuild] = useState<LabId>("ffb");
  const [glassPin, setGlassPin] = useState<"stack" | "lab" | null>(null);
  const [glassLive, setGlassLive] = useState(false);
  const [glassTilt, setGlassTilt] = useState({ x: 0, y: 0 });
  const cardsRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const rec = useRecorderMode();
  const scanKeys = ["Next", "WS", "Pupp", "PHP", "TW"] as const;

  const onGlassPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = glassRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1;
    const y = ((e.clientY - r.top) / Math.max(r.height, 1)) * 2 - 1;
    setGlassLive(true);
    setGlassTilt({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  };

  const onGlassPointerLeave = () => {
    setGlassLive(false);
    setGlassTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ambientIo = new IntersectionObserver(
      ([entry]) => setAmbientOn(entry.isIntersecting),
      { rootMargin: "100px 0px", threshold: 0.05 }
    );
    ambientIo.observe(root);

    if (reduce) {
      setActive(true);
      setDocked(true);
      return () => ambientIo.disconnect();
    }

    if (rec) {
      const t = window.setTimeout(() => {
        setActive(true);
        setDocked(true);
      }, 3500);
      return () => {
        window.clearTimeout(t);
        ambientIo.disconnect();
      };
    }

    const dockIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        setDocked(true);
        dockIo.disconnect();
      },
      { threshold: 0.2 }
    );
    dockIo.observe(root);

    return () => {
      dockIo.disconnect();
      ambientIo.disconnect();
    };
  }, [reduce, rec]);

  useEffect(() => {
    if (!polish("stackIdleScan") || reduce || !active) return;
    // Pause idle scanner while the pointer is on a cell
    if (hoveredStack) return;
    let i = Math.max(0, scanKeys.indexOf(scanFocus as (typeof scanKeys)[number]));
    const id = window.setInterval(() => {
      i = (i + 1) % scanKeys.length;
      setScanFocus(scanKeys[i]);
    }, 2500);
    return () => window.clearInterval(id);
    // scanFocus intentionally omitted — resume from last index, don't restart loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, hoveredStack, reduce]);

  const focusKey = hoveredStack ?? (polish("stackIdleScan") ? scanFocus : null);
  const hovered = STACK.find((s) => s.short === focusKey);
  const deps =
    polish("stackDependencyHover") && focusKey
      ? (STACK_DEPS[focusKey] ?? [])
      : [];
  const hoverTag = hovered
    ? deps.length
      ? `${hovered.tag} · deps: ${deps.join(", ")}`
      : hovered.tag
    : polish("stackIdleScan")
      ? "Scanning capability clusters…"
      : "Hover a cell for capability focus";

  return (
    <section
      id="stack"
      ref={rootRef}
      className={`ov-trust${ambientOn ? " is-ambient" : ""}`}
      aria-label="Engineering stack and hardware lab"
    >
      <div
        className={`ov-trust-panel${
          polish("stackSlabDock") ? " polish-dock" : ""
        }${docked || !polish("stackSlabDock") ? " is-docked" : ""}`}
        ref={cardsRef}
      >
        {/* Col 1 — copy */}
        <div className="ov-trust-left">
          <div className="ov-trust-heading">
            <h2 className="ov-trust-title">
              <span className="ov-trust-line">Engineered for</span>
              <span className="ov-trust-line">real-world load.</span>
            </h2>
          </div>
          <p className="ov-trust-copy">
            Full-Stack Software Engineer shipping production platforms and
            backend architectures for an international technology team in
            Cyprus—real-time systems, ad-tech panels, and automation under load.
          </p>
        </div>

        {/* Col 2 — glass gutter (mockup: between copy and bento) */}
        <div
          ref={glassRef}
          className={`ov-glass-stack${glassLive ? " is-live" : ""}`}
          style={
            {
              "--gx": glassTilt.x,
              "--gy": glassTilt.y,
            } as CSSProperties
          }
          onPointerMove={onGlassPointerMove}
          onPointerLeave={onGlassPointerLeave}
        >
          <button
            type="button"
            className={`ov-glass ov-glass-a${
              glassPin === "stack" ? " is-active" : ""
            }`}
            aria-label="Focus production stack matrix"
            aria-pressed={glassPin === "stack"}
            onClick={() => {
              setGlassPin((p) => (p === "stack" ? null : "stack"));
              setScanFocus("Next");
              playTick();
            }}
          >
            ✳
          </button>
          <button
            type="button"
            className={`ov-glass ov-glass-b${
              glassPin === "lab" ? " is-active" : ""
            }`}
            aria-label="Focus hardware lab builds"
            aria-pressed={glassPin === "lab"}
            onClick={() => {
              setGlassPin((p) => (p === "lab" ? null : "lab"));
              setLabBuild((id) => {
                const idx = LAB_BUILDS.findIndex((b) => b.id === id);
                return LAB_BUILDS[(idx + 1) % LAB_BUILDS.length].id;
              });
              playTick();
            }}
          >
            <i />
            <i />
            <i />
            <i />
          </button>
        </div>

        {/* Cols 3–5 — equal bento cards */}
        <div
          className={`ov-card ov-card-stack ${active ? "is-on" : ""}${
            glassPin === "stack" ? " is-glass-pinned" : ""
          }`}
        >
            <div
              className="ov-glyphs"
              role="list"
              aria-label="Core stack"
              onMouseLeave={() => setHoveredStack(null)}
            >
              {STACK.map((item, i) => (
                <button
                  key={item.short}
                  type="button"
                  role="listitem"
                  className={`ov-glyph ${
                    focusKey === item.short ? "is-hot" : ""
                  } ${polish("bentoPress") ? "polish-press" : ""}`}
                  style={
                    {
                      "--enter-delay": `${i * 45}ms`,
                    } as CSSProperties
                  }
                  onMouseEnter={() => setHoveredStack(item.short)}
                  onFocus={() => setHoveredStack(item.short)}
                  onClick={() => {
                    setHoveredStack(item.short);
                    playTick();
                  }}
                  aria-label={`${item.name}: ${item.tag}`}
                  aria-pressed={focusKey === item.short}
                >
                  <span className="ov-glyph-led" aria-hidden />
                  <span className="ov-glyph-label">{item.short}</span>
                </button>
              ))}
            </div>
            <p className="ov-glyph-tag">{hoverTag}</p>
            <div className="ov-card-stat">
              <strong>
                <CountUp value={4} suffix="+" active={active} />
              </strong>
              <span>Flagship Production Systems</span>
            </div>
          </div>

          {/* Card 2 — Hardware lab selector */}
          <div
            className={`ov-card ov-card-lab ${active ? "is-on" : ""}${
              glassPin === "lab" ? " is-glass-pinned" : ""
            }`}
          >
            <div className="ov-lab-head">
              <div className="ov-card-stat light">
                <strong>
                  <CountUp value={LAB_BUILDS.length} active={active} />
                </strong>
                <span>Hardware Lab Builds</span>
              </div>
              <div className="ov-seal ov-seal-signal" aria-hidden>
                <svg viewBox="0 0 96 96">
                  <rect
                    x="10"
                    y="10"
                    width="76"
                    height="76"
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.25"
                  />
                  <rect
                    x="22"
                    y="22"
                    width="52"
                    height="52"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M48 28 L52 44 L68 44 L55 54 L60 70 L48 60 L36 70 L41 54 L28 44 L44 44 Z"
                    fill="var(--signal)"
                  />
                </svg>
                <span>EMBEDDED // &apos;26</span>
              </div>
            </div>
            <ul className="ov-lab-rows">
              {LAB_BUILDS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={labBuild === item.id ? "is-active" : undefined}
                    onClick={() => {
                      setLabBuild(item.id);
                      playTick();
                    }}
                    onMouseEnter={() => setLabBuild(item.id)}
                  >
                    <span className="ov-lab-row-title">{item.title}</span>
                    <span className="ov-lab-row-status">{item.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3 — Puppeteer automation (not hardware telemetry) */}
          <div className="ov-card ov-card-schematic">
            <div className="ov-schematic-meta">
              <span>NODE · HEADLESS QA</span>
            </div>
            <div className="ov-schematic-wrap">
              <PuppeteerBundlesSchematic />
            </div>
            <div className="ov-eq ov-eq--marquee" aria-hidden>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <span
                  key={i}
                  className="ov-eq-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <div className="ov-card-stat light">
              <strong>
                <CountUp value={60} suffix="+" active={active} />
              </strong>
              <span>Automated Product Bundles</span>
              <p className="ov-schematic-status">
                Puppeteer workers · form packaging pipeline
              </p>
            </div>
          </div>
      </div>

      <div className="ov-track-record">
        {TRACK_RECORD.map((col) => (
          <div key={col.index} className="ov-track-col">
            <p className="ov-track-index">
              {col.index} // {col.label}
            </p>
            <h3>{col.title}</h3>
            <p>{col.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
