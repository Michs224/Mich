// Sends the contact form to the Google Apps Script endpoint in place (02 §10 #10), moved from the
// old Mich.html. Apps Script answers with a redirect whose page is often a 404 for anonymous
// visitors even though the row was saved, so any response counts as sent and only a network
// failure counts as failed. Without JavaScript the form posts to the same endpoint itself.
import { site } from '../data/site';

type Field = HTMLInputElement | HTMLTextAreaElement;

/** A request with no answer by then counts as failed, so "Sending…" never hangs. */
const TIMEOUT_MS = 15_000;

/** What to say under a field the browser finds invalid; keyed by the field's name. */
const ERRORS: Record<string, (field: Field) => string> = {
  Name: () => 'Please enter your name.',
  Email: (field) =>
    field.validity.valueMissing ? 'Please enter your email address.' : 'Please enter an email address like name@example.com.',
  Message: () => 'Please write a message.',
};

function emailLink(): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `mailto:${site.email}`;
  link.textContent = site.email;
  return link;
}

export function mountContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[role="status"]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = button?.querySelector<HTMLElement>('.label');
  const honeypot = form.elements.namedItem('leave_empty');
  if (!status || !button || !label || !(honeypot instanceof HTMLInputElement)) return;
  const idleLabel = label.textContent;
  const fields = [...form.querySelectorAll<Field>('input[required], textarea[required]')];

  // Errors appear under each field (linked by aria-describedby) instead of the browser's bubbles.
  // Without JavaScript, `required` and type="email" still validate natively.
  form.noValidate = true;
  const showError = (field: Field) => {
    const message = field.checkValidity() ? '' : (ERRORS[field.name]?.(field) ?? field.validationMessage);
    const slot = document.getElementById(`${field.id}-error`);
    if (slot) slot.textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };
  for (const field of fields) {
    field.addEventListener('input', () => {
      if (!field.hasAttribute('aria-invalid')) return;
      showError(field);
      if (status.dataset.state === 'invalid' && !fields.some((f) => f.hasAttribute('aria-invalid'))) {
        status.textContent = '';
        delete status.dataset.state;
      }
    });
  }

  const fail = () => {
    status.dataset.state = 'error';
    status.replaceChildren('The message did not go through. Please email me at ', emailLink(), '.');
  };

  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    fields.forEach(showError);
    const invalid = fields.find((field) => field.hasAttribute('aria-invalid'));
    if (invalid) {
      // Focus goes to the first problem. The status line says it too, for when focus was already there.
      status.dataset.state = 'invalid';
      status.textContent = 'Please check the fields marked above.';
      return invalid.focus();
    }
    // Only bots fill this field: people never see it and screen readers skip it. It answers like a
    // failure, so a person whose browser filled it anyway still gets the email address.
    if (honeypot.value) return fail();

    // aria-disabled, not disabled: disabling the focused button would drop keyboard focus to the page.
    sending = true;
    button.setAttribute('aria-disabled', 'true');
    label.textContent = 'Sending…';
    // A data attribute, not aria-busy: aria-busy on the form would hold back the status line.
    form.dataset.sending = '';
    status.textContent = '';
    delete status.dataset.state;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      await fetch(form.action, { method: 'POST', body: new FormData(form), signal: controller.signal });
      status.dataset.state = 'success';
      status.textContent = 'Message sent. Thank you!';
      form.reset();
    } catch {
      fail();
    } finally {
      clearTimeout(timer);
      sending = false;
      button.removeAttribute('aria-disabled');
      label.textContent = idleLabel;
      delete form.dataset.sending;
    }
  });
}
