"use client";

import { useEffect, useState } from "react";

export function computeU(width = typeof window !== "undefined" ? window.innerWidth : 1440) {
  if (width <= 760) return width / 390;
  return Math.min(width / 1440, 1.333);
}

export function useU() {
  const [u, setU] = useState(1);

  useEffect(() => {
    const update = () => setU(computeU(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return u;
}

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

export function useRecorderMode() {
  const [rec, setRec] = useState(false);
  useEffect(() => {
    setRec(new URLSearchParams(window.location.search).get("rec") === "1");
  }, []);
  return rec;
}
