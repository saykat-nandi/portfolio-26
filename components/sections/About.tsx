import { about } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";

export function About() {
  return (
    <section
      id={about.id}
      className="section-pad border-t border-ink/15 bg-paper py-20 text-ink md:py-28"
    >
      <div className="container-narrow grid gap-10 md:grid-cols-[0.35fr_0.65fr] md:gap-16">
        <FadeIn>
          <p className="eyebrow mb-3 text-signal">{about.eyebrow}</p>
          <h2 className="heading text-3xl text-ink md:text-4xl">{about.title}</h2>
        </FadeIn>
        <div className="space-y-5">
          {about.paragraphs.map((p, i) => (
            <FadeIn key={i} delay={0.05 * i}>
              <p className="prose-muted text-base md:text-[1.05rem]">{p}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
