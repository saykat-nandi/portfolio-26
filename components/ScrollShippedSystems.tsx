"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { caseStudies } from "@/content/portfolio";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const SHIPPED = caseStudies.slice(0, 3);

function ArchitectureDiagram({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 420 280" className="h-full w-full" aria-hidden>
        <rect width="420" height="280" fill="#111111" />
        <g
          fill="none"
          stroke="rgba(244,244,244,0.35)"
          strokeWidth="1.25"
          className="origin-center transition-opacity duration-500"
        >
          <path d="M40 220 H380" />
          <path d="M70 60 L120 160 L200 90 L280 170 L360 70" />
          <circle cx="120" cy="160" r="6" fill="#FF4500" />
          <circle cx="200" cy="90" r="6" fill="#FF4500" />
          <circle cx="280" cy="170" r="6" fill="#FF4500" />
          <rect x="48" y="40" width="70" height="36" rx="4" />
          <rect x="300" y="40" width="70" height="36" rx="4" />
        </g>
        <text
          x="48"
          y="250"
          fill="rgba(244,244,244,0.45)"
          fontSize="11"
          fontFamily="var(--font-archivo)"
        >
          AD VERIFY → BILL → OVERLAY
        </text>
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 420 280" className="h-full w-full" aria-hidden>
        <rect width="420" height="280" fill="#111111" />
        <g fill="none" stroke="rgba(244,244,244,0.35)" strokeWidth="1.25">
          <rect x="40" y="48" width="100" height="80" rx="6" />
          <rect x="160" y="48" width="100" height="80" rx="6" />
          <rect x="280" y="48" width="100" height="80" rx="6" />
          <path d="M90 128 V170 H210 V128 M210 170 H330 V128" />
          <circle cx="90" cy="88" r="7" fill="#FF4500" />
          <circle cx="210" cy="88" r="7" fill="#FF4500" />
          <circle cx="330" cy="88" r="7" fill="#FF4500" />
          <rect x="120" y="190" width="180" height="40" rx="6" />
        </g>
        <text
          x="48"
          y="250"
          fill="rgba(244,244,244,0.45)"
          fontSize="11"
          fontFamily="var(--font-archivo)"
        >
          LOBBY → ESCROW → BRACKET → PAYOUT
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 420 280" className="h-full w-full" aria-hidden>
      <rect width="420" height="280" fill="#111111" />
      <g fill="none" stroke="rgba(244,244,244,0.35)" strokeWidth="1.25">
        <rect x="48" y="50" width="60" height="90" />
        <rect x="128" y="70" width="60" height="70" />
        <rect x="208" y="40" width="60" height="100" />
        <rect x="288" y="80" width="60" height="60" />
        <path d="M78 160 V200 H318 V160" stroke="#FF4500" />
      </g>
      <text
        x="48"
        y="250"
        fill="rgba(244,244,244,0.45)"
        fontSize="11"
        fontFamily="var(--font-archivo)"
      >
        GENERATE → RENDER → PACKAGE → SHIP
      </text>
    </svg>
  );
}

export default function ScrollShippedSystems() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useScrollProgress(sectionRef, { mode: "sticky" });

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2) -
              Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2)
          );
        if (!visible[0]) return;
        const idx = Number((visible[0].target as HTMLElement).dataset.index);
        if (!Number.isNaN(idx)) setActive(idx);
      },
      { root: null, threshold: [0.35, 0.55, 0.7], rootMargin: "-20% 0px -20% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const study = SHIPPED[active] ?? SHIPPED[0];

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{ "--progress": 0 } as CSSProperties}
      className="surface-obsidian relative"
      aria-label="Shipped systems"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-10 lg:py-24">
        {/* Sticky left: morphing architecture */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.2em] text-[var(--muted-on-ink)]">
            <span className="mr-1.5 inline-block text-signal">●</span>
            (02 / SHIPPED SYSTEMS)
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-archivo)] text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Architecture that holds under load
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted-on-ink)]">
            Scroll the case studies on the right — the live diagram morphs to
            match the system in focus.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border border-white/12 bg-ink">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-[family-name:var(--font-archivo)] text-[11px] tracking-[0.14em] text-[var(--muted-on-ink)]">
                {study.number} / LIVE ARCHITECTURE
              </span>
              <span className="text-[11px] text-[var(--muted-on-ink)]">{study.role}</span>
            </div>
            <div className="aspect-[420/280] w-full">
              <ArchitectureDiagram index={active} />
            </div>
            <div className="space-y-2 border-t border-white/10 px-4 py-4">
              <p className="font-[family-name:var(--font-archivo)] text-lg font-semibold tracking-[-0.03em]">
                {study.title.split("—")[0]?.trim()}
              </p>
              <p className="text-xs leading-relaxed text-[var(--muted-on-ink)]">
                {study.diagramLabel}
              </p>
            </div>
          </div>
        </aside>

        {/* Scrolling right column */}
        <div className="space-y-8 lg:space-y-16">
          {SHIPPED.map((item, index) => (
            <article
              key={item.id}
              data-index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`scroll-mt-28 rounded-xl border p-6 transition-[border-color,background,box-shadow] duration-300 md:p-8 ${
                active === index
                  ? "border-signal/50 bg-[#1a1a1c] shadow-[inset_3px_0_0_0_var(--signal)]"
                  : "border-white/10 bg-[#161618]"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-[family-name:var(--font-archivo)] text-xs tracking-[0.16em] text-[var(--muted-on-ink)]">
                  {item.number} / SHIPPED
                </p>
                <p className="text-xs text-[var(--muted-on-ink)]">{item.role}</p>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-archivo)] text-2xl font-semibold tracking-[-0.03em] md:text-[28px]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted-on-ink)] md:text-base">
                {item.problem}
              </p>
              <ul className="mt-6 space-y-3">
                {item.built.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-4 text-sm leading-relaxed text-on-ink/85 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:bg-signal"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.stack.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/15 px-2 py-1 text-[10px] uppercase tracking-wide text-[var(--muted-on-ink)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
