import { test as base, expect, type Page } from '@playwright/test';

// The home page opens with a scene on a visit from outside the site and on a reload (src/lib/intro.ts).
// Tests arrive as from another page of the site, so the scene stays out of their way: every page.goto
// carries the site as its referrer unless a test passes its own. intro.spec uses Playwright's own test
// to watch the scene.
export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    const goto = page.goto.bind(page);
    page.goto = (url, options) => goto(url, { referer: baseURL, ...options });
    await use(page);
  },
});

export { expect, type Page };
