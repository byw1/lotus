import { expect, test } from "@playwright/test";

import { GATED_PAGES, PREVIEW_PASSWORD, PUBLIC_PAGES, unlockPreview } from "./helpers";

// This spec is about what happens BEFORE you are signed in, so it throws away
// the session the other specs inherit.
test.use({ storageState: { cookies: [], origins: [] } });

/**
 * The gate is a soft one — it hides an unfinished site, it does not protect
 * secrets. But a gate that does not gate is worse than no gate, because people
 * assume it works. These are the properties it has to keep.
 */
test.describe("preview gate", () => {
  test("public pages stay public", async ({ page }) => {
    for (const path of PUBLIC_PAGES) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should be reachable`).toBe(200);
      expect(new URL(page.url()).pathname).toBe(path);
    }
  });

  test("every gated page redirects to /team, keeping where you were going", async ({ page }) => {
    for (const path of GATED_PAGES) {
      await page.goto(path);
      const url = new URL(page.url());
      expect(url.pathname, `${path} should have been gated`).toBe("/team");
      expect(url.searchParams.get("next")).toBe(path);
    }
  });

  test("a wrong password is refused and issues no cookie", async ({ page, context }) => {
    await page.goto("/team");
    await page.locator("#preview-password").fill("not-the-password");
    await page.getByRole("button", { name: /enter/i }).click();

    // Scoped to the form: Next.js renders its own empty role="alert" route
    // announcer, which getByRole would otherwise match first.
    await expect(page.locator('form [role="alert"]')).toContainText(/not right/i);
    const cookies = await context.cookies();
    expect(cookies.some((c) => c.name === "lotus_preview")).toBe(false);
  });

  test("the right password returns you to the page you asked for", async ({ page }) => {
    await page.goto("/vendors");
    await page.locator("#preview-password").fill(PREVIEW_PASSWORD);
    await Promise.all([
      page.waitForURL("**/vendors"),
      page.getByRole("button", { name: /enter/i }).click(),
    ]);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("the session cookie is hardened and signed", async ({ page, context }) => {
    await unlockPreview(page);
    const cookie = (await context.cookies()).find((c) => c.name === "lotus_preview");

    expect(cookie, "no session cookie was issued").toBeTruthy();
    expect(cookie!.httpOnly, "must be unreadable from JavaScript").toBe(true);
    expect(cookie!.sameSite, "strict would drop the cookie on links from email").toBe("Lax");
    // v1.<expiry>.<hmac> — not a bare flag anyone reading this repo could forge.
    expect(cookie!.value.split(".")).toHaveLength(3);
    expect(cookie!.value.startsWith("v1.")).toBe(true);
  });

  test("a forged cookie does not get in", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "lotus_preview",
        value: `v1.${Math.floor(Date.now() / 1000) + 99999}.forgedsignature`,
        domain: "127.0.0.1",
        path: "/",
      },
    ]);
    await page.goto("/vendors");
    expect(new URL(page.url()).pathname).toBe("/team");
  });

  test("signing out puts you back on the public page", async ({ page, context }) => {
    await unlockPreview(page);
    await page.goto("/festival");
    await page.getByRole("button", { name: /leave preview/i }).click();
    await page.waitForURL("**/");
    expect((await context.cookies()).some((c) => c.name === "lotus_preview")).toBe(false);
  });

  test("gated pages are noindex, so an unfinished site cannot outlive the preview", async ({
    page,
  }) => {
    await unlockPreview(page);
    await page.goto("/festival");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toMatch(/noindex/);

    const txt = await (await page.request.get("/robots.txt")).text();
    expect(txt).toMatch(/Disallow: \//);
  });
});
