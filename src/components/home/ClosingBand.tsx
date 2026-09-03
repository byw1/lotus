import Link from "next/link";

import { NewsletterForm } from "@/components/coming-soon/NewsletterForm";
import { Container, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

/**
 * The last band: one thing to do, and the answers to the five things people
 * email to ask.
 *
 * The newsletter form is the coming-soon page's, unchanged. It is built for a
 * dark ground — its capsule is a hard-coded near-black so placeholder text
 * clears 4.5:1 over the lit petals — so this band stays on ink and takes the
 * sunken background instead, which separates it from the section above
 * without asking the form to work on porcelain, where it would render dark
 * text on a dark capsule.
 *
 * There is still no countdown. The dates are not announced, and a clock
 * counting down to a date nobody has set is a lie with a nice animation.
 */
const details = [
  {
    term: "When",
    body: (
      <>
        <time dateTime="2027-07">{site.dates.display}</time>. {site.dates.detail}.{" "}
        {site.dates.hours}.
      </>
    ),
  },
  {
    term: "Where",
    body: (
      <>
        {site.venue.name}, {site.venue.address}.{" "}
        <Link
          href={site.venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lake rounded underline underline-offset-4 transition-colors duration-200"
        >
          Open in maps
        </Link>
        .
      </>
    ),
  },
  { term: "Admission", body: site.admission.note },
  {
    term: "Getting there",
    body: "Street parking around the lake is limited and fills early. Free shuttles run from off-site lots through both days; which lots are in use changes year to year and is published shortly before the festival.",
  },
  {
    term: "Asking something else",
    body: (
      <>
        Write to{" "}
        <a
          href={`mailto:${site.contact.email}`}
          className="hover:text-lake rounded underline underline-offset-4 transition-colors duration-200"
        >
          {site.contact.email}
        </a>
        , or find the festival at{" "}
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lake rounded underline underline-offset-4 transition-colors duration-200"
        >
          {site.social.handle}
        </a>
        .
      </>
    ),
  },
];

export function ClosingBand() {
  return (
    <Section
      aria-label="Stay in touch, and the practical details"
      className="bg-bg-sunken border-line relative isolate overflow-hidden border-t"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 58% at 18% 0%, rgba(207,228,246,0.68) 0%, rgba(252,225,235,0.36) 42%, rgba(255,255,255,0) 76%)",
        }}
      />

      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.08]">
                Hear when the dates are set
              </h2>
              <p className="text-fg-muted mt-5 max-w-[46ch] leading-relaxed">
                The {site.year} dates are not announced yet. When they are, this list is told first
                — then the program, the shuttle stops and the application deadlines. A handful of
                emails a year, and nothing else.
              </p>
              <div className="mt-8">
                <NewsletterForm />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <dl className="border-line border-t">
                {details.map((detail) => (
                  <div
                    key={detail.term}
                    className="border-line grid gap-2 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-6"
                  >
                    <dt className="text-fg text-[15px]">{detail.term}</dt>
                    <dd className="text-fg-muted max-w-[58ch] text-[15px] leading-relaxed">
                      {detail.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
