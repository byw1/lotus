import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { isPreviewMode } from "@/lib/preview/session";

/**
 * Read at request time, not at build time.
 *
 * Launch is a change of one environment variable — `PREVIEW_MODE=false` — and
 * the whole point is that it takes effect immediately. A statically generated
 * robots.txt would keep telling crawlers to stay away until somebody
 * remembered to redeploy, which is exactly the kind of thing nobody remembers
 * on launch day. This route is two hundred bytes of text; rendering it per
 * request costs nothing.
 */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (isPreviewMode()) {
    return {
      rules: {
        userAgent: "*",
        /*
         * Allow the homepage and nothing else.
         *
         * The `$` anchors the pattern to the end of the path, so this matches
         * the root URL itself and not everything beneath it — which is what a
         * bare `Allow: /` would mean, undoing the `Disallow` on the next line.
         * The more specific rule wins, so order here is presentation only.
         *
         * Behind the gate every other URL redirects to /team anyway (see
         * `proxy.ts`) and every page in the (site) group sends `noindex`.
         * This is the third layer, and the only one a crawler reads before it
         * makes the request.
         */
        allow: "/$",
        disallow: "/",
      },
      // Still pointed at, so that the day the gate comes down there is nothing
      // to remember to add back.
      sitemap: `${site.url}/sitemap.xml`,
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
