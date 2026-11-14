import { lab } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export function Lab() {
  return (
    <section id="lab" className="section-pad border-t border-white/15 py-20 md:py-28">
      <div className="container-wide">
        <FadeIn>
          <p className="eyebrow mb-3">The lab</p>
          <h2 className="heading max-w-2xl text-3xl text-fg md:text-4xl">
            Hardware & systems playground
          </h2>
          <p className="mt-4 max-w-xl prose-muted">
            Side builds outside paid tickets—microcontrollers, acoustics, and thermal hardware.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.08}>
          {lab.map((item, index) => (
            <StaggerItem
              key={item.title}
              className="border border-white/15 bg-bg-elevated p-6 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-white/35"
            >
              <p className="eyebrow mb-4">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="heading text-lg leading-snug text-fg">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
