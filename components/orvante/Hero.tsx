"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { hero, media, nav } from "@/content/orvante";
import { usePrefersReducedMotion } from "@/components/orvante/useU";

export function OrvanteHero() {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const scrollLabelRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeNav, setActiveNav] = useState(0);
  const reduce = usePrefersReducedMotion();
  const links = nav.slice(0, 4);

  const moveSlider = useCallback((index: number) => {
    const el = linkRefs.current[index];
    const slider = sliderRef.current;
    if (!el || !slider?.parentElement) return;
    const parentBox = slider.parentElement.getBoundingClientRect();
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
      });
      if (progressRef.current) {
        progressRef.current.style.width = `${hero.feature.progress * 100}%`;
      }
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
      photoRef.current.style.transform = "translateX(-50%) translateY(40px)";
    }

    const t = window.setTimeout(() => {
      titleLines.forEach((el, i) => {
        el.animate(
          [{ transform: "translateY(110%)" }, { transform: "translateY(0%)" }],
          {
            duration: 1000,
            delay: 110 * i,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });

      photoRef.current?.animate(
        [
          {
            opacity: 0,
            filter: "blur(12px)",
            transform: "translateX(-50%) translateY(40px)",
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translateX(-50%) translateY(0px)",
          },
        ],
        {
          duration: 1300,
          delay: 100,
          fill: "forwards",
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }
      );

      rises.forEach((el, i) => {
        el.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 650,
            delay: Number(el.dataset.delay || 0) + i * 40,
            fill: "forwards",
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });

      progressRef.current?.animate(
        [{ width: "0%" }, { width: `${hero.feature.progress * 100}%` }],
        {
          duration: 1100,
          delay: 600,
          fill: "forwards",
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }
      );
    }, 40);

    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (photoRef.current && rootRef.current && y <= rootRef.current.offsetHeight) {
        const mobile = window.innerWidth <= 760;
        photoRef.current.style.translate = mobile
          ? `0 ${y * 0.08}px`
          : `-50% ${y * 0.1}px`;
      }
      if (scrollLabelRef.current) {
        scrollLabelRef.current.textContent =
          y > (rootRef.current?.offsetHeight || 800) * 0.55
            ? "STAY CURIOUS"
            : "SCROLL DOWN";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  return (
    <section id="top" ref={rootRef} className="ov-hero" aria-label="Hero">
      <div className="ov-hero-stage">
        <nav className="ov-nav" data-rise data-delay="60" aria-label="Primary">
          <span ref={sliderRef} className="ov-nav-slider" aria-hidden>
            <i />
          </span>
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
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="ov-date" data-rise data-delay="100">
          {hero.dateLine}
        </p>

        <a className="ov-contact" href={hero.contactCta.href} data-rise data-delay="120">
          <span>{hero.contactCta.label}</span>
          <em aria-hidden>↗</em>
        </a>

        <h1 className="ov-title ov-title--split">
          <span className="ov-title-left">
            <span className="ov-title-mask">
              <span data-title-line>{hero.displayLines[0]}</span>
            </span>
          </span>
          <span className="ov-title-right">
            <span className="ov-title-mask">
              <span data-title-line>{hero.displayLines[1]}</span>
            </span>
          </span>
        </h1>

        <span className="ov-year" data-rise data-delay="160">
          {hero.displayYear}
        </span>

        <p className="ov-about-label" data-rise data-delay="180">
          ● {hero.aboutLabel}
        </p>
        <p className="ov-about-copy" data-rise data-delay="200">
          {hero.about}
        </p>
        <a className="ov-btn" href={hero.bookCta.href} data-rise data-delay="220">
          {hero.bookCta.label} ↗
        </a>

        <div className="ov-photo ov-photo--full" ref={photoRef}>
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>

        <div className="ov-plate" data-rise data-delay="280">
          <svg className="ov-mark" viewBox="0 0 32 32" aria-hidden>
            <rect x="3" y="3" width="12" height="12" fill="#fff" />
            <path d="M17 8 L29 20 L17 29 Z" fill="#fff" opacity="0.55" />
          </svg>
          <span>{hero.brandPlate}</span>
          <span className="ov-menu" aria-hidden>
            <i />
            <i />
          </span>
        </div>

        <div className="ov-marks ov-marks--on-photo" data-rise data-delay="300">
          {hero.marks.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="ov-badge" data-rise data-delay="240">
          <span className="ov-badge-check">✓</span>
          {hero.badge}
        </div>

        <p className="ov-avail" data-rise data-delay="260">
          {hero.availability.split(" / ")[0]} /
          <br />
          <span className="dot" />
          {hero.availability.split(" / ")[1]}
        </p>

        <div className="ov-outnow" data-rise data-delay="280">
          <div className="ov-outnow-meta">
            <span>{hero.feature.eyebrow}</span>
            <strong>{hero.feature.title}</strong>
            <span>{hero.feature.year}</span>
          </div>
          <div className="ov-feature">
            <Image src={media.feature} alt="" width={480} height={360} />
            <a
              className="ov-feature-arrow"
              href={hero.primaryCta.href}
              aria-label={hero.primaryCta.label}
            >
              ↗
            </a>
            <div className="ov-progress">
              <span ref={progressRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="ov-bar" data-rise data-delay="340">
        <span>
          EST <span className="muted">2019</span>
        </span>
        <a className="ov-bar-mid" href="#statement">
          <span ref={scrollLabelRef}>SCROLL DOWN</span>
          <span className="round">↓</span>
        </a>
        <span className="muted">LIVE IN DETAILS</span>
      </div>
    </section>
  );
}
