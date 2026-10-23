import { test, expect, type Page } from '@playwright/test';

async function everythingVisible(page: Page) {
  const steps = page.locator('#trace .trace-step');
  expect(await steps.count()).toBeGreaterThanOrEqual(5);
  const opacities = await page.$$eval('#trace .step-head, #trace .step-label, #trace .step-panel', (els) =>
    els.map((el) => Number(getComputedStyle(el).opacity)),
  );
  expect(opacities.length).toBeGreaterThan(0);
  expect(opacities.every((o) => o === 1)).toBe(true);
}

const stagePosition = (page: Page) => page.locator('#trace .trace-stage').evaluate((el) => getComputedStyle(el).position);

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('reduced motion shows every step', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await everythingVisible(page);
    expect(await stagePosition(page)).not.toBe('sticky');
  });

  // The static list on a wide screen: each step's output sits beside its name, not under it.
  test('on wide screens each panel sits beside its step', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const rows = await page.locator('#trace .trace-step').evaluateAll((steps) =>
      steps.map((step) => {
        const head = step.querySelector('.step-head')!.getBoundingClientRect();
        const panel = step.querySelector('.step-panel')!.getBoundingClientRect();
        return { beside: panel.left >= head.right, sameRow: Math.abs(panel.top - head.top) < 12 };
      }),
    );
    expect(rows.every((row) => row.beside && row.sameRow)).toBe(true);
  });
});

// Every spoken line is quoted, and the voice that answers says the customer's reply out loud.
test('speech panels quote what is said', async ({ page }) => {
  await page.goto('/');
  const speech = await page.locator('#trace .step-panel.is-speech .output').allTextContents();
  expect(speech.length).toBeGreaterThanOrEqual(2);
  expect(speech.every((line) => line.startsWith('“') && line.endsWith('”'))).toBe(true);
  expect(speech.at(-1)).toContain('What’s different this time?');
});

test('desktop pins the stage', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  expect(await stagePosition(page)).toBe('sticky');
});

test('mobile does not pin', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  expect(await stagePosition(page)).not.toBe('sticky');
});

test('trace fallback without scroll timeline', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox', 'Fallback runs in the Firefox project');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  test.skip(supported, 'browser supports scroll timelines');
  await everythingVisible(page);
  expect(await stagePosition(page)).not.toBe('sticky');
});

test('example label present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#trace')).toContainText('Example turn, simplified.');
});

const isTerrainChunk = (url: string) => /\/_astro\/terrain[^/]*\.js$/.test(url);

test('spectrogram stays off on mobile', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('#trace').scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);
  expect(urls.filter(isTerrainChunk)).toEqual([]);
});

// Owner's request (2026-10-23): with reduced motion the 3D background still shows, drawn once
// under the static list. It never moves: no scroll link, no animation loop.
test.describe('spectrogram with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('with reduced motion the spectrogram is drawn once and stays still', async ({ page, browserName }) => {
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
    await page.locator('#trace').scrollIntoViewIfNeeded();
    const trace = page.locator('#trace');
    await expect(trace).toHaveClass(/is-still/, { timeout: 10_000 });
    await expect(trace.locator('.trace-canvas')).toBeVisible();
    const frames = () => page.evaluate(() => (window as unknown as { frames: number }).frames);
    const before = await frames();
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(600);
    expect(await frames()).toBe(before);
  });
});

test('spectrogram follows scroll', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines and WebGL are checked in Chromium');
  const urls: string[] = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const track = document.querySelector<HTMLElement>('.trace-track')!;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - 64 + (track.offsetHeight - window.innerHeight) * 0.5);
  });
  await expect(page.locator('#trace canvas.trace-canvas')).toBeVisible({ timeout: 10_000 });
  expect(urls.filter(isTerrainChunk)).toHaveLength(1); // the same chunk the tests above expect to be absent
  const progress = await page.locator('.trace-track').evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--trace-progress')));
  expect(progress).toBeGreaterThan(0.3);
  expect(progress).toBeLessThan(0.7);
});

test('trace text keeps contrast', async ({ page }) => {
  await page.goto('/');
  const backgrounds = await page.$$eval('#trace .step-panel', (els) => els.map((el) => getComputedStyle(el).backgroundColor));
  expect(backgrounds.length).toBeGreaterThan(0);
  for (const bg of backgrounds) expect(bg).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
});

for (const viewport of [{ width: 844, height: 390 }, { width: 1024, height: 540 }]) {
  test(`short screens get the full static list (${viewport.width}x${viewport.height})`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(await stagePosition(page)).not.toBe('sticky');
    const note = page.locator('#trace .note');
    await note.scrollIntoViewIfNeeded();
    await expect(note).toBeInViewport();
  });
}

for (const width of [320, 375]) {
  test(`step names never run under the rail at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/');
    const misplaced = await page.$$eval('#trace .trace-step', (steps) =>
      steps.filter((step) => {
        const label = step.querySelector('.step-label')!.getBoundingClientRect();
        const tech = step.querySelector('.step-tech')?.getBoundingClientRect();
        return tech !== undefined && tech.left < label.left - 1;
      }).length,
    );
    expect(misplaced).toBe(0);
  });
}

test('tablet panels have room to read', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  expect(await stagePosition(page)).toBe('sticky');
  const width = await page.locator('#trace .step-panel').first().evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeGreaterThanOrEqual(340);
});

for (const viewport of [{ width: 800, height: 660 }, { width: 1024, height: 660 }]) {
  test(`the pinned stage fits its text (${viewport.width}x${viewport.height})`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
    await page.setViewportSize(viewport);
    await page.goto('/');
    test.skip((await stagePosition(page)) !== 'sticky', 'static list at this size');
    const gap = await page.locator('#trace .trace-stage').evaluate((stage) => {
      const note = stage.querySelector('.note')!.getBoundingClientRect();
      return stage.getBoundingClientRect().bottom - note.bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(0);
  });
}

test('on phones each stretch of the rail fills as its step scrolls by', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const fill = () =>
    page.locator('#trace .trace-step').first().evaluate((step) => new DOMMatrix(getComputedStyle(step, '::before').transform).d);
  const scrollStepTo = (block: 'end' | 'start') =>
    page.locator('#trace .trace-step').first().evaluate((step, block) => {
      document.documentElement.style.scrollBehavior = 'auto';
      step.scrollIntoView({ block });
    }, block);
  await scrollStepTo('end');
  await page.waitForTimeout(100);
  expect(await fill()).toBeLessThan(0.5);
  await scrollStepTo('start');
  await page.waitForTimeout(100);
  expect(await fill()).toBeGreaterThan(0.9);
});
