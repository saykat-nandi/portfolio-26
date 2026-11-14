import { testimonials } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-pad border-t border-white/15 py-20 md:py-28"
    >
      <div className="container-wide">
        <FadeIn>
          <p className="eyebrow mb-3">Social proof</p>
          <h2 className="heading max-w-xl text-3xl text-fg md:text-4xl">
            Specific praise beats vague compliments
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Placeholder quotes — swap real ones in content/portfolio.ts.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid gap-8 md:grid-cols-3" stagger={0.07}>
          {testimonials.map((t) => (
            <StaggerItem
              key={t.name}
              className="flex flex-col justify-between border-t border-white/15 pt-6"
            >
              <blockquote className="text-base leading-relaxed text-fg/90">
                “{t.quote}”
              </blockquote>
              <footer className="mt-6">
                <p className="heading text-sm text-fg">{t.name}</p>
                <p className="mt-1 text-xs text-muted">{t.title}</p>
              </footer>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
