// Loads the spectrogram terrain behind the Trace stage at desktop width (allows3d). Where the stage
// pins (motion allowed, scroll timelines, a tall enough window), the terrain follows the scroll
// through --trace-progress (02 §8c). Elsewhere it is drawn once, finished, under the static list.
// The CSS timeline is the only source of motion (no scroll listener, 02 §10): while Trace is on
// screen, each frame reads --trace-progress, and the terrain is drawn again only if it changed.
import { allows3d, readColor, whenNear } from '../gl/core';
import type { Terrain, TerrainColors } from './terrain';

function readColors(probe: HTMLElement): TerrainColors {
  return {
    fill: readColor(probe, 'var(--block)'),
    line: readColor(probe, 'var(--on-block-muted)'),
    playhead: readColor(probe, 'var(--accent)'),
  };
}

export function mountSpectrogram(section: HTMLElement): void {
  const track = section.querySelector<HTMLElement>('.trace-track');
  const stage = section.querySelector<HTMLElement>('.trace-stage');
  const text = section.querySelector<HTMLElement>('.trace-inner');
  const canvas = section.querySelector<HTMLCanvasElement>('.trace-canvas');
  // Same motion and height conditions as the pinned stage in Trace.astro (allows3d covers the
  // width): without them Trace is a static list.
  const pinned =
    CSS.supports('animation-timeline: view()') &&
    window.matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 640px)').matches;
  if (!track || !stage || !text || !canvas || !allows3d()) return;

  // The still picture: no loop. It is drawn again only when its size or the color scheme changes.
  const still = (createTerrain: (canvas: HTMLCanvasElement, colors: TerrainColors) => Terrain, finished: number) => {
    let terrain: Terrain;
    try {
      terrain = createTerrain(canvas, readColors(canvas));
    } catch {
      return; // no WebGL2: the block stays plain
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      terrain.resize(rect.width, rect.height, dpr);
      terrain.render(finished);
    };
    canvas.addEventListener('webglcontextlost', () => {
      section.classList.remove('is-still');
      terrain.dispose();
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      terrain.setColors(readColors(canvas));
      terrain.render(finished);
    });
    // Shown first, so the canvas has a size; the observer's first callback draws it.
    section.classList.add('is-still');
    new ResizeObserver(draw).observe(canvas);
  };

  const start = (createTerrain: (canvas: HTMLCanvasElement, colors: TerrainColors) => Terrain) => {
    let terrain: Terrain;
    try {
      terrain = createTerrain(canvas, readColors(canvas));
    } catch {
      return; // no WebGL2: the block stays plain
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let drawn = 0;
    let raf = 0;
    let visible = true;
    let disposed = false;
    let lastDraw = 0;
    const frameTimes: number[] = [];

    const progress = () => Number(getComputedStyle(track).getPropertyValue('--trace-progress')) || 0;

    const fallback = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      section.classList.remove('is-live');
      terrain.dispose();
    };

    const draw = (value: number) => {
      drawn = value;
      terrain.render(value);
    };

    const resize = () => {
      if (disposed) return;
      const rect = stage.getBoundingClientRect();
      // The canvas mask stays clear down to here, so the terrain never runs behind the text.
      canvas.style.setProperty('--text-bottom', `${text.getBoundingClientRect().bottom - rect.top}px`);
      terrain.resize(rect.width, rect.height, dpr);
      draw(progress());
    };

    const schedule = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      raf = 0;
      if (disposed || !visible) return;
      schedule();
      const next = progress();
      if (Math.abs(next - drawn) < 0.0005) return;
      if (frameTimes.length < 20) {
        if (lastDraw && now - lastDraw < 100) frameTimes.push(now - lastDraw); // consecutive frames only
        if (frameTimes.length === 20) {
          const average = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          if (average > 40) return fallback();
          if (average > 22 && dpr > 1) {
            dpr = 1;
            resize();
          }
        }
      }
      lastDraw = now;
      draw(next);
    };

    canvas.addEventListener('webglcontextlost', fallback);
    const sizes = new ResizeObserver(resize);
    sizes.observe(stage);
    sizes.observe(text);
    new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      schedule();
    }).observe(section);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (disposed) return;
      terrain.setColors(readColors(canvas));
      draw(drawn);
    });

    // First frame before the canvas shows.
    resize();
    section.classList.add('is-live');
  };

  whenNear(section, () => {
    import('./terrain')
      .then(({ createTerrain, FINISHED }) => (pinned ? start(createTerrain) : still(createTerrain, FINISHED)))
      .catch(() => {});
  });
}
