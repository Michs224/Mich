import { test, expect, type Page } from '@playwright/test';

// Owner's requests (2026-10-25): an opening scene like the old site's splash, done the way the research
// allows: on the home page itself, ended by any click, key, or scroll, never on a link to a section,
// a page of this site, back or forward, and never without JavaScript. Like the old splash it plays on
// every visit from outside and on every reload, and slowly enough to be felt. Like the old card it shows
// the title ("AI Engineer", typed large) with the name above it. They hold until 3.6 s, then the name
// flies into the header's wordmark and the title into the role line, which carries on from there; with
// reduced motion they fade.
// Playwright's own test (not ./fixtures): these visits come from outside the site.

const curtain = (page: Page) => page.locator('.intro');
const typed = (page: Page) => page.locator('#top .role .typed');
const html = (page: Page) => page.locator('html');

/** Opens the home page with its timers stopped: the name holds until the test lets time run, however
 *  slowly a busy machine loads the page. (Animations still play in real time.) */
async function openHeld(page: Page) {
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

test('a visit from outside opens with the title card, which hands over to the page', async ({ page }) => {
  await openHeld(page);
  await expect(curtain(page)).toBeVisible();
  await expect(page.locator('.intro-name')).toHaveText('Michael Geraldin Wijaya');
  await expect(page.locator('.intro-title')).toHaveText('AI Engineer');
  // The hero waits behind it: the role line has not started typing.
  await expect(typed(page)).toHaveText('');
  await page.clock.runFor(5000);
  await expect(curtain(page)).toHaveCount(0, { timeout: 6000 });
  await expect(page.locator('.site-header .wordmark')).toHaveCSS('opacity', '1');
  // The title landed in the role line, which carries on from it.
  await expect(typed(page)).toHaveText('AI Engineer');
  await expect(page.locator('#top .role')).toHaveCSS('opacity', '1');
  await page.clock.runFor(3000);
  await expect(typed(page)).not.toHaveText('AI Engineer');
});

// The card holds until 3.6 s; the hero comes in once the flying name and title have cleared it, 0.3 s
// later.
// Owner's note (2026-10-25): the three points stream 1.5 times slower than at first (1.8 s a round),
// and they are there early, so a whole round shows before the card leaves at 3.6 s.
test('the points stream slowly, from early on', async ({ page }) => {
  await openHeld(page);
  const timing = await page.evaluate(() => {
    const points = document.querySelector('.intro-points')!;
    const point = points.querySelector('span')!;
    return { round: parseFloat(getComputedStyle(point).animationDuration), from: parseFloat(getComputedStyle(points).animationDelay) };
  });
  expect(timing.round).toBeCloseTo(2.7, 5);
  expect(timing.from + timing.round).toBeLessThanOrEqual(3.6);
});

test('the title card holds long enough to be read', async ({ page }) => {
  await openHeld(page);
  await page.clock.runFor(3200);
  await expect(html(page)).toHaveClass(/intro-hold/);
  await page.clock.runFor(1000);
  await expect(html(page)).not.toHaveClass(/intro-hold/);
});

// Centered like the old card: each line on the middle of the screen, the group around its middle.
for (const [width, height] of [[1440, 900], [390, 844]] as const) {
  test(`the title card sits in the middle of the screen at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openHeld(page);
    const boxes = await page.locator('.intro > :not(.intro-paper)').evaluateAll((els) =>
      els.map((el) => {
        const box = el as HTMLElement;
        return { left: box.offsetLeft, width: box.offsetWidth, top: box.offsetTop, height: box.offsetHeight };
      }),
    );
    expect(boxes).toHaveLength(3);
    for (const box of boxes) expect(Math.abs(box.left + box.width / 2 - width / 2)).toBeLessThanOrEqual(2);
    const top = Math.min(...boxes.map((box) => box.top));
    const bottom = Math.max(...boxes.map((box) => box.top + box.height));
    expect(Math.abs((top + bottom) / 2 - height / 2)).toBeLessThanOrEqual(8);
    // The title leads: larger than the name, and still on one line inside the screen.
    const size = (selector: string) => page.locator(selector).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(await size('.intro-title')).toBeGreaterThan(await size('.intro-name'));
    // Owner's note (2026-10-25): the name a little smaller than the first 40px.
    expect(await size('.intro-name')).toBeLessThanOrEqual(34);
    expect(Math.max(...boxes.map((box) => box.width))).toBeLessThanOrEqual(width - 32);
  });
}

// The page's timers are stopped, so the name would hold for ever: only the click can end it.
test('a click ends the opening at once', async ({ page }) => {
  await openHeld(page);
  await expect(curtain(page)).toBeVisible();
  await page.mouse.click(10, 400);
  await expect(curtain(page)).toHaveCount(0, { timeout: 3000 });
});

test('every reload opens with it again', async ({ page }) => {
  await openHeld(page);
  await page.mouse.click(10, 400);
  await expect(curtain(page)).toHaveCount(0, { timeout: 3000 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(curtain(page)).toBeVisible();
});

test('coming from another page of the site skips it', async ({ page }) => {
  await page.goto('/work/vision-qc');
  await page.evaluate(() => {
    location.href = '/';
  });
  await page.waitForURL((url) => url.pathname === '/');
  await expect(html(page)).not.toHaveClass(/intro/);
  await expect(curtain(page)).toBeHidden();
});

// Real timers here: Playwright's fake clock also replaces `performance`, which hides that a page was
// reached by going back.
test('going back to the home page does not replay it', async ({ page }) => {
  await page.goto('/');
  await page.mouse.click(10, 400);
  await expect(curtain(page)).toHaveCount(0, { timeout: 5000 });
  await page.goto('/work/vision-qc');
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await expect(curtain(page)).toBeHidden();
});

test('a link to a section skips the opening', async ({ page }) => {
  await page.goto('/#contact');
  await expect(html(page)).not.toHaveClass(/intro/);
  await expect(curtain(page)).toBeHidden();
});

test('other pages never open with it', async ({ page }) => {
  await page.goto('/work/vision-qc');
  await expect(curtain(page)).toHaveCount(0);
});

test('without JavaScript there is no curtain', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(curtain(page)).toBeHidden();
  await expect(page.locator('#hero-title')).toBeVisible();
  await context.close();
});

test('opened in a background tab, it waits to be seen', async ({ page }) => {
  await page.addInitScript(() => {
    let state: DocumentVisibilityState = 'hidden';
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
    Object.assign(window, {
      showPage: () => {
        state = 'visible';
        document.dispatchEvent(new Event('visibilitychange'));
      },
    });
  });
  await openHeld(page);
  await page.clock.runFor(5000);
  await expect(html(page)).toHaveClass(/intro-hold/);
  await page.evaluate(() => (window as unknown as { showPage: () => void }).showPage());
  // Seen at last: the card holds as long as on a fresh load.
  await page.clock.runFor(3200);
  await expect(html(page)).toHaveClass(/intro-hold/);
  await page.clock.runFor(1000);
  await expect(html(page)).not.toHaveClass(/intro-hold/);
});

test('the opening moves nothing on the page', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Layout shift entries are a Chromium API');
  await openHeld(page);
  // From the moment the font is in (a late font swap is not the scene's doing) to the scene's end.
  await page.evaluate(async () => {
    await document.fonts.ready;
    const totals = window as unknown as { shift: number };
    totals.shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number }[]) totals.shift += entry.value;
    }).observe({ type: 'layout-shift' });
  });
  await page.clock.runFor(5000);
  await expect(curtain(page)).toHaveCount(0, { timeout: 6000 });
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => (window as unknown as { shift: number }).shift)).toBe(0);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the opening only fades: the wordmark never leaves the header', async ({ page }) => {
    await openHeld(page);
    await expect(curtain(page)).toBeVisible();
    await page.clock.runFor(4000);
    const wordmark = page.locator('.site-header .wordmark');
    const seen = new Set<string>();
    while ((await curtain(page).count()) > 0) seen.add(await wordmark.evaluate((el) => getComputedStyle(el).opacity));
    expect([...seen]).toEqual(['1']);
    await expect(typed(page)).toHaveText('AI Engineer');
  });
});
