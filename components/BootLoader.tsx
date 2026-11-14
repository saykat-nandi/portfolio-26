"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_STEPS = [
  {
    id: "init",
    label: "SYS_INIT",
    detail: "SAYKAT_NANDI_DIP // PORTFOLIO_V26",
    kind: "text" as const,
  },
  {
    id: "dom",
    label: "MOUNTING_DOM_TREE",
    detail: "OK",
    kind: "dots" as const,
  },
  {
    id: "sock",
    label: "ESTABLISHING_SOCKETS",
    detail: "12ms",
    kind: "text" as const,
  },
  {
    id: "arch",
    label: "LOADING_ARCHITECTURE",
    detail: "100%",
    kind: "bar" as const,
  },
  {
    id: "gmt",
    label: "VERIFYING_GMT+6_NODE",
    detail: "ACTIVE",
    kind: "text" as const,
  },
  {
    id: "vanity",
    label: "OVERRIDE_VANITY_METRICS",
    detail: "TRUE",
    kind: "text" as const,
  },
  {
    id: "online",
    label: "SYSTEM_ONLINE",
    detail: "",
    kind: "online" as const,
  },
] as const;

const SNAP = [0.16, 1, 0.3, 1] as const;

function TypeChars({
  text,
  mode,
  className,
}: {
  text: string;
  mode: "typing" | "done" | "idle";
  className?: string;
}) {
  const [count, setCount] = useState(mode === "done" ? text.length : 0);

  useEffect(() => {
    if (mode === "done") {
      setCount(text.length);
      return;
    }
    if (mode !== "typing") {
      setCount(0);
      return;
    }
    setCount(0);
    let i = 0;
    let cancelled = false;
    let timer = 0;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setCount(i);
      if (i < text.length) {
        timer = window.setTimeout(tick, 10 + Math.random() * 16);
      }
    };
    timer = window.setTimeout(tick, 20);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mode, text]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {mode === "typing" && count < text.length ? (
        <span className="ml-px inline-block h-[1em] w-[0.5ch] translate-y-[0.1em] bg-signal align-baseline" />
      ) : null}
    </span>
  );
}

function DotFill({ active }: { active: boolean }) {
  return (
    <span className="inline-flex tracking-[0.2em] text-on-ink/35">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.15 }}
          animate={active ? { opacity: 1 } : { opacity: 0.15 }}
          transition={{ delay: i * 0.045, duration: 0.12 }}
          className="text-on-ink/70"
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

function ArchBar({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative inline-block h-[10px] w-[88px] overflow-hidden border border-signal/40 bg-on-ink/5 sm:w-[110px]">
        <motion.span
          className="absolute inset-y-0 left-0 bg-signal"
          initial={{ width: "0%" }}
          animate={active ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 0.55, ease: SNAP }}
        />
        <motion.span
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          initial={{ left: "-20%" }}
          animate={active ? { left: "110%" } : { left: "-20%" }}
          transition={{ duration: 0.55, ease: "linear" }}
        />
      </span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.45 }}
        className="text-signal"
      >
        100%
      </motion.span>
    </span>
  );
}

const EXIT_EASE = [0.22, 1, 0.36, 1] as const;

export function BootLoader({
  onComplete,
  onReveal,
  exitMs = 1200,
}: {
  onComplete: () => void;
  onReveal?: () => void;
  /** Shutter lift duration — keep in sync with BootGate */
  exitMs?: number;
}) {
  const [step, setStep] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [pct, setPct] = useState(0);
  const [ms, setMs] = useState(0);

  const progress = useMemo(
    () => Math.min(1, step / BOOT_STEPS.length),
    [step]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onReveal?.();
      onComplete();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, delay: number) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, delay)
      );
    };

    const start = performance.now();
    const clock = window.setInterval(() => {
      if (cancelled) return;
      setMs(Math.floor(performance.now() - start));
    }, 32);

    const advance = (index: number) => {
      if (index >= BOOT_STEPS.length) {
        setIsBooted(true);
        setPct(100);
        // Mount hero under the shutter first, then lift — continuous handoff
        later(() => {
          onReveal?.();
          later(() => {
            setIsExiting(true);
            later(onComplete, exitMs + 80);
          }, 90);
        }, 640);
        return;
      }

      setStep(index + 1);
      setPct(Math.round(((index + 1) / BOOT_STEPS.length) * 100));

      const isFinal = index === BOOT_STEPS.length - 1;
      const hold = isFinal
        ? 520
        : index === 3
          ? 620
          : 180 + Math.random() * 220;
      later(() => advance(index + 1), hold);
    };

    later(() => advance(0), 280);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(clock);
    };
  }, [exitMs, onComplete, onReveal]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="boot-shutter"
          initial={{ opacity: 1 }}
          exit={{
            y: "-108%",
            opacity: 0,
            transition: {
              y: { ease: EXIT_EASE, duration: exitMs / 1000 },
              opacity: {
                ease: [0.4, 0, 0.2, 1],
                duration: (exitMs / 1000) * 0.55,
                delay: 0.18,
              },
            },
          }}
          className="boot-loader fixed inset-0 z-[100] flex flex-col justify-end overflow-hidden bg-ink p-6 font-mono text-xs uppercase tracking-widest text-on-ink/60 sm:p-10 sm:text-sm"
        >
          {/* Ambient grid + scan sweep */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            animate={isBooted ? { opacity: 0 } : { opacity: 0.07 }}
            transition={{ duration: 0.45 }}
            style={{
              backgroundImage:
                "linear-gradient(rgba(234,232,227,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(234,232,227,0.35) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-signal/10 to-transparent"
            initial={{ top: "-20%" }}
            animate={
              isBooted
                ? { top: "120%", opacity: 0 }
                : { top: ["-20%", "120%"], opacity: 1 }
            }
            transition={
              isBooted
                ? { duration: 0.4 }
                : {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          />

          {/* Soft leading edge on the shutter (kept inside overflow clip) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-16 bg-gradient-to-t from-transparent to-ink/0"
            style={{
              background:
                "linear-gradient(to top, transparent 0%, rgba(17,17,17,0.35) 55%, var(--ink) 100%)",
              mixBlendMode: "normal",
              opacity: isBooted ? 1 : 0,
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center bg-gradient-to-r from-transparent via-signal/70 to-transparent"
            animate={
              isBooted
                ? { opacity: [0.35, 1, 0], scaleX: [0.55, 1.05, 1.2] }
                : { opacity: 0.35, scaleX: 1 }
            }
            transition={{ duration: 0.75, ease: EXIT_EASE }}
          />

          {/* Chrome dissolves before shutter lift */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10"
            animate={
              isBooted
                ? { opacity: 0, y: -28, filter: "blur(8px)" }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            transition={{ duration: 0.55, ease: EXIT_EASE }}
          >
          {/* Corner brackets */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-signal/50 sm:left-8 sm:top-8"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-signal/50 sm:right-8 sm:top-8"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b border-l border-signal/50 sm:bottom-8 sm:left-8"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-signal/50 sm:bottom-8 sm:right-8"
          />

          {/* Top telemetry */}
          <div className="absolute left-6 top-6 flex flex-col gap-1 text-[10px] text-on-ink/35 sm:left-10 sm:top-10">
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: SNAP }}
            >
              BOOT_SEQ // V26.04
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="tabular-nums text-signal/70"
            >
              T+{String(ms).padStart(4, "0")}ms
            </motion.p>
          </div>

          <div className="absolute right-6 top-6 text-right text-[10px] text-on-ink/30 sm:right-10 sm:top-10">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, ease: SNAP }}
            >
              <p>SAYKAT_NANDI_DIP</p>
              <p>CHATTOGRAM // BD</p>
              <p>LAT: 22.3569° N</p>
            </motion.div>
          </div>

          {/* Ring progress */}
          <div className="absolute left-1/2 top-[18%] hidden -translate-x-1/2 sm:block">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(244,244,244,0.08)"
                strokeWidth="2"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--signal)"
                strokeWidth="2"
                strokeLinecap="square"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 52 * (1 - progress),
                }}
                transition={{ ease: SNAP, duration: 0.35 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[11px] tracking-[0.14em] text-on-ink/50">
              <motion.span
                key={pct}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg tabular-nums text-signal"
              >
                {pct}%
              </motion.span>
              <span>LOAD</span>
            </div>
          </div>

          {/* Log stream */}
          <div className="relative z-10 flex max-w-3xl flex-col gap-2.5 pb-2">
            <AnimatePresence initial={false}>
              {BOOT_STEPS.slice(0, step).map((row, i) => {
                const isLast = row.kind === "online";
                const isCurrent = i === step - 1 && !isBooted;
                const typeMode = isCurrent ? "typing" : "done";
                return (
                  <motion.div
                    key={row.id}
                    layout
                    initial={{ opacity: 0, x: -18, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.35, ease: SNAP }}
                    className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
                      isLast ? "mt-3" : ""
                    }`}
                  >
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      className="text-signal/55"
                    >
                      {`>`}
                    </motion.span>

                    {isLast ? (
                      <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.4em" }}
                        animate={{
                          opacity: 1,
                          letterSpacing: "0.18em",
                          textShadow: [
                            "0 0 0px rgba(255,69,0,0)",
                            "0 0 18px rgba(255,69,0,0.55)",
                            "0 0 8px rgba(255,69,0,0.25)",
                          ],
                        }}
                        transition={{ duration: 0.55, ease: SNAP }}
                        className="font-bold text-signal"
                      >
                        {row.label}
                      </motion.span>
                    ) : (
                      <>
                        <TypeChars
                          text={row.label}
                          mode={typeMode}
                          className="text-on-ink"
                        />
                        {row.kind === "dots" ? (
                          <>
                            <DotFill active={isCurrent || i < step - 1} />
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: isCurrent ? 0.4 : 0 }}
                              className="text-on-ink/80"
                            >
                              {row.detail}
                            </motion.span>
                          </>
                        ) : null}
                        {row.kind === "bar" ? (
                          <ArchBar active={isCurrent || i < step - 1} />
                        ) : null}
                        {row.kind === "text" ? (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: isCurrent ? 0.2 : 0,
                              ease: SNAP,
                            }}
                            className="text-on-ink/55"
                          >
                            {row.detail}
                          </motion.span>
                        ) : null}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {!isBooted ? (
              <motion.div
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  ease: "linear",
                }}
                className="mt-1 h-4 w-2.5 bg-signal shadow-[0_0_12px_var(--signal)]"
              />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-[10px] tracking-[0.22em] text-signal/70"
              >
                OPENING_SHUTTER…
              </motion.p>
            )}
          </div>
          </motion.div>

          {/* Bottom rail — signal strip that leads the shutter */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 origin-left bg-signal"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: isBooted ? 1 : progress,
              opacity: isBooted ? 0 : 1,
            }}
            transition={{ ease: SNAP, duration: 0.3 }}
          />
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-0 h-[2px] w-16 bg-white/80"
            animate={{
              left: `${Math.max(4, progress * 100)}%`,
              opacity: isBooted ? 0 : 1,
            }}
            transition={{ ease: SNAP, duration: 0.3 }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
