import { ImageResponse } from "next/og";

import { site } from "@/config/site";

/**
 * The card that appears when someone pastes a link to this site into a
 * message, a post or a group chat — which, for a neighbourhood festival, is
 * how most people will first see it.
 *
 * It carries the three facts that decide whether someone opens the link: which
 * festival, where, and when. Nothing else. No photograph (there are none in
 * this repository), no strapline, no logo lockup.
 *
 * It is drawn with the fonts the renderer already has. next/og lays out
 * through Satori, which cannot see `next/font`, so pulling in the site's
 * Instrument Serif would mean fetching and embedding a font file on every
 * build of this route. The alternative — an image that quietly fails to render
 * because a font request timed out — is far worse than one set in the default
 * face, and nobody has ever chosen a festival by its open-graph typography.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.editionOrdinal} ${site.name} · ${site.venue.name} · ${site.dates.display}`;

/** Same construction as `icon.tsx`, at fifteen times the scale. */
const RINGS = [
  {
    count: 8,
    width: 74,
    height: 232,
    offset: 0,
    background: "linear-gradient(to top, #b8536f 0%, #e0708f 52%, #f7c3d0 100%)",
    opacity: 0.78,
  },
  {
    count: 8,
    width: 64,
    height: 178,
    offset: 22.5,
    background: "linear-gradient(to top, #d1698a 0%, #f0a8ba 58%, #fdeef2 100%)",
    opacity: 0.9,
  },
  {
    count: 6,
    width: 52,
    height: 118,
    offset: 12,
    background: "linear-gradient(to top, #e8b857 0%, #f3dba6 62%, #fffaf0 100%)",
    opacity: 1,
  },
] as const;

export default function OpengraphImage() {
  // The flower sits low and to the right, mostly out of frame, so that the
  // type on the left never has to be read against a lit petal.
  const flowerX = 1024;
  const flowerY = 636;

  return new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        background: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Morning on the lake: blue through the middle, warm where the flower is. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background: "radial-gradient(78% 108% at 84% 104%, #fbe6ee 0%, #eef4fb 44%, #ffffff 76%)",
        }}
      />

      {RINGS.flatMap((ring, r) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = ring.offset + (i / ring.count) * 360;
          return (
            <div
              key={`${r}-${i}`}
              style={{
                position: "absolute",
                left: flowerX - ring.width / 2,
                top: flowerY - ring.height / 2,
                width: ring.width,
                height: ring.height,
                borderRadius: "50%",
                background: ring.background,
                opacity: ring.opacity,
                // Rotate first, then push the petal out along its own axis;
                // see the note in icon.tsx.
                transform: `rotate(${angle}deg) translateY(${-ring.height / 2}px)`,
              }}
            />
          );
        }),
      )}

      {/*
        Keeps the type off the petals without dimming the whole flower. A white
        veil rather than a dark one, and every stop is white at a different
        alpha — fading toward a transparent tint would grey the midpoint.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.5) 62%, rgba(255,255,255,0) 82%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "0 80px 76px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#7d5a13",
          }}
        >
          Free admission · Since 1972
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 82,
            lineHeight: 1.04,
            letterSpacing: -2.5,
            color: "#13293d",
          }}
        >
          {site.editionOrdinal} Los Angeles Lotus Festival
        </div>

        {/* The hairline that divides every section of the site. */}
        <div
          style={{
            display: "flex",
            width: 148,
            height: 3,
            marginTop: 38,
            background: "linear-gradient(to right, #b83f66 0%, rgba(184,63,102,0) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 34,
            color: "#3d5468",
          }}
        >
          {site.venue.name} · {site.dates.display}
        </div>
      </div>
    </div>,
    size,
  );
}
