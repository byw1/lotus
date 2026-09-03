import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { LotusFallback } from "@/components/lotus/LotusFallback";
import { site } from "@/config/site";
import { COOKIE_NAME, isPreviewMode, safeNextPath, verifyToken } from "@/lib/preview/session";

import { GateForm } from "./GateForm";

export const metadata: Metadata = {
  title: "Team preview",
  description: "A password-protected preview of the 46th Los Angeles Lotus Festival site.",
  robots: { index: false, follow: false },
};

/**
 * The door into the unfinished site.
 *
 * This is a soft gate, and the page says so rather than pretending otherwise.
 * It exists to keep a half-built site out of search results and away from
 * people who would take it for the real thing — not to protect anything. The
 * pages behind it are the future public site. See SECURITY.md.
 */
export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = Array.isArray(params.next) ? params.next[0] : params.next;

  // Checked here as well as in the action; the action is the one that counts,
  // but this keeps the hidden field in the form honest too.
  const next = safeNextPath(requested);

  const jar = await cookies();
  if (!isPreviewMode() || verifyToken(jar.get(COOKIE_NAME)?.value)) {
    redirect(next);
  }

  return (
    <main
      id="main"
      className="bg-bg relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(78% 58% at 50% 42%, rgba(207,228,246,0.83) 0%, rgba(252,225,235,0.36) 38%, rgba(255,255,255,0) 72%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-[2px]"
      >
        <LotusFallback className="animate-breathe" />
      </div>

      <div className="flex w-full max-w-md flex-col items-center text-center">
        <p className="border-line bg-surface text-fg-muted inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium tracking-[0.16em] uppercase backdrop-blur-sm">
          Team preview
        </p>

        <h1 className="mt-7 text-[clamp(2.1rem,6vw,3.1rem)] leading-[1.02] tracking-[-0.03em]">
          The {site.editionOrdinal} festival site,
          <br />
          before it opens
        </h1>

        <p className="text-fg-muted mt-5 max-w-[42ch] leading-relaxed">
          Everything here is a work in progress and none of it is final. If you have the password,
          you are welcome to look around and tell us what is wrong with it.
        </p>

        <GateForm next={next} />

        <p className="text-fg-muted mt-8 max-w-[44ch] text-[12.5px] leading-relaxed">
          This is a shared password over a site that is about to be public anyway. Please do not put
          anything confidential behind it.
        </p>

        <Link
          href="/"
          className="text-fg-muted hover:text-fg mt-10 rounded-full text-[13px] transition-colors duration-200"
        >
          ← Back to the public page
        </Link>
      </div>
    </main>
  );
}
