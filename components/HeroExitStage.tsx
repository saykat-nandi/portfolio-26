"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * PERMANENT — do not remove.
 * Sticky receding hero for the hero→manifesto shutter only.
 * Must live inside a short wrapper with ScrollManifesto so sticky
 * ends after Section 2 (hero never peeks under later sections).
 *
 * Dim via ink scrim opacity (compositor-cheap) — never filter:brightness
 * on a layer that owns canvas + SVG filters.
 */
export default function HeroExitStage({ children }: { children: ReactNode }) {
  const heroExitRef = useRef<HTMLDivElement>(null);
  useScrollProgress(heroExitRef, "exit");

  return (
    <div
      ref={heroExitRef}
      data-hero-exit
      style={{ "--progress": 0 } as CSSProperties}
      className="relative z-0 lg:sticky lg:top-0"
    >
      <div
        style={{
          transform:
            "scale(calc(1 - var(--progress) * 0.045)) translateY(calc(var(--progress) * 36px))",
          // Soft exit fade so hero doesn't ghost under manifesto
          opacity: "calc(1 - min(1, var(--progress) * 1.15))",
          transformOrigin: "center top",
        }}
        className="relative"
      >
        {children}
        {/* Ink scrim replaces filter:brightness — pure alpha compositing */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[60] bg-ink"
          style={{
            opacity: "calc(var(--progress) * 0.35)",
          }}
        />
      </div>
    </div>
  );
}
