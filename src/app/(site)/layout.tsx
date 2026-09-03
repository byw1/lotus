import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PreviewBar } from "@/components/site/PreviewBar";
import { COOKIE_NAME, isPreviewMode, verifyToken } from "@/lib/preview/session";

/**
 * The chrome around every page of the festival site.
 *
 * While the site is behind the preview gate every page in this group is
 * `noindex`. That is belt and braces alongside `proxy.ts`: a crawler that
 * somehow reaches one of these URLs must not put an unfinished page describing
 * an unconfirmed festival into search results, where it will outlive the
 * preview by months.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const previewing = isPreviewMode();
  let unlocked = false;

  if (previewing) {
    const jar = await cookies();
    unlocked = verifyToken(jar.get(COOKIE_NAME)?.value);
  }

  return (
    <>
      {previewing && unlocked ? <PreviewBar /> : null}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
