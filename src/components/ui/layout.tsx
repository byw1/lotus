import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";

/**
 * The handful of tags these wrappers are ever rendered as.
 *
 * A fully generic polymorphic `as` prop is a well-known TypeScript tar pit:
 * the union of every intrinsic element's props collapses to `never`, and
 * `className` stops type-checking. Since only semantics vary here, not props,
 * a narrow union plus one cast at the JSX site is the honest trade.
 */
type Tag = Extract<
  keyof JSX.IntrinsicElements,
  "div" | "section" | "article" | "aside" | "main" | "header" | "footer" | "nav" | "li"
>;

import { cn } from "@/lib/utils";

/** The site's single content width. Everything lines up to this. */
export function Container({
  className,
  size = "default",
  ...props
}: ComponentPropsWithoutRef<"div"> & { size?: "default" | "narrow" | "wide" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-[88rem]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A band of the page.
 *
 * `tone="paper"` flips the surface tokens to the porcelain palette for that
 * band only — see globals.css. Reading and form-filling happen on paper; the
 * immersive sections stay on ink. That is the whole light/dark story on this
 * site: no toggle, no preference, just the right ground for the job.
 */
export function Section({
  className,
  tone = "ink",
  as = "section",
  children,
  ...props
}: ComponentPropsWithoutRef<"section"> & { tone?: "ink" | "paper"; as?: Tag }) {
  // Renders the real tag at runtime; typed as a div so props stay checkable.
  const Element = as as "div";

  return (
    <Element
      className={cn(
        tone === "paper" && "theme-paper",
        "bg-bg text-fg",
        "py-20 sm:py-28",
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.08] text-balance">{title}</h2>
      {lede ? (
        <p
          className={cn(
            "text-fg-muted max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] leading-relaxed",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

export function Card({
  className,
  as = "div",
  ...props
}: ComponentPropsWithoutRef<"div"> & { as?: Tag }) {
  const Element = as as "div";

  return (
    <Element
      className={cn(
        "border-line bg-surface rounded-2xl border p-6 sm:p-7",
        "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "gold" | "vermilion";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
        "text-[11px] font-medium tracking-[0.14em] uppercase",
        tone === "neutral" && "border-line text-fg-muted",
        tone === "gold" && "border-gold/35 bg-gold/10 text-gold",
        tone === "vermilion" && "border-vermilion/40 bg-vermilion/10 text-vermilion",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A gold hairline that fades out at both ends. */
export function Rule({ className }: { className?: string }) {
  return <div role="presentation" className={cn("rule-fade", className)} />;
}
