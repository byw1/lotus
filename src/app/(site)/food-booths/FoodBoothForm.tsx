"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import { Checkbox, Field, Input, RadioGroup, Textarea, type Choice } from "@/components/ui/Field";
import { site } from "@/config/site";

/**
 * The food court application.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 */
const action = submitApplication.bind(null, "food-booth");

/**
 * Booth, truck or cart. The values are the schema's — changing a label is
 * safe, changing a value silently drops the answer.
 *
 * The size limits are on the options rather than in a hint below them because
 * a truck that does not fit is the one thing on this form that cannot be
 * solved later.
 */
const serviceTypes: Choice[] = [
  {
    value: "booth",
    label: "A food booth",
    description: "A 10' × 10' in the food court, canopy provided. Recently $1,000 to $1,400.",
  },
  {
    value: "truck",
    label: "A food truck",
    description: "Recently $1,000, with a size limit of about 7' × 14'.",
  },
  {
    value: "cart",
    label: "A food cart",
    description: "Recently $600, with a size limit of about 120 square feet.",
  },
];

/**
 * Where an applicant is with the county permit.
 *
 * "We could use help" is a real option because the county form trips up
 * first-time vendors every year, and someone who says so in April can be
 * walked through it. Someone who says nothing finds out in June.
 */
const healthPermitStates: Choice[] = [
  {
    value: "current",
    label: "We hold a current health permit",
    description: "Or we have already filed for the temporary food facility permit.",
  },
  {
    value: "applying",
    label: "We are applying for one now",
    description: "Fine at this stage. It has to be in hand before the festival.",
  },
  {
    value: "need-help",
    label: "We could use help with it",
    description: "Say so here rather than later. The committee has done this many times.",
  },
];

export function FoodBoothForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Send food application"
      pendingLabel="Sending…"
      successTitle="Your application is in"
      footnote={
        <>
          No payment is taken here. Around thirty vendors make up the food court, so applying does
          not guarantee a booth at the {site.editionOrdinal} festival. Either way, you hear back.
        </>
      }
    >
      {(state) => (
        <>
          <Field
            label="Business name"
            name="organization"
            required
            hint="As you would like it printed in the program and on the food court signage."
            error={state.errors?.organization}
          >
            {(props) => (
              <Input
                {...props}
                name="organization"
                autoComplete="organization"
                defaultValue={state.values?.organization}
                invalid={Boolean(state.errors?.organization)}
                required
              />
            )}
          </Field>

          <RadioGroup
            legend="Booth, truck or cart"
            name="serviceType"
            required
            options={serviceTypes}
            hint="Measure a truck or cart before you choose. The food court is laid out to the foot months in advance."
            error={state.errors?.serviceType}
            defaultValue={state.values?.serviceType}
          />

          <Field
            label="What kind of food"
            name="cuisine"
            required
            hint="A line is enough — the kitchen you cook out of, or the tradition you cook in."
            error={state.errors?.cuisine}
          >
            {(props) => (
              <Input
                {...props}
                name="cuisine"
                maxLength={200}
                defaultValue={state.values?.cuisine}
                invalid={Boolean(state.errors?.cuisine)}
                required
              />
            )}
          </Field>

          <Field
            label="Dishes you would serve"
            name="menuHighlights"
            required
            hint="Your main items, and roughly what you would charge. The committee reads this most closely, because it tries not to duplicate what is already on the menu. Your full priced menu comes later, with the packet."
            error={state.errors?.menuHighlights}
          >
            {(props) => (
              <Textarea
                {...props}
                name="menuHighlights"
                rows={6}
                maxLength={1500}
                defaultValue={state.values?.menuHighlights}
                invalid={Boolean(state.errors?.menuHighlights)}
                required
              />
            )}
          </Field>

          <RadioGroup
            legend="LA County health permit"
            name="healthPermit"
            required
            options={healthPermitStates}
            hint="Every food vendor needs a temporary food facility permit from Los Angeles County, and the festival cannot waive it. You do not need it in hand to apply."
            error={state.errors?.healthPermit}
            defaultValue={state.values?.healthPermit}
          />

          <Checkbox
            name="hasFirePermit"
            label="We hold an LAFD special permit, or have applied for one"
            description="Needed by any booth cooking with open flame or propane. Tick it if it is in progress."
            defaultChecked={state.values?.hasFirePermit === "on"}
          />

          <Field
            label="Power and equipment"
            name="powerNeeds"
            hint="The booth comes with one 5-amp plug. Say what you plan to run — griddles, warmers, refrigeration, a generator of your own — so the committee can place you somewhere that works."
            error={state.errors?.powerNeeds}
          >
            {(props) => (
              <Textarea
                {...props}
                name="powerNeeds"
                rows={3}
                maxLength={300}
                defaultValue={state.values?.powerNeeds}
                invalid={Boolean(state.errors?.powerNeeds)}
              />
            )}
          </Field>

          <div className="grid gap-7 sm:grid-cols-2">
            <Field
              label="Contact name"
              name="contactName"
              required
              hint="Whoever the committee should write to, and who will be running the booth."
              error={state.errors?.contactName}
            >
              {(props) => (
                <Input
                  {...props}
                  name="contactName"
                  autoComplete="name"
                  defaultValue={state.values?.contactName}
                  invalid={Boolean(state.errors?.contactName)}
                  required
                />
              )}
            </Field>

            <Field label="Email" name="email" required error={state.errors?.email}>
              {(props) => (
                <Input
                  {...props}
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.values?.email}
                  invalid={Boolean(state.errors?.email)}
                  required
                />
              )}
            </Field>

            <Field
              label="Phone"
              name="phone"
              required
              hint="Used during load-in and through the weekend, when email is too slow."
              error={state.errors?.phone}
            >
              {(props) => (
                <Input
                  {...props}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={state.values?.phone}
                  invalid={Boolean(state.errors?.phone)}
                  required
                />
              )}
            </Field>

            <Field
              label="Years at the Lotus Festival"
              name="yearsParticipated"
              hint="How many times you have traded here before. Zero is a perfectly good answer."
              error={state.errors?.yearsParticipated}
            >
              {(props) => (
                <Input
                  {...props}
                  name="yearsParticipated"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={55}
                  step={1}
                  defaultValue={state.values?.yearsParticipated}
                  invalid={Boolean(state.errors?.yearsParticipated)}
                />
              )}
            </Field>

            <Field
              label="Website"
              name="website"
              hint="Starting with https://"
              error={state.errors?.website}
            >
              {(props) => (
                <Input
                  {...props}
                  name="website"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://"
                  defaultValue={state.values?.website}
                  invalid={Boolean(state.errors?.website)}
                />
              )}
            </Field>

            <Field
              label="Instagram"
              name="instagram"
              hint="Your handle, so the festival can tag you rather than guess."
              error={state.errors?.instagram}
            >
              {(props) => (
                <Input
                  {...props}
                  name="instagram"
                  placeholder="@"
                  defaultValue={state.values?.instagram}
                  invalid={Boolean(state.errors?.instagram)}
                />
              )}
            </Field>
          </div>

          <Field
            label="Anything else"
            name="message"
            hint="Questions about the permits, your serving ware, or anything about your set-up the committee should know."
            error={state.errors?.message}
          >
            {(props) => (
              <Textarea
                {...props}
                name="message"
                rows={5}
                maxLength={2000}
                defaultValue={state.values?.message}
                invalid={Boolean(state.errors?.message)}
              />
            )}
          </Field>
        </>
      )}
    </FormShell>
  );
}
