"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * A number that counts up when it scrolls into view.
 *
 * The whole point of an animated statistic is that it is read, so the final
 * value is what renders on the server and what assistive technology is given.
 * The animation writes into `textContent` on a `aria-hidden` span sitting over
 * an `sr-only` span holding the real, formatted value — so a screen reader
 * hears "125,000", once, rather than three hundred intermediate numbers as the
 * DOM mutates under it.
 *
 * If JavaScript never runs, the visible span already contains the final value:
 * it is server-rendered that way and only ever overwritten downward by the
 * effect below. Nothing here is load-bearing for reading the number.
 */
export function CountUp({
  value,
  duration = 1.5,
  /** Rendered before the number, inside the animated span. */
  prefix = "",
  /** Rendered after the number, inside the animated span. */
  suffix = "",
  /** Locale grouping, e.g. 125,000. Off for years — 1972, not 1,972. */
  group = true,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const format = (n: number) =>
    `${prefix}${group ? Math.round(n).toLocaleString("en-US") : String(Math.round(n))}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !inView) return;

    // Start from zero only now, at the moment the run begins. Rendering zero
    // and waiting would leave "0 people" on screen for anyone whose scroll
    // never reaches this section.
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        node.textContent = format(n);
      },
      onComplete: () => {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
    // `format` is derived from the same primitives already listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value, duration, prefix, suffix, group]);

  return (
    <>
      <span aria-hidden="true" ref={ref}>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
