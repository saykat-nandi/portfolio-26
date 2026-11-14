/** Sticky-aware hash scrolling shared by Lenis + native fallbacks. */

export type ScrollToLenis = {
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      easing?: (t: number) => number;
      onComplete?: () => void;
    }
  ) => void;
  raf: (t: number) => void;
  destroy: () => void;
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
};

let lenisRef: ScrollToLenis | null = null;
/** Wakes the idle-paused Lenis rAF loop — required for programmatic scrollTo. */
let kickLenis: (() => void) | null = null;

/**
 * Sticky tracks land mid-scrub (climax), not at 0% progress.
 * Ratio is of (sectionHeight - viewport) — the scrubbable track length.
 */
const STICKY_OFFSETS: Record<string, number> = {
  statement: 0.45,
  // Lab plotter unlocks spotlight ~0.75 and finishes strokes ~1.0
  lab: 0.82,
  work: 0.4,
};

export const ARRIVE_EVENT = "portfolio:arrive";

export type ArriveDetail = {
  hash: string;
  id: string;
};

const GLIDE_MS = 1400;
const GLIDE_S = GLIDE_MS / 1000;

function glideEase(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function registerLenis(
  instance: ScrollToLenis | null,
  kick?: (() => void) | null
) {
  lenisRef = instance;
  kickLenis = instance ? kick ?? null : null;
}

export function getLenis() {
  return lenisRef;
}

function stickyY(el: HTMLElement, fraction: number): number {
  const track = Math.max(0, el.offsetHeight - window.innerHeight);
  const top = el.getBoundingClientRect().top + window.scrollY;
  const y = top + track * fraction;
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  return Math.max(0, Math.min(y, max));
}

/** Resolve absolute document Y for a hash id (with sticky mid-track offsets). */
export function resolveHashScrollY(hash: string): number | null {
  const id = hash.replace(/^#/, "");
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;

  const fraction = STICKY_OFFSETS[id];
  if (fraction != null) return stickyY(el, fraction);
  return el.getBoundingClientRect().top + window.scrollY;
}

function emitArrive(hash: string) {
  const id = hash.replace(/^#/, "");
  const normalized = `#${id}`;
  window.dispatchEvent(
    new CustomEvent<ArriveDetail>(ARRIVE_EVENT, {
      detail: { hash: normalized, id },
    })
  );
}

/**
 * Scroll to a section with sticky climax offsets, a controlled ~1.4s glide,
 * and portfolio:arrive when the scroll lands.
 */
export function navigateToSection(
  hash: string,
  opts?: { immediate?: boolean }
): boolean {
  const id = hash.replace(/^#/, "");
  if (!id) return false;
  const normalized = `#${id}`;
  const y = resolveHashScrollY(normalized);
  if (y == null) return false;

  const lenis = lenisRef;

  if (!lenis) {
    window.scrollTo({
      top: y,
      behavior: opts?.immediate ? "auto" : "smooth",
    });
    if (opts?.immediate) {
      emitArrive(normalized);
    } else {
      window.setTimeout(() => emitArrive(normalized), GLIDE_MS);
    }
    return true;
  }

  let arrived = false;
  const onceArrive = () => {
    if (arrived) return;
    arrived = true;
    emitArrive(normalized);
  };

  if (opts?.immediate) {
    lenis.scrollTo(y, {
      immediate: true,
      duration: 0,
      onComplete: onceArrive,
    });
    kickLenis?.();
    window.requestAnimationFrame(onceArrive);
    return true;
  }

  lenis.scrollTo(y, {
    duration: GLIDE_S,
    easing: glideEase,
    onComplete: onceArrive,
  });
  // Critical: idle-paused Lenis won't animate until the rAF loop is running
  kickLenis?.();
  window.setTimeout(onceArrive, GLIDE_MS + 80);
  return true;
}

export function scrollToHash(
  hash: string,
  opts?: { immediate?: boolean }
): boolean {
  return navigateToSection(hash, opts);
}

/** Intercept same-origin hash clicks + honor initial / hashchange. */
export function bindHashScroll(): () => void {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    if (!navigateToSection(href)) return;
    e.preventDefault();
    if (history.replaceState) {
      history.replaceState(null, "", href);
    }
  };

  const onHash = () => {
    if (!location.hash) return;
    navigateToSection(location.hash, { immediate: false });
  };

  document.addEventListener("click", onClick);
  window.addEventListener("hashchange", onHash);

  if (location.hash) {
    requestAnimationFrame(() => {
      navigateToSection(location.hash, { immediate: true });
    });
  }

  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", onHash);
  };
}
