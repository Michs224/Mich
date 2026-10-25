// Loads the embedding map on every screen without Save-Data, phones included: there a sideways drag
// turns it and a vertical swipe still scrolls the page (touch-action: pan-y). After a short intro it
// keeps turning slowly on its own; a pointer on it, a drag, or a pressed field holds it. The round
// button in its corner is the hero's one switch for lasting motion: shown in every mode, it pauses or
// plays the turn and the hero's role line. With reduced motion the map loads too but moves only while
// dragged (no intro, no tilt toward the pointer) until the visitor presses play on that button.
// The poster stays visible until the first WebGL frame (same pose) is drawn (02 §8b).
import { allows3d, readColor, whenNear } from '../gl/core';
import { INITIAL_POSE, nearestProject, pickHover, placeLabels, project, type Box, type Placement, type Pose, type ScreenPoint } from './layout';
import type { MapColors, MapData, Renderer } from './render';

const INTRO_MS = 3200;
const INTRO_TURN = 0.6;
/** Radians per millisecond: one full turn in 100 seconds. */
const TURN_SPEED = (2 * Math.PI) / 100_000;
/** After a hold ends, the turn waits this long before it eases back in. */
const HOLD_MS = 1500;
const DRAG_SPEED = 0.008;
const PICK_RADIUS = 22;

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
/** How long a label takes to glide to a new place beside its point. */
const GLIDE_MS = 450;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function readColors(probe: HTMLElement): MapColors {
  return {
    fields: {
      'llm-voice': readColor(probe, 'var(--field-llm-voice)'),
      'vision-audio': readColor(probe, 'var(--field-vision-audio)'),
      'ml-data': readColor(probe, 'var(--field-ml-data)'),
      other: readColor(probe, 'var(--field-other)'),
    },
    tool: readColor(probe, 'var(--muted)'),
    line: readColor(probe, 'var(--muted)'),
  };
}

/** A label element and the screen point it belongs to. */
interface LabelElement {
  el: HTMLElement;
  x: number;
  y: number;
}

/** Where each label was last placed, so it keeps its place while that stays clear (layout.ts). */
const lastPlacement = new WeakMap<HTMLElement, Placement>();
/** Where each label was last drawn (its translate), and the way it has left to glide. */
const lastDrawn = new WeakMap<HTMLElement, { x: number; y: number }>();
const glides = new WeakMap<HTMLElement, { dx: number; dy: number; since: number }>();

/**
 * Places labels with placeLabels (layout.ts). Sizes and positions are read first. A label's layout
 * box stays where the build put it (its % left and top); only `translate` moves it from there, so
 * placing labels, even every frame of the intro, never forces a layout and never counts as layout
 * shift. Labels stay inside the stage and clear of the obstacles (the pause button).
 *
 * With `glide` (the live map, where motion is allowed) a label that changes places glides there
 * over GLIDE_MS instead of jumping (owner's question, 2026-10-25). It keeps following its point the
 * whole time; only the way from its old place to the new one eases out, so it never lags behind. It
 * fades on the way, nearly gone midway, so where two gliding labels cross, neither is legible over
 * the other. Returns whether a label is still on its way, so the map keeps drawing until it arrives.
 */
function settleLabels(
  spots: LabelElement[],
  stage: { width: number; height: number },
  points: readonly { x: number; y: number }[],
  obstacles: readonly Box[] = [],
  glide = false,
): boolean {
  const now = performance.now();
  let gliding = false;
  const sized = spots.map((spot) => ({ ...spot, w: spot.el.offsetWidth, h: spot.el.offsetHeight }));
  const bases = spots.map((spot) => ({ x: spot.el.offsetLeft, y: spot.el.offsetTop }));
  const previous = spots.map((spot) => lastPlacement.get(spot.el));
  placeLabels(sized, stage, points, obstacles, previous).forEach((corner, i) => {
    const { el } = spots[i];
    // A label with no free spot hides rather than lands on another.
    el.style.visibility = corner ? '' : 'hidden';
    if (!corner) {
      lastPlacement.delete(el);
      glides.delete(el);
      return;
    }
    const target = { x: corner.x - bases[i].x, y: corner.y - bases[i].y };
    const before = previous[i];
    const drawn = lastDrawn.get(el);
    lastPlacement.set(el, corner);
    el.dataset.place = `${corner.side} ${corner.line}`;
    // A new place: set off from where the label is drawn now.
    if (glide && before && drawn && (before.side !== corner.side || before.line !== corner.line)) {
      glides.set(el, { dx: drawn.x - target.x, dy: drawn.y - target.y, since: now });
    }
    const way = glide ? glides.get(el) : undefined;
    const left = way ? 1 - easeInOut(Math.min(1, (now - way.since) / GLIDE_MS)) : 0;
    if (way && left === 0) glides.delete(el);
    if (left > 0) gliding = true;
    const x = target.x + (way ? way.dx * left : 0);
    const y = target.y + (way ? way.dy * left : 0);
    lastDrawn.set(el, { x, y });
    el.style.translate = `${x}px ${y}px`;
    el.style.opacity = left > 0 ? String(Math.abs(1 - 2 * left)) : '';
  });
  return gliding;
}

export function mountEmbeddingMap(figure: HTMLElement): void {
  const legend = [...figure.querySelectorAll<HTMLButtonElement>('.map-legend button')];
  const stageEl = figure.querySelector<HTMLElement>('.map-stage');
  const dataText = figure.querySelector('script[type="application/json"]')?.textContent;
  if (!stageEl || !dataText) return;
  const mapData: MapData = JSON.parse(dataText);
  // Every project has a label; CSS shows the featured ones, or the pressed legend field's.
  const labels = [...figure.querySelectorAll<HTMLElement>('.map-label[data-index]')];
  const shownLabels = () => labels.filter((el) => el.offsetParent !== null);
  let domain: string | null = null;
  let live = false;

  // The hero's switch (WCAG 2.2.2). The role line and, on the live map, the turn follow the event it
  // sends; `asked` marks a press, which with reduced motion is the visitor's consent to the turn.
  const toggle = figure.querySelector<HTMLButtonElement>('.map-turn');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const playing = toggle.dataset.playing !== 'true';
      toggle.dataset.playing = String(playing);
      toggle.setAttribute('aria-label', playing ? 'Pause the animation' : 'Play the animation');
      figure.dispatchEvent(new CustomEvent('hero-animation', { bubbles: true, detail: { playing, asked: true } }));
    });
  }
  // The button sits in the stage's corner, over the picture; labels keep clear of it.
  const buttonBox = (): Box[] =>
    toggle ? [{ x: toggle.offsetLeft, y: toggle.offsetTop, w: toggle.offsetWidth, h: toggle.offsetHeight }] : [];

  // Poster mode: place the shown labels with the same math the canvas uses, without overlaps.
  const placePosterLabels = () => {
    if (live) return;
    const rect = stageEl.getBoundingClientRect();
    const size = { width: rect.width, height: rect.height };
    const points = mapData.projects.map((p) => project(p.xyz, INITIAL_POSE, size));
    settleLabels(
      shownLabels().map((el) => {
        const index = Number(el.dataset.index);
        return { el, x: points[index].x, y: points[index].y };
      }),
      size,
      points,
      buttonBox(),
    );
  };
  // The observer's first callback places them after the browser's own layout, instead of forcing
  // a layout of the whole page while this script runs.
  new ResizeObserver(placePosterLabels).observe(stageEl);
  // Until the live map takes over, a legend press re-places the labels it showed.
  let onHighlightChange = placePosterLabels;

  // The legend works in every mode: it swaps in the pressed field's labels, and on the live map
  // it lights that field's points too.
  for (const button of legend) {
    button.addEventListener('click', () => {
      domain = domain === button.dataset.domain ? null : (button.dataset.domain ?? null);
      for (const b of legend) b.setAttribute('aria-pressed', String(b.dataset.domain === domain));
      if (domain) figure.dataset.highlight = domain;
      else delete figure.dataset.highlight;
      onHighlightChange();
    });
  }

  if (!allows3d()) return;
  // The figure, not the canvas: hidden elements never intersect.
  whenNear(figure, () => {
    import('./render').then(({ createRenderer }) => start(createRenderer)).catch(() => {});
  });

  function start(createRenderer: (c: HTMLCanvasElement, d: MapData, k: MapColors) => Renderer) {
    const canvas = figure.querySelector('canvas');
    const stage = stageEl;
    const probe = figure.querySelector<HTMLElement>('.map-probe');
    const hoverLabel = figure.querySelector<HTMLElement>('.map-label.is-hover');
    if (!canvas || !stage || !probe || !hoverLabel || !toggle) return;
    const data = mapData;

    let renderer: Renderer;
    try {
      renderer = createRenderer(canvas, data, readColors(probe));
    } catch {
      return; // no WebGL2: the poster stays
    }

    let pose: Pose = { ...INITIAL_POSE };
    let tilt = { yaw: 0, pitch: 0 };
    let tiltTarget = { yaw: 0, pitch: 0 };
    let size = { width: 1, height: 1 };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let projected: ScreenPoint[] = [];
    let hover = -1;
    let raf = 0;
    let visible = true;
    let disposed = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let introStart = 0;
    let animating = !reduceMotion.matches;
    // The slow turn after the intro follows the hero's switch. With reduced motion it waits until the
    // visitor presses play; a map too slow for it stops turning for good.
    let consented = !reduceMotion.matches;
    let affordable = true;
    let turning = consented && toggle.dataset.playing === 'true';
    let speed = 0;
    let pointerOn = false;
    let releasedAt = -Infinity;
    let resumeTimer = 0;
    let lastFrame = 0;
    /** A label is still gliding to a new place (settleLabels): keep drawing until it arrives. */
    let labelsGliding = false;
    const frameTimes: number[] = [];
    let drag: { x: number; y: number; moved: boolean } | null = null;

    const currentPose = (): Pose => ({ yaw: pose.yaw + tilt.yaw, pitch: pose.pitch + tilt.pitch });
    // A pointer on the map, a drag, or a pressed field (its labels stay readable) holds the turn.
    const held = (now: number) => pointerOn || drag !== null || domain !== null || now - releasedAt < HOLD_MS;

    function hold() {
      pointerOn = true;
      speed = 0;
    }

    function release() {
      pointerOn = false;
      releasedAt = performance.now();
      clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(schedule, HOLD_MS);
    }

    function moveLabels() {
      projected = data.projects.map((p) => project(p.xyz, currentPose(), size));
      labelsGliding = settleLabels(
        shownLabels().map((el) => {
          const index = Number(el.dataset.index);
          return { el, x: projected[index].x, y: projected[index].y };
        }),
        size,
        projected,
        buttonBox(),
        !reduceMotion.matches,
      );
      if (hover >= 0) settleLabels([{ el: hoverLabel!, x: projected[hover].x, y: projected[hover].y }], size, projected, buttonBox());
    }

    function draw() {
      renderer.setPose(currentPose());
      renderer.render();
      moveLabels();
    }

    function fallback() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      figure.classList.remove('is-live');
      figure.dataset.animating = 'false';
      hoverLabel!.hidden = true;
      clearTimeout(resumeTimer);
      live = false;
      placePosterLabels();
      renderer.dispose();
    }

    function needsFrame(now: number) {
      return (
        animating ||
        drag !== null ||
        labelsGliding ||
        (turning && !held(now)) ||
        Math.abs(tilt.yaw - tiltTarget.yaw) > 0.0005 ||
        Math.abs(tilt.pitch - tiltTarget.pitch) > 0.0005
      );
    }

    function schedule() {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(tick);
    }

    /** Every 20 frames of motion the map makes on its own, the pace decides what it can afford. */
    function checkPace(frameTime: number) {
      frameTimes.push(frameTime);
      if (frameTimes.length < 20) return;
      const average = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      frameTimes.length = 0;
      // Too slow for the intro: the poster comes back. The slow turn moves so little per frame that a
      // low frame rate still looks smooth, so it stops only below 10 frames a second; dragging works.
      if (animating && average > 40) return fallback();
      if (!animating && average > 100) {
        affordable = false;
        turning = false;
        speed = 0;
        return;
      }
      if (average > 22 && dpr > 1) {
        dpr = 1;
        resize();
      }
    }

    function tick(now: number) {
      raf = 0;
      if (disposed) return;
      // No frame time across a gap: a hidden tab or a held map leaves one when the loop restarts.
      const dt = lastFrame && now - lastFrame < 250 ? now - lastFrame : 0;
      lastFrame = now;
      if (dt && (animating || speed > 0)) {
        checkPace(dt);
        if (disposed) return;
      }
      if (animating) {
        if (!introStart) introStart = now;
        const t = Math.min((now - introStart) / INTRO_MS, 1);
        pose = { yaw: INITIAL_POSE.yaw + INTRO_TURN * easeOut(t), pitch: INITIAL_POSE.pitch };
        if (t >= 1) {
          animating = false;
          figure.dataset.animating = 'false';
          // The intro slows down into the turn.
          if (turning) speed = TURN_SPEED;
        }
      } else {
        // Stopped at once by a hold; eased back in after it.
        speed = turning && !held(now) ? speed + (TURN_SPEED - speed) * Math.min(1, dt / 800) : 0;
        pose = { yaw: pose.yaw + speed * dt, pitch: pose.pitch };
      }
      tilt = { yaw: tilt.yaw + (tiltTarget.yaw - tilt.yaw) * 0.12, pitch: tilt.pitch + (tiltTarget.pitch - tilt.pitch) * 0.12 };
      draw();
      if (needsFrame(now)) schedule();
      else lastFrame = 0;
    }

    function resize() {
      const rect = stage!.getBoundingClientRect();
      size = { width: rect.width, height: rect.height };
      renderer.resize(rect.width, rect.height, dpr);
      draw();
    }

    function stopIntro() {
      if (!animating) return;
      animating = false;
      figure.dataset.animating = 'false';
    }

    function setHover(index: number) {
      if (index === hover) return;
      hover = index;
      // The hover label is reused for each point: a new point starts afresh, not where the last one was.
      lastPlacement.delete(hoverLabel!);
      renderer.setHighlight(hover >= 0 ? { index: hover } : domain ? { domain } : null);
      hoverLabel!.hidden = hover < 0;
      if (hover >= 0) hoverLabel!.textContent = data.projects[hover].title;
      canvas!.style.cursor = hover >= 0 ? 'pointer' : drag ? 'grabbing' : 'grab';
      draw();
    }

    function pointerAt(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    canvas.addEventListener('webglcontextlost', fallback);

    canvas.addEventListener('pointerdown', (event) => {
      drag = { x: event.clientX, y: event.clientY, moved: false };
      hold();
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', (event) => {
      if (drag) {
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        if (drag.moved) {
          stopIntro();
          pose = { yaw: pose.yaw + dx * DRAG_SPEED, pitch: clamp(pose.pitch + dy * DRAG_SPEED, -1.2, 1.2) };
          drag.x = event.clientX;
          drag.y = event.clientY;
          canvas.style.cursor = 'grabbing';
          schedule();
        }
        return;
      }
      if (event.pointerType !== 'mouse') return;
      hold();
      const at = pointerAt(event);
      setHover(pickHover(at, projected, hover, PICK_RADIUS));
      if (reduceMotion.matches) return;
      tiltTarget = { yaw: (at.x / size.width - 0.5) * 0.12, pitch: (at.y / size.height - 0.5) * 0.08 };
      schedule();
    });

    canvas.addEventListener('pointerup', (event) => {
      const wasDrag = drag?.moved;
      drag = null;
      // A mouse is still on the map and keeps holding it; a finger has left.
      if (event.pointerType !== 'mouse') release();
      canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab';
      if (wasDrag) return;
      // A mouse opens the project whose label is showing: the map may have tilted a little since the
      // pointer last moved, taking the point just out of reach while its label still shows.
      const picked =
        event.pointerType === 'mouse' && hover >= 0 ? hover : nearestProject(pointerAt(event), projected, PICK_RADIUS);
      if (picked < 0) return;
      // On touch the first tap shows the label; a second tap on the same point opens it.
      if (event.pointerType !== 'mouse' && hover !== picked) return setHover(picked);
      // Like a link: a middle click or a click with a modifier opens a new tab.
      const href = data.projects[picked].href;
      if (event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });

    // A touch the page takes over to scroll is cancelled, not lifted: let go of the map all the same.
    canvas.addEventListener('pointercancel', () => {
      drag = null;
      canvas.style.cursor = 'grab';
      release();
    });

    canvas.addEventListener('pointerleave', () => {
      if (drag) return;
      setHover(-1);
      tiltTarget = { yaw: 0, pitch: 0 };
      release();
      schedule();
    });

    figure.addEventListener('hero-animation', (event) => {
      const { playing, asked } = (event as CustomEvent<{ playing: boolean; asked: boolean }>).detail;
      if (asked && playing) consented = true;
      turning = playing && consented && affordable;
      if (!turning) speed = 0;
      schedule();
    });

    onHighlightChange = () => {
      if (hover < 0) {
        renderer.setHighlight(domain ? { domain } : null);
        draw();
      }
      // A pressed field holds the turn (see held); letting go of it starts the wait to resume.
      if (!domain) release();
    };

    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && needsFrame(performance.now())) schedule();
    }).observe(figure);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      renderer.setColors(readColors(probe));
      draw();
    });

    // First frame in the poster's pose, then swap and start the short intro (none with reduced motion).
    live = true;
    resize();
    figure.dataset.animating = String(animating);
    figure.classList.add('is-live');
    schedule();
  }
}
