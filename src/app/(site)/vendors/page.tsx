import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { VendorForm } from "./VendorForm";

export const metadata: Metadata = {
  title: "Vendors, Boutiques & Community Booths",
  description:
    "Apply for a booth at the Los Angeles Lotus Festival: boutiques, the Lotus Artisan Village, " +
    "non-profit and community service booths, city agencies and the eco-friendly area. What a 10' by 10' " +
    "includes, what the fee tiers have been, the California seller's permit, and how the spring runs.",
};

/**
 * The areas a vendor can apply into.
 *
 * `tier` is written as prose rather than a number because the two tiers are
 * the whole shape of the fee schedule — selling costs one thing, informing
 * costs another — and a reader deciding whether to apply needs that in the
 * same breath as the description of the area.
 */
const areas = [
  {
    name: "Boutiques",
    tier: "Selling tier",
    body: "Clothing, jewellery, homeware, prints, candles, ceramics — the stalls that run along the paths. Twenty-odd boutiques trade across the weekend, alongside the makers of the Lotus Artisan Village.",
  },
  {
    name: "The Lotus Artisan Village",
    tier: "Selling tier",
    body: "For makers working in front of people. If your craft is something a passer-by can watch happening — carving, henna, crochet, illustration — this is the part of the festival built for it.",
  },
  {
    name: "Community booths",
    tier: "Selling tier",
    body: "A business or a for-profit organization offering a service, taking subscriptions, or signing people up. The same footprint as a boutique, in the community services area.",
  },
  {
    name: "Non-profit community service",
    tier: "Information tier",
    body: "Displays, brochures and referrals from organizations that are not selling anything — the festival runs a health fair among them. If money never changes hands at your table, this is your tier.",
  },
  {
    name: "The eco-friendly area",
    tier: "Information tier",
    body: "Organizations showing people practical ways to live more sustainably in Los Angeles. Information only, no sales.",
  },
  {
    name: "City and government agencies",
    tier: "Information tier",
    body: "Departments and agencies bringing services to a crowd of Angelenos who did not have to go looking for them. A free weekend in a public park reaches people an office never does.",
  },
] as const;

/** Priced separately from the booth, and ordered as they are on the paper form. */
const addOns = [
  { item: "An adjacent 10' × 10' space", price: "$350" },
  { item: "An additional table", price: "$20" },
  { item: "An additional chair", price: "$5" },
  { item: "An additional 5-amp circuit", price: "$20" },
] as const;

/**
 * What arrives in the booth before you do.
 *
 * Kept beside the plan drawing below, which shows the same six things. The
 * drawing is decorative; this list is what a reader actually loads their van
 * against.
 */
const included = [
  "A 10' × 10' space, with its location set by the committee",
  "One canopy over it",
  "One table",
  "Two chairs",
  "One light",
  "One 5-amp plug",
] as const;

/** Nothing here is negotiable, and all of it is easier to read before applying. */
const notPermitted = [
  {
    rule: "No live animals",
    body: "Of any kind, for sale or on display.",
  },
  {
    rule: "No weapons, and no replicas",
    body: "Including decorative and ceremonial pieces. A replica reads as a weapon to everyone who has not picked it up.",
  },
  {
    rule: "No medicinal items or therapeutic services",
    body: "No remedies, supplements, treatments, readings or bodywork, whether sold or offered free.",
  },
  {
    rule: "No subletting",
    body: "The booth is yours and only yours. Sharing it with another seller gets both of you removed.",
  },
] as const;

/**
 * A 10' × 10' seen from above, canopy corners at the four posts.
 *
 * A plan drawing rather than a photograph or a perspective render: the only
 * question a vendor is asking here is what fits, and a plan answers it at a
 * glance. Everything it marks is written out in the list beside it, so nothing
 * is carried by the picture alone.
 */
function BoothPlan({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 320"
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* The canopy footprint. */}
      <rect
        x="26"
        y="26"
        width="268"
        height="268"
        rx="10"
        stroke="var(--gold)"
        strokeOpacity="0.4"
        strokeWidth="1.25"
        fill="var(--gold)"
        fillOpacity="0.04"
      />

      {/* Canopy posts. */}
      {[
        [26, 26],
        [294, 26],
        [26, 294],
        [294, 294],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="var(--gold)" fillOpacity="0.7" />
      ))}

      {/* Dimension lines along the top and the left edge. */}
      <path d="M26 14H294" stroke="var(--gold)" strokeOpacity="0.2" strokeDasharray="3 6" />
      <path d="M14 26V294" stroke="var(--gold)" strokeOpacity="0.2" strokeDasharray="3 6" />

      {/* The table, set back, with the two chairs behind it. */}
      <rect
        x="76"
        y="196"
        width="168"
        height="46"
        rx="7"
        stroke="var(--gold)"
        strokeOpacity="0.55"
        fill="var(--gold)"
        fillOpacity="0.1"
      />
      <rect
        x="106"
        y="256"
        width="42"
        height="30"
        rx="6"
        stroke="var(--gold)"
        strokeOpacity="0.35"
      />
      <rect
        x="172"
        y="256"
        width="42"
        height="30"
        rx="6"
        stroke="var(--gold)"
        strokeOpacity="0.35"
      />

      {/* The light, hung centre-front, with its throw. */}
      <circle cx="160" cy="86" r="26" stroke="var(--gold)" strokeOpacity="0.12" />
      <circle cx="160" cy="86" r="15" stroke="var(--gold)" strokeOpacity="0.24" />
      <circle cx="160" cy="86" r="6" fill="var(--gold)" />

      {/* The single 5-amp plug, back corner, where the cable comes in. */}
      <rect
        x="252"
        y="196"
        width="26"
        height="18"
        rx="4"
        fill="var(--vermilion)"
        fillOpacity="0.75"
      />
    </svg>
  );
}

/**
 * The shape of the season, in months rather than dates.
 *
 * The 2027 calendar has not been published, and a vendor planning a year of
 * markets needs to know roughly when to start far more than they need four
 * invented Fridays.
 */
const timeline = [
  {
    when: "Spring",
    title: "Applications close",
    body: "In recent cycles the vendor application, with a photograph of your set-up, was due in the first week of April. Send it earlier than that if you can — the committee reads them as they arrive.",
  },
  {
    when: "May",
    title: "Acceptances go out",
    body: "Emailed to everyone who applied, accepted or not. Space is limited, so a good application is not a guarantee of a booth.",
  },
  {
    when: "Late May",
    title: "Payment is due",
    body: "Only from vendors who have been accepted. Nobody is asked for money before there is a booth to pay for, and nothing on this page takes a payment.",
  },
  {
    when: "June",
    title: "Load-in details",
    body: "Booth number, unloading window and parking passes, sent to accepted vendors about a month out.",
  },
] as const;

export default function VendorsPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        {/* Warm light from the upper left, the way the paths look at six. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(100% 62% at 16% 2%, rgba(232,184,87,0.17) 0%, rgba(224,112,143,0.07) 44%, rgba(11,10,15,0) 74%)",
          }}
        />

        <Container>
          <Reveal delay={0.05}>
            <Badge tone="gold">Applications for the {site.editionOrdinal} festival</Badge>
          </Reveal>

          <h1 className="mt-7 max-w-[16ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.12}
              lines={[
                <span key="1" className="block">
                  Bring a <em className="text-gradient-gold not-italic">booth</em>
                </span>,
                <span key="2" className="block">
                  to Echo Park
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.4} y={16}>
            <p className="text-fg/85 mt-8 max-w-[56ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Makers, boutiques and artisans; non-profits, city agencies and eco-friendly
              organizations. Two days beside the lotus bed in front of {site.attendance}, most of
              whom came for the afternoon and are in no hurry.
            </p>
          </Reveal>

          <Reveal delay={0.52} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#apply" size="lg">
                Apply for a booth
              </ButtonLink>
              <ButtonLink href="/food-booths" variant="outline" size="lg">
                Selling food? Start here
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.64} y={12}>
            <dl className="border-line mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["The space", "10' × 10', canopy included"],
                ["Recent fees", "$500 selling · $100 information"],
                ["Applications", "Close in the spring"],
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
              eyebrow="Where you would be"
              title="Six ways onto the grounds"
              lede="The festival lays out its booths by what they are for, not by who applied first. Find the row you belong in — it decides your fee, your neighbours, and the kind of conversation you spend two days having."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, index) => (
              <Reveal key={area.name} delay={0.05 * index}>
                <Card className="flex h-full flex-col">
                  <p className="eyebrow">{area.tier}</p>
                  <h3 className="mt-3 text-[1.35rem] leading-snug">{area.name}</h3>
                  <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">{area.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-9 max-w-[68ch] text-[15px] leading-relaxed">
              Packaged food sold from a boutique booth needs a health permit of its own. If that is
              what you have in mind, write to{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-fg underline decoration-current/35 underline-offset-4 transition-colors duration-200 hover:decoration-current"
              >
                {site.contact.email}
              </a>{" "}
              before you apply, and say so on the form. Anything cooked or served to eat on the spot
              belongs in{" "}
              <Link
                href="/food-booths"
                className="text-fg underline decoration-current/35 underline-offset-4 transition-colors duration-200 hover:decoration-current"
              >
                the food court
              </Link>{" "}
              instead.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What it has cost"
              title="Two tiers, and a short list of extras"
              lede="These are the figures from recent application cycles, given here so you can budget roughly. They are not 2027 prices — the fees for the 46th festival are set with the rest of the vendor packet, and you are told what yours is before anyone asks you to pay."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <p className="eyebrow">If you are selling</p>
                <p className="text-gradient-gold mt-4 text-[2.75rem] leading-none">$500</p>
                <p className="text-fg-muted mt-4 text-[15px] leading-relaxed">
                  Businesses and vendors making sales or taking subscriptions, boutiques, artisans,
                  and for-profit community service booths. One 10&#39; × 10&#39; space.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.06}>
              <Card className="h-full">
                <p className="eyebrow">If you are not</p>
                <p className="text-gradient-gold mt-4 text-[2.75rem] leading-none">$100</p>
                <p className="text-fg-muted mt-4 text-[15px] leading-relaxed">
                  Non-profit community service booths, eco-friendly organizations, and city or
                  government agencies — in each case without sales. The same 10&#39; × 10&#39; space
                  and the same package inside it.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border-line mt-4 rounded-2xl border p-6 sm:p-7">
              <h3 className="text-[1.35rem] leading-snug">Add-ons</h3>
              <dl className="mt-5 flex flex-col">
                {addOns.map((addOn) => (
                  <div
                    key={addOn.item}
                    className="border-line flex items-baseline justify-between gap-6 border-t py-3 first:border-t-0 first:pt-0"
                  >
                    <dt className="text-[15px] leading-snug">{addOn.item}</dt>
                    <dd className="text-fg-muted shrink-0 text-[15px] tabular-nums">
                      {addOn.price}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-fg-muted mt-5 max-w-[62ch] text-[15px] leading-relaxed">
                Ask for these on your application rather than on the day. The grounds are laid out
                in advance, and a second space next to your first one only exists if the committee
                knew about it in May.
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
              eyebrow="What is waiting for you"
              title="A 10' by 10', already standing"
              lede="You do not bring a canopy. The festival puts one up, with the furniture and the power under it, and you arrive to a booth rather than to a patch of grass."
            />
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Reveal>
              <BoothPlan className="mx-auto h-auto w-full max-w-[22rem]" />
            </Reveal>

            <Reveal delay={0.06}>
              <div>
                <ul className="flex flex-col">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="border-line border-t py-3.5 text-[15px] leading-snug first:border-t-0 first:pt-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-fg-muted mt-6 text-[15px] leading-relaxed">
                  Along with publicity, general security during festival hours, and unloading carts
                  shared first-come, first-served. Everything you sell has to stay inside the
                  footprint, including anything hung on the sides of the canopy, and the booth comes
                  down each night.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <p className="text-fg-muted mt-10 max-w-[68ch] text-[15px] leading-relaxed">
              One 5-amp plug runs a lamp and a card reader. It does not run a kettle, a fridge or a
              heat gun. If you need more than that, add circuits on the application and say what
              they are for.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden">
        {/* The one section on this page a vendor cannot afford to skim, so it
            gets its own light rather than another row of cards. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(72% 52% at 50% 0%, rgba(224,64,43,0.13) 0%, rgba(11,10,15,0) 70%)",
          }}
        />

        <Container size="narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Before you can sell"
              title={<>The seller&rsquo;s permit is not a formality</>}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
              <p>
                If you are selling anything at the festival, California requires you to hold a
                seller&rsquo;s permit, and a copy of it has to be posted inside your booth where it
                can be seen.
              </p>
              <p>
                The state agency that issues those permits has told the festival committee it will
                have staff on the grounds during the weekend. This is the part people find out about
                too late: without a permit in the booth you will not be allowed to sell, and there
                is nothing the committee can do about it on a Saturday afternoon.
              </p>
              <p className="text-fg-muted">
                Applying for one is free and it is done directly with the state, not through this
                site. Start it early — if you apply in April you will have it long before July.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <Rule className="my-12" />
          </Reveal>

          <Reveal delay={0.14}>
            <h3 className="text-[1.5rem] leading-snug">What may not be sold</h3>
            <dl className="mt-6 flex flex-col">
              {notPermitted.map((entry) => (
                <div key={entry.rule} className="border-line border-t py-5 first:border-t-0">
                  <dt className="text-[1.0625rem] leading-snug">{entry.rule}</dt>
                  <dd className="text-fg-muted mt-2 text-[15px] leading-relaxed">{entry.body}</dd>
                </div>
              ))}
            </dl>
            <p className="text-fg-muted mt-6 text-[15px] leading-relaxed">
              Breaking any of these costs a penalty fee or your place on the grounds, and booth fees
              are not refunded. None of it is aimed at anyone in particular — it is a public park
              with families in it, and these are the terms the City sets for trading there.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How the spring runs"
              title="Four dates, none of them set yet"
              lede="The festival works to the same rhythm every year. The 2027 dates are not published, so what follows is the shape of it — enough to know when to start, and when to expect an answer."
            />
          </Reveal>

          {/* A real <ol>: the order of these four is the whole point, and the
              Reveal wrapper sits inside each item so the list stays a list. */}
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
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
              Announcements go out by email, so the address on your application is the one the
              committee will use. If the {site.editionOrdinal} calendar is published before you
              apply, it will be on this page.
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
              eyebrow="Apply for a booth"
              title="Tell the committee what you make"
              lede="This is an application, not a booking, and it takes no payment. If a booth is offered you will get the full packet by email — the paperwork, the fee, your booth number and your load-in window — and nothing is owed before then."
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <VendorForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
