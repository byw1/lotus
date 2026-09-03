import { cn } from "@/lib/utils";

/**
 * A flat lotus, drawn in SVG.
 *
 * This is not a spinner. It stands in for the WebGL flower whenever the real
 * one cannot or should not run — while the 3D bundle is still downloading, on
 * a device with no WebGL context, and if the canvas throws. It is deliberately
 * the same silhouette and the same palette, so the swap is barely perceptible.
 *
 * It is a server component with no JavaScript, so it renders in the first
 * paint on any device.
 */

const RINGS = [
  { count: 8, height: 148, width: 46, offset: 0, opacity: 0.5, fill: "url(#lf-outer)" },
  { count: 8, height: 122, width: 42, offset: 22.5, opacity: 0.72, fill: "url(#lf-mid)" },
  { count: 6, height: 92, width: 36, offset: 12, opacity: 0.88, fill: "url(#lf-inner)" },
  { count: 5, height: 60, width: 28, offset: 36, opacity: 1, fill: "url(#lf-core)" },
];

/**
 * Round a computed coordinate before it reaches the DOM.
 *
 * `Math.sin` and `Math.cos` are not required to be correctly rounded, and V8
 * in Node does not always agree with V8 in the browser on the final bit. That
 * is enough to make the server-rendered `cx="-7.11085210762546"` differ from
 * the client's `-7.110852107625459` and fail hydration on every page that
 * draws this lotus. Three decimals is far finer than a pixel here, and it
 * makes the markup smaller as a bonus.
 */
const round = (n: number) => Math.round(n * 1000) / 1000;

/** A single petal, tip pointing up, rooted at the origin. */
function petalPath(width: number, height: number) {
  const w = width / 2;
  return [
    "M 0 0",
    `C ${round(-w)} ${round(-height * 0.3)} ${round(-w * 0.62)} ${round(-height * 0.86)} 0 ${round(-height)}`,
    `C ${round(w * 0.62)} ${round(-height * 0.86)} ${round(w)} ${round(-height * 0.3)} 0 0`,
    "Z",
  ].join(" ");
}

export function LotusFallback({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-190 -190 380 380"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="lf-outer" cx="50%" cy="100%" r="120%">
          <stop offset="0%" stopColor="#c94f77" />
          <stop offset="55%" stopColor="#eb9cb6" />
          <stop offset="100%" stopColor="#fbdde6" />
        </radialGradient>
        <radialGradient id="lf-mid" cx="50%" cy="100%" r="120%">
          <stop offset="0%" stopColor="#d95c81" />
          <stop offset="60%" stopColor="#f4b8ca" />
          <stop offset="100%" stopColor="#fdeef3" />
        </radialGradient>
        <radialGradient id="lf-inner" cx="50%" cy="100%" r="120%">
          <stop offset="0%" stopColor="#e2749a" />
          <stop offset="65%" stopColor="#f8d3de" />
          <stop offset="100%" stopColor="#fffafc" />
        </radialGradient>
        <radialGradient id="lf-core" cx="50%" cy="100%" r="120%">
          <stop offset="0%" stopColor="#f0c04a" />
          <stop offset="45%" stopColor="#f6dba8" />
          <stop offset="100%" stopColor="#fffaf0" />
        </radialGradient>
        {/*
          A halo of light around the flower rather than a glow out of it. On a
          white page a dark stop at the outer edge would ring the flower with a
          grey smudge, so the gradient fades to transparent instead and the
          page's own colour carries through.
        */}
        <radialGradient id="lf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f6c9d8" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#d7e8f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d7e8f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="185" fill="url(#lf-glow)" />

      {RINGS.map((ring, r) => (
        <g key={r} opacity={ring.opacity}>
          {Array.from({ length: ring.count }, (_, i) => {
            const angle = ring.offset + (i / ring.count) * 360;
            return (
              <path
                key={i}
                d={petalPath(ring.width, ring.height)}
                fill={ring.fill}
                stroke="#ffffff"
                strokeOpacity="0.5"
                strokeWidth="0.75"
                transform={`rotate(${round(angle)})`}
              />
            );
          })}
        </g>
      ))}

      {/* Seed pod and stamens. */}
      <circle cx="0" cy="0" r="17" fill="#c9c06a" />
      <circle cx="0" cy="0" r="17" fill="none" stroke="#8d8845" strokeWidth="1.5" />
      {Array.from({ length: 13 }, (_, i) => {
        const angle = (i / 13) * Math.PI * 2;
        const r = 9.5;
        return (
          <circle
            key={i}
            cx={round(Math.cos(angle) * r)}
            cy={round(Math.sin(angle) * r)}
            r="2.4"
            fill="#6f7a3a"
          />
        );
      })}
      {Array.from({ length: 48 }, (_, i) => {
        const angle = (i / 48) * Math.PI * 2;
        const inner = 18;
        const outer = 27 + (i % 3) * 2.5;
        return (
          <line
            key={i}
            x1={round(Math.cos(angle) * inner)}
            y1={round(Math.sin(angle) * inner)}
            x2={round(Math.cos(angle) * outer)}
            y2={round(Math.sin(angle) * outer)}
            stroke="#f0c04a"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      })}
    </svg>
  );
}
