"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { lab } from "@/content/portfolio";
import { useScrollProgress } from "@/hooks/useScrollProgress";

function BlueprintSvg({ index }: { index: number }) {
  if (index === 0) {
    // Arduino FFB racing wheel
    return (
      <svg
        viewBox="0 0 240 140"
        className="h-28 w-full"
        fill="none"
        aria-hidden
      >
        <circle
          className="lab-stroke"
          cx="120"
          cy="70"
          r="46"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="120"
          cy="70"
          r="18"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          className="lab-stroke"
          d="M74 70 H50 M166 70 H190 M120 24 V8 M120 116 V132"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <rect
          className="lab-stroke"
          x="96"
          y="58"
          width="48"
          height="24"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    );
  }

  if (index === 1) {
    // MTM speakers
    return (
      <svg
        viewBox="0 0 240 140"
        className="h-28 w-full"
        fill="none"
        aria-hidden
      >
        <rect
          className="lab-stroke"
          x="40"
          y="20"
          width="60"
          height="100"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <rect
          className="lab-stroke"
          x="140"
          y="20"
          width="60"
          height="100"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="70"
          cy="45"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="70"
          cy="95"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="70"
          cy="70"
          r="7"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="170"
          cy="45"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="170"
          cy="95"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke"
          cx="170"
          cy="70"
          r="7"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    );
  }

  // Peltier cooler
  return (
    <svg viewBox="0 0 240 140" className="h-28 w-full" fill="none" aria-hidden>
      <rect
        className="lab-stroke"
        x="70"
        y="40"
        width="100"
        height="60"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        className="lab-stroke"
        d="M90 40 V28 H150 V40 M90 100 V112 H150 V100"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        className="lab-stroke"
        d="M100 55 H140 M100 70 H140 M100 85 H140"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        className="lab-stroke"
        d="M55 55 H70 M55 85 H70 M170 55 H185 M170 85 H185"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export default function ScrollHardwareLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useScrollProgress(sectionRef, { mode: "pass-through" });

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-lab-card]")];
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    cards.forEach((card) => {
      const strokes = [
        ...card.querySelectorAll<SVGGeometryElement>(".lab-stroke"),
      ];
      strokes.forEach((stroke) => {
        try {
          const len = stroke.getTotalLength();
          stroke.style.strokeDasharray = `${len}`;
          stroke.style.strokeDashoffset = prefersReduced ? "0" : `${len}`;
        } catch {
          stroke.style.strokeDasharray = "240";
          stroke.style.strokeDashoffset = prefersReduced ? "0" : "240";
        }
      });
    });

    if (prefersReduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target as HTMLElement;
          const strokes = [
            ...card.querySelectorAll<SVGGeometryElement>(".lab-stroke"),
          ];
          strokes.forEach((stroke, i) => {
            stroke.style.transition = `stroke-dashoffset 900ms ${i * 70}ms cubic-bezier(0.16, 1, 0.3, 1)`;
            stroke.style.strokeDashoffset = "0";
          });
          io.unobserve(card);
        });
      },
      { threshold: 0.35 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="lab"
      ref={sectionRef}
      style={{ "--progress": 0 } as CSSProperties}
      className="surface-obsidian relative border-t border-white/10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.2em] text-[var(--muted-on-ink)]">
          <span className="mr-1.5 inline-block text-signal">●</span>
          (04 / HARDWARE LAB)
        </p>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-archivo)] text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          Hardware & systems playground
        </h2>
        <p className="mt-4 max-w-xl text-sm text-[var(--muted-on-ink)]">
          Side builds outside paid tickets—microcontrollers, acoustics, and
          thermal hardware.
        </p>

        <div
          ref={gridRef}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {lab.map((item, index) => (
            <article
              key={item.title}
              data-lab-card
              className="border border-white/12 bg-[#1a1a1c] p-6"
            >
              <p className="font-[family-name:var(--font-archivo)] text-xs tracking-[0.16em] text-[var(--muted-on-ink)]">
                {String(index + 1).padStart(2, "0")} / BLUEPRINT
              </p>
              <div className="mt-4 text-on-ink/70 [&_.lab-stroke]:stroke-signal/80">
                <BlueprintSvg index={index} />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-archivo)] text-lg font-semibold leading-snug tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-on-ink)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
