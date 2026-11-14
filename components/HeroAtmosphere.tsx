"use client";

import { useEffect, useRef, type RefObject } from "react";
import { polish } from "@/lib/polish";

interface HeroAtmosphereProps {
  containerRef: RefObject<HTMLElement | null>;
  portraitRef: RefObject<HTMLDivElement | null>;
  plateRef: RefObject<HTMLDivElement | null>;
  shippedRef?: RefObject<HTMLDivElement | null>;
  titleRef?: RefObject<HTMLHeadingElement | null>;
  reducedMotion?: boolean;
}

/** Layer 1: tiled static noise + transform spotlight + watermark.
 *  Flat translate parallax only — idles when settled / hero covered. */
export default function HeroAtmosphere({
  containerRef,
  portraitRef,
  plateRef,
  shippedRef,
  titleRef,
  reducedMotion = false,
}: HeroAtmosphereProps) {
  const watermarkRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const spot = spotRef.current;
    if (!container) return;

    if (reducedMotion) {
      if (spot) {
        spot.style.transform = "translate3d(50%, 45%, 0) translate(-50%, -50%)";
      }
      return;
    }

    let targetX = container.clientWidth * 0.5;
    let targetY = container.clientHeight * 0.45;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;
    let running = false;
    let paused = false;

    const syncPaused = () => {
      const exitEl = container.closest("[data-hero-exit]");
      const covered = !!exitEl?.hasAttribute("data-exit-covered");
      const rect = container.getBoundingClientRect();
      const offscreen =
        rect.bottom < 0 || rect.top > window.innerHeight;
      paused = covered || offscreen;
      if (paused && running) {
        running = false;
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const apply = (normX: number, normY: number) => {
      const edgeX = 1 - Math.pow(Math.min(1, Math.abs(normX) * 2), 1.35);
      const edgeY = 1 - Math.pow(Math.min(1, Math.abs(normY) * 2), 1.35);
      const edge = Math.max(0.28, edgeX * edgeY);
      const x = normX * edge;
      const y = normY * edge;

      if (spot) {
        spot.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }
      if (watermarkRef.current) {
        watermarkRef.current.style.transform = `translate3d(${(x * -18).toFixed(1)}px, ${(y * -8).toFixed(1)}px, 0)`;
      }
      if (portraitRef.current) {
        portraitRef.current.style.transform = `translate3d(${(x * -6).toFixed(1)}px, ${(y * -4).toFixed(1)}px, 0)`;
      }
      if (plateRef.current) {
        plateRef.current.style.transform = `translate3d(${(x * 4).toFixed(1)}px, ${(y * 3).toFixed(1)}px, 0)`;
        plateRef.current.style.setProperty(
          "--glare",
          `${((normX + 0.5) * 100).toFixed(1)}%`
        );
      }
      if (shippedRef?.current) {
        shippedRef.current.style.transform = `translate3d(${(x * 5).toFixed(1)}px, ${(y * 3).toFixed(1)}px, 0)`;
      }
    };

    const tick = () => {
      if (paused) {
        running = false;
        rafId = 0;
        return;
      }

      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;

      const width = container.clientWidth || 1440;
      const height = container.clientHeight || 900;
      apply(currentX / width - 0.5, currentY / height - 0.5);

      const settled =
        Math.abs(targetX - currentX) < 0.35 &&
        Math.abs(targetY - currentY) < 0.35;
      if (settled) {
        running = false;
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running || paused) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (paused) return;
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      kick();
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", syncPaused, { passive: true });
    syncPaused();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", syncPaused);
    };
  }, [
    containerRef,
    portraitRef,
    plateRef,
    shippedRef,
    titleRef,
    reducedMotion,
  ]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <div className="hero-concrete-noise absolute inset-0 opacity-[0.045]" />

      {/* Spotlight blob — transform only; sized down on small screens */}
      <div
        ref={spotRef}
        className="absolute left-0 top-0 h-[280px] w-[280px] rounded-full sm:h-[420px] sm:w-[420px] lg:h-[540px] lg:w-[540px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 72%)",
          transform: "translate3d(50%, 45%, 0) translate(-50%, -50%)",
        }}
      />

      <div
        className={`pointer-events-none absolute inset-x-0 flex justify-center ${
          polish("watermarkSofter") ? "top-[18%]" : "top-[24%]"
        }`}
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 34%, black 46%, black 54%, transparent 66%)",
          maskImage:
            "linear-gradient(to right, transparent 34%, black 46%, black 54%, transparent 66%)",
        }}
      >
        <div
          ref={watermarkRef}
          className="relative text-center font-black uppercase leading-[0.86] tracking-[-0.05em]"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontSize: "clamp(3.2rem, 6.5vw, 5.8rem)",
            fontVariationSettings: '"wdth" 112',
            color: "transparent",
            WebkitTextStroke: polish("watermarkSofter")
              ? "1px rgba(17, 17, 17, 0.26)"
              : "1px rgba(17, 17, 17, 0.18)",
          }}
          aria-hidden
        >
          BUILT TO
          <br />
          SCALE
        </div>
      </div>
    </div>
  );
}
