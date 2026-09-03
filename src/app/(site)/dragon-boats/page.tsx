import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { DragonBoatForm } from "./DragonBoatForm";

export const metadata: Metadata = {
  title: "Dragon Boat Races",
  description:
    "Red Dragon against Black Dragon on Echo Park Lake, both days of the Los Angeles Lotus Festival. " +
    "Eight to a boat, co-ed, no experience needed. How the race works, what to bring, and how to enter a team.",
};

/**
 * The crew, in the order they sit.
 *
 * Kept as data rather than three hand-written blocks because the seating
 * diagram below and these cards have to agree; if they ever disagree, a team
 * captain turns up with the wrong number of people.
 */
const crew = [
  {
    seat: "Bow",
    role: "One drummer",
    body: "Sits at the front facing the crew and beats the pace. Everything the boat does is set by that drum — it is the only reason eight paddles enter the water at the same moment, and it is the sound that reaches the bank first.",
  },
  {
    seat: "Middle",
    role: "Six paddlers",
    body: "Three pairs, working in time with each other rather than as hard as they can. Teams that stay together beat teams that pull harder, which is most of what a first-time crew learns in its first heat.",
  },
  {
    seat: "Stern",
    role: "One steersman",
    body: "Stands at the back on the sweep oar and holds the line. The lake is narrow and the two boats race close, so keeping straight is worth more than it sounds.",
  },
] as const;

/**
 * The trophy categories recorded on the festival's own race sheet. Written as
 * the ones we know of rather than as a closed list — the sheet is from a past
 * cycle and the categories have changed before.
 */
const trophies = [
  "Best Overall",
  "Community",
  "Corporate",
  "City Family",
  "Governmental Agencies",
  "Elected Officials",
  "Media",
  "Snappiest Dressers",
  "Turtle Team",
] as const;

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
function BoatDiagram({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 128"
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="db-hull" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.04" />
          <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.13" />
          <stop offset="100%" stopColor="var(--vermilion)" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Hull. */}
      <path
        d="M14 64C170 12 590 12 746 64C590 116 170 116 14 64Z"
        fill="url(#db-hull)"
        stroke="var(--gold)"
        strokeOpacity="0.4"
        strokeWidth="1.25"
      />
      <path
        d="M52 64H708"
        stroke="var(--gold)"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeDasharray="3 7"
      />

      {/* The drum, and the sound coming off it. */}
      <circle cx="128" cy="64" r="30" stroke="var(--gold)" strokeOpacity="0.12" />
      <circle cx="128" cy="64" r="20" stroke="var(--gold)" strokeOpacity="0.22" />
      <circle cx="128" cy="64" r="9" fill="var(--gold)" />

      {/* Six paddlers, three pairs. */}
      {[268, 356, 444].map((x) => (
        <g key={x}>
          <circle cx={x} cy="44" r="7" fill="var(--gold)" fillOpacity="0.45" />
          <circle cx={x} cy="84" r="7" fill="var(--gold)" fillOpacity="0.45" />
        </g>
      ))}

      {/* The steersman, and the sweep oar trailing off the stern. */}
      <circle cx="644" cy="64" r="8" fill="var(--vermilion)" fillOpacity="0.85" />
      <path
        d="M652 60L722 42"
        stroke="var(--vermilion)"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DragonBoatsPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        {/* Light off the water, low and warm, behind the type. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(100% 62% at 18% 4%, rgba(232,184,87,0.16) 0%, rgba(224,64,43,0.07) 42%, rgba(11,10,15,0) 74%)",
          }}
        />

        <Container>
          <Reveal delay={0.05}>
            <Badge tone="gold">Echo Park Lake · Both days</Badge>
          </Reveal>

          <h1 className="mt-7 max-w-[16ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.12}
              lines={[
                <span key="1" className="block">
                  <em className="text-gradient-gold not-italic">Dragon boat</em>
                </span>,
                <span key="2" className="block">
                  races on the lake
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.4} y={16}>
            <p className="text-fg/85 mt-8 max-w-[54ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Two boats at a time, head to head, across both days of the festival. The Red Dragon
              and the Black Dragon, eight people to a crew, most of whom have never done this
              before. The boats have been on the program for half a century, and they are what a lot
              of people come back for.
            </p>
          </Reveal>

          <Reveal delay={0.52} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#enter-a-team" size="lg">
                Enter a team
              </ButtonLink>
              <ButtonLink href={`mailto:${site.contact.email}`} variant="outline" size="lg">
                Ask the race committee
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.64} y={12}>
            <dl className="border-line mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["The match-up", "Red Dragon against Black Dragon"],
                ["The crew", "Eight to a boat, co-ed"],
                ["The course", "The length of the lake and back"],
                ["Watching", "Free, like the rest of the festival"],
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
              eyebrow="From the bank"
              title="You hear the drum before you see the boat"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
              <p>
                It carries across the water ahead of everything else — one beat, then the paddles
                answering it. Then two hulls come down the lake with the lotus bed on one side and
                the crowd on the other, close enough together that whoever is nearest the bank gets
                shouted at by strangers.
              </p>
              <p>
                A heat is over quickly. The boats go back to the dock, two more crews climb in, and
                it happens again, and again, through the afternoon. Nobody has to book anything or
                pay anything to watch — you can stand on the path around the lake, wherever there is
                room.
              </p>
              <p>
                Almost nobody racing is a rower, and that is the point of it. The teams are people
                from one office, or one block, or one department, who said yes to something in the
                spring and are now in a boat in July.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <Rule className="my-10" />
            <p className="text-fg-muted text-[15px] leading-relaxed">
              A traditional blessing of the dragon boats is part of the opening ceremony, Saturday
              at noon.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The crew"
              title="Eight to a boat"
              lede="One drummer, six paddlers, one steersman. Every boat is co-ed, and at least four of the eight must be women — a rule, not a target. No experience is asked for anywhere in that list."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <BoatDiagram className="mx-auto mt-12 h-auto w-full max-w-3xl" />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {crew.map((position, index) => (
              <Reveal key={position.role} delay={0.06 * index}>
                <Card className="h-full">
                  <p className="eyebrow">{position.seat}</p>
                  <h3 className="mt-3 text-[1.35rem] leading-snug">{position.role}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{position.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Race day"
              title="What to bring, and what is waiting for you"
              lede="Everything a captain needs to get their crew onto the water without a scramble."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Bring rubber-soled shoes",
                body: "Every member of the crew needs them, and they are the one piece of kit you supply yourself. A wet hull under a smooth sole is how people end up in the water.",
              },
              {
                title: "Life jackets are supplied",
                body: "The Department of Recreation and Parks provides one for everybody in the boat, and everybody in the boat wears one. There is nothing to hire and nothing to bring.",
              },
              {
                title: "Check in thirty minutes early",
                body: "Team captains report to the Dragon Boat booth half an hour before their heat. Turn up at the heat time and you will miss it — the schedule moves boats through steadily.",
              },
              {
                title: "The course",
                body: "It starts at the dock by the Main Stage, runs roughly the length of the lake and back, and is marked with buoys. No motors, no professional oarsmen, nobody stands up or climbs out, and no alcohol on anyone in the boat.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={0.05 * index}>
                <Card className="h-full">
                  <h3 className="text-[1.35rem] leading-snug">{item.title}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-8 max-w-[62ch] text-[15px] leading-relaxed">
              Race times and the heat schedule are set closer to the festival and sent to captains
              once teams are confirmed. The {site.editionOrdinal} festival is in{" "}
              {site.dates.display}; {site.dates.detail.toLowerCase()}.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden">
        {/* A single quiet wash. The cultural note is the one place on this
            page that should feel like it is being said rather than listed. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(72% 50% at 50% 0%, rgba(224,64,43,0.13) 0%, rgba(11,10,15,0) 70%)",
          }}
        />

        <Container size="narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Where the boats come from"
              title="A poet, a river, and a drum"
              align="center"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-9 flex flex-col gap-5 text-center text-[1.0625rem] leading-[1.75]">
              <p>
                Dragon boat racing comes from <span lang="zh-Hans">端午节</span>, Duanwu, held on
                the fifth day of the fifth lunar month. The story most often told is of{" "}
                <span lang="zh-Hans">屈原</span>, Qu Yuan, a poet and minister of the state of Chu
                who drowned himself in the Miluo River in 278 BCE after his own court stopped
                listening to him. Villagers rowed out to look for him and beat drums on the water,
                and the racing and the drumming are what remain of that search.
              </p>
              <p className="text-fg-muted">
                That is the best-known account, and it is not the oldest one. Duanwu was already a
                midsummer observance against sickness before it was about any one person, and other
                regions attach it to other names. Both layers are real, and the festival would
                rather say so than tidy it into a single story.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <Rule className="my-12" />
          </Reveal>

          <Reveal delay={0.14}>
            <div className="flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
              <h3 className="text-[1.5rem] leading-snug">How the boats reached Echo Park</h3>
              <p>
                Duanwu falls about a month before the Lotus Festival, so this is not that festival
                held late. It is Los Angeles keeping the boats and the drum in its own July, on a
                lake in the middle of the city.
              </p>
              <p className="text-fg-muted">
                When the boats first raced here is genuinely disputed, and by the festival&rsquo;s
                own people. The City dates them to 1975 and the third Lotus Festival, where the
                first hulls, by one account, were two rowboats lashed together and fitted with
                dragon décor, raced by ten co-ed teams raced the length of the lake. Recreation and
                Parks elsewhere credits a Chinese opening ceremony in 1991 with making them
                permanent. The festival&rsquo;s own site credits an advisory board chair in the
                mid-nineties with bringing them in. All three accounts are held by people who were
                there, so the honest thing to say is that the boats have been part of this for fifty
                years and that nobody agrees on the first one.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Trophies"
              title="Trophies, and one of them is for coming last"
              lede="Winners are decided by category and by time. The categories are the giveaway: this is a race, and it is also a neighbourhood turning out for itself."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-9 flex flex-wrap gap-2.5">
              {trophies.map((trophy) => (
                <li key={trophy}>
                  <Badge tone={trophy === "Turtle Team" ? "gold" : "neutral"}>{trophy}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Card className="border-gold/30 bg-gold/8 h-full">
                <h3 className="text-[1.35rem] leading-snug">The Turtle Team</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  Awarded for the slowest overall time. It exists because the festival would much
                  rather a crew of eight beginners finished last than never got in the boat. There
                  is also a trophy for Snappiest Dressers, which tells you the same thing from the
                  other direction.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.06}>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">Who races</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  Community groups and cultural organizations, companies, City of Los Angeles
                  departments, colleges and universities, the offices of elected officials, and
                  newsrooms. Teams enter in the category they belong to, and race everyone else in
                  it.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border-line mt-10 rounded-2xl border p-6 sm:p-7">
              <h3 className="text-[1.35rem] leading-snug">What it has cost to enter</h3>
              <p className="text-fg-muted mt-3 max-w-[64ch] text-[15px] leading-relaxed">
                In recent race cycles the entry fee was <strong className="text-fg">$200</strong>{" "}
                for media, corporate, governmental agency and elected official teams, and{" "}
                <strong className="text-fg">$75</strong> for community, college and university
                teams.
              </p>
              <p className="text-fg-muted mt-3 max-w-[64ch] text-[15px] leading-relaxed">
                Those are past figures, given so you can budget roughly. They are not {site.year}{" "}
                prices — the fee for the {site.editionOrdinal} festival is set with the rest of the
                race packet, and captains are told before anyone is asked to pay.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="enter-a-team" className="pt-4 sm:pt-6">
        <Container size="narrow">
          <Reveal>
            <Rule className="mb-14" />
            <SectionHeading
              eyebrow="Enter a team"
              title="Get eight people in a boat"
              lede="Tell the race committee who you are and roughly how many people you have. Nothing here is binding and no payment is taken. You do not need a full crew to send it — say how many you have and the committee will work with that."
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <DragonBoatForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
