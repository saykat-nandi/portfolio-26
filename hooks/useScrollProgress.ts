"use client";

import { useEffect, type RefObject } from "react";

type ScrollMode = "exit" | "sticky" | "pass-through";

type ScrollOptions = {
  mode?: ScrollMode;
};

/**
 * Writes --progress (0–1) on the element inside rAF — zero React re-renders.
 * Skips work when the element is fully off-screen.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  modeOrOptions: ScrollMode | ScrollOptions = "sticky"
) {
  const mode =
    typeof modeOrOptions === "string"
      ? modeOrOptions
      : (modeOrOptions.mode ?? "sticky");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.style.setProperty("--progress", mode === "exit" ? "0" : "1");
      if (mode === "exit") el.removeAttribute("data-exit-covered");
      return;
    }

    let rafId = 0;
    let lastWritten = -1;
    const margin = 120;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Early-out when fully outside viewport (± margin)
      if (rect.bottom < -margin || rect.top > vh + margin) {
        if (mode === "exit" && lastWritten !== 0) {
          el.style.setProperty("--progress", "0");
          el.removeAttribute("data-exit-covered");
          lastWritten = 0;
        }
        return;
      }

      let raw = 0;

      if (mode === "exit") {
        const pinned =
          getComputedStyle(el).position === "sticky" &&
          rect.top >= -1 &&
          rect.top <= 1 &&
          window.scrollY > 0;

        if (pinned) {
          raw = rect.height > 0 ? window.scrollY / rect.height : 0;
        } else {
          raw = rect.height > 0 ? -rect.top / rect.height : 0;
        }
      } else if (mode === "sticky") {
        const scrollable = rect.height - vh;
        raw = scrollable > 0 ? -rect.top / scrollable : 0;
      } else {
        raw = (vh - rect.top) / (vh + rect.height);
      }

      const clamped = Math.min(1, Math.max(0, raw));
      const rounded = Number(clamped.toFixed(4));
      if (rounded !== lastWritten) {
        el.style.setProperty("--progress", rounded.toFixed(4));
        lastWritten = rounded;
      }

      if (mode === "exit") {
        if (clamped >= 0.98) el.setAttribute("data-exit-covered", "");
        else el.removeAttribute("data-exit-covered");
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, mode]);
}
