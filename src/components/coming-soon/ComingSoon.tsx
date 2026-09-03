import Link from "next/link";

import { Lotus } from "@/components/lotus/Lotus";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { NewsletterForm } from "./NewsletterForm";

/**
 * The public homepage until the 46th festival's site goes live.
 *
 * The page is built in three horizontal bands, and the reason is contrast
 * rather than taste. Body text over a lit petal cannot meet WCAG AA at any
 * scrim opacity that still leaves the flower looking like a flower — so the
 * page never asks it to:
 *
 *   top     type only, over near-black
 *   middle  the flower alone, lit, with nothing written on it
 *   bottom  a solid band carrying the practical details
 *
 * The flower is sunk far enough that its golden heart falls below the fold.
 * What rises into frame is the outer petals: a horizon lit from underneath,
 * which is roughly what Echo Park Lake looks like on the Saturday evening of
 * the festival.
 *
 * There is deliberately no countdown and no "2,847 people have joined". The
 * 2027 dates have not been announced and this list is empty; inventing either
 * would be a civic institution lying to make a page feel busier.
 */
export function ComingSoon() {
  return (
    <main id="main" className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* A wash of warm light behind everything, as if thrown by the flower. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(120% 76% at 50% 92%, rgba(224,112,143,0.26) 0%, rgba(232,184,87,0.11) 34%, rgba(11,10,15,0) 70%)",
        }}
      />

      <Lotus className="pointer-events-none absolute inset-x-0 bottom-[-38vh] -z-20 h-[96vh] w-full sm:bottom-[-45vh] sm:h-[116vh]" />

      {/* Holds the top of the page down so the type has a clean ground. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,10,15,0.94) 0%, rgba(11,10,15,0.88) 44%, rgba(11,10,15,0.66) 60%, rgba(11,10,15,0.4) 71%, rgba(11,10,15,0.04) 82%, rgba(11,10,15,0) 100%)",
        }}
      />
      {/* An ellipse behind the headline, so it never sits on a bright petal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 40% at 50% 36%, rgba(11,10,15,0.7) 0%, rgba(11,10,15,0.28) 60%, rgba(11,10,15,0) 100%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-7 sm:px-8 sm:py-9">
        <header className="flex items-center justify-between gap-6">
          <p className="text-[13px] leading-tight font-medium">
            <span className="block">Los Angeles</span>
            <span className="text-fg-muted block">Lotus Festival</span>
          </p>
          <Link
            href="/team"
            className="text-fg-subtle hover:text-fg rounded-full text-[13px] transition-colors duration-200"
          >
            Team preview
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center pt-10 pb-20 text-center sm:pt-4 sm:pb-28">
          <Reveal delay={0.05}>
            <p className="border-gold/30 bg-gold/8 text-gold inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-medium tracking-[0.16em] uppercase backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="bg-gold/90 size-1.5 [animation:lf-breathe_3.5s_ease-in-out_infinite] rounded-full"
              />
              Coming soon
            </p>
          </Reveal>

          <h1 className="mt-7 text-[clamp(2.85rem,9.4vw,7.5rem)] leading-[0.88] tracking-[-0.035em]">
            <LineReveal
              delay={0.15}
              lines={[
                <span key="1" className="block">
                  The <em className="text-gradient-gold not-italic">46th</em>
                </span>,
                <span key="2" className="block">
                  Lotus Festival
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.45} y={16}>
            <p className="text-fg/85 mt-7 max-w-[44ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              Two days at Echo Park Lake in {site.dates.display}, honoring the people and culture of{" "}
              {site.honoredCountry.name}. Free, as it has been since 1972.
            </p>
          </Reveal>

          <Reveal delay={0.58} y={16} className="mt-9 flex w-full justify-center">
            <NewsletterForm />
          </Reveal>
        </div>
      </div>

      {/*
        The bottom band. Everything written here sits on the page's own solid
        background rather than on a translucent panel, with a short fade above
        it — so the flower can stay fully lit right up to the edge of the bar
        instead of being dimmed across the whole lower half to make room for
        two lines of small print.
      */}
      <div className="bg-bg relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-full h-24"
          style={{ background: "linear-gradient(to top, #0b0a0f 0%, rgba(11,10,15,0) 100%)" }}
        />

        <div className="mx-auto w-full max-w-6xl px-6 pb-7 sm:px-8 sm:pb-9">
          <Reveal delay={0.72} y={12}>
            <dl className="text-fg-muted flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-6 text-[13px]">
              <div>
                <dt className="sr-only">When</dt>
                <dd>
                  <time dateTime="2027-07">{site.dates.display}</time> · {site.dates.detail}
                </dd>
              </div>
              <span aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
              <div>
                <dt className="sr-only">Where</dt>
                <dd>{site.venue.name}, Los Angeles</dd>
              </div>
              <span aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
              <div>
                <dt className="sr-only">Admission</dt>
                <dd>Free admission</dd>
              </div>
            </dl>
          </Reveal>

          <footer className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
                className="text-fg-muted hover:text-fg rounded transition-colors duration-200"
              >
                {site.contact.email}
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg rounded transition-colors duration-200"
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
