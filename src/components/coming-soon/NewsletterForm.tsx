"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

import { subscribeAction } from "@/app/actions";
import { initialFormState } from "@/lib/form-state";
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "@/lib/spam";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cn } from "@/lib/utils";

/**
 * The one thing this page asks anyone to do.
 *
 * A single field. Not a name, not a role, not a "how did you hear about us" —
 * every extra field costs signups, and everything else can be asked later.
 *
 * The nested-pill construction is the detail that makes it feel considered:
 * the outer capsule owns the focus ring, the input inside is borderless, and
 * the submit button is inset from the capsule's edge rather than butted
 * against it. Focus lives on the container via `:focus-within`, so the whole
 * control lights up as one object instead of a rectangle appearing inside it.
 */

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction] = useActionState(subscribeAction, initialFormState);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status !== "idle") resultRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        className={cn(
          "border-jade/30 bg-jade-soft flex items-start gap-3 rounded-2xl border px-6 py-5",
          className,
        )}
      >
        <Check aria-hidden="true" className="text-jade mt-0.5 size-5 shrink-0" />
        <p
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="text-fg max-w-[46ch] text-[15px] leading-relaxed outline-none"
        >
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className={cn("w-full", className)}>
      {/* Off-screen, tab-skipped and hidden from assistive tech. See lib/spam.ts. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
      >
        <label htmlFor={`nl-${HONEYPOT_FIELD}`}>Leave this field empty</label>
        <input
          id={`nl-${HONEYPOT_FIELD}`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
        <input ref={startedAtRef} type="hidden" name={TIMESTAMP_FIELD} defaultValue="" />
      </div>

      <div
        className={cn(
          // White, not a tint: the capsule sits over a soft blue wash, and a
          // translucent fill would drag the placeholder's contrast down with it.
          // Inside the card the capsule needs no shadow of its own — the card
          // already lifts it off the page, and stacking two makes it muddy.
          "border-line-strong bg-bg flex items-center gap-2 rounded-full border p-1.5",
          "transition-[border-color,box-shadow] duration-200",
          // The capsule owns the focus indicator for the input inside it, so it
          // has to be a real one: a solid 2px ring at 6.5:1 against white, not a
          // low-opacity wash. WCAG 2.2 asks for 3:1 on a focus indicator.
          "focus-within:border-lake focus-within:shadow-[0_0_0_2px_var(--lake)]",
        )}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-describedby={state.errors?.email ? "newsletter-email-error" : undefined}
          aria-invalid={state.errors?.email ? true : undefined}
          className={cn(
            "text-fg placeholder:text-fg-subtle min-w-0 flex-1 bg-transparent px-5 text-[15px]",
            // The capsule owns the focus treatment, so the input drops its own.
            "outline-none focus-visible:outline-none",
          )}
        />
        <SubmitButton
          label="Notify me"
          pendingLabel="Joining"
          variant="lake"
          icon={<ArrowRight aria-hidden="true" className="size-4" />}
          className="h-12 shrink-0 px-6"
        />
      </div>

      {state.status === "error" ? (
        <p
          ref={resultRef}
          tabIndex={-1}
          id="newsletter-email-error"
          role="alert"
          className="text-rose mt-3 pl-5 text-[13px] font-semibold outline-none"
        >
          {state.errors?.email ?? state.message}
        </p>
      ) : (
        <p className="text-fg-muted mt-3 px-5 text-center text-[13px] sm:text-left">
          Festival news only — a handful of emails a year. Unsubscribe any time.{" "}
          <Link
            href="/privacy"
            className="text-lake hover:text-lake-deep rounded underline underline-offset-4"
          >
            Privacy
          </Link>
          .
        </p>
      )}
    </form>
  );
}
