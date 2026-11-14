import { techStack } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export function TechStack() {
  return (
    <section id="stack" className="section-pad border-t border-white/15 py-20 md:py-28">
      <div className="container-wide">
        <FadeIn>
          <p className="eyebrow mb-3">Tech stack</p>
          <h2 className="heading max-w-xl text-3xl text-fg md:text-4xl">
            Grouped by capability, not vanity ratings
          </h2>
        </FadeIn>

        <Stagger className="mt-12 grid gap-8 sm:grid-cols-2" stagger={0.07}>
          {techStack.map((group) => (
            <StaggerItem
              key={group.title}
              className="border-t border-white/15 pt-6"
            >
              <h3 className="heading mb-4 text-lg text-fg">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <span className="mt-2 h-px w-3 shrink-0 bg-fg" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
