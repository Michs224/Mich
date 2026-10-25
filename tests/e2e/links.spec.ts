import { test, expect } from './fixtures';

// 02 §16: every internal link answers 200, every in-page anchor has a target, and the anchors the
// old site used still exist on the home page.
const PAGES = ['/', '/work/voice-agent', '/work/vision-qc', '/work/agentic-rag', '/this-page-does-not-exist'];
const OLD_ANCHORS = ['top', 'experience', 'education', 'projects', 'about', 'certificates', 'achievements', 'contact'];

test('internal links answer 200 and anchors have targets', async ({ page, request }) => {
  const checked = new Set<string>();
  // Target page → anchor id → a page that links to it; each target page is then opened once.
  const anchors = new Map<string, Map<string, string>>();
  for (const path of PAGES) {
    await page.goto(path);
    const origin = new URL(page.url()).origin;
    const links = await page.$$eval('a[href]', (els) =>
      els.map((a) => ({ raw: a.getAttribute('href') ?? '', href: (a as HTMLAnchorElement).href })),
    );
    for (const { raw, href } of links) {
      const url = new URL(href);
      if (url.origin !== origin) continue;
      if (url.hash) {
        const ids = anchors.get(url.pathname) ?? new Map<string, string>();
        ids.set(decodeURIComponent(url.hash.slice(1)), path);
        anchors.set(url.pathname, ids);
      }
      // "#content" points into the page being checked (which is the 404 page once), not at a new URL.
      if (raw.startsWith('#') || checked.has(url.pathname)) continue;
      checked.add(url.pathname);
      expect((await request.get(url.pathname)).status(), `${url.pathname} (linked from ${path})`).toBe(200);
    }
  }
  expect(checked.size).toBeGreaterThan(5);
  for (const [path, ids] of anchors) {
    await page.goto(path);
    for (const [id, from] of ids) {
      await expect(page.locator(`[id="${id}"]`), `#${id} on ${path} (linked from ${from})`).toHaveCount(1);
    }
  }
});

test('anchors from the old site still exist', async ({ page }) => {
  await page.goto('/');
  for (const id of OLD_ANCHORS) await expect(page.locator(`#${id}`), id).toHaveCount(1);
});
