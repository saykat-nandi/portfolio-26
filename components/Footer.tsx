import { site } from "@/content/portfolio";

export function Footer() {
  return (
    <footer className="section-pad border-t border-ink/15 bg-paper py-8 text-ink">
      <div className="container-wide flex flex-col items-start justify-between gap-3 text-sm text-muted sm:flex-row sm:items-center">
        <p>© 2026 {site.name}</p>
        <p className="heading text-xs tracking-[0.12em] uppercase">
          Built with Next.js · TypeScript · Tailwind
        </p>
      </div>
    </footer>
  );
}
