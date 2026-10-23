import { test, expect, type Page } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const isRenderChunk = (url: string) => /\/_astro\/render[^/]*\.js$/.test(url);

async function collectRequests(page: Page) {
  const urls: string[] = [];
  page.on('request', (req) => urls.push(req.url()));
  return urls;
}

test('mobile never downloads the 3D code', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const urls = await collectRequests(page);
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(3000);
  expect(urls.filter(isRenderChunk)).toEqual([]);
  await expect(page.locator('figure.map img')).toBeVisible();
});

// Owner's request (2026-10-23): with reduced motion the map still turns by hand. It does nothing
// on its own: no intro turn, and no tilt following the pointer.
test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
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

  test('ctrl-click on a project point opens it in a new tab', async ({ page, context }) => {
    const [point] = await sweep(page, 13);
    expect(point).toBeTruthy();
    await page.mouse.move(point.x, point.y);
    const opened = context.waitForEvent('page');
    await page.keyboard.down('Control');
    await page.mouse.click(point.x, point.y);
    await page.keyboard.up('Control');
    const tab = await opened;
    expect(new URL(page.url()).pathname).toBe('/');
    await tab.close();
  });
});

test('legend and caption are text', async ({ page }) => {
  await page.goto('/');
  const legend = page.locator('figure.map .map-legend');
  for (const name of ['LLM, RAG and voice', 'Vision and audio', 'Machine learning and data', 'Software']) {
    await expect(legend.getByRole('button', { name })).toBeVisible();
  }
  await expect(page.locator('figure.map figcaption')).toContainText('all-MiniLM-L6-v2');
  // The legend looks like plain text on the poster, so the caption says it can be pressed.
  await expect(page.locator('figure.map figcaption')).toContainText('Press a field');
});

const shownLabels = (page: Page) => page.locator('figure.map .map-label[data-index]:visible');

test('the gray points have a legend entry too', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('figure.map .map-legend').getByRole('button', { name: 'Software' }).click();
  expect(await shownLabels(page).count()).toBeGreaterThan(0);
  expect(await shownLabels(page).evaluateAll((els) => els.every((el) => el.dataset.domain === 'software'))).toBe(true);
});

test('legend shows the pressed field on the poster', async ({ page }) => {
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
