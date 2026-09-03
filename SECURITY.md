# Security policy

This repository is public so that other festivals and nonprofits can learn from
it. That means everything here is readable by anyone — including people looking
for a way in. A few ground rules keep that safe.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Use GitHub's private reporting: **Security → Advisories → Report a vulnerability**
on this repository. If that is not available to you, email
`lotus.festival@lacity.org` with `SECURITY` in the subject line.

Please include what you found, how to reproduce it, and what an attacker could
do with it. We will acknowledge within a few days. This is a volunteer-run
nonprofit site, so please be patient, and please do not test against the live
site in ways that degrade it for festival visitors — no load testing, no
automated scanning, no mass form submissions.

## What is and is not a secret

Nothing in this repository is a credential. Every secret is read from an
environment variable at runtime, and `.env*` files are git-ignored.

| Value | Where it lives |
| --- | --- |
| Preview password | `PREVIEW_PASSWORD` env var |
| Preview cookie signing key | `PREVIEW_SESSION_SECRET` env var |
| Resend API key | `RESEND_API_KEY` env var |
| Turnstile secret | `TURNSTILE_SECRET_KEY` env var |
| Upstash Redis token | `UPSTASH_REDIS_REST_TOKEN` env var |

`.env.example` documents every variable with placeholder values only.

## About the `/team` preview password

The staging gate at `/team` is a **soft gate**. It keeps the unfinished site out
of search results and away from casual visitors before launch. It is deliberately
low-friction and is not a substitute for real authentication:

- It is a single shared password with no per-user identity.
- Anyone who has the password can share it.
- It protects nothing sensitive — the gated pages are the future public site.

Do not put anything behind it that would actually hurt if it leaked. If this
site ever needs real accounts (for example, a vendor portal where applicants can
see their own submission), that requires a proper auth provider and a database,
not this gate.

What the gate does do properly:

- Compares the password in constant time, so it cannot be guessed by timing.
- Issues a signed, `HttpOnly`, `SameSite=Lax`, `Secure` session cookie (HMAC-SHA256
  via `jose`) that cannot be forged without `PREVIEW_SESSION_SECRET`.
- Rate limits attempts per IP.
- Serves `noindex` on every gated page.

## Hardening already in place

- A Content Security Policy, HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  a strict `Referrer-Policy` and a locked-down `Permissions-Policy` (see `next.config.ts`).
- Every form input is validated with the same Zod schema on the client and again
  on the server. Server-side validation is the one that counts.
- Rate limiting on every write path.
- Honeypot field + submit-timing heuristic, with optional Cloudflare Turnstile.
- No database and no user accounts, so there is no SQL to inject and no session
  store to steal.
- Dependabot and `npm audit` in CI, plus gitleaks secret scanning on every push.

## If you fork this

1. Change `PREVIEW_PASSWORD`.
2. Generate your own `PREVIEW_SESSION_SECRET` (`openssl rand -base64 48`).
3. Remove the Los Angeles Lotus Festival branding and photography — the MIT
   license covers the code only. See `LICENSE`.
