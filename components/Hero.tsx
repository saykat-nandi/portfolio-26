"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import HeroAtmosphere from "@/components/HeroAtmosphere";
import Gyroscope3D from "@/components/Gyroscope3D";
import { contact } from "@/content/portfolio";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Systems", href: "#work" },
  { label: "Architecture", href: "#stack" },
  { label: "Hardware Lab", href: "#lab" },
] as const;

const BUILDS = [
  {
    id: "01",
    title: "GOLIVE GAMING",
    blurb: "Ad-Tech & Anti-Bot Metric Verification Engine",
    tags: ["REST APIs", "Live Stream Triggers"],
    flow: "Ad verify → bill → overlay",
    decisions: [
      "Anti-bot verification before billing so fraudulent impressions never hit the ledger.",
      "Self-serve campaign panel for budget allocation and post-boost workflows.",
      "Live-stream triggers sync promotional overlays to active broadcasts.",
    ],
    previewHref: "#work",
  },
  {
    id: "02",
    title: "ESPORTS ARENA",
    blurb: "WebSocket Matchmaking & Coin-Escrow System",
    tags: ["WebSockets", "KYC & Wallets"],
    flow: "Lobby → escrow → bracket → payout",
    decisions: [
      "Multi-tier bracket generator with live WebSocket match rooms.",
      "Coin-escrow locks entry fees until verified match completion.",
      "KYC + moderation dashboard for real-time dispute resolution.",
    ],
    previewHref: "#work",
  },
  {
    id: "03",
    title: "AUTO-PACKAGER",
    blurb: "Headless Node.js & Puppeteer Product Pipeline",
    tags: ["Node.js", "Automation"],
    flow: "Generate → render → package → ship",
    decisions: [
      "Headless Puppeteer pipeline packages 60+ form bundles without manual QA.",
      "Repeatable script execution replaces hours of assembly work.",
      "Storefront-ready output from a single automation pass.",
    ],
    previewHref: "#work",
  },
] as const;

const CHIPS = [
  "REAL-TIME WEB",
  "ESCROW & AUTH",
  "AD-TECH LOGIC",
  "AUTOMATION",
] as const;

const EMAIL = contact.email;
const GITHUB = "https://github.com";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

function CountUp({
  to,
  active,
  suffix = "",
}: {
  to: number;
  active: boolean;
  suffix?: string;
}) {
  const [n, setN] = useState(0);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, to]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

function BuildArt({ index }: { index: number }) {
  const node = "#FF4500";
  if (index === 0) {
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden>
        <rect width="280" height="120" fill="#111111" />
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="none">
          <path d="M20 90 H260" />
          <path d="M40 30 L80 70 L140 40 L200 75 L250 35" />
          <circle cx="80" cy="70" r="4" fill={node} />
          <circle cx="140" cy="40" r="4" fill={node} />
          <circle cx="200" cy="75" r="4" fill={node} />
        </g>
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden>
        <rect width="280" height="120" fill="#111111" />
        <g stroke="rgba(255,255,255,0.2)" fill="none">
          <rect x="30" y="28" width="70" height="64" rx="4" />
          <rect x="110" y="28" width="70" height="64" rx="4" />
          <rect x="190" y="28" width="60" height="64" rx="4" />
          <path d="M100 60 H110 M180 60 H190" />
        </g>
        <circle cx="65" cy="60" r="6" fill={node} />
        <circle cx="145" cy="60" r="6" fill={node} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden>
      <rect width="280" height="120" fill="#111111" />
      <g stroke="rgba(255,255,255,0.22)" fill="none">
        <rect x="36" y="24" width="48" height="72" />
        <rect x="96" y="36" width="48" height="60" />
        <rect x="156" y="20" width="48" height="76" />
        <rect x="216" y="44" width="36" height="52" />
        <path d="M60 96 H232" stroke={node} />
      </g>
    </svg>
  );
}

function magneticMove(
  el: HTMLElement | null,
  e: ReactMouseEvent,
  reduce: boolean,
  strength = 0.28
) {
  if (!el || reduce) return;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left - r.width / 2) * strength;
  const y = (e.clientY - r.top - r.height / 2) * strength;
  const clampedX = Math.max(-6, Math.min(6, x));
  const clampedY = Math.max(-6, Math.min(6, y));
  el.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0)`;
}

function magneticReset(el: HTMLElement | null) {
  if (el) el.style.transform = "translate3d(0,0,0)";
}

export default function Hero() {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  useScrollProgress(rootRef, { mode: "pass-through" });

  const sliderRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const portraitRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const shippedRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const exploreBtnRef = useRef<HTMLAnchorElement>(null);
  const contactBtnRef = useRef<HTMLAnchorElement>(null);
  const [selectedNav, setSelectedNav] = useState(0);
  const [hoverNav, setHoverNav] = useState<number | null>(null);
  const activeNav = hoverNav ?? selectedNav;
  const [navReady, setNavReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [statusReady, setStatusReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [buildIndex, setBuildIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const moveSlider = useCallback((index: number) => {
    const el = linkRefs.current[index];
    const slider = sliderRef.current;
    if (!el || !slider?.parentElement) return;
    const parent = slider.parentElement.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    slider.style.width = `${box.width}px`;
    slider.style.transform = `translateX(${box.left - parent.left}px)`;
    setNavReady(true);
  }, []);

  useEffect(() => {
    setStatusReady(true);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const id = requestAnimationFrame(() => moveSlider(activeNav));
    const onResize = () => moveSlider(activeNav);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [activeNav, moveSlider]);

  useEffect(() => {
    if (reduce) {
      setReady(true);
      setProgress(1);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const rises = root.querySelectorAll<HTMLElement>("[data-rise]");
    rises.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
    });

    const lines = root.querySelectorAll<HTMLElement>("[data-title-line]");
    lines.forEach((el) => {
      el.style.transform = "translateY(100%)";
    });

    if (portraitRef.current) {
      portraitRef.current.style.opacity = "0";
      portraitRef.current.style.transform = "translateY(32px)";
    }

    const t = window.setTimeout(() => {
      lines.forEach((el, i) => {
        el.animate(
          [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
          {
            duration: 900,
            delay: 110 * i,
            fill: "forwards",
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          }
        );
      });

      portraitRef.current?.animate(
        [
          { opacity: 0, transform: "translateY(32px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 1100,
          delay: 80,
          fill: "forwards",
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      rises.forEach((el, i) => {
        el.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 700,
            delay: Number(el.dataset.delay || 0) + i * 55,
            fill: "forwards",
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          }
        );
      });

      setReady(true);
    }, 40);

    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }
    let raf = 0;
    let start = performance.now();
    const duration = 4200;

    const tick = (now: number) => {
      const t = (now - start) / duration;
      if (t >= 1) {
        setBuildIndex((i) => (i + 1) % BUILDS.length);
        start = now;
        setProgress(0);
      } else {
        setProgress(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, buildIndex]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const nextBuild = () => {
    setBuildIndex((i) => (i + 1) % BUILDS.length);
    setProgress(0);
  };

  const prevBuild = () => {
    setBuildIndex((i) => (i - 1 + BUILDS.length) % BUILDS.length);
    setProgress(0);
  };

  const build = BUILDS[buildIndex];

  return (
    <section
      id="top"
      ref={rootRef}
      style={{ "--progress": 0.5 } as CSSProperties}
      className="relative isolate overflow-hidden bg-paper text-ink font-[family-name:var(--font-inter-tight)] min-h-[920px] lg:h-screen lg:min-h-[860px] lg:max-h-[1040px] [perspective:1200px]"
    >
      <HeroAtmosphere
        containerRef={rootRef}
        portraitRef={portraitRef}
        plateRef={plateRef}
        shippedRef={shippedRef}
        titleRef={titleRef}
        reducedMotion={reduce}
      />

      {/* Top bar */}
      <div className="relative z-30 flex items-start justify-between gap-3 px-4 pt-5 sm:px-6 lg:px-10 lg:pt-7">
        <nav
          className="relative flex h-11 items-center rounded-[6px] border border-black/15 bg-white/90 p-0.5 backdrop-blur-sm"
          aria-label="Primary"
          data-rise
          data-delay="40"
          onMouseLeave={() => {
            setHoverNav(null);
            setSelectedNav(0);
            moveSlider(0);
          }}
        >
          <span
            ref={sliderRef}
            className="absolute top-0.5 left-0 z-0 h-10 rounded-[4px] bg-ink transition-[transform,width] duration-200 ease-out"
            aria-hidden
            style={{ opacity: navReady ? 1 : 0 }}
          />
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              className={`relative z-10 inline-flex h-10 items-center rounded-[4px] px-3 text-[12px] font-medium transition-colors duration-200 sm:px-3.5 sm:text-[13px] ${
                i === activeNav && navReady ? "text-white" : "text-ink"
              }`}
              onMouseEnter={() => {
                setHoverNav(i);
                moveSlider(i);
              }}
              onFocus={() => {
                setHoverNav(i);
                moveSlider(i);
              }}
              onBlur={() => {
                setHoverNav(null);
                moveSlider(selectedNav);
              }}
              onClick={() => {
                setSelectedNav(i);
                setHoverNav(null);
                moveSlider(i);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3" data-rise data-delay="80">
          <p
            className="hidden items-center gap-2 text-[13px] font-medium text-ink/90 md:flex"
            suppressHydrationWarning
          >
            <span
              className={`inline-block h-2 w-2 rounded-full bg-signal ${
                statusReady ? "animate-pulse" : "opacity-40"
              }`}
              aria-hidden
            />
            <span className={statusReady ? "opacity-100" : "opacity-0"}>
              Available for Remote Roles · GMT+6
            </span>
          </p>
          <a
            ref={contactBtnRef}
            href="#contact"
            className="group inline-flex h-11 items-center justify-center rounded-[6px] bg-ink px-5 text-[13px] font-medium text-on-ink will-change-transform transition-[background,color,box-shadow] duration-200 hover:bg-signal hover:text-white hover:shadow-[0_0_0_2px_var(--signal)] max-md:h-10 max-md:w-10 max-md:px-0"
            onMouseMove={(e) => magneticMove(contactBtnRef.current, e, reduce)}
            onMouseLeave={() => magneticReset(contactBtnRef.current)}
          >
            <span className="max-md:hidden">
              Get in Touch{" "}
              <span className="text-signal transition-colors group-hover:text-white">
                ↗
              </span>
            </span>
            <span className="text-signal md:hidden group-hover:text-white">↗</span>
          </a>
        </div>
      </div>

      {/* Main stage */}
      <div className="relative z-10 mx-auto grid h-[calc(100%-4.5rem-3rem)] max-w-[1440px] grid-cols-1 gap-8 overflow-x-clip px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[1fr_minmax(280px,1.1fr)_1fr] lg:gap-4 lg:px-10 lg:pb-8 lg:pt-4 [transform-style:preserve-3d]">
        {/* Left column */}
        <div className="relative z-20 flex flex-col justify-center lg:pr-4">
          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-archivo)] font-bold leading-[0.86] tracking-[-0.05em] text-ink [font-variation-settings:'wdth'_103] text-[clamp(3.4rem,5.8vw,5.4rem)]"
          >
            <span className="relative inline-block overflow-hidden">
              <span data-title-line className="inline-block">
                SYSTEMS
              </span>
              <sup className="absolute -right-10 top-2 font-[family-name:var(--font-archivo)] text-[0.22em] font-medium tracking-normal text-ink/80 [font-variation-settings:'wdth'_100] sm:-right-12">
                (&apos;26)
              </sup>
            </span>
            <span className="mt-1 block overflow-hidden">
              <span data-title-line className="inline-block">
                ENGINEER
              </span>
            </span>
          </h1>

          <div className="relative z-10 mt-8 max-w-sm" data-rise data-delay="120">
            <p className="font-[family-name:var(--font-archivo)] text-[12px] font-medium uppercase tracking-[0.14em] text-ink">
              <span className="mr-1 text-signal">•</span>(ABOUT)
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink/85 sm:text-[15px]">
              Architecting scalable backend platforms, real-time multiplayer
              engines, and automated Node.js pipelines built for production.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                ref={exploreBtnRef}
                href="#work"
                className="group inline-flex h-11 items-center rounded-[6px] bg-ink px-5 text-[13px] font-medium text-on-ink will-change-transform transition-[background,color,box-shadow] duration-200 hover:bg-signal hover:text-white"
                onMouseMove={(e) =>
                  magneticMove(exploreBtnRef.current, e, reduce)
                }
                onMouseLeave={() => magneticReset(exploreBtnRef.current)}
              >
                Explore Work{" "}
                <span className="ml-1 text-signal transition-colors group-hover:text-white">
                  ↗
                </span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-11 items-center rounded-[6px] border border-black/15 bg-white/70 px-5 text-[13px] font-medium text-ink backdrop-blur-sm transition-[transform,background,box-shadow] duration-200 hover:-translate-y-px hover:bg-white hover:shadow-[0_0_0_2px_var(--signal)]"
              >
                {copied ? "Copied ✓" : "Copy Email"}
              </button>
            </div>
          </div>

          <div
            className="mt-8 grid w-full max-w-[370px] grid-cols-2 overflow-hidden rounded-[6px] border border-black/15 bg-bento"
            data-rise
            data-delay="180"
          >
            <div className="flex flex-col justify-between bg-[#141416] p-3.5 text-on-ink sm:p-4">
              <div>
                <p className="font-[family-name:var(--font-archivo)] text-[34px] font-semibold leading-none tracking-[-0.04em]">
                  <CountUp to={4} active={ready} suffix="+" /> Years
                </p>
                <p className="mt-1.5 text-[12px] text-white/65">
                  Production Engineering
                </p>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="font-[family-name:var(--font-geist-mono)] text-[11.5px] uppercase tracking-[0.08em] text-white/85"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-8 items-center justify-center bg-white text-[11px] font-semibold text-ink transition-opacity hover:opacity-90"
              >
                GitHub Profile ↗
              </a>
            </div>

            <div className="group relative flex flex-col justify-between bg-[color-mix(in_srgb,var(--paper)_70%,#cfcfcf)] p-3.5">
              <p className="font-[family-name:var(--font-archivo)] text-[11px] uppercase tracking-[0.12em] text-ink/70">
                Core Focus · 01/04
              </p>
              <svg
                viewBox="0 0 140 100"
                className="mx-auto my-2 h-20 w-full"
                aria-hidden
              >
                <g
                  stroke="var(--ink)"
                  strokeWidth="1"
                  fill="none"
                  className="opacity-50 transition-opacity duration-300 group-hover:opacity-80"
                >
                  <path
                    d="M10 80 H130 M20 20 V80 M50 30 V80 M80 18 V80 M110 35 V80"
                    className="origin-center transition-transform duration-500 group-hover:translate-y-[-2px]"
                  />
                </g>
                <g className="transition-transform duration-500 ease-out group-hover:translate-y-[-3px]">
                  <circle cx="50" cy="30" r="3" fill="var(--signal)" />
                  <circle cx="80" cy="18" r="3" fill="var(--signal)" />
                  <circle cx="110" cy="35" r="3" fill="var(--signal)" />
                  <path
                    d="M50 30 L80 18 L110 35"
                    stroke="var(--signal)"
                    strokeWidth="1.5"
                    fill="none"
                    className="opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </g>
              </svg>
              <div className="text-right">
                <p className="font-[family-name:var(--font-archivo)] text-[18px] font-semibold tracking-[-0.03em] text-ink">
                  Full-Stack
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-ink/55">
                  Backend, APIs & Interactive UI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center portrait — Layer 3 */}
        <div className="relative z-10 order-first flex min-h-[460px] items-end justify-center [transform-style:preserve-3d] lg:order-none lg:min-h-0">
          <div
            ref={portraitRef}
            className="relative z-[2] h-[460px] w-full max-w-[420px] will-change-transform lg:h-[88%] lg:min-w-[640px] lg:max-w-none"
          >
            {/* Centered 3D Orbital Gimbal framing head & upper shoulders */}
            <div className="pointer-events-none absolute left-1/2 top-[33%] z-0 w-[min(100%,450px)] -translate-x-1/2 -translate-y-1/2">
              <Gyroscope3D className="w-full" />
            </div>

            <div
              className="absolute inset-0 z-10 will-change-transform"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 78%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 78%, transparent 100%)",
                transform:
                  "translateY(calc((var(--progress) - 0.5) * 90px)) scale(calc(1 + (var(--progress) - 0.5) * 0.06))",
              }}
            >
              <Image
                src="/saykat.png"
                alt="Saykat Nandi Dip"
                fill
                priority
                className="object-contain object-bottom grayscale contrast-[1.04]"
                sizes="(max-width: 1024px) 100vw, 680px"
              />
            </div>

            {/* Nameplate — dead-center across torso */}
            <div className="absolute bottom-[23%] left-1/2 z-20 w-[92%] max-w-[316px] -translate-x-1/2 [transform-style:preserve-3d]">
              <div data-rise data-delay="160">
                <div
                  ref={plateRef}
                  style={{
                    background:
                      "radial-gradient(circle at var(--glare, 50%) 0%, rgba(255,255,255,0.18), rgba(14,14,16,0.92) 65%)",
                    transform: "translateZ(35px)",
                  }}
                  className="flex items-center justify-between gap-3 rounded-[6px] border border-white/15 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl will-change-transform"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-[2px] bg-[#FF4500]" />
                    <span className="font-mono text-[14px] font-semibold tracking-[0.16em] text-white">
                      SAYKAT NANDI DIP
                    </span>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-zinc-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF4500]" />
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — SHIPPED */}
        <div
          className="relative z-20 flex flex-col items-start justify-center gap-6 lg:items-end lg:pl-2"
          data-rise
          data-delay="140"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-1.5 text-[12px] font-medium backdrop-blur-md">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-white">
              ✓
            </span>
            Production Architecture
          </div>

          <p className="max-w-[220px] text-left text-[20px] font-medium leading-snug tracking-[-0.03em] text-ink lg:text-right">
            Open to Full-Stack /
            <br />
            <span className="inline-block h-2 w-2 rounded-full bg-signal align-middle" />{" "}
            Backend Roles
          </p>

          <div
            ref={shippedRef}
            className="w-full max-w-[320px] will-change-transform [transform-style:preserve-3d]"
            style={{ transform: "translateZ(35px)" }}
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            <div
              className={`overflow-hidden rounded-[6px] border border-white/10 bg-[#141416] text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-shadow duration-300 ${
                cardHover ? "shadow-[0_24px_60px_rgba(0,0,0,0.28)]" : ""
              }`}
            >
              <div className="relative h-[120px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="absolute inset-0 z-0 cursor-pointer"
                  aria-label={`Open architecture for ${build.title}`}
                >
                  <div
                    key={buildIndex}
                    className="h-full w-full animate-[shippedSlide_420ms_cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <BuildArt index={buildIndex} />
                  </div>
                </button>
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
                  <span className="font-[family-name:var(--font-archivo)] text-[11px] tracking-[0.12em] text-white/70">
                    {build.id} / SHIPPED
                  </span>
                  <div className="pointer-events-auto flex items-center gap-1.5">
                    {BUILDS.map((b, i) => (
                      <button
                        key={b.id}
                        type="button"
                        aria-label={`Show ${b.title}`}
                        onClick={() => {
                          setBuildIndex(i);
                          setProgress(0);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          i === buildIndex
                            ? "w-4 bg-signal"
                            : "w-1.5 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={prevBuild}
                      className="ml-1 grid h-7 w-7 place-items-center rounded-[4px] border border-white/20 bg-white/10 text-xs backdrop-blur-md transition hover:bg-white/20"
                      aria-label="Previous project"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={nextBuild}
                      className="grid h-7 w-7 place-items-center rounded-[4px] border border-white/20 bg-white/10 text-xs backdrop-blur-md transition hover:bg-white/20"
                      aria-label="Next project"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="w-full space-y-3 p-4 text-left"
              >
                <div
                  key={`copy-${buildIndex}`}
                  className="animate-[shippedFade_380ms_ease-out]"
                >
                  <h3 className="font-[family-name:var(--font-archivo)] text-[18px] font-semibold tracking-[-0.03em]">
                    {build.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/65">
                    {build.blurb}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {build.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/75"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="h-[2px] overflow-hidden bg-white/15">
                  <div
                    className="h-full bg-signal transition-[width] duration-100 ease-linear"
                    style={{ width: `${Math.max(4, progress * 100)}%` }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/45 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close architecture drawer"
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#111111] text-on-ink shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={`${build.title} architecture`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <p className="font-[family-name:var(--font-archivo)] text-[11px] tracking-[0.14em] text-white/50">
              {build.id} / LIVE ARCHITECTURE
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-[4px] border border-white/20 text-sm hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="overflow-hidden rounded-[6px] border border-white/10">
              <div className="h-[140px]">
                <BuildArt index={buildIndex} />
              </div>
            </div>
            <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-2xl font-semibold tracking-[-0.03em]">
              {build.title}
            </h3>
            <p className="mt-2 text-sm text-white/55">{build.blurb}</p>
            <p className="mt-5 font-[family-name:var(--font-archivo)] text-[10px] uppercase tracking-[0.16em] text-white/40">
              Flow
            </p>
            <p className="mt-1 text-sm text-white/75">{build.flow}</p>
            <p className="mt-6 font-[family-name:var(--font-archivo)] text-[10px] uppercase tracking-[0.16em] text-white/40">
              Key decisions
            </p>
            <ul className="mt-3 space-y-3">
              {build.decisions.map((d) => (
                <li
                  key={d}
                  className="relative pl-4 text-sm leading-relaxed text-white/75 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:bg-signal"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-white/10 p-5">
            <a
              href={build.previewHref}
              onClick={() => setDrawerOpen(false)}
              className="flex h-11 items-center justify-center rounded-[6px] bg-on-ink text-[13px] font-semibold text-ink transition-[box-shadow,opacity] hover:shadow-[0_0_0_2px_var(--signal)]"
            >
              Inspect full case study ↗
            </a>
          </div>
        </aside>
      </div>

      {/* Bottom obsidian bar */}
      <div
        className="relative z-30 flex h-12 items-center justify-between border-b border-white/15 bg-ink px-4 text-[11px] font-medium tracking-[0.1em] text-on-ink font-[family-name:var(--font-archivo)] sm:px-6 lg:px-10 lg:text-[13px]"
        data-rise
        data-delay="280"
      >
        <span className="max-w-[40%] truncate text-on-ink/90">
          FULL-STACK & SYSTEMS ARCHITECTURE
        </span>
        <a
          href="#statement"
          className="group inline-flex items-center gap-2.5 text-on-ink no-underline"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("statement")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span>SCROLL DOWN</span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/35 text-[11px] transition-[border-color,color] duration-200 group-hover:border-signal group-hover:text-signal">
            ↓
          </span>
        </a>
        <span className="max-w-[40%] truncate text-right text-white/45">
          SELECTED WORKS — &apos;26
        </span>
      </div>

    </section>
  );
}
