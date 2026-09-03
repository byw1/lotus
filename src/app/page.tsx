import { cookies } from "next/headers";

import { ComingSoon } from "@/components/coming-soon/ComingSoon";
import { FestivalHome } from "@/components/home/FestivalHome";
import { PreviewBar } from "@/components/site/PreviewBar";
import { COOKIE_NAME, isPreviewMode, verifyToken } from "@/lib/preview/session";

/**
 * The homepage, which is two pages.
 *
 * While `PREVIEW_MODE` is on, the public sees "coming soon" and anyone holding
 * a preview session sees the real festival homepage. On launch day, setting
 * `PREVIEW_MODE=false` shows the real homepage to everyone — no redirects, no
 * moved URLs, no links to update, nothing to re-index.
 *
 * Reading the cookie opts this route out of static rendering. That is the
 * price of the branch, and it is the right trade: the alternative is either a
 * separate URL for the real homepage that has to be retired later, or a client
 * -side flash of the wrong page.
 */
export default async function HomePage() {
  if (!isPreviewMode()) {
    return <FestivalHome />;
  }

  const jar = await cookies();
  const unlocked = verifyToken(jar.get(COOKIE_NAME)?.value);

  if (!unlocked) return <ComingSoon />;

  /*
   * This route sits outside the (site) group, so it does not inherit that
   * layout's preview bar. Someone looking at the real homepage through the
   * gate needs the same standing reminder that nothing here is final as they
   * get on every other page.
   */
  return (
    <>
      <PreviewBar />
      <FestivalHome />
    </>
  );
}
