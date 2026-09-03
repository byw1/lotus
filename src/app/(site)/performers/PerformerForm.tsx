"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import {
  CheckboxGroup,
  Field,
  Input,
  RadioGroup,
  Select,
  Textarea,
  type Choice,
} from "@/components/ui/Field";

/**
 * The performer application.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 */
const action = submitApplication.bind(null, "performer");

/**
 * The kinds of act the festival programs, in the words its own entertainment
 * application uses. Labels can be reworded; the values are the schema's and
 * cannot.
 */
const performanceTypes: Choice[] = [
  { value: "dance", label: "Dance", description: "Traditional, folk, classical, contemporary." },
  {
    value: "music",
    label: "Instrumental music",
    description: "Ensembles, soloists, drumming, anything played rather than sung.",
  },
  { value: "song", label: "Song", description: "Choirs, vocal groups, singers." },
  {
    value: "martial-arts",
    label: "Martial arts",
    description: "Demonstration forms, lion dance troupes, school showcases.",
  },
  { value: "acrobatics", label: "Acrobatics", description: "Tumbling, aerial and circus work." },
  {
    value: "other",
    label: "Something else",
    description: "Storytelling, puppetry, spoken word — describe it below.",
  },
];

/** Both days. Most groups can only make one, and that is fine. */
const days: Choice[] = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

/** Minutes on stage, set-up included. The application offers these six. */
const durations = ["5", "10", "15", "20", "25", "30"] as const;

export function PerformerForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Send performer application"
      pendingLabel="Sending…"
      successTitle="We have your application"
      footnote={
        <>
          Performing at the festival is a volunteer commitment and performers are unpaid. The
          committee sets every performance time and writes to selected groups with their slot.
        </>
      }
    >
      {(state) => (
        <>
          <Field
            label="Group or performer name"
            name="organization"
            required
            hint="Exactly as you want it printed in the program and read out from the stage."
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
            legend="Kind of performance"
            name="performanceType"
            required
            columns={2}
            options={performanceTypes}
            error={state.errors?.performanceType}
            defaultValue={state.values?.performanceType}
          />

          <div className="grid gap-7 sm:grid-cols-2">
            <Field
              label="Contact person"
              name="contactName"
              required
              hint="Whoever the committee should call about scheduling."
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
              label="How many people are in the group"
              name="groupSize"
              required
              hint="Count everyone who will be on stage, including musicians."
              error={state.errors?.groupSize}
            >
              {(props) => (
                <Input
                  {...props}
                  name="groupSize"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={300}
                  step={1}
                  defaultValue={state.values?.groupSize}
                  invalid={Boolean(state.errors?.groupSize)}
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
              hint="Stage times move on the day, and a phone is how a group gets told."
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

          <Field
            label="How long you would perform"
            name="durationMinutes"
            required
            hint="Set-up counts. A five-minute act that walks on ready is worth more to the schedule than a fifteen-minute one that spends ten of them plugging things in."
            error={state.errors?.durationMinutes}
          >
            {(props) => (
              <Select
                {...props}
                name="durationMinutes"
                defaultValue={state.values?.durationMinutes ?? ""}
                invalid={Boolean(state.errors?.durationMinutes)}
                required
              >
                <option value="" disabled>
                  Choose a length
                </option>
                {durations.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} minutes, including set-up
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <CheckboxGroup
            legend="Which days you are available"
            name="availability"
            required
            columns={2}
            options={days}
            hint="Choose both if you can make either. The committee schedules across both days and more choice means a better slot."
            error={state.errors?.availability}
            defaultSelected={state.values?.availability?.split(",").filter(Boolean) ?? []}
          />

          <Field
            label="Describe your act"
            name="description"
            required
            hint="This is what the MC reads out before you go on, so write it the way you would want it said. Please include phonetic pronunciations for any name the announcer has to get right."
            error={state.errors?.description}
          >
            {(props) => (
              <Textarea
                {...props}
                name="description"
                rows={6}
                defaultValue={state.values?.description}
                invalid={Boolean(state.errors?.description)}
                required
              />
            )}
          </Field>

          <Field
            label="Cultural heritage"
            name="culturalHeritage"
            hint="The tradition your work comes from, if it comes from one. Performances need not be Asian or Pacific Islander."
            error={state.errors?.culturalHeritage}
          >
            {(props) => (
              <Input
                {...props}
                name="culturalHeritage"
                defaultValue={state.values?.culturalHeritage}
                invalid={Boolean(state.errors?.culturalHeritage)}
              />
            )}
          </Field>

          <Field
            label="Video of the group"
            name="videoUrl"
            hint="A link to anything that shows what you do — a rehearsal on a phone is fine. Encouraged, not required."
            error={state.errors?.videoUrl}
          >
            {(props) => (
              <Input
                {...props}
                name="videoUrl"
                type="url"
                inputMode="url"
                placeholder="https://"
                defaultValue={state.values?.videoUrl}
                invalid={Boolean(state.errors?.videoUrl)}
              />
            )}
          </Field>

          <div className="grid gap-7 sm:grid-cols-2">
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

            <Field label="Instagram" name="instagram" error={state.errors?.instagram}>
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
            label="What you need on stage"
            name="technicalNeeds"
            hint="Microphones, instruments and equipment you are bringing, and how your music plays — live, or from a phone, a USB drive or a CD. Live music is preferred. Both stages are 40' × 30'."
            error={state.errors?.technicalNeeds}
          >
            {(props) => (
              <Textarea
                {...props}
                name="technicalNeeds"
                rows={4}
                defaultValue={state.values?.technicalNeeds}
                invalid={Boolean(state.errors?.technicalNeeds)}
              />
            )}
          </Field>
        </>
      )}
    </FormShell>
  );
}
