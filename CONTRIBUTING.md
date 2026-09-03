# Contributing

Thanks for looking. This is the website for the Los Angeles Lotus Festival, a
volunteer-run nonprofit celebration at Echo Park Lake. Contributions are welcome
from anyone — you do not need to be involved with the festival.

## Getting it running

```bash
git clone https://github.com/byw1/lotus.git
cd lotus
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. You will see the "coming soon" page.

To see the full site, go to <http://localhost:3000/team> and enter the password
from `PREVIEW_PASSWORD` in your `.env.local` (the default in `.env.example` is
`Lotus2027`).

Nothing else is required. With no `RESEND_API_KEY` set, form submissions and
newsletter signups are validated normally and then printed to the server console
instead of being emailed — so you can develop every form end to end with no
accounts and no API keys.

## Before you open a pull request

```bash
npm run format     # prettier
npm run lint       # eslint
npm run typecheck
npm test           # node:test — geometry, session crypto, validation, spam
npm run build
```

CI runs all five, plus the end-to-end suite, `npm audit` and a secret scan.

For the end-to-end tests you need a browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright builds the app and starts it on port 3100 itself, with a fixed
preview password, so you do not need a `.env.local` for it. On a machine where
downloading a browser is not allowed, point `CHROMIUM_PATH` at one you already
have.

The unit tests are deliberately narrow. They cover the four things where a
mistake is invisible in review and expensive in the world: the petal maths (a bad edit
gives you a cabbage), the preview session's crypto (a "simplification" gives
you a forgeable cookie), the form schemas (a field-name mismatch silently
loses a real vendor's application), and the spam heuristics (too strict and
real people fail with no explanation).

The end-to-end tests in `e2e/` cover what only a browser can see: that the
preview gate actually gates and its cookie cannot be forged, that all seven
application forms submit and arrive with their fields intact, that every page
hydrates and nests its HTML validly, and that every page is clean under
axe-core. They run against a production build, because hydration and static
rendering behave differently in development.

## House rules

**Accessibility is not optional.** This is a public festival that belongs to
everyone. Every interactive element must be reachable and operable by keyboard,
have a visible focus state, and carry an accessible name. Text must meet WCAG 2.2
AA contrast. All motion must be disabled or reduced under
`prefers-reduced-motion: reduce` — the 3D lotus already has a static fallback,
please keep it that way.

**Respect the cultures being honored.** The festival honors a different Asian,
Native Hawaiian or Pacific Islander culture each year. Design and copy should be
specific and researched, never generic "oriental" pastiche. If you are adding
cultural content and you are not sure, open an issue and ask rather than
guessing.

**No secrets in the diff.** Ever. See [SECURITY.md](SECURITY.md).

**Keep it fast.** This site is opened on phones on a hot July day in Echo Park,
often on a congested cell network. Watch the bundle. The WebGL scene is already
code-split and lazy — do not add another heavy dependency to the critical path
without a good reason.

**Real content only.** No lorem ipsum, no "John Doe" placeholder photos, and no
invented facts about the festival's history. If you do not have the real value,
leave a clearly-marked `TODO` in `src/config/site.ts` rather than making
something up.

## Where things live

| Path | What it is |
| --- | --- |
| `src/app/page.tsx` | The public "coming soon" page |
| `src/app/team/` | The password gate |
| `src/app/(site)/` | The full festival site (gated until launch) |
| `src/components/lotus/` | The procedural 3D lotus |
| `src/components/ui/` | Shared design-system primitives |
| `src/config/site.ts` | Every festival fact, in one place |
| `src/config/forms.ts` | Field definitions for all five application forms |
| `src/lib/` | Auth, validation, email, rate limiting, spam checks |
| `docs/` | Architecture, deployment and design notes |

## Licensing

Code contributions are MIT licensed. Please do not contribute photography or
artwork you do not own.
