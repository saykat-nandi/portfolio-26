"use client";

import { useCallback, useRef } from "react";

/**
 * Zero-asset mechanical relay sounds.
 * `enabled` should already reflect SFX preference (and polish/reduced-motion if desired).
 */
export function useRelaySfx(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current?.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  /** Crisp 6–8ms micro-switch tick */
  const playTick = useCallback(() => {
    if (!enabled) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1850, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.008);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.009);
  }, [enabled]);

  /** Heavier 18ms relay latch */
  const playLatch = useCallback(() => {
    if (!enabled) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.018);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }, [enabled]);

  return { playTick, playLatch };
}
