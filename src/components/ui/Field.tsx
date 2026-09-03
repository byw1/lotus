"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Form controls.
 *
 * The whole point of this file is that every input on the site is wired for
 * assistive technology the same way, without anyone having to remember to do
 * it. `Field` generates the ids and hands them down, so the label, the hint
 * and the error message are always properly associated:
 *
 *   - `<label for>` points at the control, so tapping the label focuses it —
 *     which on a phone is the difference between a usable form and a fiddly one.
 *   - `aria-describedby` carries both the hint and the error, so a screen
 *     reader announces the requirement and what went wrong.
 *   - `aria-invalid` marks the control itself, not just its colour, because
 *     red text alone is invisible to a lot of people.
 *   - Errors are `role="alert"`, so they are announced when they appear.
 *
 * Required fields are marked with the word "Required", not an asterisk. An
 * asterisk is a convention people have to already know, and screen readers
 * read it as "star".
 */

const controlBase =
  "w-full rounded-xl border bg-surface px-4 text-[15px] text-fg placeholder:text-fg-subtle " +
  "transition-[border-color,box-shadow,background-color] duration-200 " +
  "ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-strong " +
  "disabled:cursor-not-allowed disabled:opacity-70";

const controlValid = "border-line focus:border-gold/60";
const controlInvalid = "border-vermilion/70 focus:border-vermilion";

type FieldRenderProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
};

export type FieldProps = {
  label: string;
  /** The `name` attribute of the control this field wraps. */
  name: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: FieldRenderProps) => ReactNode;
};

export function Field({ label, name, hint, error, required, className, children }: FieldProps) {
  const generated = useId();
  const id = `${name}-${generated}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
        <span>{label}</span>
        {required ? (
          <span className="text-fg-subtle text-[11px] font-normal tracking-wide uppercase">
            Required
          </span>
        ) : (
          <span className="text-fg-subtle text-[11px] font-normal tracking-wide uppercase">
            Optional
          </span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="text-fg-muted -mt-1 text-[13px] leading-relaxed">
          {hint}
        </p>
      ) : null}

      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}

      {error ? (
        <p id={errorId} role="alert" className="text-vermilion text-[13px] font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: ComponentPropsWithoutRef<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(controlBase, "h-12", invalid ? controlInvalid : controlValid, className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  rows = 5,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        controlBase,
        "resize-y py-3 leading-relaxed",
        invalid ? controlInvalid : controlValid,
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: ComponentPropsWithoutRef<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlBase,
          "h-12 cursor-pointer appearance-none pr-11",
          invalid ? controlInvalid : controlValid,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="text-fg-subtle pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/**
 * A checkbox with its label as one large hit target.
 *
 * The whole row is the label, so the tappable area is the full width of the
 * card rather than a 16px square — which matters a great deal to anyone
 * filling this in one-handed on a phone.
 */
export function Checkbox({
  label,
  description,
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label
      className={cn(
        "group border-line bg-surface flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3",
        "hover:border-line-strong hover:bg-surface-strong transition-colors duration-200",
        "has-checked:border-gold/50 has-checked:bg-gold/8",
        className,
      )}
    >
      <input
        type="checkbox"
        className={cn(
          "border-line-strong mt-0.5 size-[18px] shrink-0 cursor-pointer rounded-[5px] border",
          "accent-gold",
        )}
        {...props}
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm leading-snug">{label}</span>
        {description ? (
          <span className="text-fg-muted text-[13px] leading-snug">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export type Choice = { value: string; label: string; description?: string };

/**
 * A group of checkboxes as a `fieldset`.
 *
 * A `fieldset`/`legend` is what tells a screen reader that these eight
 * checkboxes are one question. Without it they are announced as eight
 * unrelated controls and the question is never read at all.
 */
export function CheckboxGroup({
  legend,
  name,
  options,
  hint,
  error,
  required,
  defaultSelected = [],
  columns = 2,
}: {
  legend: string;
  name: string;
  options: Choice[];
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  defaultSelected?: string[];
  columns?: 1 | 2;
}) {
  const generated = useId();
  const hintId = hint ? `${generated}-hint` : undefined;
  const errorId = error ? `${generated}-error` : undefined;

  return (
    <fieldset aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}>
      <legend className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
        <span>{legend}</span>
        <span className="text-fg-subtle text-[11px] font-normal tracking-wide uppercase">
          {required ? "Required" : "Optional"}
        </span>
      </legend>

      {hint ? (
        <p id={hintId} className="text-fg-muted mt-2 text-[13px] leading-relaxed">
          {hint}
        </p>
      ) : null}

      <div className={cn("mt-3 grid gap-2", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            defaultChecked={defaultSelected.includes(option.value)}
          />
        ))}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-vermilion mt-2 text-[13px] font-medium">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Radio buttons as cards, for a single choice among a handful. */
export function RadioGroup({
  legend,
  name,
  options,
  hint,
  error,
  required,
  defaultValue,
  columns = 1,
}: {
  legend: string;
  name: string;
  options: Choice[];
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  defaultValue?: string;
  columns?: 1 | 2;
}) {
  const generated = useId();
  const hintId = hint ? `${generated}-hint` : undefined;
  const errorId = error ? `${generated}-error` : undefined;

  return (
    <fieldset aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}>
      <legend className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
        <span>{legend}</span>
        <span className="text-fg-subtle text-[11px] font-normal tracking-wide uppercase">
          {required ? "Required" : "Optional"}
        </span>
      </legend>

      {hint ? (
        <p id={hintId} className="text-fg-muted mt-2 text-[13px] leading-relaxed">
          {hint}
        </p>
      ) : null}

      <div className={cn("mt-3 grid gap-2", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "group border-line bg-surface flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3",
              "hover:border-line-strong hover:bg-surface-strong transition-colors duration-200",
              "has-checked:border-gold/50 has-checked:bg-gold/8",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              className="accent-gold mt-0.5 size-[18px] shrink-0 cursor-pointer"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm leading-snug">{option.label}</span>
              {option.description ? (
                <span className="text-fg-muted text-[13px] leading-snug">{option.description}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-vermilion mt-2 text-[13px] font-medium">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
