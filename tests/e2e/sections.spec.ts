import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { projects } from './content';

test.describe('experience and education', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('experience anchors exist', async ({ page }) => {
    await expect(page.locator('section#experience')).toHaveCount(1);
    await expect(page.locator('section#experience #education')).toHaveCount(1);
  });

  test('promotion reads in order', async ({ page }) => {
    const entry = page.locator('#experience .timeline > li', { hasText: 'Maknadata' });
    const roles = entry.locator('.role');
    await expect(roles).toHaveCount(2);
    await expect(roles.nth(0).locator('.role-title')).toHaveText('AI Engineer');
    await expect(roles.nth(0).locator('.role-period')).toHaveText('12/2025 - present');
    await expect(roles.nth(1).locator('.role-title')).toHaveText('AI Engineer - Intern');
    await expect(roles.nth(1).locator('.role-period')).toHaveText('02/2025 - 11/2025');
  });

  test('at most four bullets per entry', async ({ page }) => {
    const entries = page.locator('#experience .timeline > li');
    expect(await entries.count()).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < (await entries.count()); i++) {
      const bullets = await entries.nth(i).locator('.bullets > li').count();
      expect(bullets).toBeGreaterThan(0);
      expect(bullets).toBeLessThanOrEqual(4);
    }
  });
});

// The archive is every project that is not featured, read straight from the content files.
const archived = projects.filter((project) => !project.featured);
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('archive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('archive groups have headings', async ({ page }) => {
    const groups = page.locator('#archive .group');
    expect(await groups.count()).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < (await groups.count()); i++) {
      await expect(groups.nth(i).locator('h3')).toHaveCount(1);
    }
  });

  test('archive lists every non-featured project', async ({ page }) => {
    expect(archived.length).toBeGreaterThan(10);
    await expect(page.locator('#archive .row')).toHaveCount(archived.length);
  });

  test('rows link out with names', async ({ page }) => {
    for (const project of archived) {
      if (project.repo) {
        // The title, then anything but more words: "Movie Recommendation System" must not match its "(Coursera course)" twin.
        const name = new RegExp(`^${escapeRegExp(project.title)}(?![\\w(]|\\s*\\()`);
        const link = page.locator('#archive').getByRole('link', { name });
        await expect(link).toHaveAttribute('href', project.repo);
      } else if (project.confidential) {
        const row = page.locator('#archive .row', { hasText: project.title });
        await expect(row).toContainText('Client work');
        await expect(row.locator('a')).toHaveCount(0);
      }
    }
  });

  test('archive rows wrap at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    expect(await page.locator('#archive .row').count()).toBeGreaterThan(0);
    const overflowing = await page.$$eval('#archive .row', (rows) => rows.filter((r) => r.scrollWidth > r.clientWidth).length);
    expect(overflowing).toBe(0);
  });

  // D10 (owner, 2026-10-21): project descriptions stay exactly as written.
  test('rows show each description as written', async ({ page }) => {
    for (const project of archived) {
      await expect(page.locator('#archive .row', { hasText: project.title }).first()).toContainText(project.description);
    }
  });

  test('a title that already says course gets no course label', async ({ page }) => {
    const row = page.locator('#archive .row', { hasText: /\(Coursera course\)/ });
    await expect(row).toHaveCount(1);
    await expect(row.locator('.label')).toHaveCount(0);
  });

  test('row labels are separate words for screen readers', async ({ page }) => {
    const titles = await page.$$eval('#archive .row-title', (els) => els.map((el) => el.textContent ?? ''));
    expect(titles.filter((text) => /\S(Client work|Course project)/.test(text))).toEqual([]);
  });

  test('all repositories link', async ({ page }) => {
    await expect(page.locator('#archive a').last()).toHaveAttribute('href', 'https://github.com/Michs224?tab=repositories');
  });
});

const credentialUrls = [...readFileSync('src/content/certifications.yaml', 'utf8').matchAll(/^\s+url:\s*(\S+)/gm)].map((m) => m[1]);

test.describe('research and recognition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('research anchors exist', async ({ page }) => {
    await expect(page.locator('section#research')).toHaveCount(1);
    await expect(page.locator('section#research #achievements')).toHaveCount(1);
    await expect(page.locator('section#research #certificates')).toHaveCount(1);
  });

  test('publication cites venue', async ({ page }) => {
    const citation = page.locator('#research .citation');
    await expect(citation).toContainText('Procedia Computer Science');
    await expect(citation.locator('a[href^="https://doi.org/10."]')).toHaveCount(1);
  });

  test('the paper opens from a button', async ({ page }) => {
    const button = page.locator('#research .citation a.btn');
    await expect(button).toHaveText('Read the paper');
    await expect(button).toHaveAttribute('href', /^https:\/\/doi\.org\/10\./);
  });

  test('earlier awards are collapsed', async ({ page }) => {
    const earlier = page.locator('#achievements details');
    await expect(earlier).toHaveCount(1);
    await expect(earlier).not.toHaveAttribute('open');
    const first = earlier.locator('li').first();
    await expect(first).toBeHidden();
    await earlier.locator('summary').click();
    await expect(first).toBeVisible();
  });

  test('no images in research', async ({ page }) => {
    await expect(page.locator('#research')).toHaveCount(1);
    await expect(page.locator('#research img')).toHaveCount(0);
  });

  test('credentials link to verification', async ({ page }) => {
    expect(credentialUrls.length).toBeGreaterThan(0);
    for (const url of credentialUrls) {
      await expect(page.locator(`#certificates a[href="${url}"]`)).toHaveCount(1);
    }
  });
});

test('about introduces the person', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('section#about');
  await expect(about).toContainText('Most people call me Gerald');
  const portrait = about.locator('img');
  await expect(portrait).toHaveCount(1);
  await expect(portrait).toHaveAttribute('alt', 'Michael Geraldin Wijaya');
  await expect(portrait).toHaveAttribute('loading', 'lazy');
});

for (const width of [375, 1440]) {
  test(`the portrait stays square at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const box = (await page.locator('section#about img').boundingBox())!;
    expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
  });
}

// Recruiters look for these two links first, so they sit with the email, not only in the footer.
test('contact links to GitHub and LinkedIn by name', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('section#contact');
  await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/Michs224');
  await expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /linkedin\.com\/in\//);
});
