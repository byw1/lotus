# What is worth taking

This repository is public so that other festivals, parks departments and small
nonprofits can take the parts that are useful. That is a nice sentence and it
is not very actionable, so this page is the specific version: the decisions
that turned out to matter, the ones that cost more than expected, and the
things you should not copy.

It assumes you are **not** building a lotus festival site. If you are forking
this for an event, read the three rules at the bottom of the
[README](../README.md) instead — this page is for someone building something
else who wants the ideas.

Everything here is a real decision in this repository, with the file to go and
look at. Nothing is aspirational.

---

## 1. Make launch one environment variable

A civic site is usually built months before anyone is allowed to see it, which
means it lives behind something. The obvious shapes are a separate staging
domain, or a `/preview` prefix, or a feature branch nobody merges. All three
mean that launching is a migration: URLs move, links rot, and the thing you
tested is not the thing you shipped.

Here, `/` serves the holding page to the public and the real homepage to anyone
who has been through the gate at `/team`. The whole site sits behind the same
check. Launch is `PREVIEW_MODE=false`. Nothing moves, no URL changes, no link
breaks, and the site that goes live is the one that has been reviewed for
months.

**Look at:** [`src/proxy.ts`](../src/proxy.ts),
[`src/lib/preview/session.ts`](../src/lib/preview/session.ts),
[`src/app/page.tsx`](../src/app/page.tsx).

**The catch:** `robots.ts` and `sitemap.ts` have to be `force-dynamic`, or they
bake the gated answer into the build and the flip needs a redeploy to take
effect. Two lines, and easy to miss until the day it matters.

**Also:** the gate is not authentication, and the pages behind it say so. See
[§5](#5-say-what-a-thing-is-not).

---

## 2. Content is typed config; pages derive from it

Everything a non-developer might need to change lives in
[`src/config/`](../src/config/): the festival's facts, the program, the FAQ,
the sponsorship tiers, the photographs. Pages read those files. They do not
restate them.

The rule underneath it is worth more than the pattern: **never keep a second
hand-written copy of a list, because the second copy is the one that will be
wrong.** Concretely, in this repository:

- The **sitemap** is generated from the navigation. Adding a page to the nav is
  what puts it in the sitemap — there is no second list to forget.
- The **FAQ structured data** is generated from the same array the page
  renders, so a search result can never quote an answer the site stopped
  giving.
- **"What costs money"** is derived from `ticketed: true` flags on program
  items. Marking an attraction is the whole edit; the list at the foot of the
  page rebuilds itself.
- The **photo gallery's nav link** exists only when there is a photograph. The
  page is real either way; it just does not advertise an empty room.

Each of those started life as a second list, and each one was wrong within a
week.

**Look at:** [`src/config/program.ts`](../src/config/program.ts) for the
comment-heavy house style, and [`src/app/sitemap.ts`](../src/app/sitemap.ts)
for what deriving buys you.

---

## 3. `TODO(confirm)` beats a plausible guess

Half the facts about an event a year out are not decided. The dates, the
honored culture, this year's prices, which parking lots are in use. The
temptation is to write something reasonable and fix it later, and "later" is
the day somebody drives to the wrong place.

So the config marks unknowns, and **the UI has a graceful answer for every one
of them.** No dates means the page says "to be announced" and no countdown
renders. No phone number means the contact page shows email only. The site is
allowed to know less than it would like to.

```ts
/**
 * TODO(confirm): the festival is traditionally the second or third weekend of
 * July, timed to the lotus bloom. Until the festival sets the date, the site
 * says "to be announced" and shows no countdown. A countdown to a date nobody
 * has announced is a fabrication, not a design flourish.
 */
confirmed: false,
```

**Look at:** [`src/config/site.ts`](../src/config/site.ts) — every `TODO(confirm)`
in it, and what the pages do with them.

---

## 4. Write down where your sources disagree

Three official sources give three different attendance figures for this
festival. The origin of the dragon boat races is told at least three ways by
people who were there. The lotus bed is "the largest in the United States"
according to the City and "the largest in the Western U.S." according to the
historical society.

The site says "more than 125,000", tells the boat story as a story with three
versions, and describes the lotus bed instead of ranking it. Each of those has
a comment next to it recording *why it is phrased that way*.

Those comments are the load-bearing part. Without them the next person reads
"more than 125,000" as clumsy writing and tidies it into a precise number, and
the carefulness is gone in one commit that looked like an improvement.

**Look at:** [`docs/RESEARCH.md`](RESEARCH.md) for the sourcing, and the
comments in [`src/config/site.ts`](../src/config/site.ts) for how the
disagreement is recorded at the point of use.

---

## 5. Say what a thing is *not*

[`SECURITY.md`](../SECURITY.md) says the preview gate is a soft gate over
content that is about to be public, that it is not authentication, and that
nothing sensitive should go behind it. The gate page itself says it on screen,
to the people typing the password.

This costs nothing and prevents the specific failure where somebody puts real
personal data behind a shared password because it looked like a login.

The same move shows up in the photo gallery: the rules about consent and credit
are at the top of [`src/config/gallery.ts`](../src/config/gallery.ts), which is
the file you have to open to add a photograph. Not in a wiki, not in
`CONTRIBUTING.md`. **Put the rule where the person will be standing when they
need it.**

---

## 6. The accessibility checks that a linter cannot do for you

axe-core runs on all fourteen pages in CI and it is genuinely useful. It is
also blind to the two failures that actually shipped here:

**Text over a canvas.** axe measures contrast against the computed CSS
background colour. Over a `<canvas>` that is `transparent`, so white text at
1.6:1 over a lit petal passes cleanly. The real check screenshots each page
with the text hidden, samples the composited pixel under every text node, and
compares. That harness found three real failures nothing else caught.

**The site with JavaScript off.** Motion writes its `initial` style into the
server-rendered HTML, so every scroll-revealed section arrives at `opacity: 0`
and waits for a bundle that may never come. Without a `<noscript>` backstop in
the root layout, most of this site is a blank page for anyone on a train.
Testing that path also caught a silent data-loss bug: `z.coerce.number()` turns
`""` into `0`, so every no-JavaScript form submission validated, reported
success, and was discarded.

**Look at:** [`e2e/accessibility.spec.ts`](../e2e/accessibility.spec.ts),
[`e2e/no-javascript.spec.ts`](../e2e/no-javascript.spec.ts), and the
`<noscript>` rule in [`src/app/layout.tsx`](../src/app/layout.tsx).

---

## 7. Generate assets instead of committing them

There is no downloaded 3D model in this repository, and no image files at all.
The lotus on the homepage and the two dragon boats are generated from equations
at runtime; the diagrams and infographics are SVG drawn from the same config
the pages read.

The reasons stack up further than expected:

- The repository stays small enough to clone on a bad connection.
- There is no third-party asset licence to track, which for a public-sector
  project is a real saving.
- The flower can *morph* open, because it is geometry rather than a baked
  animation — one float per petal.
- The infographics cannot drift away from the copy beside them, because they
  read the same array.

**Look at:** [`src/components/lotus/petal-geometry.ts`](../src/components/lotus/petal-geometry.ts)
and [`src/components/dragon/boat-geometry.ts`](../src/components/dragon/boat-geometry.ts).
Both are pure functions, and both have unit tests that pin the properties a bad
edit would break silently — that the hull sits *in* the water, that the crew
matches what the program page tells a team captain.

---

## 8. Build the ladder down before you need it

Anything heavy needs an answer for every way it can fail, decided in advance
rather than discovered in an incident. The WebGL scenes step down through six:
no JavaScript yet, `saveData` or a slow connection, no WebGL context, the scene
throwing, the context being lost asynchronously, and `prefers-reduced-motion`.
Every step lands on the same flat SVG, which is a server component with no
JavaScript, so it is in the first paint on any device.

The step people forget is the fifth. A render-phase error boundary cannot see a
context lost after mount — a backgrounded tab reclaimed by the GPU, a driver
reset — and without a `webglcontextlost` listener the canvas silently goes
black.

**Look at:** [`src/components/three/CanvasHost.tsx`](../src/components/three/CanvasHost.tsx).

---

## What cost more than it should have

Three things in this repository were found by production, not by review. They
are all the same shape: a general rule that is true on the platform you learned
it on, and false on the one you deployed to.

- **Which header carries the client's IP.** The leftmost `x-forwarded-for`
  entry is the real client *only where the edge overwrites that header*. Vercel
  does. Railway does not — it documents `X-Real-IP` — so a caller can send
  their own `x-forwarded-for` and collect a fresh rate-limit budget for every
  address they invent. There is now a `CLIENT_IP_HEADER` variable, because the
  honest answer is that the deployment has to say which header it guarantees.

- **Two ports have to agree.** The app listens on the injected `PORT`; the
  platform's domain has a target port. Pin one and not the other and you get a
  deploy that reports SUCCESS, logs a clean `✓ Ready`, and answers every
  request with `502`.

- **Type generation ordering.** `LayoutProps` and the other typed-route helpers
  are generated into `.next/types`. Locally there is always a stale `.next`, so
  `tsc --noEmit` passes; on a clean CI checkout it does not. The fix is to make
  the script generate what it needs rather than to reorder the CI steps, so it
  is correct wherever it runs.

**Look at:** [`docs/DEPLOYMENT.md`](DEPLOYMENT.md), which writes all three down
next to the platform they apply to.

---

## What not to copy

- **The preview gate is not a security boundary.** It is a shared password over
  content that is about to be public. It keeps an unfinished site out of search
  results. It does not protect anything, and this repository says so in four
  places.

- **The in-memory rate limiter is right in exactly one case**: a single
  long-lived Node process. On serverless it is a speed bump — every instance
  keeps its own counters and a cold start resets them. Upstash is wired in
  behind the same interface for when that stops being true. Read
  ["Rate limiting, honestly"](ARCHITECTURE.md#3-rate-limiting-honestly) before you assume it is doing
  what you think.

- **The CSP carries `'unsafe-inline'` for scripts.** The App Router emits inline
  bootstrap scripts on every page, and removing it means per-request nonces,
  which force every page to render dynamically. That trade is right for a site
  that renders no user-supplied HTML and is almost entirely static. It is not
  right for an application that accepts content from its users.

- **The comment density.** This code is commented at roughly the rate of a
  teaching repository, because it is one — it is maintained by volunteers who
  turn over, and read by people who came to learn from it. If your team is
  three people who talk every day, you are paying for something you do not
  need.

---

## The shortest version

If you take one thing: **a site is a set of claims about the world, and most of
the work is being careful about which ones you are entitled to make.** Every
pattern on this page is downstream of that. The config flags what is not known
yet. The comments record where the sources disagree. The gallery will not
publish a photograph without a credit. The gate exists so an unconfirmed
festival does not end up in search results, and the launch is one variable so
the site that goes live is the one that was checked.

None of that is framework-specific, and all of it outlives Next.js.
