"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  SECTION_FADE_DURATION,
  SECTION_FADE_EASE,
} from "@/lib/motionTokens";

function useSafeReducedMotion() {
  const prefersReduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!prefersReduce;
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
};

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.06,
}: StaggerProps) {
  const reduce = useSafeReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: reduce ? 0 : delay,
            staggerChildren: reduce ? 0 : stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: reduce ? 0 : SECTION_FADE_DURATION,
        ease: SECTION_FADE_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
