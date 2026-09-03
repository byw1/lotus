import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { GATED_PAGES, PUBLIC_PAGES } from "./helpers";

/**
 * This festival is free and belongs to everyone, so the site has to be usable
 * by everyone. axe-core catches the mechanical failures; the structural checks
 * below cover a few things it does not.
 *
 * Two real bugs this found: `--fg-subtle` failed contrast in both themes at
 * the sizes it was actually used at, and white on the primary button was
 * 4.25:1, which fails for a 14px label.
 */
const ALL_PAGES = [...PUBLIC_PAGES, ...GATED_PAGES];

test.describe("accessibility", () => {
  for (const path of ALL_PAGES) {
    test(`${path} has no axe violations`, async ({ page }) => {
      await page.goto(path);
      // Let the scroll-reveals settle so nothing is measured mid-fade.
      await page.waitForTimeout(2000);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(
        results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
        `${path} has accessibility violations`,
      ).toEqual([]);
    });
  }

  test("every page has exactly one h1 and no skipped heading levels", async ({ page }) => {
    for (const path of ALL_PAGES) {
      await page.goto(path);
      const structure = await page.evaluate(() => {
        const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
          Number(h.tagName[1]),
        );
        let skipped: string | null = null;
        for (let i = 1; i < levels.length; i++) {
          if (levels[i] - levels[i - 1] > 1) {
            skipped = `h${levels[i - 1]} → h${levels[i]}`;
            break;
          }
        }
        return { h1Count: document.querySelectorAll("h1").length, skipped };
      });

      expect(structure.h1Count, `${path} should have exactly one h1`).toBe(1);
      expect(structure.skipped, `${path} skips a heading level`).toBeNull();
    }
  });

  test("the keyboard reaches the content without walking the whole header", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(first).toMatch(/skip to content/i);
  });

  test("nothing relies on a title attribute to name a control", async ({ page }) => {
    for (const path of ALL_PAGES) {
      await page.goto(path);
      const unnamed = await page.evaluate(
        () =>
          [...document.querySelectorAll("a, button")].filter((el) => {
            const text = el.textContent?.trim();
            const label = el.getAttribute("aria-label") ?? el.getAttribute("aria-labelledby");
            return !text && !label;
          }).length,
      );
      expect(unnamed, `${path} has a control with no accessible name`).toBe(0);
    }
  });
});
