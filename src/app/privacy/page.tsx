import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the Los Angeles Lotus Festival website collects, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

/**
 * The privacy notice.
 *
 * It lives outside the `(site)` route group and is listed in `PUBLIC_PATHS` in
 * `proxy.ts`, because the newsletter form on the public coming-soon page links
 * here — a privacy notice behind a password is not a privacy notice.
 *
 * Written to be read. A festival visitor deciding whether to give us their
 * email should be able to answer "what happens to it" in about thirty seconds,
 * which is not a thing a page of defined terms and capitalised nouns achieves.
 */
export default function PrivacyPage() {
  return (
    <div className="bg-bg text-fg flex min-h-dvh flex-col">
      <header className="border-line border-b">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="rounded-md text-[13px] leading-tight font-medium">
            <span className="block">Los Angeles</span>
            <span className="text-fg-muted block">Lotus Festival</span>
          </Link>
          <Link
            href="/"
            className="text-fg-muted hover:text-fg rounded-full text-[13px] transition-colors duration-200"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-4 text-[clamp(2.1rem,5vw,3.25rem)] leading-[1.05]">
            What we collect, and what we do with it
          </h1>

          <div className="mt-10 flex flex-col gap-8 text-[16.5px] leading-[1.7]">
            <p className="text-fg-muted">
              The short version: this website collects only what you type into a form, uses it only
              to answer you, and never sells or shares it for advertising. There are no tracking
              cookies and no analytics on this site.
            </p>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">If you join the mailing list</h2>
              <p className="text-fg-muted">
                We store your email address, and your first name if you give it, so we can write to
                you about the festival — a handful of emails a year, and nothing else. The list is
                held by Resend, our email provider. Every email has an unsubscribe link, and
                unsubscribing removes you.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">If you send us an application</h2>
              <p className="text-fg-muted">
                Vendor, food booth, performer, sponsor, dragon boat and volunteer applications are
                emailed to the festival committee, who read them to decide who takes part. They stay
                in the committee&rsquo;s inbox and in the planning records for that year&rsquo;s
                festival. We do not publish them, and we do not pass them to anyone outside the
                festival and the City of Los Angeles Department of Recreation and Parks.
              </p>
              <p className="text-fg-muted">
                Please do not send us anything sensitive through these forms — no identification
                documents, no payment card numbers, no medical information. If a booth is offered to
                you, the paperwork that follows is handled separately.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">Cookies</h2>
              <p className="text-fg-muted">
                One, and only before the festival site opens to the public: signing in to the team
                preview at <code className="font-mono text-[15px]">/team</code> sets a cookie so you
                stay signed in. It holds no personal information and expires after thirty days.
                There are no advertising or analytics cookies anywhere on this site.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">Spam protection</h2>
              <p className="text-fg-muted">
                Forms record how long the page was open before you submitted, to tell people apart
                from automated scripts. If the festival turns on Cloudflare Turnstile, your browser
                will also exchange a token with Cloudflare when you submit a form. Neither is used
                to identify or track you.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">Children</h2>
              <p className="text-fg-muted">
                Volunteers may be as young as 14, and the volunteer form asks whether anyone in your
                group is under 18 so we can send the right consent paperwork. Please have a parent
                or guardian fill the form in for anyone under 18.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">Having your information removed</h2>
              <p className="text-fg-muted">
                Write to{" "}
                <a
                  href={`mailto:${site.contact.email}?subject=Privacy%20request`}
                  className="text-rose rounded underline underline-offset-4"
                >
                  {site.contact.email}
                </a>{" "}
                and ask, and we will delete what we hold. You do not have to explain why. The
                festival is run by volunteers and City staff, so please allow a little time for a
                reply.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-2xl">Who is responsible</h2>
              <p className="text-fg-muted">
                {site.nonprofit.legalName}, a {site.nonprofit.status}, together with the City of Los
                Angeles Department of Recreation and Parks. The festival is held at{" "}
                {site.venue.name}, {site.venue.address}.
              </p>
              <p className="text-fg-subtle text-[14px]">
                This website&rsquo;s source code is{" "}
                <a
                  href={site.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded underline underline-offset-4"
                >
                  public
                </a>
                , so you can read exactly what it does with what you type into it.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
