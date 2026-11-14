"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/** Sticky receding hero shell — dims/scales while Section 2 shutters over. */
export default function HeroExitStage({ children }: { children: ReactNode }) {
  const heroExitRef = useRef<HTMLDivElement>(null);
  useScrollProgress(heroExitRef, "exit");

  return (
    <div
      ref={heroExitRef}
      style={{ "--progress": 0 } as CSSProperties}
      className="relative z-0 lg:sticky lg:top-0"
    >
      <div
        style={{
          transform:
            "scale(calc(1 - var(--progress) * 0.045)) translateY(calc(var(--progress) * 36px))",
          filter: "brightness(calc(1 - var(--progress) * 0.55))",
          transformOrigin: "center top",
        }}
        className="will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
