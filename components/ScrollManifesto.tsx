"use client";

import { useRef, type CSSProperties } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface WordToken {
  text: string;
  accent?: boolean;
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
  { text: "real-time", accent: true },
  { text: "state,", accent: true },
  { text: "block" },
  { text: "abuse,", accent: true },
  { text: "and" },
  { text: "scale" },
  { text: "cleanly", accent: true },
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
  },
  {
    code: "02 // INTEGRITY",
    title: "Escrow & Anti-Bot Defense",
    detail:
      "Transactional wallet locks, KYC workflows, and non-human traffic filtering.",
  },
  {
    code: "03 // AUTOMATION",
    title: "Headless Build Pipelines",
    detail:
      "Programmatic Node.js & Puppeteer workflows replacing hours of manual QA.",
  },
];

export default function ScrollManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollProgress(sectionRef, "sticky");

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
      className="relative z-10 h-[215vh] bg-[#0B0B0D] text-[#F4F4F4] shadow-[0_-24px_60px_rgba(0,0,0,0.45)]"
    >
      {/* Top Curtain Seam + Live Signal Orange Scroll Gauge */}
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden border-t border-white/15 px-6 py-8 md:px-14 md:py-10">
        {/* Progress hairline along top edge */}
        <div
          aria-hidden="true"
          style={{
            transform: "scaleX(var(--progress))",
            transformOrigin: "left center",
          }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[#FF4500] will-change-transform"
        />

        {/* Ultra-faint grain — charcoal slate */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="manifesto-concrete-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#manifesto-concrete-noise)"
          />
        </svg>

        {/* Top Telemetry Bar */}
        <div className="relative mx-auto flex w-full max-w-[1320px] items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="flex items-center gap-2.5 text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF4500]" />
            01 / ENGINEERING PHILOSOPHY
          </span>
          <span className="hidden sm:inline">ARCHITECTURE OVER TEMPLATES</span>
          <span>SCROLL TO DECODE ↓</span>
        </div>

        {/* Center Pinned Word-Scrub Manifesto */}
        <div className="relative mx-auto my-auto w-full max-w-[980px]">
          <h2
            style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
            className="text-[clamp(1.85rem,4.1vw,3.45rem)] font-medium leading-[1.22] tracking-[-0.03em]"
          >
            {STATEMENT_TOKENS.map((token, idx) => {
              const targetHex = token.accent ? "#FF4500" : "#F4F4F4";
              return (
                <span
                  key={`${token.text}-${idx}`}
                  style={
                    {
                      "--i": idx,
                      "--w":
                        "clamp(0, (var(--progress) * (var(--total) + 3) - var(--i)) / 2.8, 1)",
                      color: `color-mix(in srgb, ${targetHex} calc(var(--w) * 100%), #323238)`,
                    } as CSSProperties
                  }
                  className="mr-[0.27em] inline-block"
                >
                  {token.text}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Bottom 3-Column Pillars (unlock as manifesto completes) */}
        <div
          style={
            {
              "--reveal": "clamp(0, (var(--progress) - 0.62) / 0.28, 1)",
              opacity: "var(--reveal)",
              transform: "translateY(calc((1 - var(--reveal)) * 22px))",
            } as CSSProperties
          }
          className="relative mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-4 border-t border-white/10 pt-6 will-change-transform md:grid-cols-3 md:gap-8"
        >
          {PILLARS.map((item) => (
            <div key={item.code} className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.16em] text-[#FF4500]">
                {item.code}
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400 md:text-sm">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
