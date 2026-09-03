"use server";

import { headers } from "next/headers";
import { z } from "zod";

import {
  sendApplicantReceipt,
  sendSubmissionNotification,
  subscribeToNewsletter,
} from "@/lib/email";
import type { FormState } from "@/lib/form-state";
import { clientKey, limits, rateLimit } from "@/lib/rate-limit";
import { checkSubmission } from "@/lib/spam";
import { fieldErrors, formSchemas, newsletterSchema, type FormKind } from "@/lib/validation";

/**
 * Every write the public can perform.
 *
 * These run as Server Actions rather than route handlers so the forms work
 * with JavaScript disabled or still loading — which is the difference between
 * a vendor submitting an application from a phone on a bad connection and
 * giving up.
 *
 * Server Actions are POSTs to the page they are used on, so `proxy.ts` route
 * matching does not reliably cover them. Anything that needs authorization
 * must check it here, in the action itself. None of these do: they are all
 * intentionally public.
 */

/**
 * FormData carries only strings and Files. Turn it into the shape the Zod
 * schemas expect: repeated names become arrays, and checkboxes become real
 * booleans.
 */
function toObject(formData: FormData, arrayFields: string[] = []): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION")) continue; // React's own action bookkeeping

    const values = formData
      .getAll(key)
      .filter((value): value is string => typeof value === "string");

    if (arrayFields.includes(key)) {
      out[key] = values;
    } else if (values.length > 1) {
      out[key] = values;
    } else {
      const value = values[0] ?? "";
      // An unchecked checkbox is simply absent, so "on" is the only truthy case.
      out[key] = value === "on" ? true : value;
    }
  }

  for (const key of arrayFields) out[key] ??= [];
  return out;
}

/** Keep the typed values so a re-render can restore them. Never keep secrets. */
function echoValues(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (["homepage", "startedAt", "turnstileToken"].includes(key)) continue;
    if (typeof value === "string") out[key] = value;
    else if (Array.isArray(value)) out[key] = value.join(",");
    else if (typeof value === "boolean") out[key] = value ? "on" : "";
  }
  return out;
}

const GENERIC_ERROR =
  "Something went wrong on our end. Please try again, or email lotus.festival@lacity.org.";

/**
 * A submission that fails a spam check is answered as though it succeeded.
 *
 * Telling a bot exactly which heuristic caught it is free tuning information.
 * The cost of this choice is that a false positive looks like success to a real
 * person, which is why the heuristics in `spam.ts` are so forgiving.
 */
const SILENT_SUCCESS = "Thank you — we have your submission.";

export async function subscribeAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = toObject(formData);

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      errors: fieldErrors(parsed.error),
      values: echoValues(raw),
    };
  }

  const requestHeaders = await headers();
  const ip = clientKey(requestHeaders);

  const limited = await rateLimit(`newsletter:${ip}`, limits.newsletter);
  if (!limited.success) {
    return {
      status: "error",
      message: "That is a few too many signups from here. Please try again in a minute.",
      values: echoValues(raw),
    };
  }

  const spam = await checkSubmission({
    honeypot: parsed.data.homepage,
    startedAt: parsed.data.startedAt,
    turnstileToken: parsed.data.turnstileToken,
    remoteIp: ip,
  });
  if (!spam.ok) {
    return { status: "success", message: "Thank you — we will be in touch." };
  }

  const result = await subscribeToNewsletter(parsed.data.email, parsed.data.firstName);
  if (!result.ok) {
    return { status: "error", message: GENERIC_ERROR, values: echoValues(raw) };
  }

  return {
    status: "success",
    message: "You are on the list. We will write when there is something worth telling you.",
  };
}

/** Fields that arrive as checkbox groups and must be read as arrays. */
const ARRAY_FIELDS: Partial<Record<FormKind, string[]>> = {
  volunteer: ["shifts", "interests"],
  performer: ["availability"],
};

/**
 * Handle any of the application forms.
 *
 * One implementation for all seven, with the form kind bound in by the page:
 *
 *     const action = submitApplication.bind(null, "vendor");
 *
 * The alternative is seven near-identical copies of the
 * validate / rate-limit / spam-check / send sequence, which is seven places
 * for the spam check to be forgotten. `kind` is bound on the server rather
 * than posted as a hidden field, so it cannot be swapped by the client.
 */
export async function submitApplication(
  kind: FormKind,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = toObject(formData, ARRAY_FIELDS[kind]);
  const schema = formSchemas[kind] as z.ZodType<Record<string, unknown>>;

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: fieldErrors(parsed.error),
      values: echoValues(raw),
    };
  }

  const data = parsed.data as Record<string, unknown> & {
    homepage?: string;
    startedAt?: number;
    turnstileToken?: string;
    email: string;
    contactName?: string;
  };

  const requestHeaders = await headers();
  const ip = clientKey(requestHeaders);

  const limited = await rateLimit(`apply:${kind}:${ip}`, limits.application);
  if (!limited.success) {
    return {
      status: "error",
      message:
        "That is a few too many submissions from here. Please wait a few minutes, or email lotus.festival@lacity.org.",
      values: echoValues(raw),
    };
  }

  const spam = await checkSubmission({
    honeypot: data.homepage,
    startedAt: data.startedAt,
    turnstileToken: data.turnstileToken,
    remoteIp: ip,
  });
  if (!spam.ok) {
    return { status: "success", message: SILENT_SUCCESS };
  }

  const notification = await sendSubmissionNotification(kind, data);
  if (!notification.ok) {
    return { status: "error", message: GENERIC_ERROR, values: echoValues(raw) };
  }

  /*
   * The receipt is a courtesy. If it fails the festival still has the
   * submission, so the applicant is told it worked — which is true.
   */
  void sendApplicantReceipt(kind, data.email, data.contactName).catch(() => {});

  return {
    status: "success",
    message:
      "Thank you — your submission is in. Watch for a confirmation email, and expect to hear from the committee as planning moves forward.",
  };
}
