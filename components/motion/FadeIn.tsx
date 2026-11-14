"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  SECTION_FADE_DURATION,
  SECTION_FADE_EASE,
} from "@/lib/motionTokens";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
  once = true,
}: FadeInProps) {
  const prefersReduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Keep SSR + first client paint identical; apply reduced-motion only after mount.
  const reduce = mounted && !!prefersReduce;

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{
        duration: reduce ? 0 : SECTION_FADE_DURATION,
        delay: reduce ? 0 : delay,
        ease: SECTION_FADE_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
