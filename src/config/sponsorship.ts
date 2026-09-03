/**
 * The sponsorship packages, as data.
 *
 * `/sponsors` renders this file and nothing else, so a committee member with
 * no React can retire a tier, change a price or fix a benefit by editing one
 * list. Three rules for editing:
 *
 * 1. Every tier is quoted from the festival's own sponsor packet. If a benefit
 *    is not in the packet it does not belong here — a sponsor reads this and
 *    then expects it in July.
 * 2. `compare` is the part that is promised at more than one tier, so the four
 *    cards can be read down a column. `also` is what only that tier gets.
 *    A key left out of `compare` renders as "not included" rather than being
 *    quietly dropped, because the gaps are how a sponsor picks a level.
 * 3. Nothing here is a commitment until the Recreation and Parks Commission
 *    approves it. See `RECOGNITION_APPROVAL_NOTE`, which every rendering of
 *    this data must show.
 */

/** The benefits that appear at more than one level, in the order shown. */
export type CompareKey = "banners" | "poleBanners" | "stage" | "booth" | "program" | "website";

export const compareRows: readonly { key: CompareKey; label: string }[] = [
  { key: "banners", label: "Banners on the grounds" },
  { key: "poleBanners", label: "Street pole banners" },
  { key: "stage", label: "Stage recognition" },
  { key: "booth", label: "Booth" },
  { key: "program", label: "In the program" },
  { key: "website", label: "On the website" },
];

export type SponsorTier = {
  /** Anchor id, and the value the enquiry form posts. Stable — links use it. */
  id: string;
  /** The flower, which is what the committee calls the tier in conversation. */
  flower: string;
  /** What the packet calls the level. */
  role: string;
  amount: string;
  /** One line on who this level is for. */
  summary: string;
  compare: Partial<Record<CompareKey, string>>;
  /** Everything at this level and no lower. */
  also: readonly string[];
};

export const sponsorTiers: readonly SponsorTier[] = [
  {
    id: "white-lotus",
    flower: "White Lotus",
    role: "Title sponsor",
    amount: "$50,000",
    summary:
      "One organization, named with the festival. The most visible thing a sponsor can do here, and the only level with exclusivity in its category.",
    compare: {
      banners: "Six 3' × 10' banners across the grounds",
      poleBanners: "Logo as title sponsor",
      stage: "Brand recognition on the Lotus Stage",
      booth: "10' × 20' in the Lotus Stage area",
      program: "Full-page advertisement and logo",
      website: "Full-page advertisement and logo, one year",
    },
    also: [
      "Product and service exclusivity",
      "Logo on all promotional materials",
      "Recognition during the festival",
      "A certificate from the Mayor and the Council office",
    ],
  },
  {
    id: "pink-lotus",
    flower: "Pink Lotus",
    role: "Venue area sponsor",
    amount: "$20,000",
    summary:
      "Your name on one part of the festival — an area people stand in, queue in and meet each other in across both days.",
    compare: {
      banners: "Three 3' × 10' banners",
      poleBanners: "Logo on the street pole banners",
      booth: "10' × 10' close to the Lotus Stage",
      program: "Half-page advertisement and logo",
      website: "Half-page advertisement and logo, one year",
    },
    also: [
      "Product and service exclusivity",
      "Recognition during the festival",
      "A certificate of recognition",
    ],
  },
  {
    id: "red-lotus",
    flower: "Red Lotus",
    role: "Corporate sponsor",
    amount: "$10,000",
    summary:
      "A booth on the grounds and your name through the weekend. The level most companies start at.",
    compare: {
      banners: "Two 3' × 10' banners at your booth",
      poleBanners: "Logo on the street pole banners",
      booth: "10' × 10' on the festival grounds",
      program: "Quarter-page advertisement and logo",
      website: "Quarter-page advertisement and logo, one year",
    },
    also: ["A certificate from the Council office"],
  },
  {
    id: "green-lotus",
    flower: "Green Lotus",
    role: "Corporate sponsor",
    amount: "$5,000",
    summary:
      "The smallest package that still puts you on the grounds with a booth, a banner and a page in the program.",
    compare: {
      banners: "One 3' × 10' banner",
      booth: "10' × 10' on the festival grounds",
      program: "Quarter-page advertisement and logo",
      website: "Quarter-page advertisement and logo, one year",
    },
    also: [],
  },
];

/** True of all four tiers, so it is said once rather than four times. */
export const SHARED_TIER_BENEFIT = "A Lotus Festival award";

export const SPECIALITY_FROM = "$5,000";

/**
 * The parts of the festival that can carry a sponsor's name on their own,
 * without taking a whole tier. Packages start at `SPECIALITY_FROM`.
 */
export const specialityAreas: readonly { name: string; body: string }[] = [
  {
    name: "The opening ceremony",
    body: "Saturday at noon, when the festival opens and the dragon boats are blessed.",
  },
  {
    name: "The Lotus Stage",
    body: "The main stage, and most of the performance program across the two days.",
  },
  {
    name: "The Dragon Stage",
    body: "The children's stage — cultural dance, storytelling, music and activities for kids.",
  },
  {
    name: "The press luncheon",
    body: "About a month before the festival, for the press, sponsors and elected officials.",
  },
  {
    name: "The eco-friendly area",
    body: "Where people come to find out how to live a little more lightly in Los Angeles.",
  },
  {
    name: "The vendors",
    body: "The boutiques, the artisan village and the community booths around the lake.",
  },
];

/**
 * In-kind packages. These are goods and services rather than a cheque, and
 * the committee values them the same way.
 */
export const inKindPackages: readonly { name: string; body: string }[] = [
  {
    name: "Beverage sponsor",
    body: "The official beverage of the festival, with a banner in the VIP and volunteer areas, announcements from the stage, and additional social advertising.",
  },
  {
    name: "T-shirt sponsor",
    body: "Your logo on the festival T-shirt, worn by more than thirty volunteers and staff across both days and seen everywhere on the grounds.",
  },
  {
    name: "Media sponsor",
    body: "Exclusive television, radio or press partnership, arranged with the committee around what your newsroom can actually carry.",
  },
];

/**
 * Non-negotiable, and required on every page that describes a package. The
 * festival is produced by a City department: the Commission approves what a
 * sponsor's money is recognized with, and nobody on the committee can promise
 * around that.
 */
export const RECOGNITION_APPROVAL_NOTE =
  "All sponsorship recognition is contingent upon Recreation and Parks Commission approval.";
