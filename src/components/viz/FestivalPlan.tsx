import { Card } from "@/components/ui/layout";
import { programGroups } from "@/config/program";
import { site } from "@/config/site";

/**
 * Where everything is, relative to the water.
 *
 * This is a diagram and not a map, and the caption says so. The festival's own
 * site plan is published with the program a few weeks beforehand; drawing a
 * plausible-looking map here would put a stage in a place it may not be, and
 * someone would walk there in July.
 *
 * What it can say truthfully is the shape of the thing, which is the part
 * nobody explains: Echo Park Lake is in the middle, some of the festival
 * happens on the water, the path around the water becomes a long street of
 * food and makers, and everything else is on the grass outside that. That is
 * how the program groups itself, and it is how people describe it to each
 * other on the day.
 *
 * The three rings and their contents are read from `@/config/program`, so a
 * volunteer who retires an attraction there removes it from this drawing too.
 */

/** Which program group belongs in which ring, working outward from the water. */
const RINGS = [
  {
    id: "water",
    groupIds: ["lake"],
    title: "On the water",
    blurb: "Races, lanterns and the lotus bed itself.",
    color: "var(--lake)",
    /** Ellipse the markers are placed on, in the SVG's own units. */
    rx: 96,
    ry: 66,
    /** Rotation of this ring's markers, so the three do not line up. */
    offset: -90,
    /** Where the ring's own label sits on it, in degrees. */
    labelAngle: 62,
  },
  {
    id: "path",
    groupIds: ["grounds"],
    title: "The path around it",
    blurb: "One long street of food, makers and people with a table.",
    color: "var(--jade)",
    rx: 178,
    ry: 132,
    offset: -108,
    labelAngle: 70,
  },
  {
    id: "grounds",
    groupIds: ["stages", "families", "ceremonies"],
    title: "Out on the grass",
    blurb: "Both stages, the rides, the children’s area and the Sunday run.",
    color: "var(--rose)",
    rx: 246,
    ry: 188,
    offset: -96,
    labelAngle: 78,
  },
] as const;

const itemsFor = (groupIds: readonly string[]) =>
  programGroups.filter((group) => groupIds.includes(group.id)).flatMap((group) => group.items);

const rings = RINGS.map((ring) => ({ ...ring, items: itemsFor(ring.groupIds) }));

const CENTRE = { x: 280, y: 280 };

/**
 * Markers are spread evenly all the way round their ring, which is what makes
 * the drawing read as three necklaces rather than as scattered points. Each
 * ring carries its own rotation so the three never line up into spokes.
 */
function markerPosition(ring: (typeof rings)[number], index: number, count: number) {
  return pointOn(ring, ring.offset + (index / count) * 360);
}

/** A point on a ring's ellipse, at an angle in degrees clockwise from east. */
function pointOn(ring: { rx: number; ry: number }, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: CENTRE.x + Math.cos(angle) * ring.rx,
    y: CENTRE.y + Math.sin(angle) * ring.ry,
  };
}

export function FestivalPlan() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div className="lg:col-span-7">
        {/*
          Decorative: every ring and every marker in it is written out in the
          list beside this, which is the version that gets read aloud.
        */}
        <svg aria-hidden="true" viewBox="0 0 560 560" className="mx-auto h-auto w-full max-w-lg">
          <defs>
            <radialGradient id="fp-water" cx="46%" cy="38%" r="72%">
              <stop offset="0%" stopColor="#c6e0f4" />
              <stop offset="66%" stopColor="#93c1e3" />
              <stop offset="100%" stopColor="#6ea9d3" />
            </radialGradient>
          </defs>

          {/* The grass, and then the path around the water, which is a real
              path and so is drawn as a band rather than as a hairline. */}
          <ellipse
            cx={CENTRE.x}
            cy={CENTRE.y}
            rx={rings[2].rx}
            ry={rings[2].ry}
            fill="var(--jade)"
            fillOpacity="0.05"
            stroke="var(--rose)"
            strokeOpacity="0.28"
            strokeWidth="1.25"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
          <ellipse
            cx={CENTRE.x}
            cy={CENTRE.y}
            rx={rings[1].rx}
            ry={rings[1].ry}
            fill="none"
            stroke="var(--jade)"
            strokeOpacity="0.28"
            strokeWidth="13"
          />

          {/* Echo Park Lake. Not its true outline — see the note above. */}
          <ellipse
            cx={CENTRE.x}
            cy={CENTRE.y}
            rx="132"
            ry="98"
            fill="url(#fp-water)"
            stroke="var(--lake)"
            strokeOpacity="0.25"
          />

          {/*
            The lotus bed, at one end of the water, where it has been for about
            a century and where it is still in flower every July.
          */}
          <g>
            {[
              [176, 250, 11],
              [204, 236, 9],
              [232, 246, 8],
              [186, 276, 9],
              [214, 264, 7],
              [160, 268, 7],
              [240, 226, 6],
            ].map(([x, y, r], index) => (
              <circle key={index} cx={x} cy={y} r={r} fill="var(--jade)" fillOpacity="0.85" />
            ))}
            {[
              [193, 249, 5],
              [221, 250, 4],
            ].map(([x, y, r], index) => (
              <circle key={index} cx={x} cy={y} r={r} fill="var(--blush)" />
            ))}
            <text
              x="150"
              y="212"
              fill="var(--jade-deep)"
              fontSize="12"
              fontWeight="600"
              letterSpacing="0.08em"
              style={{ textTransform: "uppercase" }}
            >
              Lotus bed
            </text>
          </g>

          {/* One marker per thing on the program, sitting on its own ring. */}
          {rings.map((ring) =>
            ring.items.map((item, index) => {
              const { x, y } = markerPosition(ring, index, ring.items.length);
              return (
                <g key={item.id}>
                  <circle cx={x} cy={y} r="9" fill={ring.color} fillOpacity="0.14" />
                  <circle
                    cx={x}
                    cy={y}
                    r="4.2"
                    fill={ring.color}
                    stroke="var(--bg-raised)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            }),
          )}

          {/* The rings named on the drawing, so it can be read without the
              legend beside it. Decorative — the legend is the read version. */}
          {rings.map((ring) => {
            const { x, y } = pointOn({ rx: ring.rx, ry: ring.ry }, ring.labelAngle);
            return (
              <text
                key={ring.id}
                x={x + 12}
                y={y + 20}
                fill={ring.color}
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.08em"
                style={{ textTransform: "uppercase" }}
              >
                {ring.title}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="lg:col-span-5">
        <Card>
          <p className="eyebrow">Three rings</p>
          <ul className="mt-5 flex flex-col gap-6">
            {rings.map((ring) => (
              <li key={ring.id}>
                <p className="flex items-center gap-2.5 text-[15px]">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: ring.color }}
                  />
                  {ring.title}
                  <span className="text-fg-subtle text-[13px] tabular-nums">
                    {ring.items.length}
                  </span>
                </p>
                <p className="text-fg-muted mt-1.5 pl-5 text-[13.5px] leading-relaxed">
                  {ring.blurb}
                </p>
                <p className="text-fg-subtle mt-1.5 pl-5 text-[13px] leading-relaxed">
                  {ring.items.map((item) => item.name).join(" · ")}
                </p>
              </li>
            ))}
          </ul>

          <p className="text-fg-subtle border-line mt-6 border-t pt-5 text-[12.5px] leading-relaxed">
            A diagram, not a map. {site.venue.name} is in the middle and the rings are how the
            festival organises itself around it — the official site plan is published with the
            program, a few weeks before the weekend.
          </p>
        </Card>
      </div>
    </div>
  );
}
