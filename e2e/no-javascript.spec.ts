import { expect, test } from "@playwright/test";

import { PREVIEW_PASSWORD } from "./helpers";

/**
 * The site with JavaScript switched off.
 *
 * Not a hypothetical: JavaScript fails to arrive on a congested cell network
 * all the time, and this site is opened from Echo Park in July. Everything
 * that matters — reading the pages, and submitting an application — has to
 * work anyway.
 *
 * Declared here rather than with a hand-made context so that both the
 * javaScriptEnabled flag and a signed-out session are applied by the runner,
 * not assembled by hand in each test.
 */
test.use({
  javaScriptEnabled: false,
  storageState: { cookies: [], origins: [] },
});

test("the homepage is readable", async ({ page }) => {
  await page.goto("/");

  // Motion writes its `initial` style into the server HTML, so without the
  // <noscript> rule in the root layout every revealed section would sit at
  // opacity 0 forever for anyone whose JavaScript did not load.
  const invisible = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (el) => getComputedStyle(el).opacity !== "1",
      ).length,
  );
  expect(invisible, "revealed content is invisible without JavaScript").toBe(0);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#newsletter-email")).toBeVisible();
});

test("the preview gate can be opened", async ({ page }) => {
  await page.goto("/team?next=/contact");
  await page.locator("#preview-password").fill(PREVIEW_PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL("**/contact");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("an application form still reaches the committee", async ({ page }) => {
  /*
   * Regression, and the most consequential bug found on this site.
   *
   * The submit-timing field is stamped by an effect on mount, so with no
   * JavaScript it arrives empty. `z.coerce.number()` turned that empty string
   * into 0 — because Number("") is 0 — which dated the submission to 1970.
   * The spam check read that as a replayed page and discarded it, while
   * telling the visitor it had worked. Every applicant without JavaScript was
   * silently dropped.
   */
  await page.goto("/team?next=/contact");
  await page.locator("#preview-password").fill(PREVIEW_PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL("**/contact");

  await page.locator('[name="contactName"]').fill("No Script");
  await page.locator('[name="email"]').fill("no-script@example.org");
  await page.locator('[name="phone"]').fill("(213) 555-0142");
  await page.locator('[name="message"]').fill("Sent with JavaScript switched off.");
  await page.locator('main form button[type="submit"]').click();

  await expect(page.locator('main [role="status"]')).toContainText(/thank you/i);
});
