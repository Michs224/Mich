import { test, expect } from './fixtures';

// The finish pass (owner's request, 2026-10-25, after the high-end-visual-design skill): a floating
// navigation pill, pill buttons with their icon in its own circle, panels set in a tray, a menu
// button that turns into a close mark, and blocks that settle in as they scroll into view.

test('the navigation floats as a centered pill on wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const bar = await page.locator('.site-header .bar').evaluate((el) => {
    const box = el.getBoundingClientRect();
    return { left: box.left, right: innerWidth - box.right, width: box.width, radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) };
  });
  expect(bar.width).toBeLessThan(1000);
  expect(Math.abs(bar.left - bar.right)).toBeLessThan(2);
  expect(bar.radius).toBeGreaterThanOrEqual(bar.width > 0 ? 20 : 0);
});

test('buttons are pills with their icon in its own circle', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['#top .btn-primary', '#top .btn-secondary']) {
    const button = page.locator(selector);
    expect(await button.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius)), selector).toBeGreaterThanOrEqual(20);
    await expect(button.locator('.btn-icon svg'), selector).toHaveCount(1);
  }
});

test('project cards and the contact form sit in a tray', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#projects article.card');
  for (let i = 0; i < (await cards.count()); i++) {
    await expect(cards.nth(i).locator(':scope > .core')).toHaveCount(1);
  }
  await expect(page.locator('#contact .shell > form.core')).toHaveCount(1);
});

test('the menu button turns into a close mark when the menu opens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const lines = page.locator('details.nav-menu summary .burger > span');
  await expect(lines).toHaveCount(2);
  const turned = () => lines.evaluateAll((els) => els.map((el) => getComputedStyle(el).transform !== 'none'));
  expect(await turned()).toEqual([false, false]);
  await page.locator('details.nav-menu summary').click();
  await page.waitForTimeout(400);
  expect(await turned()).toEqual([true, true]);
});

// Owner's note (2026-10-25): one flat color felt bare on the home page. A soft light in the field
// colors sits behind the map, and it never widens the page.
test('the hero is lit behind the map without widening the page', async ({ page }) => {
  for (const width of [375, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const light = await page.locator('#top .hero-visual').evaluate((el) => getComputedStyle(el, '::before').backgroundImage);
    expect(light, `${width}px`).toContain('radial-gradient');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${width}px`).toBe(0);
  }
});

// Audit (2026-10-25): the page's scroll padding made the browser "reveal" header controls that are
// always in view, so pressing Menu or focusing Resume jumped the page by half a screen.
test('header controls never scroll the page', async ({ page }) => {
  const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
  const scrollTo = (y: number) =>
    page.evaluate((top) => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, top);
    }, y);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await scrollTo(1800);
  const menu = page.locator('details.nav-menu summary');
  await menu.click();
  expect(await scrollY()).toBe(1800);
  await menu.click();
  expect(await scrollY()).toBe(1800);
  await page.setViewportSize({ width: 1440, height: 900 });
  await scrollTo(3000);
  await page.locator('header .resume-wide a').focus();
  expect(await scrollY()).toBe(3000);
});

test('the open mobile menu hides the page around the pill, and its button says Close', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const summary = page.locator('details.nav-menu summary');
  await expect(summary).toHaveText('Menu', { useInnerText: true });
  await summary.click();
  await expect(summary).toHaveText('Close', { useInnerText: true });
  const background = await page.locator('.site-header').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
});

test('blocks below the fold settle in as they scroll into view', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const block = page.locator('#research .shell.reveal').first();
  expect(Number(await block.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
  await block.evaluate((el) => {
    document.documentElement.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(200);
  expect(Number(await block.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);
});

// Audit 2: where the bar already shows its Resume pill, the open menu does not repeat it.
test('the open menu repeats the resume link only where the bar hides it', async ({ page }) => {
  for (const [width, shown] of [[375, true], [768, false]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('details.nav-menu summary').click();
    const link = page.locator('.menu-panel a[download]');
    if (shown) await expect(link, `${width}px`).toBeVisible();
    else await expect(link, `${width}px`).toBeHidden();
  }
});
