import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Section, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { programGroups, type ProgramItem } from "@/config/program";
import { site } from "@/config/site";

/**
 * Six things off the program, in the words the program already uses.
 *
 * The cards read their name and body straight out of `@/config/program`
 * rather than restating them, so the homepage cannot drift away from
 * `/festival` the first time a volunteer corrects a detail there. This file
 * chooses which six and where each one leads; the program file owns what they
 * say.
 *
 * An id that no longer exists in the program is dropped rather than rendered
 * empty — a retired attraction should disappear from the homepage, not turn
 * into a card with a heading and nothing under it.
 */
const itemsById = new Map<string, ProgramItem>(
  programGroups.flatMap((group) => group.items).map((item) => [item.id, item] as const),
);

type Pick = { id: string; href: string; cta: string };

const PICKS: readonly Pick[] = [
  { id: "dragon-boats", href: "/dragon-boats", cta: "Race, or enter a team" },
  { id: "main-stage", href: "/festival#main-stage", cta: "Both stages" },
  { id: "lights-of-dreams", href: "/festival#lights-of-dreams", cta: "On the lake" },
  { id: "food-court", href: "/festival#food-court", cta: "Around the lake" },
  { id: "boutiques", href: "/festival#boutiques", cta: "Around the lake" },
  { id: "childrens-area", href: "/festival#childrens-area", cta: "For families" },
];

const picks = PICKS.map((pick) => ({ pick, item: itemsById.get(pick.id) })).filter(
  (entry): entry is { pick: Pick; item: ProgramItem } => entry.item !== undefined,
);

export function ProgramPreview() {
  return (
    <Section aria-label="What happens across the two days">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What happens"
            title="Two days, two stages and a lake"
            lede={
              <>
                Performance from midday into the evening on both days, races on the water,
                thirty-odd kitchens and a lantern launch after dark — for {site.attendance}.
              </>
            }
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map(({ pick, item }, index) => (
            <li key={item.id} className="flex">
              {/*
                The Reveal is inside the list item rather than around it: a
                wrapper between <ul> and <li> costs a screen reader the count
                of how many things are in this list.
              */}
              <Reveal delay={(index % 3) * 0.07} className="flex w-full">
                <Card className="group hover:border-line-strong hover:bg-surface-strong relative flex w-full flex-col">
                  {item.ticketed ? (
                    <Badge className="mb-4 self-start" tone="neutral">
                      Ticketed separately
                    </Badge>
                  ) : null}

                  <h3 className="text-[1.35rem] leading-tight">{item.name}</h3>

                  <p className="text-fg-muted mt-3 flex-1 text-[15px] leading-relaxed">
                    {item.body}
                  </p>

                  <p className="mt-6">
                    {/*
                      The pseudo-element stretches this link over the whole
                      card, so the card is one target — while the thing that
                      takes focus and gets announced is still a real link with
                      a real label.
                    */}
                    <Link
                      href={pick.href}
                      className="text-gold hover:text-gold-soft inline-flex items-center gap-1.5 rounded text-[13.5px] font-medium transition-colors duration-200 after:absolute after:inset-0 after:content-['']"
                    >
                      {pick.cta}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
                      />
                    </Link>
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-fg-muted max-w-[58ch] text-[15px] leading-relaxed">
              Also across the weekend: the opening ceremony and the blessing of the boats at noon on
              Saturday, swan boats, a health fair, the eco-friendly area, carnival rides, the Beer
              &amp; Wine Garden, and the Lotus Flower 5K on the Sunday.
            </p>
            <ButtonLink href="/festival" variant="outline" className="self-start sm:self-auto">
              See the whole program
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
