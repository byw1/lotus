import { cn } from "@/lib/utils";

/**
 * A boat seen from above, bow to the left.
 *
 * Deliberately a schematic and not a picture of a dragon: a drawn dragon head
 * at this size becomes a cartoon, and a Chinese dragon drawn carelessly by a
 * Western hand is exactly the thing this site should not do. The hull, the
 * seats and the ring of sound around the drum say what a reader needs.
 *
 * Decorative — every position it shows is written out in the cards beside it.
 */
export function BoatDiagram({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 128"
      className={cn("h-full w-full", className)}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="db-hull" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--lake)" stopOpacity="0.04" />
          <stop offset="45%" stopColor="var(--lake)" stopOpacity="0.13" />
          <stop offset="100%" stopColor="var(--rose)" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Hull. */}
      <path
        d="M14 64C170 12 590 12 746 64C590 116 170 116 14 64Z"
        fill="url(#db-hull)"
        stroke="var(--lake)"
        strokeOpacity="0.4"
        strokeWidth="1.25"
      />
      <path
        d="M52 64H708"
        stroke="var(--lake)"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeDasharray="3 7"
      />

      {/* The drum, and the sound coming off it. */}
      <circle cx="128" cy="64" r="30" stroke="var(--lake)" strokeOpacity="0.12" />
      <circle cx="128" cy="64" r="20" stroke="var(--lake)" strokeOpacity="0.22" />
      <circle cx="128" cy="64" r="9" fill="var(--lake)" />

      {/* Six paddlers, three pairs. */}
      {[268, 356, 444].map((x) => (
        <g key={x}>
          <circle cx={x} cy="44" r="7" fill="var(--lake)" fillOpacity="0.45" />
          <circle cx={x} cy="84" r="7" fill="var(--lake)" fillOpacity="0.45" />
        </g>
      ))}

      {/* The steersman, and the sweep oar trailing off the stern. */}
      <circle cx="644" cy="64" r="8" fill="var(--rose)" fillOpacity="0.85" />
      <path
        d="M652 60L722 42"
        stroke="var(--rose)"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
