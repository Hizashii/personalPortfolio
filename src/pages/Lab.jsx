import { useEffect, useMemo, useRef, useState } from 'react'
import Obj from '../components/obj'
import { LAYER_META } from '../data'
import { SecHead } from '../components/ui'

/* ===========================================================================
   01 - FLOW FIELD
   A 2D canvas particle field. Trails are drawn by fading the previous frame,
   so there is no per-particle history to keep. Stops dead when off-screen.
   =========================================================================== */

function FlowField() {
  const ref = useRef(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const COUNT = window.matchMedia('(max-width: 720px)').matches ? 320 : 620
    const LINE = '#4d59ed'

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let t = 0
    const pts = new Float32Array(COUNT * 2)
    const age = new Float32Array(COUNT)

    function seed(i) {
      pts[i * 2] = Math.random() * w
      pts[i * 2 + 1] = Math.random() * h
      age[i] = Math.random() * 260
    }

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
      ctx.fillStyle = '#f4f0e7'
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < COUNT; i += 1) seed(i)
    }

    // Cheap, smooth, deterministic - no noise library needed.
    function angleAt(x, y, time) {
      const s = 0.0022
      return (
        Math.sin(x * s + time) * 1.6 +
        Math.cos(y * s * 1.3 - time * 0.7) * 1.6 +
        Math.sin((x + y) * s * 0.5 + time * 0.4) * 1.2
      )
    }

    function step() {
      ctx.fillStyle = 'rgba(244, 240, 231, 0.045)'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = LINE
      ctx.lineWidth = 1.15 * dpr
      ctx.globalAlpha = 0.8
      ctx.beginPath()

      for (let i = 0; i < COUNT; i += 1) {
        const x = pts[i * 2]
        const y = pts[i * 2 + 1]
        const a = angleAt(x, y, t)
        const nx = x + Math.cos(a) * 1.9 * dpr
        const ny = y + Math.sin(a) * 1.9 * dpr
        ctx.moveTo(x, y)
        ctx.lineTo(nx, ny)
        pts[i * 2] = nx
        pts[i * 2 + 1] = ny
        age[i] += 1
        if (age[i] > 320 || nx < 0 || ny < 0 || nx > w || ny > h) seed(i)
      }

      ctx.stroke()
      ctx.globalAlpha = 1
      t += 0.0019
    }

    function frame() {
      resize()
      if (!pausedRef.current) step()
      raf = requestAnimationFrame(frame)
    }

    resize()
    if (reduced) {
      for (let i = 0; i < 320; i += 1) step()
      return undefined
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(frame)
        if (!visible && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <>
      <canvas ref={ref} className="w-full h-full block" aria-hidden="true" />
      <button
        type="button"
        className="absolute bottom-4 right-4 chip chip--solid"
        onClick={() => setPaused((v) => !v)}
      >
        {paused ? 'Resume' : 'Pause'}
      </button>
    </>
  )
}

/* ===========================================================================
   03 - VARIABLE AXES
   Martian Mono has a width axis as well as a weight axis. The display type on
   this site is set at wdth 87.5–95; this is the rest of the range.
   =========================================================================== */

function Axes() {
  const [wght, setWght] = useState(700)
  const [wdth, setWdth] = useState(85)

  return (
    <div className="flex flex-col h-full">
      <p
        className="flex-1 grid place-items-center text-center px-2 py-6 leading-[0.95]"
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: wght,
          fontVariationSettings: `'wdth' ${wdth}`,
          fontSize: 'clamp(1.8rem, 5.4vw, 3.4rem)',
          letterSpacing: '-0.04em',
        }}
      >
        Handgloves
      </p>

      <div className="grid gap-4 pt-5 border-t-2 border-[var(--ink)]">
        <label className="grid gap-2">
          <span className="t-micro flex justify-between">
            <span>Weight</span>
            <span className="tabular-nums">{wght}</span>
          </span>
          <input
            type="range"
            aria-label="Weight axis"
            min="100"
            max="800"
            step="10"
            value={wght}
            onChange={(e) => setWght(+e.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="t-micro flex justify-between">
            <span>Width</span>
            <span className="tabular-nums">{wdth}</span>
          </span>
          <input
            type="range"
            aria-label="Width axis"
            min="75"
            max="112"
            step="0.5"
            value={wdth}
            onChange={(e) => setWdth(+e.target.value)}
          />
        </label>
      </div>
    </div>
  )
}

/* ========================================================================= */

export default function Lab() {
  const [active, setActive] = useState(-1)
  const [exploded, setExploded] = useState(false)
  const stackState = useMemo(() => ({ active, exploded }), [active, exploded])

  return (
    <>
      <section className="board pt-[clamp(14px,2vw,26px)]">
        <div className="panel panel--ink" data-rise>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h1 className="t-display-xl" style={{ fontSize: 'clamp(2.2rem,5.4vw,4rem)' }}>
                Things I made
                <br />
                to find out.
              </h1>
              <p className="t-lede sub mt-8">
                Small pieces with no product attached. Each one runs here, in the page, and
                stops the moment it scrolls out of sight.
              </p>
            </div>
            <p className="t-data sub">
              Everything on this site is drawn in the browser. The object on the homepage is
              WebGL, the field below is 2D canvas, and the project objects are SVG. There are no
              images of graphics anywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="section board">
        <SecHead index="01" title="Flow field" aside="2D canvas" />
        <div className="panel panel--cream panel--flush relative h-[min(62vh,560px)]" data-rise>
          <FlowField />
        </div>
        <p className="t-data dim mt-4 max-w-[62ch]">
          Six hundred particles following a field built from three sine waves. Trails come from
          fading the previous frame rather than storing history, which keeps it to one path per
          frame.
        </p>
      </section>

      <section className="section board">
        <SecHead index="02" title="The stack, unlocked" aside="WebGL" />
        <div className="grid gap-[var(--gap)] lg:grid-cols-[1fr_380px]">
          <div className="panel panel--blue panel--flush relative min-h-[420px]" data-rise>
            <div className="absolute inset-0 p-6">
              <Obj
                rig="stack"
                spin
                state={stackState}
                label="Six stacked slabs, one for each layer of the stack."
                onToggle={() => setExploded((v) => !v)}
                className="h-full"
              />
            </div>
          </div>

          <div className="panel panel--paper flex flex-col" data-rise>
            <h3 className="t-label">Controls</h3>
            <ul className="mt-4 -mx-[10px]" onMouseLeave={() => setActive(-1)}>
              {LAYER_META.map((l, i) => (
                <li key={l.key}>
                  <button
                    type="button"
                    className="layer-row"
                    data-on={active === i}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(-1)}
                    onClick={() => setActive(active === i ? -1 : i)}
                    aria-pressed={active === i}
                  >
                    <span className="tabular-nums opacity-55">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{l.name}</span>
                    <span className="layer-leader" aria-hidden="true" />
                    <span className="layer-dot" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn mt-auto w-full"
              onClick={() => setExploded((v) => !v)}
            >
              {exploded ? 'Reassemble' : 'Take it apart'}
            </button>
          </div>
        </div>
        <p className="t-data dim mt-4 max-w-[62ch]">
          Raw WebGL: one program, one buffer, two draw calls. The ink outline is a silhouette
          pass drawn with the depth test off, so every box keeps its own rim even where two of
          them overlap.
        </p>
      </section>

      <section className="section board">
        <SecHead index="03" title="Variable axes" aside="Martian Mono" />
        <div className="grid gap-[var(--gap)] lg:grid-cols-[1fr_1fr]">
          <div className="panel panel--lime" data-rise>
            <Axes />
          </div>
          <div className="panel panel--sand flex flex-col justify-center" data-rise>
            <p className="t-body sub">
              The display face on this site has a width axis as well as a weight axis. Long
              headlines are set narrower so they keep their scale instead of shrinking, which is
              the whole reason a monospace can carry a headline at all.
            </p>
            <p className="t-data sub mt-5">
              Display: wdth 87.5–95, wght 700–800. Labels: wdth 100, wght 400–500.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
