import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { z } from "zod";

import {
  antiSpamFields,
  contactSchema,
  dragonBoatSchema,
  foodBoothSchema,
  formLabels,
  formSchemas,
  newsletterSchema,
  performerSchema,
  sponsorSchema,
  vendorSchema,
  volunteerSchema,
} from "../src/lib/validation";

/**
 * The forms are the only thing on this site that can lose a real person's
 * work. These tests are about that: that a valid application is never
 * rejected, and that an invalid one never reaches the committee's inbox
 * looking complete.
 */

const contact = {
  contactName: "Mei Chen",
  email: "mei@example.org",
  phone: "(213) 555-0142",
};

describe("shared field rules", () => {
  it("accepts the shapes real phone numbers arrive in", () => {
    for (const phone of [
      "(213) 555-0142",
      "213-555-0142",
      "213.555.0142",
      "+1 213 555 0142",
      "2135550142",
      "213 555 0142 x22",
    ]) {
      const result = contactSchema.safeParse({ ...contact, phone, message: "Hello there." });
      assert.ok(result.success, `rejected a real phone number: ${phone}`);
    }
  });

  it("trims, so a field of spaces is not treated as filled in", () => {
    const result = contactSchema.safeParse({ ...contact, message: "   " });
    assert.equal(result.success, false);
  });

  it("lowercases email so the same person is not added to the list twice", () => {
    const result = newsletterSchema.safeParse({ email: "  Mei@Example.ORG " });
    assert.ok(result.success);
    assert.equal(result.data.email, "mei@example.org");
  });

  it("rejects an address that is not one", () => {
    for (const email of ["not-an-email", "@example.org", "mei@", ""]) {
      assert.equal(newsletterSchema.safeParse({ email }).success, false, email);
    }
  });
});

describe("the honeypot field name", () => {
  /**
   * Regression test. The honeypot was originally called `website`, which is
   * also the name of the field several of these forms use to ask an applicant
   * for their actual website. Spread order meant the honeypot silently won,
   * so every vendor who filled in their website was rejected as a bot.
   */
  it("does not collide with any real field on any form", () => {
    const honeypotNames = Object.keys(antiSpamFields);
    for (const [kind, schema] of Object.entries(formSchemas)) {
      const shape = Object.keys((schema as { shape: Record<string, unknown> }).shape);
      for (const name of honeypotNames) {
        const collisions = shape.filter((field) => field === name).length;
        assert.equal(collisions, 1, `${kind}: '${name}' appears ${collisions} times`);
      }
    }
  });

  it("still lets a vendor submit their real website", () => {
    const result = vendorSchema.safeParse({
      ...contact,
      organization: "Liuan's Jade",
      website: "https://example.org",
      boothType: "boutique",
      productDescription: "Hand-carved jade pendants and beadwork.",
      hasSellersPermit: "yes",
    });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
    assert.equal(result.data.website, "https://example.org");
  });

  it("parses a filled honeypot rather than rejecting it here", async () => {
    // The schema deliberately lets it through: `lib/spam.ts` is the single
    // place that judges it, and it answers with an ordinary success message so
    // an automated submitter learns nothing about which field is the trap.
    const result = newsletterSchema.safeParse({
      email: "bot@example.org",
      homepage: "https://spam.example",
    });
    assert.ok(result.success);

    const { checkSubmission } = await import("../src/lib/spam");
    assert.deepEqual(await checkSubmission({ honeypot: result.data.homepage }), {
      ok: false,
      reason: "honeypot",
    });
  });
});

describe("the submit-timing field", () => {
  it("reads an empty timestamp as absent, not as zero, on every form", () => {
    // The hidden input ships empty and is stamped by an effect on mount. When
    // JavaScript never runs it stays empty, and coercing that to 0 made every
    // such submission look like a replay from 1970.
    //
    // Checked against each form's own field rather than through a whole
    // payload, so this cannot pass by accident because some other field failed.
    for (const [kind, schema] of Object.entries(formSchemas)) {
      const field = (schema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape.startedAt;
      assert.ok(field, `${kind} has no startedAt field`);
      for (const empty of ["", undefined, null]) {
        const result = field.safeParse(empty);
        assert.ok(result.success, `${kind} rejected an empty startedAt`);
        assert.equal(result.data, undefined, `${kind} parsed ${JSON.stringify(empty)} to a number`);
      }
    }
  });

  it("keeps a real timestamp", () => {
    const result = newsletterSchema.safeParse({ email: "a@b.org", startedAt: "1788425749078" });
    assert.ok(result.success);
    assert.equal(result.data.startedAt, 1788425749078);
  });
});

describe("every form", () => {
  it("has a human-readable label", () => {
    for (const kind of Object.keys(formSchemas)) {
      assert.ok(formLabels[kind as keyof typeof formLabels], `no label for ${kind}`);
    }
  });

  it("requires an email address, so the committee can always reply", () => {
    for (const [kind, schema] of Object.entries(formSchemas)) {
      const result = schema.safeParse({});
      assert.equal(result.success, false, kind);
      const failedOnEmail = result.error!.issues.some((i) => i.path[0] === "email");
      assert.ok(failedOnEmail, `${kind} does not require an email address`);
    }
  });
});

describe("volunteer", () => {
  const valid = {
    ...contact,
    shifts: ["sat-morning", "sun-afternoon"],
  };

  it("accepts a complete application", () => {
    assert.ok(volunteerSchema.safeParse(valid).success);
  });

  it("insists on at least one shift", () => {
    const result = volunteerSchema.safeParse({ ...valid, shifts: [] });
    assert.equal(result.success, false);
  });

  it("rejects a shift that is not on the rota", () => {
    const result = volunteerSchema.safeParse({ ...valid, shifts: ["sat-midnight"] });
    assert.equal(result.success, false);
  });
});

describe("dragon boat", () => {
  it("accepts a team", () => {
    const result = dragonBoatSchema.safeParse({
      ...contact,
      organization: "Council District 13",
      category: "government",
      crewCount: 8,
      preferredDay: "saturday",
    });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  it("rejects a crew count that cannot be a crew", () => {
    for (const crewCount of [0, -3, 500]) {
      const result = dragonBoatSchema.safeParse({
        ...contact,
        organization: "Test",
        category: "community",
        crewCount,
        preferredDay: "either",
      });
      assert.equal(result.success, false, `accepted crewCount ${crewCount}`);
    }
  });
});

describe("performer", () => {
  it("accepts a group", () => {
    const result = performerSchema.safeParse({
      ...contact,
      organization: "Northern Shaolin Kung Fu Association",
      performanceType: "martial-arts",
      description: "A demonstration of northern Shaolin forms and weapons.",
      groupSize: 12,
      durationMinutes: "15",
      availability: ["saturday"],
    });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  it("only offers the slot lengths the festival actually schedules", () => {
    const result = performerSchema.safeParse({
      ...contact,
      organization: "Test",
      performanceType: "dance",
      description: "A dance.",
      groupSize: 4,
      durationMinutes: "45",
      availability: ["sunday"],
    });
    assert.equal(result.success, false);
  });
});

describe("food booth and sponsor", () => {
  it("accepts a food vendor", () => {
    const result = foodBoothSchema.safeParse({
      ...contact,
      organization: "Baobao Express",
      serviceType: "booth",
      cuisine: "Northern Chinese street food",
      menuHighlights: "Scallion pancakes, cumin lamb skewers, hand-pulled noodles.",
      healthPermit: "current",
    });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  it("accepts a sponsor enquiry", () => {
    const result = sponsorSchema.safeParse({
      ...contact,
      organization: "A Local Credit Union",
      interest: "corporate",
    });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });
});
