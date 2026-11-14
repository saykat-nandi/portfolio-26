"use client";

import { useEffect, useRef, useState } from "react";
import { about } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";
import { polish } from "@/lib/polish";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [printed, setPrinted] = useState(false);
  const usePlate = polish("aboutPrintPlate");
  const useWipe = polish("aboutCaliperWipe");

  useEffect(() => {
    if (!usePlate && !useWipe) return;
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPrinted(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPrinted(true);
        io.disconnect();
      },
      { threshold: 0.28 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [usePlate, useWipe]);

  return (
    <section
      id={about.id}
      ref={sectionRef}
      className={`section-pad section-pad-y border-t border-ink/15 bg-paper text-ink${
        usePlate || useWipe ? " about-print" : ""
      }${useWipe ? " about-caliper-wipe" : ""}${printed ? " is-printed" : ""}`}
    >
      {usePlate || useWipe ? (
        <div className="about-reg container-narrow" aria-hidden>
          <span className="about-reg-line" />
          <span className="about-reg-tick about-reg-tick--l">+</span>
          <span className="about-reg-tick about-reg-tick--r">+</span>
        </div>
      ) : null}

      <div className="container-narrow grid gap-10 md:grid-cols-[0.35fr_0.65fr] md:gap-16">
        <FadeIn>
          <div className={useWipe ? "about-title-wipe" : undefined}>
            <p className="eyebrow mb-3 text-signal">{about.eyebrow}</p>
            <h2 className="heading text-3xl text-ink md:text-4xl">{about.title}</h2>
          </div>
        </FadeIn>
        <div
          className={`space-y-5${usePlate || useWipe ? " about-ink" : ""}`}
        >
          {about.paragraphs.map((p, i) => (
            <FadeIn key={i} delay={usePlate || useWipe ? 0 : 0.05 * i}>
              <p className="prose-muted text-base md:text-[1.05rem]">{p}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
