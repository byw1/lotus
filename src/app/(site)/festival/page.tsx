import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { practicalities, programGroups, ticketedItems, type ProgramItem } from "@/config/program";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "What happens across the two days",
  description:
    "Two stages, dragon boat races on Echo Park Lake, the Lights of Dreams lanterns, a food court of around thirty vendors, the Lotus Artisan Village, carnival rides and the Lotus Flower 5K. Free admission, free shuttles, July 2027.",
  alternates: { canonical: "/festival" },
};

/**
 * The page someone reads before they come.
 *
 * Everything here is rendered from `@/config/program` rather than written into
 * the markup, so the person who knows what changed this year — a volunteer,
 * not a developer — can edit one list and have the page, its jump-to nav and
 * its "what costs money" block all follow. That is also why the ticketed flag
 * lives on the item: the practical block below builds its list from the same
 * data the cards do, and cannot drift out of step with them.
 */
export default function FestivalPage() {
  return (
    <>
      <FestivalHero />

      {programGroups.map((group, index) => (
        <Section
          key={group.id}
          id={group.id}
          aria-label={group.title}
          // Alternating grounds, starting on paper: the hero is ink, and a
          // long read wants the porcelain band first.
          tone={index % 2 === 0 ? "paper" : "ink"}
        >
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow={String(index + 1).padStart(2, "0")}
                title={group.title}
                lede={group.lede}
              />
            </Reveal>

            <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2">
              {group.items.map((item, itemIndex) => (
                <li key={item.id} id={item.id} className="scroll-mt-28">
                  {/*
                    The Reveal sits inside the list item, not around it: a
                    motion wrapper between <ul> and <li> would break the list
                    semantics that tell a screen reader how many things are in
                    this part of the festival.
                  */}
                  <Reveal delay={(itemIndex % 2) * 0.08} className="h-full">
                    <ProgramCard item={item} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      <Practical />
    </>
  );
}

function FestivalHero() {
  return (
    <Section className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* A low warm horizon, in place of the photograph this site does not have. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(90% 62% at 18% 108%, rgba(232,184,87,0.16) 0%, rgba(224,112,143,0.09) 40%, rgba(11,10,15,0) 72%)",
        }}
      />

      <Container>
        <Reveal>
          <p className="eyebrow">
            {site.editionOrdinal} Los Angeles Lotus Festival · {site.dates.display}
          </p>
        </Reveal>

        <h1 className="mt-6 text-[clamp(2.5rem,7.4vw,5.4rem)] leading-[0.95] tracking-[-0.03em]">
          <LineReveal
            delay={0.08}
            lines={[
              <span key="1">Two days at</span>,
              <span key="2">
                <em className="text-gradient-gold not-italic">Echo Park Lake</em>
              </span>,
            ]}
          />
        </h1>

        <Reveal delay={0.3} y={16}>
          <p className="text-fg-muted mt-8 max-w-[58ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6]">
            A Saturday and a Sunday of performance, food, dragon boat racing and lanterns on the
            water, held while the lotus bed is in bloom. Free to walk into, as it has been since
            1972, and attended by {site.attendance}.
          </p>
        </Reveal>

        <Reveal delay={0.4} y={14}>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Badge tone="gold">Free admission</Badge>
            <dl className="text-fg-muted flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
              <div>
                <dt className="sr-only">When</dt>
                <dd>
                  <time dateTime="2027-07">{site.dates.display}</time> · {site.dates.detail}
                </dd>
              </div>
              <span aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
              <div>
                <dt className="sr-only">Hours</dt>
                <dd>{site.dates.hours}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.5} y={14}>
          <Rule className="mt-12" />
        </Reveal>

        {/*
          A jump list rather than a sticky in-page nav. The page is long, but
          it is read once, standing up, on a phone — a persistent rail would
          eat the screen it is trying to help someone navigate.
        */}
        <Reveal delay={0.56} y={14}>
          <nav aria-label="On this page" className="mt-8">
            <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
              {programGroups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="border-line text-fg-muted hover:border-line-strong hover:text-fg inline-flex rounded-full border px-4 py-2 text-[13px] transition-colors duration-200"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#practical"
                  className="border-line text-fg-muted hover:border-line-strong hover:text-fg inline-flex rounded-full border px-4 py-2 text-[13px] transition-colors duration-200"
                >
                  Before you come
                </a>
              </li>
            </ul>
          </nav>
        </Reveal>
      </Container>
    </Section>
  );
}

function ProgramCard({ item }: { item: ProgramItem }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="text-[clamp(1.25rem,2.2vw,1.5rem)] leading-tight">{item.name}</h3>
        {item.ticketed ? <Badge tone="gold">Ticketed separately</Badge> : null}
      </div>

      <p className="text-fg-muted leading-relaxed">{item.body}</p>

      {item.detail ? (
        <ul className="text-fg-muted flex flex-col gap-2 text-[14.5px] leading-relaxed">
          {item.detail.map((line) => (
            <li key={line} className="flex gap-3">
              {/* Decorative marker; the list semantics carry the meaning. */}
              <span
                aria-hidden="true"
                className="bg-gold/70 mt-[0.6em] size-1 shrink-0 rounded-full"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.link ? (
        <p className="mt-auto pt-1">
          <Link
            href={item.link.href}
            className="text-fg hover:text-gold inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors duration-200"
          >
            {item.link.label}
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      ) : null}
    </Card>
  );
}

function Practical() {
  return (
    <Section id="practical" tone="ink" aria-label="Before you come">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Before you come"
            title="The practical part"
            lede={`${site.venue.name}, ${site.venue.address}. The things people ask before they come.`}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2">
          <Reveal className="h-full">
            <Card className="border-gold/25 h-full">
              <h3 className="text-[clamp(1.25rem,2.2vw,1.5rem)] leading-tight">Free admission</h3>
              <p className="text-fg-muted mt-4 leading-relaxed">
                Walking into the festival costs nothing, and it never has. A few things inside are
                sold separately:
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {ticketedItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-fg hover:text-gold rounded text-[14.5px] transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {practicalities.map((entry, index) => (
            <Reveal key={entry.id} delay={0.06 * (index + 1)} className="h-full">
              <Card id={entry.id} className="h-full scroll-mt-28">
                <h3 className="text-[clamp(1.25rem,2.2vw,1.5rem)] leading-tight">{entry.title}</h3>
                <p className="text-fg-muted mt-4 leading-relaxed">{entry.body}</p>
                {entry.points ? (
                  <ul className="text-fg-muted mt-5 flex flex-col gap-2 text-[14.5px] leading-relaxed">
                    {entry.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="bg-gold/70 mt-[0.6em] size-1 shrink-0 rounded-full"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="border-line mt-12 flex flex-col gap-6 rounded-2xl border p-7 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="text-fg-muted max-w-[52ch] leading-relaxed">
              Anything this page did not answer, ask. Questions about access, booths and boats all
              go to the same place —{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-fg hover:text-gold rounded transition-colors duration-200"
              >
                {site.contact.email}
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="outline">
                Contact the festival
              </ButtonLink>
              <ButtonLink href="/get-involved" variant="primary">
                Get involved
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
