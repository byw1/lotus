# Documentation

Five documents, and they are written for five different people. Start with the
one that matches why you are here.

| You are | Read |
| --- | --- |
| **On the festival committee**, and something on the site is wrong | [`CONTENT.md`](CONTENT.md) |
| **Deploying it**, or about to launch it | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| **Changing the code** and want to know why it is like that | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| **Checking a claim** the site makes about the festival | [`RESEARCH.md`](RESEARCH.md) |
| **Building something else** and here for ideas | [`REUSE.md`](REUSE.md) |

Outside this folder: [`../README.md`](../README.md) is the tour and the quick
start, [`../CONTRIBUTING.md`](../CONTRIBUTING.md) is how to get set up and what
to run before opening a pull request, and [`../SECURITY.md`](../SECURITY.md) is
how to report a vulnerability — and, just as importantly, what the preview gate
is and is not.

---

### [CONTENT.md](CONTENT.md) — changing what the site says

For the people who run the festival, and written so that none of it needs a
developer. How to change the honored country, the dates, the program, the FAQ,
the sponsorship tiers and the photographs — each one is a named file in
`src/config/`, and the pages rebuild themselves around the change.

It opens with two rules that override everything else in it. They are about not
publishing things the festival cannot stand behind, and they are the reason the
rest of the file is safe to follow.

### [DEPLOYMENT.md](DEPLOYMENT.md) — getting it online, and launching it

Every environment variable and what breaks without it — including the two that
fail silently and cost you real applications. Then Vercel, Railway and plain
Node, with the platform-specific traps written next to the platform they apply
to rather than in a general "gotchas" list where nobody reads them.

Ends with the launch checklist. The long-lead item is verifying a sending
domain in Resend; start that first, because nothing else on the list depends on
the festival and that one depends on DNS.

### [ARCHITECTURE.md](ARCHITECTURE.md) — how it is built, and why

The preview gate, the form pipeline, the rate limiter and what it is honestly
worth, the three layers of spam defence, the design system, and the procedural
lotus and dragon boats — no downloaded 3D model anywhere in the repository.

Written as reasoning rather than reference. Where there is a decision with a
real trade-off, the trade-off is in the text, so that someone changing it later
knows what they are giving up.

### [RESEARCH.md](RESEARCH.md) — where every fact came from

The sourcing behind the claims on the site, and — more useful — the places the
festival's own sources contradict each other. Attendance has three different
official figures. The origin of the dragon boat races is told at least three
ways by people who were there.

Read this before you take the words. The careful phrasings on the site are
careful on purpose, and this is the file that explains which ones.

### [REUSE.md](REUSE.md) — what is worth taking

For someone who is not building a festival site. The decisions that turned out
to matter, the three that cost more than they should have, and the list of
things you should not copy.
