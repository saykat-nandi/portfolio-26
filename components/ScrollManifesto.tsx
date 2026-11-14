"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { polish } from "@/lib/polish";

interface WordToken {
  text: string;
  accent?: boolean;
  pillar?: number;
}

const STATEMENT_TOKENS: WordToken[] = [
  { text: "Great" },
  { text: "software" },
  { text: "isn’t" },
  { text: "built" },
  { text: "on" },
  { text: "surface" },
  { text: "polish" },
  { text: "alone." },
  { text: "Every" },
  { text: "system" },
  { text: "I" },
  { text: "architect" },
  { text: "is" },
  { text: "engineered" },
  { text: "to" },
  { text: "handle" },
  { text: "real-time", accent: true, pillar: 0 },
  { text: "state,", accent: true, pillar: 0 },
  { text: "block" },
  { text: "abuse,", accent: true, pillar: 1 },
  { text: "and" },
  { text: "scale" },
  { text: "cleanly", accent: true, pillar: 2 },
  { text: "under" },
  { text: "production" },
  { text: "load." },
];

const PILLARS = [
  {
    code: "01 // REAL-TIME",
    title: "Low-Latency State Sync",
    detail:
      "WebSocket match lobbies, live telemetry, and deterministic event pipelines.",
    /** Progress when matching accent phrase settles */
    armAt: 0.48,
  },
  {
    code: "02 // SECURITY",
    title: "Escrow & Anti-Bot Defense",
    detail:
      "Transactional wallet locks, KYC workflows, and non-human traffic filtering.",
    armAt: 0.58,
  },
  {
    code: "03 // AUTOMATION",
    title: "Headless Build Pipelines",
    detail:
      "Programmatic Node.js & Puppeteer workflows replacing hours of manual QA.",
    armAt: 0.68,
  },
];

type RenderUnit =
  | { kind: "word"; token: WordToken; index: number }
  | {
      kind: "phrase";
      tokens: WordToken[];
      startIndex: number;
      pillar: number;
    };

function buildUnits(tokens: WordToken[]): RenderUnit[] {
  const units: RenderUnit[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.accent && t.pillar != null) {
      const start = i;
      const pillar = t.pillar;
      const group: WordToken[] = [];
      while (
        i < tokens.length &&
        tokens[i].accent &&
        tokens[i].pillar === pillar
      ) {
        group.push(tokens[i]);
        i++;
      }
      units.push({ kind: "phrase", tokens: group, startIndex: start, pillar });
      continue;
    }
    units.push({ kind: "word", token: t, index: i });
    i++;
  }
  return units;
}

const UNITS = buildUnits(STATEMENT_TOKENS);

function wordWeight(index: number): CSSProperties {
  return {
    "--i": index,
    "--w":
      "clamp(0, (var(--progress) * (var(--total) + 3) - var(--i)) / 2.8, 1)",
  } as CSSProperties;
}

export default function ScrollManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollProgress(sectionRef, "sticky");
  const sweep = polish("manifestoSweep");

  const nodes: ReactNode[] = UNITS.map((unit) => {
    if (unit.kind === "word") {
      const targetHex = unit.token.accent ? "var(--signal)" : "var(--on-ink)";
      return (
        <span
          key={`w-${unit.index}`}
          style={
            {
              ...wordWeight(unit.index),
              color: `color-mix(in srgb, ${targetHex} calc(var(--w) * 100%), #3a3a40)`,
            } as CSSProperties
          }
          className="manifesto-word mr-[0.26em] inline-block sm:mr-[0.3em]"
        >
          {unit.token.text}
        </span>
      );
    }

    const phrase = unit.tokens.map((t) => t.text).join(" ");
    if (!sweep) {
      return (
        <span
          key={`p-${unit.startIndex}`}
          style={
            {
              ...wordWeight(unit.startIndex),
              color:
                "color-mix(in srgb, var(--signal) calc(var(--w) * 100%), #3a3a40)",
            } as CSSProperties
          }
          className="manifesto-word mr-[0.26em] inline-block sm:mr-[0.3em]"
        >
          {phrase}
        </span>
      );
    }

    return (
      <span
        key={`p-${unit.startIndex}`}
        style={wordWeight(unit.startIndex)}
        className="manifesto-accent mr-[0.26em] inline sm:mr-[0.3em]"
        data-pillar={unit.pillar}
      >
        <span className="manifesto-accent-mark" aria-hidden />
        <span className="manifesto-accent-text">{phrase}</span>
      </span>
    );
  });

  return (
    <section
      id="statement"
      ref={sectionRef}
      style={
        {
          "--progress": 0,
          "--total": STATEMENT_TOKENS.length,
        } as CSSProperties
      }
      className="relative z-20 h-[160vh] bg-ink text-on-ink sm:h-[165vh] lg:h-[170vh] [@media(min-width:1024px)_and_(max-height:800px)]:h-[150vh]"
    >
      <div
        className="sticky top-0 flex h-[100dvh] flex-col justify-between overflow-hidden border-t border-white/10 bg-ink shadow-[0_-12px_0_0_var(--ink)]"
        style={{
          paddingInline: "var(--page-gutter)",
          paddingTop: "max(1.25rem, var(--safe-t))",
          paddingBottom: "max(1.25rem, var(--safe-b))",
        }}
      >
        <div
          aria-hidden
          style={{
            transform: "scaleX(var(--progress))",
            transformOrigin: "left center",
          }}
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-signal will-change-transform"
        />

        <div
          aria-hidden
          className="hero-concrete-noise pointer-events-none absolute inset-0 opacity-[0.035] invert"
        />

        <div className="relative mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500 sm:text-[10px] sm:tracking-[0.16em] md:text-[11px] md:tracking-[0.18em]">
          <span className="flex min-w-0 items-center gap-2 text-zinc-300 sm:gap-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            <span className="truncate">
              <span className="sm:hidden">01 / PHILOSOPHY</span>
              <span className="hidden sm:inline">01 / ENGINEERING PHILOSOPHY</span>
            </span>
          </span>
          <span className="hidden truncate text-zinc-600 lg:inline">
            ARCHITECTURE OVER TEMPLATES
          </span>
          <span className="shrink-0 text-zinc-500">
            <span className="max-[360px]:hidden">SCROLL TO DECODE ↓</span>
            <span className="min-[361px]:hidden">DECODE ↓</span>
          </span>
        </div>

        <div className="relative mx-auto my-auto w-full max-w-[980px] py-4 sm:py-0">
          <h2
            className="font-medium leading-[1.32] tracking-[-0.032em] sm:leading-[1.28] lg:leading-[1.26]"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              fontSize: "var(--manifesto-title)",
            }}
          >
            {nodes}
          </h2>
        </div>

        <div
          style={
            {
              "--reveal": "clamp(0, (var(--progress) - 0.58) / 0.32, 1)",
              opacity: "var(--reveal)",
              transform: "translateY(calc((1 - var(--reveal)) * 16px))",
            } as CSSProperties
          }
          className="relative mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-5 border-t border-white/[0.08] pt-5 will-change-transform sm:gap-6 sm:pt-7 md:grid-cols-3 md:gap-10 [@media(min-width:1024px)_and_(max-height:800px)]:gap-5 [@media(min-width:1024px)_and_(max-height:800px)]:pt-4"
        >
          {PILLARS.map((item) => (
            <div
              key={item.code}
              className="manifesto-pillar relative flex min-w-0 flex-col gap-1.5 sm:gap-2"
              style={
                sweep
                  ? ({
                      "--arm": `clamp(0, (var(--progress) - ${item.armAt}) / 0.08, 1)`,
                    } as CSSProperties)
                  : undefined
              }
            >
              {sweep ? (
                <span className="manifesto-laser" aria-hidden>
                  <span className="manifesto-laser-beam" />
                  <span className="manifesto-laser-node" />
                </span>
              ) : null}
              <span
                className="font-mono text-[9px] tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em]"
                style={
                  sweep
                    ? ({
                        color: `color-mix(in srgb, var(--signal) calc(55% + var(--arm) * 45%), #71717a)`,
                      } as CSSProperties)
                    : { color: "var(--signal)" }
                }
              >
                {item.code}
              </span>
              <h3
                className="text-[12px] font-semibold tracking-tight sm:text-sm md:text-base"
                style={
                  sweep
                    ? ({
                        color: `color-mix(in srgb, #fff calc(70% + var(--arm) * 30%), #a1a1aa)`,
                      } as CSSProperties)
                    : { color: "#fff" }
                }
              >
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500 max-md:line-clamp-2 md:text-sm md:leading-relaxed md:line-clamp-none [@media(max-height:620px)]:hidden [@media(min-width:1024px)_and_(max-height:800px)]:line-clamp-2">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
