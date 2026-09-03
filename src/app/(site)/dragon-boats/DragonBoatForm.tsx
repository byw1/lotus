"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import { Checkbox, Field, Input, RadioGroup, Textarea, type Choice } from "@/components/ui/Field";
import { site } from "@/config/site";

/**
 * The dragon boat team application.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 */
const action = submitApplication.bind(null, "dragon-boat");

/**
 * The six categories teams are seeded into, and the ones the trophies are
 * given in. The values are the schema's — changing a label is safe, changing
 * a value is not.
 */
const categories: Choice[] = [
  {
    value: "community",
    label: "Community",
    description: "Neighbourhood groups, cultural organizations, clubs, congregations.",
  },
  { value: "corporate", label: "Corporate", description: "Businesses and corporate sponsors." },
  {
    value: "government",
    label: "Governmental agency",
    description: "City departments, and county, state or federal agencies.",
  },
  { value: "media", label: "Media", description: "Newsrooms, stations and publications." },
  {
    value: "elected",
    label: "Elected official",
    description: "A team entered by an elected official's office.",
  },
  {
    value: "college",
    label: "College or university",
    description: "Student groups, alumni associations and campus departments.",
  },
];

const days: Choice[] = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "either", label: "Either day", description: "The easiest one to schedule around." },
];

export function DragonBoatForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Send team application"
      pendingLabel="Sending…"
      successTitle="Your team is in"
      footnote={
        <>
          This is an expression of interest, not an entry. The race committee replies with the full
          rules, the paperwork, the entry fee and your heat time once the {site.editionOrdinal}{" "}
          festival schedule is set.
        </>
      }
    >
      {(state) => (
        <>
          <Field
            label="Team name"
            name="organization"
            required
            hint="What you want called out at the dock, and printed if you win something."
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
            legend="Category"
            name="category"
            required
            columns={2}
            options={categories}
            hint="Teams race others in their own category, and the trophies follow these names."
            error={state.errors?.category}
            defaultValue={state.values?.category}
          />

          <div className="grid gap-7 sm:grid-cols-2">
            <Field
              label="Team captain"
              name="contactName"
              required
              hint="Who checks in at the Dragon Boat booth on the day."
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

            <Field
              label="How many paddlers so far"
              name="crewCount"
              required
              hint="A boat holds eight. An honest number here is more useful than eight — the committee can help a short crew fill up."
              error={state.errors?.crewCount}
            >
              {(props) => (
                <Input
                  {...props}
                  name="crewCount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={40}
                  step={1}
                  defaultValue={state.values?.crewCount}
                  invalid={Boolean(state.errors?.crewCount)}
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
              hint="Race day runs to a schedule, and a phone is how captains get reached."
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
          </div>

          <RadioGroup
            legend="Which day would you rather race"
            name="preferredDay"
            required
            columns={2}
            options={days}
            hint="A preference, not a booking. Heats run across both days and the committee fits teams in where it can."
            error={state.errors?.preferredDay}
            defaultValue={state.values?.preferredDay}
          />

          <Checkbox
            name="racedBefore"
            label="We have raced at the Lotus Festival before"
            description="Useful for scheduling heats. Racing before has never been a requirement."
            defaultChecked={state.values?.racedBefore === "on"}
          />

          <Field
            label="Anything else"
            name="message"
            hint="Questions, a rough idea of when your people are free, or whether you need help finding paddlers."
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
