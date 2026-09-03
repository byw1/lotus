# Deployment

This site is an ordinary Next.js 16 application. It has no database, no queue and
no persistent storage, so deploying it is mostly a matter of setting environment
variables correctly and then, on launch day, changing one of them.

Two things it is **not**: it is not a static export, and it is not serverless-only.
`src/app/robots.ts` and `src/app/sitemap.ts` are `force-dynamic` on purpose — they
read `PREVIEW_MODE` at request time so that launch takes effect immediately
rather than at the next deploy — and the homepage reads a cookie. Any host that
can run `next start` on Node 22 will do.

---

## Environment variables

Copy `.env.example` to `.env.local` for development, or set these in your host's
environment for production. `.env*` is git-ignored; never commit real values.

### Site

| Variable | Required | What breaks without it |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes, in production** | Falls back to `https://lotusfestivalla.com` (the default in `src/config/site.ts`). Canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph images and the links inside outgoing emails will all point at that domain regardless of where you actually deployed. On a preview or staging deployment this is the variable people forget. Set it to the full origin, no trailing slash. |

### The preview gate

| Variable | Required | What breaks without it |
| --- | --- | --- |
| `PREVIEW_MODE` | Effectively yes | **Any value other than the exact string `false` means the gate is ON — including unset.** This is deliberate: a new deployment fails closed rather than accidentally publishing an unfinished site. Setting it to `false` is the launch. |
| `PREVIEW_PASSWORD` | **Yes, while the gate is on** | In production there is no fallback. Unset, the gate refuses everyone, including the committee. (In development only, it falls back to `Lotus2027`.) |
| `PREVIEW_SESSION_SECRET` | **Yes, while the gate is on** | Must be at least 32 characters; shorter values are ignored with a warning. In production, unset means no token can be signed and nobody can sign in. Generate one with `openssl rand -base64 48`. Rotating it revokes every issued preview session at once — that is your emergency lever if the password gets out. |

Once `PREVIEW_MODE=false`, the other two stop being load-bearing. Keep them set
anyway, so that turning the gate back on is a one-variable operation.

### Email — Resend

| Variable | Required | What breaks without it |
| --- | --- | --- |
| `RESEND_API_KEY` | **Yes, in production** | Nothing errors. Every form still validates and reports success, and the submission is written to the server log instead of being emailed. **In production that means real applications are silently discarded.** This is the single most important variable on the list. |
| `EMAIL_FROM` | **Yes, in production** | Falls back to `Los Angeles Lotus Festival <onboarding@resend.dev>`. Resend's shared onboarding sender can only deliver to the address that owns the Resend account, so applications will not reach the festival. See the long-lead item below. |
| `EMAIL_TO` | Recommended | Falls back to `site.contact.email` — `lotus.festival@lacity.org`. Correct for the festival, wrong for anyone who has forked this. |
| `RESEND_SEGMENT_ID` | Optional | Newsletter contacts are still created, just unfiled — not added to a segment. |
| `RESEND_TOPIC_ID` | Optional | Contacts are created without a topic subscription, so subscribers get no preference centre and no topic-level unsubscribe. For a nonprofit working with the City, that is worth setting up properly. |

### Spam — Cloudflare Turnstile

| Variable | Required | What breaks without it |
| --- | --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Turnstile is skipped entirely; the honeypot and submit-timing heuristics still run. |
| `TURNSTILE_SECRET_KEY` | Optional | Same. |

> **Do not set `TURNSTILE_SECRET_KEY` on its own today.** The server side is
> complete, but no form currently renders the Turnstile widget, so no submission
> carries a token — and a missing token with a configured secret is a hard
> failure. Every application would be rejected, and the applicant would be told
> it succeeded, because failed spam checks report success by design. Add the
> widget to `FormShell` in the same change that sets these keys. The CSP in
> `next.config.ts` already allows `challenges.cloudflare.com`.

### Rate limiting — Upstash Redis

| Variable | Required | What breaks without it |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | Optional | Falls back to the in-process limiter. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Same. Both must be present, or neither is used. |

On a single long-lived Node server the in-process limiter is genuinely correct.
**On serverless it is a speed bump, not a wall** — every instance keeps its own
counters and a cold start resets them. See "Rate limiting, honestly" in
[`ARCHITECTURE.md`](ARCHITECTURE.md). If you deploy to Vercel and expect the
preview password or the forms to be attacked, set these two.

---

## Deploying to Vercel

1. Import the repository. Vercel detects Next.js; the default build command
   (`next build`) and output settings are correct — do not override them.
2. Set the Node.js version to **22** to match CI.
3. Add every variable above under **Settings → Environment Variables**, for the
   environments you want them in. `NEXT_PUBLIC_SITE_URL` must differ between
   Production and Preview deployments, or your preview deploys will emit
   canonical URLs pointing at production.
4. Add the custom domain and let Vercel issue the certificate.
5. Deploy, then check the four things listed under "Smoke test" below.

Notes specific to Vercel:

- `src/proxy.ts` runs on the **Node.js runtime**, not Edge. Next 16 does this by
  default and this file must not declare `export const runtime` — Next throws if
  a proxy file sets one.
- `clientKey()` reads the leftmost entry of `x-forwarded-for`, which is the real
  client address on Vercel.
- The security headers in `next.config.ts` are applied by the app itself, so
  there is nothing to configure in `vercel.json`. If you add one, do not
  duplicate the CSP — two `Content-Security-Policy` headers intersect, and the
  result is stricter than either and very hard to debug.

## Deploying to a plain Node host

Any host that can run Node 22 and keep a process alive: a VPS behind nginx or
Caddy, a container on Fly/Render/Railway, an App Service.

```bash
npm ci
npm run build
NODE_ENV=production npm start   # listens on $PORT, default 3000
```

Then:

- **Set every environment variable in the process environment**, not in a
  `.env.local` on the server. `NODE_ENV=production` matters on its own: it is
  what makes the preview gate fail closed and what marks the session cookie
  `Secure`.
- **Terminate TLS in front of it.** The session cookie is `Secure` in production,
  so it will be set and never sent back over plain HTTP, and the gate will appear
  to do nothing.
- **Make the reverse proxy _overwrite_ `X-Forwarded-For`.** In nginx that is:

  ```nginx
  proxy_set_header X-Forwarded-For $remote_addr;
  ```

  Use `$remote_addr`, **not** the more commonly copied
  `$proxy_add_x_forwarded_for`. That variable *appends* to whatever the client
  sent, so the leftmost entry — the one the rate limiter keys on — becomes
  attacker-controlled, and anyone can spread their attempts across an unlimited
  number of fake addresses. Overwrite it, unless there is another proxy in
  front of this one that you actually trust, in which case strip and rebuild
  the header there instead.

  Without the header at all, every visitor shares the rate-limit key `unknown`
  and one bot exhausts everyone's budget. Both failure modes are quiet, so it
  is worth checking after you deploy.
- Run it under a supervisor that restarts it (systemd, or your platform's).
  Restarting clears the in-memory rate-limit buckets; that is acceptable.
- A single long-lived process is the case the in-memory limiter is actually
  correct for. If you run more than one instance behind a load balancer,
  configure Upstash.

---

## Launch checklist

### Start these early — they have the longest lead time

- [ ] **Verify a sending domain in Resend.** This is the longest-lead item in the
      whole setup, and nothing else on this list depends on the festival.
      - Add the festival's domain in Resend and publish the DNS records it gives
        you: **SPF** (a TXT record authorising Resend to send), **DKIM** (the
        signing keys), and a **DMARC** policy (start at `p=none` with a reporting
        address, tighten to `quarantine` once the reports are clean).
      - Wait for verification to go green, then set `EMAIL_FROM` to an address at
        that domain.
      - **`onboarding@resend.dev` can only deliver to the address that owns the
        Resend account.** It is a development convenience. If you launch on it,
        applications will appear to send and will never reach the festival.
      - **If the City controls DNS for the festival's domain, open that request
        now.** Waiting on a DNS change through a municipal IT queue is measured in
        weeks, not days.
- [ ] **Decide who receives applications** and set `EMAIL_TO` to a monitored
      shared inbox, not one volunteer's personal address. People will be applying
      for the next several months.
- [ ] **Send one real submission through each of the seven forms** once the domain
      is verified, and confirm both the committee notification and the applicant
      receipt arrive and are not filed as spam.

### Configuration

- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin, no trailing slash.
- [ ] `PREVIEW_PASSWORD` set to something that is **not** `Lotus2027`. That value
      is published in this repository and is not a password.
- [ ] `PREVIEW_SESSION_SECRET` generated with `openssl rand -base64 48` and set
      only in the deployment environment. Never in the repo.
- [ ] `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` set.
- [ ] Custom domain live, HTTPS enforced, `www` and apex resolving to the same
      place.

### Content, before the gate comes down

- [ ] Every `TODO(confirm)` in `src/config/site.ts` has either been confirmed by
      the festival or is still showing its graceful "to be announced" fallback.
      **Never close one with a guess** — see [`CONTENT.md`](CONTENT.md).
- [ ] The honored country is correct and has actually been announced at the
      previous festival's closing ceremony.
- [ ] Dates: leave `dates.confirmed: false` and `dates.startsAt: null` until the
      festival announces. The countdown appears only when `startsAt` is set.
- [ ] Prices and fees anywhere on the site read as "recent" or "past", not as
      this year's numbers, unless the committee has confirmed this year's.
- [ ] Sponsorship copy still carries the note that all recognition is contingent
      on Recreation and Parks Commission approval.

### Verify, then launch

- [ ] `npm run format:check && npm run lint && npm run typecheck && npm test && npm run build` all clean.
- [ ] Keyboard-only pass over the homepage, one content page and one form: skip
      link first in the tab order, visible focus everywhere, no traps.
- [ ] Load the site with JavaScript disabled. Content is visible (the
      `<noscript>` rule in the root layout) and a form still submits.
- [ ] Check the flat SVG lotus renders on a device with no WebGL, and that
      `prefers-reduced-motion` stops all motion.
- [ ] **Flip `PREVIEW_MODE=false`. That is the launch.**

Nothing else changes. The homepage swaps from "coming soon" to the real one at
the same URL, `robots.txt` starts allowing crawlers, `sitemap.xml` fills in with
the real routes, the gated pages stop sending `noindex`, `/team` stops
challenging and redirects onward, and the preview bar disappears. No redirects,
no moved URLs, no links to update, nothing to re-index.

### Smoke test, immediately after

- [ ] `/` shows the real homepage in a private window.
- [ ] `https://<domain>/robots.txt` allows `/` and points at the sitemap.
- [ ] `https://<domain>/sitemap.xml` lists the real routes with the right origin.
- [ ] One form submission arrives in the festival inbox, and the receipt arrives
      at the applicant's.

### Rolling it back

Set `PREVIEW_MODE` back to `true` (or unset it) and redeploy. Both variables read
at request time, so the gate comes back up without a code change. Pages already
crawled will stay in the index for a while; that is the one part of launch that
is not reversible on a timescale you control, which is why the checklist above is
long.

---

## Ongoing

- **Dependabot** is configured in `.github/dependabot.yml`; CI runs
  `npm audit --audit-level=high` and a gitleaks secret scan on every push.
- **Rotate `PREVIEW_SESSION_SECRET`** if the preview password is ever shared more
  widely than intended. Every existing session is invalidated instantly.
- **Watch the Resend dashboard** in the weeks before the festival — that is when
  application volume arrives, and a bounced or spam-foldered notification is
  indistinguishable from no application at all.
- **HSTS has no `preload`** and should not get one until DNS is settled and every
  subdomain, including any City-hosted one, is confirmed HTTPS. Preload
  submission is a one-way door.
