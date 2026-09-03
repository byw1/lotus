"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import { Checkbox, Field, Input, RadioGroup, Textarea, type Choice } from "@/components/ui/Field";
import { site } from "@/config/site";

/**
 * The vendor, boutique and community booth application.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 */
const action = submitApplication.bind(null, "vendor");

/**
 * The six booth types, in the order the page describes them.
 *
 * The values are the schema's — changing a label is safe, changing a value
 * silently drops the answer. The descriptions carry the fee tier because this
 * is the question that decides what a vendor pays, and a reader who arrived
 * from a link rather than the top of the page will not have seen the table.
 */
const boothTypes: Choice[] = [
  {
    value: "boutique",
    label: "Boutique",
    description: "Selling goods across the two days. Recently $500.",
  },
  {
    value: "artisan",
    label: "Artisan",
    description: "Making your work in front of people in the Lotus Artisan Village. Recently $500.",
  },
  {
    value: "business",
    label: "Business or community booth",
    description: "A business or for-profit organization taking sales or sign-ups. Recently $500.",
  },
  {
    value: "nonprofit",
    label: "Non-profit community service",
    description: "Information, brochures and referrals, with no sales. Recently $100.",
  },
  {
    value: "eco",
    label: "Eco-friendly organization",
    description: "The eco-friendly area, information only. Recently $100.",
  },
  {
    value: "government",
    label: "City or government agency",
    description: "A department or agency without sales. Recently $100.",
  },
];

/**
 * Where an applicant is with a seller's permit.
 *
 * Asked plainly and early, because the state checks permits on the grounds and
 * a vendor who finds this out in July has already paid for a booth they cannot
 * trade from.
 */
const sellersPermit: Choice[] = [
  { value: "yes", label: "We hold a current California seller's permit" },
  {
    value: "applying",
    label: "We are applying for one",
    description: "Fine at this stage. It has to be in the booth by the festival.",
  },
  {
    value: "not-selling",
    label: "We are not selling anything",
    description: "Information booths, non-profits and agencies without sales.",
  },
];

export function VendorForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Send booth application"
      pendingLabel="Sending…"
      successTitle="Your application is in"
      footnote={
        <>
          No payment is taken here. If a booth is offered, the vendor committee sends the full
          packet — fee, paperwork, booth number and load-in — for the {site.editionOrdinal}{" "}
          festival.
        </>
      }
    >
      {(state) => (
        <>
          <Field
            label="Business or organization name"
            name="organization"
            required
            hint="As you would like it printed in the program."
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
            legend="What kind of booth"
            name="boothType"
            required
            columns={2}
            options={boothTypes}
            hint="Pick the closest fit. The committee will move you if another area suits you better, and will say so before anything is owed."
            error={state.errors?.boothType}
            defaultValue={state.values?.boothType}
          />

          <Field
            label="What you would sell or show"
            name="productDescription"
            required
            hint="What you make, what it is made of, and roughly what it costs. This is the part the committee reads most closely — the grounds are laid out to avoid two booths selling the same thing."
            error={state.errors?.productDescription}
          >
            {(props) => (
              <Textarea
                {...props}
                name="productDescription"
                rows={6}
                maxLength={1500}
                defaultValue={state.values?.productDescription}
                invalid={Boolean(state.errors?.productDescription)}
                required
              />
            )}
          </Field>

          <RadioGroup
            legend="California seller's permit"
            name="hasSellersPermit"
            required
            options={sellersPermit}
            hint="A copy has to be posted in the booth, and the state has staff on the grounds during the festival. Nobody sells without one."
            error={state.errors?.hasSellersPermit}
            defaultValue={state.values?.hasSellersPermit}
          />

          <div className="grid gap-7 sm:grid-cols-2">
            <Field
              label="Contact name"
              name="contactName"
              required
              hint="Whoever the committee should write to, and who will be at the booth."
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
              hint="Used in the week of the festival, when email is too slow."
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
              hint="How many times you have had a booth before. Zero is a perfectly good answer — the committee balances returning vendors against new ones."
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

          <fieldset>
            <legend className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
              <span>Anything extra</span>
              <span className="text-fg-subtle text-[11px] font-normal tracking-wide uppercase">
                Optional
              </span>
            </legend>
            <p className="text-fg-muted mt-2 text-[13px] leading-relaxed">
              Both of these are priced separately and both have to be arranged in advance — the
              grounds are laid out months before anyone arrives.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Checkbox
                name="needsElectricity"
                label="We need more power"
                description="Beyond the one 5-amp plug in the booth."
                defaultChecked={state.values?.needsElectricity === "on"}
              />
              <Checkbox
                name="additionalSpace"
                label="We would like a second 10' × 10'"
                description="An adjacent space, recently $350."
                defaultChecked={state.values?.additionalSpace === "on"}
              />
            </div>
          </fieldset>

          <Field
            label="Anything else"
            name="message"
            hint="Questions, what you need power for, or anything about your set-up the committee should know."
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
