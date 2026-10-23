import { test, expect } from '@playwright/test';
import { projects } from './content';

const featured = projects.filter((project) => project.featured);

test.describe('projects on the home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('one card per featured project', async ({ page }) => {
    await expect(page.locator('#projects article')).toHaveCount(featured.length);
  });

  test('cards link to project pages', async ({ page }) => {
    const cards = page.locator('#projects article');
    await expect(cards).toHaveCount(featured.length);
    for (let i = 0; i < featured.length; i++) {
      const links = cards.nth(i).locator('a');
      await expect(links).toHaveCount(1);
      await expect(links.first()).toHaveAttribute('href', `/work/${featured[i].slug}`);
    }
  });

  // Owner's request (2026-10-23): every project uses one template, so adding one needs no layout work.
  test('every card has the same parts and no project-specific visual', async ({ page }) => {
    const parts = await page
      .locator('#projects article')
      .evaluateAll((cards) => cards.map((card) => [...card.children].map((child) => `${child.tagName}.${child.classList[0]}`).join(' ')));
    expect(new Set(parts).size).toBe(1);
    await expect(page.locator('#projects article :is(figure, dl)')).toHaveCount(0);
  });

  // Owner's request (2026-10-23): cards carry a picture, never text alone. A project's cover is its
  // picture; without one, the card draws the project's place on the embedding map.
  test('every card shows a picture', async ({ page }) => {
    const media = page.locator('#projects article .media');
    await expect(media).toHaveCount(featured.length);
    for (let i = 0; i < featured.length; i++) {
      await expect(media.nth(i).locator(':scope > :is(picture, svg)')).toHaveCount(1);
    }
  });

  // Tool names can contain spaces ("AWS Bedrock"), so the list needs commas to read.
  test('card tools are a comma-separated list', async ({ page }) => {
    const tools = await page.locator('#projects article .stack').first().innerText();
    expect(tools).toMatch(/\S, \S/);
  });

  test('a cover is the picture on its card', async ({ page }) => {
    const card = page.locator('#projects article', { has: page.locator('a[href="/work/agentic-rag"]') });
    await expect(card.locator('.media picture img')).toHaveCount(1);
  });

  test('cards share one width at desktop size', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const widths = await page
      .locator('#projects article')
      .evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().width)));
    expect(new Set(widths).size).toBe(1);
  });
});

test.describe('project pages', () => {
  featured.forEach((project, i) => {
    const next = featured[(i + 1) % featured.length];

    test(`each project page renders: ${project.slug}`, async ({ page }) => {
      const res = await page.goto(`/work/${project.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveText(project.title);
    });

    test(`project page navigation: ${project.slug}`, async ({ page }) => {
      await page.goto(`/work/${project.slug}`);
      await expect(page.locator('main a[href="/#projects"]').first()).toBeVisible();
      await expect(page.locator(`main a[href="/work/${next.slug}"]`)).toHaveCount(1);
    });
  });

  test('shared transition name', async ({ page }) => {
    await page.goto('/');
    const cardName = await page
      .locator('#projects article h3 a[href="/work/voice-agent"]')
      .evaluate((el) => getComputedStyle(el).viewTransitionName);
    await page.goto('/work/voice-agent');
    const titleName = await page.locator('h1').evaluate((el) => getComputedStyle(el).viewTransitionName);
    expect(cardName).toBe('work-voice-agent');
    expect(titleName).toBe(cardName);
  });

  test('confidential projects say so', async ({ page }) => {
    await page.goto('/work/voice-agent');
    await expect(page.getByText('Code is private')).toBeVisible();
  });

  test('a pipeline on a project page is an ordered list', async ({ page }) => {
    await page.goto('/work/voice-agent');
    expect(await page.locator('.case-aside figure.pipeline > ol > li').count()).toBeGreaterThanOrEqual(3);
  });

  // The page opens with the card's picture beside its title, so the card visibly becomes the page.
  test('every project page shows its picture with the title', async ({ page }) => {
    for (const project of featured) {
      await page.goto(`/work/${project.slug}`);
      // The map view is the media's own svg; a cover is a picture (its zoom badge has an icon svg).
      await expect(page.locator('main .case-head .media > svg, main .case-head .media picture'), project.slug).toHaveCount(1);
    }
  });

  test('a number that is fully on screen is fully marked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/work/vision-qc');
    const mark = page.locator('main .metric .mark').first();
    await mark.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    expect(await mark.evaluate((el) => getComputedStyle(el).backgroundSize)).toMatch(/^100%/);
  });

  test('metrics on a project page have context', async ({ page }) => {
    await page.goto('/work/vision-qc');
    const metrics = page.locator('main .metric');
    expect(await metrics.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await metrics.count()); i++) {
      await expect(metrics.nth(i).locator('dt')).not.toBeEmpty();
      await expect(metrics.nth(i).locator('dd').first()).toHaveText(/\d/);
    }
  });
});

// Owner's copy choice (2026-10-21): featured work is a "project", never a "case study".
test('visible copy says project, not case study', async ({ page }) => {
  for (const path of ['/', '/work/voice-agent']) {
    await page.goto(path);
    expect(await page.locator('body').innerText(), path).not.toMatch(/case stud/i);
  }
});

// Owner's copy choices (2026-10-23): the section is "Projects", and "resume" has no accents.
test('the projects section and every way to it say projects', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('#projects h2')).toHaveText('Projects');
  await expect(page.locator('header .nav-wide a[href="/#projects"]')).toHaveText('Projects');
  await expect(page.locator('#top a[href="#projects"]')).toHaveText('View projects');
  await page.goto('/work/vision-qc');
  await expect(page.locator('main a[href="/#projects"]').first()).toHaveText('Back to projects');
});

test('resume is spelled without accents', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  expect(await page.locator('body').innerText()).not.toMatch(/résumé/i);
  await expect(page.locator('header .resume-wide a[download]')).toHaveText('Resume');
});

// Owner's request (2026-10-23): pictures on project pages can be opened larger.
test('a project picture opens larger and closes again', async ({ page }) => {
  await page.goto('/work/agentic-rag');
  const trigger = page.locator('main a.zoom').first();
  await trigger.click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('src', (await trigger.getAttribute('href'))!);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('project page pipeline does not light up when the page is hovered', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/voice-agent');
  const stage = page.locator('.case-aside .pipeline ol > li').first();
  const before = await stage.evaluate((el) => getComputedStyle(el).boxShadow);
  await page.locator('h1').hover();
  await page.waitForTimeout(400);
  expect(await stage.evaluate((el) => getComputedStyle(el).boxShadow)).toBe(before);
});
