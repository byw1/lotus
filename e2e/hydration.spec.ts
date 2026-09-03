import { expect, test } from "@playwright/test";

import { collectErrors, GATED_PAGES, PUBLIC_PAGES } from "./helpers";

/**
 * Every page must hydrate cleanly and nest its HTML validly.
 *
 * These two go together: invalid nesting is one of the ways hydration breaks,
 * because the browser silently rewrites the DOM as it parses and React then
 * finds something other than what it rendered.
 *
 * A real bug this caught: `Math.sin` and `Math.cos` are not required to be
 * correctly rounded, and V8 in Node did not agree with V8 in the browser on
 * the last bit, so the SVG lotus rendered different coordinates on each side.
 */
test.describe("hydration and markup", () => {
  for (const path of [...PUBLIC_PAGES, ...GATED_PAGES, "/no-such-page"]) {
    test(`${path} loads without a runtime error`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(path);
      await page.waitForTimeout(2500);

      const real = [...new Set(errors)].filter(
        // A 404 is the entire point of the 404 page.
        (message) => !(path === "/no-such-page" && /404/.test(message)),
      );
      expect(real, `${path} reported errors`).toEqual([]);
    });
  }

  test("no page nests block content inside a paragraph or a link inside a link", async ({
    page,
  }) => {
    for (const path of [...PUBLIC_PAGES, ...GATED_PAGES]) {
      await page.goto(path);
      const problems = await page.evaluate(() => {
        const BLOCK =
          "address,article,aside,blockquote,div,dl,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hr,li,main,nav,ol,p,pre,section,table,ul";
        const found: string[] = [];
        for (const paragraph of document.querySelectorAll("p")) {
          for (const child of paragraph.querySelectorAll(BLOCK)) {
            found.push(`<${child.tagName.toLowerCase()}> inside <p>`);
          }
        }
        for (const selector of ["a a", "button button", "form form"]) {
          if (document.querySelector(selector)) found.push(selector);
        }
        for (const item of document.querySelectorAll("li")) {
          const parent = item.parentElement?.tagName;
          if (parent && !["UL", "OL", "MENU"].includes(parent)) {
            found.push(`<li> inside <${parent.toLowerCase()}>`);
          }
        }
        // A <dl> may only contain <dt>, <dd>, <div> and script-supporting
        // elements. A stray <span> separator is invalid and the parser moves it.
        for (const list of document.querySelectorAll("dl")) {
          for (const child of list.children) {
            if (!["DT", "DD", "DIV", "SCRIPT", "TEMPLATE"].includes(child.tagName)) {
              found.push(`<${child.tagName.toLowerCase()}> as a direct child of <dl>`);
            }
          }
        }
        return [...new Set(found)];
      });
      expect(problems, `${path} has invalid nesting`).toEqual([]);
    }
  });
});
