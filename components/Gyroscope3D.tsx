"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

interface Gyroscope3DProps {
  className?: string;
}

const NODES = [
  {
    id: "alpha",
    label: "NODE_ALPHA // LATENCY: <12ms",
    period: 8.7,
    startDeg: (0.4 * 180) / Math.PI,
    ping: true,
  },
  {
    id: "socket",
    label: "SOCKET_PUB // 240 FPS",
    period: 15,
    startDeg: (2.8 * 180) / Math.PI,
    ping: false,
  },
  {
    id: "packet",
    label: "PACKET_STREAM // OK",
    period: 26.2,
    startDeg: (4.7 * 180) / Math.PI,
    ping: false,
  },
] as const;

/** Outer lens-barrel stack ticker */
const LENS_STACK = [
  "NODE.JS",
  "WEBSOCKETS",
  "TYPESCRIPT",
  "POSTGRESQL",
  "PHP",
  "PUPPETEER",
  "TAILWIND",
] as const;

/** Lens radius as % of rig (292 / 680) */
const LENS_R_PCT = ((292 / 680) * 100).toFixed(3);

/** Radius as fraction of rig (280 / 680) */
const ORBIT_R_PCT = ((280 / 680) * 100).toFixed(3);

/**
 * Flat orbital field. Phase via negative animation-delay (compositor-friendly).
 * Pauses when off-screen or hero exit covered.
 */
export default function Gyroscope3D({ className = "" }: Gyroscope3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const [clickPing, setClickPing] = useState(0);
  const pingClear = useRef(0);
  const reduceRef = useRef(false);

  const spawnClickPing = useCallback(() => {
    if (reduceRef.current) return;
    setClickPing((n) => n + 1);
    window.clearTimeout(pingClear.current);
    pingClear.current = window.setTimeout(() => setClickPing(0), 1800);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    reduceRef.current = prefersReduced;
    setReduce(prefersReduced);

    const heroEl = stage.closest("section");
    const exitEl = stage.closest("[data-hero-exit]");

    const syncPaused = () => {
      const covered = !!exitEl?.hasAttribute("data-exit-covered");
      const hidden = !stage.classList.contains("gyro-visible") || covered;
      stage.classList.toggle("gyro-paused", hidden);
    };

    const onHeroClick = (e: MouseEvent) => {
      if (prefersReduced) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, input, textarea, [role='button']")) return;
      spawnClickPing();
    };

    heroEl?.addEventListener("click", onHeroClick);
    window.addEventListener("scroll", syncPaused, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        stage.classList.toggle("gyro-visible", entry.isIntersecting);
        syncPaused();
      },
      { threshold: 0.05 }
    );
    io.observe(stage);
    stage.classList.add("gyro-visible");
    syncPaused();

    return () => {
      window.clearTimeout(pingClear.current);
      io.disconnect();
      window.removeEventListener("scroll", syncPaused);
      heroEl?.removeEventListener("click", onHeroClick);
    };
  }, [spawnClickPing]);

  const eastLeft = `calc(50% + ${ORBIT_R_PCT}%)`;
  const westLeft = `calc(50% - ${ORBIT_R_PCT}%)`;

  return (
    <div
      ref={stageRef}
      className={`gyro-orbit-stage relative flex aspect-square w-full items-center justify-center overflow-hidden select-none ${className}`}
      style={{ contain: "layout style paint" }}
      aria-hidden
    >
      {clickPing > 0 ? (
        <div
          key={clickPing}
          className="gyro-ping-circle gyro-ping-click pointer-events-none absolute left-1/2 top-1/2 h-[29%] w-[29%]"
        />
      ) : null}

      <div className="relative flex h-[85%] w-[85%] items-center justify-center">
        <div
          className="pointer-events-none absolute rounded-full border-2 border-[#FF5722]"
          style={{ width: "82.35%", height: "82.35%" }}
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 680 680"
          fill="none"
          aria-hidden
        >
          <line
            x1="340"
            y1="50"
            x2="340"
            y2="630"
            stroke="#FF5722"
            strokeWidth="0.75"
            strokeOpacity="0.25"
            strokeDasharray="3 6"
          />
          <line
            x1="50"
            y1="340"
            x2="630"
            y2="340"
            stroke="#FF5722"
            strokeWidth="0.75"
            strokeOpacity="0.25"
            strokeDasharray="3 6"
          />
          <line x1="340" y1="52" x2="340" y2="68" stroke="#FF5722" strokeWidth="2.5" />
          <line x1="340" y1="612" x2="340" y2="628" stroke="#FF5722" strokeWidth="2.5" />
          <line x1="52" y1="340" x2="68" y2="340" stroke="#FF5722" strokeWidth="2.5" />
          <line x1="612" y1="340" x2="628" y2="340" stroke="#FF5722" strokeWidth="2.5" />
        </svg>

        <div
          className={`pointer-events-none absolute flex h-[86.8%] w-[86.8%] items-center justify-center rounded-full border border-dashed border-black/20 ${reduce ? "" : "gyro-spin-reverse"}`}
        >
          <div className="absolute -top-1.5 h-3 w-3 rounded-full bg-black/30" />
          <div className="absolute -bottom-1.5 h-3 w-3 rounded-full bg-black/30" />
        </div>

        {/* Inner reticle ring (static) */}
        <div className="pointer-events-none absolute h-[77.9%] w-[77.9%] rounded-full border border-black/15" />

        {/* Lens barrel track hairline */}
        <div
          className="pointer-events-none absolute rounded-full border border-black/20"
          style={{ width: "85.9%", height: "85.9%" }}
        />

        {/* Lens barrel — upright stack labels, clockwise 120s */}
        <div
          className={`pointer-events-none absolute inset-0 ${reduce ? "" : "gyro-lens-spin"}`}
          aria-hidden
        >
          {LENS_STACK.map((skill, i) => {
            const angle = (i / LENS_STACK.length) * 360;
            const xhAngle = angle + 180 / LENS_STACK.length;
            return (
              <div key={skill}>
                {/* Slot label — counter-rotated so it stays screen-upright */}
                <div
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
                    style={{ top: `calc(50% - ${LENS_R_PCT}%)` }}
                  >
                    <div
                      className={reduce ? undefined : "gyro-lens-counter"}
                      style={
                        {
                          ["--lens-slot" as string]: `${angle}deg`,
                          ...(reduce
                            ? { transform: `rotate(${-angle}deg)` }
                            : undefined),
                        } as CSSProperties
                      }
                    >
                      <span className="gyro-lens-label inline-flex items-center gap-1 whitespace-nowrap rounded-[3px] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.12em] text-ink/80 shadow-[0_0_0_1px_rgba(17,17,17,0.08)] sm:text-[10px] sm:tracking-[0.14em]">
                        <span className="text-signal" aria-hidden>
                          +
                        </span>
                        {skill}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Technical crosshair between slots */}
                <div
                  className="absolute inset-0"
                  style={{ transform: `rotate(${xhAngle}deg)` }}
                >
                  <div
                    className="absolute left-1/2 top-[calc(50%-42.9%)] h-3 w-px -translate-x-1/2 bg-black/40"
                  />
                  <div
                    className="absolute left-1/2 top-[calc(50%-42.9%)] h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-black/35"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute h-[32.4%] w-[32.4%] rounded-full border border-black/10" />
        <div className="pointer-events-none absolute h-[20.6%] w-[20.6%] rounded-full border border-dashed border-[#FF5722]/30" />
        <div className="absolute h-3 w-3 rounded-full bg-[#FF5722]" />
        <div className="pointer-events-none absolute h-12 w-12 rounded-full border border-[#FF5722]/40" />

        {NODES.map((node) => {
          const delay = `-${((node.startDeg % 360) / 360) * node.period}s`;
          return (
            <div
              key={node.id}
              className={`pointer-events-none absolute inset-0 ${reduce ? "" : "gyro-node-arm"}`}
              style={
                reduce
                  ? { transform: `rotate(${node.startDeg}deg)` }
                  : {
                      animationDuration: `${node.period}s`,
                      animationDelay: delay,
                    }
              }
            >
              <div
                className="group pointer-events-auto absolute left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
                style={{ top: `calc(50% - ${ORBIT_R_PCT}%)` }}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center ${reduce ? "" : "gyro-node-counter"}`}
                  style={
                    reduce
                      ? undefined
                      : {
                          animationDuration: `${node.period}s`,
                          animationDelay: delay,
                        }
                  }
                >
                  {node.ping ? (
                    <span className="gyro-node-pulse absolute h-3.5 w-3.5 rounded-full bg-[#FF5722]/70" />
                  ) : null}
                  <span
                    className={
                      node.ping
                        ? "relative h-3 w-3 rounded-full border-2 border-[var(--paper)] bg-[#FF5722]"
                        : "relative h-2.5 w-2.5 rounded-full border border-[var(--paper)] bg-[#FF5722]"
                    }
                  />
                  <div className="pointer-events-none absolute left-6 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-[#1a1c1f] px-2.5 py-1 font-mono text-[10px] tracking-wider text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {node.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: eastLeft }}
        >
          <span className="relative h-3 w-3 rounded-full border-2 border-[var(--paper)] bg-[#FF5722]" />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: westLeft }}
        >
          <span className="relative h-2 w-2 rounded-full bg-black/60" />
        </div>
      </div>
    </div>
  );
}
