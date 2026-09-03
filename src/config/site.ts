/**
 * Every festival fact lives here, so that non-developers can update the site by
 * editing one file, and so that no page has to invent anything.
 *
 * Anything not yet confirmed by the festival is marked `TODO(confirm)`. Please
 * do not replace a TODO with a plausible guess — leave it, and the UI will show
 * a graceful "to be announced" instead.
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
    "two stages of Asian and Pacific Islander performance, and the largest lotus " +
    "bed in the United States in full bloom.",

  /**
   * The honored culture for this edition. The festival honors a different
   * Asian, Native Hawaiian or Pacific Islander culture each year.
   */
  honoredCountry: {
    name: "China",
    adjective: "Chinese",
    localName: "中国",
    /**
     * Why China matters to *this* festival specifically — not a generic
     * country blurb. Sourced from the festival's own history: the dragon boat
     * races began the year China was honored.
     */
    note:
      "The dragon boats first launched onto Echo Park Lake the year this " +
      "festival honored China. In 2027 they come home.",
  },

  dates: {
    /** TODO(confirm): the festival is traditionally the second weekend of July. */
    confirmed: false,
    display: "July 2027",
    detail: "Dates to be announced",
    /** ISO date used for the countdown once `confirmed` flips to true. */
    startsAt: null as string | null,
    hours: "Saturday and Sunday, daytime through evening",
  },

  admission: {
    free: true,
    note: "Free and open to everyone. Some activities — carnival rides, the Beer & Wine Garden, and Lights of Dreams — are ticketed separately.",
  },

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
    note: "Home to the largest lotus bed in the United States.",
  },

  contact: {
    email: "lotus.festival@lacity.org",
    /** TODO(confirm): the current site shows a placeholder phone number. */
    phone: null as string | null,
  },

  social: {
    instagram: "https://www.instagram.com/lotusfestivalla/",
    facebook: "https://www.facebook.com/LACityParks/",
    x: "https://x.com/lotusfestivalla",
    handle: "@lotusfestivalla",
  },

  /** The three organizations that present the festival together. */
  presenters: [
    {
      name: "City of Los Angeles Department of Recreation and Parks",
      href: "https://recreation.parks.lacity.gov/lotusfestival",
    },
    { name: "Los Angeles Lotus Festival, Inc.", href: null },
    { name: "The Consulate General of the People's Republic of China in Los Angeles", href: null },
  ],

  repo: "https://github.com/byw1/lotus",
} as const;

/**
 * The festival's history. Every entry below is drawn from the City of Los
 * Angeles Department of Recreation and Parks' own account of the festival.
 */
export const history = [
  {
    year: "1972",
    title: "The Day of the Lotus",
    body: "The first festival is held at Echo Park Lake as a single-day event, organized by the City of Los Angeles Department of Recreation and Parks together with the Council of Oriental Organizations. It is timed to the blooming of the lotus, and created to recognize the contributions of Asian Americans to Los Angeles. Ella Quan and Helen Young, both volunteers from the Asian community, serve as co-chairs for the first five years.",
  },
  {
    year: "1974",
    title: "The dragon boats arrive",
    body: "Dragon boat racing comes to the festival the year China is honored. The first boats are built from two rowboats lashed together and decorated with dragon fittings, and ten co-ed teams race the length of the lake.",
    /** TODO(confirm): the 3rd festival honored China; year derived as 1974. */
    approximate: true,
  },
  {
    year: "1978",
    title: "A pause",
    body: "City budget cuts halt the festival for two years.",
  },
  {
    year: "1980",
    title: "Back on the water",
    body: "The festival returns through 1985, kept alive by the generosity of its sponsors.",
  },
  {
    year: "1990",
    title: "The Lotus Festival",
    body: "The festival is reborn as a celebration of the people and culture of the Pacific Rim, and is officially renamed The Lotus Festival. The Lotus Festival Advisory Board is created so that different Asian and Pacific Islander communities are represented in how it is run. From this point on, a different culture is honored each year.",
  },
  {
    year: "1991",
    title: "A tradition, formally",
    body: "A Chinese opening ceremony establishes the dragon boat races as a permanent, defining part of the festival.",
  },
  {
    year: "2026",
    title: "The 45th festival",
    body: "Sri Lanka is honored across two days in July, with a program spanning two stages, the food court, the Lights of Dreams lantern release, and the inaugural Lotus Flower 5K.",
  },
  {
    year: "2027",
    title: "The 46th festival",
    body: "China is honored — the culture that first brought dragon boats to Echo Park Lake more than fifty years ago.",
    current: true,
  },
] as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { label: "The Festival", href: "/festival", description: "What happens across the two days" },
  { label: "Dragon Boats", href: "/dragon-boats", description: "Race on Echo Park Lake" },
  { label: "Get Involved", href: "/get-involved", description: "Apply, volunteer, or partner" },
  { label: "About", href: "/about", description: "Fifty-five years at Echo Park Lake" },
  { label: "Contact", href: "/contact", description: "Reach the festival team" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Apply",
    items: [
      { label: "Volunteer", href: "/get-involved" },
      { label: "Vendors", href: "/vendors" },
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
      { label: "Our history", href: "/about" },
      { label: "Frequently asked", href: "/faq" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];
