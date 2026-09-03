import type { MetadataRoute } from "next";

import { footerNav, primaryNav, site } from "@/config/site";
import { isPreviewMode } from "@/lib/preview/session";

/**
 * The public routes, taken from the navigation rather than listed again here.
 *
 * A hand-kept sitemap is a second list of pages, and the second list is always
 * the one that is wrong: a page gets added to the nav, nobody touches this
 * file, and it never gets crawled. Deriving it from `primaryNav` and
 * `footerNav` means adding a page to the site's navigation is what puts it in
 * the sitemap.
 *
 * `/privacy` is the one addition, because it is linked from the newsletter
 * form rather than from the nav. `/team` is deliberately absent: it is the
 * preview gate, and there is nothing behind it worth indexing.
 */
const EXTRA_ROUTES = ["/privacy"];

/** Same reasoning as robots.ts — this has to follow PREVIEW_MODE at runtime. */
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  if (isPreviewMode()) {
    // While the site is gated, everything but the homepage answers with a
    // redirect to the gate. Listing those URLs would be advertising a set of
    // redirects, and would leak the shape of an unannounced site.
    return [{ url: site.url, lastModified, changeFrequency: "weekly", priority: 1 }];
  }

  const paths = [
    "/",
    ...primaryNav.map((item) => item.href),
    ...footerNav.flatMap((group) => group.items.map((item) => item.href)),
    ...EXTRA_ROUTES,
  ];

  return Array.from(new Set(paths)).map((path) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
