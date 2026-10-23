// Enhances the <details> menu: Esc closes and returns focus, links close it, and it closes
// when the window grows past the mobile breakpoint. Without JavaScript the menu still opens.
const menu = document.querySelector<HTMLDetailsElement>('details.nav-menu');

if (menu) {
  const summary = menu.querySelector('summary');

  menu.addEventListener('toggle', () => {
    document.documentElement.classList.toggle('menu-open', menu.open);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary?.focus();
    }
  });

  // Tab or Shift+Tab out of the menu closes it, so focus never lands on the page behind the
  // full-screen panel. A tap on empty panel space moves focus nowhere and keeps it open.
  menu.addEventListener('focusout', (event) => {
    if (menu.open && event.relatedTarget instanceof Node && !menu.contains(event.relatedTarget)) menu.open = false;
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) menu.open = false;
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) menu.open = false;
  });
}
