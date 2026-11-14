"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroAmbient() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{
        background: `radial-gradient(520px circle at ${pos.x}% ${pos.y}%, rgba(34, 211, 238, 0.14), transparent 55%)`,
      }}
      transition={{ duration: 0.2 }}
    />
  );
}
