import { Container, Eyebrow, Rule, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

/**
 * The country honored in 2027.
 *
 * Porcelain rather than ink, because this is the one part of the homepage
 * that asks to be read rather than scanned — and because the ground of a
 * blue-and-white bowl is the right one for a section about a flower that has
 * been painted on them for centuries.
 *
 * What is deliberately absent: lanterns, knotwork, a wall of red and gold, a
 * dragon of any kind. The section makes its case with two words, one
 * eleventh-century sentence and an honest note about where the boats came
 * from. Chinese is set in the reader's own system CJK face (see `--font-cjk`)
 * and every run of it carries `lang="zh-Hans"`, which is what selects that
 * face and what tells a screen reader to switch voice.
 */
export function HonoredCountry() {
  return (
    <Section tone="paper" aria-label={`Honoring ${site.honoredCountry.name} in ${site.year}`}>
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Honored in {site.year}</Eyebrow>
              <h2 className="mt-5 text-[clamp(2.6rem,6vw,4.25rem)] leading-[1]">
                {site.honoredCountry.name}
                <span
                  lang="zh-Hans"
                  className="text-fg-muted mt-4 block text-[0.3em] tracking-[0.18em]"
                >
                  {site.honoredCountry.localName}
                </span>
              </h2>

              <Rule className="mt-10" />

              <p className="text-fg-muted mt-10 max-w-[46ch] leading-relaxed">
                The festival honors one Asian, Native Hawaiian or Pacific Islander culture each
                year. The choice is made a year ahead and announced at the closing ceremony, on the
                Sunday evening, to whoever is standing there. For the {site.editionOrdinal} it is{" "}
                {site.honoredCountry.name} — a country whose writers have been describing this
                particular flower for a thousand years.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <div className="max-w-[64ch] space-y-6 text-[1.0625rem] leading-[1.7]">
                <p>
                  The lotus is <span lang="zh-Hans">荷花</span> (héhuā), and also{" "}
                  <span lang="zh-Hans">莲花</span> (liánhuā). Both names carry a second meaning:{" "}
                  <span lang="zh-Hans">荷</span> is a homophone of <span lang="zh-Hans">和</span>,
                  harmony, and <span lang="zh-Hans">莲</span> of <span lang="zh-Hans">廉</span>,
                  integrity. The association is old and deliberate, and it is most of the reason the
                  flower turns up everywhere in Chinese art — on porcelain borders, in ink painting,
                  carved into jade.
                </p>

                <p>
                  In the eleventh century Zhou Dunyi (<span lang="zh-Hans">周敦颐</span>) wrote a
                  short essay about it, <span lang="zh-Hans">《爱莲说》</span> — On the Love of the
                  Lotus. It is roughly a hundred and twenty characters long, and Chinese
                  schoolchildren still learn it. He sets three flowers against each other, gives the
                  chrysanthemum to the recluse and the peony to the rich and honored, and calls the
                  lotus <span lang="zh-Hans">花之君子</span>, the gentleman among flowers. His
                  reason is one line:
                </p>
              </div>

              <figure className="border-gold/45 mt-10 border-l-2 pl-6 sm:pl-8">
                <blockquote>
                  <p
                    lang="zh-Hans"
                    className="text-fg text-[clamp(1.75rem,4vw,2.6rem)] leading-[1.35] tracking-[0.04em]"
                  >
                    出淤泥而不染
                  </p>
                  <p className="text-fg-muted mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed">
                    &ldquo;It emerges from the mud yet is not stained.&rdquo;
                  </p>
                </blockquote>
                <figcaption className="text-fg-subtle mt-4 text-[13px]">
                  Zhou Dunyi, <span lang="zh-Hans">《爱莲说》</span>, eleventh century
                </figcaption>
              </figure>

              <div className="mt-10 max-w-[64ch] space-y-6 text-[1.0625rem] leading-[1.7]">
                <p>
                  The dragon boats come from somewhere else again. They belong to Duanwu (
                  <span lang="zh-Hans">端午节</span>), the festival of the fifth day of the fifth
                  lunar month, and to the story of the poet Qu Yuan (
                  <span lang="zh-Hans">屈原</span>) — boats rowed out to search the river for him,
                  drums beaten on the water to drive the river creatures off. Duanwu comes earlier
                  in the year and moves with the lunar calendar. The races at Echo Park are in July,
                  in their own season and on their own lake. The boats and the drum are borrowed,
                  and the debt is worth saying out loud.
                </p>
              </div>

              <aside className="border-line bg-surface mt-10 max-w-[52ch] rounded-2xl border p-6">
                <p className="text-fg-muted text-[15px] leading-relaxed">
                  The sixth month of the Chinese lunar calendar has an old name:{" "}
                  <span lang="zh-Hans">荷月</span>, the lotus month. It falls at about the time the
                  bed at {site.venue.name} comes into flower — which is what the festival has been
                  timed to since the first one.
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
