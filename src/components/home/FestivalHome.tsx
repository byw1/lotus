import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

import { ClosingBand } from "./ClosingBand";
import { HistoryRail } from "./HistoryRail";
import { HomeHero } from "./HomeHero";
import { HonoredCountry } from "./HonoredCountry";
import { ProgramPreview } from "./ProgramPreview";
import { TakePart } from "./TakePart";

/**
 * The real homepage: what a preview visitor sees today, and what everyone sees
 * once `PREVIEW_MODE` is off.
 *
 * It carries its own Header, Footer and `<main>` because `/` renders outside
 * the `(site)` route group — the group's layout supplies that chrome to every
 * other page, and this route deliberately sits outside it so the same URL can
 * serve the holding page without a redirect. The duplication is one import
 * each; the alternative is a layout that has to branch on which of two pages
 * it is wrapping.
 *
 * The bands alternate ground on purpose. Ink for the two immersive ends and
 * for the parts that are scanned; porcelain for the two that are read — the
 * essay about China and the application fees a vendor has to squint at. The
 * order is also the order of the questions people actually arrive with: what
 * is this, whose year is it, what happens, can I be in it, how old is it, and
 * when exactly is it.
 */
export function FestivalHome() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HomeHero />
        <HonoredCountry />
        <ProgramPreview />
        <TakePart />
        <HistoryRail />
        <ClosingBand />
      </main>
      <Footer />
    </>
  );
}
