"use client";

import { submitApplication } from "@/app/actions";
import { FormShell } from "@/components/forms/FormShell";
import { Field, Input, Textarea } from "@/components/ui/Field";

/**
 * The general enquiry form.
 *
 * Bound to the form kind here rather than in the page so the page stays a
 * server component and this file is the only thing shipped to the browser.
 *
 * Deliberately short. Every field beyond the four that follow is a field the
 * committee could have to read, and this form exists for the questions that do
 * not fit any of the applications — which means it cannot guess what they are.
 */
const action = submitApplication.bind(null, "contact");

export function ContactForm() {
  return (
    <FormShell
      action={action}
      submitLabel="Send message"
      pendingLabel="Sending…"
      successTitle="Thank you — your message is in"
      footnote="This goes to the same inbox as the email address above, and is read by the same people."
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
              hint="Only if you would rather be called back than written to."
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
                />
              )}
            </Field>

            <Field
              label="Subject"
              name="subject"
              hint="A few words. It is what decides who picks the message up."
              error={state.errors?.subject}
            >
              {(props) => (
                <Input
                  {...props}
                  name="subject"
                  defaultValue={state.values?.subject}
                  invalid={Boolean(state.errors?.subject)}
                />
              )}
            </Field>
          </div>

          <Field
            label="Your message"
            name="message"
            required
            hint="Say the whole thing here rather than asking whether you may ask. One full message gets answered faster than three short ones."
            error={state.errors?.message}
          >
            {(props) => (
              <Textarea
                {...props}
                name="message"
                rows={8}
                defaultValue={state.values?.message}
                invalid={Boolean(state.errors?.message)}
                required
              />
            )}
          </Field>
        </>
      )}
    </FormShell>
  );
}
