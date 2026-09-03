import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { faqGroups, faqItems, type FaqItem } from "@/config/faq";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Is it free, when is it, where do I park, can I race a dragon boat, how do I apply for a booth. Straight answers about the 46th Los Angeles Lotus Festival at Echo Park Lake in July 2027.",
  alternates: { canonical: "/faq" },
};

/**
 * The page someone opens with one question and a bus to catch.
 *
 * Two decisions carry this page.
 *
 * The disclosures are native `<details>` and `<summary>`. No state, no
 * client component, no `aria-expanded` to keep in sync. They open before the
 * JavaScript bundle has downloaded, they open when it never downloads at all,
 * and the browser gives us keyboard operation, the correct roles and the
 * find-in-page behaviour that opens a closed section around a match — none of
 * which a hand-rolled accordion gets right for free.
 *
 * The structured data is generated from `@/config/faq`, the same list the
 * page renders. A hand-written `FAQPage` block is a second copy of the FAQ
 * that nobody remembers to edit, and the failure mode is a search result
 * quoting a price the festival stopped charging three years ago.
 */
export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        // The same paragraphs the page prints, joined. See rule 1 in the config.
        text: item.answer.join(" "),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // The content is ours, not user input — but a "</script>" appearing
        // inside a JSON string still ends the block as far as the HTML parser
        // is concerned, so the angle brackets are escaped on the way out.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <FaqHero />

      {faqGroups.map((group, index) => (
        <Section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-title`}
          // Alternating grounds, paper first: the hero is ink, and a page that
          // is almost entirely reading wants porcelain under the first answers.
          tone={index % 2 === 0 ? "paper" : "ink"}
        >
          <Container size="narrow">
            <Reveal>
              <SectionHeading
                eyebrow={String(index + 1).padStart(2, "0")}
                title={<span id={`${group.id}-title`}>{group.title}</span>}
                lede={group.lede}
              />
            </Reveal>

            <ul className="mt-10 flex flex-col gap-3 sm:mt-12">
              {group.items.map((item, itemIndex) => (
                <li key={item.id}>
                  {/*
                    The Reveal is inside the <li>, never between <ul> and <li>:
                    a wrapper element there would break the list semantics that
                    tell a screen reader how many questions this topic holds.
                  */}
                  <Reveal delay={Math.min(itemIndex, 4) * 0.05} y={14}>
                    <Question item={item} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      <StillAsking />
    </>
  );
}

function FaqHero() {
  return (
    <Section className="relative isolate overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-20">
      {/* A low warm horizon, standing in for the photograph this site does not have. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 58% at 82% 104%, rgba(232,184,87,0.15) 0%, rgba(224,112,143,0.08) 42%, rgba(11,10,15,0) 74%)",
        }}
      />

      <Container>
        <Reveal>
          <p className="eyebrow">
            {site.editionOrdinal} Los Angeles Lotus Festival · {site.dates.display}
          </p>
        </Reveal>

        <h1 className="mt-6 text-[clamp(2.5rem,7.4vw,5.4rem)] leading-[0.95] tracking-[-0.03em]">
          <LineReveal
            delay={0.08}
            lines={[
              <span key="1">What people</span>,
              <span key="2">
                <em className="text-gradient-gold not-italic">ask us</em>
              </span>,
            ]}
          />
        </h1>

        <Reveal delay={0.3} y={16}>
          <p className="text-fg-muted mt-8 max-w-[58ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6]">
            Everything here is what the festival has published or told us. Where something is not
            settled for 2027 — the dates, the prices, the parking lots — the answer says so instead
            of guessing.
          </p>
        </Reveal>

        <Reveal delay={0.4} y={14}>
          <nav aria-label="Jump to a topic" className="mt-10">
            <ul className="flex flex-wrap gap-2.5">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <Link
                    href={`#${group.id}`}
                    className="border-line text-fg-muted hover:border-line-strong hover:text-fg inline-flex rounded-full border px-4 py-2 text-[13px] transition-colors duration-200"
                  >
                    {group.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * One question.
 *
 * The heading lives inside the `<summary>`, which the HTML spec allows and
 * which is the whole point: it puts every question into the document outline,
 * so someone navigating by heading can walk the list without opening a single
 * panel. The chevron is `aria-hidden` — `<summary>` already announces its own
 * expanded state, and a second announcement is noise.
 */
function Question({ item }: { item: FaqItem }) {
  return (
    <details
      id={item.id}
      className="group border-line bg-surface open:border-line-strong open:bg-surface-strong scroll-mt-28 rounded-xl border transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <summary
        className={
          // The whole row is the target, top to bottom — a chevron-sized hit
          // area is a thumb's problem, not a mouse's.
          "flex w-full cursor-pointer list-none items-start justify-between gap-5 rounded-xl " +
          "p-5 sm:gap-7 sm:p-6 [&::-webkit-details-marker]:hidden"
        }
      >
        <h3 className="text-[clamp(1.0625rem,2vw,1.3rem)] leading-[1.3]">{item.question}</h3>

        <span
          aria-hidden="true"
          className="border-line text-fg-muted group-hover:border-line-strong group-hover:text-fg mt-px grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-200"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-180"
          >
            <path
              d="M4 6.25 8 10.25 12 6.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>

      <div className="px-5 pb-6 sm:px-6 sm:pb-7">
        <Rule className="mb-5" />
        <div className="text-fg-muted flex flex-col gap-4 text-[15.5px] leading-[1.7]">
          {item.answer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {item.link ? <AnswerLink href={item.link.href} label={item.link.label} /> : null}
      </div>
    </details>
  );
}

/** The "read the long version" link under an answer. */
function AnswerLink({ href, label }: { href: string; label: string }) {
  const external = /^https?:/.test(href);

  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-fg hover:text-gold mt-5 inline-flex items-center gap-2 rounded text-[14.5px] transition-colors duration-200"
    >
      {label}
      <span aria-hidden="true">→</span>
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </Link>
  );
}

function StillAsking() {
  return (
    <Section tone="paper">
      <Container size="narrow">
        <Reveal>
          <SectionHeading
            eyebrow="Still asking"
            title="If it is not here, ask us"
            lede="Questions about access, booths, boats and sponsorship all reach the same committee, and an unanswered question is usually one we should add to this page."
          />
        </Reveal>

        <Reveal delay={0.08} y={16}>
          <div className="border-line mt-10 flex flex-col gap-6 rounded-2xl border p-7 sm:mt-12 sm:p-8">
            <p className="text-fg-muted leading-relaxed">
              Write to{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-fg hover:text-gold rounded transition-colors duration-200"
              >
                {site.contact.email}
              </a>
              . There is no published phone number for the festival, so email is the way in — and if
              you are asking about accessibility, say what you need and we will answer with the
              specifics rather than a policy.
            </p>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="primary">
                Contact the festival
              </ButtonLink>
              <ButtonLink href="/get-involved" variant="outline">
                Take part in 2027
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
