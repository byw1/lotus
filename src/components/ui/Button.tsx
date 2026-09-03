import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one button on this site.
 *
 * Interaction rules, applied uniformly:
 *   - Hover and press are transform-and-color only, so nothing reflows.
 *   - The press state is a real 1px translate, because a button that does not
 *     move under a thumb feels broken on a phone.
 *   - Focus uses the global `:focus-visible` ring from globals.css. Do not
 *     override it here; one focus treatment everywhere is what makes the site
 *     navigable by keyboard.
 *   - Disabled buttons keep their contrast. The convention of fading a
 *     disabled control to 40% opacity fails WCAG and hides why it is disabled.
 */

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "rounded-full transition-[transform,background-color,border-color,color,box-shadow] " +
  "duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:saturate-50 disabled:opacity-70";

const variants = {
  /**
   * The one action we most want taken on any given page. Lotus pink, because
   * the blue is doing the quieter job of carrying every link on the site.
   */
  primary:
    "bg-rose-solid text-white shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_10px_24px_-12px_rgba(173,57,94,0.55)] " +
    "hover:bg-rose-deep hover:shadow-[0_1px_0_rgba(255,255,255,0.26)_inset,0_14px_30px_-12px_rgba(173,57,94,0.65)]",
  /** The lake. A second action beside the primary one, or a primary in a form. */
  lake:
    "bg-lake-solid text-white shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_10px_24px_-12px_rgba(21,97,155,0.55)] " +
    "hover:bg-lake-deep",
  /**
   * Soft blue on white. The friendliest button on the site, and the one that
   * carries most of the secondary actions on a family-facing page.
   */
  soft: "bg-lake-soft text-lake-deep hover:brightness-[0.97]",
  /** Sits over the flower or a gradient without fighting it. */
  glass: "glass text-fg hover:bg-surface-strong hover:border-line-strong",
  outline: "border border-line-strong text-fg hover:bg-surface hover:border-fg-subtle",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface",
} as const;

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

/**
 * A link styled as a button.
 *
 * Separate from `Button` on purpose: a thing that navigates must be an anchor
 * so it can be opened in a new tab, copied, and read correctly by a screen
 * reader. A `<button onClick={router.push}>` looks identical and is not.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: SharedProps & ComponentPropsWithoutRef<typeof Link>) {
  const external = typeof href === "string" && /^https?:/.test(href);

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
