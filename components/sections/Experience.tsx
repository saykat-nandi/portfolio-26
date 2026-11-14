import { experience } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";

export function Experience() {
  return (
    <section
      id="experience"
      className="section-pad border-t border-ink/15 bg-paper py-20 text-ink md:py-28"
    >
      <div className="container-narrow">
        <FadeIn>
          <p className="eyebrow mb-3 text-signal">Experience</p>
          <h2 className="heading max-w-xl text-3xl text-ink md:text-4xl">
            Ownership and shipped impact
          </h2>
        </FadeIn>

        <div className="mt-12 space-y-10">
          {experience.map((job, i) => (
            <FadeIn key={job.company} delay={0.05 * i}>
              <article className="grid gap-4 border-t border-ink/15 pt-8 md:grid-cols-[0.35fr_0.65fr] md:gap-10">
                <div>
                  <h3 className="heading text-xl text-ink">{job.role}</h3>
                  <p className="mt-1 text-sm text-muted">{job.company}</p>
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
