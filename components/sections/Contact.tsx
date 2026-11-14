"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/content/portfolio";
import { FadeIn } from "@/components/motion/FadeIn";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const details = String(data.get("details") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "someone"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${details}`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
    form.reset();
  };

  return (
    <section
      id={contact.id}
      className="section-pad border-t border-ink/15 bg-paper py-20 text-ink md:py-28"
    >
      <div className="container-narrow grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <FadeIn>
          <p className="eyebrow mb-3 text-signal">{contact.eyebrow}</p>
          <h2 className="heading text-3xl text-ink md:text-4xl">{contact.title}</h2>
          <p className="mt-4 inline-flex items-center gap-2 border border-ink/20 bg-bento px-3 py-1.5 text-sm text-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            {contact.availability}
          </p>
          <p className="mt-5 max-w-md prose-muted text-sm">{contact.note}</p>

          <button
            type="button"
            onClick={copyEmail}
            className="mt-6 inline-flex items-center gap-3 border border-ink/25 bg-white/50 px-4 py-3 text-sm text-ink transition-[border-color,background,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-ink/40 hover:shadow-[0_0_0_2px_var(--signal)]"
          >
            <span>{contact.email}</span>
            <span className="heading text-xs uppercase tracking-[0.12em] text-muted">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </FadeIn>

        <FadeIn delay={0.08}>
          <form
            onSubmit={onSubmit}
            className="space-y-5 border border-white/10 bg-ink p-6 text-on-ink md:p-8"
          >
            <div>
              <label htmlFor="name" className="eyebrow mb-2 block text-[var(--muted-on-ink)]">
                {contact.form.nameLabel}
              </label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                className="w-full border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-on-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal/60 focus:shadow-[0_0_0_1px_var(--signal)]"
              />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow mb-2 block text-[var(--muted-on-ink)]">
                {contact.form.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-on-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal/60 focus:shadow-[0_0_0_1px_var(--signal)]"
              />
            </div>
            <div>
              <label htmlFor="details" className="eyebrow mb-2 block text-[var(--muted-on-ink)]">
                {contact.form.detailsLabel}
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={5}
                className="w-full resize-y border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-on-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal/60 focus:shadow-[0_0_0_1px_var(--signal)]"
              />
            </div>
            <button type="submit" className="site-btn w-full bg-on-ink text-ink hover:shadow-[0_0_0_2px_var(--signal)]">
              {contact.form.submitLabel} ↗
            </button>
            {sent ? (
              <p className="text-center text-xs text-[var(--muted-on-ink)]">
                Opening your mail client…
              </p>
            ) : null}
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
