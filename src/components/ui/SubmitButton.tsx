"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonSize, type ButtonVariant } from "./Button";
import { cn } from "@/lib/utils";

/**
 * The submit button for every form on the site.
 *
 * There were three copies of this — the newsletter capsule, the preview gate
 * and the application shell — each with its own spinner and its own idea of
 * what "pending" looks like. One component means a form cannot be submitted
 * three times because nothing appeared to happen on one of them, and it means
 * the disabled and busy states are described to assistive technology the same
 * way everywhere.
 *
 * `useFormStatus` only reports the status of the form this button is inside,
 * which is why this has to be its own component rather than a prop on the
 * parent: the hook reads the nearest enclosing <form>.
 */
export function SubmitButton({
  label,
  pendingLabel,
  icon,
  variant = "primary",
  size = "md",
  className,
}: {
  label: string;
  /** Shown while the form is in flight. Say what is happening, not "Loading". */
  pendingLabel: string;
  /** Decorative trailing glyph. Replaced by the spinner while pending. */
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      // `disabled` alone tells a screen reader the control is unavailable, not
      // that it is working. aria-busy says the form is in flight.
      aria-busy={pending || undefined}
      className={cn("gap-2", className)}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </Button>
  );
}
