import Link from "next/link";

import { Lotus } from "@/components/lotus/Lotus";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { NewsletterForm } from "./NewsletterForm";

/**
 * The public homepage until the 46th festival's site goes live.
 *
 * The old version of this page was type on black with the flower sunk below
 * the fold as a glow. It looked expensive and it looked like a product launch.
 * This is a free two-day festival that families walk into off the street, so
 * the page is now white and open, and the flower is the whole point of it: big,
 * lit, turning, and sitting on the water in front of you rather than hiding
 * behind a scrim.
 *
 * Type sits above the flower and the practical details sit below it, so
 * nothing has to be read across a moving surface — which is also what lets the
 * flower stay fully lit instead of being dimmed to make room for small print.
 */
export function ComingSoon() {
  return (
    <main id="main" className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* The lake: a soft wash of blue and pink, lightest in the middle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(120% 76% at 50% 108%, #cfe4f6 0%, #e6f1fa 34%, #fdf3f6 62%, #ffffff 100%)",
        }}
      />

      {/*
        The flower fills the hero, and the type sits on top of it.
        
        On the old black page that was impossible — light text on lit petals
        could not meet contrast at any scrim opacity that left the flower
        looking like a flower. Inverting the page inverts that problem: deep
        navy on a pale pink petal measures better than 6:1, so the type can sit
        directly on the flower and the flower can be as big as it deserves.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[24vh] bottom-[-4vh] -z-20 sm:top-[21vh] sm:bottom-[-7vh]"
      >
        <Lotus className="absolute inset-0" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-7 sm:px-8 sm:py-9">
        <header className="flex items-center justify-between gap-6">
          <p className="text-[13px] leading-tight font-semibold">
            <span className="block">Los Angeles</span>
            <span className="text-lake block">Lotus Festival</span>
          </p>
          <Link
            href="/team"
            className="text-fg-muted hover:text-lake rounded-full text-[13px] transition-colors duration-200"
          >
            Team preview
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center pt-6 text-center sm:pt-8">
          <Reveal delay={0.05}>
            <p className="border-lake/25 bg-lake/8 text-lake inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase">
              <span
                aria-hidden="true"
                className="bg-lake size-1.5 [animation:lf-breathe_3.5s_ease-in-out_infinite] rounded-full"
              />
              Coming soon
            </p>
          </Reveal>

          <h1 className="mt-6 text-[clamp(2.6rem,8.2vw,6rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.15}
              lines={[
                <span key="1" className="block">
                  The 46th
                </span>,
                <span key="2" className="block">
                  <em className="text-gradient-lotus not-italic">Lotus</em> Festival
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.42} y={16}>
            <p className="text-fg-muted mt-6 max-w-[50ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Two days at Echo Park Lake in {site.dates.display}, honoring the people and culture of{" "}
              {site.honoredCountry.name}. Free to walk into, and it has been since 1972.
            </p>
          </Reveal>

          {/*
            The signup sits on its own white card rather than straight on the
            flower. Two reasons, and the second is the real one: it reads as
            "this is the thing to do here", and it means the small print under
            the field is never asked to hold up against a petal. Measured on
            bare petals, the privacy link came in at 3.6:1.
          */}
          <Reveal delay={0.55} y={16} className="mt-8 flex w-full justify-center">
            <div className="bg-bg-raised/92 border-line w-full max-w-xl rounded-[1.75rem] border p-4 shadow-[0_2px_6px_rgba(19,41,61,0.04),0_24px_48px_-32px_rgba(19,41,61,0.35)] backdrop-blur-md sm:p-5">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </div>

      {/*
        The practical details sit on the page's own solid ground with a short
        fade above them, so the pond can run right up to the edge of the band
        without anyone having to read a date across a lily pad. Measured: the
        pads put this row at 3.3:1 before the band went in.
      */}
      <div className="bg-bg relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-full h-20"
          style={{
            background:
              "linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 0%, transparent) 100%)",
          }}
        />

        <div className="mx-auto w-full max-w-6xl px-6 pb-7 sm:px-8 sm:pb-9">
          <Reveal delay={0.7} y={12}>
            <dl className="text-fg-muted flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-6 text-[13px]">
              <div>
                <dt className="sr-only">When</dt>
                <dd>
                  <time dateTime="2027-07">{site.dates.display}</time> · {site.dates.detail}
                </dd>
              </div>
              <div aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
              <div>
                <dt className="sr-only">Where</dt>
                <dd>{site.venue.name}, Los Angeles</dd>
              </div>
              <div aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
              <div>
                <dt className="sr-only">Admission</dt>
                <dd className="text-jade font-semibold">Free admission</dd>
              </div>
            </dl>
          </Reveal>

          <footer className="border-line flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-fg-subtle max-w-[56ch] text-[12.5px] leading-relaxed">
              Presented by the City of Los Angeles Department of Recreation and Parks with{" "}
              {site.nonprofit.legalName}, a {site.nonprofit.status}.
            </p>

            <nav
              aria-label="Contact and social"
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]"
            >
              <a
                href={`mailto:${site.contact.email}`}
                className="text-lake hover:text-lake-deep rounded transition-colors duration-200"
              >
                {site.contact.email}
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lake hover:text-lake-deep rounded transition-colors duration-200"
              >
                {site.social.handle}
              </a>
            </nav>
          </footer>
        </div>
      </div>
    </main>
  );
}
