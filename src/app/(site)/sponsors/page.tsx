import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import {
  compareRows,
  inKindPackages,
  RECOGNITION_APPROVAL_NOTE,
  SHARED_TIER_BENEFIT,
  SPECIALITY_FROM,
  specialityAreas,
  sponsorTiers,
} from "@/config/sponsorship";

import { SponsorForm } from "./SponsorForm";

export const metadata: Metadata = {
  title: "Sponsor the Festival",
  description:
    "Four lotus sponsorship tiers for the Los Angeles Lotus Festival, from the White Lotus title " +
    "package to the Green Lotus, plus speciality and in-kind packages. A free festival that more " +
    "than 125,000 people come to each year, presented with the City of Los Angeles.",
};

/**
 * One tier, as a card that can be read down a column beside the others.
 *
 * Every card renders every row in `compareRows`, including the ones this tier
 * does not include — a gap shown as a gap is the most useful thing on the
 * page, and silently omitting the row would make four cards of four different
 * heights that no longer line up.
 */
function TierCard({ tier }: { tier: (typeof sponsorTiers)[number] }) {
  return (
    <Card id={tier.id} className="flex h-full flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-[1.6rem] leading-snug">{tier.flower}</h3>
        <p className="text-gold text-[1.25rem] font-medium">{tier.amount}</p>
      </div>
      <p className="eyebrow mt-2">{tier.role}</p>
      <p className="text-fg-muted mt-4 text-[15px] leading-relaxed">{tier.summary}</p>

      <dl className="border-line mt-6 grid gap-x-6 gap-y-3 border-t pt-6 sm:grid-cols-[10rem_1fr]">
        {compareRows.map((row) => {
          const value = tier.compare[row.key];

          return (
            <div key={row.key} className="contents">
              <dt className="text-fg-subtle text-[13px] leading-snug">{row.label}</dt>
              <dd className="mb-2 text-[15px] leading-snug sm:mb-0">
                {value ?? (
                  <>
                    {/* The dash carries no meaning on its own; the words next
                        to it are what a screen reader announces. */}
                    <span aria-hidden="true" className="text-fg-subtle">
                      —
                    </span>
                    <span className="sr-only">Not included at this level</span>
                  </>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      <ul className="border-line mt-6 flex flex-col gap-2 border-t pt-6 text-[15px] leading-snug">
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-gold">
            ·
          </span>
          {SHARED_TIER_BENEFIT}
        </li>
        {tier.also.map((benefit) => (
          <li key={benefit} className="flex gap-3">
            <span aria-hidden="true" className="text-gold">
              ·
            </span>
            {benefit}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function SponsorsPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(96% 60% at 82% 2%, rgba(232,184,87,0.18) 0%, rgba(224,64,43,0.06) 44%, rgba(11,10,15,0) 74%)",
          }}
        />

        <Container>
          <Reveal delay={0.05}>
            <Badge tone="gold">
              {site.editionOrdinal} festival · {site.dates.display}
            </Badge>
          </Reveal>

          <h1 className="mt-7 max-w-[16ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.12}
              lines={[
                <span key="1" className="block">
                  <em className="text-gradient-gold not-italic">Sponsor</em> a festival
                </span>,
                <span key="2" className="block">
                  that stays free
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.4} y={16}>
            <p className="text-fg/85 mt-8 max-w-[58ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              {site.attendance} come to Echo Park Lake for the Lotus Festival, and none of them pay
              to get in. That is what sponsorship buys: two days that a family can turn up to
              without deciding whether they can afford it.
            </p>
          </Reveal>

          <Reveal delay={0.52} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#talk" size="lg">
                Start a conversation
              </ButtonLink>
              <ButtonLink href={`mailto:${site.contact.email}`} variant="outline" size="lg">
                {site.contact.email}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.64} y={12}>
            <dl className="border-line mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Who comes", site.attendance],
                ["Admission", "Free, and it always has been"],
                ["Presented with", "The City of Los Angeles"],
                ["Honoring", "A different culture every year since 1990"],
              ].map(([term, definition]) => (
                <div key={term} className="flex flex-col gap-2">
                  <dt className="eyebrow">{term}</dt>
                  <dd className="text-[15px] leading-snug">{definition}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper">
        <Container size="narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Why this one"
              title="A civic festival, not a marketing opportunity that happens outdoors"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
              <p>
                The Lotus Festival has been held at Echo Park Lake since 1972, produced by the City
                of Los Angeles Department of Recreation and Parks with {site.nonprofit.legalName}.
                Since 1990 it has honored a different Asian, Native Hawaiian or Pacific Islander
                culture each year, chosen by an advisory board drawn from those communities.
              </p>
              <p>
                The audience is the reason to be here. It is a July weekend in a public park in the
                middle of the city, so the crowd is the neighbourhood and half of Los Angeles
                besides — families, first-generation and fifth-generation, people who came for the
                dragon boats and people who came for the food.
              </p>
              <p className="text-fg-muted">
                A sponsor is named in front of that crowd for two days and in the program booklet
                they read while they wait. What that recognition looks like is set out below, at
                every level, in the words the festival&rsquo;s own sponsor packet uses.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The four lotus tiers"
              title="What each level includes"
              lede="Read them down the column: the rows are in the same order on every card, so what a level does and does not carry is visible at a glance. Every package is customisable, and the committee would rather build one around what you need than sell you one of these as printed."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {sponsorTiers.map((tier, index) => (
              <Reveal key={tier.id} delay={0.05 * index}>
                <TierCard tier={tier} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-8 max-w-[68ch] text-[15px] leading-relaxed">
              {SHARED_TIER_BENEFIT} is presented at all four levels. Program advertisements and
              website listings run for the year, and the website listing is on the{" "}
              {site.nonprofit.legalName} site.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={`Speciality areas · from ${SPECIALITY_FROM}`}
              title="Or take one part of the festival"
              lede="Rather than a tier, a sponsor can carry a single area — the thing your name sits on all weekend, and the thing people say when they describe where they were standing."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialityAreas.map((area, index) => (
              <Reveal key={area.name} delay={0.04 * index}>
                <Card className="h-full">
                  <h3 className="text-[1.2rem] leading-snug">{area.name}</h3>
                  <p className="text-fg-muted mt-2.5 text-[15px] leading-relaxed">{area.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Rule className="my-14" />
            <SectionHeading
              eyebrow={`In kind · from ${SPECIALITY_FROM}`}
              title="Three packages that are not a cheque"
              lede="Some of the most useful support the festival gets arrives as product, printing or airtime."
            />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {inKindPackages.map((item, index) => (
              <Reveal key={item.name} delay={0.05 * index}>
                <Card className="h-full">
                  <h3 className="text-[1.2rem] leading-snug">{item.name}</h3>
                  <p className="text-fg-muted mt-2.5 text-[15px] leading-relaxed">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Before you commit" title="Two things to have in writing" />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Reveal>
              {/* The single most important sentence on this page. A City
                  department cannot promise recognition the Commission has not
                  approved, so it is stated here, on every tier card's section,
                  and again in the form. */}
              <Card className="border-vermilion/40 bg-vermilion/8 h-full">
                <h3 className="text-[1.35rem] leading-snug">Commission approval</h3>
                <p className="mt-3 text-[15px] leading-relaxed">
                  <strong className="font-medium">{RECOGNITION_APPROVAL_NOTE}</strong>
                </p>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  The festival is produced by a City department, and how a sponsor is recognized on
                  public parkland is the Commission&rsquo;s decision rather than the
                  committee&rsquo;s. Nothing in a package is final until that approval is given, and
                  nobody on the festival team can promise around it.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.06}>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">Where the money goes</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  {site.nonprofit.legalName} is a {site.nonprofit.status}, EIN {site.nonprofit.ein},
                  recognized by the IRS in September 2007. Contributions may be tax-deductible to
                  the extent allowed by law.
                </p>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  That is a statement of the organization&rsquo;s status and not tax advice. What a
                  particular sponsorship means for your return depends on what you receive in
                  exchange for it, so ask your own accountant before you file.
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="talk" className="pt-4 sm:pt-6">
        <Container size="narrow">
          <Reveal>
            <Rule className="mb-14" />
            <SectionHeading
              eyebrow="Talk to the committee"
              title="Start with a level, or start with a budget"
              lede="Nothing here is binding and no payment is taken through this form. Say roughly what you have in mind and the sponsorship committee will come back with what it could look like."
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <SponsorForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
