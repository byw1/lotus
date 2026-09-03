import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { PerformerForm } from "./PerformerForm";

export const metadata: Metadata = {
  title: "Perform at the Festival",
  description:
    "Dancers, musicians, singers, martial artists and acrobats on two stages at the Los Angeles " +
    "Lotus Festival. Slots of 5 to 30 minutes on a 40' × 30' stage. Performing is a volunteer " +
    "commitment and performers are unpaid. How to apply.",
};

/**
 * The two stages, kept as data because the cards and the form hint have to
 * agree about the size of them. A group turning up to a stage smaller than
 * they rehearsed for is a bad afternoon for everybody.
 */
const stages = [
  {
    name: "The Main Stage",
    alsoCalled: "Also called the Lotus Stage",
    body: "The larger of the two, and where most of the program runs across both days. Dance companies, ensembles, choirs, lion dance and martial arts schools. The opening ceremony on Saturday at noon happens here, and so does the closing ceremony on Sunday evening.",
  },
  {
    name: "The Dragon Stage",
    alsoCalled: "The children's stage",
    body: "Programmed for children and the families watching them: cultural dance, storytelling, music and things young performers can take part in. Groups of school age are usually happier here, in front of an audience sitting close.",
  },
] as const;

/**
 * The plain facts of the commitment, said before the form rather than after
 * it. Someone plans their summer around a festival date; finding out in June
 * that the slot is unpaid, or is at a time they cannot make, is a disservice
 * this page can avoid by two minutes of honesty.
 */
const commitments: readonly { title: string; body: string; emphasis?: boolean }[] = [
  {
    title: "This is a volunteer commitment",
    body: "Performers at the Lotus Festival are unpaid. There is no fee, no stipend and no travel budget — the festival is free to attend and the program runs on people who want to be part of it. Every group on both stages is there on the same terms.",
    emphasis: true,
  },
  {
    title: "The committee sets the times",
    body: "You tell us which days you can make; the Lotus Committee builds the schedule across both stages and both days and tells you your slot. It is not first come, first served, and it is not a booking you make yourself.",
  },
  {
    title: "Selected groups are printed in the program",
    body: "The program booklet lists the acts on both stages, so the name you give on the application is the name that appears — and the one thousands of people read while they wait for you.",
  },
  {
    title: "Say your name the way it sounds",
    body: "The application asks for phonetic pronunciations. Write them for anything an announcer could get wrong: your group's name, a soloist's name, the name of the piece. An MC reading a name correctly in front of a crowd is a small thing that is worth doing properly.",
  },
] as const;

/** The shape of the season, without dates the festival has not set. */
const timeline = [
  {
    when: "Spring",
    what: "Applications",
    body: "Send yours as early as you can. The application window has run through the spring, and the committee reads them as they arrive.",
  },
  {
    when: "Around May",
    what: "Selections",
    body: "The committee decides who goes on which stage and writes to the groups it has chosen.",
  },
  {
    when: "Around June",
    what: "Schedules",
    body: "Final performance times reach selected groups, along with load-in, parking and where to be.",
  },
  {
    when: "July",
    what: "The festival",
    body: `Two days at ${site.venue.name}, midday into the evening, on the two stages.`,
  },
] as const;

export default function PerformersPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        {/* Stage light, thrown from the left, behind the type only. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(96% 60% at 14% 2%, rgba(207,228,246,0.88) 0%, rgba(252,225,235,0.31) 44%, rgba(255,255,255,0) 74%)",
          }}
        />

        <Container>
          <Reveal delay={0.05}>
            <Badge tone="gold">Two stages · {site.dates.display}</Badge>
          </Reveal>

          <h1 className="mt-7 max-w-[15ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.12}
              lines={[
                <span key="1" className="block">
                  <em className="text-gradient-lotus not-italic">Perform</em> at the
                </span>,
                <span key="2" className="block">
                  Lotus Festival
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.4} y={16}>
            <p className="text-fg/85 mt-8 max-w-[56ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Dancers, musicians, singers, martial artists and acrobats, on two stages beside the
              lake, across two days in July. The audience is whoever came to Echo Park that
              afternoon — {site.attendance}, most of them there for free and staying for hours.
            </p>
          </Reveal>

          <Reveal delay={0.52} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#apply" size="lg">
                Apply to perform
              </ButtonLink>
              <ButtonLink href={`mailto:${site.contact.email}`} variant="outline" size="lg">
                Ask the entertainment committee
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.64} y={12}>
            <dl className="border-line mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["The stages", "Main Stage and Dragon Stage · 40' × 30' performing area"],
                ["A slot", "5 to 30 minutes, set-up included"],
                ["Who can apply", "Any act; Asian and Pacific Islander preferred"],
                ["What it pays", "Nothing — performing here is volunteering"],
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
            <SectionHeading eyebrow="From the stage" title="You go on, and the park turns around" />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
              <p>
                It is a long, hot afternoon by the water. People are eating, queuing for the swan
                boats, waiting for a heat to finish. Then the MC says your name, and a few hundred
                of them turn their chairs toward the stage and stay for as long as you are on it.
              </p>
              <p>
                The program moves quickly — a dance company, then a jazz ensemble, then a kung fu
                school, then a choir — and it has been doing that since 1972. Nobody has to buy a
                ticket to watch any of it, which is the whole reason the crowd is as mixed as it is.
              </p>
              <p>
                Most of the groups on both stages are schools, community associations, temples,
                studios and families. Some have toured. Some have never played outside a rehearsal
                room. Both belong on the program.
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
              eyebrow="The stages"
              title="Two stages, both 40 by 30 feet"
              lede="Say on the application which you think you suit and the committee will place you. The measurement is the same for both, so you can rehearse to it."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {stages.map((stage, index) => (
              <Reveal key={stage.name} delay={0.06 * index}>
                <Card className="h-full">
                  <p className="eyebrow">{stage.alsoCalled}</p>
                  <h3 className="mt-3 text-[1.5rem] leading-snug">{stage.name}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{stage.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <div className="border-line mt-4 rounded-2xl border p-6 sm:p-7">
              <h3 className="text-[1.35rem] leading-snug">A slot is 5 to 30 minutes</h3>
              <p className="text-fg-muted mt-3 max-w-[64ch] text-[15px] leading-relaxed">
                In five-minute steps, and set-up is inside the slot rather than before it. A group
                that can walk on and start is easier to place well than one that needs half its time
                to plug in — worth knowing when you choose a length on the form.
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
              eyebrow="Who performs"
              title="It does not have to be Asian or Pacific Islander"
              lede="It is preferred, and it is most of the program. But the festival is a Los Angeles festival, and the committee has never read the preference as a rule."
            />
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">What the committee looks for</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  Dance, instrumental music, song, martial arts and acrobatics, and things that fit
                  none of those. Across a weekend the program has to hold the attention of a crowd
                  that is passing through, so range matters as much as polish.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.06}>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">A video helps</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  A link to anything that shows what you do — a phone recording of a rehearsal is
                  genuinely enough. It is encouraged and it is not required, and groups are selected
                  every year without one.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border-gold/30 bg-gold/8 mt-4 rounded-2xl border p-6 sm:p-7">
              <h3 className="text-[1.35rem] leading-snug">
                The {site.year} festival honors{" "}
                {/* The character is an accent on the sentence, not decoration.
                    `lang` is what gets it the CJK face and the right voice in a
                    screen reader. */}
                <span lang="zh-Hans">{site.honoredCountry.localName}</span>,{" "}
                {site.honoredCountry.name}
              </h3>
              <p className="text-fg-muted mt-3 max-w-[64ch] text-[15px] leading-relaxed">
                A different culture is honored each year, and the {site.honoredCountry.adjective}{" "}
                program will be a large part of the {site.editionOrdinal} festival. It is not the
                whole of it. The stages carry work from across Asia and the Pacific, and from
                elsewhere, every year — apply whichever tradition you come from.
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
              eyebrow="Before you apply"
              title="Four things worth knowing first"
              lede="None of this is buried in a packet, because someone reading this page is deciding what to do with a weekend next summer."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {commitments.map((item, index) => (
              <Reveal key={item.title} delay={0.05 * index}>
                <Card className={item.emphasis ? "border-gold/30 bg-gold/8 h-full" : "h-full"}>
                  <h3 className="text-[1.35rem] leading-snug">{item.title}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{item.body}</p>
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
              eyebrow="The season"
              title="How a year of this runs"
              lede={`The ${site.editionOrdinal} festival is in ${site.dates.display}; ${site.dates.detail.toLowerCase()}. The shape below is how recent years have gone, so you can plan around it — the exact dates reach applicants directly.`}
            />
          </Reveal>

          {/* One Reveal around the whole list rather than one per step: an
              animated wrapper between <ol> and <li> would break the list for a
              screen reader, and `display:contents` hides the element from the
              accessibility tree in some browsers rather than repairing it. */}
          <Reveal delay={0.08}>
            <ol className="border-line mt-12 grid gap-x-8 gap-y-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {timeline.map((step) => (
                <li key={step.what} className="flex flex-col gap-2">
                  <p className="eyebrow">{step.when}</p>
                  <h3 className="text-[1.2rem] leading-snug">{step.what}</h3>
                  <p className="text-fg-muted text-[15px] leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="apply" className="pt-4 sm:pt-6">
        <Container size="narrow">
          <Reveal>
            <Rule className="mb-14" />
            <SectionHeading
              eyebrow="Apply to perform"
              title="Tell the committee what you do"
              lede="One form, and no payment of any kind at any stage. If something does not apply to you, leave it — a short honest application is better than a padded one."
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <PerformerForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
