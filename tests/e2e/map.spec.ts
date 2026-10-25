import { test, expect, type Page } from './fixtures';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const isRenderChunk = (url: string) => /\/_astro\/render[^/]*\.js$/.test(url);

async function collectRequests(page: Page) {
  const urls: string[] = [];
  page.on('request', (req) => urls.push(req.url()));
  return urls;
}

// The poster stands in for the live canvas, which is transparent: whatever sits behind the map (the
// hero's light) has to show through both the same way, or the poster reads as a box.
test('the map posters are transparent like the live canvas', () => {
  for (const scheme of ['light', 'dark']) {
    const png = readFileSync(`src/assets/map/poster-${scheme}.png`);
    // Byte 25 is the PNG color type: 6 is RGBA.
    expect(png[25], scheme).toBe(6);
  }
});

/** Makes the browser report Save-Data, as a phone on a data saver does. */
const saveData = (page: Page) =>
  page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  });
const labelOffset = (page: Page) => page.locator('figure.map .map-label[data-featured="true"]').first().evaluate((el) => el.style.translate);

/**
 * Drags the live map through about 150 degrees in small steps and, after each frame, notes every
 * shown label's place (side and line), where it is drawn, and its opacity. Returns, for each frame in
 * which a label changed places, how far that label was drawn from where it was the frame before; and
 * the lowest opacity any label was drawn with.
 */
async function stepsAtPlaceChanges(page: Page): Promise<{ steps: number[]; faintest: number }> {
  const box = (await page.locator('figure.map canvas').boundingBox())!;
  let x = box.x + box.width * 0.2;
  const y = box.y + box.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down();
  type Seen = Record<string, { place: string; x: number; y: number; opacity: number }>;
  let before: Seen | undefined;
  const steps: number[] = [];
  let faintest = 1;
  for (let i = 0; i < 160; i++) {
    x += 2;
    await page.mouse.move(x, y);
    const seen: Seen = await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() =>
            resolve(
              Object.fromEntries(
                [...document.querySelectorAll<HTMLElement>('figure.map .map-label[data-featured="true"]')].map((el) => {
                  const r = el.getBoundingClientRect();
                  return [el.textContent!.trim(), { place: el.dataset.place ?? '', x: r.left, y: r.top, opacity: Number(getComputedStyle(el).opacity) }];
                }),
              ),
            ),
          ),
        ),
    );
    for (const [name, now] of Object.entries(seen)) {
      faintest = Math.min(faintest, now.opacity);
      const was = before?.[name];
      if (was && was.place && now.place && was.place !== now.place) steps.push(Math.hypot(now.x - was.x, now.y - was.y));
    }
    before = seen;
  }
  await page.mouse.up();
  return { steps, faintest };
}

// Owner's question (2026-10-25): on phones the map stood still under a pause button, like a video that
// never plays. Phones get the live map too: it turns slowly on its own, a sideways drag turns it, and a
// vertical swipe still scrolls the page (touch-action: pan-y).
test.describe('on phones', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('the map comes alive and turns on its own', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('figure.map')).toHaveAttribute('data-animating', 'false', { timeout: 6000 });
    const before = await labelOffset(page);
    await page.waitForTimeout(1000);
    expect(await labelOffset(page)).not.toBe(before);
    await expect(page.locator('figure.map canvas')).toHaveCSS('touch-action', 'pan-y');
  });

  // When the browser takes a touch over to scroll the page, it cancels it instead of lifting it: the map
  // must let go then too, or it stays held and never turns again.
  test('a swipe the page takes over does not leave the map held', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('figure.map')).toHaveAttribute('data-animating', 'false', { timeout: 6000 });
    await page.locator('figure.map canvas').evaluate((canvas) => {
      const box = canvas.getBoundingClientRect();
      const at = { pointerId: 7, pointerType: 'touch', isPrimary: true, bubbles: true, clientX: box.x + 40, clientY: box.y + 40 };
      canvas.dispatchEvent(new PointerEvent('pointerdown', at));
      canvas.dispatchEvent(new PointerEvent('pointercancel', at));
    });
    // A released hold resumes after 1.5 s.
    await page.waitForTimeout(2000);
    const before = await labelOffset(page);
    await page.waitForTimeout(1000);
    expect(await labelOffset(page)).not.toBe(before);
  });

  test('with Save-Data a phone keeps the still picture', async ({ page }) => {
    await saveData(page);
    const urls = await collectRequests(page);
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);
    expect(urls.filter(isRenderChunk)).toEqual([]);
    await expect(page.locator('figure.map img')).toBeVisible();
  });
});

// Owner's request (2026-10-23): with reduced motion the map still turns by hand. It does nothing
// on its own: no intro turn, and no tilt following the pointer.
test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('with reduced motion a label moves to a new place at once', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
    const { steps, faintest } = await stepsAtPlaceChanges(page);
    expect(steps.length).toBeGreaterThan(0);
    expect(Math.min(...steps)).toBeGreaterThan(15);
    expect(faintest).toBe(1);
  });

  test('with reduced motion the map loads but moves only when dragged', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const figure = page.locator('figure.map');
    await expect(figure).toHaveClass(/is-live/, { timeout: 10_000 });
    await expect(figure).toHaveAttribute('data-animating', 'false');
    const label = figure.locator('.map-label[data-featured="true"]').first();
    const offset = () => label.evaluate((el) => el.style.translate);
    const box = (await figure.locator('canvas').boundingBox())!;
    const at = (x: number, y: number) => [box.x + box.width * x, box.y + box.height * y] as const;

    await page.waitForTimeout(500);
    const still = await offset();
    await page.mouse.move(...at(0.1, 0.1));
    await page.mouse.move(...at(0.9, 0.9), { steps: 8 });
    await page.waitForTimeout(500);
    expect(await offset()).toBe(still);

    await page.mouse.down();
    await page.mouse.move(...at(0.5, 0.9), { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    expect(await offset()).not.toBe(still);
  });

  // The button starts out playing (the role line cycles), but the map stays still until the visitor
  // presses play themselves.
  test('with reduced motion the map turns on its own only when asked to', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const figure = page.locator('figure.map');
    await expect(figure).toHaveClass(/is-live/, { timeout: 10_000 });
    const button = figure.locator('.map-turn');
    await expect(button).toHaveAccessibleName('Pause the animation');
    const offset = () => figure.locator('.map-label[data-featured="true"]').first().evaluate((el) => el.style.translate);
    const still = await offset();
    await page.waitForTimeout(1000);
    expect(await offset()).toBe(still);
    await button.click();
    await expect(button).toHaveAccessibleName('Play the animation');
    await button.click();
    await expect(button).toHaveAccessibleName('Pause the animation');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1500);
    expect(await offset()).not.toBe(still);
  });
});

// Owner's request (2026-10-25): after the intro the map keeps turning slowly on its own. A pointer on
// it holds it still, and a button stops or starts the turn (WCAG 2.2.2: lasting motion needs one).
test.describe('slow turn', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
  const offset = (page: Page) => page.locator('figure.map .map-label[data-featured="true"]').first().evaluate((el) => el.style.translate);
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // The poster already says data-animating="false", so wait for the live map before the intro's end.
    await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('figure.map')).toHaveAttribute('data-animating', 'false', { timeout: 6000 });
  });

  // A label that must change places on the slow turn glides there instead of jumping. While the
  // visitor drags (and in the intro) labels follow their points exactly, with no lag.
  // Owner's question (2026-10-25): labels jumped from one side of their point to the other. A label
  // that must change places now glides there, still following its point (no lag behind it): in the
  // frame it sets off it has barely moved, where a jump covered the whole way (20px and more). It
  // fades on the way, so where two gliding labels cross, neither is legible over the other.
  test('a label that changes places glides there, fading on the way, instead of jumping', async ({ page }) => {
    const { steps, faintest } = await stepsAtPlaceChanges(page);
    expect(steps.length).toBeGreaterThan(0);
    expect(Math.max(...steps)).toBeLessThan(15);
    expect(faintest).toBeLessThan(0.5);
  });

  test('after the intro the map keeps turning slowly', async ({ page }) => {
    const before = await offset(page);
    await page.waitForTimeout(1000);
    expect(await offset(page)).not.toBe(before);
  });

  test('a pointer on the map holds it still', async ({ page }) => {
    const box = (await page.locator('figure.map canvas').boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.95);
    // The tilt toward the pointer settles first.
    await page.waitForTimeout(1000);
    const held = await offset(page);
    await page.waitForTimeout(800);
    expect(await offset(page)).toBe(held);
  });

  test('the button stops the turn and starts it again', async ({ page }) => {
    const button = page.locator('figure.map .map-turn');
    await expect(button).toHaveAccessibleName('Pause the animation');
    await button.click();
    await expect(button).toHaveAccessibleName('Play the animation');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    const stopped = await offset(page);
    await page.waitForTimeout(800);
    expect(await offset(page)).toBe(stopped);
    await button.click();
    await expect(button).toHaveAccessibleName('Pause the animation');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1500);
    expect(await offset(page)).not.toBe(stopped);
  });
});

test.describe('desktop WebGL', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
  });

  test('desktop swaps poster for canvas', async ({ page }) => {
    await expect(page.locator('figure.map canvas')).toBeVisible();
    await expect(page.locator('figure.map img')).toBeHidden();
  });

  test('context loss falls back to poster', async ({ page }) => {
    await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('figure.map canvas')!;
      canvas.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext();
    });
    await expect(page.locator('figure.map')).not.toHaveClass(/is-live/);
    await expect(page.locator('figure.map img')).toBeVisible();
  });

  test('hover shows a project label', async ({ page }) => {
    const titles: string[] = await page.evaluate(
      () => JSON.parse(document.getElementById('map-data')!.textContent!).projects.map((p: { title: string }) => p.title),
    );
    const box = (await page.locator('figure.map canvas').boundingBox())!;
    const label = page.locator('.map-label.is-hover');
    let found = '';
    for (let row = 1; row <= 12 && !found; row++) {
      for (let col = 1; col <= 12 && !found; col++) {
        await page.mouse.move(box.x + (box.width * col) / 13, box.y + (box.height * row) / 13);
        if (await label.isVisible()) found = (await label.textContent())?.trim() ?? '';
      }
    }
    expect(titles).toContain(found);
  });

  test('intro stops within five seconds', async ({ page }) => {
    await page.waitForTimeout(5000);
    await expect(page.locator('figure.map')).toHaveAttribute('data-animating', 'false');
  });
});

test('labels follow the turning map without layout shift', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
  await page.addInitScript(() => {
    const total = { value: 0 };
    Object.assign(window, { layoutShift: total });
    type Shift = PerformanceEntry & { value: number; hadRecentInput: boolean; sources: { node: Node | null }[] };
    // Only shifts that move a map label count: when the web font arrives after the first paint
    // (a busy test server), the font swap nudges the header and legend text by itself.
    const movesLabel = (shift: Shift) =>
      shift.sources.some(({ node }) => (node instanceof Element ? node : node?.parentElement)?.closest('.map-labels'));
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Shift[]) {
        if (!entry.hadRecentInput && movesLabel(entry)) total.value += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('figure.map')).toHaveAttribute('data-animating', 'false', { timeout: 6000 });
  expect(await page.evaluate(() => (window as unknown as { layoutShift: { value: number } }).layoutShift.value)).toBe(0);
});

test.describe('settled desktop map', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'WebGL behavior is checked in Chromium');
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('figure.map.is-live')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('figure.map')).toHaveAttribute('data-animating', 'false', { timeout: 6000 });
  });

  /** Sweeps the pointer over the canvas and returns the positions where a hover label showed. */
  async function sweep(page: Page, steps: number, onHit: (x: number, y: number) => Promise<void> = async () => {}) {
    const box = (await page.locator('figure.map canvas').boundingBox())!;
    const label = page.locator('.map-label.is-hover');
    const hits: { x: number; y: number }[] = [];
    for (let row = 1; row < steps; row++) {
      for (let col = 1; col < steps; col++) {
        const x = box.x + (box.width * col) / steps;
        const y = box.y + (box.height * row) / steps;
        await page.mouse.move(x, y);
        if (await label.isVisible()) {
          hits.push({ x, y });
          await onHit(x, y);
        }
      }
    }
    return hits;
  }

  test('hover labels stay inside the page', async ({ page }) => {
    let widest = 0;
    const hits = await sweep(page, 18, async () => {
      widest = Math.max(widest, await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    });
    expect(hits.length).toBeGreaterThan(5);
    expect(widest).toBe(0);
  });

  test('legend shows the pressed field on the live map', async ({ page }) => {
    await page.locator('figure.map .map-legend').getByRole('button', { name: 'Machine learning and data' }).click();
    expect(await shownLabels(page).count()).toBeGreaterThan(2);
    expect(await shownLabels(page).evaluateAll((els) => els.every((el) => el.dataset.domain === 'ml-data'))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  });

  // A visitor rests the pointer on a point, then clicks. The map tilts toward the pointer meanwhile,
  // which can carry the point a few pixels off it; it stays hovered and the click opens it.
  test('ctrl-click on a project point opens it in a new tab', async ({ page, context }) => {
    const box = (await page.locator('figure.map canvas').boundingBox())!;
    const label = page.locator('.map-label.is-hover');
    let point: { x: number; y: number } | undefined;
    for (let row = 1; row < 13 && !point; row++) {
      for (let col = 1; col < 13 && !point; col++) {
        const at = { x: box.x + (box.width * col) / 13, y: box.y + (box.height * row) / 13 };
        await page.mouse.move(at.x, at.y);
        if (await label.isVisible()) point = at;
      }
    }
    expect(point).toBeTruthy();
    await page.waitForTimeout(1000);
    await expect(label).toBeVisible();
    const opened = context.waitForEvent('page');
    await page.keyboard.down('Control');
    await page.mouse.click(point!.x, point!.y);
    await page.keyboard.up('Control');
    const tab = await opened;
    expect(new URL(page.url()).pathname).toBe('/');
    await tab.close();
  });
});

test('legend and caption are text', async ({ page }) => {
  await page.goto('/');
  const legend = page.locator('figure.map .map-legend');
  for (const name of ['AI agents, LLMs, RAG and voice', 'Vision and audio', 'Machine learning and data']) {
    await expect(legend.getByRole('button', { name })).toBeVisible();
  }
  await expect(page.locator('figure.map figcaption')).toContainText('all-MiniLM-L6-v2');
  // The legend looks like plain text on the poster, so the caption says it can be pressed.
  await expect(page.locator('figure.map figcaption')).toContainText('Press a field');
});

const shownLabels = (page: Page) => page.locator('figure.map .map-label[data-index]:visible');

// Owner's request (2026-10-25): every project here is software, so "Software" is no field of its
// own. A project outside the three fields is a gray point without a legend entry.
test('the legend offers the three fields and nothing else', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('figure.map .map-legend button')).toHaveText(['AI agents, LLMs, RAG and voice', 'Vision and audio', 'Machine learning and data']);
});

test('legend shows the pressed field on the poster', async ({ page }) => {
  // Phones get the live map too, so Save-Data holds this one on the poster.
  await saveData(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const featured = await shownLabels(page).allTextContents();
  expect(featured.length).toBeGreaterThan(0);
  const button = page.locator('figure.map .map-legend').getByRole('button', { name: 'Vision and audio' });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(await shownLabels(page).count()).toBeGreaterThan(1);
  await expect(shownLabels(page).filter({ hasText: 'Vision QC' })).toHaveCount(1);
  const allInField = await shownLabels(page).evaluateAll((els) =>
    els.every((el) => el.dataset.domain === 'vision-audio' && getComputedStyle(el).opacity === '1'),
  );
  expect(allInField).toBe(true);
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(await shownLabels(page).allTextContents()).toEqual(featured);
});

test('map chunk stays small', () => {
  const dir = join(process.cwd(), 'dist', '_astro');
  const chunks = readdirSync(dir).filter((f) => /^render.*\.js$/.test(f));
  expect(chunks.length).toBeGreaterThan(0);
  for (const chunk of chunks) {
    expect(gzipSync(readFileSync(join(dir, chunk)), { level: 9 }).length).toBeLessThanOrEqual(8 * 1024);
  }
});

// Audit 2: on the poster (Save-Data, no WebGL, or a device too slow) nothing dims, so a pressed field
// marks its points, and labels on small screens are smaller so they stay near them.
test('on the poster a pressed field marks its points', async ({ page }) => {
  await saveData(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('figure.map .map-legend').getByRole('button', { name: 'Vision and audio' }).click();
  const pins = page.locator('figure.map .map-pin:visible');
  expect(await pins.count()).toBeGreaterThan(0);
  expect(await pins.evaluateAll((els) => els.every((el) => el.dataset.domain === 'vision-audio'))).toBe(true);
  const size = await page.locator('figure.map .map-label[data-featured="true"]').first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeLessThanOrEqual(12);
});
