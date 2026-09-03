import { expect, test as setup } from "@playwright/test";

import { PREVIEW_PASSWORD, STORAGE_STATE } from "./helpers";

/**
 * Sign in to the preview once, and save the session for every spec that needs
 * it. Signing in inside each test would mean a form round-trip before every
 * assertion — slower, and one more thing that can flake for reasons unrelated
 * to what is being tested.
 *
 * The gate's own spec deliberately opts out of this and starts signed out.
 */
setup("sign in to the preview", async ({ page }) => {
  await page.goto("/team");
  await page.locator("#preview-password").fill(PREVIEW_PASSWORD);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith("/team")),
    page.getByRole("button", { name: /enter/i }).click(),
  ]);

  // Prove the session actually works before saving it, so a broken login
  // surfaces here rather than as twelve confusing failures downstream.
  await page.goto("/festival");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
