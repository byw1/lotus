# Trademarks and assets

The [MIT licence](LICENSE) covers the **source code** in this repository and
nothing else.

## Not licensed for reuse

- **"Los Angeles Lotus Festival"**, the festival's name in any form, and its
  logos and marks. The name is the festival's identity, not a template.
- **Any photography, artwork or program content** that appears in this
  repository or on the site.
- **The festival's copy** — the words on the pages. They are researched and
  specific to this event; see [`docs/RESEARCH.md`](docs/RESEARCH.md).

Remove all of it before you use this code for your own project. There is a
three-step list in the [README](README.md#if-you-fork-this-do-these-three-things).

## Third-party

The typefaces — Instrument Serif and Inter, served locally by `next/font` — are
under the SIL Open Font License. Chinese text is set in the reader's own system
CJK face; no CJK web font is bundled.

There is **no downloaded 3D model and no image file anywhere in this
repository**. The lotus, the dragon boats and every diagram are generated at
runtime from code in `src/`, so there is no third-party asset licence to carry
with a fork. That was one of the reasons for building them that way.

## Why this is a separate file

GitHub detects a project's licence by matching `LICENSE` against known licence
texts. A note appended to the bottom of the MIT text stops that match, and the
repository shows up as "NOASSERTION" — which means it does not appear when
somebody filters GitHub for MIT-licensed projects, which is the whole point of
publishing it. So `LICENSE` is unmodified MIT and the note lives here.
