// WebGL2 renderer for the embedding map (02 §8b, D14). No library: points and lines only.
import { attribute, createProgram, getContext } from '../gl/core';
import { CAMERA_DISTANCE, viewProjection, type Pose } from './layout';

export type Rgb = [number, number, number];

export interface MapProject {
  slug: string;
  title: string;
  domain: string;
  featured: boolean;
  href: string;
  xyz: [number, number, number];
}

export interface MapTool {
  name: string;
  /** Indexes into MapData.projects. */
  projects: number[];
  xyz: [number, number, number];
}

export interface MapData {
  projects: MapProject[];
  tools: MapTool[];
}

export interface MapColors {
  fields: Record<string, Rgb>;
  tool: Rgb;
  line: Rgb;
}

export type Highlight = { index: number } | { domain: string } | null;

const POINT_VS = `#version 300 es
in vec3 aPos;
in vec3 aColor;
in float aSize;
in float aShade;
in float aActive;
uniform mat4 uMatrix;
uniform float uScale;
uniform float uDim;
out vec3 vColor;
out float vAlpha;
out float vSize;
out float vShade;
void main() {
  vec4 clip = uMatrix * vec4(aPos, 1.0);
  gl_Position = clip;
  float far = clamp((clip.w - ${(CAMERA_DISTANCE - 1.2).toFixed(2)}) / 2.4, 0.0, 1.0);
  vAlpha = mix(1.0, 0.5, far) * mix(uDim, 1.0, aActive);
  vColor = aColor;
  vShade = aShade;
  vSize = max(aSize * uScale / clip.w, 2.0);
  gl_PointSize = vSize;
}`;

const POINT_FS = `#version 300 es
precision mediump float;
in vec3 vColor;
in float vAlpha;
in float vSize;
in float vShade;
out vec4 outColor;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;
  float edge = 1.0 - smoothstep(1.0 - 2.0 / vSize, 1.0, r);
  vec3 normal = vec3(p.x, -p.y, sqrt(max(1.0 - r * r, 0.0)));
  float lit = 0.74 + 0.36 * max(dot(normal, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
  vec3 color = vColor * mix(1.0, lit, vShade);
  outColor = vec4(color, 1.0) * (vAlpha * edge);
}`;

const LINE_VS = `#version 300 es
in vec3 aPos;
in float aActive;
uniform mat4 uMatrix;
uniform float uDim;
out float vAlpha;
void main() {
  vec4 clip = uMatrix * vec4(aPos, 1.0);
  gl_Position = clip;
  float far = clamp((clip.w - ${(CAMERA_DISTANCE - 1.2).toFixed(2)}) / 2.4, 0.0, 1.0);
  vAlpha = mix(1.0, 0.45, far) * mix(uDim, 1.0, aActive);
}`;

const LINE_FS = `#version 300 es
precision mediump float;
uniform vec3 uColor;
uniform float uAlpha;
in float vAlpha;
out vec4 outColor;
void main() {
  outColor = vec4(uColor, 1.0) * (uAlpha * vAlpha);
}`;

export function createRenderer(canvas: HTMLCanvasElement, data: MapData, initialColors: MapColors) {
  const gl = getContext(canvas);
  const nProjects = data.projects.length;
  const nPoints = nProjects + data.tools.length;

  // Point attributes: projects first, then tools.
  const positions = new Float32Array(nPoints * 3);
  const sizes = new Float32Array(nPoints);
  const shades = new Float32Array(nPoints);
  data.projects.forEach((p, i) => {
    positions.set(p.xyz, i * 3);
    sizes[i] = p.featured ? 20 : 13;
    shades[i] = 1;
  });
  data.tools.forEach((t, j) => {
    const i = nProjects + j;
    positions.set(t.xyz, i * 3);
    sizes[i] = t.projects.length > 1 ? 6.5 : 5;
  });

  // One line per project-tool pair, owned by that project.
  const owners: number[] = [];
  const linePositions: number[] = [];
  data.tools.forEach((t) => {
    for (const owner of t.projects) {
      owners.push(owner);
      linePositions.push(...data.projects[owner].xyz, ...t.xyz);
    }
  });
  const nLineVertices = owners.length * 2;

  const pointProgram = createProgram(gl, POINT_VS, POINT_FS);
  const pointVao = gl.createVertexArray();
  gl.bindVertexArray(pointVao);
  attribute(gl, pointProgram, 'aPos', positions, 3);
  const colorBuffer = attribute(gl, pointProgram, 'aColor', new Float32Array(nPoints * 3), 3, gl.DYNAMIC_DRAW);
  attribute(gl, pointProgram, 'aSize', sizes, 1);
  attribute(gl, pointProgram, 'aShade', shades, 1);
  const pointActive = attribute(gl, pointProgram, 'aActive', new Float32Array(nPoints).fill(1), 1, gl.DYNAMIC_DRAW);
  const order = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, order);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, nPoints * 2, gl.DYNAMIC_DRAW);

  const lineProgram = createProgram(gl, LINE_VS, LINE_FS);
  const lineVao = gl.createVertexArray();
  gl.bindVertexArray(lineVao);
  attribute(gl, lineProgram, 'aPos', new Float32Array(linePositions), 3);
  const lineActive = attribute(gl, lineProgram, 'aActive', new Float32Array(nLineVertices).fill(1), 1, gl.DYNAMIC_DRAW);
  gl.bindVertexArray(null);

  const u = {
    pMatrix: gl.getUniformLocation(pointProgram, 'uMatrix'),
    pScale: gl.getUniformLocation(pointProgram, 'uScale'),
    pDim: gl.getUniformLocation(pointProgram, 'uDim'),
    lMatrix: gl.getUniformLocation(lineProgram, 'uMatrix'),
    lDim: gl.getUniformLocation(lineProgram, 'uDim'),
    lColor: gl.getUniformLocation(lineProgram, 'uColor'),
    lAlpha: gl.getUniformLocation(lineProgram, 'uAlpha'),
  };

  let pose: Pose = { yaw: 0, pitch: 0 };
  let width = 1;
  let height = 1;
  let dpr = 1;
  let colors = initialColors;
  let dimmed = false;

  function uploadColors() {
    const out = new Float32Array(nPoints * 3);
    data.projects.forEach((p, i) => out.set(colors.fields[p.domain] ?? colors.tool, i * 3));
    for (let i = nProjects; i < nPoints; i++) out.set(colors.tool, i * 3);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, out);
  }

  function setHighlight(highlight: Highlight) {
    const activeProject = data.projects.map((p, i) =>
      !highlight ? true : 'index' in highlight ? i === highlight.index : p.domain === highlight.domain,
    );
    dimmed = highlight !== null;
    const points = new Float32Array(nPoints);
    activeProject.forEach((on, i) => (points[i] = on ? 1 : 0));
    data.tools.forEach((t, j) => (points[nProjects + j] = t.projects.some((o) => activeProject[o]) ? 1 : 0));
    const lines = new Float32Array(nLineVertices);
    owners.forEach((o, k) => lines.fill(activeProject[o] ? 1 : 0, k * 2, k * 2 + 2));
    gl.bindBuffer(gl.ARRAY_BUFFER, pointActive);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, points);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineActive);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, lines);
  }

  uploadColors();
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return {
    setPose(next: Pose) {
      pose = next;
    },
    setHighlight,
    setColors(next: MapColors) {
      colors = next;
      uploadColors();
    },
    resize(cssWidth: number, cssHeight: number, pixelRatio: number) {
      width = Math.max(1, cssWidth);
      height = Math.max(1, cssHeight);
      dpr = pixelRatio;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render() {
      const matrix = viewProjection(pose, width / height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(lineProgram);
      gl.bindVertexArray(lineVao);
      gl.uniformMatrix4fv(u.lMatrix, false, matrix);
      gl.uniform1f(u.lDim, dimmed ? 0.15 : 1);
      gl.uniform3fv(u.lColor, colors.line);
      gl.uniform1f(u.lAlpha, 0.42);
      gl.drawArrays(gl.LINES, 0, nLineVertices);

      // Back-to-front so overlapping translucent points blend correctly.
      const depth = new Float32Array(nPoints);
      for (let i = 0; i < nPoints; i++) {
        depth[i] = matrix[3] * positions[i * 3] + matrix[7] * positions[i * 3 + 1] + matrix[11] * positions[i * 3 + 2] + matrix[15];
      }
      const indices = Uint16Array.from({ length: nPoints }, (_, i) => i).sort((a, b) => depth[b] - depth[a]);

      gl.useProgram(pointProgram);
      gl.bindVertexArray(pointVao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, order);
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);
      gl.uniformMatrix4fv(u.pMatrix, false, matrix);
      gl.uniform1f(u.pScale, CAMERA_DISTANCE * dpr * (Math.min(width, height) / 480));
      gl.uniform1f(u.pDim, dimmed ? 0.22 : 1);
      gl.drawElements(gl.POINTS, nPoints, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    },
    dispose() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

export type Renderer = ReturnType<typeof createRenderer>;
