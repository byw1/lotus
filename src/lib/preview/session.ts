import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * The preview gate.
 *
 * Before launch the full site is hidden behind a single shared password, so
 * the festival team, the City, sponsors and translators can review it without
 * it turning up in search results. This is a soft gate over content that is
 * about to be public anyway — see SECURITY.md. It is not an authentication
 * system, and nothing sensitive should ever go behind it.
 *
 * It is still built properly, because a badly built gate teaches bad habits to
 * everyone who reads this repository:
 *
 *   - The password is compared in constant time, so it cannot be guessed a
 *     character at a time by measuring response latency.
 *   - The session cookie is a signed token, not `preview=1`. Anyone can read
 *     this source; without PREVIEW_SESSION_SECRET they still cannot mint one.
 *   - The token carries its own expiry, so there is no session store.
 *   - Rotating PREVIEW_SESSION_SECRET revokes every issued session at once.
 *     That is the emergency lever if the password gets out.
 *
 * Next.js 16 runs `proxy.ts` and Server Actions on the Node.js runtime, so
 * `node:crypto` is available directly and no Edge-compatible JWT library is
 * needed.
 */

export const COOKIE_NAME = "lotus_preview";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * The password used when PREVIEW_PASSWORD is unset — development only.
 *
 * A password committed to a public repository is not a password. In production
 * this fallback does not exist and the gate fails closed: with no
 * PREVIEW_PASSWORD set, nothing gets through, which is the safe direction to
 * fail in. The fallback exists so that `git clone && npm install && npm run
 * dev` works with no setup at all.
 */
const DEV_PASSWORD = "Lotus2027";

let warnedAboutPassword = false;
let warnedAboutSecret = false;
let ephemeralDevSecret: string | null = null;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

/** The password the gate will accept, or null if the gate is unconfigured. */
function expectedPassword(): string | null {
  const configured = process.env.PREVIEW_PASSWORD;
  if (configured) return configured;

  if (isProduction()) return null; // fail closed

  if (!warnedAboutPassword) {
    warnedAboutPassword = true;
    console.warn(
      `[preview] PREVIEW_PASSWORD is not set. Falling back to the development ` +
        `password "${DEV_PASSWORD}". Set PREVIEW_PASSWORD in .env.local, and in ` +
        `your host's environment before deploying — in production there is no ` +
        `fallback and the gate refuses everyone.`,
    );
  }
  return DEV_PASSWORD;
}

function sessionSecret(): string | null {
  const configured = process.env.PREVIEW_SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;

  if (isProduction()) return null; // fail closed

  // A per-process random secret in development. Restarting the dev server
  // signs everyone out, which is a fair trade for zero-setup local work.
  ephemeralDevSecret ??= randomBytes(48).toString("base64url");
  if (!warnedAboutSecret) {
    warnedAboutSecret = true;
    console.warn(
      configured
        ? "[preview] PREVIEW_SESSION_SECRET is shorter than 32 characters and was ignored. " +
            "Generate one with: openssl rand -base64 48"
        : "[preview] PREVIEW_SESSION_SECRET is not set. Using a random secret for this " +
            "process; preview sessions will not survive a restart. " +
            "Generate one with: openssl rand -base64 48",
    );
  }
  return ephemeralDevSecret;
}

/** Whether the gate has everything it needs to let anyone in. */
export function isPreviewConfigured(): boolean {
  return expectedPassword() !== null && sessionSecret() !== null;
}

/** Whether the site is currently hiding behind the gate at all. */
export function isPreviewMode(): boolean {
  return process.env.PREVIEW_MODE !== "false";
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Constant-time string comparison.
 *
 * Both inputs are hashed first so the buffers always have the same length.
 * `timingSafeEqual` throws on mismatched lengths, and that exception is itself
 * a timing signal that leaks the length of the real password.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a, "utf8").digest();
  const hashB = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(hashA, hashB);
}

export function passwordMatches(input: string): boolean {
  const expected = expectedPassword();
  if (!expected) return false;
  return constantTimeEquals(input, expected);
}

/** Mint a signed session token that expires on its own. */
export function issueToken(now: number = Date.now()): string | null {
  const secret = sessionSecret();
  if (!secret) return null;

  const expiresAt = Math.floor(now / 1000) + MAX_AGE_SECONDS;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token: string | undefined, now: number = Date.now()): boolean {
  if (!token) return false;

  const secret = sessionSecret();
  if (!secret) return false;

  const cut = token.lastIndexOf(".");
  if (cut < 1) return false;

  const payload = token.slice(0, cut);
  const signature = token.slice(cut + 1);
  const expected = sign(payload, secret);

  // Compare lengths first: timingSafeEqual throws on a mismatch.
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  const [version, expiresRaw] = payload.split(".");
  if (version !== "v1") return false;

  const expiresAt = Number(expiresRaw);
  return Number.isFinite(expiresAt) && expiresAt > now / 1000;
}

/** Cookie options shared by the action that sets it and the one that clears it. */
export const cookieOptions = {
  httpOnly: true,
  // A hard `true` silently breaks http://localhost, where the cookie is set
  // but never sent back, and the login appears to do nothing.
  secure: process.env.NODE_ENV === "production",
  // "strict" would drop the cookie when a reviewer follows a link out of email
  // or Slack — which is exactly how people reach a preview.
  sameSite: "lax",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
} as const;

/**
 * Is this a path we are willing to send someone to after they sign in?
 *
 * `next` comes from the query string, so it is attacker-controlled. Three
 * things get rejected, and the third is the one that is easy to miss:
 *
 *   "//evil.example"   protocol-relative — looks like a path, leaves the site
 *   "https://evil…"    absolute
 *   "/\\evil.example"   a BACKSLASH. WHATWG URL parsing treats \ as /, so
 *                      browsers and Next's router both read this as
 *                      "//evil.example" while a startsWith("//") check does not.
 *
 * Anything not starting with a single "/" is refused outright.
 */
export function safeNextPath(next: string | undefined | null, fallback = "/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (next.includes("\\")) return fallback;
  if (next.includes("://")) return fallback;
  return next;
}
