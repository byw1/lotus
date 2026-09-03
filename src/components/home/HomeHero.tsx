import Link from "next/link";

import { Lotus } from "@/components/lotus/Lotus";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Container } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

/**
 * The hero of the real homepage.
 *
 * The coming-soon page centres the flower behind the type. This one puts the
 * type down the left and the whole flower on the right, on the water, so
 * someone who saw the holding page in March does not think they have landed
 * back on it in July.
 *
 * On a light page the contrast problem that shaped the old dark version is
 * gone — deep navy on a pale petal measures better than 6:1 — so there are no
 * scrims here at all. The flower gets a column of its own on wide screens and
 * sits under the type on narrow ones, where there is no room beside it.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="home-title" className="bg-bg relative isolate overflow-hidden">
      {/* Morning on the lake: blue at the edges, warm where the flower sits. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background: "radial-gradient(90% 78% at 76% 62%, #fbe6ee 0%, #eef4fb 46%, #ffffff 78%)",
        }}
      />

      <Lotus className="pointer-events-none absolute inset-x-0 bottom-[-14%] -z-20 h-[48vh] sm:bottom-[-8%] sm:h-[56vh] lg:top-1/2 lg:right-[-6%] lg:bottom-auto lg:left-auto lg:h-[92vh] lg:w-[58vw] lg:-translate-y-1/2" />

      <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-16 pb-36 sm:min-h-[calc(100svh-4.5rem)] sm:pt-20 sm:pb-40 lg:py-28">
        <div className="max-w-[34rem] lg:max-w-[40rem]">
          <Reveal delay={0.05}>
            {/* Vermilion is held back for one thing on this site: the culture
                honored this edition. It appears here and nowhere else above. */}
            <Badge tone="rose">
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
                  <em className="text-gradient-lotus not-italic">Lotus</em> Festival
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.44} y={16}>
            <p className="text-fg-muted mt-7 max-w-[46ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.55]">
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

        {/*
          On the old dark page this list needed an opaque band under it — the
          labels measured 1.6:1 against a lit petal. Inverting the palette
          removed the problem rather than mitigating it, so the band is gone.

          It does not remove it for free, though. On a narrow screen the flower
          is directly behind this list, and `--fg-muted` on a lit petal measures
          3.9:1 — under AA. So the terms are set in full-strength ink here like
          the definitions, and the label/value distinction is carried by case
          and size instead of by colour. Anything set over the flower has to
          survive the brightest pixel of it.
        */}
        <Reveal delay={0.7} y={12} className="mt-14 lg:mt-20">
          <dl className="text-fg flex flex-col gap-3 text-[13.5px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3">
            <div className="flex items-baseline gap-2.5">
              <dt className="text-fg text-[11px] tracking-[0.12em] uppercase">When</dt>
              <dd className="text-fg">
                <time dateTime="2027-07">{site.dates.display}</time> · {site.dates.detail}
              </dd>
            </div>
            {/*
              A <dl> may only contain <dt>, <dd>, <div> and script-supporting
              elements. A bare <span> here is invalid, and the browser's parser
              quietly relocates it.
            */}
            <div aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
            <div className="flex items-baseline gap-2.5">
              <dt className="text-fg text-[11px] tracking-[0.12em] uppercase">Where</dt>
              <dd className="text-fg">
                <Link
                  href={site.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lake rounded underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-current"
                >
                  {site.venue.name}, {site.venue.street}
                </Link>
              </dd>
            </div>
            <div aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
            <div className="flex items-baseline gap-2.5">
              <dt className="text-fg text-[11px] tracking-[0.12em] uppercase">Admission</dt>
              <dd className="text-fg">Free, no ticket</dd>
            </div>
          </dl>
        </Reveal>
      </Container>

      {/* Settles the wash into the white section below without a hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24"
        style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)" }}
      />
    </section>
  );
}
