/**
 * The photographs.
 *
 * Adding a photo to the site is two steps and no code:
 *
 *   1. Put the file in `public/photos/<year>/` — see `public/photos/README.md`
 *      for the size and naming conventions.
 *   2. Add an entry to the right year below.
 *
 * The page rebuilds itself around whatever is in this list. An empty list is a
 * valid state and renders a real page, so this can ship before there is a
 * single photograph.
 *
 * ---------------------------------------------------------------------------
 * Four rules for adding a photograph. All four are about people, not files.
 * ---------------------------------------------------------------------------
 *
 * 1. PUBLISH ONLY WHAT THE FESTIVAL HAS THE RIGHT TO PUBLISH. A photograph
 *    someone posted to Instagram is not licensed to this site because it is
 *    findable. Either the festival's own photographer took it, or the person
 *    who took it has said yes in writing. `credit` is not decoration — if you
 *    cannot fill it in, you do not have the rights.
 *
 * 2. THIS IS A FAMILY FESTIVAL WITH A CHILDREN'S AREA. Do not publish a
 *    close, identifiable photograph of a child without a parent's permission,
 *    and take one down the same day if a parent asks. Crowds and wide shots
 *    are a different thing from a portrait, and the line is whether a stranger
 *    could pick that child out.
 *
 * 3. EVERY PHOTOGRAPH NEEDS `alt`. Not "photo from the festival" — write what
 *    is actually happening, for someone who will never see it. That text is
 *    the photograph for a person using a screen reader, and it is also what a
 *    search engine reads.
 *
 * 4. STRIP THE LOCATION DATA AND RESIZE BEFORE YOU COMMIT. Phones write GPS
 *    coordinates into photographs. Git is not an image host, and a repository
 *    that carries forty full-resolution JPEGs is one nobody can clone.
 *    `public/photos/README.md` has the one command that does both.
 */

export type Photo = {
  /**
   * Path under `public/`, starting with a slash — e.g. `/photos/2026/boats.jpg`.
   * The file has to exist; nothing here checks that for you.
   */
  src: string;
  /** What is happening in the picture. Required. See rule 3. */
  alt: string;
  /** One line, shown under the photograph. Optional. */
  caption?: string;
  /** Who took it. Required. See rule 1. */
  credit: string;
  /**
   * Roughly what shape it is, so the grid can lay out a tile before the image
   * has downloaded. Wrong values cost a little cropping in the thumbnail and
   * nothing at all in the lightbox, which always shows the whole frame.
   */
  shape?: "landscape" | "portrait" | "square";
  /** Give it a double-width tile. Use it two or three times per year, at most. */
  feature?: boolean;
};

export type GalleryYear = {
  /** The festival year. Sorted newest first by the page, not by this list. */
  year: number;
  /** The culture honored that year, if it is known. */
  honored?: string;
  /** A sentence of context for the year. Optional. */
  note?: string;
  photos: readonly Photo[];
};

/**
 * Newest first is done by the page, so years can be added here in any order.
 *
 * It is deliberately empty. There is no photography in this repository yet:
 * the festival's own archive is not licensed for reuse, and inventing a
 * plausible-looking set of festival photographs would be worse than showing
 * none. `/gallery` renders an honest empty state until this fills up.
 */
export const gallery: readonly GalleryYear[] = [];

/** Every photograph, newest year first. What the page actually renders. */
export const galleryYears: readonly GalleryYear[] = [...gallery].sort((a, b) => b.year - a.year);

export const photoCount = gallery.reduce((total, year) => total + year.photos.length, 0);

/** Aspect ratio per shape, as a Tailwind class. Landscape is the default. */
export const SHAPE_ASPECT = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
} as const;
