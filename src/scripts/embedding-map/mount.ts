// Loads the embedding map only where it helps: desktop width, no Save-Data. With reduced motion it
// loads too but moves only while dragged: no intro turn, no tilt toward the pointer.
// The poster stays visible until the first WebGL frame (same pose) is drawn (02 §8b).
import { allows3d, readColor, whenNear } from '../gl/core';
import { INITIAL_POSE, nearestProject, placeLabels, project, type Pose, type ScreenPoint } from './layout';
import type { MapColors, MapData, Renderer } from './render';

const INTRO_MS = 3200;
const INTRO_TURN = 0.6;
const DRAG_SPEED = 0.008;
const PICK_RADIUS = 22;

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function readColors(probe: HTMLElement): MapColors {
  return {
    fields: {
      'llm-voice': readColor(probe, 'var(--field-llm-voice)'),
      'vision-audio': readColor(probe, 'var(--field-vision-audio)'),
      'ml-data': readColor(probe, 'var(--field-ml-data)'),
      software: readColor(probe, 'var(--field-software)'),
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

/**
 * Places labels with placeLabels (layout.ts). Sizes and positions are read first. A label's layout
 * box stays where the build put it (its % left and top); only `translate` moves it from there, so
 * placing labels, even every frame of the intro, never forces a layout and never counts as layout
 * shift.
 */
function settleLabels(spots: LabelElement[], stageWidth: number, points: readonly { x: number; y: number }[]) {
  const sized = spots.map((spot) => ({ ...spot, w: spot.el.offsetWidth, h: spot.el.offsetHeight }));
  const bases = spots.map((spot) => ({ x: spot.el.offsetLeft, y: spot.el.offsetTop }));
  placeLabels(sized, stageWidth, points).forEach((corner, i) => {
    spots[i].el.style.translate = `${corner.x - bases[i].x}px ${corner.y - bases[i].y}px`;
  });
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
      rect.width,
      points,
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
    if (!canvas || !stage || !probe || !hoverLabel) return;
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
    let lastFrame = 0;
    const frameTimes: number[] = [];
    let drag: { x: number; y: number; moved: boolean } | null = null;

    const currentPose = (): Pose => ({ yaw: pose.yaw + tilt.yaw, pitch: pose.pitch + tilt.pitch });

    function moveLabels() {
      projected = data.projects.map((p) => project(p.xyz, currentPose(), size));
      settleLabels(
        shownLabels().map((el) => {
          const index = Number(el.dataset.index);
          return { el, x: projected[index].x, y: projected[index].y };
        }),
        size.width,
        projected,
      );
      if (hover >= 0) settleLabels([{ el: hoverLabel!, x: projected[hover].x, y: projected[hover].y }], size.width, projected);
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
      live = false;
      placePosterLabels();
      renderer.dispose();
    }

    function needsFrame() {
      return animating || drag !== null || Math.abs(tilt.yaw - tiltTarget.yaw) > 0.0005 || Math.abs(tilt.pitch - tiltTarget.pitch) > 0.0005;
    }

    function schedule() {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(tick);
    }

    function tick(now: number) {
      raf = 0;
      if (disposed) return;
      if (animating) {
        if (!introStart) introStart = now;
        const t = Math.min((now - introStart) / INTRO_MS, 1);
        pose = { yaw: INITIAL_POSE.yaw + INTRO_TURN * easeOut(t), pitch: INITIAL_POSE.pitch };
        if (lastFrame) frameTimes.push(now - lastFrame);
        lastFrame = now;
        if (frameTimes.length === 20) {
          const average = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          if (average > 40) return fallback();
          if (average > 22 && dpr > 1) {
            dpr = 1;
            resize();
          }
        }
        if (t >= 1) {
          animating = false;
          figure.dataset.animating = 'false';
        }
      }
      tilt = { yaw: tilt.yaw + (tiltTarget.yaw - tilt.yaw) * 0.12, pitch: tilt.pitch + (tiltTarget.pitch - tilt.pitch) * 0.12 };
      draw();
      if (needsFrame()) schedule();
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
      const at = pointerAt(event);
      setHover(nearestProject(at, projected, PICK_RADIUS));
      if (reduceMotion.matches) return;
      tiltTarget = { yaw: (at.x / size.width - 0.5) * 0.12, pitch: (at.y / size.height - 0.5) * 0.08 };
      schedule();
    });

    canvas.addEventListener('pointerup', (event) => {
      const wasDrag = drag?.moved;
      drag = null;
      canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab';
      if (wasDrag) return;
      const picked = nearestProject(pointerAt(event), projected, PICK_RADIUS);
      if (picked < 0) return;
      // On touch the first tap shows the label; a second tap on the same point opens it.
      if (event.pointerType !== 'mouse' && hover !== picked) return setHover(picked);
      // Like a link: a middle click or a click with a modifier opens a new tab.
      const href = data.projects[picked].href;
      if (event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });

    canvas.addEventListener('pointerleave', () => {
      if (drag) return;
      setHover(-1);
      tiltTarget = { yaw: 0, pitch: 0 };
      schedule();
    });

    onHighlightChange = () => {
      if (hover < 0) {
        renderer.setHighlight(domain ? { domain } : null);
        draw();
      }
    };

    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && needsFrame()) schedule();
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
