// Loads the spectrogram terrain, a sound landscape along the bottom of Contact, at desktop width
// (allows3d). Where motion is allowed and scroll timelines exist, its playhead follows the scroll
// through --terrain-progress, set by a CSS view timeline on the canvas (02 §8c). Elsewhere it is
// drawn once, finished. The CSS timeline is the only source of motion (no scroll listener,
// 02 §10): while the canvas is on screen, each frame reads --terrain-progress, and the terrain is
// drawn again only if it changed.
import { allows3d, readColor, whenNear } from '../gl/core';
import type { Terrain, TerrainColors } from './terrain';

type CreateTerrain = (canvas: HTMLCanvasElement, colors: TerrainColors) => Terrain;

/** The ridges are filled with the page color, so the bands behind them stay hidden. */
function readColors(probe: HTMLElement): TerrainColors {
  return {
    fill: readColor(probe, 'var(--paper)'),
    line: readColor(probe, 'var(--field-line)'),
    playhead: readColor(probe, 'var(--link)'),
  };
}

export function mountTerrain(canvas: HTMLCanvasElement): void {
  if (!allows3d(1024)) return;
  const follows =
    CSS.supports('animation-timeline: view()') && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const dark = window.matchMedia('(prefers-color-scheme: dark)');

  const create = (createTerrain: CreateTerrain) => {
    try {
      return createTerrain(canvas, readColors(canvas));
    } catch {
      return undefined; // no WebGL2: the section stays plain
    }
  };

  // The still picture: no loop. It is drawn again only when its size or the color scheme changes.
  const still = (createTerrain: CreateTerrain, finished: number) => {
    const terrain = create(createTerrain);
    if (!terrain) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      terrain.resize(rect.width, rect.height, dpr);
      terrain.render(finished);
    };
    canvas.addEventListener('webglcontextlost', () => {
      canvas.classList.remove('is-still');
      terrain.dispose();
    });
    dark.addEventListener('change', () => {
      terrain.setColors(readColors(canvas));
      terrain.render(finished);
    });
    canvas.classList.add('is-still');
    new ResizeObserver(draw).observe(canvas); // its first callback draws the picture
  };

  const live = (createTerrain: CreateTerrain, finished: number) => {
    const terrain = create(createTerrain);
    if (!terrain) return;

    // live: follows the scroll. still: too slow for that, so it keeps the finished picture.
    // off: the WebGL context is gone.
    let mode: 'live' | 'still' | 'off' = 'live';
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let drawn = 0;
    let raf = 0;
    let visible = true;
    let lastDraw = 0;
    const frameTimes: number[] = [];

    const progress = () => Number(getComputedStyle(canvas).getPropertyValue('--terrain-progress')) || 0;

    const draw = (value: number) => {
      drawn = value;
      terrain.render(value);
    };

    const off = () => {
      if (mode === 'off') return;
      mode = 'off';
      cancelAnimationFrame(raf);
      canvas.classList.remove('is-live', 'is-still');
      terrain.dispose();
    };

    // A machine that cannot keep up stops drawing every frame but keeps the landscape.
    const settle = () => {
      mode = 'still';
      cancelAnimationFrame(raf);
      canvas.classList.replace('is-live', 'is-still');
      draw(finished);
    };

    const resize = () => {
      if (mode === 'off') return;
      const rect = canvas.getBoundingClientRect();
      terrain.resize(rect.width, rect.height, dpr);
      draw(mode === 'still' ? finished : progress());
    };

    const schedule = () => {
      if (!raf && visible && mode === 'live') raf = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      raf = 0;
      if (mode !== 'live' || !visible) return;
      schedule();
      const next = progress();
      if (Math.abs(next - drawn) < 0.0005) return;
      if (frameTimes.length < 20) {
        if (lastDraw && now - lastDraw < 100) frameTimes.push(now - lastDraw); // consecutive frames only
        if (frameTimes.length === 20) {
          const average = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          if (average > 40) return settle();
          if (average > 22 && dpr > 1) {
            dpr = 1;
            resize();
          }
        }
      }
      lastDraw = now;
      draw(next);
    };

    canvas.addEventListener('webglcontextlost', off);
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      schedule();
    }).observe(canvas);
    dark.addEventListener('change', () => {
      if (mode === 'off') return;
      terrain.setColors(readColors(canvas));
      draw(drawn);
    });

    // First frame before the canvas shows.
    resize();
    canvas.classList.add('is-live');
  };

  // The section, not the canvas: the canvas stays hidden until the first frame is drawn.
  whenNear(canvas.parentElement ?? canvas, () => {
    import('./terrain')
      .then(({ createTerrain, FINISHED }) => (follows ? live : still)(createTerrain, FINISHED))
      .catch(() => {});
  });
}
