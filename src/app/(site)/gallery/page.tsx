import { Camera, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, Container, Rule, Section, SectionHeading } from "@/components/ui/layout";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { galleryYears, photoCount } from "@/config/gallery";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Photographs",
  description:
    "Photographs from the Los Angeles Lotus Festival at Echo Park Lake — the dragon boat races, both stages, the lantern launch and the lotus bed in bloom.",
  alternates: { canonical: "/gallery" },
};

/**
 * The photographs.
 *
 * Everything on this page comes out of `@/config/gallery`, which is a list a
 * volunteer edits and not code. The page has two states and both are real:
 * with photographs it is a gallery, and with none it says so plainly and tells
 * you where the pictures actually are today. An empty gallery that pretends to
 * be loading, or one padded out with stock photography of somebody else's
 * festival, would be worse than either.
 */
export default function GalleryPage() {
  return (
    <>
      <GalleryHero />
      {photoCount === 0 ? <EmptyGallery /> : <Years />}
      <SendUsYours />
    </>
  );
}

function GalleryHero() {
  return (
    <Section className="relative isolate overflow-hidden pt-14 sm:pt-20">
      {/* Light off the water, behind the type. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(96% 62% at 16% 2%, rgba(207,228,246,0.86) 0%, rgba(252,225,235,0.34) 44%, rgba(255,255,255,0) 74%)",
        }}
      />

      <Container>
        <Reveal delay={0.05}>
          <Badge tone="lake">
            {photoCount === 0
              ? `${site.venue.name} · July`
              : `${photoCount} photographs · ${galleryYears.length} ${galleryYears.length === 1 ? "year" : "years"}`}
          </Badge>
        </Reveal>

        <h1 className="mt-7 max-w-[15ch] text-[clamp(2.6rem,7.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em]">
          <LineReveal
            delay={0.12}
            lines={[
              <span key="1" className="block">
                <em className="text-gradient-lotus not-italic">Photographs</em>
              </span>,
              <span key="2" className="block">
                from the lake
              </span>,
            ]}
          />
        </h1>

        <Reveal delay={0.4} y={16}>
          <p className="text-fg-muted mt-8 max-w-[54ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55]">
            Two boats coming down the water, the food court at four in the afternoon, a thousand
            lanterns going out after dark, and the bed in flower — which is the reason the festival
            is in July at all.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * What this page is before the 46th festival happens.
 *
 * There is no photography in this repository. The festival's own archive is
 * not licensed for reuse, and a gallery filled with plausible-looking stock
 * images of a festival that is not this one would be a small lie told in
 * pictures. So this says what is true and points at where the photographs
 * currently are.
 */
function EmptyGallery() {
  return (
    <Section tone="sky" aria-label="No photographs yet">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Not yet"
            title="This page is waiting for July"
            lede={`Photographs from the ${site.editionOrdinal} festival will be published here after the weekend. Until then this is an empty room, and it seemed more honest to say so than to fill it with somebody else’s festival.`}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2">
          <Reveal delay={0.06}>
            <Card className="flex h-full flex-col">
              <Camera aria-hidden="true" className="text-lake size-7" />
              <h3 className="mt-6 text-[1.35rem] leading-snug">Where the pictures are today</h3>
              <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                The festival posts from the weekend as it happens, and the back catalogue of
                forty-odd years lives there too.
              </p>
              <div className="mt-6">
                <ButtonLink
                  href={site.social.instagram}
                  variant="soft"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.social.handle} on Instagram
                </ButtonLink>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.12}>
            <Card className="flex h-full flex-col">
              <Mail aria-hidden="true" className="text-rose size-7" />
              <h3 className="mt-6 text-[1.35rem] leading-snug">You photographed a past festival</h3>
              <p className="text-fg-muted mt-3 text-[15px] leading-relaxed">
                Then the festival would like to see them, and to credit you if they go up here. Send
                a link rather than attachments — a shared folder is easier for everyone than forty
                files in an inbox.
              </p>
              <div className="mt-6">
                <ButtonLink href={`mailto:${site.contact.email}?subject=Festival%20photographs`}>
                  Send a link
                </ButtonLink>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** One band per festival year, newest first. */
function Years() {
  return (
    <>
      {galleryYears.map((year, index) => (
        <Section
          key={year.year}
          id={String(year.year)}
          aria-labelledby={`year-${year.year}`}
          tone={index % 2 === 0 ? "white" : "sky"}
          className="scroll-mt-24"
        >
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow={year.honored ? `Honoring ${year.honored}` : undefined}
                title={<span id={`year-${year.year}`}>{year.year}</span>}
                lede={year.note}
              />
            </Reveal>

            <PhotoGrid photos={year.photos} label={String(year.year)} />
          </Container>
        </Section>
      ))}
    </>
  );
}

/**
 * The standing ask, on the page whether or not there are photographs yet.
 * Most of the good pictures of this festival are taken by people who came to
 * it, and they have nowhere to send them unless a page says so.
 */
function SendUsYours() {
  return (
    <Section tone={photoCount === 0 ? "white" : "blush"} aria-label="Sending in photographs">
      <Container size="narrow">
        <Reveal>
          <SectionHeading eyebrow="Yours" title="Send in a photograph" />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-col gap-5 text-[1.0625rem] leading-[1.7]">
            <p>
              Email{" "}
              <a
                href={`mailto:${site.contact.email}?subject=Festival%20photographs`}
                className="text-lake hover:text-lake-deep rounded underline underline-offset-4"
              >
                {site.contact.email}
              </a>{" "}
              with a link to a shared folder, the year you took them, and the name you would like
              them credited to. The festival does not put a photograph up without a credit.
            </p>
            <p>
              Two things the festival will ask you before anything goes on this page. That the
              photographs are yours to give — a picture you found is not a picture you can license.
              And that you are comfortable with them being published on a public website, which is a
              different thing from sending them to a person.
            </p>
            <p>
              Anyone can ask for a photograph to be taken down, for any reason and without
              explaining it, and it will come down. That applies twice over to photographs of
              children: this festival has a children’s area, and a parent who changes their mind
              does not have to justify it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <Rule className="my-10" />
          <p className="text-fg-muted text-[15px] leading-relaxed">
            Working on the site rather than sending photographs in?{" "}
            <Link
              href={`${site.repo}/blob/main/public/photos/README.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lake hover:text-lake-deep rounded underline underline-offset-4"
            >
              public/photos/README.md
            </Link>{" "}
            is how a photograph gets from a memory card into this gallery, and{" "}
            <Link
              href={`${site.repo}/blob/main/src/config/gallery.ts`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lake hover:text-lake-deep rounded underline underline-offset-4"
            >
              src/config/gallery.ts
            </Link>{" "}
            is the one file that decides what appears here.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
