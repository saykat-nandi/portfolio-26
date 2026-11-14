"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { statement } from "@/content/orvante";
import {
  usePrefersReducedMotion,
  useRecorderMode,
} from "@/components/orvante/useU";

export function OrvanteStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduce = usePrefersReducedMotion();
  const rec = useRecorderMode();

  const words = useMemo(
    () =>
      statement.lines
        .join(" ")
        .split(/\s+/)
        .filter(Boolean),
    []
  );

  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }

    if (rec) {
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const t = (now - start) / 1000;
        // Statement fill: 1.3–4.2 s
        const p = Math.min(1, Math.max(0, (t - 1.3) / (4.2 - 1.3)));
        setProgress(p);
        if (t < 5.5) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    const onScroll = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.75;
      const end = vh * 0.2;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setProgress(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce, rec]);

  useEffect(() => {
    if (railRef.current) {
      railRef.current.style.setProperty("--p", String(progress));
    }
    if (ruleRef.current) {
      ruleRef.current.style.transform = `scaleX(${progress})`;
    }
  }, [progress]);

  const edge = 2;
  const filled = progress * (words.length + edge);

  return (
    <section
      id="statement"
      ref={rootRef}
      className="ov-statement"
      aria-label="Manifesto"
    >
      <div className="ov-statement-rail" ref={railRef} aria-hidden>
        <span>01</span>
        <div className="ov-statement-track">
          <i />
        </div>
        <span>{Math.round(progress * 100)}</span>
      </div>

      <div className="ov-statement-inner">
        <p className="ov-statement-copy">
          {words.map((word, i) => {
            const local = Math.min(1, Math.max(0, filled - i));
            const g = Math.round(0x6f + (0xf4 - 0x6f) * local);
            const hex = `#${g.toString(16).padStart(2, "0").repeat(3)}`;
            return (
              <span key={`${word}-${i}`} style={{ color: hex }}>
                {word}{" "}
              </span>
            );
          })}
        </p>
        <div className="ov-statement-rule" ref={ruleRef} aria-hidden />
        <p className="ov-statement-sub">
          {statement.subline[0]}
          <br />
          {statement.subline[1]}{" "}
          <em>{statement.sublineMuted}</em>
        </p>
      </div>
    </section>
  );
}
