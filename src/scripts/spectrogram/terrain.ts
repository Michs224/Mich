// Spectrogram terrain behind the Trace stage (02 §8c): one ridge per frequency band of the rep's
// sentence, lowest band at the back. Ridges are filled with the block color and drawn back to front,
// so each one hides the bands behind it. The ridge line is shaded inside that fill from its distance
// in pixels, so it keeps one width on every slope. Only the Trace progress moves it.
import { attribute, createProgram, getContext } from '../gl/core';
import { cols, rows, scale, values } from '../../data/trace-spectrogram.json';

export type Rgb = [number, number, number];

export interface TerrainColors {
  /** The block color: each ridge is filled with it to hide the bands behind. */
  fill: Rgb;
  line: Rgb;
  playhead: Rgb;
}

const GAMMA = 1.5; // flattens the quieter bands so the strongest ones stand out
// The sentence spans time 0..1. Silence before and after it (flat lines out to PAD) runs past both
// edges of the stage, and RAMP is the short slope from the first and last samples down to silence.
const PAD = 1.5;
const RAMP = 0.03;
const SKIRT = 0.05; // fill under each baseline, as a share of the peak height, so silence still draws a line
const LINE_PX = 1.25; // CSS pixels
const TURN = 0.06; // radians the terrain turns either way over the whole Trace
/** Progress for the still picture: past the last silence, so the whole line reads as played and
    the playhead is off the edge. The turn stays where the Trace ends. */
export const FINISHED = 1 + PAD + 0.1;

const VERTEX = `#version 300 es
// x: time (the sentence is 0..1), y: band 0 (back) .. 1 (front), z: height of this vertex, w: height of the ridge here
in vec4 aPoint;
uniform float uTurn;
uniform float uAspect;
out float vTime;
out float vFront;
out float vGap;
const float WIDTH = 3.1; // the sentence spans about the stage width at the middle row
const float DEPTH = 2.4;
const float HEIGHT = 0.28;
const float PITCH = 0.3;
const float DISTANCE = 5.0;
const float FOCAL = 5.0;
const float SHIFT = -0.65; // lens shift: the terrain fills the bottom of the stage, below the text
void main() {
  vec3 p = vec3((aPoint.x - 0.5) * WIDTH, aPoint.z * HEIGHT, (aPoint.y - 0.5) * DEPTH);
  float c = cos(uTurn), s = sin(uTurn);
  p = vec3(c * p.x + s * p.z, p.y, c * p.z - s * p.x);
  float cp = cos(PITCH), sp = sin(PITCH);
  p = vec3(p.x, cp * p.y - sp * p.z, sp * p.y + cp * p.z);
  float w = DISTANCE - p.z;
  gl_Position = vec4(p.x * FOCAL / uAspect, p.y * FOCAL + SHIFT * w, 0.0, w);
  vTime = aPoint.x;
  vFront = aPoint.y;
  vGap = (aPoint.w - aPoint.z) * HEIGHT;
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in float vTime;
in float vFront;
in float vGap;
uniform float uProgress;
uniform float uLinePx;
uniform vec3 uFill;
uniform vec3 uLine;
uniform vec3 uPlayhead;
out vec4 outColor;
void main() {
  // vGap is linear across the fill, so this is the distance to the ridge in device pixels.
  float px = vGap / max(length(vec2(dFdx(vGap), dFdy(vGap))), 1e-5);
  float stroke = 1.0 - smoothstep(uLinePx - 0.5, uLinePx + 0.5, px);
  float played = step(0.0, vTime) * (1.0 - smoothstep(-0.004, 0.004, vTime - uProgress));
  float head = 1.0 - smoothstep(0.0, 0.016, abs(vTime - uProgress));
  float strength = mix(0.2, 0.55, played) * mix(0.35, 1.0, vFront);
  strength = max(strength, head * mix(0.5, 1.0, vFront));
  outColor = vec4(mix(uFill, mix(uLine, uPlayhead, head), stroke * strength), 1.0);
}`;

export function createTerrain(canvas: HTMLCanvasElement, initialColors: TerrainColors) {
  if (values.length !== rows * cols) throw new Error('trace-spectrogram.json: values do not match rows x cols');
  const gl = getContext(canvas);

  const times = [-PAD, -RAMP, ...Array.from({ length: cols }, (_, c) => c / (cols - 1)), 1 + RAMP, 1 + PAD];
  const span = times.length;

  // Two vertices per sample: one on the ridge, one under the baseline.
  const points = new Float32Array(rows * span * 8);
  for (let r = 0; r < rows; r++) {
    const front = r / (rows - 1);
    times.forEach((time, i) => {
      const c = i - 2;
      const level = c >= 0 && c < cols ? (values[r * cols + c] / scale) ** GAMMA : 0;
      points.set([time, front, level, level, time, front, -SKIRT, level], (r * span + i) * 8);
    });
  }
  // Back to front, so nearer ridges paint over farther ones.
  const indices = new Uint16Array(rows * (span - 1) * 6);
  for (let r = 0, n = 0; r < rows; r++) {
    for (let i = 0; i < span - 1; i++, n += 6) {
      const top = (r * span + i) * 2;
      indices.set([top, top + 1, top + 2, top + 1, top + 3, top + 2], n);
    }
  }

  const program = createProgram(gl, VERTEX, FRAGMENT);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  attribute(gl, program, 'aPoint', points, 4);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  const u = {
    turn: gl.getUniformLocation(program, 'uTurn'),
    aspect: gl.getUniformLocation(program, 'uAspect'),
    progress: gl.getUniformLocation(program, 'uProgress'),
    linePx: gl.getUniformLocation(program, 'uLinePx'),
    fill: gl.getUniformLocation(program, 'uFill'),
    line: gl.getUniformLocation(program, 'uLine'),
    playhead: gl.getUniformLocation(program, 'uPlayhead'),
  };
  let colors = initialColors;
  let aspect = 1;
  let dpr = 1;

  return {
    setColors(next: TerrainColors) {
      colors = next;
    },
    resize(cssWidth: number, cssHeight: number, pixelRatio: number) {
      const width = Math.max(1, cssWidth);
      const height = Math.max(1, cssHeight);
      aspect = width / height;
      dpr = pixelRatio;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render(progress: number) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(u.turn, (Math.min(progress, 1) * 2 - 1) * TURN);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform1f(u.progress, progress);
      gl.uniform1f(u.linePx, LINE_PX * dpr);
      gl.uniform3fv(u.fill, colors.fill);
      gl.uniform3fv(u.line, colors.line);
      gl.uniform3fv(u.playhead, colors.playhead);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    },
    dispose() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

export type Terrain = ReturnType<typeof createTerrain>;
