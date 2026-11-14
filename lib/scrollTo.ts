/** Sticky-aware hash scrolling shared by Lenis + native fallbacks. */

export type ScrollToLenis = {
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
  raf: (t: number) => void;
  destroy: () => void;
};

let lenisRef: ScrollToLenis | null = null;

/** Sticky tracks that should land mid-scrub, not at 0% progress. */
const STICKY_OFFSETS: Record<string, number> = {
  statement: 0.3,
  lab: 0.3,
  work: 0.25,
};

export function registerLenis(instance: ScrollToLenis | null) {
  lenisRef = instance;
}

export function getLenis() {
  return lenisRef;
}

function stickyY(el: HTMLElement, fraction: number): number {
  const track = Math.max(0, el.offsetHeight - window.innerHeight);
  const y = el.offsetTop + track * fraction;
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
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
  return el.offsetTop;
}

export function scrollToHash(
  hash: string,
  opts?: { immediate?: boolean }
): boolean {
  const y = resolveHashScrollY(hash);
  if (y == null) return false;

  const lenis = lenisRef;
  if (lenis) {
    lenis.scrollTo(y, {
      immediate: opts?.immediate,
      duration: opts?.immediate ? 0 : undefined,
    });
    return true;
  }

  window.scrollTo({
    top: y,
    behavior: opts?.immediate ? "auto" : "smooth",
  });
  return true;
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
    if (!scrollToHash(href)) return;
    e.preventDefault();
    if (history.replaceState) {
      history.replaceState(null, "", href);
    }
  };

  const onHash = () => {
    if (!location.hash) return;
    scrollToHash(location.hash, { immediate: false });
  };

  document.addEventListener("click", onClick);
  window.addEventListener("hashchange", onHash);

  if (location.hash) {
    requestAnimationFrame(() => {
      scrollToHash(location.hash, { immediate: true });
    });
  }

  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", onHash);
  };
}
