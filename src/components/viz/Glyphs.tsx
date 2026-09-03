import type { SVGProps } from "react";

/**
 * The small drawings that sit above a statistic.
 *
 * Line work at a single weight, on a 24-unit grid, drawn from the festival
 * rather than pulled from an icon set — a lotus with the right number of
 * petals, a boat with a drum at the bow, the lake with the bed at one end.
 * `currentColor` throughout, so a glyph takes the colour of whatever it is
 * standing in.
 *
 * All decorative: every one of them sits beside the same fact in words.
 */

type GlyphProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** The flower, seen head on. */
export function LotusGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 4c1.9 2.2 2.8 4.6 2.8 7.2 0 2.6-.9 4.9-2.8 7-1.9-2.1-2.8-4.4-2.8-7C9.2 8.6 10.1 6.2 12 4Z" />
      <path d="M12 18.2c-2.6.6-5-.1-7.2-2 0-2.7 1-4.8 3-6.2 1.5 1 2.5 2.4 3 4.2" />
      <path d="M12 18.2c2.6.6 5-.1 7.2-2 0-2.7-1-4.8-3-6.2-1.5 1-2.5 2.4-3 4.2" />
      <path d="M4.5 16.4c2.3 2.6 4.8 3.9 7.5 3.9s5.2-1.3 7.5-3.9" />
    </Glyph>
  );
}

/** A dragon boat from the side: drum at the bow, sweep oar off the stern. */
export function BoatGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M2.5 13.5c3 3.2 6.2 4.8 9.5 4.8s6.5-1.6 9.5-4.8" />
      <path d="M2.5 13.5h19" />
      <circle cx="6.4" cy="10.4" r="1.7" />
      <path d="M10.6 11.6v-2M13.6 11.6v-2M16.6 11.6v-2" />
      <path d="M19.4 9.6 21.8 6" />
    </Glyph>
  );
}

/** A stage: apron, riser and the arch of a proscenium. */
export function StageGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 19h18" />
      <path d="M4.6 19v-3.6h14.8V19" />
      <path d="M6.4 15.4V12a5.6 5.6 0 0 1 11.2 0v3.4" />
      <path d="M12 12v3.4" />
    </Glyph>
  );
}

/** Two days on a calendar. */
export function DaysGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3.2" y="5.4" width="17.6" height="15" rx="2.4" />
      <path d="M3.2 10h17.6M8 3.4v3.6M16 3.4v3.6" />
      <path d="M8.4 14.2h2.4v3.2M13.4 14.2h2.2v3.2" />
    </Glyph>
  );
}

/** Free: a ticket with nothing to pay. */
export function TicketGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3.4 9.2V7.4a1.4 1.4 0 0 1 1.4-1.4h14.4a1.4 1.4 0 0 1 1.4 1.4v1.8a2.8 2.8 0 0 0 0 5.6v1.8a1.4 1.4 0 0 1-1.4 1.4H4.8a1.4 1.4 0 0 1-1.4-1.4v-1.8a2.8 2.8 0 0 0 0-5.6Z" />
      <path d="M12 8.6v1.6M12 13.8v1.6" strokeDasharray="0.1 3.2" />
    </Glyph>
  );
}

/** The lake with the lotus bed at one end. */
export function LakeGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.6c4.8 0 8.4 3.6 8.4 8.4S16.8 20.4 12 20.4 3.6 16.8 3.6 12 7.2 3.6 12 3.6Z" />
      <path d="M6.6 8.2c2.6-1.4 5-1.4 7.2 0 1.4.9 2.6 1 3.6.3" />
      <path d="M5.6 15.6c2.4 1.4 4.6 1.4 6.6 0 1.6-1.1 3.2-1.2 4.8-.2" />
    </Glyph>
  );
}

/** A year marked on a ring — for "since 1972". */
export function RingGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6v3.2M12 17.2v3.2M3.6 12h3.2M17.2 12h3.2" />
      <path d="m9.2 12 2 2 3.6-4.4" />
    </Glyph>
  );
}
