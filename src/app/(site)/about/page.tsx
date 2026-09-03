import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { history, site } from "@/config/site";

export const metadata: Metadata = {
  title: "About the festival",
  description:
    "The Los Angeles Lotus Festival has been held at Echo Park Lake since 1972, presented by the Department of Recreation and Parks with Los Angeles Lotus Festival, Inc. Its history, the lotus bed it is named for, and how it is run.",
  alternates: { canonical: "/about" },
};

/**
 * Matched runs of CJK characters, so they can be tagged for the right font.
 *
 * `history` in `@/config/site` is shared, plain-string data — deliberately so,
 * because a volunteer edits it — which means the Chinese in it arrives here
 * unmarked. Untagged, those glyphs fall to the Latin display face and get
 * rendered by whatever fallback the browser reaches for, which is how Chinese
 * ends up looking Japanese. Tagging them at render time keeps the data plain
 * and still hands the reader's system CJK face the characters it should set.
 */
const CJK_RUN = /([\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]+)/g;

function withCjk(text: string): ReactNode[] {
  // String.split with a capturing group alternates: even indices are Latin,
  // odd indices are the captured CJK runs.
  return text.split(CJK_RUN).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} lang="zh-Hans">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhatItIs />
      <Timeline />
      <TheLotus />
      <HowItIsRun />
    </>
  );
}

function AboutHero() {
  return (
    <Section className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 58% at 82% 104%, rgba(240,168,186,0.14) 0%, rgba(232,184,87,0.09) 42%, rgba(11,10,15,0) 74%)",
        }}
      />

      <Container>
        <Reveal>
          <p className="eyebrow">About</p>
        </Reveal>

        <h1 className="mt-6 text-[clamp(2.5rem,7.4vw,5.4rem)] leading-[0.95] tracking-[-0.03em]">
          <LineReveal
            delay={0.08}
            lines={[
              <span key="1">A festival</span>,
              <span key="2">
                since <em className="text-gradient-gold not-italic">1972</em>
              </span>,
            ]}
          />
        </h1>

        <Reveal delay={0.3} y={16}>
          <p className="text-fg-muted mt-8 max-w-[60ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6]">
            The Los Angeles Lotus Festival is two free days at Echo Park Lake, held each July while
            the lotus bed is in bloom, celebrating the cultures of Asia and the Pacific Islands and
            the people in Los Angeles who carry them.
          </p>
        </Reveal>

        <Reveal delay={0.42} y={14}>
          <Rule className="mt-12" />
        </Reveal>
      </Container>
    </Section>
  );
}

function WhatItIs() {
  return (
    <Section tone="paper" aria-label="What the festival is">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="01" title="What it is, and who it is for" />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="text-fg-muted flex flex-col gap-5 text-[clamp(1rem,1.2vw,1.0625rem)] leading-[1.75]">
              <p>
                The festival was created in 1972 to recognize what Asian Americans have contributed
                to this city, and it has kept that job. Each year it honors one Asian, Native
                Hawaiian or Pacific Islander culture in particular, while the stages, the food court
                and the boat teams stay open to everyone.
              </p>
              <p>
                It is a neighborhood event at civic scale. {site.attendance} walk through it — from
                the blocks around Echo Park, from across the county, and from further out — and
                nobody is charged to come in. Families with small children, crews who come back to
                race the boats year after year, and people who walked down because they could hear
                the music all end up on the same path around the same lake.
              </p>
              <p>
                It is produced by the City of Los Angeles Department of Recreation and Parks with{" "}
                {site.nonprofit.legalName}, and it runs on volunteers.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Timeline() {
  return (
    <Section aria-label="The festival's history">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="02"
            title="The festival since 1972"
            lede="Where the festival's own records disagree with each other, this says so rather than picking the better story."
          />
        </Reveal>

        <ol className="mt-14 sm:mt-16">
          {history.map((entry, index) => {
            // `current` is set on one entry only, so the union type does not
            // carry the key on the others.
            const current = "current" in entry && entry.current;

            return (
              <li
                key={entry.year}
                className="border-line relative border-l pb-14 pl-8 last:border-transparent last:pb-0 sm:pl-12"
              >
                <span
                  aria-hidden="true"
                  className={
                    current
                      ? "bg-vermilion border-bg absolute top-[0.45rem] -left-[7px] size-3.5 rounded-full border-2"
                      : "bg-gold border-bg absolute top-[0.5rem] -left-[6px] size-3 rounded-full border-2"
                  }
                />

                <Reveal delay={Math.min(index, 3) * 0.05}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <p className="font-display text-gold text-[clamp(1.5rem,3vw,2rem)] leading-none">
                      {entry.year}
                    </p>
                    {current ? <Badge tone="vermilion">This edition</Badge> : null}
                  </div>

                  <h3 className="mt-3 text-[clamp(1.25rem,2.4vw,1.6rem)] leading-tight">
                    {entry.title}
                  </h3>

                  <p className="text-fg-muted mt-4 max-w-[64ch] leading-[1.75]">
                    {withCjk(entry.body)}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}

/**
 * The lotus, and what it means where the honored culture comes from.
 *
 * The second half of this section is written for China specifically — the
 * homophones and Zhou Dunyi are Chinese, not pan-Asian — so it does not read
 * `site.honoredCountry` and pretend to be generic. When the honored culture
 * changes, this half is rewritten by someone who knows that culture. Swapping
 * a country name into a Chinese literary reading would be exactly the
 * flattening this festival exists to avoid.
 */
function TheLotus() {
  return (
    <Section tone="paper" aria-label="The lotus">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="03"
            title="The flower the festival is named for"
            lede={site.venue.note}
          />
        </Reveal>

        <div className="mt-12 grid gap-12 sm:mt-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="text-fg-muted flex flex-col gap-5 leading-[1.75]">
              <h3 className="text-fg text-[clamp(1.25rem,2.4vw,1.6rem)] leading-tight">Why July</h3>
              <p>
                Because that is when the bed flowers. The first festival, in 1972, was timed to the
                bloom, and every one since has been held in the same short window when the lake is
                covered in open lotus.
              </p>
              <p>
                The bed is not decoration and it is not guaranteed. It had died back by 2010; the
                lake was drained, rehabilitated and the lotus replanted, and the festival paused for
                two years while that happened. What comes up each July is something the city
                deliberately brought back.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="text-fg-muted flex flex-col gap-5 leading-[1.75]">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="vermilion">2027 · {site.honoredCountry.name}</Badge>
              </div>
              <h3 className="text-fg text-[clamp(1.25rem,2.4vw,1.6rem)] leading-tight">
                The gentleman among flowers
              </h3>
              <p>
                The {site.editionOrdinal} festival honors China, and the flower on the lake is one
                Chinese writers have been thinking with for a thousand years. Chinese has two words
                for it, and each is a homophone of a virtue:
              </p>

              <dl className="border-line flex flex-col gap-4 border-l pl-6">
                <div>
                  <dt className="text-fg text-[1.35rem] leading-snug">
                    <span lang="zh-Hans">荷</span>{" "}
                    <span className="text-fg-muted text-base italic">hé</span>
                  </dt>
                  <dd className="mt-1 text-[15px]">
                    Lotus. A homophone of <span lang="zh-Hans">和</span> — harmony.
                  </dd>
                </div>
                <div>
                  <dt className="text-fg text-[1.35rem] leading-snug">
                    <span lang="zh-Hans">莲</span>{" "}
                    <span className="text-fg-muted text-base italic">lián</span>
                  </dt>
                  <dd className="mt-1 text-[15px]">
                    Also lotus. A homophone of <span lang="zh-Hans">廉</span> — integrity, the
                    virtue expected of an honest official.
                  </dd>
                </div>
              </dl>

              <p>
                Zhou Dunyi (<span lang="zh-Hans">周敦颐</span>, 1017–1073) wrote a short essay about
                that second word, <span lang="zh-Hans">《爱莲说》</span>, &ldquo;On the Love of the
                Lotus&rdquo;. Chinese schoolchildren still learn it. He weighs the chrysanthemum and
                the peony against the lotus and calls the lotus <span lang="zh-Hans">花之君子</span>{" "}
                — the gentleman among flowers.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <figure className="border-gold/30 bg-bg-raised mt-14 rounded-2xl border p-8 sm:mt-16 sm:p-12">
            <blockquote>
              <p
                lang="zh-Hans"
                className="text-fg text-[clamp(1.6rem,4.6vw,2.75rem)] leading-[1.35] tracking-[0.02em]"
              >
                出淤泥而不染
              </p>
              <p className="text-fg-muted mt-6 max-w-[46ch] text-[clamp(1.0625rem,1.6vw,1.3rem)] leading-snug italic">
                &ldquo;It emerges from the mud yet is not stained.&rdquo;
              </p>
            </blockquote>
            <figcaption className="text-fg-subtle mt-7 text-sm">
              Zhou Dunyi, <span lang="zh-Hans">《爱莲说》</span> — written nine hundred years before
              anyone planted lotus in a city lake in Los Angeles.
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </Section>
  );
}

function HowItIsRun() {
  /**
   * Three organizations, drawn from shared data where it exists. The Advisory
   * Board is not a presenter — it does not produce the festival — so it is
   * named here rather than added to `site.presenters`, which the footer and
   * the homepage also read.
   */
  const partners = [
    ...site.presenters.map((presenter) => ({
      name: presenter.name,
      href: presenter.href,
      linkLabel: "The department's festival page",
      role: presenter.role,
      note:
        presenter.name === site.nonprofit.legalName
          ? `${site.nonprofit.status}. EIN ${site.nonprofit.ein}. ${site.nonprofit.note}`
          : null,
    })),
    {
      name: "The Lotus Advisory Board",
      href: null,
      linkLabel: null,
      role: "Created in 1991, drawing representatives from Asian and Pacific Islander communities across Los Angeles.",
      note: "The board is why the culture being honored has a hand in how it is presented, rather than being programmed about.",
    },
  ];

  return (
    <Section aria-label="How the festival is run">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="04"
            title="How the festival is run"
            lede="Three organizations, working together. A city department, a nonprofit, and a board of the communities the festival exists for."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3">
          {partners.map((partner, index) => (
            <li key={partner.name}>
              <Reveal delay={index * 0.07} className="h-full">
                <Card className="flex h-full flex-col gap-4">
                  <h3 className="text-[clamp(1.2rem,2.2vw,1.45rem)] leading-tight">
                    {partner.name}
                  </h3>
                  <p className="text-fg-muted leading-relaxed">{partner.role}</p>
                  {partner.note ? (
                    <p className="text-fg-subtle text-[14px] leading-relaxed">{partner.note}</p>
                  ) : null}
                  {partner.href ? (
                    <p className="mt-auto pt-1">
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg hover:text-gold inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors duration-200"
                      >
                        {partner.linkLabel}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </p>
                  ) : null}
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="border-line mt-12 grid gap-8 rounded-2xl border p-7 sm:mt-14 sm:p-9 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-[clamp(1.2rem,2.2vw,1.45rem)] leading-tight">
                A different culture, every year
              </h3>
              <p className="text-fg-muted max-w-[62ch] leading-relaxed">
                Since 1990 the festival has honored one Asian, Native Hawaiian or Pacific Islander
                culture each year, chosen with the Advisory Board. Which one comes next is announced
                at the closing ceremony on the Sunday evening — from the stage, to whoever is still
                there. It is not published first and read out afterwards.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-fg-muted leading-relaxed">
                The festival is run by volunteers, and there is room for more of them.
              </p>
              <div>
                <ButtonLink href="/get-involved" variant="primary" size="lg">
                  Get involved
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
