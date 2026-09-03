import { defineConfig, devices } from "@playwright/test";

import { STORAGE_STATE } from "./e2e/helpers";

/**
 * End-to-end checks.
 *
 * These cover the four things that unit tests cannot see and that a person
 * reviewing a pull request will not catch by reading: whether the preview gate
 * actually gates, whether a real application form actually reaches the email
 * layer with its fields intact, whether every page is usable by someone with a
 * screen reader, and whether the pages hydrate.
 *
 * They run against a production build, because several of the things they
 * check — hydration, static rendering, minified React — behave differently in
 * development.
 */
const PORT = Number(process.env.PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    // The flower needs a GPU that CI does not have. SwiftShader renders it in
    // software so the WebGL path is genuinely exercised rather than skipped.
    launchOptions: {
      args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
      /*
       * Normally Playwright manages its own browser: run
       * `npx playwright install chromium` once and this stays unset. Set
       * CHROMIUM_PATH to point at an existing binary instead — useful in a
       * sandbox that already ships one, or on a machine where downloading a
       * browser is not allowed.
       */
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    },
  },

  projects: [
    // Signs in once and saves the session for everything that follows.
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
    },
  ],

  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Deterministic values for the gate, so the tests do not depend on
      // whatever happens to be in a developer's .env.local.
      PREVIEW_MODE: "true",
      PREVIEW_PASSWORD: "e2e-preview-password",
      PREVIEW_SESSION_SECRET: "e2e-session-secret-at-least-32-characters-long",
      // No RESEND_API_KEY: submissions are logged rather than sent, which is
      // exactly the path we want to exercise.
    },
  },
});
