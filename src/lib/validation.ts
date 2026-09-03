import { z } from "zod";

/**
 * One schema per form, used on the client for instant feedback and again on
 * the server before anything is sent anywhere. The server run is the one that
 * counts: a client can post whatever it likes.
 *
 * The fields mirror the festival's real paper applications so that a
 * submission here contains everything the committee needs to shortlist. What
 * this site collects is an application; the full packet — permits, insurance,
 * payment — follows by email once a booth is offered.
 */

/** Trim first, so a field of spaces fails `min(1)` instead of passing it. */
const text = (max = 200) => z.string().trim().max(max);

const required = (label: string, max = 200) =>
  text(max).min(1, { message: `${label} is required.` });

const email = z
  .string()
  .trim()
  .min(1, { message: "Email address is required." })
  .max(254)
  .email({ message: "That does not look like an email address." })
  .toLowerCase();

/**
 * Deliberately permissive. Real phone numbers arrive as "(213) 485-1310",
 * "213.485.1310", "+1 213 485 1310" and worse, and rejecting a vendor's
 * application over punctuation is a far bigger failure than storing an
 * untidy string.
 */
const phone = text(40)
  .min(7, { message: "That phone number looks too short." })
  .regex(/^[0-9+().\-\s x]+$/i, { message: "Use digits, spaces, and + ( ) - only." });

const optionalPhone = z.union([z.literal(""), phone]).optional();

const url = z
  .union([
    z.literal(""),
    z.string().trim().url({ message: "Enter a full URL, starting with https://" }).max(300),
  ])
  .optional();

/**
 * Every public form carries these. See `src/lib/spam.ts` for what they do —
 * in short, `homepage` is a honeypot that real people never fill in, and
 * `startedAt` catches a bot that submits faster than a human can read.
 *
 * The honeypot is deliberately NOT called `website`: several of these forms
 * ask an applicant for their real website, and a name collision would mean
 * every vendor who typed one was silently rejected as a bot. It is also not
 * called `email` or `name` for the same reason. `homepage` is plausible enough
 * that a naive scraper fills it, and used by nothing on this site.
 */
export const antiSpamFields = {
  /*
   * Accepted here, judged in `lib/spam.ts`.
   *
   * Rejecting a filled honeypot at the schema level would surface it as a
   * visible "please check the highlighted fields" against a field nobody can
   * see — baffling for the real person whose password manager decided to fill
   * it, and a free hint to everyone else about which field is the trap. The
   * spam check instead answers a filled honeypot with an ordinary success
   * message, so an automated submitter learns nothing.
   */
  homepage: z.string().optional(),
  startedAt: z.coerce.number().optional(),
  turnstileToken: z.string().optional(),
};

const contactBlock = {
  contactName: required("A contact name"),
  email,
  phone,
};

const organizationBlock = {
  organization: required("An organization or business name"),
  website: url,
  instagram: text(80).optional(),
  /**
   * The paper forms ask this, and the committee uses it to balance returning
   * vendors against new ones.
   */
  yearsParticipated: z.coerce
    .number()
    .int()
    .min(0)
    .max(55, { message: "The festival has not run that many times." })
    .optional(),
};

export const newsletterSchema = z.object({
  email,
  firstName: text(80).optional(),
  ...antiSpamFields,
});

export const volunteerSchema = z.object({
  ...contactBlock,
  organization: text(200).optional(),
  /** Matches the shift grid on the festival's volunteer form. */
  shifts: z
    .array(
      z.enum([
        "sat-morning",
        "sat-midday",
        "sat-afternoon",
        "sat-evening",
        "sun-morning",
        "sun-midday",
        "sun-afternoon",
        "sun-evening",
      ]),
    )
    .min(1, { message: "Choose at least one shift you could cover." }),
  groupSize: z.coerce.number().int().min(1).max(500).optional(),
  /**
   * The festival accepts volunteers from 14 up, with a guardian signature
   * required under 18. Asking here means the committee knows in advance.
   */
  hasMinors: z.boolean().optional(),
  interests: z.array(z.string().max(60)).max(12).optional(),
  message: text(2000).optional(),
  ...antiSpamFields,
});

export const vendorSchema = z.object({
  ...contactBlock,
  ...organizationBlock,
  boothType: z.enum(["business", "boutique", "artisan", "nonprofit", "eco", "government"], {
    message: "Choose the kind of booth you are applying for.",
  }),
  productDescription: required("A description of what you sell", 1500),
  /**
   * California requires a seller's permit to sell at the festival, and the
   * state posts staff on site. Asking up front saves an applicant from
   * discovering it the week of.
   */
  hasSellersPermit: z.enum(["yes", "applying", "not-selling"], {
    message: "Tell us where you are with a seller's permit.",
  }),
  needsElectricity: z.boolean().optional(),
  additionalSpace: z.boolean().optional(),
  message: text(2000).optional(),
  ...antiSpamFields,
});

export const foodBoothSchema = z.object({
  ...contactBlock,
  ...organizationBlock,
  serviceType: z.enum(["booth", "truck", "cart"], {
    message: "Choose a booth, a truck, or a cart.",
  }),
  cuisine: required("A description of your cuisine", 200),
  menuHighlights: required("A few of the dishes you would serve", 1500),
  /** Los Angeles County requires this, and the festival cannot waive it. */
  healthPermit: z.enum(["current", "applying", "need-help"], {
    message: "Tell us where you are with a health permit.",
  }),
  hasFirePermit: z.boolean().optional(),
  powerNeeds: text(300).optional(),
  message: text(2000).optional(),
  ...antiSpamFields,
});

export const performerSchema = z.object({
  ...contactBlock,
  organization: required("A group or performer name"),
  website: url,
  instagram: text(80).optional(),
  videoUrl: url,
  performanceType: z.enum(["dance", "music", "song", "martial-arts", "acrobatics", "other"], {
    message: "Choose the kind of performance.",
  }),
  /**
   * The festival honors a different culture each year and programs across all
   * of Asia and the Pacific. Performances need not be from the honored
   * country, and the form should not imply otherwise.
   */
  culturalHeritage: text(200).optional(),
  description: required("A short description of your act", 1500),
  groupSize: z.coerce
    .number({ message: "How many people are in your group?" })
    .int()
    .min(1)
    .max(300),
  durationMinutes: z.enum(["5", "10", "15", "20", "25", "30"], {
    message: "Choose how long you would perform.",
  }),
  availability: z
    .array(z.enum(["saturday", "sunday"]))
    .min(1, { message: "Choose at least one day." }),
  technicalNeeds: text(1000).optional(),
  ...antiSpamFields,
});

export const sponsorSchema = z.object({
  ...contactBlock,
  organization: required("A company or organization name"),
  website: url,
  role: text(120).optional(),
  interest: z.enum(["title", "venue", "corporate", "supporting", "in-kind", "unsure"], {
    message: "Choose the level you would like to talk about.",
  }),
  inKindDescription: text(1000).optional(),
  message: text(2000).optional(),
  ...antiSpamFields,
});

export const dragonBoatSchema = z.object({
  ...contactBlock,
  organization: required("A team name"),
  category: z.enum(["community", "corporate", "government", "media", "elected", "college"], {
    message: "Choose the category your team races in.",
  }),
  /**
   * Eight to a boat: one drummer, six paddlers, one steersman. Teams are
   * co-ed, with at least four women per boat.
   */
  crewCount: z.coerce
    .number({ message: "How many paddlers do you have so far?" })
    .int()
    .min(1)
    .max(40),
  preferredDay: z.enum(["saturday", "sunday", "either"], {
    message: "Choose a day, or either.",
  }),
  racedBefore: z.boolean().optional(),
  message: text(2000).optional(),
  ...antiSpamFields,
});

export const contactSchema = z.object({
  ...contactBlock,
  phone: optionalPhone,
  subject: text(160).optional(),
  message: required("A message", 4000),
  ...antiSpamFields,
});

/** Every form the site accepts, keyed by the slug used in its URL and email. */
export const formSchemas = {
  volunteer: volunteerSchema,
  vendor: vendorSchema,
  "food-booth": foodBoothSchema,
  performer: performerSchema,
  sponsor: sponsorSchema,
  "dragon-boat": dragonBoatSchema,
  contact: contactSchema,
} as const;

export type FormKind = keyof typeof formSchemas;

export const formLabels: Record<FormKind, string> = {
  volunteer: "Volunteer",
  vendor: "Vendor & boutique",
  "food-booth": "Food booth",
  performer: "Performer",
  sponsor: "Sponsor",
  "dragon-boat": "Dragon boat team",
  contact: "General enquiry",
};

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type VendorInput = z.infer<typeof vendorSchema>;
export type FoodBoothInput = z.infer<typeof foodBoothSchema>;
export type PerformerInput = z.infer<typeof performerSchema>;
export type SponsorInput = z.infer<typeof sponsorSchema>;
export type DragonBoatInput = z.infer<typeof dragonBoatSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Flatten Zod's error tree into `{ fieldName: firstMessage }`, which is what
 * the form components render next to each input.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    out[key] ??= issue.message;
  }
  return out;
}
