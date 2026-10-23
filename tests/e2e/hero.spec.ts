import { test, expect } from '@playwright/test';

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
