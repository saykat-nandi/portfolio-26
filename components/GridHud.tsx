"use client";

import { useEffect, useState } from "react";
import { polish, POLISH } from "@/lib/polish";
import { getGridEnabled, setGridEnabled, subscribeGrid } from "@/lib/gridPrefs";
import { playLatch } from "@/lib/relayClick";

function activePolishKeys(): string[] {
  if (!POLISH.enabled) return [];
  return (Object.keys(POLISH) as (keyof typeof POLISH)[])
    .filter((k) => k !== "enabled" && POLISH[k])
    .map(String);
}

/**
 * Blueprint grid + live HUD — invisible until [G] / footer GRID: ON.
 * 12-column Swiss rails aligned to --page-max / gutter; viewport + scroll telemetry.
 */
export function GridHud() {
  const [on, setOn] = useState(false);
  const [telemetry, setTelemetry] = useState({ w: 0, h: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [sectionId, setSectionId] = useState("—");
  const [flags, setFlags] = useState<string[]>([]);

  useEffect(() => {
    if (!polish("gridHud")) return;
    setOn(getGridEnabled());
    return subscribeGrid(setOn);
  }, []);

  useEffect(() => {
    if (!polish("gridHud")) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setGridEnabled(!getGridEnabled());
      playLatch();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!on || !polish("gridHud")) return;

    setFlags(activePolishKeys());

    const updateViewport = () => {
      setTelemetry({
        w: window.innerWidth,
        h: window.innerHeight,
        y: Math.round(window.scrollY),
      });
    };
    updateViewport();
    window.addEventListener("scroll", updateViewport, { passive: true });
    window.addEventListener("resize", updateViewport);

    let raf = 0;
    const tick = () => {
      const nodes = [
        ...document.querySelectorAll<HTMLElement>(
          '[style*="--progress"], [data-hero-exit]'
        ),
      ];
      let bestEl: HTMLElement | undefined;
      let bestDist = Infinity;
      const mid = window.innerHeight * 0.45;

      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          bestEl = el;
        }
      }

      if (bestEl) {
        const raw = getComputedStyle(bestEl)
          .getPropertyValue("--progress")
          .trim();
        const p = Number.parseFloat(raw);
        setProgress(Number.isFinite(p) ? p : 0);
        setSectionId(bestEl.id || bestEl.dataset.heroExit || "stage");
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [on]);

  if (!polish("gridHud") || !on) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
      aria-hidden
    >
      <div
        className="mx-auto grid h-full grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-5"
        style={{
          maxWidth: "var(--page-max, 1440px)",
          paddingInline: "var(--page-gutter, 1.5rem)",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={
              i < 4
                ? "h-full border-x border-signal/20 bg-signal/[0.025]"
                : i < 8
                  ? "hidden h-full border-x border-signal/20 bg-signal/[0.025] sm:block"
                  : "hidden h-full border-x border-signal/20 bg-signal/[0.025] lg:block"
            }
          />
        ))}
      </div>

      <div className="fixed bottom-12 right-6 border border-signal/40 bg-ink/90 px-3 py-1.5 font-mono text-[10px] tracking-widest text-on-ink backdrop-blur-sm">
        <span className="text-signal">● GRID_LOCK</span>
        {" · "}
        {telemetry.w}×{telemetry.h}
        {" · "}
        Y:{telemetry.y}PX
        {" · "}
        <span className="text-on-ink/55">
          {sectionId} {(progress * 100).toFixed(0)}%
        </span>
      </div>

      <div className="fixed bottom-12 left-6 max-w-[min(42vw,280px)] border border-white/10 bg-ink/80 px-2.5 py-1.5 font-mono text-[8px] tracking-[0.1em] text-on-ink/50 backdrop-blur-sm">
        FLAGS: {flags.slice(0, 6).join(" · ") || "none"}
        {flags.length > 6 ? "…" : ""}
      </div>
    </div>
  );
}
