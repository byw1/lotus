/**
 * Rate limiting for every write path on the site.
 *
 * The default is an in-process fixed-window counter with no dependencies. That
 * is genuinely correct for a single long-lived Node server, and honestly
 * limited everywhere else — see the caveats below. Upstash Redis is wired in
 * behind the same interface for when the site outgrows it.
 *
 * What this actually defends against: a bored person with a script pointing at
 * the preview password prompt, and someone hammering the application forms into
 * the festival's inbox. It is not DDoS protection; that belongs at the CDN.
 */

export type RateLimitResult = {
  success: boolean;
  /** Requests allowed in the window. */
  limit: number;
  /** Requests left in the current window. */
  remaining: number;
  /** Unix ms when the current window resets. */
  reset: number;
};

export type RateLimitOptions = {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

type Bucket = { count: number; reset: number };

/**
 * Buckets live on `globalThis` rather than in a module-scoped `Map` so they
 * survive the module re-evaluation that Next.js does on every edit in
 * development. Without this, the limiter resets on every hot reload and you
 * cannot actually test it.
 */
const store: Map<string, Bucket> = ((
  globalThis as typeof globalThis & { __lotusRateLimit?: Map<string, Bucket> }
).__lotusRateLimit ??= new Map());

/** Drop expired buckets so a long-running server does not grow without bound. */
function sweep(now: number) {
  if (store.size < 5_000) return;
  for (const [key, bucket] of store) {
    if (bucket.reset <= now) store.delete(key);
  }
}

function memoryLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = store.get(key);
  if (!bucket || bucket.reset <= now) {
    const fresh = { count: 1, reset: now + windowMs };
    store.set(key, fresh);
    return { success: true, limit, remaining: limit - 1, reset: fresh.reset };
  }

  bucket.count += 1;
  return {
    success: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.reset,
  };
}

/**
 * Upstash Redis over its REST API, used when both env vars are present.
 *
 * Called directly rather than through @upstash/ratelimit so the package is not
 * a dependency of a repo that mostly will not use it. The algorithm is a fixed
 * window: INCR the key, and set an expiry the first time it is created.
 */
async function redisLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const windowSeconds = Math.ceil(windowMs / 1000);
  const namespaced = `ratelimit:${key}`;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", namespaced],
        ["TTL", namespaced],
      ]),
      cache: "no-store",
      // Never let a slow limiter become the slow part of a form submission.
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) return null;

    const results = (await response.json()) as { result: number }[];
    const count = results[0]?.result;
    const ttl = results[1]?.result;
    if (typeof count !== "number") return null;

    // -1 means the key exists with no expiry: it was just created by our INCR.
    if (ttl === -1 || ttl === undefined) {
      await fetch(`${url}/expire/${encodeURIComponent(namespaced)}/${windowSeconds}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(1500),
      });
    }

    const resetIn = (ttl && ttl > 0 ? ttl : windowSeconds) * 1000;
    return {
      success: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      reset: Date.now() + resetIn,
    };
  } catch {
    // A limiter that is down must not take the form down with it.
    return null;
  }
}

/**
 * Check and consume one unit of budget for `key`.
 *
 * Fails **open** if the Redis backend is unreachable, falling back to the
 * in-memory limiter. For a nonprofit's contact forms, briefly weaker rate
 * limiting is a much better outcome than refusing a real vendor's application.
 */
export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const remote = await redisLimit(key, options);
  return remote ?? memoryLimit(key, options);
}

/**
 * Best-effort client address, for use as a rate-limit key and nothing else.
 *
 * The leftmost `x-forwarded-for` entry is the real client ONLY when the edge
 * proxy overwrites the header. Vercel does. A self-hosted nginx configured
 * with the widely-copied `$proxy_add_x_forwarded_for` does not — it appends,
 * so a client can prepend as many fabricated addresses as it likes and get a
 * fresh rate-limit budget for each one. docs/DEPLOYMENT.md says to use
 * `$remote_addr` for exactly this reason.
 *
 * Never use this for anything that matters: no allowlisting, no audit trail,
 * no geolocation, no blocking. It decides how fast someone may submit a form,
 * and the cost of getting it wrong is bounded by that.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * How hard each write path is limited. Deliberately generous: a family sharing
 * one phone hotspot at Echo Park will look like a single address, and several
 * of them may apply to be vendors on the same afternoon.
 */
export const limits = {
  /** The one true brute-force surface on the site. */
  previewLogin: { limit: 8, windowMs: 60_000 },
  newsletter: { limit: 5, windowMs: 60_000 },
  application: { limit: 6, windowMs: 10 * 60_000 },
} as const satisfies Record<string, RateLimitOptions>;
