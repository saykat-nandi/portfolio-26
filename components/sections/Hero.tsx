"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { hero, nav } from "@/content/portfolio";

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
  value,
  suffix = "",
  active,
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  active: boolean;
  duration?: number;
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
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration, reduce, value]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeNav, setActiveNav] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = usePrefersReducedMotion();

  const moveSlider = useCallback((index: number) => {
    const el = linkRefs.current[index];
    const slider = sliderRef.current;
    if (!el || !slider) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentBox = parent.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    slider.style.width = `${box.width}px`;
    slider.style.transform = `translateX(${box.left - parentBox.left}px)`;
  }, []);

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
    const root = rootRef.current;
    if (!root) return;

    if (reduce) {
      root.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      if (progressRef.current) {
        progressRef.current.style.width = `${hero.feature.progress * 100}%`;
      }
      setReady(true);
      return;
    }

    const rises = Array.from(root.querySelectorAll<HTMLElement>("[data-rise]"));
    rises.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
    });

    const titleLines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-title-line]")
    );
    titleLines.forEach((el) => {
      el.style.transform = "translateY(110%)";
    });

    if (photoRef.current) {
      photoRef.current.style.opacity = "0";
      photoRef.current.style.filter = "blur(12px)";
      photoRef.current.style.transform = "translateY(40px)";
    }

    const run = () => {
      titleLines.forEach((el, i) => {
        el.animate(
          [
            { transform: "translateY(110%)" },
            { transform: "translateY(0%)" },
          ],
          {
            duration: 1000,
            delay: 110 * i,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });

      if (photoRef.current) {
        photoRef.current.animate(
          [
            { opacity: 0, filter: "blur(12px)", transform: "translateY(40px)" },
            { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
          ],
          {
            duration: 1300,
            delay: 120,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      }

      rises.forEach((el, i) => {
        const delay = Number(el.dataset.delay || 0) + i * 55;
        el.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0px)" },
          ],
          {
            duration: 700,
            delay,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });

      if (progressRef.current) {
        progressRef.current.animate(
          [
            { width: "0%" },
            { width: `${hero.feature.progress * 100}%` },
          ],
          {
            duration: 1200,
            delay: 700,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      }

      setReady(true);
    };

    const t = window.setTimeout(run, 40);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      if (!photoRef.current || !rootRef.current) return;
      const y = window.scrollY;
      const max = rootRef.current.offsetHeight;
      if (y > max) return;
      photoRef.current.style.translate = `0 ${y * 0.12}px`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  const links = nav.slice(0, 4);

  return (
    <section id="top" ref={rootRef} className="hero-orvante" aria-label="Hero">
      <div className="hero-stage hero-inner">
        <nav className="hero-nav-pill" data-rise data-delay="80" aria-label="Primary">
          <span ref={sliderRef} className="hero-nav-slider" aria-hidden />
          {links.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              className={i === activeNav ? "is-active" : undefined}
              onMouseEnter={() => {
                setActiveNav(i);
                moveSlider(i);
              }}
              onFocus={() => {
                setActiveNav(i);
                moveSlider(i);
              }}
              onClick={() => setActiveNav(i)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="hero-date" data-rise data-delay="120">
          {hero.dateLine}
        </p>

        <a
          className="hero-contact"
          href={hero.contactCta.href}
          data-rise
          data-delay="140"
        >
          {hero.contactCta.label} ↗
        </a>

        <h1 className="hero-title">
          {hero.displayLines.map((line) => (
            <span key={line} className="hero-title-mask">
              <span data-title-line style={{ display: "block" }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <span className="hero-year" data-rise data-delay="180">
          {hero.displayYear}
        </span>

        <p className="hero-about-label" data-rise data-delay="220">
          ● {hero.aboutLabel}
        </p>
        <p className="hero-about-copy" data-rise data-delay="240">
          {hero.about}
        </p>
        <a className="hero-btn" href={hero.bookCta.href} data-rise data-delay="260">
          {hero.bookCta.label} ↗
        </a>

        <div className="hero-photo-wrap" ref={photoRef}>
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>

        <div className="hero-brand-plate" data-rise data-delay="320">
          <svg className="hero-mark" viewBox="0 0 28 28" aria-hidden>
            <path fill="#fff" d="M4 22 L14 4 L14 14 Z" opacity="0.95" />
            <path fill="#fff" d="M14 14 L24 22 L14 22 Z" opacity="0.55" />
          </svg>
          <span className="hero-brand-name">{hero.brandPlate}</span>
          <span className="hero-menu-icon" aria-hidden>
            <span />
            <span />
          </span>
        </div>

        <div className="hero-marks-row" data-rise data-delay="360">
          {hero.marks.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="hero-badge" data-rise data-delay="280">
          <span className="hero-badge-check" aria-hidden>
            ✓
          </span>
          {hero.badge}
        </div>

        <p className="hero-avail" data-rise data-delay="300">
          {hero.availability.split(" / ")[0]} /
          <br />
          <span className="dot" aria-hidden />
          {hero.availability.split(" / ")[1]}
        </p>

        <div className="hero-outnow" data-rise data-delay="340">
          <div className="hero-outnow-meta">
            <span>{hero.feature.eyebrow}</span>
            <span className="title">{hero.feature.title}</span>
            <span>{hero.feature.year}</span>
          </div>
          <div className="hero-feature-card">
            <Image
              src={hero.photo.src}
              alt=""
              width={440}
              height={320}
              className="object-cover"
            />
            <a
              className="hero-feature-arrow"
              href={hero.primaryCta.href}
              aria-label={hero.primaryCta.label}
            >
              ↗
            </a>
            <div className="hero-progress">
              <span ref={progressRef} />
            </div>
          </div>
        </div>

        <div className="hero-stats" data-rise data-delay="300">
          <div className="hero-stats-dark">
            <div>
              <div className="stat-num">
                <CountUp
                  value={hero.partnerStat.value}
                  suffix={hero.partnerStat.suffix}
                  active={ready}
                />
              </div>
              <div className="stat-label">{hero.partnerStat.label}</div>
            </div>
            <div className="hero-partners">
              {hero.partners.map((p) => (
                <span key={p}>
                  <i aria-hidden />
                  {p}
                </span>
              ))}
            </div>
            <a className="hero-book-bar" href={hero.bookCta.href}>
              Book a call ↗
            </a>
          </div>
          <div className="hero-stats-photo">
            <Image src={hero.photo.src} alt="" fill sizes="200px" />
            <div className="feed">{hero.projectStat.feed}</div>
            <div className="proj">
              <strong>
                <CountUp
                  value={hero.projectStat.value}
                  suffix={hero.projectStat.suffix}
                  active={ready}
                />
              </strong>
              <span>{hero.projectStat.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-bar" data-rise data-delay="400">
        <span>
          EST <span className="muted">2019</span>
        </span>
        <a className="hero-scroll-mid" href="#about">
          SCROLL DOWN
          <span className="round" aria-hidden>
            ↓
          </span>
        </a>
        <span className="muted">LIVE IN DETAILS</span>
      </div>
    </section>
  );
}
