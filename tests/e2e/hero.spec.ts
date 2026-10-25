import { test, expect, type Page } from './fixtures';

test('hero fits first viewport at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const ctas = page.locator('#top .hero-actions a');
  await expect(ctas).toHaveCount(2);
  const lastCta = (await ctas.last().boundingBox())!;
  expect(lastCta.y + lastCta.height).toBeLessThanOrEqual(900);
  const poster = (await page.locator('#top figure.map .map-stage').boundingBox())!;
  expect(poster.y).toBeGreaterThanOrEqual(0);
  expect(poster.y + poster.height).toBeLessThanOrEqual(900);
});

test('on phones the two CTAs share one full width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const widths = await page.locator('#top .hero-actions a').evaluateAll((links) => links.map((a) => Math.round(a.getBoundingClientRect().width)));
  expect(widths).toHaveLength(2);
  expect(widths[0]).toBe(widths[1]);
});

test('hero text and CTAs fit 375x812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const lastCta = (await page.locator('#top .hero-actions a').last().boundingBox())!;
  expect(lastCta.y + lastCta.height).toBeLessThanOrEqual(812);
});

test('h1 is at most two lines at 1440', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const lines = await page.locator('#top h1').evaluate((h1) => h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
  expect(lines).toBeLessThanOrEqual(2.05);
});

test('exactly one priority image', async ({ page }) => {
  await page.goto('/');
  const priority = page.locator('img[fetchpriority="high"]');
  await expect(priority).toHaveCount(1);
  await expect(page.locator('#top figure.map img[fetchpriority="high"]')).toHaveCount(1);
});

test('LCP candidates are not animated', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['#top h1', '#top figure.map img']) {
    const name = await page.locator(selector).evaluate((el) => getComputedStyle(el).animationName);
    expect(name, selector).toBe('none');
  }
});

// Owner's copy choice (2026-10-21): the hero does not name the city.
test('hero copy does not mention the city', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#top')).not.toContainText('Jakarta');
});

// Owner's requests (2026-10-25): a typed role line, as the old site had: Data Scientist, ML Engineer,
// AI Engineer, cycling without end; job titles, so in Title Case. Letters change in place, so it cycles
// with reduced motion too. The round button in the map's corner, shown wherever JavaScript runs, pauses
// it on AI Engineer (WCAG 2.2.2: lasting motion needs a pause). Screen readers get the role once, not
// the letters as they come.
const typed = (page: Page) => page.locator('#top .role .typed');
const button = (page: Page) => page.locator('figure.map .map-turn');

test('on phones the role line keeps cycling until the button pauses it', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(typed(page)).toHaveText(/^(D|Da|Dat|Data|Data |Data S.*)$/, { timeout: 2000 });
  await expect(typed(page)).toHaveText('AI Engineer', { timeout: 10_000 });
  // It does not stay there: the cycle erases it and starts again.
  await expect(typed(page)).not.toHaveText('AI Engineer', { timeout: 6000 });
  await expect(page.locator('#top .role .sr-only')).toHaveText('AI Engineer');
  await expect(typed(page)).toHaveAttribute('aria-hidden', 'true');
  await expect(button(page)).toHaveAccessibleName('Pause the animation');
  await button(page).click();
  await expect(button(page)).toHaveAccessibleName('Play the animation');
  await expect(typed(page)).toHaveText('AI Engineer');
  await page.waitForTimeout(3000);
  await expect(typed(page)).toHaveText('AI Engineer');
  await button(page).click();
  await expect(typed(page)).not.toHaveText('AI Engineer', { timeout: 6000 });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the role line keeps cycling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(typed(page)).toHaveText('AI Engineer', { timeout: 10_000 });
    await expect(typed(page)).not.toHaveText('AI Engineer', { timeout: 6000 });
    await expect(button(page)).toHaveAccessibleName('Pause the animation');
  });
});

test('on wide screens the role line keeps cycling until the animation is paused', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The live map is checked in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
  await expect(typed(page)).toHaveText('AI Engineer', { timeout: 8000 });
  await expect(typed(page)).not.toHaveText('AI Engineer', { timeout: 6000 });
  await button(page).click();
  await expect(button(page)).toHaveAccessibleName('Play the animation');
  await expect(typed(page)).toHaveText('AI Engineer');
  await page.waitForTimeout(3000);
  await expect(typed(page)).toHaveText('AI Engineer');
});

// Owner's notes (2026-10-25): the moving role should not be small ("jangan tanggung"), and still sit
// under the headline.
test('the role line reads large, under the headline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const size = (selector: string) => page.locator(selector).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(await size('#top .role')).toBeGreaterThanOrEqual(32);
  expect(await size('#top .role')).toBeLessThan(await size('#hero-title'));
});
