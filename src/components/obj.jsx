import { useEffect, useMemo, useRef, useState } from 'react'
import { LAYER_META } from '../data'
import { useLiteObject } from '../hooks'

/* ===========================================================================
   OBJECTS

   Every object on this site is built from axis-aligned boxes, flat-filled and
   outlined in ink. A rig is a pure function of time that returns the boxes for
   one frame, so the same rig drives both renderers: WebGL where there is a
   pointer and motion is welcome, and an SVG twin everywhere else, which keeps
   moving through CSS rather than going still.

   Each project owns a rig that shows what it does, so no two objects on the
   site are the same shape doing the same thing.

   Hard budget: one program, one buffer, two draw calls, DPR capped at 2, and
   the loop stops dead when the canvas leaves the viewport or the tab hides.
   =========================================================================== */

const INK = [0x17 / 255, 0x19 / 255, 0x1f / 255]
const P = { coral: '#ff674d', lime: '#e9fe6a', paper: '#fffdf8', sand: '#f7dbca', peri: '#dfe1ff', ink: '#17191f', blue: '#4d59ed' }

const TONE = { top: 1, side: 0.8, front: 0.63 }

const box = (key, x, y, z, w, h, d, color, opts = {}) => ({ key, x, y, z, w, h, d, color, ...opts })

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2)

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function shade(hex, t) {
  const [r, g, b] = hexToRgb(hex)
  return [r * t, g * t, b * t]
}

function toHex(rgb) {
  return '#' + rgb.map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0')).join('')
}

/* A slab must never be the colour of the field it sits on. */
function tooClose(a, b) {
  const [x, y] = [hexToRgb(a), hexToRgb(b)]
  const dr = x[0] - y[0]
  const dg = x[1] - y[1]
  const db = x[2] - y[2]
  return Math.sqrt(dr * dr * 2 + dg * dg * 4 + db * db * 3) < 0.25
}

function resolve(color, field) {
  if (!field || !tooClose(color, field)) return color
  return tooClose(field, P.ink) ? P.paper : P.ink
}

/* ===========================================================================
   RIGS
   =========================================================================== */

const GAP = 0.3

function layerY(i) {
  let y = 0
  for (let k = LAYER_META.length - 1; k > i; k -= 1) y += LAYER_META[k].h + GAP
  return y + LAYER_META[i].h / 2
}

const STACK_MID = (() => {
  const top = layerY(0) + LAYER_META[0].h / 2
  const bottom = layerY(5) - LAYER_META[5].h / 2
  return (top + bottom) / 2
})()

/* --- THE STACK -------------------------------------------------------------
   Six layers as one solid. It breathes: each slab drifts on its own phase, so
   the object is never still even when nobody touches it. ------------------- */
function rigStack(t, s = {}) {
  const { active = -1, exploded = false, only = null } = s
  return LAYER_META.map((layer, i) => {
    const solid = !only || only.includes(i)
    const breathe = Math.sin(t * 0.55 + i * 0.85) * 0.055
    let x = 0
    if (exploded) x = (i % 2 === 0 ? 1 : -1) * (0.42 + i * 0.13)
    else if (active === i) x = 0.72
    return box(layer.key, x, layerY(i) - STACK_MID + breathe, 0, layer.w, layer.h, layer.d, layer.color, {
      ghost: !solid,
      lit: active === i,
      anim: 'bob',
      phase: i,
    })
  })
}

/* --- DEAL (Applyer) --------------------------------------------------------
   A deck of roles. One card lifts off the pile, arcs across and lands on the
   applied pile; a matched one goes lime. It never stops dealing. ----------- */
const DEAL_N = 5
function rigDeal(t) {
  const out = []
  const period = 1.75
  const p = (t % period) / period
  const flight = clamp01((p - 0.04) / 0.82)
  const e = easeInOut(flight)
  const landed = Math.floor(t / period) % (DEAL_N + 1)

  // Source pile, minus the cards already dealt.
  for (let i = 0; i < DEAL_N; i += 1) {
    const gone = i >= DEAL_N - landed
    out.push(
      box(`src${i}`, -1.3, -0.55 + i * 0.17 + (gone ? -0.001 : 0), 0, 1.5, 0.12, 1.1, i === DEAL_N - 1 - landed ? P.paper : P.sand, {
        ghost: gone,
        anim: 'still',
      }),
    )
  }

  // The card in flight: across in x, an arc in y.
  const matched = landed % 3 === 1
  out.push(
    box('fly', -1.3 + e * 2.6, -0.55 + landed * 0.17 + Math.sin(flight * Math.PI) * 1.75, 0, 1.5, 0.14, 1.1, matched ? P.lime : P.coral, {
      anim: 'fly',
    }),
  )

  // Applied pile.
  for (let i = 0; i < landed; i += 1) {
    out.push(box(`dst${i}`, 1.3, -0.55 + i * 0.17, 0, 1.5, 0.12, 1.1, i % 3 === 1 ? P.lime : P.paper, { anim: 'still' }))
  }
  return out
}

/* --- QUEUE (Spisnem) -------------------------------------------------------
   A line of parties shuffling toward the door. The front one is called in and
   drops away; the rest step forward and a new one joins the back. ---------- */
const QUEUE_N = 5
const QUEUE_COLS = [P.coral, P.paper, P.peri]
function rigQueue(t) {
  const out = []
  const step = 1.05
  const period = 1.9
  const cycle = Math.floor(t / period)
  const p = (t % period) / period
  const shift = easeInOut(p)

  // The door the queue advances toward.
  out.push(box('door', -2.75, 0.22, 0, 0.26, 1.5, 1.35, P.lime, { anim: 'pulse' }))

  // One extra at each end: one always leaving, one always joining. Colour and
  // height follow the position in the loop, not the index, so when the loop
  // wraps every party is already wearing the next one's colour and the step
  // reads as continuous rather than snapping back.
  for (let i = -1; i <= QUEUE_N; i += 1) {
    const slot = i - shift
    const x = -1.6 + slot * step
    const leaving = slot < -0.55
    const k = (((i + cycle) % 3) + 3) % 3
    out.push(
      box(`q${i}`, x, leaving ? -0.3 - (Math.abs(slot) - 0.55) * 1.6 : -0.3, 0, 0.78, 0.5 + k * 0.12, 0.78, QUEUE_COLS[k], {
        anim: 'advance',
        phase: i + 1,
      }),
    )
  }
  return out
}

/* --- STRIP (MinWin) --------------------------------------------------------
   A machine being made lighter. Each layer is trimmed to its core and the
   offcuts drift away; then it builds back and it happens again. ----------- */
const STRIP_N = 6
function rigStrip(t) {
  const out = []
  const period = 4.2
  const p = (t % period) / period

  for (let i = 0; i < STRIP_N; i += 1) {
    // A triangle wave per layer, offset up the stack: every frame shows some
    // layers being trimmed and others growing back.
    const ph = (p + i * 0.16) % 1
    const cut = ph < 0.5 ? easeInOut(ph * 2) : easeInOut((1 - ph) * 2)

    const full = 2.35
    const core = 0.85
    const w = full - (full - core) * cut
    const y = -0.85 + i * 0.3

    out.push(box(`core${i}`, 0, y, 0, w, 0.22, 1.5, i === STRIP_N - 1 ? P.lime : i % 2 ? P.paper : P.peri, { anim: 'trim', phase: i }))

    // The offcuts, travelling out and down as the layer loses them.
    const off = (full - w) / 2
    if (off > 0.04 && ph < 0.5) {
      for (const dir of [-1, 1]) {
        out.push(
          box(`off${i}${dir}`, dir * (core / 2 + off / 2 + cut * 2.1), y - cut * cut * 2.4, 0, Math.max(0.05, off), 0.22, 1.5, P.coral, {
            anim: 'offcut',
            phase: i,
          }),
        )
      }
    }
  }
  return out
}

const RIGS = { stack: rigStack, deal: rigDeal, queue: rigQueue, strip: rigStrip }

/* Each rig is framed by its own extents, so none of them sits in another's box. */
const RIG_STILL_T = { stack: 0.0001, deal: 0.95, queue: 0.5, strip: 1.6 }

/* The rig's greatest extent over one loop, so the camera never has to move. */
function rigExtent(rig, state) {
  let ex = 0
  let ey = 0
  let ez = 0
  for (let k = 0; k < 72; k += 1) {
    for (const b of rig(k * 0.11, state)) {
      if (b.ghost) continue
      ex = Math.max(ex, Math.abs(b.x) + b.w / 2)
      ey = Math.max(ey, Math.abs(b.y) + b.h / 2)
      ez = Math.max(ez, Math.abs(b.z) + b.d / 2)
    }
  }
  return { ex, ey, ez }
}

/* ===========================================================================
   SHARED GEOMETRY
   =========================================================================== */

const FACES = [
  { n: [0, 1, 0], tone: TONE.top, c: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
  { n: [0, -1, 0], tone: TONE.front, c: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
  { n: [1, 0, 0], tone: TONE.side, c: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]] },
  { n: [-1, 0, 0], tone: TONE.side, c: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
  { n: [0, 0, 1], tone: TONE.front, c: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
  { n: [0, 0, -1], tone: TONE.front, c: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]] },
]

const VERTS_PER_BOX = 36
const STRIDE = 9
const MAX_BOXES = 48

/* ===========================================================================
   WEBGL
   =========================================================================== */

const VERT_SRC = `
attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 uMVP;
uniform float uHull;
varying vec3 vColor;
void main() {
  gl_Position = uMVP * vec4(aPos + aNormal * uHull, 1.0);
  vColor = aColor;
}`

const FRAG_SRC = `
precision mediump float;
varying vec3 vColor;
uniform float uIsHull;
uniform vec3 uInk;
void main() {
  gl_FragColor = vec4(mix(vColor, uInk, uIsHull), 1.0);
}`

function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  // prettier-ignore
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0])
}

function multiply(a, b) {
  const out = new Float32Array(16)
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
    }
  }
  return out
}

function viewMatrix(rotX, rotY, dist) {
  const cx = Math.cos(rotX)
  const sx = Math.sin(rotX)
  const cy = Math.cos(rotY)
  const sy = Math.sin(rotY)
  // prettier-ignore
  return new Float32Array([cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -dist, 1])
}

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function ObjGL({ rig, rigName, field, state, onFail, onPick, spin }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let gl
    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: true, depth: true })
    } catch {
      gl = null
    }
    if (!gl) {
      onFail()
      return undefined
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vs || !fs) {
      onFail()
      return undefined
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onFail()
      return undefined
    }
    gl.useProgram(prog)

    const loc = {
      pos: gl.getAttribLocation(prog, 'aPos'),
      normal: gl.getAttribLocation(prog, 'aNormal'),
      color: gl.getAttribLocation(prog, 'aColor'),
      mvp: gl.getUniformLocation(prog, 'uMVP'),
      hull: gl.getUniformLocation(prog, 'uHull'),
      isHull: gl.getUniformLocation(prog, 'uIsHull'),
      ink: gl.getUniformLocation(prog, 'uInk'),
    }

    const data = new Float32Array(MAX_BOXES * VERTS_PER_BOX * STRIDE)
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW)

    const bytes = STRIDE * 4
    ;[
      [loc.pos, 0],
      [loc.normal, 12],
      [loc.color, 24],
    ].forEach(([l, off]) => {
      gl.enableVertexAttribArray(l)
      gl.vertexAttribPointer(l, 3, gl.FLOAT, false, bytes, off)
    })

    gl.enable(gl.CULL_FACE)
    gl.uniform3fv(loc.ink, INK)

    const build = (boxes) => {
      let p = 0
      let n = 0
      for (const b of boxes) {
        if (b.ghost || n >= MAX_BOXES) continue
        const hx = b.w / 2
        const hy = b.h / 2
        const hz = b.d / 2
        const base = resolve(b.color, field)
        for (const face of FACES) {
          const col = shade(base, b.lit ? 1 : face.tone)
          const quad = face.c.map(([sx, sy, sz]) => [sx * hx + b.x, sy * hy + b.y, sz * hz + b.z])
          for (const v of [quad[0], quad[1], quad[2], quad[0], quad[2], quad[3]]) {
            data[p] = v[0]
            data[p + 1] = v[1]
            data[p + 2] = v[2]
            data[p + 3] = face.n[0]
            data[p + 4] = face.n[1]
            data[p + 5] = face.n[2]
            data[p + 6] = col[0]
            data[p + 7] = col[1]
            data[p + 8] = col[2]
            p += STRIDE
          }
        }
        n += 1
      }
      return n * VERTS_PER_BOX
    }

    let rotY = -0.62
    let rotX = 0.5
    let velY = 0
    let velX = 0
    let px = 0
    let py = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let moved = 0
    let raf = 0
    let visible = true
    let dpr = 1
    let w = 0
    let h = 0
    let t0 = performance.now()
    const ext = rigExtent(rig, stateRef.current)
    const halfW = (ext.ex + ext.ez) * 0.95
    const halfH = ext.ey + (ext.ex + ext.ez) * 0.55

    function resize() {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nw = Math.round(rect.width * dpr)
      const nh = Math.round(rect.height * dpr)
      if (nw === w && nh === h) return
      w = nw
      h = nh
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }

    function frame(now) {
      resize()
      const t = (now - t0) / 1000
      const count = build(rig(t, stateRef.current))

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)

      if (!dragging) {
        rotY += (spin ? 0.0024 : 0.0011) + velY
        rotX += velX
        velY *= 0.93
        velX *= 0.93
        rotX += (0.5 + py * 0.18 - rotX) * 0.045
        rotY += px * 0.22 * 0.012
      }
      rotX = Math.max(0.12, Math.min(1.1, rotX))

      const aspect = w / h || 1
      const fov = (14 * Math.PI) / 180
      // Fit whichever axis runs out first, then leave a small margin.
      const frameH = Math.max(halfH * 2, (halfW * 2) / aspect) * 1.1
      const dist = frameH / (2 * Math.tan(fov / 2))
      const proj = perspective(fov, aspect, 0.1, 200)
      const mvp = multiply(proj, viewMatrix(rotX, rotY, dist))
      const perPx = frameH / (h / dpr)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.uniformMatrix4fv(loc.mvp, false, mvp)

      // Ink silhouette first, depth off, so every box keeps its own outline.
      gl.disable(gl.DEPTH_TEST)
      gl.depthMask(false)
      gl.cullFace(gl.BACK)
      gl.uniform1f(loc.hull, perPx * 3.2)
      gl.uniform1f(loc.isHull, 1)
      gl.drawArrays(gl.TRIANGLES, 0, count)

      // Then the flat fills, inset by that width.
      gl.enable(gl.DEPTH_TEST)
      gl.depthMask(true)
      gl.uniform1f(loc.hull, 0)
      gl.uniform1f(loc.isHull, 0)
      gl.drawArrays(gl.TRIANGLES, 0, count)

      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (!raf && visible && !document.hidden) {
        t0 = performance.now() - (t0 ? 0 : 0)
        raf = requestAnimationFrame(frame)
      }
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    function onDown(e) {
      dragging = true
      moved = 0
      lastX = e.clientX
      lastY = e.clientY
      canvas.setPointerCapture?.(e.pointerId)
    }
    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      px = ((e.clientX - rect.left) / rect.width) * 2 - 1
      py = ((e.clientY - rect.top) / rect.height) * 2 - 1
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      moved += Math.abs(dx) + Math.abs(dy)
      velY = dx * 0.006
      velX = dy * 0.004
      rotY += velY
      rotX += velX
      lastX = e.clientX
      lastY = e.clientY
    }
    function onUp(e) {
      if (dragging && moved < 6) onPick?.()
      dragging = false
      canvas.releasePointerCapture?.(e.pointerId)
    }
    function onLeave() {
      px = 0
      py = 0
      dragging = false
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              if (visible) start()
              else stop()
            },
            { threshold: 0.01 },
          )
        : null
    io?.observe(canvas)

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    start()

    return () => {
      stop()
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      gl.deleteBuffer(vbo)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [rig, rigName, field, onFail, onPick, spin])

  return <canvas ref={canvasRef} className="obj-canvas" aria-hidden="true" />
}

/* ===========================================================================
   SVG TWIN
   The same rig at one moment, with CSS carrying the motion so a phone keeps
   a moving object for the cost of a transform.
   =========================================================================== */

const ISO_X = Math.cos(Math.PI / 6)
const ISO_Y = Math.sin(Math.PI / 6)
const project = (x, y, z, s) => [(x - z) * ISO_X * s, ((x + z) * ISO_Y - y) * s]

export function ObjSVG({ rig, rigName, state = {}, field = null, className = '', label, still = false }) {
  const boxes = useMemo(() => rig(RIG_STILL_T[rigName] ?? 0.0001, state), [rig, rigName, state])
  const scale = 46

  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0
  for (const b of boxes) {
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        for (const sz of [-1, 1]) {
          const [qx, qy] = project(b.x + (sx * b.w) / 2, b.y + (sy * b.h) / 2, b.z + (sz * b.d) / 2, scale)
          minX = Math.min(minX, qx)
          maxX = Math.max(maxX, qx)
          minY = Math.min(minY, qy)
          maxY = Math.max(maxY, qy)
        }
  }
  // CSS carries the motion here, so the frame leaves room for where it goes.
  const pad = 58
  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2]

  // Painter's order: lowest and furthest first.
  const order = [...boxes].sort((a, b) => a.y - b.y || a.z - b.z)

  return (
    <svg viewBox={vb.join(' ')} className={className} role="img" aria-label={label || 'Diagram'}>
      {order.map((b, idx) => {
        const hx = b.w / 2
        const hy = b.h / 2
        const hz = b.d / 2
        const t = b.y + hy
        const bot = b.y - hy
        const colour = resolve(b.color, field)
        const faces = [
          { tone: TONE.front, pts: [[hx, t, hz], [hx, bot, hz], [-hx, bot, hz], [-hx, t, hz]] },
          { tone: TONE.side, pts: [[hx, t, -hz], [hx, bot, -hz], [hx, bot, hz], [hx, t, hz]] },
          { tone: TONE.top, pts: [[hx, t, -hz], [hx, t, hz], [-hx, t, hz], [-hx, t, -hz]] },
        ]
        return (
          <g
            key={b.key}
            className={`obj-b ${still ? '' : `obj-${b.anim || 'still'}`}`}
            style={{ '--i': b.phase ?? idx, '--sx': '0px', '--sy': '0px' }}
          >
            {faces.map((face, fi) => (
              <polygon
                key={fi}
                points={face.pts.map(([x, y, z]) => project(x + b.x, y, z + b.z, scale).join(',')).join(' ')}
                fill={b.ghost ? 'none' : toHex(shade(colour, b.lit ? 1 : face.tone))}
                stroke="currentColor"
                strokeWidth={b.ghost ? 1.6 : 2.4}
                strokeOpacity={b.ghost ? 0.28 : 1}
                strokeLinejoin="round"
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

/* ===========================================================================
   The object, deciding its own medium.
   =========================================================================== */

export default function Obj({
  rig = 'stack',
  state,
  field = null,
  label,
  caption,
  onToggle,
  spin = false,
  className = '',
}) {
  const [failed, setFailed] = useState(false)
  const lite = useLiteObject()
  const fn = RIGS[rig]
  const onFail = useMemo(() => () => setFailed(true), [])
  const memoState = useMemo(() => state || {}, [state])

  const useGL = !lite && !failed

  return (
    <div className={`obj-stage ${className}`}>
      {useGL ? (
        <ObjGL rig={fn} rigName={rig} field={field} state={memoState} onFail={onFail} onPick={onToggle} spin={spin} />
      ) : onToggle ? (
        <button type="button" onClick={onToggle} className="obj-canvas grid place-items-center cursor-pointer">
          <span className="sr-only">{label || 'Change the object'}</span>
          <ObjSVG rig={fn} rigName={rig} state={memoState} field={field} className="w-full h-full" label={label} />
        </button>
      ) : (
        <ObjSVG rig={fn} rigName={rig} state={memoState} field={field} className="w-full h-full" label={label} />
      )}
      {caption}
    </div>
  )
}
