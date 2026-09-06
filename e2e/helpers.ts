import type { Page } from "@playwright/test";

export const PREVIEW_PASSWORD = "e2e-preview-password";

/** Where the signed-in preview session is cached between specs. */
export const STORAGE_STATE = "e2e/.auth/preview.json";

/** Every route the site serves, excluding the ones that are not HTML. */
export const GATED_PAGES = [
  "/about",
  "/festival",
  "/dragon-boats",
  "/gallery",
  "/vendors",
  "/food-booths",
  "/performers",
  "/sponsors",
  "/get-involved",
  "/contact",
  "/faq",
] as const;

export const PUBLIC_PAGES = ["/", "/team", "/privacy"] as const;

/**
 * Sign in to the preview from a signed-out page.
 *
 * Most specs do not need this — they inherit a saved session from
 * `auth.setup.ts`. It is here for the gate's own spec, which starts signed
 * out on purpose.
 */
export async function unlockPreview(page: Page) {
  await page.goto("/team");
  const field = page.locator("#preview-password");
  if (!(await field.count())) return;

  await field.fill(PREVIEW_PASSWORD);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith("/team")),
    page.getByRole("button", { name: /enter/i }).click(),
  ]);
}

/**
 * Collect page errors and failed responses for the life of a page.
 *
 * React reports hydration failures as an uncaught error in production builds,
 * so this is how those surface.
 */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && response.request().resourceType() !== "image") {
      errors.push(`HTTP ${response.status()} ${new URL(response.url()).pathname}`);
    }
  });
  return errors;
}
