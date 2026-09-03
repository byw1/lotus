import type { ComponentType, ReactNode, SVGProps } from "react";

import {
  BoatGlyph,
  DaysGlyph,
  LakeGlyph,
  LotusGlyph,
  RingGlyph,
  StageGlyph,
  TicketGlyph,
} from "@/components/viz/Glyphs";
import { DotField } from "@/components/viz/DotField";
import { CountUp } from "@/components/ui/CountUp";
import { Card, Container, Section, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

/**
 * The festival at a glance.
 *
 * Every figure here is one the festival can stand behind, and each one is
 * written in words as well as drawn — the drawing is what makes it stick, the
 * words are what make it checkable. Where a number is approximate it says so
 * in the label rather than being rounded into a false precision: "more than",
 * "around", "over".
 *
 * The two hedged figures are deliberate and documented in `config/site.ts` and
 * `config/program.ts`. Attendance is always "more than 125,000" because the
 * festival's own sources give three different counts; the food court is
 * "around thirty" for the same reason. Please do not tidy either into a round
 * exact number.
 */

type Stat = {
  glyph: ComponentType<SVGProps<SVGSVGElement>>;
  /** The figure, large. Pass a node so a count-up or a symbol can be used. */
  figure: ReactNode;
  label: string;
  note: string;
  /** The accent the glyph and figure take. */
  tone: "lake" | "rose" | "jade" | "gold";
};

const STATS: readonly Stat[] = [
  {
    glyph: LotusGlyph,
    figure: <CountUp value={site.edition} suffix="th" group={false} />,
    label: "edition",
    note: `Honoring ${site.honoredCountry.name} in ${site.year}.`,
    tone: "rose",
  },
  {
    glyph: RingGlyph,
    figure: <CountUp value={site.year - 1972} group={false} />,
    label: "years of it",
    // Not "every year": the festival stopped in 1978 when the City cut its
    // budget, and again while the lake was drained and the bed replanted.
    note: "Counted from the first Day of the Lotus in 1972. It has paused twice.",
    tone: "lake",
  },
  {
    glyph: TicketGlyph,
    figure: "$0",
    label: "to walk in",
    note: "Free, both days, no ticket. A few things inside are priced separately.",
    tone: "jade",
  },
  {
    glyph: DaysGlyph,
    figure: <CountUp value={2} group={false} />,
    label: "days in July",
    note: "Saturday and Sunday, midday into the evening.",
    tone: "lake",
  },
  {
    glyph: StageGlyph,
    figure: <CountUp value={2} group={false} />,
    label: "stages",
    note: "The Main Stage and the Dragon Stage, programmed across both days.",
    tone: "gold",
  },
  {
    glyph: BoatGlyph,
    figure: <CountUp value={8} group={false} />,
    label: "to a dragon boat",
    note: "A drummer, six paddlers and a steersman. Co-ed crews, no experience needed.",
    tone: "rose",
  },
];

const TONE_TEXT = {
  lake: "text-lake",
  rose: "text-rose",
  jade: "text-jade",
  gold: "text-gold",
} as const;

export function ByTheNumbers() {
  return (
    <Section tone="blush" aria-label="The festival in numbers">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="By the numbers"
            title="One weekend in July, since 1972"
            lede="Everything below is drawn from the festival’s own program and the City’s records. Where those sources disagree with each other, the figure here is the careful one."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {/* The attendance figure, given a whole tile because it is the one
              number that explains the scale of everything else. */}
          <Reveal className="sm:col-span-2" delay={0.04}>
            <Card className="flex h-full flex-col justify-between gap-8">
              <div>
                <LakeGlyph className="text-lake size-7" />
                <p className="text-lake mt-6 flex items-baseline gap-2 text-[clamp(2.6rem,6vw,4rem)] leading-none tracking-[-0.03em] tabular-nums">
                  <span aria-hidden="true" className="text-fg-subtle text-[0.5em]">
                    more than
                  </span>
                  <CountUp value={125000} />
                </p>
                <p className="text-fg mt-3 text-[15px]">
                  <span className="sr-only">More than 125,000 </span>people come each year
                </p>
              </div>

              <div>
                <DotField className="h-[4.6rem] w-full" />
                <p className="text-fg-subtle mt-4 text-[12.5px] leading-relaxed">
                  Each dot is a thousand people. The festival’s own program booklet says “more than
                  125,000”; elsewhere the same body of material says “over 100,000”, so this page
                  says the careful thing.
                </p>
              </div>
            </Card>
          </Reveal>

          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={0.04 + (index + 1) * 0.05}>
              <Card className="flex h-full flex-col">
                <stat.glyph className={`size-7 ${TONE_TEXT[stat.tone]}`} />
                <p
                  className={`${TONE_TEXT[stat.tone]} mt-6 text-[clamp(2.2rem,4.6vw,3rem)] leading-none tracking-[-0.03em] tabular-nums`}
                >
                  {stat.figure}
                </p>
                <p className="text-fg mt-2 text-[15px]">{stat.label}</p>
                <p className="text-fg-muted mt-3 text-[13.5px] leading-relaxed">{stat.note}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
