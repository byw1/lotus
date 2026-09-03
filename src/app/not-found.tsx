import Link from "next/link";

import { LotusFallback } from "@/components/lotus/LotusFallback";
import { site } from "@/config/site";

/**
 * The 404.
 *
 * It lives at the root of `app/`, outside the `(site)` route group, so it gets
 * the root layout and nothing else — no header, no footer, no navigation. That
 * is deliberate rather than a limitation: a wrong URL is a dead end, and the
 * job of this page is to name the four places worth going next, not to
 * reproduce the whole site around them.
 *
 * The flat SVG lotus is used here rather than the WebGL flower. Someone who
 * has just hit a broken link is not owed a three-megabyte download and a
 * canvas warming up; the fallback renders in the first paint and weighs
 * nothing. For the same reason the entrance is the CSS `animate-rise`
 * utility instead of a Motion component — this page carries no JavaScript at
 * all, and it should still work when whatever went wrong was the JavaScript.
 */
export default function NotFound() {
  return (
    <div className="bg-bg relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* The flower sunk below the fold, lighting the page from underneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[42vh] -z-20 h-[80vh] opacity-70"
      >
        <LotusFallback />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // A white veil, not a dark scrim. It keeps the type off the petals
          // and lets the flower surface only in the last fifth of the page.
          // Every stop is white at a different alpha so the fade stays neutral;
          // fading toward a transparent tint greys the midpoint in sRGB.
          background:
            "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.97) 46%, rgba(255,255,255,0.8) 64%, rgba(255,255,255,0.38) 82%, rgba(255,255,255,0) 100%)",
        }}
      />

      <header className="border-line/70 border-b">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="rounded-md text-[13px] leading-tight font-medium">
            <span className="block">Los Angeles</span>
            <span className="text-fg-muted block">Lotus Festival</span>
          </Link>
          <Link
            href="/"
            className="text-fg-muted hover:text-fg rounded-full text-[13px] transition-colors duration-200"
          >
            ← Back to the festival
          </Link>
        </div>
      </header>

      <main id="main" className="flex flex-1 items-center">
        <div className="animate-rise mx-auto w-full max-w-3xl px-6 py-20 sm:px-8 sm:py-28">
          <p className="eyebrow">Error 404</p>

          <h1 className="mt-5 text-[clamp(2.25rem,6.4vw,4rem)] leading-[1.02] tracking-[-0.03em]">
            This page is not <em className="text-gradient-lotus not-italic">here</em>
          </h1>

          <p className="text-fg-muted mt-7 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.65]">
            The link may be old, or a page may have moved. Nothing has happened to the festival: it
            is still two days at {site.venue.name} in {site.dates.display}, still free to walk into.
          </p>

          <nav aria-label="Where to go instead" className="mt-10">
            <ul className="border-line/70 flex flex-col border-t">
              {DESTINATIONS.map((destination) => (
                <li key={destination.href}>
                  <Link
                    href={destination.href}
                    className="group border-line/70 hover:bg-surface flex items-baseline gap-5 rounded-lg border-b px-2 py-5 transition-colors duration-200"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px]">{destination.label}</span>
                      <span className="text-fg-subtle mt-1 block text-[13.5px] leading-relaxed">
                        {destination.description}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-fg-subtle group-hover:text-lake shrink-0 transition-colors duration-200"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-fg-subtle mt-10 text-[13.5px] leading-relaxed">
            If you followed a link from somewhere and it broke, tell us where it was:{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-fg-muted hover:text-fg rounded transition-colors duration-200"
            >
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

/**
 * Four destinations, not the whole navigation.
 *
 * Someone arrives here having asked for one specific thing. These are the four
 * questions a mistyped or expired festival URL is most likely to have been
 * about, in the order they are most likely to have been about them.
 */
const DESTINATIONS = [
  { href: "/", label: "The festival", description: "Where everything starts" },
  {
    href: "/festival",
    label: "What happens across the two days",
    description: "Stages, boats, food, lanterns and the 5K",
  },
  {
    href: "/faq",
    label: "Frequently asked questions",
    description: "Admission, parking, dates, and how to take part",
  },
  {
    href: "/contact",
    label: "Contact the festival",
    description: "Reach the committee by email",
  },
];
