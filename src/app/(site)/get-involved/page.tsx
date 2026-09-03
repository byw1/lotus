import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { VolunteerForm } from "./VolunteerForm";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Volunteer at the Los Angeles Lotus Festival, or apply for a booth, a stage slot, a dragon " +
    "boat or a sponsorship. Shifts run 7am to 10pm across both days, volunteers are welcome from " +
    "age 14, and groups are welcome too.",
};

/**
 * Every way in, in one list.
 *
 * The volunteer route points at an anchor on this page rather than a page of
 * its own, because volunteering is the one thing here that needs no
 * qualification, no fee and no paperwork in advance — putting it behind
 * another click would be treating the easiest ask as the hardest.
 */
const routes = [
  {
    label: "Volunteer",
    href: "#volunteer",
    here: true,
    who: "Anyone from 14 up with a shift to give. No experience, no equipment, nobody to know.",
  },
  {
    label: "Vendors & boutiques",
    href: "/vendors",
    here: false,
    who: "Makers, boutiques, community groups, non-profits and city agencies wanting a 10' × 10'.",
  },
  {
    label: "Food booths",
    href: "/food-booths",
    here: false,
    who: "Restaurants, trucks and carts feeding a food court of around thirty vendors.",
  },
  {
    label: "Performers",
    href: "/performers",
    here: false,
    who: "Dance, music, song, martial arts and acrobatics groups for the Main Stage and the Dragon Stage.",
  },
  {
    label: "Sponsors",
    href: "/sponsors",
    here: false,
    who: "Companies, foundations and businesses who can help keep admission free for everyone.",
  },
  {
    label: "Dragon boat teams",
    href: "/dragon-boats",
    here: false,
    who: "Crews of eight — a drummer, six paddlers and a steersman — racing head to head on the lake.",
  },
] as const;

/**
 * The work, described the way it actually is.
 *
 * Written so that somebody can read a card and decide they do not want that
 * job. A volunteer who turns up expecting to greet visitors and spends four
 * hours moving tables does not come back the following year, and the festival
 * runs on people who come back.
 */
const work = [
  {
    title: "Information booths",
    body: "Standing behind a table with a map, telling people where the toilets are, where the 5K starts, which stage a group is on next and whether the swan boats are running. It sounds like the easy one. It needs the most patience of any of them.",
  },
  {
    title: "Set-up and tear-down",
    body: "Canopies, tables, chairs, barriers, signage — carried, placed, and at the end of Sunday carried back again. It is early, it is physical, and it is the reason the gates open on time.",
  },
  {
    title: "The children's area",
    body: "Crafts, face painting, the jumpers and the rock wall. You are keeping an eye on small people while their parents get ten minutes, which is a real job and needs someone who likes doing it.",
  },
  {
    title: "Stage support",
    body: "Looking after performers at the Main Stage and the Dragon Stage: finding a group when their slot comes up, keeping the running order moving, carrying a drum that took four people to unload.",
  },
  {
    title: "The food court",
    body: "Around thirty booths, trucks and carts, and a seating area that has to keep turning over. Directing queues, clearing tables, pointing people at the shortest line.",
  },
  {
    title: "Keeping the grounds clean",
    body: "Bins, recycling and litter picking, all weekend. Echo Park Lake is a public park on Monday morning, and how it looks then is decided by who walks the paths on Sunday night.",
  },
] as const;

export default function GetInvolvedPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        {/* A low warm wash, as if thrown from the lake at the bottom right. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(88% 58% at 18% 4%, rgba(232,184,87,0.17) 0%, rgba(240,168,186,0.06) 46%, rgba(11,10,15,0) 76%)",
          }}
        />

        <Container>
          <Reveal delay={0.05}>
            <Badge tone="gold">
              {site.editionOrdinal} festival · {site.dates.display}
            </Badge>
          </Reveal>

          <h1 className="mt-7 max-w-[15ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.12}
              lines={[
                <span key="1" className="block">
                  The festival runs
                </span>,
                <span key="2" className="block">
                  on people who <em className="text-gradient-gold not-italic">turn&nbsp;up</em>
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.4} y={16}>
            <p className="text-fg/85 mt-8 max-w-[60ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Two stages, a food court, a children&rsquo;s area, dragon boats on the lake and{" "}
              {site.attendance}. Almost all of it is put up, run and taken down again by volunteers
              working alongside City staff. There is a job for anyone who turns up — you do not need
              experience, equipment, or to know a single person there.
            </p>
          </Reveal>

          <Reveal delay={0.52} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#volunteer" size="lg">
                Volunteer for a shift
              </ButtonLink>
              <ButtonLink href="#ways" variant="outline" size="lg">
                Other ways to take part
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.64} y={12}>
            <dl className="border-line mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Shifts", "Four hours, 7am to 10pm, both days"],
                ["From age", "14, with a guardian's signature under 18"],
                ["Groups", "Welcome — tell us how many you are"],
                ["Cost", "Nothing. It is a free festival either side of the table"],
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
      <Section tone="paper" id="ways">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Six ways in"
              title="Find the one that is yours"
              lede="Each of these has its own application, its own committee and its own deadline in the spring. Volunteering is the only one you can do from this page."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <Card
                  key={route.href}
                  as="li"
                  className="hover:border-line-strong relative flex h-full flex-col"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-[1.4rem] leading-snug">
                      {/*
                        The whole card is the hit target: the pseudo-element
                        stretches the anchor over it, so there is still exactly
                        one focusable thing per card for a keyboard.
                      */}
                      <Link
                        href={route.href}
                        className="rounded after:absolute after:inset-0 after:content-['']"
                      >
                        {route.label}
                      </Link>
                    </h3>
                    {route.here ? <span className="eyebrow text-gold">Below</span> : null}
                  </div>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{route.who}</p>
                </Card>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What volunteering is"
              title="Six jobs, and none of them are glamorous"
              lede="Read these before you sign up. The festival would rather you chose the one you actually want than discovered on Saturday morning that you had picked wrong."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {work.map((job, index) => (
              <Reveal key={job.title} delay={0.04 * index}>
                <Card className="h-full">
                  <h3 className="text-[1.35rem] leading-snug">{job.title}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{job.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24}>
            <p className="text-fg-muted mt-10 max-w-[62ch] leading-relaxed">
              Coordinators ask what you would rather do, and then put you where the gap is. In a
              public park with {site.attendance} moving through it, the gap moves.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="volunteer" className="pt-4 sm:pt-6">
        <Container size="narrow">
          <Reveal>
            <Rule className="mb-14" />
            <SectionHeading
              eyebrow="Volunteer"
              title="Pick a shift"
              lede="Shifts run 7–11am, 11am–3pm, 3–7pm and 7–10pm, on both the Saturday and the Sunday. Take one or take all eight. There is no minimum beyond turning up for the one you chose."
            />
          </Reveal>

          <Reveal delay={0.06} className="mt-10">
            <dl className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <dt className="eyebrow">Age</dt>
                <dd className="text-[15px] leading-relaxed">
                  From 14. Anyone under 18 needs a parent or guardian&rsquo;s signature before their
                  first shift.
                </dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="eyebrow">Groups</dt>
                <dd className="text-[15px] leading-relaxed">
                  Clubs, classes, workplaces and congregations are all welcome. Say how many you are
                  bringing so the committee can plan the assignments around you.
                </dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="eyebrow">Questions</dt>
                <dd className="text-[15px] leading-relaxed">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-gold rounded underline underline-offset-4 transition-colors duration-200"
                  >
                    {site.contact.email}
                  </a>{" "}
                  reaches the committee.
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.12} className="mt-12">
            <VolunteerForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
