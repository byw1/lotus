import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach the Los Angeles Lotus Festival: the festival email address, Echo Park Lake at " +
    "751 Echo Park Ave, the social accounts, and a general enquiry form. Applications for booths, " +
    "stage slots and sponsorship have their own pages.",
};

/**
 * The applications that have a page of their own.
 *
 * This list sits above the form on purpose. Every enquiry that arrives asking
 * how to apply for a booth is an email a volunteer has to answer with a link,
 * and the answer is better given here for free — which is also what keeps the
 * inbox usable for the questions that genuinely need a person.
 */
const applications = [
  { label: "Volunteering", href: "/get-involved", who: "Shifts across both days, from age 14." },
  {
    label: "A booth or a boutique",
    href: "/vendors",
    who: "Makers, sellers, non-profits, city agencies.",
  },
  {
    label: "A food booth, truck or cart",
    href: "/food-booths",
    who: "Anything cooked or served in the food court.",
  },
  { label: "A stage slot", href: "/performers", who: "The Main Stage and the Dragon Stage." },
  { label: "Sponsorship", href: "/sponsors", who: "Cash and in-kind, at every level." },
  {
    label: "A dragon boat team",
    href: "/dragon-boats",
    who: "Crews of eight, racing on the lake.",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(84% 56% at 74% 2%, rgba(207,228,246,0.78) 0%, rgba(252,225,235,0.26) 48%, rgba(255,255,255,0) 78%)",
          }}
        />

        <Container>
          <h1 className="max-w-[14ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal
              delay={0.08}
              lines={[
                <span key="1" className="block">
                  Reach the
                </span>,
                <span key="2" className="block">
                  <em className="text-gradient-lotus not-italic">festival</em>
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={0.34} y={16}>
            <p className="text-fg/85 mt-8 max-w-[60ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
              The Lotus Festival is run by City staff and a volunteer committee, around their own
              jobs, for a weekend that happens once a year. Email is the fastest way to reach any of
              them, and it is the only way we publish — replies are not instant, particularly in the
              spring when the applications are open.
            </p>
          </Reveal>

          <Reveal delay={0.46} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href={`mailto:${site.contact.email}`} size="lg">
                {site.contact.email}
              </ButtonLink>
              <ButtonLink href="#message" variant="outline" size="lg">
                Use the form instead
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="The details" title="Everything we publish, in one place" />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <Reveal>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">Email</h3>
                <p className="mt-4">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-lake rounded text-[15px] break-words underline underline-offset-4 transition-colors duration-200"
                  >
                    {site.contact.email}
                  </a>
                </p>
                <p className="text-fg-muted mt-4 text-[15px] leading-relaxed">
                  One address for the whole committee — the festival chairs, the stage and food
                  court coordinators, and the volunteer team. Say in the first line what your
                  message is about and it will get to the right desk sooner.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.06}>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">Where it happens</h3>
                <address className="mt-4 text-[15px] leading-relaxed not-italic">
                  {site.venue.name}
                  <br />
                  {site.venue.street}
                  <br />
                  {site.venue.city}, {site.venue.state} {site.venue.zip}
                </address>
                <p className="mt-4">
                  <a
                    href={site.venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lake rounded text-[15px] underline underline-offset-4 transition-colors duration-200"
                  >
                    Open in Google Maps
                  </a>
                </p>
                <p className="text-fg-muted mt-4 text-[15px] leading-relaxed">
                  This is the park, not an office. There is nobody here to take a question outside
                  the two days of the festival itself.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.12}>
              <Card className="h-full">
                <h3 className="text-[1.35rem] leading-snug">Follow along</h3>
                <p className="text-fg-muted mt-4 text-[15px] leading-relaxed">
                  {site.social.handle} on all three. Dates, the program and the call for
                  applications go out here as soon as they are set.
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {(
                    [
                      ["Instagram", site.social.instagram],
                      ["Facebook", site.social.facebook],
                      ["LinkedIn", site.social.linkedin],
                    ] as const
                  ).map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-lake rounded text-[15px] underline underline-offset-4 transition-colors duration-200"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>

          {/*
            Said out loud rather than left as an absence. A missing phone
            number reads as an oversight and sends people hunting for one in
            old programs and on third-party listings, where the numbers they
            find are wrong.
          */}
          <Reveal delay={0.18}>
            <div className="border-line mt-10 grid gap-8 border-t pt-10 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">There is no phone number</h3>
                <p className="text-fg-muted mt-3 max-w-[52ch] text-[15px] leading-relaxed">
                  The festival does not publish one, so nothing on this site claims to be it. If you
                  find a number for the Lotus Festival somewhere else, we cannot vouch for it. Email
                  is genuinely the fastest route, and it is the one the committee watches.
                </p>
              </div>
              <div>
                <h3 className="eyebrow">Who you are writing to</h3>
                <p className="text-fg-muted mt-3 max-w-[52ch] text-[15px] leading-relaxed">
                  The festival is presented by the City of Los Angeles Department of Recreation and
                  Parks with {site.nonprofit.legalName}, a {site.nonprofit.status} (EIN{" "}
                  {site.nonprofit.ein}). Between the two of them, messages are read by people doing
                  this on top of their day.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Before you write"
              title="If you are applying for something, there is a page for it"
              lede="Each of these collects what its committee needs in order to say yes. Sending the same thing as an email means somebody has to write back asking for the rest of it, and you lose a week."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((item) => (
                <Card
                  key={item.href}
                  as="li"
                  className="hover:border-line-strong relative flex h-full flex-col"
                >
                  <h3 className="text-[1.25rem] leading-snug">
                    {/*
                      The whole card is the hit target: the pseudo-element
                      stretches the anchor over it, so there is still exactly
                      one focusable thing per card for a keyboard.
                    */}
                    <Link
                      href={item.href}
                      className="rounded after:absolute after:inset-0 after:content-['']"
                    >
                      {item.label}
                    </Link>
                  </h3>
                  <p className="text-fg-muted mt-2 text-[15px] leading-relaxed">{item.who}</p>
                </Card>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-fg-muted mt-10 max-w-[62ch] leading-relaxed">
              Lost property, press enquiries, questions about accessibility on the day, or anything
              that does not fit one of those — the form below is the right place.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section tone="paper" id="message" className="pt-4 sm:pt-6">
        <Container size="narrow">
          <Reveal>
            <Rule className="mb-14" />
            <SectionHeading
              eyebrow="General enquiry"
              title="Ask us anything else"
              lede="This reaches the same inbox as the email address above. Give it time, and please do not send the same question twice — a duplicate does not move you up the queue, it makes the queue longer."
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <ContactForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
