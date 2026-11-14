/** GRID HUD preference — localStorage + event bus. */

const STORAGE_KEY = "portfolio-grid";
const EVENT = "portfolio:grid";

export function getGridEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setGridEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { on } }));
}

export function subscribeGrid(cb: (on: boolean) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ on: boolean }>).detail;
    cb(detail?.on ?? getGridEnabled());
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
