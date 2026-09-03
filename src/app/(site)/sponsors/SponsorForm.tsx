"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import { Field, Input, RadioGroup, Textarea, type Choice } from "@/components/ui/Field";
import { RECOGNITION_APPROVAL_NOTE } from "@/config/sponsorship";

/**
 * The sponsorship enquiry.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 */
const action = submitApplication.bind(null, "sponsor");

/**
 * The levels, labelled with the flower and the figure so the choice can be
 * made without scrolling back up to the cards. Values are the schema's;
 * `supporting` covers the Green Lotus tier and the speciality areas, which
 * start at the same figure.
 */
const levels: Choice[] = [
  { value: "title", label: "White Lotus — title sponsor", description: "$50,000" },
  { value: "venue", label: "Pink Lotus — venue area sponsor", description: "$20,000" },
  { value: "corporate", label: "Red Lotus — corporate sponsor", description: "$10,000" },
  {
    value: "supporting",
    label: "Green Lotus or a speciality area",
    description: "$5,000, and speciality areas from $5,000",
  },
  {
    value: "in-kind",
    label: "In-kind",
    description: "Beverage, T-shirt, media, or goods and services of another kind.",
  },
  {
    value: "unsure",
    label: "Not sure yet",
    description: "Tell us your budget or your aim and the committee will suggest a fit.",
  },
];

export function SponsorForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Start the conversation"
      pendingLabel="Sending…"
      successTitle="Thank you — we will be in touch"
      footnote={<>{RECOGNITION_APPROVAL_NOTE}</>}
    >
      {(state) => (
        <>
          <Field
            label="Company or organization"
            name="organization"
            required
            hint="The name as it would appear in the program, if this goes ahead."
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

          <div className="grid gap-7 sm:grid-cols-2">
            <Field label="Your name" name="contactName" required error={state.errors?.contactName}>
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

            <Field
              label="Your role"
              name="role"
              hint="So the committee knows whether it is talking to the decision or about it."
              error={state.errors?.role}
            >
              {(props) => (
                <Input
                  {...props}
                  name="role"
                  autoComplete="organization-title"
                  defaultValue={state.values?.role}
                  invalid={Boolean(state.errors?.role)}
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

            <Field label="Phone" name="phone" required error={state.errors?.phone}>
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
          </div>

          <Field label="Website" name="website" error={state.errors?.website}>
            {(props) => (
              <Input
                {...props}
                name="website"
                type="url"
                inputMode="url"
                placeholder="https://"
                autoComplete="url"
                defaultValue={state.values?.website}
                invalid={Boolean(state.errors?.website)}
              />
            )}
          </Field>

          <RadioGroup
            legend="The level you would like to talk about"
            name="interest"
            required
            columns={2}
            options={levels}
            hint="Every package is customisable, so this is a starting point rather than an order."
            error={state.errors?.interest}
            defaultValue={state.values?.interest}
          />

          <Field
            label="If you are offering something in kind, what is it"
            name="inKindDescription"
            hint="Goods, services, media, printing, product — whatever you have. The committee values in-kind support the same way it values a cheque."
            error={state.errors?.inKindDescription}
          >
            {(props) => (
              <Textarea
                {...props}
                name="inKindDescription"
                rows={4}
                defaultValue={state.values?.inKindDescription}
                invalid={Boolean(state.errors?.inKindDescription)}
              />
            )}
          </Field>

          <Field
            label="Anything else"
            name="message"
            hint="What you are hoping to get out of it, who you want to reach, or a question about how any of this works."
            error={state.errors?.message}
          >
            {(props) => (
              <Textarea
                {...props}
                name="message"
                rows={5}
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
