import { test, expect, type Page } from './fixtures';

// The sound landscape along the bottom of Contact: a 3D spectrogram of a spoken sentence
// (spectrogram/mount.ts). It loads on wide screens only, plays with the scroll where motion is
// allowed, and is drawn once otherwise.

const isTerrainChunk = (url: string) => /\/_astro\/terrain[^/]*\.js$/.test(url);
const terrain = (page: Page) => page.locator('#contact canvas.terrain');
const progress = (page: Page) => terrain(page).evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--terrain-progress')));
// The hero's role line types with animation frames, without end (role-typing.ts). Frame counts and
// frame clocks here are about the landscape, so they start once the hero's switch has paused it.
const pauseHero = async (page: Page) => {
  await page.locator('figure.map .map-turn').click();
  await expect(page.locator('#top .role .typed')).toHaveText('AI Engineer');
};
const toBottom = (page: Page) =>
  page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.documentElement.scrollHeight);
  });

test('phones never download the landscape', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await toBottom(page);
  await page.waitForTimeout(3000);
  expect(urls.filter(isTerrainChunk)).toEqual([]);
});

test('the landscape plays as Contact scrolls in', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines and WebGL are checked in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  // Half of the band in view: the playhead is partway along the sentence (it plays over the first
  // three quarters of the way in).
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const band = document.querySelector('#contact canvas.terrain')!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + band.top - window.innerHeight + band.height / 2);
  });
  await expect(terrain(page)).toHaveClass(/is-live/, { timeout: 10_000 });
  expect(await progress(page)).toBeGreaterThan(0.3);
  expect(await progress(page)).toBeLessThan(0.95);
  // At the bottom the playhead has run off the edge: the same finished picture as the still one.
  await toBottom(page);
  await expect.poll(() => progress(page)).toBeGreaterThan(2.5);
});

test('too slow to follow the scroll, the landscape keeps its finished picture', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines and WebGL are checked in Chromium');
  // Every animation frame looks 50ms after the last: a machine too slow for the scroll-linked loop.
  // The clock moves once per real frame, so every loop in a frame sees the same time, as in a
  // browser. The real frame callback is kept, so the test itself can scroll once per actual frame.
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    let clock = 0;
    let lastReal = -1;
    Object.assign(window, { realFrame: request });
    window.requestAnimationFrame = (callback) =>
      request((real) => {
        if (real !== lastReal) {
          lastReal = real;
          clock += 50;
        }
        callback(clock);
      });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await pauseHero(page);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const band = document.querySelector('#contact canvas.terrain')!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + band.top - window.innerHeight);
  });
  await expect(terrain(page)).toHaveClass(/is-live|is-still/, { timeout: 10_000 });
  // Scrolling a little on every frame moves the playhead every frame, so the loop draws each one.
  await page.evaluate(async () => {
    const frame = (window as unknown as { realFrame: typeof requestAnimationFrame }).realFrame;
    for (let i = 0; i < 40; i++) {
      await new Promise((resolve) => frame(resolve));
      window.scrollBy(0, 12);
    }
  });
  await expect(terrain(page)).toHaveClass(/is-still/);
  await expect(terrain(page)).toBeVisible();
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the landscape is drawn once and stays still', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
    // Counts animation frames: a still picture asks for none while the page scrolls.
    await page.addInitScript(() => {
      const request = window.requestAnimationFrame.bind(window);
      Object.assign(window, { frames: 0 });
      window.requestAnimationFrame = (callback) => {
        (window as unknown as { frames: number }).frames++;
        return request(callback);
      };
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await pauseHero(page);
    await toBottom(page);
    await expect(terrain(page)).toHaveClass(/is-still/, { timeout: 10_000 });
    await expect(terrain(page)).toBeVisible();
    const frames = () => page.evaluate(() => (window as unknown as { frames: number }).frames);
    const before = await frames();
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(600);
    expect(await frames()).toBe(before);
  });
});
