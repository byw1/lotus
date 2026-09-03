/**
 * What happens across the two days.
 *
 * This file is the program. `/festival` renders it and nothing else, so a
 * volunteer with no React can add a new area, retire one, or fix a wrong
 * detail by editing this list — the page rebuilds itself around the change.
 *
 * Three rules for editing:
 *
 * 1. Write only what the festival can stand behind. Anything that changes
 *    year to year — exact hours, this year's prices, which parking lots are
 *    in use — either says "past" and "recent", or is left out until it is
 *    fixed. A wrong detail here sends someone to the wrong place on a hot
 *    July afternoon.
 * 2. `ticketed: true` is the single source of truth for what costs money.
 *    The practical block at the foot of the page builds its list from these
 *    flags, so marking an item is enough; nothing else needs updating.
 * 3. `id` is the anchor other pages and emails will link to. Renaming one
 *    breaks those links, so rename only when you mean to.
 */

export type ProgramItem = {
  /** Anchor id. Stable — links point at it. */
  id: string;
  name: string;
  /** One paragraph, in plain words. What it is and where it is. */
  body: string;
  /** Short, checkable facts. Rendered as a list, so keep each one to a line. */
  detail?: readonly string[];
  /** Separately ticketed. Admission to the festival itself is always free. */
  ticketed?: boolean;
  /** Where to read more or take part. */
  link?: { href: string; label: string };
};

export type ProgramGroup = {
  /** Anchor id, and the key for the jump-to list at the top of the page. */
  id: string;
  title: string;
  /** A sentence of orientation before the items. */
  lede: string;
  items: readonly ProgramItem[];
};

/**
 * Grouped by where you would be standing, not by department. Someone reading
 * this is trying to work out what to do next, and "on the lake" answers that
 * better than "entertainment programming".
 */
export const programGroups: readonly ProgramGroup[] = [
  {
    id: "ceremonies",
    title: "How the two days open and close",
    lede: "The festival is bookended by two short ceremonies. Both are worth being there for, and both are free.",
    items: [
      {
        id: "opening-ceremony",
        name: "Opening ceremony",
        body: "Saturday at noon, the festival opens at the Main Stage. A traditional blessing of the dragon boats is part of it, before the boats race.",
      },
      {
        id: "closing-ceremony",
        name: "Closing ceremony",
        body: "Sunday evening, the festival closes by announcing the culture it will honor next year. It is the only place that announcement is made, and it is made to whoever is standing there.",
      },
    ],
  },
  {
    id: "stages",
    title: "Two stages",
    lede: "Performance runs through both days on two stages, and it is the largest single part of the festival.",
    items: [
      {
        id: "main-stage",
        name: "The Main Stage",
        body: "Also called the Lotus Stage. Dance, music, martial arts and song from communities across Los Angeles, in sets that run through the afternoon and evening on both days.",
        detail: ["The performing area is 40 feet by 30 feet"],
        link: { href: "/performers", label: "Apply to perform" },
      },
      {
        id: "dragon-stage",
        name: "The Dragon Stage",
        body: "The children's stage, programmed for younger audiences and often for younger performers. Performers apply to either stage on the same form.",
        link: { href: "/performers", label: "Apply to perform" },
      },
    ],
  },
  {
    id: "lake",
    title: "On the lake",
    lede: "Echo Park Lake is not a backdrop to the festival. Several of the things people come for happen on the water itself.",
    items: [
      {
        id: "dragon-boats",
        name: "Dragon boat races",
        body: "Red Dragon against Black Dragon, head to head, down roughly the length of the lake and back. Teams enter from media, corporate, city and community life, and the trophies run from Best Overall to Snappiest Dressers to the Turtle Team, for the slowest time of the weekend.",
        detail: [
          "Eight to a boat: a drummer at the front setting the pace, six paddlers, a steersman at the back",
          "Co-ed crews, with a minimum of four women in every boat",
          "Rubber-soled shoes are required — bring your own. Life jackets are supplied by Recreation and Parks",
          "Team captains check in 30 minutes before their heat",
        ],
        link: { href: "/dragon-boats", label: "Race, or enter a team" },
      },
      {
        id: "lights-of-dreams",
        name: "Lights of Dreams",
        body: "After dark, illuminated lotus lanterns and paper lanterns are floated out onto the lake. Lanterns are custom made for the festival and are bought separately, in advance.",
        detail: ["Lanterns have ranged from $25 to $60 in past years"],
        ticketed: true,
      },
      {
        id: "swan-boats",
        name: "Swan boats",
        body: "Swan boat rides run on the lake across the weekend. It is the slowest way to see the lotus bed, and the closest.",
      },
    ],
  },
  {
    id: "grounds",
    title: "Around the lake",
    lede: "The path around the water becomes a single long street of food, makers, and people with something to tell you.",
    items: [
      {
        id: "food-court",
        name: "The food court",
        body: "Around thirty vendors — booths, trucks and carts — cooking across the range of what Los Angeles actually eats. There is seating, and the court runs both days.",
        detail: ["No Styrofoam, no plastic tableware and no straws — service ware is compostable"],
        link: { href: "/food-booths", label: "Apply for a food booth" },
      },
      {
        id: "boutiques",
        name: "Boutiques and the Lotus Artisan Village",
        body: "More than twenty makers, with work sold and, in the Artisan Village, made on site. It is the part of the festival most worth walking slowly.",
        link: { href: "/vendors", label: "Apply for a booth" },
      },
      {
        id: "community-booths",
        name: "Community and non-profit booths",
        body: "Community service booths from organizations across the city, offering displays, brochures and referrals. Non-profit community service booths without sales pay a reduced rate, so that a group with no budget can still stand behind a table.",
        link: { href: "/get-involved", label: "Take a booth" },
      },
      {
        id: "health-fair",
        name: "The health fair",
        body: "Free health information booths, alongside the community area. The organizations taking part vary from year to year.",
      },
      {
        id: "eco-friendly",
        name: "The eco-friendly area",
        body: "Practical ways to live more lightly in Los Angeles, with agencies and groups working on it. Eco-friendly organizations without sales pay the reduced booth rate.",
      },
      {
        id: "beer-wine-garden",
        name: "The Beer & Wine Garden",
        body: "A separate area for anyone 21 and over, poured apart from the food court.",
        detail: ["21 and over"],
        ticketed: true,
      },
    ],
  },
  {
    id: "families",
    title: "Rides, crafts and a Sunday run",
    lede: "A good part of the festival is built for people under about twelve, and for the adults keeping up with them.",
    items: [
      {
        id: "carnival",
        name: "Carnival rides",
        body: "Carnival rides run across the weekend. Ride tickets are sold separately; getting into the festival is still free.",
        ticketed: true,
      },
      {
        id: "childrens-area",
        name: "The children's area",
        body: "Arts and crafts, face painting, jumpers and a rock wall, with the Dragon Stage programmed for the same audience.",
      },
      {
        id: "lotus-5k",
        name: "The Lotus Flower 5K Run/Walk",
        body: "A run and walk on the Sunday, presented by Aztlan Athletics with the festival and Recreation and Parks. Registration opens ahead of the festival and closes when it is full.",
        detail: [
          "Limited to the first 1,000 participants",
          "Entry includes a T-shirt, a commemorative bib and a finisher's medal",
        ],
        ticketed: true,
      },
    ],
  },
];

/**
 * Everything that costs money, derived rather than written out twice.
 *
 * The practical block on `/festival` lists these under "free admission", so
 * setting `ticketed: true` on an item above is the whole edit. A hand-kept
 * second list would go stale the first time someone added an attraction, and
 * the person it would mislead is the one who came with exactly enough cash.
 */
export const ticketedItems: readonly ProgramItem[] = programGroups.flatMap((group) =>
  group.items.filter((item) => item.ticketed),
);

export type Practicality = {
  id: string;
  title: string;
  body: string;
  points?: readonly string[];
};

/** The things people email to ask before they come. */
export const practicalities: readonly Practicality[] = [
  {
    id: "hours",
    title: "When",
    body: "Two days, Saturday and Sunday, midday into the evening. Hours shift a little from year to year and are published with the program a few weeks beforehand, so this page will not guess at them.",
  },
  {
    id: "getting-there",
    title: "Getting there, and the free shuttles",
    body: "Street parking around Echo Park Lake is limited and fills early. The festival runs free shuttles from off-site parking lots through both days, with staff on the ground directing people to the stops.",
    points: [
      "The lots in use change year to year and are published shortly before the festival",
      "The shuttles are free — there is nothing to book and no pass to print",
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    body: "The festival grounds are ADA accessible. If you have an access need this page has not covered, write to the festival before the weekend rather than hoping on the day — there is time to arrange things in advance, and far less time on a Saturday in July.",
  },
];
