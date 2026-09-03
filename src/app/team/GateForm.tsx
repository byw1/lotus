"use client";

import { ArrowRight } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { initialFormState } from "@/lib/form-state";
import { cn } from "@/lib/utils";

import { enterPreview } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "bg-vermilion hover:bg-vermilion-deep inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-6",
        "text-sm font-medium text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:translate-y-px disabled:pointer-events-none disabled:opacity-80",
        "shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]",
      )}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          <span>Checking</span>
        </>
      ) : (
        <>
          <span>Enter</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </>
      )}
    </button>
  );
}

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
          "focus-within:border-gold/50 focus-within:shadow-[0_0_0_4px_rgba(232,184,87,0.13)]",
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
        <SubmitButton />
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
