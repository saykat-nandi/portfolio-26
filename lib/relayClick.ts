/**
 * Zero-asset Web Audio relay clicks — tick (light) + latch (heavy).
 * Opt-in via localStorage; gated by polish.relaySfx + reduced-motion.
 */

import { polish } from "@/lib/polish";

const STORAGE_KEY = "portfolio-sfx";
const EVENT = "portfolio:sfx";

let ctx: AudioContext | null = null;

export function getSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setSfxEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { on } }));
}

export function subscribeSfx(cb: (on: boolean) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ on: boolean }>).detail;
    cb(detail?.on ?? getSfxEnabled());
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function canPlay(): boolean {
  if (!polish("relaySfx")) return false;
  if (!getSfxEnabled()) return false;
  if (typeof document !== "undefined" && document.hidden) return false;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }
  return true;
}

/** Crisp ~8ms micro-switch tick (SHIPPED arrows, DIN rows, copy, project morph). */
export function playTick() {
  if (!canPlay()) return;
  const audio = ensureCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(1850, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.008);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.009);
}

/** Heavier ~18ms relay latch (GRID/SFX toggle, drawer, contact shutter/submit). */
export function playLatch() {
  if (!canPlay()) return;
  const audio = ensureCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(95, now + 0.018);

  gain.gain.setValueAtTime(0.11, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.02);
}

/** @deprecated Prefer playTick / playLatch */
export function playRelayClick() {
  playTick();
}
