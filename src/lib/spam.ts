/**
 * Spam defences for the public forms.
 *
 * Three layers, cheapest first, and none of them puts a puzzle in front of a
 * real applicant. A vendor filling in a booth application on a phone should
 * never be asked to identify a bicycle.
 *
 *   1. A honeypot field, hidden from sight and from screen readers, that only
 *      an automated form-filler will complete.
 *   2. A minimum time between the form rendering and being submitted. Nobody
 *      reads a booth application and fills it in inside three seconds.
 *   3. Cloudflare Turnstile, if — and only if — it has been configured. It is
 *      off by default so the site works with no third-party account.
 *
 * Layers 1 and 2 stop essentially all commodity form spam. Layer 3 is there
 * for when someone targets the site specifically.
 */

/** The name of the honeypot input. Must match `antiSpamFields` in validation.ts. */
export const HONEYPOT_FIELD = "homepage";

/** The name of the hidden timestamp input. */
export const TIMESTAMP_FIELD = "startedAt";

/**
 * How fast a submission has to be before we treat it as automated.
 *
 * Three seconds is deliberately forgiving. Someone using a password manager or
 * browser autofill on the newsletter form can legitimately submit in four or
 * five, and a false positive here means a silent, unexplained failure for a
 * real person — the worst possible outcome.
 */
const MIN_FILL_MS = 3_000;

/**
 * The oldest a form may be and still be accepted, at 12 hours.
 *
 * This catches a page scraped once and replayed forever, without punishing
 * somebody who opened the vendor form, went to find their seller's permit
 * number, and came back after lunch.
 */
const MAX_FILL_MS = 12 * 60 * 60 * 1000;

export type SpamVerdict = { ok: true } | { ok: false; reason: string };

type SpamInput = {
  honeypot?: string;
  startedAt?: number;
  turnstileToken?: string;
  remoteIp?: string;
};

/**
 * Verify a Turnstile token with Cloudflare.
 *
 * Returns `true` when Turnstile is not configured, so the whole feature can
 * stay optional. If the check itself fails — Cloudflare unreachable, timeout —
 * this fails *open*: losing a real vendor application is worse for the festival
 * than letting one spam message through to a human-read inbox.
 */
async function verifyTurnstile(token: string | undefined, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) return true;

    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success && process.env.NODE_ENV !== "production") {
      console.warn("[spam] Turnstile rejected a submission:", result["error-codes"]);
    }
    return result.success === true;
  } catch {
    return true;
  }
}

export async function checkSubmission(
  input: SpamInput,
  now: number = Date.now(),
): Promise<SpamVerdict> {
  // 1. Honeypot. A real person cannot see this field, so anything in it is a bot.
  if (input.honeypot && input.honeypot.length > 0) {
    return { ok: false, reason: "honeypot" };
  }

  /*
   * 2. Timing — but only when there is a timestamp to judge.
   *
   * `> 0` is not defensive tidying: a form submitted before hydration, or with
   * JavaScript switched off entirely, carries no timestamp at all. Treating a
   * missing one as zero would date the submission to 1970 and throw it away as
   * a replay. The schema now guards this too; both layers check, because
   * getting it wrong loses a real applicant's work and says nothing.
   */
  if (
    typeof input.startedAt === "number" &&
    Number.isFinite(input.startedAt) &&
    input.startedAt > 0
  ) {
    const elapsed = now - input.startedAt;
    if (elapsed < MIN_FILL_MS) return { ok: false, reason: "too-fast" };
    if (elapsed > MAX_FILL_MS) return { ok: false, reason: "stale" };
  }

  // 3. Turnstile, when configured.
  const passed = await verifyTurnstile(input.turnstileToken, input.remoteIp);
  if (!passed) return { ok: false, reason: "turnstile" };

  return { ok: true };
}

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}
