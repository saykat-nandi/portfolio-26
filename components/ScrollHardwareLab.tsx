"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { lab } from "@/content/portfolio";
import { useArriveReplay } from "@/hooks/useArriveReplay";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { polish } from "@/lib/polish";

function BlueprintSvg({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg
        viewBox="0 0 240 140"
        className="h-28 w-full"
        fill="none"
        aria-hidden
      >
        <text
          x="12"
          y="16"
          fill="currentColor"
          opacity="0.45"
          fontSize="8"
          fontFamily="var(--font-geist-mono), monospace"
        >
          LPD3806 · 775DC
        </text>
        <circle
          className="lab-stroke lab-wheel-ring"
          cx="120"
          cy="72"
          r="46"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-wheel-ring"
          cx="120"
          cy="72"
          r="18"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          className="lab-stroke"
          d="M74 72 H42 M166 72 H198 M120 26 V10 M120 118 V132"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <rect
          className="lab-stroke"
          x="96"
          y="60"
          width="48"
          height="24"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          className="lab-stroke"
          d="M42 56 V88 M198 56 V88"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M52 40 H72 V48 H52 Z"
          className="lab-stroke lab-paddle"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M168 40 H188 V48 H168 Z"
          className="lab-stroke lab-paddle"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg
        viewBox="0 0 240 140"
        className="h-28 w-full"
        fill="none"
        aria-hidden
      >
        <text
          x="12"
          y="16"
          fill="currentColor"
          opacity="0.45"
          fontSize="8"
          fontFamily="var(--font-geist-mono), monospace"
        >
          MTM · XO CURVE
        </text>
        <rect
          className="lab-stroke"
          x="36"
          y="24"
          width="56"
          height="100"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <rect
          className="lab-stroke"
          x="148"
          y="24"
          width="56"
          height="100"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-woofer"
          cx="64"
          cy="48"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-woofer"
          cx="64"
          cy="98"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-woofer"
          cx="64"
          cy="73"
          r="7"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-woofer"
          cx="176"
          cy="48"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-woofer"
          cx="176"
          cy="98"
          r="12"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="lab-stroke lab-woofer"
          cx="176"
          cy="73"
          r="7"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          className="lab-stroke lab-wave-arc"
          d="M108 70 C120 52 140 52 152 70"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="28"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 140"
      className="h-28 w-full"
      fill="none"
      aria-hidden
    >
      <text
        x="12"
        y="16"
        fill="currentColor"
        opacity="0.45"
        fontSize="8"
        fontFamily="var(--font-geist-mono), monospace"
      >
        TEC1-12706 · ΔT
      </text>
      <rect
        className="lab-stroke"
        x="70"
        y="40"
        width="100"
        height="60"
        rx="4"
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
        className="lab-stroke lab-heat"
        d="M55 55 H70 M55 85 H70"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        className="lab-stroke lab-heat"
        d="M170 55 H185 M170 85 H185"
        stroke="currentColor"
        strokeWidth="1.25"
        style={{ animationDelay: "0.35s" }}
      />
      <path
        className="lab-stroke lab-heat"
        d="M28 48 C40 52 48 70 58 78"
        stroke="currentColor"
        strokeWidth="1.25"
        style={{ animationDelay: "0.15s" }}
      />
    </svg>
  );
}

function LabCards({
  gridRef,
  spotlightUnlocked,
  schematicsAlive,
}: {
  gridRef: RefObject<HTMLDivElement | null>;
  spotlightUnlocked: boolean;
  schematicsAlive: boolean;
}) {
  return (
    <div ref={gridRef} className="mt-12 grid gap-6 md:grid-cols-3">
      {lab.map((item, index) => (
        <article
          key={item.title}
          data-lab-card
          className={`lab-card border border-white/12 bg-elevated p-6 ${
            schematicsAlive && polish("labSchematicLoop") ? "is-alive" : ""
          } ${
            polish("labSpotlight")
              ? `lab-spotlight${spotlightUnlocked ? "" : " is-locked"}`
              : ""
          }`}
          onMouseMove={
            polish("labSpotlight") && spotlightUnlocked
              ? (e: ReactMouseEvent<HTMLElement>) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--x",
                    `${((e.clientX - r.left) / r.width) * 100}%`
                  );
                  e.currentTarget.style.setProperty(
                    "--y",
                    `${((e.clientY - r.top) / r.height) * 100}%`
                  );
                }
              : undefined
          }
        >
          <p className="relative z-[1] font-[family-name:var(--font-archivo)] text-xs tracking-[0.16em] text-[var(--muted-on-ink)]">
            {String(index + 1).padStart(2, "0")} / BLUEPRINT
          </p>
          <div className="relative z-[1] mt-4 text-on-ink/70 [&_.lab-stroke]:stroke-signal/80">
            <BlueprintSvg index={index} />
          </div>
          <h3 className="relative z-[1] mt-4 font-[family-name:var(--font-archivo)] text-lg font-semibold leading-snug tracking-[-0.02em]">
            {item.title}
          </h3>
          <p className="relative z-[1] mt-3 text-sm leading-relaxed text-[var(--muted-on-ink)]">
            {item.description}
          </p>
        </article>
      ))}
    </div>
  );
}

export default function ScrollHardwareLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [telemetry, setTelemetry] = useState("X: 000.0mm // STANDBY");
  const [spotlightUnlocked, setSpotlightUnlocked] = useState(false);
  const [schematicsAlive, setSchematicsAlive] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const plotter = polish("labPlotterStage");
  const useSticky = plotter && isDesktop;

  useScrollProgress(sectionRef, {
    mode: useSticky ? "sticky" : "pass-through",
  });

  useArriveReplay("#lab", () => {
    setSpotlightUnlocked(true);
    setSchematicsAlive(true);
    setReplayKey((k) => k + 1);
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
          stroke.style.setProperty("--lab-len", `${len}`);
          stroke.style.strokeDasharray = `${len}`;
          if (useSticky && !prefersReduced) {
            stroke.style.strokeDashoffset = `${len}`;
          } else {
            stroke.style.strokeDashoffset = prefersReduced ? "0" : `${len}`;
          }
        } catch {
          stroke.style.setProperty("--lab-len", "240");
          stroke.style.strokeDasharray = "240";
          stroke.style.strokeDashoffset = prefersReduced ? "0" : "240";
        }
      });
    });

    if (prefersReduced) {
      setSpotlightUnlocked(true);
      setSchematicsAlive(true);
      setTelemetry("X: 240.0mm // PLOTTER_ACTIVE");
      return;
    }

    if (useSticky) {
      const section = sectionRef.current;
      if (!section) return;
      let raf = 0;

      const sync = () => {
        const p = Number(getComputedStyle(section).getPropertyValue("--progress")) || 0;
        const x = (p * 240).toFixed(1);
        setTelemetry(
          `X: ${x.padStart(5, "0")}mm // ${p > 0.05 ? "PLOTTER_ACTIVE" : "STANDBY"}`
        );
        setSpotlightUnlocked(p > 0.75);
        setSchematicsAlive(p > 0.92);

        cards.forEach((card) => {
          const strokes = [
            ...card.querySelectorAll<SVGGeometryElement>(".lab-stroke"),
          ];
          strokes.forEach((stroke) => {
            const len =
              Number(stroke.style.getPropertyValue("--lab-len")) ||
              Number(stroke.getAttribute("data-len")) ||
              240;
            stroke.style.strokeDashoffset = `${len * (1 - p)}`;
          });
        });
      };

      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(sync);
      };

      sync();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

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
    setSpotlightUnlocked(true);
    setSchematicsAlive(true);

    if (replayKey > 0) {
      cards.forEach((card) => {
        const strokes = [
          ...card.querySelectorAll<SVGGeometryElement>(".lab-stroke"),
        ];
        strokes.forEach((stroke, i) => {
          const len =
            Number(stroke.style.getPropertyValue("--lab-len")) || 240;
          stroke.style.strokeDashoffset = `${len}`;
          stroke.style.transition = `stroke-dashoffset 900ms ${i * 70}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          requestAnimationFrame(() => {
            stroke.style.strokeDashoffset = "0";
          });
        });
      });
    }

    return () => io.disconnect();
  }, [useSticky, replayKey]);

  const heading = (
    <>
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
    </>
  );

  if (useSticky) {
    return (
      <section
        id="lab"
        ref={sectionRef}
        style={{ "--progress": 0 } as CSSProperties}
        className="lab-plotter-track surface-obsidian relative border-t border-white/10"
      >
        <div style={{ height: "var(--lab-track-h)" }}>
          <div className="lab-plotter-stage page-rail section-pad-y">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>{heading}</div>
              <p className="lab-telemetry" aria-live="polite">
                {telemetry}
              </p>
            </div>
            <LabCards
              gridRef={gridRef}
              spotlightUnlocked={spotlightUnlocked}
              schematicsAlive={schematicsAlive}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="lab"
      ref={sectionRef}
      style={{ "--progress": 0 } as CSSProperties}
      className="surface-obsidian relative border-t border-white/10 section-pad-y"
    >
      <div className="page-rail">
        {heading}
        <LabCards
          gridRef={gridRef}
          spotlightUnlocked={true}
          schematicsAlive={schematicsAlive}
        />
      </div>
    </section>
  );
}
