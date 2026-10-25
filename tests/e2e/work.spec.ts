import { test, expect } from './fixtures';
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

  // Owner's request (2026-10-25): the old site's cards showed a project's whole stack; the cards here
  // do too, every tag in order, not a shortlist.
  test('each card lists every tool of its project', async ({ page }) => {
    for (const project of featured) {
      const card = page.locator('#projects article', { has: page.locator(`a[href="/work/${project.slug}"]`) });
      expect(await card.locator('.stack .id').allTextContents(), project.slug).toEqual(project.tags);
    }
  });

  // Owner's request (2026-10-25): the voice agent and Vision QC keep the pictures the old site had.
  test('the voice agent and Vision QC cards show their own pictures', async ({ page }) => {
    for (const slug of ['voice-agent', 'vision-qc']) {
      const card = page.locator('#projects article', { has: page.locator(`a[href="/work/${slug}"]`) });
      await expect(card.locator('.media picture img'), slug).toHaveCount(1);
    }
  });

  test('a card picture is fully shown once the card is on screen', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Scroll timelines are checked in Chromium');
    await page.setViewportSize({ width: 1440, height: 900 });
    const media = page.locator('#projects article .media').first();
    await media.evaluate((el) => {
      document.documentElement.style.scrollBehavior = 'auto';
      el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(200);
    // Fully shown: no clip, or an inset of zero on every side in any unit.
    expect(await media.evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/^(none|inset\(0(%|px)?( 0(%|px)?)*\))$/);
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

  test('the card picture and the page picture share a transition name', async ({ page }) => {
    const slug = featured[0].slug;
    await page.goto('/');
    const cardName = await page.locator(`#projects article:has(a[href="/work/${slug}"]) .media`).evaluate((el) => getComputedStyle(el).viewTransitionName);
    await page.goto(`/work/${slug}`);
    const pageName = await page.locator('main .case-head .media').evaluate((el) => getComputedStyle(el).viewTransitionName);
    expect(cardName).toBe(`media-${slug}`);
    expect(pageName).toBe(cardName);
  });

  // Owner's request (2026-10-25): a project without public links shows no Links section at all.
  test('a project without links has no Links section', async ({ page }) => {
    await page.goto('/work/voice-agent');
    await expect(page.locator('main h2', { hasText: /^Links$/ })).toHaveCount(0);
    await expect(page.getByText(/Code is private|No public links/)).toHaveCount(0);
  });

  // Owner's request (2026-10-25): the agentic system goes by its real name, Alma.
  test('the agentic system is called Alma', async ({ page }) => {
    await page.goto('/work/agentic-rag');
    await expect(page.locator('h1')).toHaveText(/^Alma\b/);
  });

  // Owner's request (2026-10-25): no step-by-step system diagram. Not every project is a sequence,
  // and the page stays at the level of what was built and what came out of it.
  test('project pages show no step-by-step diagram', async ({ page }) => {
    for (const project of featured) {
      await page.goto(`/work/${project.slug}`);
      await expect(page.locator('main .pipeline, main .case-aside'), project.slug).toHaveCount(0);
    }
  });

  // The page opens with the card's picture beside its title, so the card visibly becomes the page.
  test('every project page shows its picture with the title', async ({ page }) => {
    for (const project of featured) {
      await page.goto(`/work/${project.slug}`);
      // The map view is the media's own svg; a cover is a picture (its zoom badge has an icon svg).
      await expect(page.locator('main .case-head .media > svg, main .case-head .media picture'), project.slug).toHaveCount(1);
    }
  });

  // Owner's request (2026-10-25): the proof-of-concept numbers and its photo count stay off the site.
  // The proof of concept won the tender, and that is the result the page gives.
  test('Vision QC gives the tender as its result, not the proof-of-concept numbers', async ({ page }) => {
    for (const path of ['/', '/work/vision-qc']) {
      await page.goto(path);
      expect(await page.locator('body').innerText(), path).not.toMatch(/83\.6|85\.5|286/);
    }
    await expect(page.locator('main .prose')).toContainText('won the tender');
  });

  // Owner's request (2026-10-25): the column beside the text held the step diagram. Every project now
  // fills it the same way, with a panel for the stack (and links, when there are any) that stays in
  // view while the text scrolls.
  test('every project page has a details panel beside the text', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const project of featured) {
      await page.goto(`/work/${project.slug}`);
      const panel = page.locator('main .case-details');
      await expect(panel.getByRole('heading', { name: 'Stack' }), project.slug).toHaveCount(1);
      await expect(page.locator('main .prose h2', { hasText: /^Stack$/ }), project.slug).toHaveCount(0);
      const text = (await page.locator('main .prose').boundingBox())!;
      const side = (await panel.boundingBox())!;
      expect(side.x, project.slug).toBeGreaterThan(text.x + text.width);
      expect(await panel.evaluate((el) => getComputedStyle(el).position), project.slug).toBe('sticky');
    }
  });

  // Owner's request (2026-10-25): no tech from the old site goes missing. Tags no stack group names,
  // like LLM or RAG, still show in the details panel.
  test('every tag of a project shows on its page', async ({ page }) => {
    for (const project of featured) {
      await page.goto(`/work/${project.slug}`);
      const shown = await page.locator('main .case-details .id').allTextContents();
      expect(shown, project.slug).toEqual(expect.arrayContaining(project.tags));
    }
  });

  // Metrics are an optional extra (project-template.md). These run while a featured project has them.
  test.describe('metrics', () => {
    const measured = featured.find((project) => project.metrics);
    test.skip(!measured, 'No featured project has metrics right now');
    const path = `/work/${measured?.slug}`;

    test('a number that is fully on screen is fully marked', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      const mark = page.locator('main .metric .mark').first();
      await mark.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      expect(await mark.evaluate((el) => getComputedStyle(el).backgroundSize)).toMatch(/^100%/);
    });

    // Owner's note (2026-10-25): on the dark background the lemon band read as a heavy bar, so there
    // it is a thin line. On light it stays a band: a thin lemon line would vanish there (1.34:1).
    test('the metric mark is a band on light and a thin line on dark', async ({ page }) => {
      const thickness = () =>
        page.locator('main .metric .mark').first().evaluate((el) => {
          const style = getComputedStyle(el);
          return parseFloat(style.backgroundSize.split(' ')[1]) / parseFloat(style.fontSize);
        });
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(path);
      expect(await thickness()).toBeGreaterThan(0.15);
      await page.emulateMedia({ colorScheme: 'dark' });
      expect(await thickness()).toBeLessThanOrEqual(0.08);
    });

    test('the note under the numbers is muted, like the other labels', async ({ page }) => {
      await page.goto(path);
      const color = (selector: string) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).color);
      expect(await color('main .results .method')).toBe(await color('main .meta dt'));
    });

    test('metrics on a project page have context', async ({ page }) => {
      await page.goto(path);
      const metrics = page.locator('main .metric');
      expect(await metrics.count()).toBeGreaterThan(0);
      for (let i = 0; i < (await metrics.count()); i++) {
        await expect(metrics.nth(i).locator('dt')).not.toBeEmpty();
        await expect(metrics.nth(i).locator('dd').first()).toHaveText(/\d/);
      }
    });
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

// Audit 2: at 1024 the third fact (Context) dropped to a row of its own.
test('the facts under a project title share one row at 1024', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  for (const slug of ['vision-qc', 'voice-agent']) {
    await page.goto(`/work/${slug}`);
    const tops = await page.locator('main .meta > div').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(tops).size, slug).toBe(1);
  }
});

// Audit 2: a diagram opened larger touched the box's edges; it gets room around it.
test('a diagram opens larger with room around it', async ({ page }) => {
  await page.goto('/work/agentic-rag');
  await page.locator('main .case-head a.zoom').click();
  const full = page.locator('dialog.lightbox img');
  await expect(full).toHaveClass(/whole/);
  expect(await full.evaluate((el) => parseFloat(getComputedStyle(el).paddingTop))).toBeGreaterThan(0);
});
