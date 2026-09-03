import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Every application form, filled in and submitted for real.
 *
 * The failure this guards against is quiet and expensive: a field whose `name`
 * does not match its schema is dropped on the floor, the committee never sees
 * it, and the applicant is told everything went fine. Nothing in a type check
 * or a lint rule catches that — only submitting the form does.
 *
 * With no RESEND_API_KEY the server logs the submission instead of emailing
 * it, which exercises the whole pipeline: validation, rate limiting, the spam
 * heuristics, and the mapping into the notification.
 */

const FORMS = [
  { path: "/get-involved", name: "volunteer" },
  { path: "/vendors", name: "vendor" },
  { path: "/food-booths", name: "food booth" },
  { path: "/performers", name: "performer" },
  { path: "/sponsors", name: "sponsor" },
  { path: "/dragon-boats", name: "dragon boat team" },
  { path: "/contact", name: "general enquiry" },
] as const;

/**
 * Wait until a control has stopped moving.
 *
 * Every form on this site sits inside a scroll-reveal, and `check({ force })`
 * scrolls its target into view — which *starts* that reveal, and then clicks
 * while the element is still travelling. The click lands where the checkbox
 * was a frame ago, some other control gets it, and the assertion fails with
 * "clicking the checkbox did not change its state". Playwright's own
 * stability wait is exactly what `force` turns off, so it has to be done here.
 */
async function settle(control: Locator, page: Page) {
  let previous: { y: number } | null = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const box = await control.boundingBox();
    if (box && previous && Math.abs(box.y - previous.y) < 0.5) return;
    previous = box;
    await page.waitForTimeout(100);
  }
}

/** Fill every visible control in the page's main form with something plausible. */
async function fillMainForm(page: Page) {
  const controls = page.locator("main form input, main form textarea, main form select");

  for (const control of await controls.all()) {
    // Skip the honeypot. It is off-screen and aria-hidden, and a real person
    // never touches it — a test that fills it is behaving like a bot, which is
    // exactly what the honeypot is there to catch.
    if (await control.evaluate((el) => Boolean(el.closest('[aria-hidden="true"]')))) continue;
    if (!(await control.isVisible())) continue;

    const [tag, type, name] = await control.evaluate((el) => [
      el.tagName.toLowerCase(),
      el.getAttribute("type"),
      el.getAttribute("name") ?? "",
    ]);
    if (!name) continue;

    if (tag === "select") {
      const options = await control
        .locator("option")
        .evaluateAll((els) => els.map((el) => (el as HTMLOptionElement).value).filter(Boolean));
      if (options[0]) await control.selectOption(options[0]);
      continue;
    }
    if (type === "checkbox" || type === "radio") continue;
    if (type === "email") await control.fill("e2e@example.org");
    else if (type === "number") await control.fill("8");
    else if (/phone/i.test(name)) await control.fill("(213) 555-0142");
    else if (type === "url" || /website|video/i.test(name))
      await control.fill("https://example.org");
    else if (tag === "textarea") await control.fill("Automated end-to-end test. Please ignore.");
    else await control.fill("End To End Test");
  }

  // Tick the first choice in each radio or checkbox group.
  for (const group of await page.locator("main fieldset").all()) {
    const choice = group.locator('input[type="checkbox"], input[type="radio"]').first();
    if (!(await choice.count())) continue;
    await choice.scrollIntoViewIfNeeded();
    await settle(choice, page);
    await choice.check({ force: true });
  }
}

test.describe("application forms", () => {
  for (const form of FORMS) {
    test(`${form.name} submits and is acknowledged`, async ({ page }) => {
      await page.goto(form.path);

      await fillMainForm(page);

      // The spam check requires a few seconds between the form rendering and
      // being submitted. Waiting here is the test behaving like a person.
      await page.waitForTimeout(3500);

      await page.locator('main form button[type="submit"]').click();

      const confirmation = page.locator('main [role="status"]');
      await expect(confirmation, "no confirmation appeared").toBeVisible({ timeout: 20_000 });
      await expect(confirmation).toContainText(/thank you/i);
    });
  }

  test("a form with nothing in it explains what is missing", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(3500);
    await page.locator('main form button[type="submit"]').click();

    await expect(page.locator('main form [role="alert"]').first()).toBeVisible();
    // The form must still be there, with what was typed still in it.
    await expect(page.locator("main form")).toBeVisible();
  });

  test("a filled honeypot is answered as though it worked", async ({ page }) => {
    // Telling an automated submitter which heuristic caught it is free tuning
    // information. It gets an ordinary success message instead.
    await page.goto("/contact");
    await fillMainForm(page);
    await page.locator('input[name="homepage"]').fill("https://spam.example", { force: true });
    await page.waitForTimeout(3500);
    await page.locator('main form button[type="submit"]').click();

    await expect(page.locator('main [role="status"]')).toBeVisible({ timeout: 20_000 });
  });

  test("the newsletter signs you up from the public page", async ({ page }) => {
    await page.goto("/");
    await page.locator("#newsletter-email").fill("e2e@example.org");
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: /notify me/i }).click();
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 20_000 });
  });
});
