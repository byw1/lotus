# Changing what the site says

This is for the person on the festival committee who needs to fix something on
the website and does not write code. You will not need to understand React. You
will need to be careful, and this document is mostly about *where* to be careful.

Everything the site says about the festival lives in **four files**, all in
`src/config/`. The pages are built from those files, so editing one of them
changes every page that mentions it, at once, with no chance of the site
contradicting itself.

| File | What it holds |
| --- | --- |
| `src/config/site.ts` | The festival's core facts: the honored country, the dates, the venue, the email address, the attendance figure, the history timeline, the navigation |
| `src/config/program.ts` | What happens across the two days — the ceremonies, the stages, the lake, the grounds, the practical notes |
| `src/config/faq.ts` | The frequently asked questions, and their answers |
| `src/config/sponsorship.ts` | The sponsorship tiers, prices and benefits |

You will also need a developer for anything that is *not* in those four files —
new pages, new sections, layout changes. Open an issue and describe what you
want in plain words.

---

## Two rules that override everything else

### 1. Never replace a `TODO(confirm)` with a guess

Scattered through these files you will find comments like this:

```ts
/**
 * TODO(confirm): the festival is traditionally the second or third weekend
 * of July, timed to the lotus bloom. Until the festival sets the date, the
 * site says "to be announced" and shows no countdown.
 */
confirmed: false,
```

A `TODO(confirm)` marks a value **the festival has not confirmed**. The site is
already built to handle it: it says "to be announced", or leaves the detail out,
or shows nothing at all. That is not a bug and it is not an unfinished page. It
is the site being honest.

Close a `TODO(confirm)` only when someone with the authority to know has
confirmed the value. Not when it seems likely. Not when last year's was the
second weekend so this year's probably is. **A wrong date on a civic nonprofit's
website sends a family to Echo Park on the wrong Saturday, and they will not come
back the next weekend.**

If you are not sure, leave it. "Dates to be announced" costs the festival
nothing. A wrong date costs it trust.

### 2. Where sources disagree, the site says the careful thing

Several claims about this festival are contested — by the festival's own
materials, not by outsiders. The copy in these files is written to be true under
every version, and the comments recording why are load-bearing. Do not "tighten
up" a sentence that reads cautiously without reading the comment above it and
[`RESEARCH.md`](RESEARCH.md) first.

The ones that come up most:

- **Never write "46 years" or "46 consecutive years".** Editions and calendar
  years do not line up — there was no festival in 2009, 2012, 2013 or 2020, and a
  pause from 1978 to 1980. The only safe construction is "the 46th annual Lotus
  Festival, a tradition since 1972".
- **Never write "the largest lotus bed in the United States".** The City says
  that; the Echo Park Historical Society says largest in the Western U.S. Two
  official-ish sources contradicting each other means the site says "one of the
  largest lotus beds in the country" and describes the bed instead.
- **Never state a precise attendance number.** It is always "more than 125,000
  people each year".
- **Never assert a single origin story for the dragon boats.** There are three,
  all from festival-affiliated sources. Say "for fifty years", or say that
  accounts differ.
- **It is Ellen Quan, not Ella.** The City's own program booklet says Ellen.
- **There is no phone number on this site, on purpose.** The number printed in
  the program booklet is partly illegible and every reconstruction of it is a
  guess. A wrong phone number on a civic site sends people nowhere for years.
  Do not add one until someone at Recreation and Parks confirms it out loud.
  `site.contact.phone` is `null` and the site is built to handle that.

---

## How to change the honored country

The festival honors a different Asian, Native Hawaiian or Pacific Islander
culture each year, announced at the previous festival's closing ceremony on the
Sunday evening.

In `src/config/site.ts`, find:

```ts
honoredCountry: {
  name: "China",
  adjective: "Chinese",
  localName: "中国",
  announced: false,
},
```

Change all three text values together — `name` is the country, `adjective` is
what you would call its people and culture in a sentence ("Chinese dance"), and
`localName` is the country's name in its own language and script. Set
`announced: true` once the announcement has actually been made publicly.

That one object is what it takes to change the honored country across the whole
site.

**What you cannot do from this file** is change the writing *about* that culture.
Pages that speak specifically about the honored culture — its relationship to the
lotus, what it brings to the festival — are written by hand, with research behind
them. Changing the country means those need rewriting too, with someone from that
community involved. Open an issue; do not swap the nouns.

### House rules for writing about the honored culture

These apply to anything anyone writes for this site, in any file.

- **Be specific and sourced, never generically "Asian".** The whole point of
  honoring one culture a year is that it is *that* culture and not a composite.
- **Do not mix cultures.** No cherry blossoms, torii gates or Korean motifs on
  content about China. Pan-Asian decoration is the exact thing this festival
  exists to move past.
- **The word "Oriental"** appears on this site only where it names the
  historical Council of Oriental Organizations, with its date, because that was
  the founding partner's actual name in 1972. Nowhere else, ever.
- **No brush-script Latin typefaces.** Faces like Wonton and Chop Suey were
  invented in the United States in the 1880s and have travelled alongside
  anti-Asian caricature ever since. The site's display face is an editorial
  serif, and Chinese text is set in the reader's own system CJK face.
- **Chinese characters must be correct Simplified Chinese, used sparingly, as
  accents rather than decoration**, and must be wrapped so they get the right
  font: `<span lang="zh-Hans">荷花</span>`.
- **Chinese dragons are not Western dragons.** Serpentine water deities,
  benevolent, no wings, no fire.
- **Not the zodiac, not Buddha imagery, not rows of red lanterns.** The zodiac
  belongs to Lunar New Year; this is a lotus festival in July. Religious imagery
  is not ornament. Red lanterns as generic decoration are shorthand, and this
  festival can afford better than shorthand.
- **Not `#DE2910`.** That is the PRC flag red. The site's vermilion is a lacquer
  red, deliberately. This is a cultural festival, not a state one.

If you are adding cultural content and you are not certain, ask before you
publish. That is what the Lotus Advisory Board has existed for since 1991.

---

## How to change the dates

In `src/config/site.ts`:

```ts
dates: {
  confirmed: false,
  display: "July 2027",
  detail: "Dates to be announced",
  startsAt: null as string | null,
  hours: "Saturday and Sunday, midday into the evening",
},
```

- Leave `confirmed: false` and `startsAt: null` until the festival has set and
  announced the dates. While they are unset, the site says "July 2027 · dates to
  be announced" and shows **no countdown**. A countdown to a date nobody has
  announced is a fabrication, not a design flourish.
- When the dates are real: set `confirmed: true`, write them into `display` and
  `detail`, and put the Saturday's date into `startsAt` as `"2027-07-10"` (an ISO
  date, in quotes). The countdown appears on its own.
- `hours` stays vague — "midday into the evening" — until the committee publishes
  this year's hours. They shift year to year. In 2026 they were Saturday noon to
  8pm and Sunday noon to 7pm; that is history, not a promise.

Other things in the same file, all safe to edit directly: `edition` and
`editionOrdinal` (the number, and "46th"), `venue`, `contact.email`, `social`,
`attendance`, `admission.note`, `nonprofit`, and the `history` timeline.

The `primaryNav` and `footerNav` lists at the bottom control the site's
navigation **and its sitemap** — adding a page to the nav is what puts it in the
sitemap. Removing a link from the nav removes it from search engines' view of the
site, so that is a developer conversation, not a copy edit.

---

## How to change the program

`src/config/program.ts` is the `/festival` page. That page renders this file and
nothing else, so you can add an area, retire one, or fix a wrong detail by
editing this list, and the page rebuilds itself around the change.

It is a list of **groups** (ceremonies, the two stages, on the lake, on the
grounds, …), each holding **items**:

```ts
{
  id: "lights-of-dreams",
  name: "Lights of Dreams",
  body: "After dark, illuminated lotus lanterns and paper lanterns are floated out onto the lake. Lanterns are custom made for the festival and are bought separately, in advance.",
  detail: ["Lanterns have ranged from $25 to $60 in past years"],
  ticketed: true,
},
```

- **`body`** is one paragraph in plain words: what it is and where it is.
- **`detail`** is a list of short, checkable facts, one line each.
- **`ticketed: true`** is the single source of truth for what costs money. The
  practical block at the foot of the page builds its own list from these flags,
  so marking an item is enough — nothing else needs updating.
- **`link`** points at the page where someone can take part.
- **`id`** is the anchor other pages and emails link to. Renaming one breaks
  those links. Rename only when you mean to.

The rules for what goes in here: write only what the festival can stand behind.
Anything that changes year to year — exact hours, this year's prices, which
parking lots are in use — either says "past" and "recent", or is left out until
it is fixed. **Do not list specific parking lots.** They change every year, and a
wrong lot is a mile of walking in July heat.

---

## How to change the FAQ

`src/config/faq.ts` is the `/faq` page. The page and the structured data that
search engines read are built from the same words, so they cannot drift apart.

Questions are grouped by what the person is trying to do — visiting, or applying.
Each item is a question and an `answer` that is a **list of paragraphs**:

```ts
{
  id: "free",
  question: "Is the festival free?",
  answer: [
    "Yes. Admission is free and has been since the first Day of the Lotus in 1972...",
    "A few things inside are ticketed separately...",
  ],
  link: { href: "/festival", label: "What happens across the two days" },
},
```

Three rules:

1. **`answer` is plain text, with no links or formatting inside it.** It is both
   what the page prints and what goes into the structured data, and a search
   result is not the place to discover that a sentence only made sense with a
   link in the middle of it. Anything that wants a link gets one in `link`,
   underneath, as navigation rather than as part of the answer.
2. **Do not answer a question the festival has not answered.** Several obvious
   questions are deliberately missing from this file — whether you can bring your
   own food, how early to arrive, which bus to take — because there is no source
   for them. An FAQ that guesses is worse than an FAQ with a gap in it. Someone
   plans a Saturday around it.
3. **Anything that changes year to year is written as "recent" or "past" and says
   so.** The 2027 figures are not set.

---

## How to change the sponsorship tiers

`src/config/sponsorship.ts` is the `/sponsors` page. Four tiers — White Lotus
(title, $50,000), Pink Lotus (venue area, $20,000), Red Lotus (corporate,
$10,000) and Green Lotus (corporate, $5,000) — plus speciality and in-kind
packages from $5,000.

Each tier has:

- **`compare`** — the benefits that appear at more than one level, so the four
  cards can be read straight down a column. **A benefit you leave out of
  `compare` renders as "not included"** rather than being quietly dropped,
  because the gaps are how a sponsor picks a level. That is intentional; do not
  delete a row to tidy up a card.
- **`also`** — what only that tier gets.

Two rules:

1. **Every benefit here is quoted from the festival's own sponsor packet.** If it
   is not in the packet, it does not belong here. A sponsor reads this page and
   then expects it in July.
2. **`RECOGNITION_APPROVAL_NOTE` must stay on every page that shows this data.**
   All sponsorship recognition is contingent upon Recreation and Parks Commission
   approval. That is not boilerplate; it is the actual arrangement, and leaving
   it off would be promising something the festival cannot promise.

---

## How to add a photograph

`src/config/gallery.ts` is the `/gallery` page, and
[`public/photos/README.md`](../public/photos/README.md) is the practical half —
where files go, how to resize them, and the one command that strips the GPS
coordinates your phone wrote into them.

Two steps: put the file in `public/photos/<year>/`, then add an entry to the
right year in the config. An empty list is a valid state; the page renders a
real "not yet" instead of an empty grid, and the link only joins the header nav
once there is something behind it.

Four rules, all of them about people rather than files, and all of them written
out at the top of the config:

1. **Only publish what the festival has the right to publish.** A photograph
   being findable on Instagram does not license it to this site. `credit` is
   required, and if you cannot fill it in, you do not have the rights.
2. **This is a family festival with a children's area.** No close, identifiable
   photograph of a child without a parent's permission, and it comes down the
   same day if a parent asks. Anyone can ask for any photograph to be removed
   without giving a reason.
3. **Every photograph needs real `alt` text.** Not "photo from the festival" —
   what is actually happening. That text *is* the photograph for someone using
   a screen reader.
4. **Strip the location data and resize before committing.** Git is not an
   image host, and phones write GPS coordinates into every file.

---

## The house voice

Plain, warm, specific, never breathless. This is a free neighbourhood festival
run by volunteers and city staff, not a product launch.

- Short sentences. Say what happens and who it is for.
- No exclamation marks.
- No "immerse yourself", no "unforgettable", no "vibrant tapestry", no
  "celebration of diversity" in the abstract.
- Write for two people at once: someone standing in Echo Park on a hot July
  afternoon trying to find where the food is, and a vendor deciding whether to
  apply.
- No placeholder content, ever. No lorem ipsum, no invented statistics, no
  "coming soon" where a real answer belongs.

---

## Checking your work

You do not need to run anything to be useful — a pull request or an issue with
the words in it is a real contribution. If you want to see your change before it
goes live:

```bash
npm install
npm run dev
```

Then open <http://localhost:3000/team>, enter the preview password, and browse
the site. Edits to the four config files show up as soon as you save.

Before it merges, someone should run `npm run format`, `npm run lint`,
`npm run typecheck` and `npm test` — CI will run them anyway, so a failure is
caught either way.

The most common way to break one of these files is a missing comma or an
unclosed quote. If the site stops loading after an edit, that is almost always
what happened, and the terminal will name the file and the line.

---

## When you are not sure

Leave the `TODO(confirm)`. Say "to be announced". Open an issue and ask.

None of those are failures. Publishing something wrong is.
