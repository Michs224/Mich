import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';
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
    await expect(entry.locator('.role-title')).toHaveText(['AI Engineer', 'AI Engineer - Intern']);
    await expect(entry.locator('.role-period')).toHaveText(['12/2025 - present', '02/2025 - 11/2025']);
  });

  // Owner's request (2026-10-25), as on the old site and the CV: each entry leads with the role, the
  // latest as its heading, and the organization and place follow under the roles.
  test('each entry leads with its role, then the organization', async ({ page }) => {
    const entries = page.locator('#experience .timeline > li');
    await expect(entries.filter({ hasText: 'Maknadata' }).locator('h3')).toHaveText('AI Engineer');
    for (let i = 0; i < (await entries.count()); i++) {
      const head = entries.nth(i).locator('.entry-head');
      await expect(head.locator('h3')).toHaveText((await head.locator('.role-title').first().textContent())!);
      const lastRole = (await head.locator('.role-period').last().boundingBox())!;
      const org = (await head.locator('.org').boundingBox())!;
      expect(org.y, `entry ${i}`).toBeGreaterThanOrEqual(lastRole.y + lastRole.height - 1);
    }
  });

  // Owner's request (2026-10-25): each entry carries every bullet the CV has, not a shortlist.
  test('every entry lists the bullets from the CV', async ({ page }) => {
    const entries = page.locator('#experience .timeline > li');
    expect(await entries.count()).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < (await entries.count()); i++) {
      expect(await entries.nth(i).locator('.bullets > li').count()).toBeGreaterThan(0);
    }
    const maknadata = entries.filter({ hasText: 'Maknadata' }).first();
    await expect(maknadata.locator('.bullets > li')).toHaveCount(9);
    await expect(maknadata).toContainText('Cloud Tasks workers on Cloud Run');
  });

  // Owner's request (2026-10-25), as on the old site: an entry's bullets open from its heading, the
  // whole entry at once (never a list cut in two). The current role starts open, so its work shows
  // without a click.
  test('each entry opens from its heading, and the current role starts open', async ({ page }) => {
    const entries = page.locator('#experience .timeline > li');
    const maknadata = entries.filter({ hasText: 'Maknadata' });
    await expect(maknadata.locator('details')).toHaveAttribute('open', '');
    await expect(maknadata.locator('.bullets > li:visible')).toHaveCount(9);
    const tutor = entries.filter({ hasText: 'Tutor' });
    await expect(tutor.locator('.bullets > li').first()).toBeHidden();
    await tutor.locator('summary').click();
    await expect(tutor.locator('.bullets > li').first()).toBeVisible();
  });

  // Owner's note (2026-10-25): the open and close arrow was hard to see. It sits in its own circle,
  // like the icons on the site's buttons, in the text's own color rather than gray.
  test('each heading shows a clear open and close control', async ({ page }) => {
    const heads = page.locator('#experience .entry-head');
    for (let i = 0; i < (await heads.count()); i++) {
      const toggle = heads.nth(i).locator('.toggle');
      const box = (await toggle.boundingBox())!;
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(32);
      const ink = await heads.nth(i).locator('h3').evaluate((el) => getComputedStyle(el).color);
      await expect(toggle).toHaveCSS('color', ink);
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

  // Owner's request (2026-10-25): every project is software, so no group is called that. A project
  // outside the three fields goes under Other.
  test('archive groups are the three fields, then Other', async ({ page }) => {
    await expect(page.locator('#archive .group-title')).toHaveText(['AI agents, LLMs, RAG and voice', 'Vision and audio', 'Machine learning and data', 'Other']);
  });

  // Owner's request (2026-10-25): every project had a picture on the old site, so every row shows one
  // again: its old picture, or its place on the embedding map when it never had one.
  test('every row shows a picture', async ({ page }) => {
    await expect(page.locator('#archive .row .media')).toHaveCount(archived.length);
    await expect(page.locator('#archive .row .media :is(img, svg)')).toHaveCount(archived.length);
  });

  // Owner's request (2026-10-25): a picture of its own, made to match the other Maknadata covers.
  test('Report and Interview Integration shows its own picture', async ({ page }) => {
    const row = page.locator('#archive .row', { hasText: 'Report and Interview Integration' });
    await expect(row.locator('.media picture img')).toHaveCount(1);
  });

  test('archive lists every non-featured project', async ({ page }) => {
    expect(archived.length).toBeGreaterThan(10);
    await expect(page.locator('#archive .row')).toHaveCount(archived.length);
  });

  // Owner's decision (2026-10-25): every row shows; folding split one list in two.
  test('every row shows, nothing folded', async ({ page }) => {
    await expect(page.locator('#archive .row:visible')).toHaveCount(archived.length);
    await expect(page.locator('#archive details')).toHaveCount(0);
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

  // Owner's request (2026-10-25): no tech from the old site goes missing, and the old site listed it
  // under every project.
  test('rows show the tech stack of each project', async ({ page }) => {
    for (const project of archived) {
      const title = new RegExp(`^\\s*${escapeRegExp(project.title)}(?![\\w(]|\\s*\\()`);
      const row = page.locator('#archive .row').filter({ has: page.locator('.row-title', { hasText: title }) });
      expect(await row.locator('.tools .id').allTextContents(), project.slug).toEqual(project.tags);
    }
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

test.describe('research, awards and certifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Owner's request (2026-10-25): the paper's section is just "Research". Awards and certifications
  // are not research, so they get a section of their own; #certificates still receives the old
  // site's /certificates links.
  test('research and awards are separate sections', async ({ page }) => {
    await expect(page.locator('section#research h2')).toHaveText('Research');
    await expect(page.locator('section#research .citation')).toHaveCount(1);
    await expect(page.locator('section#awards h2')).toHaveText('Awards and certificates');
    await expect(page.locator('section#awards #achievements')).toHaveCount(1);
    await expect(page.locator('section#awards #certificates')).toHaveCount(1);
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

  // Owner's request (2026-10-25): the certificates show their pictures again, as on the old site.
  // Each picture and title are one link to the place that verifies the credential.
  test('certificates show their pictures', async ({ page }) => {
    for (const url of credentialUrls) {
      await expect(page.locator(`#certificates a[href="${url}"] img`), url).toHaveCount(1);
    }
  });

  // Owner's report (2026-10-25): the square IBM badges were cut off at the bottom of their frames.
  // Every picture fits inside its frame, whatever its shape.
  test('certificate pictures show whole inside their frames', async ({ page }) => {
    for (const width of [375, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const misfits = await page.locator('#certificates .cert-frame').evaluateAll((frames) =>
        frames
          .map((frame) => {
            const box = frame.getBoundingClientRect();
            const img = frame.querySelector('img')!.getBoundingClientRect();
            return img.top >= box.top - 1 && img.bottom <= box.bottom + 1 && img.left >= box.left - 1 && img.right <= box.right + 1;
          })
          .filter((fits) => !fits).length,
      );
      expect(misfits, `${width}px`).toBe(0);
    }
  });

  // Owner's request (2026-10-25): the certificates without a picture wait behind "Other
  // certificates", as on the old site; a labeled group of its own folds. They are course
  // certificates, not certifications (no exam), so the copy says certificates.
  test('certifications without a picture wait in their own disclosure', async ({ page }) => {
    const others = page.locator('#certificates details.more');
    await expect(others).toHaveCount(1);
    await expect(others).not.toHaveAttribute('open');
    await expect(others.locator('summary')).toHaveText(/^Other certificates \(\d+\)$/, { useInnerText: true });
    const first = others.locator('li').first();
    await expect(first).toBeHidden();
    await others.locator('summary').click();
    await expect(first).toBeVisible();
  });

  test('credentials link to verification', async ({ page }) => {
    expect(credentialUrls.length).toBeGreaterThan(0);
    for (const url of credentialUrls) {
      await expect(page.locator(`#certificates a[href="${url}"]`)).toHaveCount(1);
    }
  });
});

// Owner's request (2026-10-25): no walk-through of one project on the home page; each project's
// own page carries its details.
test('the home page leaves project details to the project pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#trace')).toHaveCount(0);
  await expect(page.locator('main > section, main section.section').filter({ hasText: 'One sentence through the voice agent' })).toHaveCount(0);
});

test('about introduces the person', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('section#about');
  // Owner (2026-10-25): people call him Gerald and Mich; the domain, michgerald, joins the two.
  await expect(about).toContainText('Most people call me Gerald or Mich.');
  const portrait = about.locator('img');
  await expect(portrait).toHaveCount(1);
  // The name is written right beside the photo, so the photo's alt is empty: with the name as alt,
  // screen readers (and copied text) said it twice (2026-10-25).
  await expect(portrait).toHaveAttribute('alt', '');
  await expect(about.locator('.name')).toHaveText('Michael Geraldin Wijaya');
  await expect(portrait).toHaveAttribute('loading', 'lazy');
});

// Owner's notes (2026-10-25): the line under the name follows Experience, so a new job means one edit
// there; and the About text stays general, as on the old site, naming no employer or project.
test('about follows the current role and stays general', async ({ page }) => {
  await page.goto('/');
  const current = page.locator('#experience .entry.is-current');
  const org = (await current.locator('.org').textContent())!.trim();
  // Roles run newest first, so the current one (no end date) leads.
  await expect(current.locator('.role-period').first()).toContainText('present');
  const title = (await current.locator('.role-title').first().textContent())!.trim();
  const about = page.locator('section#about');
  await expect(about.locator('.who .t-muted')).toHaveText(`${title} at ${org}`);
  await expect(about.locator('.prose')).not.toContainText(org);
  for (const project of ['voice agent', 'vision', 'benchmark']) await expect(about.locator('.prose')).not.toContainText(project);
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

// Audit 2 (2026-10-25): flex layout dropped the space before the arrow-glued last word.
test('the all-repositories link reads as words', async ({ page }) => {
  await page.goto('/');
  // Text checks normalize spaces, so measure: the gap between "on" and "GitHub" is a rendered space.
  const gap = await page.locator('#archive a.all').evaluate((link) => {
    const text = [...link.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim())!;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, text.textContent!.trimEnd().length);
    return link.querySelector('.tail')!.getBoundingClientRect().left - range.getBoundingClientRect().right;
  });
  expect(gap).toBeGreaterThan(2);
});

// Audit 2: a disclosure's caret wrapped away from its text; it stays glued to the last word.
test('a disclosure caret stays with its last word', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#awards details.more > summary .tail .icon')).toHaveCount(2);
});

// Audit 2: on wide screens Education, far shorter than the experience beside it, stays in view as
// that scrolls. Awards does not: with its disclosure open it can be taller than the screen, and a
// sticky block taller than the screen hides its end.
test('education stays in view beside the experience', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  expect(await page.locator('#education').evaluate((el) => getComputedStyle(el).position)).toBe('sticky');
  expect(await page.locator('#achievements').evaluate((el) => getComputedStyle(el).position)).toBe('static');
});

// Audit 2: "ASR → LLM → TTS" is one name; it never breaks around its arrows.
test('the voice pipeline never breaks around its arrows', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('#experience .timeline > li').first().locator('.bullets > li').first();
  // Text checks turn no-break spaces into spaces, so read the raw text.
  expect(await first.evaluate((el) => el.textContent)).toContain('ASR → LLM → TTS');
});

// Owner's note (2026-10-25): pictures should never be so small they cannot be seen. More projects shows
// each one large: beside the text on wide screens, across the whole row on phones.
test('more projects shows its pictures large', async ({ page }) => {
  for (const [width, least] of [[1440, 260], [375, 300]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const widths = await page.locator('#archive .row .thumb').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
    expect(Math.min(...widths), `${width}px`).toBeGreaterThanOrEqual(least);
  }
});

// The same note for the certificates: beside the awards on wide screens they come two to a row.
test('certificate pictures show large beside the awards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const widths = await page.locator('#certificates .cert-frame').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(Math.min(...widths)).toBeGreaterThanOrEqual(300);
});

// Owner's note (2026-10-25): no text so small it is hard to read. Map labels (placed in a crowded
// picture) are the one exception.
test('no running text is smaller than 14px', async ({ page }) => {
  for (const [width, path] of [[375, '/'], [1440, '/'], [1440, '/work/vision-qc']] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    const small = await page.evaluate(() => {
      const found = new Set<string>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement!;
        if (!node.textContent!.trim() || el.closest('.sr-only, .map-labels, noscript') || !el.checkVisibility()) continue;
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < 14) found.add(`${el.tagName.toLowerCase()}.${el.className.split(' ')[0]} ${size}px "${node.textContent!.trim().slice(0, 24)}"`);
      }
      return [...found];
    });
    expect(small, `${width}px ${path}`).toEqual([]);
  }
});

// Client work stays anonymous (owner's rule since 2026-10-23): no page, and no data inside a page,
// names a client or a client's product.
test('client work never names the client', async ({ page }) => {
  // Clients, client products, and the words that would give away a client's sector.
  const names =
    /LinkNet|Link Net|SmartLitmas|Litmas|BAPAS|Ditjenpas|Dirjenpas|pemasyarakatan|kemasyarakatan|Lapas|Rutan|LPKS|narapidana|penjamin|parole|inmate|correctional|prison|BSrE|BSSN|\.go\.id/i;
  for (const path of ['/', '/work/vision-qc', '/work/voice-agent', '/work/agentic-rag', '/this-page-does-not-exist']) {
    await page.goto(path);
    expect((await page.content()).match(names)?.[0], path).toBeUndefined();
  }
});
