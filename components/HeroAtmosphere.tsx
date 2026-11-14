"use client";

import { useEffect, useRef, type RefObject } from "react";

interface HeroAtmosphereProps {
  containerRef: RefObject<HTMLElement | null>;
  portraitRef: RefObject<HTMLDivElement | null>;
  plateRef: RefObject<HTMLDivElement | null>;
  shippedRef?: RefObject<HTMLDivElement | null>;
  titleRef?: RefObject<HTMLHeadingElement | null>;
  reducedMotion?: boolean;
}

/** Layer 1: concrete noise + key-light + BUILT TO / SCALE watermark.
 *  Owns the shared pointer → CSS/--transform rAF loop (no React re-renders). */
export default function HeroAtmosphere({
  containerRef,
  portraitRef,
  plateRef,
  shippedRef,
  titleRef,
  reducedMotion = false,
}: HeroAtmosphereProps) {
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (reducedMotion) {
      container.style.setProperty("--mx", "50%");
      container.style.setProperty("--my", "45%");
      return;
    }

    let targetX = container.clientWidth * 0.5;
    let targetY = container.clientHeight * 0.45;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;

      const width = container.clientWidth || 1440;
      const height = container.clientHeight || 900;
      const normX = currentX / width - 0.5;
      const normY = currentY / height - 0.5;

      container.style.setProperty("--mx", `${currentX.toFixed(1)}px`);
      container.style.setProperty("--my", `${currentY.toFixed(1)}px`);
      container.style.setProperty("--nx", normX.toFixed(4));
      container.style.setProperty("--ny", normY.toFixed(4));

      if (watermarkRef.current) {
        watermarkRef.current.style.transform = `translate3d(${(normX * -28).toFixed(1)}px, ${(normY * -14).toFixed(1)}px, -70px)`;
      }

      if (portraitRef.current) {
        // Opposite parallax ±12px
        portraitRef.current.style.transform = `translate3d(${(normX * -12).toFixed(1)}px, ${(normY * -8).toFixed(1)}px, 0)`;
      }

      if (plateRef.current) {
        const rotY = normX * 12;
        const rotX = normY * -9;
        plateRef.current.style.transform = `translate3d(0,0,35px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        plateRef.current.style.setProperty(
          "--glare",
          `${((normX + 0.5) * 100).toFixed(1)}%`
        );
      }

      if (shippedRef?.current) {
        const rotY = normX * 6;
        const rotX = normY * -4;
        shippedRef.current.style.transform = `translate3d(${(normX * 10).toFixed(1)}px, ${(normY * 6).toFixed(1)}px, 35px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      }

      if (titleRef?.current) {
        // Local proximity only — expand when the cursor sweeps the headline zone
        const titleBox = titleRef.current.getBoundingClientRect();
        const containerBox = container.getBoundingClientRect();
        const titleCx =
          titleBox.left + titleBox.width * 0.5 - containerBox.left;
        const titleCy =
          titleBox.top + titleBox.height * 0.5 - containerBox.top;
        const distPx = Math.hypot(currentX - titleCx, currentY - titleCy);
        const proximity = Math.max(0, 1 - distPx / 280);
        const wdth = 103 + proximity * 5; // 103 → 108
        titleRef.current.style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}`;
      }

      rafId = requestAnimationFrame(tick);
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("pointermove", onPointerMove);
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
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none [perspective:1200px] [transform-style:preserve-3d]"
    >
      {/* Concrete fractal noise — architectural matte, not flat grey */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-concrete-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-concrete-noise)" />
      </svg>

      {/* Layer 1 — deep background: softbox key-light */}
      <div
        className="absolute inset-0"
        style={{
          transform: "translateZ(-70px)",
          background:
            "radial-gradient(540px circle at var(--mx, 50%) var(--my, 45%), rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0) 72%)",
        }}
      />

      {/* Layer 1 — monumental watermark, shoulder-framed mask */}
      <div
        className="absolute inset-x-0 top-[24%] flex justify-center"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 26%, black 38%, black 62%, transparent 74%)",
          maskImage:
            "linear-gradient(to right, transparent 26%, black 38%, black 62%, transparent 74%)",
        }}
      >
        <div
          ref={watermarkRef}
          className="relative text-center font-black uppercase leading-[0.86] tracking-[-0.05em] will-change-transform"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontSize: "clamp(4.2rem, 8.6vw, 7.8rem)",
            fontVariationSettings: '"wdth" 112',
            transform: "translateZ(-70px)",
          }}
        >
          <div
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(17, 17, 17, 0.14)",
            }}
          >
            BUILT TO
            <br />
            SCALE
          </div>
          <div
            className="absolute inset-0"
            style={{
              color: "rgba(17, 17, 17, 0.12)",
              WebkitMaskImage:
                "radial-gradient(200px circle at var(--mx, 50%) var(--my, 45%), black 0%, transparent 100%)",
              maskImage:
                "radial-gradient(200px circle at var(--mx, 50%) var(--my, 45%), black 0%, transparent 100%)",
            }}
          >
            BUILT TO
            <br />
            SCALE
          </div>
        </div>
      </div>
    </div>
  );
}
