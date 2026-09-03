"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import {
  Checkbox,
  CheckboxGroup,
  Field,
  Input,
  Textarea,
  type Choice,
} from "@/components/ui/Field";

/**
 * The volunteer sign-up.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 */
const action = submitApplication.bind(null, "volunteer");

/**
 * The eight shifts.
 *
 * The values are `volunteerSchema`'s enum, exactly — anything else is dropped
 * on the floor by the server with no way for the person filling this in to
 * tell. The labels carry the clock times because this is the one place on the
 * site where somebody has to commit to a specific four hours, and nobody
 * should have to scroll back up to find out what "midday" means.
 */
const shifts: Choice[] = [
  {
    value: "sat-morning",
    label: "Saturday morning · 7am–11am",
    description: "Set-up, before the gates open.",
  },
  {
    value: "sat-midday",
    label: "Saturday midday · 11am–3pm",
    description: "The opening ceremony at noon, and the first crowd.",
  },
  {
    value: "sat-afternoon",
    label: "Saturday afternoon · 3pm–7pm",
    description: "The long middle of the day.",
  },
  {
    value: "sat-evening",
    label: "Saturday evening · 7pm–10pm",
    description: "The end of the first day.",
  },
  {
    value: "sun-morning",
    label: "Sunday morning · 7am–11am",
    description: "Set-up again, for the second day.",
  },
  {
    value: "sun-midday",
    label: "Sunday midday · 11am–3pm",
    description: "The second day opens.",
  },
  {
    value: "sun-afternoon",
    label: "Sunday afternoon · 3pm–7pm",
    description: "The last full stretch of the festival.",
  },
  {
    value: "sun-evening",
    label: "Sunday evening · 7pm–10pm",
    description: "Tear-down, and the closing ceremony.",
  },
];

/**
 * Where someone would like to be put.
 *
 * `interests` is a free-string array in the schema rather than an enum, so
 * these values are the labels themselves. None of them may contain a comma:
 * the server echoes array values back as a comma-joined string, and a comma
 * inside a value would split it in two when a failed submission is redrawn.
 */
const interests: Choice[] = [
  {
    value: "Information booths",
    label: "Information booths",
    description: "Answering the same six questions all day, well.",
  },
  {
    value: "Set-up and tear-down",
    label: "Set-up and tear-down",
    description: "Canopies, tables, chairs, signage. Early starts and late finishes.",
  },
  {
    value: "The children's area",
    label: "The children's area",
    description: "Crafts, face painting, the jumpers and the rock wall.",
  },
  {
    value: "Stage support",
    label: "Stage support",
    description: "Looking after performers at the Main Stage and the Dragon Stage.",
  },
  {
    value: "The food court",
    label: "The food court",
    description: "Queue lines, seating, and keeping the tables turning over.",
  },
  {
    value: "Grounds and clean-up",
    label: "Grounds and clean-up",
    description: "Bins, recycling, and leaving the park as we found it.",
  },
];

export function VolunteerForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Sign me up"
      pendingLabel="Sending…"
      successTitle="Thank you — you are on the list"
      footnote="Nothing here is a contract. The committee will confirm your shift closer to the weekend, and you can tell us if things change."
    >
      {(state) => (
        <>
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
              hint="On the weekend itself this is how a coordinator finds you."
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
              label="Group, school or employer"
              name="organization"
              hint="If you are coming with one. Leave it blank if you are coming on your own."
              error={state.errors?.organization}
            >
              {(props) => (
                <Input
                  {...props}
                  name="organization"
                  autoComplete="organization"
                  defaultValue={state.values?.organization}
                  invalid={Boolean(state.errors?.organization)}
                />
              )}
            </Field>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <Field
              label="How many of you"
              name="groupSize"
              required
              hint="Counting yourself. One is the right answer if you are coming alone."
              error={state.errors?.groupSize}
            >
              {(props) => (
                <Input
                  {...props}
                  name="groupSize"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={500}
                  step={1}
                  required
                  /*
                   * Pre-filled, and put back if it is emptied, because the
                   * shared validator coerces a blank number field to 0 and
                   * then rejects it as too small. The field is optional to the
                   * schema but must never actually arrive empty, so the form
                   * refuses to let it.
                   */
                  defaultValue={state.values?.groupSize ?? "1"}
                  onBlur={(event) => {
                    if (event.currentTarget.value.trim() === "") event.currentTarget.value = "1";
                  }}
                  invalid={Boolean(state.errors?.groupSize)}
                />
              )}
            </Field>

            <div className="flex items-end">
              <Checkbox
                name="hasMinors"
                label="Some of us are under 18"
                description="The festival takes volunteers from 14. A parent or guardian signs for anyone under 18, so it helps the committee to know in advance."
                defaultChecked={state.values?.hasMinors === "on"}
                className="w-full"
              />
            </div>
          </div>

          <CheckboxGroup
            legend="Shifts you could cover"
            name="shifts"
            required
            columns={2}
            options={shifts}
            hint="Choose as many as you like. One shift is a real contribution and plenty of people only do one."
            error={state.errors?.shifts}
            defaultSelected={state.values?.shifts?.split(",").filter(Boolean) ?? []}
          />

          <CheckboxGroup
            legend="Where you would rather be"
            name="interests"
            columns={2}
            options={interests}
            hint="A preference, not a request the committee can always meet. Leave it blank and you will be put where the gap is."
            error={state.errors?.interests}
            defaultSelected={state.values?.interests?.split(",").filter(Boolean) ?? []}
          />

          <Field
            label="Anything else"
            name="message"
            hint="Languages you speak, access needs, a shift you can only do half of, or a question about how any of this works."
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
