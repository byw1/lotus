import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { clientKey, limits, rateLimit } from "../src/lib/rate-limit";
import { checkSubmission, HONEYPOT_FIELD, TIMESTAMP_FIELD } from "../src/lib/spam";

/**
 * The two defences on every public write path. Both are tuned to fail in the
 * direction that protects a real applicant rather than the one that protects
 * the inbox, and these tests pin that choice down.
 */

describe("rateLimit", () => {
  it("allows up to the limit, then refuses", async () => {
    const key = `test-allow-${Math.random().toString(36).slice(2)}`;
    for (let i = 0; i < 3; i++) {
      const result = await rateLimit(key, { limit: 3, windowMs: 60_000 });
      assert.equal(result.success, true, `request ${i + 1} should have been allowed`);
    }
    const blocked = await rateLimit(key, { limit: 3, windowMs: 60_000 });
    assert.equal(blocked.success, false);
    assert.equal(blocked.remaining, 0);
  });

  it("counts each key separately", async () => {
    const suffix = Math.random().toString(36).slice(2);
    await rateLimit(`a-${suffix}`, { limit: 1, windowMs: 60_000 });
    const other = await rateLimit(`b-${suffix}`, { limit: 1, windowMs: 60_000 });
    assert.equal(other.success, true);
  });

  it("starts a fresh window once the old one expires", async () => {
    const key = `test-window-${Math.random().toString(36).slice(2)}`;
    await rateLimit(key, { limit: 1, windowMs: 1 });
    await new Promise((resolve) => setTimeout(resolve, 8));
    const after = await rateLimit(key, { limit: 1, windowMs: 1 });
    assert.equal(after.success, true);
  });

  it("reports when the window resets", async () => {
    const key = `test-reset-${Math.random().toString(36).slice(2)}`;
    const before = Date.now();
    const result = await rateLimit(key, { limit: 5, windowMs: 60_000 });
    assert.ok(result.reset > before);
    assert.ok(result.reset <= before + 60_000 + 50);
  });

  it("is generous enough not to punish a shared connection", () => {
    // A family on one phone hotspot at Echo Park looks like a single address.
    assert.ok(limits.newsletter.limit >= 3);
    assert.ok(limits.application.limit >= 5);
    assert.ok(limits.previewLogin.limit <= 10, "the login should be the tightest limit");
  });
});

describe("clientKey", () => {
  it("takes the leftmost forwarded address", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178" });
    assert.equal(clientKey(headers), "203.0.113.7");
  });

  it("falls back to x-real-ip, then to a constant", () => {
    assert.equal(clientKey(new Headers({ "x-real-ip": "203.0.113.9" })), "203.0.113.9");
    assert.equal(clientKey(new Headers()), "unknown");
  });
});

describe("checkSubmission", () => {
  const now = 1_800_000_000_000;
  const human = { startedAt: now - 30_000 };

  it("passes a person who took half a minute", async () => {
    assert.deepEqual(await checkSubmission(human, now), { ok: true });
  });

  it("rejects a filled honeypot", async () => {
    const result = await checkSubmission({ ...human, honeypot: "https://spam.example" }, now);
    assert.deepEqual(result, { ok: false, reason: "honeypot" });
  });

  it("rejects a submission faster than a person can read the form", async () => {
    const result = await checkSubmission({ startedAt: now - 400 }, now);
    assert.deepEqual(result, { ok: false, reason: "too-fast" });
  });

  it("still allows a fast but plausible submission", async () => {
    // Someone using browser autofill on the newsletter field is quick. The
    // threshold is deliberately forgiving, because a false positive here is a
    // silent, unexplained failure for a real person.
    assert.deepEqual(await checkSubmission({ startedAt: now - 4_000 }, now), { ok: true });
  });

  it("rejects a page scraped once and replayed forever", async () => {
    const result = await checkSubmission({ startedAt: now - 30 * 60 * 60 * 1000 }, now);
    assert.deepEqual(result, { ok: false, reason: "stale" });
  });

  it("allows someone who wandered off mid-form and came back", async () => {
    // The vendor form asks for a seller's permit number. People go and find it.
    assert.deepEqual(await checkSubmission({ startedAt: now - 2 * 60 * 60 * 1000 }, now), {
      ok: true,
    });
  });

  it("skips the timing check when JavaScript never ran", async () => {
    // No startedAt means the form was submitted without JavaScript. That must
    // still work; the honeypot carries the load on its own.
    assert.deepEqual(await checkSubmission({}, now), { ok: true });
  });

  it("skips Turnstile entirely when it is not configured", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.deepEqual(await checkSubmission({ ...human, turnstileToken: undefined }, now), {
      ok: true,
    });
  });
});

describe("field names", () => {
  it("keeps the honeypot and timestamp names in step with the schemas", () => {
    // FormShell renders inputs with these names; validation.ts parses them.
    // If they drift, spam checks silently stop running.
    assert.equal(HONEYPOT_FIELD, "homepage");
    assert.equal(TIMESTAMP_FIELD, "startedAt");
  });
});
