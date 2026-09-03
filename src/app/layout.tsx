import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

import { site } from "@/config/site";

import "./globals.css";

/**
 * Instrument Serif for display, Inter for everything else.
 *
 * An editorial high-contrast serif against a neutral grotesque is the
 * "cultural institution" register — a museum's identity rather than a
 * start-up's. Both are open source and served from the app's own origin by
 * `next/font`, so there is no third-party request on the critical path and no
 * layout shift when they land.
 *
 * Note what is deliberately absent: a Latin typeface styled to look like brush
 * calligraphy. Those faces — Wonton, Chop Suey and their descendants — were
 * invented in the United States in the 1880s and have travelled alongside
 * anti-Asian caricature ever since. Chinese text on this site is set in the
 * reader's own system CJK face; see `--font-cjk` in globals.css.
 */
const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.editionOrdinal} Annual, ${site.dates.display}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Lotus Festival",
    "Echo Park Lake",
    "Los Angeles",
    "dragon boat races",
    "Asian Pacific Islander",
    "free festival",
    "2027",
  ],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.editionOrdinal} Annual`,
    description: site.description,
    locale: "en_US",
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.editionOrdinal} Annual`,
    description: site.description,
  },
  robots: {
    // The gated pages set their own `noindex`; see `src/app/(site)/layout.tsx`.
    index: true,
    follow: true,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0f",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  // Never cap zoom. Pinch-to-zoom is how a great many people read a website.
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <head>
        {/*
          Motion writes its `initial` style into the server-rendered HTML, so
          every scroll-revealed section arrives at opacity 0 and waits for
          JavaScript to reveal it. If JavaScript never runs, most of this site
          would be a blank page. This puts it all back.

          It has to live in <head> rather than in a component, because by the
          time a <noscript> in the body is parsed the elements above it have
          already been painted invisible.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain bg-bg text-fg flex min-h-full flex-col">
        {/*
          The first thing in the tab order. Someone navigating by keyboard
          should not have to walk the entire header on every page.
        */}
        <a
          href="#main"
          className="sr-only-focusable bg-gold focus:ring-focus fixed top-4 left-4 z-[100] rounded-full px-5 py-2.5 text-sm font-medium text-[#0b0a0f]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
