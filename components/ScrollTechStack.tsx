"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { techStack } from "@/content/portfolio";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const TICKER = techStack.flatMap((g) => g.items);

export default function ScrollTechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  useScrollProgress(sectionRef, { mode: "pass-through" });

  useEffect(() => {
    const section = sectionRef.current;
    const ticker = tickerRef.current;
    if (!section || !ticker) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let raf = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let offset = 0;

    const tick = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      velocity += (dy - velocity) * 0.12;
      const speed = 0.35 + Math.min(2.4, Math.abs(velocity) * 0.08);
      const dir = velocity >= 0 ? 1 : -1;
      offset += speed * dir;
      ticker.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const root = cardsRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-unmask]")];
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      cards.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      return;
    }

    cards.forEach((c) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(28px)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const i = Number(el.dataset.unmask || 0);
          el.animate(
            [
              { opacity: 0, transform: "translateY(28px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 520,
              delay: i * 60,
              fill: "forwards",
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            }
          );
          io.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const loop = [...TICKER, ...TICKER];

  return (
    <section
      id="stack"
      ref={sectionRef}
      style={{ "--progress": 0 } as CSSProperties}
      className="surface-obsidian relative overflow-hidden border-t border-white/10 py-20 md:py-28"
    >
      <div className="mb-12 border-y border-white/10 bg-black/30 py-3">
        <div className="overflow-hidden">
          <div
            ref={tickerRef}
            className="flex w-max gap-8 whitespace-nowrap will-change-transform"
            aria-hidden
          >
            {loop.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-[var(--muted-on-ink)]"
              >
                {item}
                <span className="ml-8 text-signal/70">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.2em] text-[var(--muted-on-ink)]">
          <span className="mr-1.5 inline-block text-signal">●</span>
          (03 / TECH STACK)
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-archivo)] text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          Grouped by capability, not vanity ratings
        </h2>

        <div
          ref={cardsRef}
          className="mt-12 grid gap-6 sm:grid-cols-2"
        >
          {techStack.map((group, index) => (
            <div
              key={group.title}
              data-unmask={index}
              className="border border-white/12 bg-[#1a1a1c] p-6"
            >
              <h3 className="font-[family-name:var(--font-archivo)] text-lg font-semibold tracking-[-0.02em]">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[var(--muted-on-ink)]"
                  >
                    <span className="mt-2 h-px w-3 shrink-0 bg-signal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
