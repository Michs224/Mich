// Minimal WebGL2 helpers shared by the embedding map and the Trace spectrogram (02 §8b, §8c).

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/** Compiles and links; checks status only after linking, which avoids extra GPU stalls. */
export function createProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
  const program = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || gl.getShaderInfoLog(vs) || gl.getShaderInfoLog(fs) || 'link failed');
  }
  return program;
}

/** Creates a buffer, fills it, and points the named attribute at it (inside the bound VAO). */
export function attribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  data: Float32Array,
  size: number,
  usage: number = gl.STATIC_DRAW,
): WebGLBuffer {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  const location = gl.getAttribLocation(program, name);
  if (location >= 0) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }
  return buffer;
}

export function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) throw new Error('WebGL2 is not available');
  return gl;
}

/**
 * The 3D layers load only at desktop width and without Save-Data (02 §8b). Each layer decides what
 * reduced motion means for it: the map stands still until dragged, the Trace terrain stays off.
 */
export function allows3d(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia('(min-width: 1024px)').matches && !connection?.saveData;
}

/**
 * After the page has loaded and the browser is idle, calls load() once, when target comes within
 * 200px of the viewport. Pass a visible element: hidden ones never intersect.
 */
export function whenNear(target: Element, load: () => void): void {
  const watch = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
  };
  const idle = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(watch, { timeout: 2000 });
    else setTimeout(watch, 200); // Safari has no requestIdleCallback
  };
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

/** Reads CSS colors (including light-dark() tokens) as linear 0..1 RGB through a probe element. */
export function readColor(probe: HTMLElement, cssColor: string): [number, number, number] {
  probe.style.color = cssColor;
  const match = getComputedStyle(probe).color.match(/[\d.]+/g);
  if (!match || match.length < 3) return [0.5, 0.5, 0.5];
  return [Number(match[0]) / 255, Number(match[1]) / 255, Number(match[2]) / 255];
}
