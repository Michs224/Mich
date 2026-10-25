import { test, expect, type Page } from './fixtures';
import { site } from '../../src/data/site';

const endpoint = `${site.formEndpoint}*`;

async function fillForm(page: Page) {
  const form = page.locator('form[name="contact"]');
  await form.getByLabel('Name').fill('Ada Lovelace');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByLabel('Message').fill('Hello from the test suite.');
  return form;
}

test.describe('contact form', () => {
  test('fields have labels', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form[name="contact"]');
    await expect(form.getByLabel('Name')).toHaveAttribute('name', 'Name');
    const email = form.getByLabel('Email');
    await expect(email).toHaveAttribute('name', 'Email');
    await expect(email).toHaveAttribute('type', 'email');
    await expect(email).toHaveAttribute('autocomplete', 'email');
    await expect(email).toHaveAttribute('spellcheck', 'false');
    await expect(form.getByLabel('Message')).toHaveAttribute('name', 'Message');
  });

  test('success shows confirmation', async ({ page }) => {
    await page.route(endpoint, (route) => route.fulfill({ status: 200, body: 'ok' }));
    await page.goto('/');
    const form = await fillForm(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByRole('status')).toContainText('Message sent');
    await expect(form.getByLabel('Name')).toHaveValue('');
    await expect(form.getByLabel('Message')).toHaveValue('');
  });

  test('blocked request shows email fallback', async ({ page }) => {
    await page.route(endpoint, (route) => route.abort());
    await page.goto('/');
    const form = await fillForm(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByRole('status').locator(`a[href="mailto:${site.email}"]`)).toHaveCount(1);
  });

  test('honeypot blocks bots', async ({ page }) => {
    const sent: string[] = [];
    await page.route(endpoint, (route) => {
      sent.push(route.request().url());
      return route.fulfill({ status: 200 });
    });
    await page.goto('/');
    const form = await fillForm(page);
    await form.locator('.honeypot input').fill('Spam Inc', { force: true });
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByRole('status')).not.toBeEmpty();
    expect(sent).toEqual([]);
  });

  test('button shows progress', async ({ page }) => {
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(endpoint, async (route) => {
      await held;
      await route.fulfill({ status: 200 });
    });
    await page.goto('/');
    const form = await fillForm(page);
    const button = form.locator('button[type="submit"]');
    await button.click();
    await expect(button).toBeDisabled();
    await expect(button).toHaveText('Sending…');
    release();
    await expect(button).toBeEnabled();
    await expect(button).toHaveText('Send message');
  });

  test('honeypot does not look like a field browsers autofill', async ({ page }) => {
    await page.goto('/');
    const trap = page.locator('form[name="contact"] .honeypot');
    const words = [
      await trap.locator('input').getAttribute('name'),
      await trap.locator('input').getAttribute('id'),
      await trap.locator('label').textContent(),
    ].join(' ');
    expect(words).not.toMatch(/company|organi[sz]ation|name|e-?mail|phone|tel|address|street|city|zip|postal|country|url|website|fax/i);
  });

  test('a request that never answers ends in the email fallback', async ({ page }) => {
    await page.clock.install();
    await page.route(endpoint, () => {}); // never answers
    await page.goto('/');
    const form = await fillForm(page);
    const button = form.locator('button[type="submit"]');
    await button.click();
    await expect(button).toHaveText('Sending…');
    await page.clock.fastForward(20_000);
    await expect(form.getByRole('status').locator(`a[href="mailto:${site.email}"]`)).toHaveCount(1);
    await expect(button).toHaveText('Send message');
  });

  test('the status line is never inside an aria-busy element', async ({ page }) => {
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(endpoint, async (route) => {
      await held;
      await route.fulfill({ status: 200 });
    });
    await page.goto('/');
    const form = await fillForm(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.locator('button[type="submit"]')).toHaveText('Sending…');
    expect(await form.getByRole('status').evaluate((el) => el.closest('[aria-busy="true"]') !== null)).toBe(false);
    release();
  });

  test('focus stays on the button while sending', async ({ page }) => {
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(endpoint, async (route) => {
      await held;
      await route.fulfill({ status: 200 });
    });
    await page.goto('/');
    const form = await fillForm(page);
    const button = form.locator('button[type="submit"]');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveText('Sending…');
    await expect(button).toBeFocused();
    release();
    await expect(button).toHaveText('Send message');
    await expect(button).toBeFocused();
  });

  test('invalid fields explain themselves', async ({ page }) => {
    const sent: string[] = [];
    await page.route(endpoint, (route) => {
      sent.push(route.request().url());
      return route.fulfill({ status: 200 });
    });
    await page.goto('/');
    const form = page.locator('form[name="contact"]');
    await form.getByLabel('Email').fill('not-an-email');
    await form.getByRole('button', { name: 'Send message' }).click();
    const name = form.getByLabel('Name');
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription(/your name/i);
    await expect(form.getByLabel('Email')).toHaveAccessibleDescription(/email address like/i);
    await expect(form.getByLabel('Message')).toHaveAccessibleDescription(/write a message/i);
    expect(sent).toEqual([]);
    await name.fill('Ada');
    await expect(name).not.toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription('');
  });

  test('works without JS', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    const form = page.locator('form[name="contact"]');
    await expect(form).toHaveAttribute('action', site.formEndpoint);
    await expect(form).toHaveAttribute('method', 'post');
    await context.close();
  });
});
