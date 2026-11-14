"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { contact } from "@/content/portfolio";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useArriveReplay } from "@/hooks/useArriveReplay";
import { polish } from "@/lib/polish";
import { playLatch, playTick } from "@/lib/relayClick";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const useShutter = polish("contactShutter");
  const openedRef = useRef(false);

  useArriveReplay("#contact", () => {
    if (!useShutter) {
      setOpen(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    openedRef.current = false;
    setOpen(false);
    requestAnimationFrame(() => setOpen(true));
  });

  useEffect(() => {
    if (!useShutter) {
      setOpen(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpen(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOpen(true);
        io.disconnect();
      },
      { threshold: 0.28 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [useShutter]);

  useEffect(() => {
    if (!useShutter || !open) return;
    if (!openedRef.current) {
      openedRef.current = true;
      playLatch();
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const input = firstInputRef.current;
    if (!input) return;

    let clear = 0;
    const t = window.setTimeout(() => {
      input.classList.add("is-flashing");
      clear = window.setTimeout(() => {
        input.classList.remove("is-flashing");
      }, 420);
    }, 780);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(clear);
      input.classList.remove("is-flashing");
    };
  }, [open, useShutter]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      playTick();
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const details = String(data.get("details") || "").trim();

    setSubmitState("sending");
    setErrorMsg("");
    playLatch();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, details }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fallback?: string;
      };

      if (!res.ok || !json.ok) {
        setSubmitState("error");
        setErrorMsg(
          json.error ||
            "Transmission failed. Use Copy Email and send directly."
        );
        return;
      }

      setSubmitState("sent");
      form.reset();
    } catch {
      setSubmitState("error");
      setErrorMsg("Network error. Use Copy Email instead.");
    }
  };

  return (
    <section
      id={contact.id}
      ref={sectionRef}
      className={`section-pad section-pad-y border-t border-ink/15 bg-paper text-ink${
        useShutter ? " contact-shutter" : ""
      }${open ? " is-open" : ""}`}
    >
      <Stagger
        className="container-narrow grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"
        stagger={0.08}
      >
        <StaggerItem>
          <p className="eyebrow mb-3 text-signal">{contact.eyebrow}</p>
          <h2 className="heading text-3xl text-ink md:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-4 inline-flex items-center gap-2 border border-ink/20 bg-bento px-3 py-1.5 text-sm text-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            {contact.availability}
          </p>
          <p className="mt-5 max-w-md prose-muted text-sm">{contact.note}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-3 border border-ink/25 bg-white/50 px-4 py-3 text-sm text-ink transition-[border-color,background,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-ink/40 hover:shadow-[0_0_0_2px_var(--signal)]"
            >
              <span>{contact.email}</span>
              <span className="heading text-xs uppercase tracking-[0.12em] text-muted">
                {copied ? "Copied" : "Copy Email"}
              </span>
            </button>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-3 border border-ink/25 bg-white/50 px-4 py-3 text-sm text-ink transition-[border-color,background,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-ink/40 hover:shadow-[0_0_0_2px_var(--signal)]"
            >
              <span>{contact.phone}</span>
              <span className="heading text-xs uppercase tracking-[0.12em] text-muted">
                Call
              </span>
            </a>
          </div>
        </StaggerItem>

        <StaggerItem>
          {useShutter ? (
            <span className="contact-shutter-line mb-3" aria-hidden />
          ) : null}
          <form
            onSubmit={onSubmit}
            className={`space-y-5 border border-white/10 bg-ink p-6 text-on-ink md:p-8${
              useShutter ? " contact-shutter-panel" : ""
            }`}
          >
            <div>
              <label
                htmlFor="name"
                className="eyebrow mb-2 block text-[var(--muted-on-ink)]"
              >
                {contact.form.nameLabel}
              </label>
              <input
                ref={firstInputRef}
                id="name"
                name="name"
                required
                autoComplete="name"
                disabled={submitState === "sending"}
                className={`w-full border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-on-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal/60 focus:shadow-[0_0_0_1px_var(--signal)]${
                  useShutter ? " contact-focus-flash" : ""
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="eyebrow mb-2 block text-[var(--muted-on-ink)]"
              >
                {contact.form.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                disabled={submitState === "sending"}
                className="w-full border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-on-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal/60 focus:shadow-[0_0_0_1px_var(--signal)]"
              />
            </div>
            <div>
              <label
                htmlFor="details"
                className="eyebrow mb-2 block text-[var(--muted-on-ink)]"
              >
                {contact.form.detailsLabel}
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={5}
                disabled={submitState === "sending"}
                className="w-full resize-y border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-on-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal/60 focus:shadow-[0_0_0_1px_var(--signal)]"
              />
            </div>
            <button
              type="submit"
              disabled={submitState === "sending"}
              className="mt-1 flex h-12 w-full items-center justify-center gap-2 border border-signal bg-signal text-[13px] font-semibold tracking-wide text-ink transition-[filter,transform,box-shadow] duration-200 hover:brightness-110 hover:shadow-[0_0_0_2px_var(--on-ink)] disabled:opacity-60"
            >
              {submitState === "sending"
                ? "Transmitting…"
                : `${contact.form.submitLabel} ↗`}
            </button>
            {submitState === "sent" ? (
              <p className="text-center text-xs text-signal">
                Signal received — I&apos;ll reply soon.
              </p>
            ) : null}
            {submitState === "error" ? (
              <p className="text-center text-xs text-[var(--muted-on-ink)]">
                {errorMsg}{" "}
                <button
                  type="button"
                  onClick={copyEmail}
                  className="underline decoration-signal/50 underline-offset-2 hover:text-signal"
                >
                  Copy Email
                </button>
              </p>
            ) : null}
          </form>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
