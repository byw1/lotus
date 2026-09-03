"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import type { FormState } from "@/lib/form-state";
import {
  COOKIE_NAME,
  cookieOptions,
  isPreviewConfigured,
  issueToken,
  passwordMatches,
} from "@/lib/preview/session";
import { clientKey, limits, rateLimit } from "@/lib/rate-limit";

/**
 * The preview gate's login and logout.
 *
 * Both re-check everything themselves. Server Actions are POSTs to the page
 * they are used on rather than routes of their own, so `proxy.ts` matching
 * does not reliably cover them — an action that trusts the proxy to have
 * already checked is an action with no check at all.
 */

export async function enterPreview(_previous: FormState, formData: FormData): Promise<FormState> {
  if (!isPreviewConfigured()) {
    return {
      status: "error",
      message:
        "The preview gate is not configured on this deployment. Set PREVIEW_PASSWORD and PREVIEW_SESSION_SECRET in the environment.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const requestHeaders = await headers();
  const ip = clientKey(requestHeaders);

  // A shared password's entire attack surface is guessing it repeatedly.
  const limited = await rateLimit(`preview-login:${ip}`, limits.previewLogin);
  if (!limited.success) {
    const seconds = Math.max(1, Math.ceil((limited.reset - Date.now()) / 1000));
    return {
      status: "error",
      message: `Too many attempts. Try again in ${seconds} second${seconds === 1 ? "" : "s"}.`,
    };
  }

  if (!password) {
    return { status: "error", message: "Enter the password to continue." };
  }

  if (!passwordMatches(password)) {
    return { status: "error", message: "That password is not right." };
  }

  const token = issueToken();
  if (!token) {
    return { status: "error", message: "The preview gate is not configured." };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, cookieOptions);

  /*
   * Open-redirect guard. `next` arrives from the query string, so it is
   * attacker-controlled: only same-origin absolute paths are allowed, and
   * "//evil.example" is rejected because a protocol-relative URL leaves the
   * site while looking like a path.
   */
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  redirect(safe);
}

export async function leavePreview(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/");
}
