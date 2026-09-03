import "server-only";

import { Resend } from "resend";

import { site } from "@/config/site";
import { formLabels, type FormKind } from "@/lib/validation";

/**
 * Outbound email.
 *
 * Everything here degrades to a console log when `RESEND_API_KEY` is unset, so
 * a contributor can `git clone`, `npm run dev`, and exercise every form end to
 * end without an account, an API key, or a verified domain.
 *
 * Before launch someone has to verify a sending domain in Resend and publish
 * its SPF, DKIM and DMARC records. Resend's shared `onboarding@resend.dev`
 * sender can only deliver to the address that owns the Resend account, so it
 * will not reach the festival's inbox. If the City controls DNS for the
 * festival's domain, start that request early — it is the longest-lead item in
 * this whole setup.
 */

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? `Los Angeles Lotus Festival <onboarding@resend.dev>`;
}

function internalInbox(): string {
  return process.env.EMAIL_TO ?? site.contact.email;
}

export type SendResult = { ok: boolean; skipped?: boolean; id?: string };

/** Escape a value before it goes anywhere near an HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

/**
 * A plain, readable table. Deliberately not React Email: these go to a
 * volunteer committee's inbox, not to a marketing list, and a hand-edited
 * template a non-developer can change beats a component tree with a build
 * step. Revisit if the festival starts sending outbound campaigns that have to
 * survive Outlook.
 */
function submissionHtml(kind: FormKind, data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([key]) => !["homepage", "startedAt", "turnstileToken"].includes(key))
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
      return `<tr>
        <th align="left" style="padding:8px 16px 8px 0;vertical-align:top;color:#574d55;font-weight:500;width:190px;border-bottom:1px solid #ece5dd;">${escapeHtml(label)}</th>
        <td style="padding:8px 0;vertical-align:top;color:#1a1418;border-bottom:1px solid #ece5dd;white-space:pre-wrap;">${escapeHtml(formatValue(value))}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px;background:#f7f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1418;">
  <div style="max-width:640px;margin:0 auto;background:#fffdfa;border:1px solid #ece5dd;border-radius:14px;padding:28px;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#857a83;">
      ${escapeHtml(site.editionOrdinal)} Los Angeles Lotus Festival
    </p>
    <h1 style="margin:0 0 20px;font-size:21px;font-weight:600;">
      New ${escapeHtml(formLabels[kind].toLowerCase())} submission
    </h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">${rows}</table>
    <p style="margin:22px 0 0;font-size:12px;color:#857a83;">
      Sent by ${escapeHtml(site.url)}. Reply directly to this email to reach the applicant.
    </p>
  </div>
</body></html>`;
}

function submissionText(kind: FormKind, data: Record<string, unknown>): string {
  const lines = Object.entries(data)
    .filter(([key]) => !["homepage", "startedAt", "turnstileToken"].includes(key))
    .map(([key, value]) => `${key}: ${formatValue(value)}`);
  return [`New ${formLabels[kind].toLowerCase()} submission`, "", ...lines].join("\n");
}

/** Notify the festival committee that an application has come in. */
export async function sendSubmissionNotification(
  kind: FormKind,
  data: Record<string, unknown>,
): Promise<SendResult> {
  const resend = client();
  const subject = `${formLabels[kind]} — ${formatValue(data.organization ?? data.contactName)}`;

  if (!resend) {
    console.info(
      `[email] RESEND_API_KEY unset. Would have emailed ${internalInbox()}:\n` +
        submissionText(kind, data),
    );
    return { ok: true, skipped: true };
  }

  const applicantEmail = typeof data.email === "string" ? data.email : undefined;

  const { data: sent, error } = await resend.emails.send({
    from: fromAddress(),
    to: [internalInbox()],
    subject,
    // So the committee can hit reply and reach the applicant directly.
    ...(applicantEmail ? { replyTo: applicantEmail } : {}),
    html: submissionHtml(kind, data),
    text: submissionText(kind, data),
    tags: [{ name: "form", value: kind.replace(/[^A-Za-z0-9_-]/g, "-") }],
  });

  if (error) {
    console.error("[email] notification failed", { name: error.name, message: error.message });
    return { ok: false };
  }
  return { ok: true, id: sent?.id };
}

/** Acknowledge to the applicant that their submission arrived. */
export async function sendApplicantReceipt(
  kind: FormKind,
  to: string,
  name: string | undefined,
): Promise<SendResult> {
  const resend = client();
  const greeting = name ? `Hello ${name},` : "Hello,";
  const label = formLabels[kind].toLowerCase();

  const text = [
    greeting,
    "",
    `Thank you — we have your ${label} submission for the ${site.editionOrdinal} Los Angeles Lotus Festival.`,
    "",
    "The festival is organized by volunteers alongside the City of Los Angeles Department of Recreation and Parks, so replies are not instant. Someone from the committee will be in touch as planning for July 2027 moves forward.",
    "",
    `If you need to add or change anything, just reply to this email or write to ${site.contact.email}.`,
    "",
    "— The Los Angeles Lotus Festival team",
    site.url,
  ].join("\n");

  if (!resend) {
    console.info(`[email] RESEND_API_KEY unset. Would have acknowledged ${to}.`);
    return { ok: true, skipped: true };
  }

  const { data: sent, error } = await resend.emails.send({
    from: fromAddress(),
    to: [to],
    replyTo: internalInbox(),
    subject: `We have your ${label} submission — ${site.editionOrdinal} Lotus Festival`,
    html: `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px;background:#f7f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1418;">
  <div style="max-width:560px;margin:0 auto;background:#fffdfa;border:1px solid #ece5dd;border-radius:14px;padding:28px;line-height:1.6;font-size:15px;">
    ${text
      .split("\n\n")
      .map((paragraph) => `<p style="margin:0 0 16px;">${escapeHtml(paragraph)}</p>`)
      .join("")}
  </div>
</body></html>`,
    text,
    tags: [{ name: "kind", value: "receipt" }],
  });

  if (error) {
    console.error("[email] receipt failed", { name: error.name, message: error.message });
    return { ok: false };
  }
  return { ok: true, id: sent?.id };
}

/**
 * Add someone to the newsletter list.
 *
 * Resend has replaced Audiences with Segments and Topics; a Topic is what
 * gives subscribers a real preference centre and a compliant unsubscribe link,
 * which matters for a nonprofit working with the City. Both ids are optional —
 * without them the contact is still created, just unfiled.
 */
export async function subscribeToNewsletter(
  email: string,
  firstName?: string,
): Promise<SendResult> {
  const resend = client();
  if (!resend) {
    console.info(`[newsletter] RESEND_API_KEY unset. Would have subscribed ${email}.`);
    return { ok: true, skipped: true };
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const topicId = process.env.RESEND_TOPIC_ID;

  const { data, error } = await resend.contacts.create({
    email,
    ...(firstName ? { firstName } : {}),
    unsubscribed: false,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    ...(topicId ? { topics: [{ id: topicId, subscription: "opt_in" as const }] } : {}),
  });

  if (error) {
    /*
     * A duplicate signup is a success from the visitor's point of view — they
     * asked to hear from us and they will. Never surface it as an error; it
     * also leaks whether an address is already on the list.
     */
    const message = error.message?.toLowerCase() ?? "";
    if (message.includes("already exists") || error.name === "validation_error") {
      return { ok: true };
    }
    console.error("[newsletter] subscribe failed", { name: error.name, message: error.message });
    return { ok: false };
  }

  return { ok: true, id: data?.id };
}
