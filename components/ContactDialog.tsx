"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from "react";
import { Dialog } from "@animate-ui/react/primitives/base-ui/dialog";
import { contact } from "@/content/portfolio";
import {
  OVERLAY_BACKDROP_TRANSITION,
  OVERLAY_DIALOG_TRANSITION,
  OVERLAY_EXIT_TRANSITION,
  OVERLAY_SHEET_TRANSITION,
} from "@/lib/motionTokens";
import { playLatch, playTick } from "@/lib/relayClick";

type SubmitState = "idle" | "sending" | "sent" | "error";

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function useIsMobileSheet(breakpoint = 760) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [breakpoint]);

  return isMobile;
}

function ContactFormFields({
  submitState,
  errorMsg,
  copied,
  onSubmit,
  onCopyEmail,
}: {
  submitState: SubmitState;
  errorMsg: string;
  copied: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCopyEmail: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="ov-contact-dialog-form">
      <div>
        <label htmlFor="dialog-name" className="ov-contact-dialog-label">
          {contact.form.nameLabel}
        </label>
        <input
          id="dialog-name"
          name="name"
          required
          autoComplete="name"
          disabled={submitState === "sending"}
          className="ov-contact-dialog-input"
        />
      </div>
      <div>
        <label htmlFor="dialog-email" className="ov-contact-dialog-label">
          {contact.form.emailLabel}
        </label>
        <input
          id="dialog-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={submitState === "sending"}
          className="ov-contact-dialog-input"
        />
      </div>
      <div>
        <label htmlFor="dialog-details" className="ov-contact-dialog-label">
          {contact.form.detailsLabel}
        </label>
        <textarea
          id="dialog-details"
          name="details"
          required
          rows={4}
          disabled={submitState === "sending"}
          className="ov-contact-dialog-input ov-contact-dialog-textarea"
        />
      </div>

      <button
        type="submit"
        disabled={submitState === "sending"}
        className="ov-contact-dialog-submit"
      >
        {submitState === "sending"
          ? "Transmitting…"
          : `${contact.form.submitLabel} ↗`}
      </button>

      {submitState === "sent" ? (
        <p className="ov-contact-dialog-status is-ok">
          Signal received — I&apos;ll reply soon.
        </p>
      ) : null}
      {submitState === "error" ? (
        <p className="ov-contact-dialog-status is-err">
          {errorMsg}{" "}
          <button
            type="button"
            onClick={onCopyEmail}
            className="ov-contact-dialog-link"
          >
            {copied ? "Copied" : "Copy Email"}
          </button>
        </p>
      ) : null}
    </form>
  );
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const isSheet = useIsMobileSheet();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

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
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) playTick();
        if (!next) {
          setSubmitState("idle");
          setErrorMsg("");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className="ov-contact-dialog-backdrop"
          transition={OVERLAY_BACKDROP_TRANSITION}
          exitTransition={OVERLAY_BACKDROP_TRANSITION}
        />
        <Dialog.Viewport
          className={
            isSheet
              ? "ov-contact-dialog-viewport is-sheet"
              : "ov-contact-dialog-viewport"
          }
        >
          {isSheet ? (
            <Dialog.Popup
              data-side="bottom"
              className="ov-contact-dialog-popup is-sheet"
              transition={OVERLAY_SHEET_TRANSITION}
              exitTransition={OVERLAY_EXIT_TRANSITION}
            >
              <div className="ov-contact-sheet-handle" aria-hidden />
              <div className="ov-contact-dialog-head">
                <div>
                  <p className="ov-contact-dialog-eyebrow">{contact.eyebrow}</p>
                  <Dialog.Title className="ov-contact-dialog-title">
                    {contact.title}
                  </Dialog.Title>
                </div>
                <Dialog.Close
                  className="ov-contact-dialog-close"
                  aria-label="Close contact form"
                >
                  ✕
                </Dialog.Close>
              </div>
              <Dialog.Description className="ov-contact-dialog-desc">
                {contact.note}
              </Dialog.Description>
              <ContactFormFields
                submitState={submitState}
                errorMsg={errorMsg}
                copied={copied}
                onSubmit={onSubmit}
                onCopyEmail={copyEmail}
              />
            </Dialog.Popup>
          ) : (
            <Dialog.Popup
              from="top"
              className="ov-contact-dialog-popup"
              transition={OVERLAY_DIALOG_TRANSITION}
              exitTransition={OVERLAY_EXIT_TRANSITION}
            >
              <div className="ov-contact-dialog-head">
                <div>
                  <p className="ov-contact-dialog-eyebrow">{contact.eyebrow}</p>
                  <Dialog.Title className="ov-contact-dialog-title">
                    {contact.title}
                  </Dialog.Title>
                </div>
                <Dialog.Close
                  className="ov-contact-dialog-close"
                  aria-label="Close contact form"
                >
                  ✕
                </Dialog.Close>
              </div>
              <Dialog.Description className="ov-contact-dialog-desc">
                {contact.note}
              </Dialog.Description>
              <ContactFormFields
                submitState={submitState}
                errorMsg={errorMsg}
                copied={copied}
                onSubmit={onSubmit}
                onCopyEmail={copyEmail}
              />
            </Dialog.Popup>
          )}
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Button that opens the contact overlay — never navigates to #contact. */
export function ContactDialogButton({
  className,
  children,
  buttonRef,
  onMouseMove,
  onMouseLeave,
}: {
  className?: string;
  children: ReactNode;
  buttonRef?: Ref<HTMLButtonElement>;
  onMouseMove?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </button>
      <ContactDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
