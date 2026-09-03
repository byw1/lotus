"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Reveal content as it scrolls into view.
 *
 * Transform and opacity only — never height, top or margin — so the browser can
 * keep the whole thing on the compositor and nothing reflows mid-animation.
 *
 * Under `prefers-reduced-motion` this renders a plain `div`: no transform, no
 * opacity transition, no `whileInView` observer at all. The content is simply
 * there. Fading in "more gently" is not a reduced-motion accommodation; the
 * person has asked for no motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before starting. Use to stagger siblings. */
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      // Paired with the <noscript> rule in the root layout: Motion renders its
      // `initial` style into the server HTML, so without this hook every
      // revealed section on the page would stay invisible when JavaScript
      // does not run.
      data-reveal=""
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A heading that rises into place from behind a mask.
 *
 * The mask is what makes the difference between "text fades in" and the
 * line-reveal you see on award sites: each line is clipped by its own
 * overflow-hidden wrapper, so the type appears to rise out of the page rather
 * than float over it. Pass one child per line.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span className={className}>
        {lines.map((line, index) => (
          <span key={index} className={cn("block", lineClassName)}>
            {line}
            {/* Joins the lines for assistive tech; adjacent block spans would
                otherwise concatenate into one run-together word. */}
            {index < lines.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            data-reveal=""
            className={cn("block", lineClassName)}
            initial={{ y: "108%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 1.05,
              delay: delay + index * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
            {/* Joins the lines for assistive tech; adjacent block spans would
                otherwise concatenate into one run-together word. */}
            {index < lines.length - 1 ? " " : null}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
