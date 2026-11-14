"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { media, testimonials, trust } from "@/content/orvante";
import {
  usePrefersReducedMotion,
  useRecorderMode,
} from "@/components/orvante/useU";

function CountUp({
  value,
  suffix = "",
  active,
}: {
  value: number;
  suffix?: string;
  active: boolean;
}) {
  const [n, setN] = useState(0);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, value]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export function OrvanteTrust() {
  const rootRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduce = usePrefersReducedMotion();
  const rec = useRecorderMode();

  useEffect(() => {
    if (reduce) {
      setActive(true);
      return;
    }

    if (rec) {
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const t = (now - start) / 1000;
        if (t >= 3.5) setActive(true);
        if (t >= 5.3 && awardsRef.current) {
          awardsRef.current.style.transform = "translateY(-6px)";
        }
        if (t < 6) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.35 }
    );
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, [reduce, rec]);

  useEffect(() => {
    if (reduce) return;
    const el = portraitRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
    };
    const onLeave = () => {
      el.style.transform = "translateY(-8px)";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <section id="trust" ref={rootRef} className="ov-trust" aria-label="Trust">
      <div className="ov-trust-panel">
        <div className="ov-trust-left">
          <h2 className="ov-trust-title">
            {trust.titleLines.map((line, i) => (
              <span key={line} className="ov-trust-line">
                {line}
                {i === 0 ? (
                  <span className="ov-glass ov-glass-a" aria-hidden>
                    ✳
                  </span>
                ) : null}
                {i === trust.titleLines.length - 1 ? (
                  <span className="ov-glass ov-glass-b" aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                ) : null}
              </span>
            ))}
          </h2>
          <p className="ov-trust-copy">{trust.paragraph}</p>
        </div>

        <div className="ov-trust-cards">
          <div className={`ov-card ov-card-avatars ${active ? "is-on" : ""}`}>
            <div className="ov-avatars">
              {media.avatars.map((src, i) => (
                <span
                  key={src}
                  className="ov-avatar"
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  <Image src={src} alt="" width={48} height={48} />
                </span>
              ))}
            </div>
            <div className="ov-card-stat">
              <strong>
                <CountUp
                  value={trust.collabStat.value}
                  suffix={trust.collabStat.suffix}
                  active={active}
                />
              </strong>
              <span>{trust.collabStat.label}</span>
            </div>
          </div>

          <div
            ref={awardsRef}
            className={`ov-card ov-card-awards ${active ? "is-on" : ""}`}
          >
            <div className="ov-card-stat light">
              <strong>
                <CountUp
                  value={trust.awardStat.value}
                  suffix={trust.awardStat.suffix}
                  active={active}
                />
              </strong>
              <span>{trust.awardStat.label}</span>
            </div>
            <div className="ov-seal" aria-hidden>
              <svg viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1"
                />
                <path
                  d="M60 22 L66 48 L94 48 L72 64 L80 92 L60 76 L40 92 L48 64 L26 48 L54 48 Z"
                  fill="rgba(255,255,255,0.9)"
                />
              </svg>
              <span>{trust.awardBadge}</span>
            </div>
            <p className="ov-award-note">{trust.awardNote}</p>
          </div>

          <div ref={portraitRef} className="ov-card ov-card-portrait">
            <Image src={media.portrait} alt="" fill sizes="220px" />
          </div>
        </div>
      </div>

      <div className="ov-trust-quotes">
        {testimonials.slice(0, 3).map((t) => (
          <blockquote key={t.name}>
            <p>“{t.quote}”</p>
            <footer>
              <strong>{t.name}</strong>
              <span>{t.title}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
