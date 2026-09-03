import { site } from "@/config/site";

/**
 * The questions people actually ask.
 *
 * This file is the FAQ. `/faq` renders it and builds its JSON-LD from it, so
 * the page and the structured data a search engine reads are the same words by
 * construction — they cannot drift apart the way a hand-maintained
 * `FAQPage` block always eventually does.
 *
 * Three rules for editing:
 *
 * 1. `answer` is plain text, deliberately. No markup, no JSX. It is what the
 *    page prints and what goes into the structured data, and a search result
 *    is not the place to discover that a sentence only made sense with a link
 *    in the middle of it. Anything that wants a link gets one in `link`,
 *    underneath the answer, as navigation rather than as part of the answer.
 * 2. Do not answer a question the festival has not answered. Several obvious
 *    questions are missing from this file — whether you can bring your own
 *    food, how early to arrive, which bus to take — because there is no
 *    source for them. An FAQ that guesses is worse than an FAQ with a gap in
 *    it: someone plans a Saturday around it.
 * 3. Anything that changes year to year — this year's prices, this year's
 *    lots, this year's hours — is written as "recent" or "past" and says so.
 *    The 2027 figures are not set.
 */

export type FaqItem = {
  /** Anchor id, and the key for the jump links. Stable — links point at it. */
  id: string;
  question: string;
  /** One entry per paragraph. Plain text; see rule 1 above. */
  answer: readonly string[];
  /** Where to read the long version. Not part of the answer. */
  link?: { href: string; label: string };
};

export type FaqGroup = {
  id: string;
  title: string;
  /** A sentence of orientation, shown under the group heading. */
  lede: string;
  items: readonly FaqItem[];
};

/**
 * Grouped by what the person is trying to do, not by which department owns
 * the answer. Someone reading this is either coming to the festival or
 * applying to be part of it, and almost nobody is doing both at once.
 */
export const faqGroups: readonly FaqGroup[] = [
  {
    id: "visiting",
    title: "Visiting",
    lede: "What the festival is, when it happens, and what it costs to walk in.",
    items: [
      {
        id: "free",
        question: "Is the festival free?",
        answer: [
          "Yes. Admission is free and has been since the first Day of the Lotus in 1972. There is no ticket, no registration and no gate.",
          "A few things inside are ticketed separately: the carnival rides, the Beer and Wine Garden, the Lights of Dreams lanterns and the Lotus Flower 5K. Everything else — both stages, the dragon boat races, the Lotus Artisan Village, the community booths and the health fair — you walk up to.",
        ],
        link: { href: "/festival", label: "What happens across the two days" },
      },
      {
        id: "when",
        question: `When is the ${site.editionOrdinal} festival?`,
        answer: [
          `${site.dates.display}. The dates have not been announced yet, and we would rather say so than publish a date that moves.`,
          "It runs across a Saturday and a Sunday, from midday into the evening. The hours shift a little from year to year, so they go up alongside the dates.",
        ],
      },
      {
        id: "what-costs-money",
        question: "What costs money once I am there?",
        answer: [
          "The carnival rides, the Beer and Wine Garden, the Lights of Dreams lanterns floated on the lake, and registration for the Lotus Flower 5K on the Sunday.",
          "Lanterns have ranged from $25 to $60 in past years, and the 5K has been limited to the first 1,000 participants. Both are set fresh each year, so treat those as an indication rather than a 2027 price.",
        ],
      },
      {
        id: "children",
        question: "Is there anything for children?",
        answer: [
          "Yes. The second stage, the Dragon Stage, is given over to cultural dance, storytelling, music and activities for younger children.",
          "There is also a children's area with crafts, face painting, jumpers and a rock wall, swan boats out on the lake, and the carnival rides, which are ticketed separately.",
        ],
        link: { href: "/festival", label: "The full program" },
      },
      {
        id: "dogs",
        question: "Can I bring my dog?",
        answer: [
          "The festival does not publish a pet policy, so we cannot give you a straight yes or no. Echo Park Lake is a public park, and the park's own rules apply on the day.",
          `It is worth knowing what you would be bringing a dog into. The festival draws ${site.attendance}, in July heat, with drums out on the water and a crowd standing shoulder to shoulder around the food court.`,
          `If it matters to your plans, write to ${site.contact.email} before you set out. Service animals are a different question, and the answer is under Accessibility below.`,
        ],
      },
      {
        id: "how-long",
        question: "How long has the Lotus Festival been going?",
        answer: [
          "Since 1972, when it was held for a single day as the Day of the Lotus, organized by the Department of Recreation and Parks with the Council of Oriental Organizations, and chaired by two volunteers from the Asian community, Ellen Quan and Helen Young.",
          `2027 brings the ${site.editionOrdinal} festival, which is not the same as ${site.edition} years. City budget cuts stopped it between 1978 and 1980, and it paused again while Echo Park Lake was drained, rehabilitated and the lotus bed replanted. The ${site.editionOrdinal} annual, in a tradition running since 1972, is the accurate way to say it.`,
        ],
        link: { href: "/about", label: "The festival since 1972" },
      },
      {
        id: "honored-country",
        question: "How is the honored country chosen?",
        answer: [
          "Each festival honors a different Asian, Native Hawaiian or Pacific Islander culture. The next one is announced at the closing ceremony of the festival before it, on the Sunday evening.",
          `The ${site.editionOrdinal} festival honors the people and culture of ${site.honoredCountry.name}.`,
          "The Lotus Advisory Board, created in 1991, draws representatives from Asian and Pacific Islander communities across Los Angeles, so that the culture being honored has a hand in how it is presented.",
        ],
        link: { href: "/about", label: "How the honored culture is chosen" },
      },
      {
        id: "who-runs-it",
        question: "Who runs the festival?",
        answer: [
          "The City of Los Angeles Department of Recreation and Parks produces and presents it, and has done since 1972.",
          `It does so with ${site.nonprofit.legalName}, a ${site.nonprofit.status} (EIN ${site.nonprofit.ein}), which raises the funds and runs the dragon boat races.`,
        ],
        link: { href: "/about", label: "Who puts it on" },
      },
    ],
  },

  {
    id: "getting-there",
    title: "Getting there",
    lede: "Where the festival is, and how to arrive without circling the block.",
    items: [
      {
        id: "where",
        question: "Where is it?",
        answer: [
          `${site.venue.name}, ${site.venue.address}.`,
          "The festival takes over the park around the lake: the Main Stage, the Dragon Stage, the food court, the artisan village and the boats on the water.",
        ],
        link: { href: site.venue.mapUrl, label: "Open Echo Park Lake in maps" },
      },
      {
        id: "parking",
        question: "Where do I park?",
        answer: [
          "Street parking around Echo Park Lake is limited, and on the festival weekend it goes early. Plan on the shuttle instead.",
          "Free shuttles run between off-site parking lots and the festival across both days. The lots change from year to year, so they are published shortly before the festival, and staff are on site to point you to the lots and the shuttle stops.",
          "If you can walk, cycle or come by bus, that is the easiest way in.",
        ],
      },
      {
        id: "load-in",
        question: "I am exhibiting. How do I get my vehicle in?",
        answer: [
          "Loading and unloading instructions and parking passes are sent out after you are accepted, usually in June.",
          "Food booths are given parking for one vehicle near the food area. Performing groups are asked on the application how many parking passes they need. Do not plan on driving to your space on the day without a pass.",
        ],
        link: { href: "/get-involved", label: "Applying to take part" },
      },
    ],
  },

  {
    id: "food-and-drink",
    title: "Food and drink",
    lede: "The food court is one of the reasons people come, and it is the part of the festival with the most rules.",
    items: [
      {
        id: "food",
        question: "What is there to eat?",
        answer: [
          "A food court of around thirty vendors: booths, food trucks and carts, with customer seating alongside.",
          "Each vendor sets its own menu and its own prices. The mix changes every year, and the honored culture is usually well represented in it.",
        ],
      },
      {
        id: "alcohol",
        question: "Is there anywhere to get a drink?",
        answer: [
          "There is a Beer and Wine Garden. It is 21 and over, it is ticketed separately from the festival, and you will be asked for identification.",
        ],
      },
      {
        id: "waste",
        question: "What happens to all the waste?",
        answer: [
          "Food vendors are required to serve in compostable ware. No Styrofoam, no plastic tableware, no plastic straws.",
          "There is also an eco-friendly area among the booths, alongside the community booths, the non-profit community service booths and the health fair.",
        ],
        link: { href: "/food-booths", label: "The rules food vendors sign up to" },
      },
    ],
  },

  {
    id: "taking-part",
    title: "Taking part",
    lede: "Six ways in, all of them applications, and all of them opening in the spring.",
    items: [
      {
        id: "dragon-boats",
        question: "Can I take part in the dragon boat races?",
        answer: [
          "Yes. The races are entered by teams rather than by individuals, and teams come from workplaces, community groups, colleges, city departments, agencies and media outlets.",
          "Two boats race head to head, Red Dragon against Black Dragon, roughly the length of the lake and back. There are eight people to a boat: a drummer at the front setting the pace, six paddlers, and a steersman at the back. Boats are co-ed, with a minimum of four women in each.",
          "Bring rubber-soled shoes. Life jackets are supplied by Recreation and Parks. Team captains check in thirty minutes before their heat. Trophies go to Best Overall, Media, Corporate, City Family, Community, Elected Officials, Governmental Agencies, Snappiest Dressers, and the Turtle Team, for the slowest time of the day.",
          "Recent entry fees were $200 for media, corporate, government and elected teams, and $75 for community, college and university teams. The 2027 fees are not set.",
        ],
        link: { href: "/dragon-boats", label: "Enter a dragon boat team" },
      },
      {
        id: "vendor",
        question: "How do I become a vendor or take a boutique space?",
        answer: [
          "Through the vendor application, which opens in the spring. A space is ten feet by ten, and the boutiques sit together in the Lotus Artisan Village with more than twenty makers.",
          "In recent cycles a business or for-profit community service booth was $500, and an eco-friendly, city or government booth without sales was $100, as was a non-profit community service booth without sales. Add-ons ran to $350 for an adjacent ten by ten, $20 for an extra table, $5 for an extra chair and $20 for an extra 5-amp circuit. Treat all of that as indicative.",
          "If you are selling, a California seller's permit has to be displayed in your booth. The state sends staff to the festival, and they check. There is no sale of live animals, weapons or replicas, no medicinal items or therapeutic services, and no subletting your space.",
        ],
        link: { href: "/vendors", label: "Apply for a vendor or boutique space" },
      },
      {
        id: "food-vendor",
        question: "How do I get a food booth, truck or cart?",
        answer: [
          "Through the food application, which opens in the spring alongside the others. You will need a Los Angeles County temporary food facility permit, a Los Angeles Fire Department special permit, a photograph of your set-up and a full menu with prices.",
          "Recent fees ran from $600 for a cart and $1,000 for a food truck or a regular booth, up to $1,200 for a corner and $1,400 for a premium location, plus a $200 health permit and handling fee. A booth is a ten by ten space with a canopy, two chairs, one table, one light and one 5-amp plug.",
          "Everything you serve in has to be compostable. No Styrofoam, no plastic tableware, no straws.",
        ],
        link: { href: "/food-booths", label: "Apply for a food booth" },
      },
      {
        id: "performer",
        question: "How do I perform?",
        answer: [
          "Apply to perform on one of the two stages. Dance, instrumental music, song, acrobatics, martial arts and more are all welcome. Performances do not have to be Asian or Pacific Islander, though they are preferred.",
          "Slots run from 5 to 30 minutes including set-up, and the stage is 40 feet by 30. A video link helps and is encouraged, but it is not required. Send phonetic pronunciations of your performers' names so the MC says them correctly.",
          "Performing at the Lotus Festival is a volunteer commitment. Performers are not paid.",
        ],
        link: { href: "/performers", label: "Apply to perform" },
      },
      {
        id: "sponsor",
        question: "How do I sponsor the festival?",
        answer: [
          "Packages run from White Lotus, the title sponsorship, at $50,000; Pink Lotus, a venue area, at $20,000; Red Lotus at $10,000; and Green Lotus at $5,000. Speciality and in-kind packages start at $5,000 and include beverage, T-shirt and media sponsorships. All of them can be adapted.",
          "All sponsorship recognition is contingent upon Recreation and Parks Commission approval.",
        ],
        link: { href: "/sponsors", label: "Sponsorship packages" },
      },
      {
        id: "volunteer",
        question: "Can I volunteer?",
        answer: [
          "Yes, and the festival runs on it. Shifts are 7 to 11 in the morning, 11 to 3, 3 to 7, and 7 to 10 in the evening, on both days.",
          "Volunteers can be as young as 14. Anyone under 18 needs a parent or guardian to sign.",
        ],
        link: { href: "/get-involved", label: "Volunteer at the festival" },
      },
      {
        id: "deadlines",
        question: "When do applications close?",
        answer: [
          "The cycle runs through the spring: applications due around April, acceptance letters in May, payment in late May, and loading and parking details in June.",
          `The 2027 dates are not set yet. Write to ${site.contact.email} and we will tell you when they are.`,
        ],
        link: { href: "/get-involved", label: "Every way to take part" },
      },
    ],
  },

  {
    id: "accessibility",
    title: "Accessibility",
    lede: "What we can tell you now, and who to ask about the rest.",
    items: [
      {
        id: "ada",
        question: "Is the festival accessible?",
        answer: [
          "Yes. The Lotus Festival is ADA accessible.",
          "Parking, shuttles and drop-off are arranged fresh each year and published shortly before the festival, so the specifics for 2027 do not exist yet.",
          `If you need to know something particular in order to plan — the route from the shuttle stop, the ground underfoot, where the accessible restrooms are — write to ${site.contact.email}. We would rather answer you properly than guess in public.`,
        ],
      },
      {
        /*
         * The festival's own FAQ says only "ADA accessible" and says nothing
         * about service animals. This answer is the ADA itself rather than a
         * festival source: a City-run public event that is ADA accessible
         * admits service animals, and a disabled visitor should not have to
         * email to find that out. The pet question above stays unanswered
         * because no equivalent backstop exists for it.
         */
        id: "service-animals",
        question: "Are service animals welcome?",
        answer: ["Yes. A service animal is welcome anywhere in the festival that you are."],
      },
    ],
  },
];

/** Every question, flattened. Used to build the structured data. */
export const faqItems: readonly FaqItem[] = faqGroups.flatMap((group) => group.items);
