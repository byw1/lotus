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
 * The site is light throughout. Rhythm comes from alternating the ground
 * between white, a pale sky blue and a pale blush, and every text colour in
 * globals.css is chosen to clear AA on all three — so a tone is a background
 * change and nothing else has to move.
 *
 * `tone="deep"` is the one exception, an inverted navy band for a section that
 * wants the weight of evening on the water. Use it once or twice per page at
 * most; a family looking for the food court should not have to read white on
 * navy to find it.
 *
 * The two older names are kept as aliases so the twenty-nine pages that use
 * them keep working. They map to the two tinted bands rather than to white,
 * because what those names encoded was *alternation*: a page that alternates
 * `<Section>` with `<Section tone="paper">` has to end up with two different
 * grounds or the rhythm the page was written around disappears. `paper` is
 * therefore the sky band and `ink` the blush one; new sections should name
 * the tone they want.
 */
export type SectionTone = "white" | "sky" | "blush" | "deep" | "paper" | "ink";

const TONE_CLASS: Record<SectionTone, string> = {
  white: "",
  sky: "tone-sky",
  blush: "tone-blush",
  deep: "tone-deep",
  // Aliases. See above.
  paper: "tone-sky",
  ink: "tone-blush",
};

export function Section({
  className,
  tone = "white",
  as = "section",
  children,
  ...props
}: ComponentPropsWithoutRef<"section"> & { tone?: SectionTone; as?: Tag }) {
  // Renders the real tag at runtime; typed as a div so props stay checkable.
  const Element = as as "div";

  return (
    <Element
      className={cn(TONE_CLASS[tone], "bg-bg text-fg", "py-20 sm:py-28", className)}
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
        // Cards sit on the raised ground rather than a tint, so a card on the
        // sky band reads as a white card floating on blue — which is what makes
        // a light page feel open rather than flat.
        "border-line bg-bg-raised rounded-2xl border p-6 shadow-[0_1px_2px_rgba(19,41,61,0.04),0_8px_24px_-16px_rgba(19,41,61,0.18)] sm:p-7",
        "transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
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
  tone?: "neutral" | "gold" | "rose" | "lake" | "jade";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
        "text-[11px] font-medium tracking-[0.14em] uppercase",
        tone === "neutral" && "border-line text-fg-muted",
        // The deep variants, not the plain ones. A badge sets 11px over its own
        // 10% tint, and at that size both `--gold` and `--rose` land just under
        // AA there — 4.43:1 and 4.03:1 measured. The deep pair clears it.
        tone === "gold" && "border-gold/30 bg-gold/10 text-gold-deep",
        tone === "rose" && "border-rose/30 bg-rose/10 text-rose-deep",
        tone === "lake" && "border-lake/30 bg-lake/10 text-lake",
        tone === "jade" && "border-jade/30 bg-jade/10 text-jade",
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
