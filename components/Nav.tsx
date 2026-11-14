"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/content/portfolio";

export function Nav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("top");
      const threshold = hero ? hero.offsetHeight - 48 : 600;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!visible && !open) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-black/90 backdrop-blur-md transition-opacity duration-200">
      <div className="section-pad container-wide flex h-14 items-center justify-between md:h-16">
        <a
          href="#top"
          className="heading text-sm tracking-[0.1em] text-fg transition-opacity duration-200 hover:opacity-70"
          onClick={() => setOpen(false)}
        >
          {site.shortName.toUpperCase()}
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary sticky">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="bg-fg px-3 py-1.5 text-xs font-semibold tracking-wide text-ink transition-transform duration-200 hover:-translate-y-px"
            onClick={() => setOpen(false)}
          >
            Hire me
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center border border-white/25 text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1">
              <span
                className={`h-px w-full bg-fg transition-transform duration-200 ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-fg transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-fg transition-transform duration-200 ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="section-pad border-t border-white/15 pb-6 pt-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-3 text-base font-medium text-fg transition-opacity duration-200 hover:opacity-70"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
