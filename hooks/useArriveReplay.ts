"use client";

import { useEffect, useRef } from "react";
import { ARRIVE_EVENT, type ArriveDetail } from "@/lib/scrollTo";

/**
 * Replays a section's signature entrance when navbar Lenis glide lands.
 * Use for once:true / IO-gated motions that would otherwise finish mid-flyby.
 */
export function useArriveReplay(hash: string, onArrive: () => void) {
  const cb = useRef(onArrive);
  cb.current = onArrive;

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    const normalized = `#${id}`;

    const handle = (e: Event) => {
      const detail = (e as CustomEvent<ArriveDetail>).detail;
      if (!detail) return;
      if (detail.hash === normalized || detail.id === id) {
        cb.current();
      }
    };

    window.addEventListener(ARRIVE_EVENT, handle);
    return () => window.removeEventListener(ARRIVE_EVENT, handle);
  }, [hash]);
}
