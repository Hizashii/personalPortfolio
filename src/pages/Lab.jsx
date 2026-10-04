import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/newsreader/wght.css'
import '@fontsource/caveat/500.css'
import { Flow, PIPELINE } from '../components/drawings'
import { Arrow } from '../components/ui'
import { Link } from '../router'
import { TICKER } from '../data'
import { useMedia, useReducedMotion } from '../hooks'

const MINWIN_STEPS = ['Measure', 'Apply', 'Diff', 'Roll back']

const PRINCIPLES = [
  {
    id: 'classify',
    focus: ['classify'],
    title: 'Classify',
    text: 'Understand what failed before reacting.',
    icon: <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />,
  },
  {
    id: 'recover',
    focus: ['retry'],
    title: 'Recover',
    text: 'Retry transient failures deliberately, with backoff.',
    icon: <path d="M19 12a7 7 0 1 1-2.2-5.1M19 4v4.5h-4.5" />,
  },
  {
    id: 'handoff',
    focus: ['manual', 'park'],
    title: 'Hand off',
    text: 'When automation is uncertain, a person decides.',
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0" />,
  },
]

function HandArrow({ className = '', d = 'M3 38C16 36 30 22 56 6M45 4l12 2-4 11' }) {
  return (
    <svg className={`hand-arrow ${className}`} viewBox="0 0 64 44" fill="none" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

// Isometric sketch: ideas as layers, one solid thing underneath. Hover, focus or tap spreads the layers.
function LayersSketch() {
  const [open, setOpen] = useState(false)
  const rhombus = (cx, cy, w, h) => `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`
  return (
    <button
      type="button"
      className={`ls ${open ? 'is-open' : ''}`}
      aria-pressed={open}
      aria-label="Layers sketch: tap to spread the layers apart"
      onClick={() => setOpen((v) => !v)}
    >
      <svg viewBox="0 0 400 340" fill="none" aria-hidden="true">
        <polygon className="ls-floor" points={rhombus(210, 285, 340, 110)} />
        <path className="ls-floor-line" d="M210 230L380 285M210 230L40 285M125 257.5L295 312.5M295 257.5L125 312.5" />
        <line className="ls-axis" x1="230" y1="0" x2="230" y2="336" />
        <g className="ls-float">
          <g className="ls-cube">
            <polygon className="ls-top" points="200,176 238,194 200,212 162,194" />
            <polygon className="ls-left" points="162,194 200,212 200,256 162,238" />
            <polygon className="ls-right" points="200,212 238,194 238,238 200,256" />
          </g>
          <polygon className="ls-plane ls-plane--3" points={rhombus(235, 136, 250, 96)} />
          <polygon className="ls-plane ls-plane--2" points={rhombus(235, 104, 250, 96)} />
          <polygon className="ls-plane ls-plane--1" points={rhombus(235, 72, 250, 96)} />
        </g>
      </svg>
      <span className="ls-note ls-note--list hand" aria-hidden="true">
        ideas
        <br />
        prototypes
        <br />
        failed attempts
        <br />
        useful lessons
        <br />…
        <HandArrow className="ls-arrow ls-arrow--list" d="M3 6C22 6 40 14 52 36M44 30l8 8 4-11" />
      </span>
      <span className="ls-note ls-note--quiet hand" aria-hidden="true">
        a quieter
        <br />
        place to
        <br />
        explore.
        <HandArrow className="ls-arrow ls-arrow--quiet" d="M58 4C40 8 22 18 6 36M14 28l-9 9 12 2" />
      </span>
    </button>
  )
}

// Four agents, one controlled gateway. Click the card to open or close the gateway.
function AgentNet({ calm }) {
  const [open, setOpen] = useState(true)
  const ys = [34, 66, 98, 130]
  const paths = ys.map((y) => `M26 ${y} C 90 ${y}, 110 82, 168 82`)
  return (
    <button
      type="button"
      className="an"
      role="switch"
      aria-checked={open}
      aria-label="Controlled gateway between the agents and the outside"
      onClick={() => setOpen((v) => !v)}
    >
      <svg viewBox="0 0 300 170" fill="none" aria-hidden="true">
        {paths.map((d, i) => (
          <g key={d}>
            <path className="an-curve" d={d} />
            <circle className="an-agent" cx="26" cy={ys[i]} r="4.5" />
            {!calm && (
              <circle className="an-packet" r="2.8">
                <animateMotion dur="2.6s" begin={`${i * 0.55}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        ))}
        <line className="an-wall" x1="172" y1="6" x2="172" y2="164" />
        <rect className={`an-gate ${open ? '' : 'is-closed'}`} x="165" y="64" width="14" height="36" rx="2" />
        {open ? (
          <>
            <path className="an-out" d="M180 82H256" />
            <circle className="an-world" cx="262" cy="82" r="17" />
            {!calm && (
              <circle className="an-packet an-packet--out" r="2.8">
                <animateMotion dur="1.6s" begin="1.3s" repeatCount="indefinite" path="M180 82H255" />
              </circle>
            )}
          </>
        ) : (
          <>
            <path className="an-out an-out--off" d="M180 82H256" />
            <circle className="an-world an-world--off" cx="262" cy="82" r="17" />
            <path className="an-x" d="M158 72l-8 20M150 72l8 20" />
          </>
        )}
      </svg>
      <span className="an-label an-label--agents" aria-hidden="true">AGENTS</span>
      <span className="an-label an-label--gate hand" aria-hidden="true">
        {open ? 'controlled' : 'closed:'}
        <br />
        {open ? 'gateway' : 'nothing leaves'}
        <HandArrow className="an-arrow" d="M3 38C14 36 26 24 40 6M30 4l11 1-2 11" />
      </span>
      <span className="an-state" aria-hidden="true">
        gateway {open ? 'open' : 'closed'}
      </span>
    </button>
  )
}

// The real image, with the four steps cycling over it.
function MinWinPanel({ calm }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (calm) return
    const t = setInterval(() => setI((n) => (n + 1) % MINWIN_STEPS.length), 2200)
    return () => clearInterval(t)
  }, [calm])
  return (
    <button
      type="button"
      className="mw"
      aria-label={`MinWin loop, step ${i + 1}: ${MINWIN_STEPS[i]}. Tap for the next step.`}
      onClick={() => setI((n) => (n + 1) % MINWIN_STEPS.length)}
    >
      <img src="/assets/minwin/minwin-stage.webp" alt="" width="1600" height="1000" loading="lazy" />
      <span className="mw-steps2" aria-hidden="true">
        {MINWIN_STEPS.map((s, k) => (
          <span key={s} className={k === i ? 'is-on' : ''}>
            <b>{k + 1}</b> {s}
          </span>
        ))}
      </span>
    </button>
  )
}

// A model picker that swaps what is behind it without changing the interface.
function ModelPanel() {
  const [local, setLocal] = useState(false)
  return (
    <button
      type="button"
      className={`mp ${local ? 'is-local' : ''}`}
      role="switch"
      aria-checked={local}
      aria-label="Swap the model behind the interface"
      onClick={() => setLocal((v) => !v)}
    >
      <span className="mp-select">
        <span className="mp-value" key={local ? 'l' : 'g'}>
          {local ? 'Local model' : 'Gemini 2.5 Flash'}
        </span>
        <svg viewBox="0 0 12 8" width="12" height="8" fill="none" aria-hidden="true">
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </span>
      <span className="mp-row">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M6.5 10h7M10.5 7l3 3-3 3" />
        </svg>
        Tap to swap model
      </span>
      <span className="mp-note hand" aria-hidden="true">
        local models.
        <br />
        same interface.
        <HandArrow className="mp-arrow" d="M58 38C46 36 30 26 8 6M18 4L7 6l3 11" />
      </span>
    </button>
  )
}

function Ticker({ calm }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (calm) return
    const t = setInterval(() => setI((n) => (n + 1) % TICKER.length), 3400)
    return () => clearInterval(t)
  }, [calm])
  return (
    <p className="lt">
      <span className="lt-dot" aria-hidden="true" />
      <span className="lt-label">Right now</span>
      <span className="lt-win">
        <span key={i} className="lt-text mono">
          {TICKER[i]}.
        </span>
      </span>
    </p>
  )
}

// Topographic lines for the dark section. They drift as the section scrolls past.
// Cheap by design: only runs while visible, one rAF per frame, no layout reads while scrolling.
function Contours() {
  const ref = useRef(null)
  const lines = useMemo(() => {
    const out = []
    for (let i = 0; i < 20; i++) {
      let p = ''
      for (let x = 0; x <= 640; x += 10) {
        const env = Math.exp(-Math.pow((x - 430) / 190, 2))
        const y =
          190 +
          i * 11 -
          env * (70 + i * 1.5) +
          Math.sin(x * 0.021 + i * 0.5) * 9 * (0.4 + env) +
          Math.sin(x * 0.047 + i * 0.9) * 4
        p += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`
      }
      // each line drifts a little differently, so the field seems to flow rather than slide
      const dir = i % 2 ? 1 : -1
      out.push({ d: p, dx: dir * (14 + i * 1.6), dy: (i - 9.5) * 1.3 })
    }
    return out
  }, [])

  useEffect(() => {
    const svg = ref.current
    const section = svg?.closest('section')
    if (!svg || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let top = 0
    let height = 0
    let vh = window.innerHeight
    let raf = 0
    let live = false

    const measure = () => {
      const r = section.getBoundingClientRect()
      top = r.top + window.scrollY
      height = r.height
      vh = window.innerHeight
    }
    const update = () => {
      raf = 0
      const p = (window.scrollY + vh - top) / (vh + height)
      svg.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const start = () => {
      if (live) return
      live = true
      measure()
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    const stop = () => {
      live = false
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '10% 0px' })
    io.observe(section)
    const ro = new ResizeObserver(() => live && (measure(), update()))
    ro.observe(section)
    return () => {
      io.disconnect()
      ro.disconnect()
      stop()
    }
  }, [])

  return (
    <svg
      ref={ref}
      className="ln-contours"
      viewBox="0 0 640 420"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMaxYMid slice"
    >
      {lines.map((ln, i) => (
        <path key={i} d={ln.d} style={{ opacity: 0.1 + (i / 20) * 0.16, '--dx': ln.dx, '--dy': ln.dy }} />
      ))}
    </svg>
  )
}

export default function Lab() {
  const narrow = useMedia('(max-width: 760px)')
  const calm = useReducedMotion()
  const m = narrow ? 'narrow' : 'wide'
  const [focus, setFocus] = useState([])

  return (
    <main className="ln">
      {/* Lab */}
      <section id="lab" className="ln-lab wrap" aria-labelledby="lab-title">
        <div className="ln-lab-head">
          <div className="ln-lab-copy">
            <p className="ln-index mono">
              01 <span aria-hidden="true" />
            </p>
            <h1 id="lab-title" className="ln-h1">
              Lab
            </h1>
            <p className="ln-tagline hand">
              Experiments, not shipped products.
              <svg viewBox="0 0 280 12" fill="none" aria-hidden="true">
                <path className="ln-draw" d="M2 8C60 2 170 3 278 4" />
              </svg>
            </p>
            <p className="ln-intro">Where I try things before I know whether they will work.</p>
            <p className="ln-lede">
              A working bench for ideas, prototypes and curious problems. Some of these will turn into real
              products. Most won&rsquo;t. That&rsquo;s the point.
            </p>
          </div>
          <LayersSketch />
        </div>

        <ul className="ln-cards">
          <li className="ln-card">
            <p className="ln-card-top mono">
              <span>01</span>
              <span className="ln-status">
                <i className="ln-status-dot" aria-hidden="true" /> In progress
              </span>
            </p>
            <div className="ln-panel">
              <AgentNet calm={calm} />
            </div>
            <h2 className="ln-card-title">Offline agent network</h2>
            <p className="ln-card-text">
              Agents process personal data locally. Network access passes through one controlled gateway.
            </p>
            <p className="ln-hint">Click the diagram to open or close the gateway.</p>
          </li>

          <li className="ln-card">
            <p className="ln-card-top mono">
              <span>02</span>
              <span className="ln-status">
                Early <i className="ln-status-ring" aria-hidden="true" />
              </span>
            </p>
            <div className="ln-panel ln-panel--img">
              <MinWinPanel calm={calm} />
            </div>
            <h2 className="ln-card-title">
              <Link to="/minwin" className="ln-card-link">
                MinWin <Arrow dir="ne" />
              </Link>
            </h2>
            <p className="ln-card-text">A Windows tool in Rust that measures before it changes anything.</p>
            <p className="ln-hint">The loop every change goes through. Tap to step.</p>
          </li>

          <li className="ln-card">
            <p className="ln-card-top mono">
              <span>03</span>
              <span className="ln-status">
                <i className="ln-status-dot" aria-hidden="true" /> In progress
              </span>
            </p>
            <div className="ln-panel">
              <ModelPanel />
            </div>
            <h2 className="ln-card-title">Local models</h2>
            <p className="ln-card-text">
              Training local models to take over the job the cloud model does today, behind the same
              interface.
            </p>
            <p className="ln-hint">Tap the picker to swap the model.</p>
          </li>
        </ul>

        <div className="ln-bar">
          <Ticker calm={calm} />
          <p className="ln-bar-tags mono" aria-hidden="true">
            Ideas / Prototypes / Experiments / Iteration
          </p>
        </div>
      </section>

      {/* Notes */}
      <section id="notes" className="ln-notes" aria-labelledby="notes-title">
        <Contours />
        <div className="wrap ln-notes-in">
          <div className="ln-notes-top">
            <p className="ln-index mono">
              02 <span aria-hidden="true" />
            </p>
            <p className="ln-notes-tags mono" aria-hidden="true">
              Principles / Observations / Hard-earned lessons
            </p>
          </div>
          <div className="ln-notes-head">
            <h2 id="notes-title" className="ln-h2">
              Notes
            </h2>
            <p className="ln-how hand">
              How I think
              <svg viewBox="0 0 120 10" fill="none" aria-hidden="true">
                <path className="ln-draw" d="M2 6C30 2 80 3 118 4" />
              </svg>
            </p>
          </div>
          <p className="ln-quote">
            A failure is data,
            <br />
            not an exception.
          </p>
          <p className="ln-hand-note hand" aria-hidden="true">
            real systems
            <br />
            are messy.
            <br />
            design for it.
            <HandArrow className="ln-hand-arrow" d="M3 6C20 6 42 16 56 38M46 30l9 9 4-12" />
          </p>
          <p className="ln-notes-lede">
            Support taught me to start from what breaks. So I design for the failure first, and nothing
            fails silently.
          </p>

          <ol className="ln-principles">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.id}
                tabIndex={0}
                onMouseEnter={() => setFocus(p.focus)}
                onMouseLeave={() => setFocus([])}
                onFocus={() => setFocus(p.focus)}
                onBlur={() => setFocus([])}
              >
                <span className="ln-p-n mono">0{i + 1}</span>
                <svg className="ln-p-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {p.icon}
                </svg>
                <div>
                  <h3 className="ln-p-t">{p.title}</h3>
                  <p className="ln-p-d">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="ln-diagram">
            <Flow
              dark
              focus={focus}
              spec={PIPELINE.failure[m]}
              label="Failure handling: a failed submission is classified, then retried, parked or sent to a person"
            />
            <p className="ln-diagram-cap mono">
              What Applyer does when an attempt fails.
              <br />
              Red marks the decisions. Hover or tap a principle to find it here.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
