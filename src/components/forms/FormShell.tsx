"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState, useEffect, useRef, type ReactNode } from "react";

import { SubmitButton } from "@/components/ui/SubmitButton";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "@/lib/spam";
import { cn } from "@/lib/utils";

/**
 * The wrapper every application form on the site uses.
 *
 * It owns the parts that are easy to get subtly wrong and that must be right
 * on every single form:
 *
 *   - Submitting through a Server Action, so the form works before — and
 *     without — JavaScript. A vendor on a slow phone in a park can still apply.
 *   - Anti-spam fields that are invisible to sighted users *and* to screen
 *     readers, and that do not trap keyboard focus.
 *   - A result banner that is announced, focused, and impossible to miss.
 *   - A submit button that reports its own pending state, so nobody submits an
 *     application three times because nothing appeared to happen.
 */

/**
 * The honeypot and the timing field.
 *
 * `aria-hidden` plus `tabIndex={-1}` plus `autoComplete="off"` is the
 * combination that keeps this away from real people: a screen reader never
 * announces it, Tab never lands on it, and the browser never autofills it. It
 * is positioned off-screen rather than `display:none` because some bots skip
 * fields that are display-none, which defeats the point.
 */
function AntiSpamFields() {
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /*
     * Stamped on mount, by writing to the DOM node rather than through state.
     * Rendering `Date.now()` would produce a different value on the server than
     * on the client and break hydration, and holding it in state would trigger
     * a second render for a value nothing on screen depends on.
     *
     * When JavaScript never runs, this stays empty and the server simply skips
     * the timing heuristic — the honeypot still applies. A form that works
     * without JavaScript matters more here than one extra spam signal.
     */
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD}
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
      <input ref={startedAtRef} type="hidden" name={TIMESTAMP_FIELD} defaultValue="" />
    </div>
  );
}

export type FormShellProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel?: string;
  pendingLabel?: string;
  /** What to show instead of the form once it has been submitted. */
  successTitle?: string;
  footnote?: ReactNode;
  className?: string;
  children: (state: FormState) => ReactNode;
};

export function FormShell({
  action,
  submitLabel = "Send application",
  pendingLabel = "Sending…",
  successTitle = "Thank you",
  footnote,
  className,
  children,
}: FormShellProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "idle") return;
    /*
     * Move focus to the result. Without this, someone using a screen reader or
     * navigating by keyboard submits the form and is left at the bottom of a
     * page with no indication of what happened — the `role="alert"` is
     * announced, but their position never moves.
     */
    resultRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className={cn(
          "border-jade/40 bg-jade/10 rounded-2xl border p-8 outline-none sm:p-10",
          className,
        )}
      >
        <CheckCircle2 aria-hidden="true" className="text-jade mb-4 size-7" />
        <h3 className="text-2xl">{successTitle}</h3>
        <p className="text-fg-muted mt-3 max-w-[58ch] leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className={cn("relative flex flex-col gap-7", className)}>
      <AntiSpamFields />

      {/*
        Known limitation, no-JavaScript path only: React owns this form's
        action URL, so a rejected submission is a full page load that lands at
        the top of the document with this message below the fold. There is no
        way to append a fragment to a Server Action's target. The message is
        still announced — role="alert" fires on parse — and it is the first
        thing inside the form, so scrolling to the fields reaches it. With
        JavaScript, focus moves here directly.
      */}
      {state.status === "error" && state.message ? (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="border-vermilion/40 bg-vermilion/10 text-fg rounded-xl border px-5 py-4 text-sm leading-relaxed outline-none"
        >
          {state.message}
        </div>
      ) : null}

      {children(state)}

      <div className="border-line flex flex-col gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} size="lg" />
        {footnote ? (
          <p className="text-fg-muted max-w-[46ch] text-[13px] leading-relaxed">{footnote}</p>
        ) : null}
      </div>
    </form>
  );
}
