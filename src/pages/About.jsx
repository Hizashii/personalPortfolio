import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/newsreader/wght.css'
import '@fontsource/caveat/500.css'
import { Arrow } from '../components/ui'
import { Link } from '../router'
import { ABOUT, SOCIALS } from '../data'
import { useReducedMotion } from '../hooks'

// Hello in the languages I actually use. Levels are shown honestly.
const HELLOS = [
  { w: 'Hello', lang: 'en', name: 'English', level: '' },
  { w: 'こんにちは', lang: 'ja', name: 'Japanese', level: '' },
  { w: 'Hej', lang: 'da', name: 'Danish', level: 'still learning' },
]

const CURIOUS = [
  {
    id: 'infra',
    t: 'Infrastructure',
    d: 'Terraform and Ansible on Applyer got me hooked on everything that happens after localhost.',
  },
  {
    id: 'fail',
    t: 'Failure modes',
    d: 'Support taught me to start from what breaks. Now I design for the failure first.',
  },
  {
    id: 'ai',
    t: 'Local AI',
    d: 'Training local models to do the job a cloud model does today, behind the same interface.',
  },
  {
    id: 'sec',
    t: 'Security',
    d: 'Agents that handle personal data locally, with one controlled gateway to the outside.',
  },
  {
    id: 'auto',
    t: 'Automation',
    d: 'If I do something twice, I start asking whether a machine should do it instead.',
  },
  {
    id: 'people',
    t: 'Other places',
    d: 'English, Japanese and a little Danish. Learning how other places think is half the fun.',
  },
]

const NOW = [
  ['Working', 'Full-stack engineer at Weblager'],
  ['Building', 'Applyer, with a team'],
  ['Tinkering', 'MinWin, an offline agent network and local models'],
  ['Studying', 'PBA in Web Development, until 2027'],
]

// Small deterministic wobble so the lines look drawn by hand, not ruled.
function wob(seed, n = 1) {
  return Math.sin(seed * 12.9898) * 43758.5453 % 1 * n
}

// A hand-drawn ball that rolls down a staircase in the lane beside the story, one step per beat.
function BallLane({ track }) {
  const [geo, setGeo] = useState(null)
  const svg = useRef(null)
  const ball = useRef(null)
  const trail = useRef(null)
  const base = useRef(null)
  const spin = useRef(null)
  const calm = useReducedMotion()

  // Measure the beats once, and again on resize. Never while scrolling.
  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => {
      const items = [...el.querySelectorAll('li')]
      const W = el.querySelector('.ab-lane')?.clientWidth ?? 0
      if (!items.length || W < 120) return setGeo(null)
      const pts = items.map((li, i) => ({ y: li.offsetTop + 46, x: i % 2 ? W * 0.3 : W * 0.7 }))
      setGeo({ W, H: el.clientHeight, pts })
    }
    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [track])

  const { d, segs } = useMemo(() => {
    if (!geo) return { d: '', segs: [] }
    const half = 44
    const segs = []
    let cur = null // current point
    const push = (type, body) => {
      segs.push({ type, d: `M${cur[0]} ${cur[1]} ${body}` })
    }
    geo.pts.forEach((pt, i) => {
      const dir = i % 2 ? 1 : -1 // even steps are on the right and roll left, odd are on the left and roll right
      const enter = pt.x - dir * half
      const exit = pt.x + dir * half
      if (i === 0) {
        cur = [pt.x - dir * 10, pt.y - 90]
        push('fall', `Q${pt.x - dir * 6} ${pt.y - 20} ${enter + dir * 8} ${pt.y - 1}`)
        cur = [enter + dir * 8, pt.y - 1]
      }
      let body = ''
      let end = cur
      for (let k = 1; k <= 4; k++) {
        const t = k / 4
        end = [enter + dir * 8 + (exit - enter - dir * 8) * t, pt.y + wob(i * 7 + k, 1.4)]
        body += ` L${end[0]} ${end[1]}`
      }
      push('roll', body)
      cur = end
      const next = geo.pts[i + 1]
      if (next) {
        const land = next.x + dir * (half - 12)
        push('fall', `C${exit + dir * 26} ${pt.y + 6} ${land + dir * 4} ${next.y - 70} ${land} ${next.y - 1}`)
        cur = [land, next.y - 1]
      }
    })
    // the one continuous path, for drawing and for the trail
    let d = `M${segs[0].d.slice(1)}`
    segs.slice(1).forEach((sg) => {
      d += sg.d.replace(/^M[^A-Z]*/, '')
    })
    return { d, segs }
  }, [geo])

  useEffect(() => {
    const path = base.current
    const wrap = track.current
    const b = ball.current
    const tr = trail.current
    if (!geo || !path || !wrap || !b || !tr) return
    const len = path.getTotalLength()
    tr.style.strokeDasharray = len
    // measure each segment once, so progress can be eased per segment
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    let acc = 0
    const parts = segs.map((sg) => {
      probe.setAttribute('d', sg.d)
      const l = probe.getTotalLength()
      const part = { type: sg.type, start: acc, len: l }
      acc += l
      return part
    })
    const total = acc || len
    let top = 0
    let height = 0
    let vh = window.innerHeight
    let raf = 0
    let live = false
    const draw = (p) => {
      const s = p * total
      let i = parts.findIndex((q) => s <= q.start + q.len)
      if (i < 0) i = parts.length - 1
      const q = parts[i]
      const t = Math.min(1, Math.max(0, (s - q.start) / q.len))
      // falls speed up like gravity, rolls just roll
      const e = q.type === 'fall' && !calm ? t * t : t
      const pt = path.getPointAtLength(((q.start + q.len * e) / total) * len)
      let hop = 0
      let sx = 1
      let sy = 1
      if (!calm && q.type === 'fall' && t > 0.9) {
        // impact: squash flat for a moment
        const k = (t - 0.9) / 0.1
        sx = 1 + 0.22 * k
        sy = 1 - 0.22 * k
      }
      if (!calm && q.type === 'roll' && i > 0) {
        // after landing: a damped hop, then settle
        const u = t / 0.35
        if (u < 1) {
          hop = Math.abs(Math.sin(u * Math.PI * 1.5)) * 16 * (1 - u)
          sx = 1 + 0.12 * (1 - u)
          sy = 1 - 0.12 * (1 - u)
        }
      }
      b.setAttribute(
        'transform',
        `translate(${pt.x} ${pt.y - 12 - hop}) scale(${sx} ${sy})`,
      )
      // the overlapping circles turn as it rolls
      spin.current?.setAttribute('transform', `rotate(${calm ? 0 : (s / 12.5) * 57.3})`)
      tr.style.strokeDashoffset = len * (1 - e * (q.len / total) - q.start / total)
    }
    const measure = () => {
      const r = wrap.getBoundingClientRect()
      top = r.top + window.scrollY
      height = r.height
      vh = window.innerHeight
    }
    const update = () => {
      raf = 0
      const p = (window.scrollY + vh * 0.62 - top) / Math.max(1, height - 60)
      draw(Math.min(1, Math.max(0, p)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !live) {
          live = true
          measure()
          update()
          window.addEventListener('scroll', onScroll, { passive: true })
        } else if (!e.isIntersecting && live) {
          live = false
          window.removeEventListener('scroll', onScroll)
        }
      },
      { rootMargin: '20% 0px' },
    )
    io.observe(wrap)
    draw(0)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [geo, calm, track, d, segs])

  return (
    <div className="ab-lane" aria-hidden="true">
      {geo && (
        <svg ref={svg} width={geo.W} height={geo.H} viewBox={`0 0 ${geo.W} ${geo.H}`} fill="none">
          {geo.pts.map((pt, i) => (
            <g key={i} className="ab-step">
              <path d={`M${pt.x - 46} ${pt.y + 2 + wob(i + 3)} L${pt.x + 46} ${pt.y + wob(i + 9)}`} />
              <path className="ab-hatch" d={`M${pt.x - 34} ${pt.y + 5} l-6 9M${pt.x - 14} ${pt.y + 5} l-6 9M${pt.x + 6} ${pt.y + 5} l-6 9M${pt.x + 26} ${pt.y + 5} l-6 9`} />
              <text x={pt.x} y={pt.y + 30} textAnchor="middle" className="ab-step-n">
                0{i + 1}
              </text>
            </g>
          ))}
          <path ref={base} d={d} className="ab-path" />
          <path ref={trail} d={d} className="ab-trail" />
          <g ref={ball} className="ab-ball">
            <g ref={spin} className="ab-spin">
              <circle className="ab-c1" cx="0" cy="0" r="13" />
              <path className="ab-dash" d="M-11 8C-4 8 6 3 10 -8" />
            </g>
          </g>
        </svg>
      )}
    </div>
  )
}

function Greeting() {
  const calm = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (calm) return
    const t = setInterval(() => setI((n) => (n + 1) % HELLOS.length), 2600)
    return () => clearInterval(t)
  }, [calm])
  const h = HELLOS[i]
  return (
    <button
      type="button"
      className="ab-hello"
      onClick={() => setI((n) => (n + 1) % HELLOS.length)}
      aria-label={`Say hello in another language. Now showing ${h.name}.`}
    >
      <span className="ab-hello-win" aria-hidden="true">
        <span key={i} lang={h.lang} className="ab-hello-w">
          {h.w}
        </span>
      </span>
      <span className="ab-hello-cap mono">
        {h.name}
        {h.level ? (
          <>
            {' '}
            <i>·</i> {h.level}
          </>
        ) : null}
      </span>
    </button>
  )
}

export default function About() {
  const [pick, setPick] = useState(0)
  const trackRef = useRef(null)
  const c = CURIOUS[pick]

  return (
    <main className="ab">
      <header className="ab-top wrap">
        <div className="ab-top-copy">
          <p className="hm-kicker">
            <span className="hm-dot" aria-hidden="true" />
            About
          </p>
          <h1 className="ab-h1">
            Hi, I&rsquo;m <span>Lachezar.</span>
          </h1>
          <p className="ab-lede">
            A software engineer who codes most days, mostly because there is always something else I want to
            understand.
          </p>
          <p className="ab-sub">
            I live in Esbjerg, Denmark, I like meeting people, and I would rather be building something than
            talking about building something.
          </p>
          <div className="ab-cta">
            <a href={`mailto:${SOCIALS.email}`} className="btn btn--solid">
              Say hello <Arrow />
            </a>
            <Link to="/work" className="hm-link">
              See what I build
            </Link>
          </div>
        </div>

        <div className="ab-top-art">
          <div className="ab-badge" aria-hidden="true">
            <span className="ab-badge-ring" />
            <span className="ab-badge-ld">LD</span>
          </div>
          <Greeting />
          <p className="ab-note hand" aria-hidden="true">
            tap to say it
            <br />
            another way.
            <svg viewBox="0 0 64 44" fill="none">
              <path d="M58 4C40 8 22 18 6 36M14 28l-9 9 12 2" />
            </svg>
          </p>
        </div>
      </header>

      {/* The story */}
      <section id="story" className="ab-story wrap" aria-labelledby="story-t">
        <h2 id="story-t" className="hm-h2">
          <span className="mono hm-num">01</span> How I got here
        </h2>
        <div className="ab-track" ref={trackRef}>
        <ol className="ab-beats">
          {ABOUT.map(([lead, body], i) => (
            <li key={lead}>
              <span className="ab-beat-n mono">0{i + 1}</span>
              <h3>{lead}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <BallLane track={trackRef} />
        </div>
      </section>

      {/* Curious about */}
      <section className="ab-cur wrap" aria-labelledby="cur-t">
        <h2 id="cur-t" className="hm-h2">
          <span className="mono hm-num">02</span> What I keep coming back to
        </h2>
        <div className="ab-cur-grid">
          <ul className="ab-chips" role="tablist" aria-label="Things I am curious about">
            {CURIOUS.map((x, i) => (
              <li key={x.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={pick === i}
                  className={pick === i ? 'is-on' : ''}
                  onClick={() => setPick(i)}
                  onMouseEnter={() => setPick(i)}
                >
                  {x.t}
                </button>
              </li>
            ))}
          </ul>
          <div className="ab-cur-detail" role="tabpanel" aria-live="polite">
            <p key={c.id} className="ab-cur-text">
              {c.d}
            </p>
            <p className="ab-cur-hand hand" aria-hidden="true">
              always a few of these
              <br />
              on the go.
            </p>
          </div>
        </div>
      </section>

      {/* Right now */}
      <section className="ab-now wrap" aria-labelledby="now-t">
        <h2 id="now-t" className="hm-h2">
          <span className="mono hm-num">03</span> Right now
        </h2>
        <dl className="ab-now-list">
          {NOW.map(([k, v]) => (
            <div key={k}>
              <dt className="mono">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="hk-wrap wrap" aria-labelledby="ab-contact-t">
        <div className="hk">
          <div>
            <h2 id="ab-contact-t" className="hk-title">
              Come say hello.
            </h2>
            <p className="hk-text">
              If you are building something and want an engineer who looks at the whole of it, write. A hello
              is welcome too.
            </p>
          </div>
          <div className="hk-cta">
            <a href={`mailto:${SOCIALS.email}`} className="btn btn--solid">
              Email me <Arrow />
            </a>
            <a href={SOCIALS.cv} className="btn btn--line" target="_blank" rel="noopener noreferrer">
              Download CV <Arrow dir="down" />
            </a>
          </div>
        </div>
        <p className="hk-links">
          <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="hm-link">
            LinkedIn
          </a>
          <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className="hm-link">
            GitHub
          </a>
          <Link to="/experience" className="hm-link">
            Experience
          </Link>
        </p>
      </section>
    </main>
  )
}
