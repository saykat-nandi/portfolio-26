"use client";

import { AnimateUIProvider } from "@animate-ui/react/provider";
import type { ReactNode } from "react";

/** Scales every Animate UI duration / spring (1 = defaults). */
export function AnimateUIRoot({ children }: { children: ReactNode }) {
  return (
    <AnimateUIProvider tempo={1} reducedMotion="user">
      {children}
    </AnimateUIProvider>
  );
}
