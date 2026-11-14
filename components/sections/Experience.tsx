"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { experience } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";
import { useArriveReplay } from "@/hooks/useArriveReplay";
import { polish } from "@/lib/polish";

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const crossedRef = useRef(false);
  const useRail = polish("experienceTickRail");
  const useHead = polish("experienceScrollHead");

  useArriveReplay("#experience", () => {
    if (!useRail) return;
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;
    const jobs = [...list.querySelectorAll<HTMLElement>("[data-exp-job]")];
    jobs.forEach((j) => j.classList.remove("is-tripped"));
    crossedRef.current = false;
    section.style.setProperty("--exp-progress", "0");
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const raw =
        (vh * 0.35 - rect.top) / Math.max(1, rect.height - vh * 0.2);
      section.style.setProperty(
        "--exp-progress",
        Math.min(1, Math.max(0, raw)).toFixed(4)
      );
      jobs.forEach((job, i) => {
        if (job.getBoundingClientRect().top < vh * 0.42) {
          job.classList.add("is-tripped");
        }
        if (useHead && i === 1 && flashRef.current) {
          const flash = flashRef.current;
          flash.style.top = `${job.offsetTop}px`;
          flash.classList.remove("is-firing");
          void flash.offsetWidth;
          flash.classList.add("is-firing");
          crossedRef.current = true;
        }
      });
    });
  });

  useEffect(() => {
    if (!useRail) return;
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const jobs = [...list.querySelectorAll<HTMLElement>("[data-exp-job]")];

    if (reduce) {
      section.style.setProperty("--exp-progress", "1");
      jobs.forEach((j) => j.classList.add("is-tripped"));
      return;
    }

    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.35 - rect.top) / Math.max(1, rect.height - vh * 0.2);
      const progress = Math.min(1, Math.max(0, raw));
      section.style.setProperty("--exp-progress", progress.toFixed(4));

      jobs.forEach((job, i) => {
        const jr = job.getBoundingClientRect();
        const tripLine = vh * 0.42;
        if (jr.top < tripLine) job.classList.add("is-tripped");

        if (useHead && i === 1 && flashRef.current) {
          const crossing = jr.top < tripLine;
          if (crossing && !crossedRef.current) {
            crossedRef.current = true;
            const flash = flashRef.current;
            flash.style.top = `${job.offsetTop}px`;
            flash.classList.remove("is-firing");
            void flash.offsetWidth;
            flash.classList.add("is-firing");
          }
          if (!crossing) crossedRef.current = false;
        }
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [useRail, useHead]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-pad section-pad-y border-t border-ink/15 bg-paper text-ink"
      style={useRail ? ({ "--exp-progress": 0 } as CSSProperties) : undefined}
    >
      <div className="container-narrow">
        <FadeIn>
          <p className="eyebrow mb-3 text-signal">Experience</p>
          <h2 className="heading max-w-xl text-3xl text-ink md:text-4xl">
            Ownership and shipped impact
          </h2>
        </FadeIn>

        <div
          ref={listRef}
          className={`mt-12 space-y-10${useRail ? " relative pl-4" : ""}`}
        >
          {useRail ? (
            <div className="exp-tick-rail" aria-hidden>
              <div className="exp-tick-progress" />
              {useHead ? <span className="exp-tick-head" /> : null}
              {useHead ? (
                <span ref={flashRef} className="exp-archive-flash" />
              ) : null}
            </div>
          ) : null}

          {experience.map((job, i) => (
            <FadeIn key={job.company} delay={0.05 * i}>
              <article
                data-exp-job
                className={`grid gap-4 border-t border-ink/15 pt-8 md:grid-cols-[0.35fr_0.65fr] md:gap-10${
                  useRail ? " exp-job" : ""
                }`}
              >
                <div>
                  {useRail ? (
                    <span
                      className={`exp-status ${
                        i === 0 ? "exp-status--current" : "exp-status--archive"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")} //{" "}
                      {i === 0 ? "CURRENT" : "ARCHIVE"}
                    </span>
                  ) : null}
                  <h3 className="heading text-xl text-ink">{job.role}</h3>
                  <p className="mt-1 text-sm text-muted">{job.company}</p>
                  {job.domain ? (
                    <p className="mt-1 font-mono text-[11px] tracking-[0.08em] text-signal">
                      {job.domain}
                    </p>
                  ) : null}
                  <p className="eyebrow mt-3">{job.period}</p>
                  <p className="mt-1 text-sm text-muted">{job.location}</p>
                </div>
                <ul className="space-y-3">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-4 prose-muted text-base before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:bg-signal"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
