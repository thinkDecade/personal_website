// components/WebGLCanvas.jsx
// Full-screen WebGL background — rotating wireframe geometric shapes.
// Fixed behind all content via -z-10. Degrades gracefully if WebGL unavailable.
// Responds to data-theme attribute via MutationObserver + u_dark uniform.
'use client'

import { useEffect, useRef } from 'react'

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
  precision mediump float;

  uniform float u_t;
  uniform vec2  u_res;
  uniform float u_dark; /* 1.0 = dark theme, 0.0 = light theme */

  #define PI  3.14159265359
  #define TAU 6.28318530718

  /* Rotate a 2D point by angle a */
  vec2 rot(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  /* Signed distance to the outline of a regular n-gon centred at origin.
     r controls size (approximate circumradius).
     Returns < 0 inside, > 0 outside, = 0 on edge.         */
  float sdNgon(vec2 p, float r, float n) {
    float a   = atan(p.y, p.x);
    float seg = TAU / n;
    float phi = mod(a + seg * 0.5, seg) - seg * 0.5;
    return length(p) * cos(phi) - r;
  }

  /* Anti-aliased wireframe stroke: bright where |sdf| < fw */
  float stroke(float d, float fw) {
    return 1.0 - smoothstep(fw * 0.5, fw * 2.0, abs(d));
  }

  void main() {
    /* Aspect-corrected centred coordinates: range ≈ [-1, 1] on short axis */
    vec2 uv = (2.0 * gl_FragCoord.xy - u_res) / min(u_res.x, u_res.y);

    /* Anti-aliasing width in the same coordinate space */
    float fw = 3.0 / min(u_res.x, u_res.y);

    /* Theme palette */
    vec3 bgCol   = mix(vec3(0.980),                    vec3(0.039),              u_dark);
    vec3 lineCol = mix(vec3(0.10),                     vec3(0.961, 0.961, 0.0), u_dark);
    vec3 dimCol  = mix(vec3(0.60),                     vec3(0.30, 0.30, 0.00),  u_dark);

    float mask = 0.0;

    /* ── Layer 1 — outer static circle ── */
    mask += stroke(length(uv) - 0.88, fw) * 0.80;

    /* ── Layer 2 — hexagon, slow clockwise ── */
    mask += stroke(sdNgon(rot(uv,  u_t * 0.09), 0.76, 6.0), fw) * 0.90;

    /* ── Layer 3 — pentagon, medium counter-clockwise ── */
    mask += stroke(sdNgon(rot(uv, -u_t * 0.15), 0.61, 5.0), fw) * 0.75;

    /* ── Layer 4 — square, medium clockwise ── */
    mask += stroke(sdNgon(rot(uv,  u_t * 0.22), 0.44, 4.0), fw) * 0.90;

    /* ── Layer 5 — triangle, faster counter-clockwise ── */
    mask += stroke(sdNgon(rot(uv, -u_t * 0.30), 0.28, 3.0), fw) * 0.80;

    /* ── Layer 6 — inner hexagon, fast clockwise ── */
    mask += stroke(sdNgon(rot(uv,  u_t * 0.38), 0.15, 6.0), fw) * 0.90;

    /* ── Layer 7 — centre circle ── */
    mask += stroke(length(uv) - 0.04, fw) * 0.70;

    mask = clamp(mask, 0.0, 1.0);

    /* Blend lines into background */
    vec3 col = mix(bgCol, lineCol, mask * 0.55);

    /* Subtle radial vignette — only active in dark mode */
    float vig = 1.0 - dot(uv * 0.35, uv * 0.35) * u_dark;
    col *= clamp(vig, 0.55, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function WebGLCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
    if (!gl) return

    // ── Compile shader ─────────────────────────────────────
    function mkShader(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    // ── Build program ──────────────────────────────────────
    const prog = gl.createProgram()
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // ── Full-screen quad (2 triangles) ─────────────────────
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1,  1,-1, 1,1, -1,1]),
      gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uT    = gl.getUniformLocation(prog, 'u_t')
    const uRes  = gl.getUniformLocation(prog, 'u_res')
    const uDark = gl.getUniformLocation(prog, 'u_dark')

    // ── Theme helper ───────────────────────────────────────
    function darkValue() {
      return document.documentElement.getAttribute('data-theme') !== 'light' ? 1.0 : 0.0
    }
    gl.uniform1f(uDark, darkValue())

    // ── Resize handler ─────────────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // ── Watch data-theme changes (theme toggle) ────────────
    const mo = new MutationObserver(() => {
      gl.uniform1f(uDark, darkValue())
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // ── Render loop ────────────────────────────────────────
    let raf
    const t0 = performance.now()

    function frame() {
      gl.uniform1f(uT, (performance.now() - t0) * 0.001)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
  )
}
