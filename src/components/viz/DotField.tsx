"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A count you can see: one dot per thousand people.
 *
 * A number like "125,000" is read and forgotten. A hundred and twenty-five
 * marks laid out in a block is the same fact at a size the eye can measure,
 * which is the whole reason to draw a statistic rather than set it.
 *
 * The reveal is a single animated element — a mask wiping across the field —
 * rather than a hundred and twenty-five staggered children. Same effect, one
 * animation, and the dots themselves are static markup the browser can paint
 * once.
 *
 * Decorative. The figure it stands for is written out beside it in text.
 */

const COLUMNS = 25;
const ROWS = 5;
const GAP = 13;
const RADIUS = 3.4;

const WIDTH = (COLUMNS - 1) * GAP + RADIUS * 2;
const HEIGHT = (ROWS - 1) * GAP + RADIUS * 2;

export function DotField({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      preserveAspectRatio="xMinYMid meet"
    >
      <defs>
        <mask id="df-wipe" maskUnits="userSpaceOnUse">
          {reduced ? (
            <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#fff" />
          ) : (
            <motion.rect
              x="0"
              y="0"
              height={HEIGHT}
              fill="#fff"
              initial={{ width: 0 }}
              whileInView={{ width: WIDTH }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </mask>
      </defs>

      <g mask="url(#df-wipe)">
        {Array.from({ length: ROWS * COLUMNS }, (_, i) => {
          const column = i % COLUMNS;
          const row = Math.floor(i / COLUMNS);
          // The last column carries the lotus colour, so the block reads as a
          // measure with an end rather than as a texture that just stops.
          const last = column === COLUMNS - 1;
          return (
            <circle
              key={i}
              cx={RADIUS + column * GAP}
              cy={RADIUS + row * GAP}
              r={RADIUS}
              fill={last ? "var(--rose)" : "var(--lake)"}
              fillOpacity={last ? 0.85 : 0.42}
            />
          );
        })}
      </g>
    </svg>
  );
}
