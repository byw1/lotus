import Link from "next/link";

import { Lotus } from "@/components/lotus/Lotus";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Container } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

/**
 * The hero of the real homepage.
 *
 * The coming-soon page sinks the flower at the bottom of a centred column, so
 * this one deliberately does the opposite: the type runs down the left, and
 * the lotus is pushed off the right edge at close to twice the size, so what
 * you see is a crop rather than a specimen. Someone who saw the holding page
 * in March should not think they have landed back on it in July.
 *
 * The two scrims are the same contrast rule as the holding page, rotated. No
 * body text is ever asked to sit on a lit petal: below `lg` the flower is
 * pushed into the bottom-right corner and the scrim runs top to bottom; from
 * `lg` up the flower moves to the right of the text and the scrim runs left to
 * right. One gradient cannot do both jobs, and a single compromise gradient
 * either greys out the flower or leaves the lede at 3:1.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="home-title" className="bg-bg relative isolate overflow-hidden">
      {/* Warm light thrown from where the flower sits, behind the canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(62% 52% at 78% 58%, rgba(240,168,186,0.26) 0%, rgba(232,184,87,0.12) 42%, rgba(11,10,15,0) 74%)",
        }}
      />

      <Lotus className="pointer-events-none absolute right-[-46%] bottom-[-14%] -z-20 h-[62vh] w-[125vw] sm:right-[-32%] sm:h-[74vh] sm:w-[92vw] lg:top-1/2 lg:right-[-15%] lg:bottom-auto lg:h-[108vh] lg:w-[64vw] lg:-translate-y-1/2" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,10,15,0.96) 0%, rgba(11,10,15,0.92) 40%, rgba(11,10,15,0.74) 62%, rgba(11,10,15,0.34) 84%, rgba(11,10,15,0.08) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(11,10,15,0.97) 0%, rgba(11,10,15,0.93) 32%, rgba(11,10,15,0.72) 50%, rgba(11,10,15,0.26) 68%, rgba(11,10,15,0) 86%)",
        }}
      />

      <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-16 pb-36 sm:min-h-[calc(100svh-4.5rem)] sm:pt-20 sm:pb-40 lg:py-28">
        <div className="max-w-[34rem] lg:max-w-[40rem]">
          <Reveal delay={0.05}>
            {/* Vermilion is held back for one thing on this site: the culture
                honored this edition. It appears here and nowhere else above. */}
            <Badge tone="vermilion">
              {site.editionOrdinal} annual · Honoring {site.honoredCountry.name}
            </Badge>
          </Reveal>

          <h1
            id="home-title"
            className="mt-7 text-[clamp(2.7rem,7.6vw,5.5rem)] leading-[0.94] tracking-[-0.03em]"
          >
            <LineReveal
              delay={0.14}
              lines={[
                <span key="1" className="block">
                  Los Angeles
                </span>,
                <span key="2" className="block">
                  <em className="text-gradient-gold not-italic">Lotus</em> Festival
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.44} y={16}>
            <p className="text-fg/85 mt-7 max-w-[46ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.55]">
              Two days around the water at {site.venue.name}, honoring the people and culture of{" "}
              {site.honoredCountry.name}. Admission is free, as it has been since 1972.
            </p>
          </Reveal>

          <Reveal delay={0.56} y={16} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/festival" size="lg">
              What to expect
            </ButtonLink>
            <ButtonLink href="/get-involved" variant="glass" size="lg">
              Get involved
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.7} y={12} className="mt-14 lg:mt-20">
          <dl className="text-fg-muted flex flex-col gap-3 text-[13.5px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3">
            <div className="flex items-baseline gap-2">
              <dt className="text-fg-subtle">When</dt>
              <dd className="text-fg/90">
                <time dateTime="2027-07">{site.dates.display}</time> · {site.dates.detail}
              </dd>
            </div>
            <span aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
            <div className="flex items-baseline gap-2">
              <dt className="text-fg-subtle">Where</dt>
              <dd className="text-fg/90">
                <Link
                  href={site.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold rounded underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-current"
                >
                  {site.venue.name}, {site.venue.street}
                </Link>
              </dd>
            </div>
            <span aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
            <div className="flex items-baseline gap-2">
              <dt className="text-fg-subtle">Admission</dt>
              <dd className="text-fg/90">Free, no ticket</dd>
            </div>
          </dl>
        </Reveal>
      </Container>

      {/* Closes the ink band cleanly against the porcelain section below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28"
        style={{ background: "linear-gradient(to top, #0b0a0f 0%, rgba(11,10,15,0) 100%)" }}
      />
    </section>
  );
}
