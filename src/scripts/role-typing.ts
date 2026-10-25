// The hero's role line types the owner's path, like the old site's typed roles (owner's requests,
// 2026-10-25): Data Scientist, then ML Engineer, then AI Engineer, and again, without end. They are job
// titles standing alone, so they take Title Case, as in Experience and the page title. The hero's
// switch (the round button by the map) pauses it on AI Engineer (WCAG 2.2.2). Letters change in place
// and nothing moves, so it cycles with reduced motion too. Screen readers read the role from a hidden
// copy; the typed letters are aria-hidden.
//
// The text follows time, not a chain of timers: a busy or throttled browser catches up instead of
// falling behind, and a page opened in a background tab starts typing when it is first seen.
const ROLES = ['Data Scientist', 'ML Engineer', 'AI Engineer'];
const START_MS = 250;
const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 550;
/** The last role rests longer before it is erased and the cycle starts again. */
const REST_MS = 2200;

export interface RoleTyping {
  play(): void;
  pause(): void;
}

/**
 * `typed` shows the letters; `line.dataset.typing` (cycle, or rest when paused) styles the caret.
 * `fromRest` starts on the last role, typed in full, as where the opening scene's title lands.
 */
export function typeRoles(typed: HTMLElement, line: HTMLElement, { fromRest = false } = {}): RoleTyping {
  // One cycle: each role typed, held, then erased.
  const cycle: { text: string; at: number }[] = [];
  let at = 0;
  ROLES.forEach((role, r) => {
    const last = r === ROLES.length - 1;
    for (let i = 1; i <= role.length; i++) {
      cycle.push({ text: role.slice(0, i), at });
      at += i < role.length ? TYPE_MS : last ? REST_MS : HOLD_MS;
    }
    for (let i = role.length - 1; i >= 0; i--) {
      cycle.push({ text: role.slice(0, i), at });
      at += ERASE_MS;
    }
  });
  const cycleLength = at;
  const final = ROLES[ROLES.length - 1];
  /** Where the last role is typed in full: a pause rests there, and play resumes from there. */
  const restAt = START_MS + cycle.find((step) => step.text === final)!.at;
  /** The text at time t: the last step that has started by then. */
  const textAt = (t: number) => {
    let i = 0;
    while (i + 1 < cycle.length && cycle[i + 1].at <= t) i++;
    return cycle[i].text;
  };

  let elapsed = fromRest ? restAt : 0;
  let last = 0;
  let raf = 0;

  const show = (text: string) => {
    if (typed.textContent !== text) typed.textContent = text;
  };
  if (fromRest) show(final);
  const frame = (now: number) => {
    elapsed += last ? now - last : 0;
    last = now;
    const t = elapsed - START_MS;
    show(t < 0 ? '' : textAt(t % cycleLength));
    raf = requestAnimationFrame(frame);
  };
  const play = () => {
    line.dataset.typing = 'cycle';
    if (!raf) raf = requestAnimationFrame(frame);
  };
  play();

  return {
    play,
    pause() {
      line.dataset.typing = 'rest';
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      elapsed = restAt;
      show(final);
    },
  };
}
