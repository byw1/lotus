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
          "border-line-strong flex items-center gap-2 rounded-full border bg-[rgba(11,10,15,0.62)] p-1.5",
          "backdrop-blur-xl transition-[border-color,box-shadow] duration-200",
          // The capsule owns the focus indicator for the input inside it, so it has
          // to be a real one: a solid 2px gold ring at 10.7:1 against the ink
          // ground, not the 13%-opacity wash that was here before and measured
          // 1.24:1. WCAG 2.2 asks for 3:1 on a focus indicator.
          "focus-within:border-gold focus-within:shadow-[0_0_0_2px_var(--gold)]",
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
          className="text-fg placeholder:text-fg-muted min-w-0 flex-1 bg-transparent px-5 text-[15px] outline-none focus-visible:outline-none"
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
          className="text-blush mt-3 pl-5 text-[13px] font-medium outline-none"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
