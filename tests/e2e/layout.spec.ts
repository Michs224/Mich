import { test, expect } from './fixtures';

test('skip link moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  const box = await skip.boundingBox();
  expect(box && box.y >= 0 && box.height > 0).toBeTruthy();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('content');
});

for (const [width, height] of [[375, 812], [768, 1024], [1440, 900]]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('html lang and color scheme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  expect(scheme).toContain('light');
  expect(scheme).toContain('dark');
});

test('one font preload', async ({ page }) => {
  await page.goto('/');
  const preloads = page.locator('link[rel="preload"][as="font"]');
  await expect(preloads).toHaveCount(1);
  await expect(preloads.first()).toHaveAttribute('crossorigin', /.*/);
});

test('dark scheme uses night paper', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe('rgb(243, 246, 245)');
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await bg()).toBe('rgb(13, 24, 23)');
});

test('menu reachable without JS', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByText('Menu', { exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' })).toBeVisible();
  await context.close();
});

test('text renders with font blocked', async ({ page }) => {
  await page.route('**/*.woff2', (route) => route.abort());
  await page.goto('/');
  const box = await page.locator('h1').boundingBox();
  expect(box?.height ?? 0).toBeGreaterThan(0);
});

// Playwright cannot emulate prefers-reduced-transparency, and this machine's Windows reports
// "reduce", so the test checks whichever branch the browser is on.
test('header blurs what scrolls under it, or turns solid on request', async ({ page }) => {
  await page.goto('/');
  // The glass is the floating pill's own layer (.bar::before), never an ancestor of the menu panel.
  const header = await page.locator('.site-header .bar').evaluate((el) => ({
    reduced: matchMedia('(prefers-reduced-transparency: reduce)').matches,
    filter: getComputedStyle(el, '::before').backdropFilter,
    background: getComputedStyle(el, '::before').backgroundColor,
  }));
  if (header.reduced) expect(header.background).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  else expect(header.filter).toContain('blur');
});

test('menu closes when focus leaves it', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.locator('details.nav-menu');
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.locator('.menu-panel a').last().focus();
  await page.keyboard.press('Tab');
  await expect(menu).not.toHaveAttribute('open');
});

test('buttons keep a visible edge in forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');
  for (const selector of ['#top .btn-primary', '#top .btn-secondary']) {
    const width = await page.locator(selector).evaluate((el) => parseFloat(getComputedStyle(el).borderTopWidth));
    expect(width, selector).toBeGreaterThan(0);
  }
});

test('mobile menu panel is fixed to the viewport, not trapped in the header', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('details.nav-menu summary').click();
  // A transform, filter, or backdrop-filter on any ancestor would make it the panel's containing block.
  const traps = await page.locator('.menu-panel').evaluate((panel) => {
    const found: string[] = [];
    for (let el = panel.parentElement; el; el = el.parentElement) {
      const cs = getComputedStyle(el);
      for (const prop of ['transform', 'filter', 'backdropFilter', 'perspective'] as const) {
        if (cs[prop] !== 'none') found.push(`${el.tagName.toLowerCase()}.${el.className} ${prop}`);
      }
      if (/paint|layout|strict|content/.test(cs.contain)) found.push(`${el.tagName.toLowerCase()} contain`);
    }
    return found;
  });
  expect(traps).toEqual([]);
  expect((await page.locator('.menu-panel').boundingBox())!.height).toBeGreaterThan(812 - 64 - 2);
});
