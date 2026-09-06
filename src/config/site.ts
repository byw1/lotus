import { photoCount } from "./gallery";

/**
 * Every festival fact lives here, so that someone who is not a developer can
 * update the site by editing one file, and so that no page has to invent
 * anything.
 *
 * Two rules for editing this file:
 *
 * 1. Anything not confirmed by the festival is marked `TODO(confirm)`. Please
 *    do not replace a TODO with a plausible guess — leave it, and the UI shows
 *    a graceful "to be announced" instead.
 * 2. Where the festival's own sources disagree with each other, the copy here
 *    says the careful thing rather than the punchy thing, and a comment
 *    records why. Those comments are load-bearing. See `docs/RESEARCH.md`.
 */

export const site = {
  name: "Los Angeles Lotus Festival",
  shortName: "Lotus Festival",
  edition: 46,
  editionOrdinal: "46th",
  year: 2027,

  /** Absolute origin. Overridden by NEXT_PUBLIC_SITE_URL in deployment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lotusfestivalla.com",

  tagline: "Two days of culture, community and lotus blooms at Echo Park Lake.",

  description:
    "The 46th Los Angeles Lotus Festival returns to Echo Park Lake in July 2027, " +
    "honoring the people and culture of China. Free admission, dragon boat races, " +
    "two stages of Asian and Pacific Islander performance, and the lotus bed in " +
    "full bloom.",

  /**
   * The honored culture for this edition. The festival honors a different
   * Asian, Native Hawaiian or Pacific Islander culture each year, announced at
   * the previous festival's closing ceremony.
   *
   * TODO(confirm): as of September 2026 no public announcement of the 46th
   * host has appeared in press coverage or on the City's page. This value is
   * set from the festival's own decision. Changing this one object is what it
   * takes to change the honored country across the entire site.
   */
  honoredCountry: {
    name: "China",
    adjective: "Chinese",
    localName: "中国",
    announced: false,
  },

  dates: {
    /**
     * TODO(confirm): the festival is traditionally the second or third weekend
     * of July, timed to the lotus bloom. Until the festival sets the date, the
     * site says "to be announced" and shows no countdown. A countdown to a
     * date nobody has announced is a fabrication, not a design flourish.
     */
    confirmed: false,
    display: "July 2027",
    detail: "Dates to be announced",
    /** ISO date. The countdown appears only once this is set. */
    startsAt: null as string | null,
    hours: "Saturday and Sunday, midday into the evening",
  },

  admission: {
    free: true,
    note: "Free and open to everyone. A few things are ticketed separately — carnival rides, the Beer & Wine Garden, the Lights of Dreams lanterns and the Lotus Flower 5K.",
  },

  /**
   * "More than 125,000" is the figure in the City's own 45th program booklet.
   * The same body of official material elsewhere says "over 100,000" and a
   * department spokesperson said "over 120,000" in 2022, so this is always
   * written as "more than", never as a precise count.
   */
  attendance: "more than 125,000 people each year",

  venue: {
    name: "Echo Park Lake",
    street: "751 Echo Park Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90026",
    get address() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
    },
    mapUrl: "https://maps.google.com/?q=Echo+Park+Lake,+751+Echo+Park+Ave,+Los+Angeles,+CA+90026",
    /**
     * The City currently says "largest lotus bed in the United States"; the
     * Echo Park Historical Society says largest in the Western U.S. Two
     * official-ish claims that contradict each other, so the site says neither
     * and describes the bed instead.
     */
    note: "Home to one of the largest lotus beds in the country, planted about a century ago and in bloom every July.",
  },

  contact: {
    email: "lotus.festival@lacity.org",
    /**
     * TODO(confirm): deliberately null. The number printed in the 45th program
     * booklet is partly illegible and every reconstruction of it is a guess. A
     * wrong phone number on a civic site sends people nowhere for years.
     */
    phone: null as string | null,
  },

  social: {
    instagram: "https://www.instagram.com/lotusfestivalla/",
    facebook: "https://www.facebook.com/lotusfestivalla/",
    linkedin: "https://www.linkedin.com/company/lotus-festival",
    handle: "@lotusfestivalla",
  },

  /** The organizations that present the festival together. */
  presenters: [
    {
      name: "City of Los Angeles Department of Recreation and Parks",
      href: "https://recreation.parks.lacity.gov/lotusfestival",
      role: "Produces and presents the festival, and has since 1972.",
    },
    {
      name: "Los Angeles Lotus Festival, Inc.",
      href: null,
      role: "The 501(c)(3) nonprofit partner that raises the funds and runs the dragon boat races.",
    },
  ],

  nonprofit: {
    legalName: "Los Angeles Lotus Festival, Inc.",
    ein: "26-0400322",
    status: "501(c)(3) public charity",
    note: "Recognized by the IRS in September 2007. Contributions are tax-deductible to the extent allowed by law.",
  },

  repo: "https://github.com/byw1/lotus",
} as const;

/**
 * The festival's history.
 *
 * Sourced from the City of Los Angeles Department of Recreation and Parks and
 * the festival's own program booklet. Where accounts conflict, this says so
 * rather than picking the better story — a civic site is not the place to
 * settle a disputed origin myth by choosing the more flattering version.
 */
export const history = [
  {
    year: "1972",
    title: "The Day of the Lotus",
    body: "The first festival is held at Echo Park Lake as a single-day event, organized by the City of Los Angeles Department of Recreation and Parks with the Council of Oriental Organizations. It is timed to the blooming of the lotus, and created to recognize the contributions of Asian Americans to Los Angeles. Ellen Quan and Helen Young chair it through 1977.",
  },
  {
    year: "1975",
    title: "The dragon boats",
    body: "The City dates the arrival of dragon boat racing to the third Lotus Festival. By one account the first boats were two rowboats lashed together and fitted with dragon décor, raced by ten co-ed teams down the length of the lake. The festival's own records tell this story more than one way — an early race in the seventies, a Chinese opening ceremony in 1991 that made it permanent, and a board chair who championed it in the mid-nineties. All three are held by people who were there.",
  },
  {
    year: "1978",
    title: "A pause",
    body: "City budget cuts halt the festival, which does not return until 1980.",
  },
  {
    year: "1990",
    title: "The Lotus Festival",
    body: "The festival returns under the name it still carries, celebrating the peoples and cultures of the Pacific Rim, and later of Asia and the Pacific Islands. From this point on, a different culture is honored each year.",
  },
  {
    year: "1991",
    title: "The Advisory Board",
    body: "The Lotus Advisory Board is created, drawing representatives from Asian and Pacific Islander communities across Los Angeles so that the cultures honored have a hand in how they are presented.",
  },
  {
    year: "2012",
    title: "The lake, and the lotus, come back",
    body: "The lotus bed had died off by 2010. Echo Park Lake closes for rehabilitation and the bed is replanted; the festival pauses for two years and returns to a lake that had been made whole again.",
  },
  {
    year: "2026",
    title: "The 45th festival",
    body: "Sri Lanka is honored across two days in July, with two stages, the food court, the Lights of Dreams lantern launch, and the second Lotus Flower 5K.",
  },
  {
    year: "2027",
    title: "The 46th festival",
    body: "China is honored, and the lotus — 荷花, the flower Chinese scholars have written about for a thousand years — is both the emblem of the festival and of the culture it celebrates.",
    current: true,
  },
] as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/**
 * The header nav.
 *
 * `/gallery` is here only once there is a photograph on it. The page is real
 * either way — it is linked from the footer, it is in the sitemap, and it says
 * something useful when it is empty — but putting "Photographs" in the header
 * of a site with no photographs sends people to an empty room from the one
 * place they trust not to. It appears on its own the day the first photograph
 * is added to `config/gallery.ts`.
 */
export const primaryNav: NavItem[] = [
  { label: "The Festival", href: "/festival", description: "What happens across the two days" },
  { label: "Dragon Boats", href: "/dragon-boats", description: "Race on Echo Park Lake" },
  ...(photoCount > 0
    ? [{ label: "Photos", href: "/gallery", description: "Photographs from the festival" }]
    : []),
  { label: "Get Involved", href: "/get-involved", description: "Apply, volunteer, or partner" },
  { label: "About", href: "/about", description: "The festival since 1972" },
  { label: "Contact", href: "/contact", description: "Reach the festival team" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Take part",
    items: [
      { label: "Volunteer", href: "/get-involved" },
      { label: "Vendors & boutiques", href: "/vendors" },
      { label: "Food booths", href: "/food-booths" },
      { label: "Performers", href: "/performers" },
      { label: "Sponsors", href: "/sponsors" },
      { label: "Dragon boat teams", href: "/dragon-boats" },
    ],
  },
  {
    title: "The festival",
    items: [
      { label: "What to expect", href: "/festival" },
      { label: "Photographs", href: "/gallery" },
      { label: "Our history", href: "/about" },
      { label: "Frequently asked", href: "/faq" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];
