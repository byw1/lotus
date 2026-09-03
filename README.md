# Los Angeles Lotus Festival

The website for the **46th Los Angeles Lotus Festival** — Echo Park Lake, July 2027,
dates to be announced.

The festival is presented by the City of Los Angeles Department of Recreation and
Parks together with Los Angeles Lotus Festival, Inc., a 501(c)(3) nonprofit
(EIN 26-0400322). It has run at Echo Park Lake since 1972, it is free to attend,
and it honors a different Asian, Native Hawaiian or Pacific Islander culture each
year — announced at the previous festival's closing ceremony.

This repository is public so that other festivals, parks departments and small
nonprofits can take the parts that are useful to them. Read
[`docs/RESEARCH.md`](docs/RESEARCH.md) before you take the words.

---

## Where the site is right now

The site is behind a **pre-launch preview gate**:

- The public sees a "coming soon" homepage at `/`.
- The real homepage, and the rest of the site — `/festival`, `/dragon-boats`,
  `/vendors` and so on — are reachable only after entering a shared password at
  **`/team`**. The same URL, `/`, serves whichever of the two you are entitled to.
- Launch is one environment variable: `PREVIEW_MODE=false`. Nothing moves, no
  URLs change, no links break. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

**On screenshots:** there are none in this repository, and no image files at all.
That is deliberate. The festival's photography is not licensed for reuse, and the
lotus you see on the homepage is not a photograph or a downloaded 3D model — it is
generated from equations at runtime (`src/components/lotus/petal-geometry.ts`),
and so are the two dragon boats on `/dragon-boats`
(`src/components/dragon/boat-geometry.ts`). Every diagram is drawn in SVG from
the same config the pages read. If you want to see the site, run it; it takes
about a minute.

---

## Quick start

```bash
git clone https://github.com/byw1/lotus.git
cd lotus
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. You will see the coming-soon page.

To get past the gate, go to <http://localhost:3000/team> and enter the password
from `PREVIEW_PASSWORD` in your `.env.local` — the value shipped in
`.env.example` is `Lotus2027`.

**Everything works with no API keys.** With `RESEND_API_KEY` unset, every form
still validates, rate-limits and spam-checks exactly as it does in production,
and then prints the submission to your terminal instead of emailing it:

```
[email] RESEND_API_KEY unset. Would have emailed lotus.festival@lacity.org:
New vendor & boutique submission
organization: Example Ceramics
...
```

So you can exercise all seven application forms and the newsletter end to end
without an account anywhere. Rate limiting falls back to an in-process counter,
and Cloudflare Turnstile stays switched off, for the same reason.

---

## The stack, and why each piece is here

| Piece | Why |
| --- | --- |
| **Next.js 16** (App Router) | Server Components keep the festival's copy out of the JavaScript bundle, and Server Actions let the forms work before — and without — JS. Next 16 also runs `proxy.ts` (what used to be `middleware.ts`) on the Node runtime, which is what lets the preview gate use `node:crypto` instead of an Edge-compatible JWT library. |
| **React 19** | `useActionState` and `useFormStatus` are what make a progressively-enhanced form show errors and a pending state without a client-side form library. |
| **TypeScript**, strict | The festival's facts are typed data. A renamed field fails the build instead of silently rendering nothing. |
| **Tailwind CSS v4** | The whole design system is CSS custom properties in `src/app/globals.css`, exposed to Tailwind via `@theme inline`. One light palette, four grounds — white, sky, blush and one inverted navy — chosen per section rather than by a user toggle. |
| **Zod 4** | One schema per form, run on the server before anything is sent. A mismatch between a field name and its schema would silently lose a real vendor's application, so the schemas are also unit-tested. |
| **Resend** | Transactional email for application notifications and receipts. Entirely optional in development. |
| **three.js + React Three Fiber + drei + postprocessing** | The procedural lotus and the dragon boat race. Code-split, loaded only when the browser goes idle, and only when the device can run it. |
| **Motion** | Scroll reveals, transform and opacity only, and disabled outright under `prefers-reduced-motion`. |
| **`clsx` + `tailwind-merge`** | The one-line `cn()` helper in `src/lib/utils.ts`. |
| **`node:test` + `tsx`** | Tests with no test framework to install or configure. |

There is **no database and no user accounts**. A submission is validated and
emailed; nothing is stored. That removes an entire category of risk from a site
that a volunteer committee has to keep running for years.

---

## A tour of the repo

```
src/
  app/
    page.tsx            The homepage, which is two pages: "coming soon"
                        for the public, the real one behind the gate
    layout.tsx          Fonts, metadata, the skip link, the no-JS fallback
    globals.css         Design tokens: the four grounds, type, motion, radii
    actions.ts          Every write the public can perform, as Server Actions
    team/               The preview gate: page, form, login/logout actions
    (site)/             The full festival site — gated until launch
      festival/  about/  faq/  contact/
      vendors/  food-booths/  performers/  sponsors/
      dragon-boats/  get-involved/
    privacy/  robots.ts  sitemap.ts  opengraph-image.tsx  icon.tsx
  components/
    three/CanvasHost    Capability detection and fallbacks for every WebGL scene
    lotus/              The procedural 3D lotus and its flat SVG fallback
    dragon/             The procedural 3D dragon boats and the seating diagram
    viz/                Infographics: the dot field, the glyphs, the site plan
    ui/                 layout, Button, Field, Reveal — the design system
    forms/FormShell.tsx The wrapper every application form uses
    site/               Header, Footer, the preview bar
    home/               The real festival homepage
    coming-soon/        The pre-launch homepage
  config/
    site.ts             Every festival fact, in one file
    program.ts          What happens across the two days
    faq.ts              The questions people actually ask
    sponsorship.ts      The sponsorship tiers
  lib/
    preview/session.ts  The gate's crypto: signed cookie, constant-time compare
    validation.ts       The Zod schemas for all seven forms
    email.ts            Resend, with a console fallback
    rate-limit.ts       In-memory by default, Upstash Redis if configured
    spam.ts             Honeypot, submit timing, optional Turnstile
  proxy.ts              Route gating for the preview (Next 16's middleware)
tests/                  Geometry, session crypto, validation, spam
e2e/                    The gate, the forms, hydration, axe on every page
docs/                   You are here
.railway/railway.ts     How it is deployed: one service, no database.
                        Delete it if you deploy somewhere else.
```

---

## Changing a festival fact

**Almost everything lives in one file: [`src/config/site.ts`](src/config/site.ts).**
You do not need to know React to edit it.

- **The honored country** — the `honoredCountry` object. Change `name`,
  `adjective` and `localName`, and the whole site follows.
- **The dates** — the `dates` object. Leave `confirmed: false` and `startsAt: null`
  until the festival has actually announced a date; the site then says "dates to
  be announced" and shows no countdown, which is the truth.
- **The edition number, the venue, the email address, the social links, the
  nonprofit's details** — all in the same file.
- **The program** (stages, dragon boats, food court, the 5K) —
  [`src/config/program.ts`](src/config/program.ts).
- **The FAQ** — [`src/config/faq.ts`](src/config/faq.ts). The page and its
  structured data are built from the same words, so they cannot drift apart.
- **Sponsorship tiers and prices** —
  [`src/config/sponsorship.ts`](src/config/sponsorship.ts).

Two rules apply to all four files, and they matter more than anything else in
this README:

1. **Never replace a `TODO(confirm)` with a guess.** Those markers sit on values
   the festival has not confirmed. The UI already degrades gracefully around
   them. A plausible-looking wrong date on a civic nonprofit's website sends real
   people to Echo Park on the wrong weekend.
2. **Where the festival's own sources disagree, the copy says the careful
   thing.** The comments recording why are load-bearing. Read
   [`docs/CONTENT.md`](docs/CONTENT.md) before editing, and
   [`docs/RESEARCH.md`](docs/RESEARCH.md) to see which claims are contested.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on <http://localhost:3000> |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`, core-web-vitals + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier, write |
| `npm run format:check` | Prettier, check only — this is what CI runs |
| `npm test` | `node:test` over `tests/**/*.test.ts` |
| `npm run test:watch` | The same, in watch mode |

CI (`.github/workflows/ci.yml`) runs format-check, lint, typecheck, test and
build on every push and pull request, plus `npm audit --audit-level=high` and a
gitleaks secret scan.

The tests are deliberately narrow. They cover the four places where a mistake is
invisible in review and expensive in the world: the petal maths, the preview
session's crypto, the form schemas, and the spam heuristics.

---

## The other documents

| Document | For |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the thing is built and why — the gate, the form pipeline, the design system, the procedural scenes |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Vercel, Railway and plain Node, every environment variable, and the launch checklist |
| [`docs/CONTENT.md`](docs/CONTENT.md) | For the festival committee: how to change the country, the dates, the program, the FAQ, the tiers |
| [`docs/RESEARCH.md`](docs/RESEARCH.md) | Where every fact came from, and where the sources contradict each other |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Getting set up, the house rules, what to run before a PR |
| [`SECURITY.md`](SECURITY.md) | Reporting a vulnerability, and what the preview gate is and is not |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | How we behave here |

---

## Licensing

The **source code** is MIT licensed — see [`LICENSE`](LICENSE).

The **festival's name, its logos, its photography and its program content are
not licensed for reuse.** "Los Angeles Lotus Festival" is the festival's
identity, not a template. The MIT grant covers the code and stops there.

The typefaces (Instrument Serif and Inter, served locally by `next/font`) are
under the SIL Open Font License. Chinese text is set in the reader's own system
CJK face; no CJK web font is bundled.

## If you fork this, do these three things

1. **Cut every credential the fork inherits.** Set your own `PREVIEW_PASSWORD`,
   generate a fresh `PREVIEW_SESSION_SECRET` (`openssl rand -base64 48`), and use
   your own Resend key and sending domain. The password in `.env.example` is a
   development convenience that is published to the world; it is not a password.
2. **Remove the festival's identity.** Rewrite `src/config/site.ts`,
   `program.ts`, `faq.ts` and `sponsorship.ts` for your own event, change
   `EMAIL_TO` so applications stop being addressed to `lotus.festival@lacity.org`,
   and update the trademark note in `LICENSE`. Do not ship a site that still says
   Echo Park.
3. **Do your own research, to the same standard.** The facts in this repo are
   sourced, and the contested ones are flagged rather than smoothed over. If you
   keep the structure, keep the discipline: `docs/RESEARCH.md` shows what that
   looks like, and a `TODO(confirm)` is always better than a confident guess.
