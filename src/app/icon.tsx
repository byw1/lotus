import { ImageResponse } from "next/og";

/**
 * The favicon: a lotus, drawn as layered divs.
 *
 * next/og renders through Satori, which lays out flexbox and paints
 * backgrounds, borders and transforms — and does not run our stylesheet or
 * arbitrary SVG. So the flower is rebuilt here out of the only primitives that
 * survive that trip: absolutely positioned rounded rectangles, each rotated
 * around the centre of the square. Same rings and same palette as
 * `LotusFallback`, at a thirtieth of the size.
 *
 * It is deliberately not a reduced copy of the full flower. At 32 pixels the
 * outer ring of eight petals turns to mush, so the mark loses a ring and gains
 * contrast: six blush petals, five gold, a lit centre.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const RINGS = [
  {
    count: 6,
    width: 8.5,
    height: 15,
    offset: 0,
    background: "linear-gradient(to top, #d1698a 0%, #f0a8ba 55%, #fdeef2 100%)",
    opacity: 0.9,
  },
  {
    count: 5,
    width: 7,
    height: 10,
    offset: 36,
    background: "linear-gradient(to top, #e8b857 0%, #f3dba6 60%, #fffaf0 100%)",
    opacity: 1,
  },
] as const;

export default function Icon() {
  const center = size.width / 2;

  return new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        position: "relative",
        background: "radial-gradient(circle at 50% 62%, #1a1522 0%, #0b0a0f 72%)",
      }}
    >
      {RINGS.flatMap((ring, r) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = ring.offset + (i / ring.count) * 360;
          return (
            <div
              key={`${r}-${i}`}
              style={{
                position: "absolute",
                left: center - ring.width / 2,
                top: center - ring.height / 2,
                width: ring.width,
                height: ring.height,
                borderRadius: "50%",
                background: ring.background,
                opacity: ring.opacity,
                // Satori rotates about the element's own centre, so the
                // translate has to come after the rotate: the petal turns
                // first, then slides out along its own axis, leaving its
                // base at the centre of the flower.
                transform: `rotate(${angle}deg) translateY(${-ring.height / 2}px)`,
              }}
            />
          );
        }),
      )}

      <div
        style={{
          position: "absolute",
          left: center - 3,
          top: center - 3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #fffaf0 0%, #e8b857 70%)",
        }}
      />
    </div>,
    size,
  );
}
