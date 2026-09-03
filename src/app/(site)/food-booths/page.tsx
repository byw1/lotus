import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { FoodBoothForm } from "./FoodBoothForm";

export const metadata: Metadata = {
  title: "Food Booths, Trucks & Carts",
  description:
    "Apply to the Los Angeles Lotus Festival food court. Booth, truck and cart fee tiers, what a 10' by 10' " +
    "includes, the LA County temporary food facility permit and LAFD special permit you will need, and the " +
    "festival's no-Styrofoam, no-plastic rules.",
};

/**
 * The three ways to trade in the food court, with the fee tiers as they stood
 * in recent cycles.
 *
 * Booth pricing is by location rather than by size — every booth is the same
 * 10' × 10' — which is not obvious from a fee table alone, so each tier says
 * what you are actually paying for.
 */
const serviceTypes = [
  {
    name: "A food booth",
    lede: "A 10' × 10' in the food court, put up for you.",
    tiers: [
      { label: "Premium location", price: "$1,400" },
      { label: "Corner location", price: "$1,200" },
      { label: "Regular location", price: "$1,000" },
    ],
    body: "Three prices for one space. What changes is where the committee puts you — the difference between a corner with two open sides and a spot midway along a row.",
  },
  {
    name: "A food truck",
    lede: "Your own truck, parked in the food area.",
    tiers: [{ label: "Per truck", price: "$1,000" }],
    body: "Recent cycles capped trucks at roughly 7 feet by 14 feet. Measure yours before you apply; the food court is laid out to the foot and a truck that does not fit cannot be squeezed in on the day.",
  },
  {
    name: "A food cart",
    lede: "Shave ice, fruit, drinks, anything served from a cart.",
    tiers: [{ label: "Per cart", price: "$600" }],
    body: "Recent cycles capped carts at about 120 square feet. The smallest way into the food court, and the one that suits a single dish served fast.",
  },
] as const;

/** What arrives before you do, and what the festival keeps running around you. */
const provided = [
  {
    title: "The booth itself",
    body: "A 10' × 10' space with a food service canopy over it, one table, two chairs, one light and one 5-amp plug. The committee sets every booth location.",
  },
  {
    title: "Parking for one vehicle",
    body: "Near the food area, for one vehicle per booth, so your restock is not a walk across the park.",
  },
  {
    title: "Seating for your customers",
    body: "The food court has its own shared seating. You feed people; you do not have to find them somewhere to sit.",
  },
  {
    title: "Cleaning, trash and recycling",
    body: "Collected and sorted through both days. Your own equipment comes down each night, and the festival is not liable for anything left out.",
  },
] as const;

/**
 * The four attachments an application is not complete without.
 *
 * This is the section of the whole site most likely to save someone a wasted
 * spring, so it is written as a numbered list with the two permits first —
 * they are the ones with a lead time measured in weeks.
 */
const paperwork = [
  {
    title: "An LA County temporary food facility permit",
    body: "Los Angeles County Environmental Health issues these for community events, and the festival cannot waive one or apply on your behalf. The form is submitted well in advance — recent guidance was thirty days ahead, with a higher fee inside two weeks. If you already hold a health permit, proof of it goes in instead.",
  },
  {
    title: "An LAFD special permit",
    body: "The Los Angeles Fire Department permits open flame, propane and cooking equipment in a public park. Every booth working with heat needs one, and fire code compliance is checked on the grounds.",
  },
  {
    title: "A photograph of your set-up",
    body: "Your booth, truck or cart as it actually looks when it is trading. It is how the committee checks that what you are bringing fits the space and the layout.",
  },
  {
    title: "A full menu, with prices",
    body: "Every item you intend to sell and what you will charge for it. You may not sell anything that is not on it, and prices are expected to be fair for a free public festival.",
  },
] as const;

/** Months, not dates. The 2027 calendar is not published. */
const timeline = [
  {
    when: "Spring",
    title: "Applications close",
    body: "Recent cycles took food applications in the first week of April — with the permits, the photograph and the priced menu attached. Start the county paperwork before you start the application; it is the long pole.",
  },
  {
    when: "May",
    title: "Acceptances go out",
    body: "Emailed to every applicant. Around thirty vendors make up the food court, and there are always more applications than that.",
  },
  {
    when: "Late May",
    title: "Payment is due",
    body: "From accepted vendors only. Do not send money before you are accepted, and nothing on this page takes a payment.",
  },
  {
    when: "June",
    title: "Load-in details",
    body: "Booth location, unloading window and the parking pass for your one vehicle, about a month before the festival.",
  },
] as const;

export default function FoodBoothsPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        {/* Low warm light, the colour the food court is under by seven. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(100% 62% at 82% 2%, rgba(232,184,87,0.17) 0%, rgba(224,64,43,0.08) 44%, rgba(11,10,15,0) 74%)",
          }}
        />

        <Container>
          <Reveal delay={0.05}>
            <Badge tone="gold">Around 30 vendors in the food court</Badge>
          </Reveal>

          <h1 className="mt-7 max-w-[16ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.12}
              lines={[
                <span key="1" className="block">
                  Cook at the
                </span>,
                <span key="2" className="block">
                  <em className="text-gradient-gold not-italic">food court</em>
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.4} y={16}>
            <p className="text-fg/85 mt-8 max-w-[56ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Booths, trucks and carts, two days beside Echo Park Lake, in front of{" "}
              {site.attendance}. It is a serious weekend of trade and it comes with serious
              paperwork — this page is all of it, before you start.
            </p>
          </Reveal>

          <Reveal delay={0.52} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#apply" size="lg">
                Apply to the food court
              </ButtonLink>
              <ButtonLink href="#paperwork" variant="outline" size="lg">
                See the permits first
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.64} y={12}>
            <dl className="border-line mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Recent booth fees", "$1,000 to $1,400"],
                ["Trucks and carts", "$1,000 and $600"],
                ["On every application", "$200 health permit and handling"],
                ["The festival", `${site.dates.display} · ${site.dates.detail}`],
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
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Booths, trucks and carts"
              title="Three ways in, and what each has cost"
              lede="These are the figures from recent application cycles, given so you can budget roughly. They are not 2027 prices — the fees for the 46th festival are set with the rest of the food packet, and you are told what yours is before anyone asks you to pay."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {serviceTypes.map((type, index) => (
              <Reveal key={type.name} delay={0.05 * index}>
                <Card className="flex h-full flex-col">
                  <h3 className="text-[1.35rem] leading-snug">{type.name}</h3>
                  <p className="text-fg-muted mt-2 text-[15px] leading-snug">{type.lede}</p>

                  <dl className="border-line mt-6 flex flex-col border-t">
                    {type.tiers.map((tier) => (
                      <div
                        key={tier.label}
                        className="border-line flex items-baseline justify-between gap-4 border-b py-3"
                      >
                        <dt className="text-[15px] leading-snug">{tier.label}</dt>
                        <dd className="shrink-0 text-[15px] tabular-nums">{tier.price}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="text-fg-muted mt-5 text-[15px] leading-relaxed">{type.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="border-gold/30 bg-gold/8 mt-4 rounded-2xl border p-6 sm:p-7">
              <h3 className="text-[1.35rem] leading-snug">
                And $200 on top, whichever one you are
              </h3>
              <p className="text-fg-muted mt-3 max-w-[64ch] text-[15px] leading-relaxed">
                A health permit and handling fee of <strong className="text-fg">$200</strong> has
                applied to every food application in recent cycles — booth, truck or cart. It is
                separate from the space fee and it is not the county permit you obtain yourself.
                Budget for both.
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
              eyebrow="What the festival provides"
              title="You bring the kitchen, not the tent"
              lede="The booth is standing when you get there, with the furniture and the power under it. What the festival cannot provide is anything that draws real current — plan your equipment around one 5-amp plug and tell the committee what else you need."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {provided.map((item, index) => (
              <Reveal key={item.title} delay={0.05 * index}>
                <Card className="h-full">
                  <h3 className="text-[1.35rem] leading-snug">{item.title}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-9 max-w-[68ch] text-[15px] leading-relaxed">
              Everything else is yours: staffing for drop-off, set-up, service, clean-up and
              load-out, and every piece of equipment behind your counter. Booths are not sublet or
              shared — bringing another vendor into your space removes you both.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="paperwork">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The part that catches people"
              title="Four things without which an application is not complete"
              lede="Every year applications arrive with the permits missing, and every year those are the ones that run out of time. Two of these take weeks to obtain and neither can be hurried in June. Start them first, and apply while they are in progress."
            />
          </Reveal>

          {/* Numbered because the order is advice, not decoration: the two
              permits have lead times and the other two do not. */}
          <ol className="mt-12 flex flex-col gap-4">
            {paperwork.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={0.05 * index}>
                  <Card className="flex flex-col gap-5 sm:flex-row sm:gap-7">
                    <p
                      aria-hidden="true"
                      className="text-gold/70 shrink-0 text-[2rem] leading-none tabular-nums"
                    >
                      {index + 1}
                    </p>
                    <div>
                      <h3 className="text-[1.35rem] leading-snug">{item.title}</h3>
                      <p className="text-fg-muted mt-3 max-w-[70ch] text-[15px] leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-9 max-w-[68ch] text-[15px] leading-relaxed">
              You obtain both permits yourself, from the county and from the fire department. The
              festival is the event organizer named on the county form, and the committee will tell
              accepted vendors exactly what to put where. If you are stuck, say so on the
              application — there is a question for it — or write to{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-fg underline decoration-current/35 underline-offset-4 transition-colors duration-200 hover:decoration-current"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden">
        {/* A green wash, used once on the site and used here: the rule below is
            the festival's, it is enforced, and it should not read as filler. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(72% 52% at 50% 0%, rgba(78,157,139,0.14) 0%, rgba(11,10,15,0) 70%)",
          }}
        />

        <Container size="narrow">
          <Reveal>
            <SectionHeading eyebrow="Serving ware" title="No Styrofoam, and nothing plastic" />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
              <p>
                No Styrofoam of any kind, anywhere in the food court. No plastic tableware and no
                plastic straws. Plates, bowls, cups, cutlery and straws all have to be compostable —
                and compostable means genuinely so, not plastic-lined and not bioplastic.
              </p>
              <p>
                Recyclables are sorted rather than tipped into one bin, and the festival collects
                and sorts through both days.
              </p>
              <p className="text-fg-muted">
                This is a rule with a penalty attached, not a preference. It exists because the food
                court sits on the bank of a lake that the City spent years rehabilitating, twenty
                feet from a lotus bed that died back once already and had to be replanted. Source
                your serving ware in the spring, not the week before.
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
              eyebrow="How selection works"
              title="Applying is not the same as getting a booth"
              lede="The food court is about thirty vendors across booths, trucks and carts. More people apply than that, so it is worth knowing how the committee reads what you send."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">The menu is the application</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  Space is limited and the committee tries not to duplicate what is already being
                  sold. Two booths with the same three dishes is a worse afternoon for both of them
                  and for everyone queueing. Being specific about what you cook helps you more than
                  being broad.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.06}>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">Every application is answered</h3>
                <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                  Accepted or not, you hear back by email in the spring. A complete application with
                  its permits attached is read faster than one the committee has to chase, and no
                  application is approved until the paperwork is in.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Rule className="my-14" />
          </Reveal>

          <Reveal delay={0.12}>
            <SectionHeading
              eyebrow="How the spring runs"
              title="Four dates, none of them set yet"
            />
          </Reveal>

          {/* A real <ol>: the order is the point, and the Reveal sits inside
              each item so the list stays a list for a screen reader. */}
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {timeline.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={0.05 * index} className="h-full">
                  <Card className="h-full">
                    <p className="eyebrow">{step.when}</p>
                    <h3 className="mt-3 text-[1.35rem] leading-snug">{step.title}</h3>
                    <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{step.body}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-9 max-w-[68ch] text-[15px] leading-relaxed">
              The {site.editionOrdinal} festival is in {site.dates.display};{" "}
              {site.dates.detail.toLowerCase()}. Selling something other than food? The{" "}
              <Link
                href="/vendors"
                className="text-fg underline decoration-current/35 underline-offset-4 transition-colors duration-200 hover:decoration-current"
              >
                boutique and community booth application
              </Link>{" "}
              is a different form, with a different fee.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="apply" className="pt-4 sm:pt-6">
        <Container size="narrow">
          <Reveal>
            <Rule className="mb-14" />
            <SectionHeading
              eyebrow="Apply to the food court"
              title="Tell the committee what you cook"
              lede="This is an application, not a booking, and it takes no payment. You do not need your permits in hand to send it — say where you are with them. If a booth is offered, the full packet follows by email: the fee, the permit paperwork, your location and your load-in window."
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <FoodBoothForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
