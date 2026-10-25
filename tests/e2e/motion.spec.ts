import { test, expect, type Page } from './fixtures';

// The motion layer (02 §10, extended at the owner's request on 2026-10-25): each effect ends in a
// fully readable state, and none of it runs with reduced motion.

const centerOn = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    document.documentElement.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'center' });
  });
/** In place: no transform, or the identity matrix an animation leaves behind. */
const inPlace = (transform: string) => transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';
const mono = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => getComputedStyle(el).fontVariationSettings);

test('the headline rises word by word and ends fully shown', async ({ page }) => {
  await page.goto('/');
  const words = page.locator('#top h1 .word > span');
  expect(await words.count()).toBe(8);
  await expect(page.locator('#top h1')).toHaveText('I build AI that listens, sees, and answers.');
  await page.waitForTimeout(1600);
  const transforms = await words.evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
  expect(transforms.every(inPlace), transforms.join(' | ')).toBe(true);
});

test('section titles resolve from monospace into the sans as they scroll in', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  expect(await mono(page, '#contact h2')).toBe('"MONO" 1');
  await centerOn(page, '#contact h2');
  await page.waitForTimeout(200);
  expect(await mono(page, '#contact h2')).toBe('"MONO" 0');
});

test('the experience timeline fills as its entries scroll by', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const fill = () =>
    page.locator('#experience .entry').first().evaluate((el) => getComputedStyle(el, '::before').backgroundSize);
  expect(await fill()).toBe('100% 0%');
  await page.locator('#experience .entry').nth(1).evaluate((el) => {
    document.documentElement.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(200);
  expect(await fill()).toBe('100% 100%');
});

// With reduced motion the site keeps a gentle version (owner's choice, 2026-10-25): things fade and
// change color in place, but nothing slides, scales, or turns.
test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the headline fades in word by word without moving', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const first = page.locator('#top h1 .word > span').first();
    expect(await first.evaluate((el) => el.getAnimations().map((a) => (a as CSSAnimation).animationName))).toEqual(['word-fade']);
    const transforms = await page.locator('#top h1 .word > span').evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
    expect(transforms.every(inPlace)).toBe(true);
  });

  test('blocks fade in as they scroll in, without rising', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const block = page.locator('#research .shell.reveal').first();
    const state = () => block.evaluate((el) => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform }));
    const before = await state();
    expect(before.opacity).toBeLessThan(1);
    expect(inPlace(before.transform)).toBe(true);
    await centerOn(page, '#research .shell.reveal');
    await page.waitForTimeout(200);
    expect((await state()).opacity).toBe(1);
  });
});
