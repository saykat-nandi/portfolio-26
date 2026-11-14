"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BootLoader } from "@/components/BootLoader";

/**
 * Runs the terminal boot shutter once, locks scroll until complete,
 * then reveals the page so hero entrances don't fire under the overlay.
 */
export function BootGate({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  const onReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const onComplete = useCallback(() => {
    setBootComplete(true);
  }, []);

  useEffect(() => {
    if (bootComplete) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [bootComplete]);

  return (
    <>
      {!bootComplete ? (
        <BootLoader onReveal={onReveal} onComplete={onComplete} />
      ) : null}
      {revealed ? children : null}
    </>
  );
}
