// Runs the home page's opening scene (Intro.astro) when the gate in <head> chose to show it. The name
// and the title form, hold until 3.6 s after the page started loading (sooner if this script arrives
// late), then the name flies into the header's wordmark and the title into the hero's role line while
// the paper fades and the hero comes in: about 4.8 s in all, slow enough to be seen (owner's requests,
// 2026-10-25). Any click, tap, key, or scroll ends it at once, without the flights; with reduced motion
// it fades. A page opened in a background tab starts the scene over when it is first seen.
const HOLD_UNTIL_MS = 3600;
const FLIGHT_MS = 1200;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // --ease
const ENDERS = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const;

const root = document.documentElement;
const curtain = document.querySelector<HTMLElement>('.intro');
if (curtain && root.classList.contains('has-intro')) play(curtain);

function play(curtain: HTMLElement) {
  const name = curtain.querySelector<HTMLElement>('.intro-name')!;
  const title = curtain.querySelector<HTMLElement>('.intro-title')!;
  const paper = curtain.querySelector<HTMLElement>('.intro-paper')!;
  const points = curtain.querySelector<HTMLElement>('.intro-points')!;
  const wordmark = document.querySelector<HTMLElement>('.site-header .wordmark');
  const role = document.querySelector<HTMLElement>('#top .role');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let leaving = false;
  let timer = 0;

  const end = () => leave(true);
  for (const type of ENDERS) window.addEventListener(type, end, { passive: true });

  const begin = (late: boolean) => {
    // Unseen until now: the card forms again from the start, and holds as long as on a fresh load.
    if (late) for (const animation of curtain.getAnimations({ subtree: true })) animation.currentTime = 0;
    timer = window.setTimeout(() => leave(false), late ? HOLD_UNTIL_MS : Math.max(0, HOLD_UNTIL_MS - performance.now()));
  };
  const whenSeen = (late: boolean) => {
    if (document.visibilityState === 'visible') return begin(late);
    document.addEventListener('visibilitychange', () => whenSeen(true), { once: true });
  };
  whenSeen(false);

  function leave(quick: boolean) {
    if (leaving) return;
    leaving = true;
    clearTimeout(timer);
    for (const type of ENDERS) window.removeEventListener(type, end);
    curtain.style.pointerEvents = 'none';
    // The hero comes in as the paper goes; the role line starts on the title (Hero.astro).
    const release = () => {
      root.classList.remove('intro-hold');
      document.dispatchEvent(new Event('intro-leave'));
    };

    const fade = [{ opacity: 1 }, { opacity: 0 }];
    const fadeMs = quick ? 200 : 500;
    // The hero comes in once the name and title are out of its way: when the flights have carried them
    // past the headline (on phones they start right over it), or when they have faded.
    const flies = !quick && !reduceMotion && wordmark && role;
    const departures = flies
      ? [fly(name, textBox(wordmark), wordmark, FLIGHT_MS), fly(title, roleBox(role), role, FLIGHT_MS)]
      : [name, title].map((el) => el.animate(fade, { duration: fadeMs, fill: 'forwards' }));
    if (flies) window.setTimeout(release, 300);
    else Promise.all(departures.map((part) => part.finished)).finally(release);
    const parts = [
      ...departures,
      points.animate(fade, { duration: quick ? 200 : 300, fill: 'forwards' }),
      paper.animate(fade, { duration: quick ? 250 : 1000, easing: EASE, fill: 'forwards' }),
    ];
    Promise.all(parts.map((part) => part.finished)).finally(() => {
      curtain.remove();
      for (const target of [wordmark, role]) if (target) target.style.opacity = '';
    });
  }
}

interface Landing {
  left: number;
  /** The vertical middle of the text there. */
  middle: number;
}

/** Where the wordmark's text sits. */
function textBox(wordmark: HTMLElement): Landing {
  const range = document.createRange();
  range.selectNodeContents(wordmark);
  const box = range.getBoundingClientRect();
  return { left: box.left, middle: box.top + box.height / 2 };
}

/** Where the role line's text starts; the line centers it, and it is still empty here. */
function roleBox(role: HTMLElement): Landing {
  const box = role.getBoundingClientRect();
  return { left: box.left, middle: box.top + box.height / 2 };
}

/**
 * Moves and scales `el` so its text lands on `to`, at `target`'s font size; `target` stays hidden
 * until the curtain goes, so the text is never seen twice.
 */
function fly(el: HTMLElement, to: Landing, target: HTMLElement, duration: number): Animation {
  const from = el.getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(el).fontSize);
  const x = to.left - from.left;
  const y = to.middle - (from.top + (from.height * scale) / 2);
  target.style.opacity = '0';
  el.style.transformOrigin = 'left top';
  return el.animate([{ transform: 'none' }, { transform: `translate(${x}px, ${y}px) scale(${scale})` }], {
    duration,
    easing: EASE,
    fill: 'forwards',
  });
}
