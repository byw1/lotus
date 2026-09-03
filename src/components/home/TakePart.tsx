import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Card, Container, Section, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The five things a person can apply for.
 *
 * Each card carries the one fact that decides whether someone applies — what
 * it costs, or that it pays nothing — rather than a line of encouragement. A
 * maker who reads "$500" here and decides against it has been served better
 * than one who reads "join us" and finds the fee three screens into a form.
 *
 * Every figure is from a recent cycle and is labelled as such. 2027 fees are
 * not set, and printing last year's number as this year's is how a festival
 * ends up arguing with a vendor in a car park in July.
 */
const routes = [
  {
    label: "Food booths",
    href: "/food-booths",
    who: "Restaurants, trucks and carts, in a food court of around thirty vendors.",
    detail:
      "A 10' × 10' space with a canopy, a table, two chairs, a light and a 5-amp plug. County health and Fire Department permits are required. Recent booth fees ran from $600 for a cart to $1,400 for a premium location.",
  },
  {
    label: "Vendors & boutiques",
    href: "/vendors",
    who: "Makers, boutiques, community groups, non-profits and city agencies.",
    detail:
      "More than twenty makers sell across the weekend, some of them working in the Lotus Artisan Village. Recent rates were $500 for a business booth and $100 for eco-friendly, non-profit and city booths without sales.",
  },
  {
    label: "Performers",
    href: "/performers",
    who: "Dance, music, song, martial arts and acrobatics, for both stages.",
    detail:
      "Slots run from 5 to 30 minutes including set-up, on a stage 40 feet by 30. Performing is a volunteer commitment: performers are not paid.",
  },
  {
    label: "Sponsors",
    href: "/sponsors",
    who: "Companies, foundations and businesses who can keep the festival free.",
    detail:
      "Packages run from $5,000 to the $50,000 White Lotus title sponsorship, and all of them are customisable. All sponsorship recognition is contingent upon Recreation and Parks Commission approval.",
  },
  {
    label: "Dragon boat teams",
    href: "/dragon-boats",
    who: "Crews from media, corporate, city, community, college and university life.",
    detail:
      "Eight to a boat — a drummer, six paddlers and a steersman — co-ed, with a minimum of four women in every crew. Recent entry fees were $75 for community, college and university teams and $200 for the rest.",
  },
] as const;

export function TakePart() {
  return (
    <Section tone="paper" aria-label="Ways to take part">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Take part"
            title="Apply for a place"
            lede="Applications run on a spring timetable: forms around April, acceptances in May, payment towards the end of May, and load-in details in June. The 2027 dates are not set yet, so nothing here is a deadline — it is the shape of one."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route, index) => (
            <li key={route.href} className="flex">
              <Reveal delay={(index % 3) * 0.07} className="flex w-full">
                <Card className="group hover:border-line-strong hover:bg-surface-strong relative flex w-full flex-col">
                  <h3 className="text-[1.35rem] leading-tight">{route.label}</h3>
                  <p className="text-fg mt-3 text-[15px] leading-relaxed">{route.who}</p>
                  <p className="text-fg-muted mt-3 flex-1 text-[14px] leading-relaxed">
                    {route.detail}
                  </p>
                  <p className="mt-6">
                    <Link
                      href={route.href}
                      className="text-rose hover:text-rose-deep inline-flex items-center gap-1.5 rounded text-[13.5px] font-medium transition-colors duration-200 after:absolute after:inset-0 after:content-['']"
                    >
                      Apply
                      <span className="sr-only"> for {route.label.toLowerCase()}</span>
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

          {/*
            The sixth cell is not a sixth application. Volunteering asks for no
            fee, no permit and no experience, so putting it behind the same
            card treatment as a $1,400 food booth would misrepresent how easy
            it is — and it is the ask the festival most needs answered.
          */}
          <li className="flex">
            <Reveal delay={0.14} className="flex w-full">
              <div className="border-line-strong bg-bg-raised flex w-full flex-col rounded-2xl border border-dashed p-6 sm:p-7">
                <h3 className="text-[1.35rem] leading-tight">Volunteer</h3>
                <p className="text-fg mt-3 text-[15px] leading-relaxed">
                  Anyone from 14 up, with a shift to give.
                </p>
                <p className="text-fg-muted mt-3 flex-1 text-[14px] leading-relaxed">
                  Shifts run 7–11am, 11am–3pm, 3–7pm and 7–10pm on both days. Under-18s need a
                  guardian&rsquo;s signature. Nothing to pay, nothing to bring, nobody to know.
                </p>
                <ButtonLink href="/get-involved" size="sm" className="mt-6 self-start">
                  Volunteer
                </ButtonLink>
              </div>
            </Reveal>
          </li>
        </ul>

        <Reveal delay={0.1}>
          <p className="text-fg-subtle mt-10 max-w-[68ch] text-[13px] leading-relaxed">
            Every figure on this page is from a recent application cycle and is here to give a sense
            of scale. Fees for 2027 are set closer to the date, and are not published here until
            they are.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
