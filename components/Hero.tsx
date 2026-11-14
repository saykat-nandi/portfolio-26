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
import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import HeroAtmosphere from "@/components/HeroAtmosphere";
import Gyroscope3D from "@/components/Gyroscope3D";
import { ContactDialogButton } from "@/components/ContactDialog";
import { contact } from "@/content/portfolio";
import { useBootReveal } from "@/components/BootGate";
import { polish } from "@/lib/polish";
import { playLatch, playTick } from "@/lib/relayClick";
import { emitShippedCycle } from "@/lib/shippedCycle";

const NAV = [
  { label: "Home", short: "Home", href: "#top" },
  { label: "Systems", short: "Work", href: "#work" },
  { label: "Architecture", short: "Stack", href: "#stack" },
  { label: "Hardware Lab", short: "Lab", href: "#lab" },
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
  const node = "var(--signal)";
  const label = {
    fill: "rgba(244,244,244,0.55)",
    fontSize: 8,
    fontFamily: "var(--font-geist-mono), monospace",
    letterSpacing: "0.12em",
  } as const;

  if (index === 0) {
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden>
        <rect width="280" height="120" fill="var(--ink)" />
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="none">
          <path d="M20 90 H260" />
          <path d="M40 30 L80 70 L140 40 L200 75 L250 35" />
          <circle cx="80" cy="70" r="4" fill={node} />
          <circle cx="140" cy="40" r="4" fill={node} />
          <circle cx="200" cy="75" r="4" fill={node} />
        </g>
        <text x="80" y="108" textAnchor="middle" {...label}>
          MATCH
        </text>
        <text x="140" y="108" textAnchor="middle" {...label}>
          ESCROW
        </text>
        <text x="200" y="108" textAnchor="middle" {...label}>
          SETTLE
        </text>
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden>
        <rect width="280" height="120" fill="var(--ink)" />
        <g stroke="rgba(255,255,255,0.28)" fill="none">
          <rect x="28" y="22" width="70" height="58" rx="4" />
          <rect x="108" y="22" width="70" height="58" rx="4" />
          <rect x="188" y="22" width="64" height="58" rx="4" />
          <path d="M98 51 H108 M178 51 H188" />
        </g>
        <circle cx="63" cy="51" r="5" fill={node} />
        <circle cx="143" cy="51" r="5" fill={node} />
        <circle cx="220" cy="51" r="5" fill={node} />
        <text x="63" y="100" textAnchor="middle" {...label}>
          LOBBY
        </text>
        <text x="143" y="100" textAnchor="middle" {...label}>
          ESCROW
        </text>
        <text x="220" y="100" textAnchor="middle" {...label}>
          PAYOUT
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden>
      <rect width="280" height="120" fill="var(--ink)" />
      <g stroke="rgba(255,255,255,0.22)" fill="none">
        <rect x="36" y="24" width="48" height="60" />
        <rect x="96" y="36" width="48" height="48" />
        <rect x="156" y="20" width="48" height="64" />
        <rect x="216" y="44" width="36" height="40" />
        <path d="M60 96 H232" stroke={node} />
      </g>
      <text x="60" y="108" textAnchor="middle" {...label}>
        INGEST
      </text>
      <text x="120" y="108" textAnchor="middle" {...label}>
        PACK
      </text>
      <text x="180" y="108" textAnchor="middle" {...label}>
        QA
      </text>
      <text x="234" y="108" textAnchor="middle" {...label}>
        SHIP
      </text>
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
  const { entranceDelayMs } = useBootReveal();
  const rootRef = useRef<HTMLElement>(null);
  useScrollProgress(rootRef, { mode: "pass-through" });

  const sliderRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const portraitRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const shippedRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const exploreBtnRef = useRef<HTMLAnchorElement>(null);
  const contactBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedNav, setSelectedNav] = useState(0);
  const [hoverNav, setHoverNav] = useState<number | null>(null);
  const activeNav = hoverNav ?? selectedNav;
  const [navReady, setNavReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [statusReady, setStatusReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [buildIndex, setBuildIndex] = useState(0);
  const [barEpoch, setBarEpoch] = useState(0);
  const [exitCovered, setExitCovered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [chartHover, setChartHover] = useState(false);

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
      if (e.key === "Escape") {
        setDrawerOpen(false);
        playLatch();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (polish("navLayoutId")) {
      setNavReady(true);
      return;
    }
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

    // Rise with the boot shutter mid-exit so the handoff reads as one motion
    const t = window.setTimeout(() => {
      lines.forEach((el, i) => {
        el.animate(
          [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
          {
            duration: 980,
            delay: 90 * i,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });

      portraitRef.current?.animate(
        [
          { opacity: 0, transform: "translateY(40px) scale(1.03)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        {
          duration: 1180,
          delay: 60,
          fill: "forwards",
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }
      );

      rises.forEach((el, i) => {
        el.animate(
          [
            { opacity: 0, transform: "translateY(22px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 780,
            delay: Number(el.dataset.delay || 0) + i * 48,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });

      setReady(true);
    }, entranceDelayMs);

    return () => window.clearTimeout(t);
  }, [entranceDelayMs, reduce]);

  useEffect(() => {
    emitShippedCycle();
  }, [buildIndex]);

  // Pause SHIPPED bar when hero exit stage is fully covered
  useEffect(() => {
    const sync = () => {
      const exitEl = document.querySelector("[data-hero-exit]");
      setExitCovered(!!exitEl?.hasAttribute("data-exit-covered"));
    };
    window.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", sync);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const bumpShippedBar = () => setBarEpoch((n) => n + 1);

  const nextBuild = () => {
    setBuildIndex((i) => (i + 1) % BUILDS.length);
    bumpShippedBar();
    playTick();
  };

  const prevBuild = () => {
    setBuildIndex((i) => (i - 1 + BUILDS.length) % BUILDS.length);
    bumpShippedBar();
    playTick();
  };

  const build = BUILDS[buildIndex];

  return (
    <section
      id="top"
      ref={rootRef}
      style={{ "--progress": 0.5 } as CSSProperties}
      className="relative isolate flex flex-col overflow-hidden bg-paper text-ink font-[family-name:var(--font-inter-tight)] min-h-0 max-lg:h-auto lg:h-[100dvh]"
    >
      <HeroAtmosphere
        containerRef={rootRef}
        portraitRef={portraitRef}
        plateRef={plateRef}
        shippedRef={shippedRef}
        titleRef={titleRef}
        reducedMotion={reduce}
      />

      {/* Top bar — token gutters + transform inset so edge-lift never clips the pill */}
      <div
        className="relative z-30 flex shrink-0 items-center justify-between gap-3"
        style={{
          paddingInline: "var(--page-gutter)",
          paddingTop: "max(var(--hero-chrome-pt), var(--safe-t))",
        }}
      >
        <nav
          className="relative flex h-11 min-w-0 max-w-[calc(100%-4.5rem)] flex-1 items-stretch overflow-hidden rounded-[6px] border border-black/15 bg-white p-1.5 md:max-w-[min(100%,520px)] md:flex-none"
          aria-label="Primary"
          data-rise
          data-delay="40"
          onMouseLeave={() => {
            setHoverNav(null);
            setSelectedNav(0);
            if (!polish("navLayoutId")) moveSlider(0);
          }}
        >
          {!polish("navLayoutId") && (
            <span
              ref={sliderRef}
              className="absolute top-1.5 bottom-1.5 left-0 z-0 rounded-[4px] bg-ink transition-[transform,width] duration-200 ease-out"
              aria-hidden
              style={{ opacity: navReady ? 1 : 0 }}
            />
          )}
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              className={`relative z-10 inline-flex min-w-0 flex-1 items-center justify-center self-stretch rounded-[4px] px-1.5 text-[11px] font-medium transition-colors duration-200 sm:flex-none sm:px-3.5 sm:text-[13px] ${
                i === activeNav && navReady ? "text-white" : "text-ink"
              }`}
              onMouseEnter={() => {
                setHoverNav(i);
                if (!polish("navLayoutId")) moveSlider(i);
              }}
              onFocus={() => {
                setHoverNav(i);
                if (!polish("navLayoutId")) moveSlider(i);
              }}
              onBlur={() => {
                setHoverNav(null);
                if (!polish("navLayoutId")) moveSlider(selectedNav);
              }}
              onClick={() => {
                setSelectedNav(i);
                setHoverNav(null);
                if (!polish("navLayoutId")) moveSlider(i);
                playTick();
              }}
            >
              {polish("navLayoutId") && i === activeNav && navReady ? (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-0 -z-10 rounded-[4px] bg-ink"
                  transition={{
                    type: "tween",
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ) : null}
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
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
          <ContactDialogButton
            buttonRef={contactBtnRef}
            className="group inline-flex h-11 items-center justify-center rounded-[6px] bg-ink px-5 text-[13px] font-medium text-on-ink transition-[background,color,box-shadow,transform] duration-200 [@media(hover:hover)]:hover:bg-signal [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:shadow-[0_0_0_2px_var(--signal)] max-md:h-10 max-md:w-10 max-md:px-0"
            onMouseMove={(e) =>
              magneticMove(contactBtnRef.current, e, reduce)
            }
            onMouseLeave={() => magneticReset(contactBtnRef.current)}
          >
            <span className="max-md:hidden">
              Get in Touch{" "}
              <span className="text-signal transition-colors group-hover:text-white">
                ↗
              </span>
            </span>
            <span className="text-signal md:hidden group-hover:text-white">
              ↗
            </span>
          </ContactDialogButton>
        </div>
      </div>

      {/*
        Inner hero stage — max-w 1440 keeps focal group on wide monitors.
        Nav + bottom ticker stay full-bleed. Side columns flex (no 360px cage)
        so SYSTEMS never clips.
      */}
      <div
        className="relative z-10 mx-auto grid w-full min-h-0 max-w-[1440px] flex-1 grid-cols-1 overflow-x-hidden px-4 max-lg:h-auto max-lg:flex-none sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,1.2fr)_minmax(0,0.95fr)] lg:gap-5 lg:px-8 xl:gap-8"
        style={{
          paddingBlock: "var(--hero-stage-gap)",
          gap: "var(--hero-stage-gap)",
          /* Keep 3D nameplate / SHIPPED paint inside the overflow-hidden hero */
          paddingInline: "max(1rem, var(--page-gutter))",
        }}
      >
        {/* Left column */}
        <div
          className="relative z-20 flex min-w-0 flex-col justify-center overflow-visible lg:justify-start lg:pr-2"
          style={{
            paddingTop: "clamp(0px, 2vh, 2rem)",
            transform: "translateY(var(--hero-left-lift))",
          }}
        >
          <h1
            ref={titleRef}
            className="hero-display-title max-w-full font-[family-name:var(--font-archivo)] font-bold leading-[0.86] tracking-[-0.05em] text-ink"
            style={{ fontSize: "var(--hero-title)" }}
          >
            <span className="relative inline-block max-w-full overflow-hidden pr-[0.55em]">
              <span data-title-line className="inline-block">
                SYSTEMS
              </span>
              <sup className="absolute right-0 top-2 font-[family-name:var(--font-archivo)] text-[0.22em] font-medium tracking-normal text-ink/80 [font-variation-settings:'wdth'_100]">
                (&apos;26)
              </sup>
            </span>
            <span className="mt-1 block overflow-hidden">
              <span data-title-line className="inline-block">
                ENGINEER
              </span>
            </span>
          </h1>

          <div className="hero-about-block relative z-10 mt-6 w-full max-w-sm sm:mt-8" data-rise data-delay="120">
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
                className="group inline-flex h-11 items-center rounded-[6px] bg-ink px-5 text-[13px] font-medium text-on-ink transition-[background,color,box-shadow] duration-200 [@media(hover:hover)]:hover:bg-signal [@media(hover:hover)]:hover:text-white"
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
                className="inline-flex h-11 items-center rounded-[6px] border border-black/15 bg-white px-5 text-[13px] font-medium text-ink transition-[transform,background,box-shadow] duration-200 [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:shadow-[0_0_0_2px_var(--signal)]"
              >
                {copied ? "Copied ✓" : "Copy Email"}
              </button>
            </div>
          </div>

          <div
            className="hero-years-card mt-4 grid w-full max-w-none grid-cols-2 overflow-hidden rounded-[6px] border border-black/15 bg-bento sm:max-w-[370px]"
            data-rise
            data-delay="180"
          >
            <div className="flex flex-col justify-between bg-panel p-3.5 text-on-ink sm:p-4">
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

            <div
              className="relative flex flex-col justify-between bg-[color-mix(in_srgb,var(--paper)_70%,#cfcfcf)] p-3.5"
              onMouseEnter={() => !reduce && setChartHover(true)}
              onMouseLeave={() => setChartHover(false)}
            >
              <p className="font-[family-name:var(--font-archivo)] text-[11px] uppercase tracking-[0.12em] text-ink/80">
                Core Focus · 01/04
              </p>
              <svg
                viewBox="0 0 140 100"
                className="mx-auto my-2 h-20 w-full overflow-visible"
                aria-hidden
              >
                <motion.g
                  stroke="var(--ink)"
                  strokeWidth="1.15"
                  fill="none"
                  animate={{
                    y: chartHover ? -5 : 0,
                    opacity: chartHover ? 0.9 : 0.62,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <path d="M10 80 H130 M20 20 V80 M50 30 V80 M80 18 V80 M110 35 V80" />
                </motion.g>
                <motion.g
                  animate={{ y: chartHover ? -10 : 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <circle cx="50" cy="30" r="3.2" fill="var(--signal)" />
                  <circle cx="80" cy="18" r="3.2" fill="var(--signal)" />
                  <circle cx="110" cy="35" r="3.2" fill="var(--signal)" />
                  <motion.path
                    d="M50 30 L80 18 L110 35"
                    stroke="var(--signal)"
                    strokeWidth="1.5"
                    fill="none"
                    className={polish("heroChartDraw") ? "hero-chart-draw" : undefined}
                    animate={{ opacity: chartHover ? 1 : 0.75 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.g>
              </svg>
              <div className="mt-1 space-y-0.5 text-right">
                <p className="font-[family-name:var(--font-archivo)] text-[18px] font-semibold tracking-[-0.03em] text-ink">
                  Full-Stack
                </p>
                <p className="text-[11px] leading-snug text-ink/65">
                  Backend, APIs & Interactive UI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center portrait — Layer 3 */}
        <div className="relative z-10 order-first flex min-h-[min(48dvh,360px)] items-end justify-center overflow-hidden sm:min-h-[420px] lg:order-none lg:min-h-0 lg:overflow-visible">
          <div
            ref={portraitRef}
            className="relative z-[2] mx-auto h-[min(48dvh,360px)] w-full max-w-[320px] sm:h-[440px] sm:max-w-[400px] lg:h-[min(88%,720px)] lg:min-w-0 lg:w-full lg:max-w-none"
          >
            {/* Layer 10 — gyro / radar field behind cutout */}
            <div className="pointer-events-none absolute left-1/2 top-[36%] z-[10] w-[min(118%,360px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(130%,480px)] lg:w-[min(145%,620px)]">
              <Gyroscope3D className="w-full" />
            </div>

            {/* Layer 20 — portrait cutout occludes ring crossings */}
            <div
              className="pointer-events-none absolute inset-0 z-[20]"
              style={{
                transform:
                  "translateY(calc((var(--progress) - 0.5) * 90px)) scale(calc(1 + (var(--progress) - 0.5) * 0.06))",
              }}
            >
              <Image
                src="/saykat-bw.png"
                alt="Saykat Nandi Dip"
                fill
                priority
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 100vw, 680px"
              />
            </div>
            {/* Layer 30 — floating telemetry badge */}
            <div className="absolute bottom-[18%] left-1/2 z-[30] w-[min(92%,300px)] max-w-[340px] -translate-x-1/2 sm:bottom-[21%] sm:left-[54%] sm:w-[min(96%,340px)]">
              <div data-rise data-delay="160">
                <div
                  ref={plateRef}
                  style={{
                    background:
                      "radial-gradient(circle at var(--glare, 50%) 0%, rgba(255,255,255,0.14), var(--panel) 70%)",
                  }}
                  className="flex items-center justify-between gap-2 rounded-[6px] border border-white/15 bg-panel px-4 py-2.5 shadow-2xl transition-[transform,box-shadow,border-color] duration-200 [@media(hover:hover)]:hover:scale-[1.02] [@media(hover:hover)]:hover:border-white/30 [@media(hover:hover)]:hover:shadow-[0_0_28px_rgba(255,255,255,0.18),0_20px_50px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-[2px] bg-signal" />
                    <span className="truncate font-mono text-[13px] font-semibold tracking-[0.14em] text-white max-sm:text-[11px] max-sm:tracking-[0.1em]">
                      SAYKAT NANDI DIP
                    </span>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[4px] border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-zinc-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — SHIPPED */}
        <div
          className="hero-right-col relative z-20 flex w-full flex-col items-start justify-center gap-4 sm:gap-6 lg:items-end lg:pl-2"
          data-rise
          data-delay="140"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[12px] font-medium">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-white">
              ✓
            </span>
            Production Architecture
          </div>

          <p className="max-w-[280px] text-left text-[18px] font-medium leading-snug tracking-[-0.03em] text-ink sm:text-[20px] lg:max-w-[220px] lg:text-right">
            Open to Full-Stack /
            <br />
            <span className="inline-block h-2 w-2 rounded-full bg-signal align-middle" />{" "}
            Backend Roles
          </p>

          <div
            ref={shippedRef}
            className="w-full max-w-none sm:max-w-[320px]"
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            <div
              className={`relative overflow-hidden rounded-[6px] border border-white/10 bg-panel text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-[shadow,transform] duration-300 [@media(hover:hover)]:hover:-translate-y-0.5 ${
                cardHover ? "shadow-[0_24px_60px_rgba(0,0,0,0.28)]" : ""
              }`}
            >
              {polish("shippedTopBar") && (
                <div
                  key={barEpoch}
                  className={`hero-shipped-progress pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] origin-left bg-signal${
                    reduce
                      ? " is-complete"
                      : cardHover || exitCovered
                        ? " is-paused"
                        : ""
                  }`}
                  onAnimationIteration={() => {
                    if (reduce) return;
                    setBuildIndex((i) => (i + 1) % BUILDS.length);
                    playTick();
                  }}
                  aria-hidden
                />
              )}
              <div className="overflow-hidden">
                <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/8 bg-panel px-3 py-2.5">
                  <span className="shrink-0 font-[family-name:var(--font-archivo)] text-[11px] tracking-[0.12em] text-white/70">
                    {build.id} / SHIPPED
                  </span>
                  <div className="flex items-center gap-1.5">
                    {BUILDS.map((b, i) => (
                      <button
                        key={b.id}
                        type="button"
                        aria-label={`Show ${b.title}`}
                        onClick={() => {
                          setBuildIndex(i);
                          bumpShippedBar();
                          playTick();
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
                      className="ml-1 grid h-7 w-7 place-items-center rounded-[4px] border border-white/20 bg-white/10 text-xs transition hover:bg-white/20"
                      aria-label="Previous project"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={nextBuild}
                      className="grid h-7 w-7 place-items-center rounded-[4px] border border-white/20 bg-white/10 text-xs transition hover:bg-white/20"
                      aria-label="Next project"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(true);
                    playLatch();
                  }}
                  className="relative block h-[108px] w-full cursor-pointer overflow-hidden"
                  aria-label={`Open architecture for ${build.title}`}
                >
                  <div
                    key={buildIndex}
                    className="h-full w-full animate-[shippedSlide_420ms_cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <BuildArt index={buildIndex} />
                  </div>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(true);
                  playLatch();
                }}
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
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture drawer — overflow-hidden so closed slide doesn't widen the page */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition ${
          drawerOpen
            ? "pointer-events-auto"
            : "pointer-events-none invisible"
        }`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/45 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close architecture drawer"
          onClick={() => {
            setDrawerOpen(false);
            playLatch();
          }}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink text-on-ink shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              onClick={() => {
                setDrawerOpen(false);
                playLatch();
              }}
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

      {/* Bottom obsidian bar — always fully visible inside 100dvh */}
      <div
        className="relative z-30 flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/15 bg-ink text-[10px] font-medium tracking-[0.08em] text-on-ink font-[family-name:var(--font-archivo)] sm:text-[11px] sm:tracking-[0.1em] lg:text-[13px]"
        style={{ paddingInline: "var(--page-gutter)" }}
        data-rise
        data-delay="280"
      >
        <span className="hidden min-w-0 max-w-[36%] truncate text-on-ink/90 sm:block">
          FULL-STACK & SYSTEMS ARCHITECTURE
        </span>
        <a
          href="#statement"
          className="group inline-flex flex-1 items-center justify-center gap-2.5 text-on-ink no-underline sm:flex-none"
        >
          <span>SCROLL DOWN</span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/35 text-[11px] transition-[border-color,color,transform] duration-200 group-hover:border-signal group-hover:text-signal motion-safe:animate-[scrollNudge_1.8s_ease-in-out_infinite]">
            ↓
          </span>
        </a>
        <span className="hidden min-w-0 max-w-[36%] truncate text-right text-white/45 sm:block">
          SELECTED WORKS — &apos;26
        </span>
      </div>

    </section>
  );
}
