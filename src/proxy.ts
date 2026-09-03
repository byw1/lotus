import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME, isPreviewMode, verifyToken } from "@/lib/preview/session";

/**
 * Route gating for the pre-launch preview.
 *
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` and moved it to the Node.js
 * runtime by default, which is why this can use `node:crypto` through
 * `lib/preview/session` with no Edge-compatible JWT library. Do not add
 * `export const runtime` here — Next throws if a proxy file sets it.
 *
 * This is a coarse first pass only. It keeps unauthenticated visitors from
 * rendering the gated pages at all, which is cheap. It is not the security
 * boundary: Server Actions post to the page they live on rather than to routes
 * of their own, so anything that genuinely needs authorization re-checks it
 * inside the action.
 */

/** Paths that stay public even while the gate is on. */
const PUBLIC_PATHS = new Set(["/", "/team", "/privacy", "/robots.txt", "/sitemap.xml"]);

export function proxy(request: NextRequest) {
  if (!isPreviewMode()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  if (verifyToken(request.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/team";
  url.search = "";
  // So that a link straight to /vendors lands there after signing in.
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

/**
 * Without a matcher this runs on every request, including `_next/static`, the
 * image optimizer and everything in `public/` — which would silently gate the
 * CSS and the fonts along with the pages. The value must be a statically
 * analyzable literal; Next cannot read a variable or a template string here.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|icon|apple-icon|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?|ttf|mp4|webm)$).*)",
  ],
};
