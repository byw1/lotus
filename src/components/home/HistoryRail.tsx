import { ButtonLink } from "@/components/ui/Button";
import { Badge, Container, Section, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { history } from "@/config/site";

/**
 * The festival's history, as a rail rather than an essay.
 *
 * The years and titles are rendered straight from `history` in the config, so
 * this section cannot contradict `/about` — there is one list of what happened
 * and both pages read it. The paragraph beside it deliberately summarises the
 * shape of the story and hands the detail on, including the parts where the
 * festival's own records disagree with each other. A homepage is the wrong
 * place to settle a disputed origin.
 */
export function HistoryRail() {
  return (
    <Section aria-label="The festival since 1972">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="History"
                title="The same lake since 1972"
                lede="It began as one day in July, run by Recreation and Parks with volunteers from the city’s Asian communities and timed to the bloom. It has been renamed, and it has stopped and started again — once when the City cut its budget, once while the lake was drained and the lotus bed replanted. It came back both times, which is most of what there is to say about it."
              />
              <ButtonLink href="/about" variant="outline" className="mt-9">
                Read the full history
              </ButtonLink>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <ol className="border-line border-t">
                {history.map((entry) => {
                  // `current` is only present on the edition being built, so
                  // it has to be probed rather than read.
                  const current = "current" in entry && entry.current;

                  return (
                    <li
                      key={entry.year}
                      className="border-line grid grid-cols-[3.75rem_1fr] items-baseline gap-5 border-b py-4 sm:grid-cols-[5rem_1fr]"
                    >
                      <span
                        className={
                          current
                            ? "text-vermilion text-[15px] tabular-nums"
                            : "text-gold text-[15px] tabular-nums"
                        }
                      >
                        {entry.year}
                      </span>
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className={current ? "text-fg text-[15px]" : "text-fg-muted text-[15px]"}
                        >
                          {entry.title}
                        </span>
                        {current ? <Badge tone="vermilion">This edition</Badge> : null}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
