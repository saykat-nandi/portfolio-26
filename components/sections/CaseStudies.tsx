"use client";

import { caseStudies } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

function LinkRow({
  liveUrl,
  sourceUrl,
  videoUrl,
}: {
  liveUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;
}) {
  const links = [
    liveUrl ? { href: liveUrl, label: "Live" } : null,
    videoUrl ? { href: videoUrl, label: "Walkthrough" } : null,
    sourceUrl ? { href: sourceUrl, label: "Source" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  if (!links.length) {
    return (
      <p className="text-xs tracking-wide text-muted">
        Links pending — add URLs in content/portfolio.ts
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="heading text-xs uppercase tracking-[0.14em] text-fg transition-opacity duration-200 hover:opacity-70"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}

export function CaseStudies() {
  return (
    <section id="work" className="section-pad border-t border-white/15 py-20 md:py-28">
      <div className="container-wide">
        <FadeIn>
          <p className="eyebrow mb-3">Flagship case studies</p>
          <h2 className="heading max-w-2xl text-3xl text-fg md:text-4xl">
            Engineering deep dives, not a gallery dump
          </h2>
        </FadeIn>

        <div className="mt-14 space-y-0">
          {caseStudies.map((study, index) => (
            <article
              key={study.id}
              id={study.id}
              className="group border-t border-white/15 py-12 transition-[border-color] duration-200 hover:border-white/40 md:py-16"
            >
              <FadeIn>
                <div className="grid gap-8 lg:grid-cols-[0.28fr_0.72fr] lg:gap-12">
                  <div className="space-y-4">
                    <p className="heading text-sm tracking-[0.08em] text-muted">
                      {study.number}
                    </p>
                    <h3 className="heading text-2xl leading-tight text-fg md:text-[1.65rem]">
                      {study.title}
                    </h3>
                    <p className="text-sm text-muted">{study.role}</p>
                    <Stagger className="flex flex-wrap gap-2 pt-2" stagger={0.04}>
                      {study.stack.map((item) => (
                        <StaggerItem key={item}>
                          <span className="border border-white/20 px-2 py-1 text-[0.65rem] uppercase tracking-[0.08em] text-muted transition-colors duration-200 group-hover:border-white/40">
                            {item}
                          </span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="eyebrow mb-2">The problem</h4>
                      <p className="prose-muted text-base">{study.problem}</p>
                    </div>

                    <div>
                      <h4 className="eyebrow mb-3">What I built</h4>
                      <ul className="space-y-3">
                        {study.built.map((item) => (
                          <li
                            key={item}
                            className="relative pl-4 prose-muted text-base before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:bg-fg"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid gap-4 border border-white/15 bg-bg-elevated p-4 sm:grid-cols-2">
                      <div>
                        <p className="eyebrow mb-2">Flow</p>
                        <p className="heading text-sm text-fg">{study.diagramLabel}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {study.diagramLabel.split("→").map((node, i, arr) => (
                            <span key={`${node}-${i}`} className="flex items-center gap-2">
                              <span className="border border-white/20 px-2 py-1 text-[0.65rem] text-muted">
                                {node.trim()}
                              </span>
                              {i < arr.length - 1 ? (
                                <span className="text-muted">→</span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="eyebrow mb-2">Snippet</p>
                        <pre className="code-panel">{study.codeSnippet}</pre>
                      </div>
                    </div>

                    <LinkRow
                      liveUrl={study.liveUrl}
                      sourceUrl={study.sourceUrl}
                      videoUrl={study.videoUrl}
                    />
                  </div>
                </div>
              </FadeIn>
              {index === caseStudies.length - 1 ? (
                <div className="mt-12 border-b border-white/15" />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
