"use client";

import { ArrowRight } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { initialFormState } from "@/lib/form-state";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cn } from "@/lib/utils";

import { enterPreview } from "./actions";

export function GateForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(enterPreview, initialFormState);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} className="mt-9 w-full max-w-md">
      <input type="hidden" name="next" value={next} />

      <div
        className={cn(
          // Opaque white, not a tint: the capsule sits over the page's wash and
          // a translucent fill would drag the placeholder's contrast down with
          // it.
          "border-line-strong bg-bg-raised flex items-center gap-2 rounded-full border p-1.5",
          "transition-[border-color,box-shadow] duration-200",
          // The capsule owns the focus indicator for the input inside it, so it
          // has to be a real one: a solid 2px lake ring at 6.5:1 against white,
          // not a low-opacity wash. WCAG 2.2 asks for 3:1 on a focus indicator.
          "focus-within:border-lake focus-within:shadow-[0_0_0_2px_var(--lake)]",
        )}
      >
        <label htmlFor="preview-password" className="sr-only">
          Preview password
        </label>
        <input
          id="preview-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          placeholder="Password"
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby={state.status === "error" ? "preview-password-error" : undefined}
          className="text-fg placeholder:text-fg-subtle min-w-0 flex-1 bg-transparent px-5 text-[15px] outline-none focus-visible:outline-none"
        />
        <SubmitButton
          label="Enter"
          pendingLabel="Checking"
          icon={<ArrowRight aria-hidden="true" className="size-4" />}
          className="h-12 shrink-0 px-6"
        />
      </div>

      {state.status === "error" ? (
        <p
          ref={errorRef}
          tabIndex={-1}
          id="preview-password-error"
          role="alert"
          className="text-rose mt-3 pl-5 text-[13px] font-medium outline-none"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
