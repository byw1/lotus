import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

/**
 * The preview gate's crypto. These are the tests that would catch someone
 * "simplifying" the session token into something forgeable, which is exactly
 * the kind of change that looks harmless in a diff.
 *
 * The module reads its configuration from the environment at call time rather
 * than caching it at import, which is what makes secret rotation work as a
 * revocation lever — and what lets these tests set it up plainly.
 */

import {
  constantTimeEquals,
  isPreviewMode,
  issueToken,
  MAX_AGE_SECONDS,
  passwordMatches,
  safeNextPath,
  verifyToken,
} from "../src/lib/preview/session";

// Set before any test runs. The module reads the environment at call time
// rather than at import, so a static import is safe here.
process.env.PREVIEW_SESSION_SECRET = "a".repeat(48);
process.env.PREVIEW_PASSWORD = "correct horse battery staple";

describe("constantTimeEquals", () => {
  it("matches identical strings", () => {
    assert.equal(constantTimeEquals("hello", "hello"), true);
  });

  it("rejects different strings", () => {
    assert.equal(constantTimeEquals("hello", "hellp"), false);
  });

  it("does not throw on different lengths", () => {
    // The inputs are hashed before comparison precisely so that
    // timingSafeEqual never sees mismatched buffers — it throws on those, and
    // that exception is itself a timing signal that leaks the real length.
    assert.doesNotThrow(() => constantTimeEquals("a", "a much longer string"));
    assert.equal(constantTimeEquals("a", "a much longer string"), false);
  });
});

describe("passwordMatches", () => {
  it("accepts the configured password", () => {
    assert.equal(passwordMatches("correct horse battery staple"), true);
  });

  it("rejects anything else", () => {
    assert.equal(passwordMatches("correct horse battery stapl"), false);
    assert.equal(passwordMatches(""), false);
    assert.equal(passwordMatches("Correct Horse Battery Staple"), false);
  });
});

describe("session tokens", () => {
  it("issues a token that verifies", () => {
    const token = issueToken();
    assert.ok(token);
    assert.equal(verifyToken(token!), true);
  });

  it("carries a version and an expiry", () => {
    const parts = issueToken()!.split(".");
    assert.equal(parts.length, 3);
    assert.equal(parts[0], "v1");
    const expiry = Number(parts[1]);
    assert.ok(Math.abs(expiry - (Date.now() / 1000 + MAX_AGE_SECONDS)) < 5);
  });

  it("rejects a token whose signature has been altered", () => {
    const token = issueToken()!;
    const [version, expiry, signature] = token.split(".");
    const tampered = `${version}.${expiry}.${signature.slice(0, -1)}${signature.at(-1) === "A" ? "B" : "A"}`;
    assert.equal(verifyToken(tampered), false);
  });

  it("rejects a token whose expiry has been pushed out", () => {
    const [version, , signature] = issueToken()!.split(".");
    const forged = `${version}.${Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3650}.${signature}`;
    assert.equal(verifyToken(forged), false);
  });

  it("rejects an unsigned token", () => {
    // Anyone can read this repository. `preview=1` would be trivially forged.
    assert.equal(verifyToken("v1.9999999999.notasignature"), false);
    assert.equal(verifyToken("1"), false);
    assert.equal(verifyToken(""), false);
    assert.equal(verifyToken(undefined), false);
  });

  it("rejects an expired token", () => {
    const past = Date.now() - (MAX_AGE_SECONDS + 60) * 1000;
    const token = issueToken(past);
    assert.equal(verifyToken(token!), false);
  });

  it("stops honouring tokens once the secret is rotated", () => {
    // This is the revocation lever: changing the secret signs everyone out.
    const token = issueToken()!;
    const original = process.env.PREVIEW_SESSION_SECRET;
    process.env.PREVIEW_SESSION_SECRET = "b".repeat(48);
    assert.equal(verifyToken(token), false);
    process.env.PREVIEW_SESSION_SECRET = original;
    assert.equal(verifyToken(token), true);
  });
});

describe("isPreviewMode", () => {
  beforeEach(() => {
    delete process.env.PREVIEW_MODE;
  });

  it("defaults to on, so a misconfigured deploy hides rather than leaks", () => {
    assert.equal(isPreviewMode(), true);
  });

  it("is off only for the exact string 'false'", () => {
    process.env.PREVIEW_MODE = "false";
    assert.equal(isPreviewMode(), false);
    process.env.PREVIEW_MODE = "no";
    assert.equal(isPreviewMode(), true);
  });
});

describe("safeNextPath", () => {
  it("keeps a same-origin path", () => {
    assert.equal(safeNextPath("/vendors"), "/vendors");
    assert.equal(safeNextPath("/festival?day=sunday"), "/festival?day=sunday");
  });

  it("refuses anything that leaves the site", () => {
    for (const hostile of [
      "//evil.example",
      "https://evil.example",
      "http://evil.example",
      "javascript:alert(1)",
      "evil.example",
      "",
      undefined,
      null,
    ]) {
      assert.equal(safeNextPath(hostile), "/", `accepted ${String(hostile)}`);
    }
  });

  it("refuses a backslash, which browsers read as a slash", () => {
    // WHATWG URL parsing treats \\ as /, so "/\\evil.example" navigates to
    // //evil.example while passing a naive startsWith("//") check.
    assert.equal(safeNextPath("/\\evil.example"), "/");
    assert.equal(safeNextPath("\\\\evil.example"), "/");
    assert.equal(safeNextPath("/path\\with\\backslash"), "/");
  });

  it("takes the caller's fallback", () => {
    assert.equal(safeNextPath("//evil.example", "/festival"), "/festival");
  });
});
