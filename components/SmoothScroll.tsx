"use client";

import { useEffect, type ReactNode } from "react";
import { polish } from "@/lib/polish";
import {
  bindHashScroll,
  registerLenis,
  scrollToHash,
  type ScrollToLenis,
} from "@/lib/scrollTo";

type LenisRuntime = ScrollToLenis & {
  velocity: number;
  isScrolling: boolean | string;
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
};

/** Lenis inertia scroll — rAF only while scrolling; idle costs nothing. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unbindHash = bindHashScroll();

    if (!polish("lenis")) {
      return () => {
        unbindHash();
        registerLenis(null);
      };
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        unbindHash();
        registerLenis(null);
      };
    }

    let raf = 0;
    let running = false;
    let settleFrames = 0;
    let lenis: LenisRuntime | null = null;
    let cancelled = false;

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const loop = (time: number) => {
      if (!lenis) return;
      lenis.raf(time);

      const moving =
        Math.abs(lenis.velocity) > 0.05 || Boolean(lenis.isScrolling);
      if (moving) {
        settleFrames = 0;
      } else {
        settleFrames += 1;
        if (settleFrames > 10) {
          stop();
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      settleFrames = 0;
      if (running || !lenis) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "PageUp" ||
        e.key === "PageDown" ||
        e.key === "Home" ||
        e.key === "End" ||
        e.key === " "
      ) {
        kick();
      }
    };

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      void import("lenis/dist/lenis.css");
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }) as LenisRuntime;
      // Pass kick so programmatic scrollTo (nav) can wake the idle rAF loop
      registerLenis(lenis, kick);

      lenis.on("scroll", kick);
      window.addEventListener("wheel", kick, { passive: true });
      window.addEventListener("touchstart", kick, { passive: true });
      window.addEventListener("keydown", onKey, { passive: true });

      if (location.hash) {
        requestAnimationFrame(() => {
          scrollToHash(location.hash, { immediate: true });
        });
      }

      kick();
    });

    return () => {
      cancelled = true;
      unbindHash();
      stop();
      window.removeEventListener("wheel", kick);
      window.removeEventListener("touchstart", kick);
      window.removeEventListener("keydown", onKey);
      if (lenis) {
        lenis.off("scroll", kick);
        lenis.destroy();
      }
      registerLenis(null, null);
    };
  }, []);

  return <>{children}</>;
}
