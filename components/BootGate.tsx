"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BootLoader } from "@/components/BootLoader";

const EXIT_MS = 1200;
const HERO_STAGGER_MS = 420;

type BootRevealValue = {
  revealed: boolean;
  /** Delay (ms) before hero entrance should start — synced to shutter mid-exit */
  entranceDelayMs: number;
};

const BootRevealContext = createContext<BootRevealValue>({
  revealed: false,
  entranceDelayMs: 40,
});

export function useBootReveal() {
  return useContext(BootRevealContext);
}

const PAGE_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Runs the terminal boot shutter once, locks scroll until complete,
 * then crossfades into the page so hero entrances rise with the wipe.
 *
 * Avoid transform/filter on this wrapper — they create a containing block for
 * position:fixed descendants and can leave a floating OS scrollbar over the hero.
 */
export function BootGate({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
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
      document.documentElement.removeAttribute("data-boot");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute(
      "data-boot",
      revealed ? "exiting" : "loading"
    );
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-boot");
    };
  }, [bootComplete, revealed]);

  const ctx = useMemo<BootRevealValue>(
    () => ({
      revealed,
      entranceDelayMs: reduce ? 0 : revealed ? HERO_STAGGER_MS : 40,
    }),
    [reduce, revealed]
  );

  return (
    <BootRevealContext.Provider value={ctx}>
      {!bootComplete ? (
        <BootLoader
          onReveal={onReveal}
          onComplete={onComplete}
          exitMs={EXIT_MS}
        />
      ) : null}
      {revealed ? (
        reduce ? (
          children
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.95,
              ease: PAGE_EASE,
              delay: 0.04,
            }}
            className="min-h-dvh overflow-x-clip"
          >
            {children}
          </motion.div>
        )
      ) : null}
    </BootRevealContext.Provider>
  );
}
