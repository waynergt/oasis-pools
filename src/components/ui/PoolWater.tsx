import { Component, useEffect, useRef, type ReactNode } from 'react'

/**
 * Animated pool water drawn with WebGL: moving light caustics over a tiled pool floor,
 * with a gentle surface wobble. No video file needed (~0 KB of assets).
 *
 * - Pauses when off-screen or when the tab is hidden (saves battery).
 * - Respects "reduce motion": draws a single still frame.
 * - Calls `onFail` if WebGL isn't available so the parent can show a photo instead.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;   // 0..1, eased in JS

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

// Distance to the nearest edge of an animated cell grid -> thin bright lines (caustics)
float cellEdge(vec2 p, float t) {
  vec2 g = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y));
      vec2 h = hash2(g + o);
      vec2 r = o + 0.5 + 0.42 * sin(t + 6.2831 * h) - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; }
      else if (d < d2) { d2 = d; }
    }
  }
  return sqrt(d2) - sqrt(d1);
}

void main() {
  vec2 s = gl_FragCoord.xy / u_res;            // 0..1 screen
  vec2 uv = gl_FragCoord.xy / u_res.y;         // aspect-correct
  float t = u_time;

  // Surface wobble bends the light lines so they look organic, not geometric
  vec2 q = uv * 6.0;
  vec2 warp = vec2(
    sin(q.y * 0.8 + t * 0.6) + sin(q.y * 1.7 - t * 0.4 + q.x * 0.5),
    cos(q.x * 0.7 - t * 0.5) + cos(q.x * 1.9 + t * 0.3 - q.y * 0.6)
  ) * 0.24;

  // Soft ripple following the pointer (desktop)
  vec2 pp = vec2(u_pointer.x * u_res.x / u_res.y, u_pointer.y);
  float dist = length(uv - pp);
  warp += normalize(uv - pp + 1e-4) * sin(dist * 30.0 - t * 4.0) * 0.09 * smoothstep(0.45, 0.0, dist);

  // Two layers of caustics; where they cross the light focuses (brighter knots)
  float e1 = cellEdge(q + warp, t * 0.8);
  float e2 = cellEdge(q * 1.55 + warp * 1.6 + vec2(3.7, 1.3), t * 1.1 + 2.0);
  float l1 = 1.0 - smoothstep(0.0, 0.085, e1);
  float l2 = 1.0 - smoothstep(0.0, 0.065, e2);
  l1 *= l1;
  l2 *= l2;
  float glow = 1.0 - smoothstep(0.0, 0.32, e1);
  float c = 0.5 * l1 + 0.35 * l2 + 1.0 * l1 * l2 + 0.12 * glow;

  // Pool floor tiles (seen through the moving water)
  vec2 tp = (uv + warp * 0.035) * 8.0;
  vec2 tg = abs(fract(tp) - 0.5);
  float grout = smoothstep(0.47, 0.5, max(tg.x, tg.y));

  // Water colors: deep blue -> bright turquoise
  vec3 deep    = vec3(0.02, 0.22, 0.48);
  vec3 mid     = vec3(0.05, 0.53, 0.82);
  vec3 shallow = vec3(0.30, 0.84, 0.95);
  vec3 col = mix(deep, mid, smoothstep(-0.1, 0.7, s.y));
  col = mix(col, shallow, smoothstep(0.4, 1.2, s.x * 0.75 + s.y * 0.55));

  col *= 1.0 - grout * 0.14;
  col += c * vec3(0.82, 0.97, 1.0) * (0.42 + 0.2 * s.y);

  // Vignette
  col *= 0.74 + 0.26 * smoothstep(1.35, 0.25, length(s - vec2(0.62, 0.55)));

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[PoolWater] shader error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

/** If anything in the water effect throws, show `fallback` instead of breaking the page. */
export class WaterBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function PoolWater({ className = '', onFail }: { className?: string; onFail?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const failRef = useRef(onFail)
  failRef.current = onFail

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })
    if (!gl) {
      failRef.current?.()
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) {
      failRef.current?.()
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      failRef.current?.()
      return
    }
    gl.useProgram(prog)

    // One big triangle that covers the screen
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uPointer = gl.getUniformLocation(prog, 'u_pointer')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const start = performance.now() - 12_000 // start mid-animation so it never looks "empty"
    let lastT = 12
    let raf = 0
    let running = false
    let visible = true

    // Pointer ripple (eased so it glides)
    const target = { x: 0.78, y: 0.55 }
    const pointer = { ...target }
    const draw = (t: number) => {
      pointer.x += (target.x - pointer.x) * 0.04
      pointer.y += (target.y - pointer.y) * 0.04
      gl.uniform1f(uTime, t)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    // Render below device resolution: water is soft, so this looks the same and is much cheaper.
    const scale = Math.min(1, Math.max(0.6, (window.devicePixelRatio || 1) * 0.55))
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale))
      const h = Math.max(1, Math.round(canvas.clientHeight * scale))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, w, h)
    }
    const ro = new ResizeObserver(() => {
      resize()
      if (!running) draw(lastT)
    })
    ro.observe(canvas)
    resize()

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', onMove, { passive: true })


    const loop = (now: number) => {
      lastT = (now - start) / 1000
      draw(lastT)
      raf = requestAnimationFrame(loop)
    }
    const update = () => {
      const shouldRun = visible && !document.hidden && !reduceMotion.matches
      if (shouldRun && !running) {
        running = true
        raf = requestAnimationFrame(loop)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(raf)
      }
      if (!running) draw(lastT)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', update)
    reduceMotion.addEventListener('change', update)
    update()

    const onLost = (e: Event) => {
      e.preventDefault()
      failRef.current?.()
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', update)
      reduceMotion.removeEventListener('change', update)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
