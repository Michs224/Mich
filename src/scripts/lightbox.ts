// Opens a picture larger in the page's dialog.lightbox. Each picture is a link to its full-size
// file, so without JavaScript, or with a modifier key or middle click, the link opens the file.
const dialog = document.querySelector<HTMLDialogElement>('dialog.lightbox');

if (dialog) {
  const full = dialog.appendChild(document.createElement('img'));

  // Pictures written into the Markdown body become the same kind of link.
  for (const img of document.querySelectorAll<HTMLImageElement>('.prose img')) {
    if (img.closest('a')) continue;
    const link = document.createElement('a');
    link.className = 'zoom';
    link.href = img.currentSrc || img.src;
    img.replaceWith(link);
    link.append(img);
  }

  for (const link of document.querySelectorAll<HTMLAnchorElement>('a.zoom')) {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      full.src = link.getAttribute('href')!;
      full.alt = link.querySelector('img')?.alt ?? '';
      // A diagram, shown whole on white on its page, opens with the same treatment.
      full.classList.toggle('whole', link.closest('.whole') !== null);
      dialog.showModal();
    });
  }

  dialog.querySelector('.close')?.addEventListener('click', () => dialog.close());
  // The dialog fills the screen, so a click that lands on the dialog itself is beside the picture.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
