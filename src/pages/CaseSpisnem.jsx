import { useEffect, useRef, useState } from 'react'
import '@fontsource/caveat/500.css'
import { Arrow } from '../components/ui'
import { Flow, SPIS_FLOW } from '../components/drawings'
import { CaseNext, Eyebrow, HandNote } from '../components/case'
import { Link } from '../router'
import { SpisnemDemo } from '../components/demos'
import { PROJECTS } from '../data'
import { useMedia } from '../hooks'

const P = PROJECTS.spisnem

// Each step names the screen the phone should show and where to point.
const STEPS = [
  {
    id: 'find',
    tab: 'Find',
    title: 'Find a place nearby',
    text: 'A map of restaurants close to where you are, each with its live wait time. No calling, no guessing.',
    screen: 'discover',
    ring: { x: 63, y: 29, label: 'Live wait on the map' },
  },
  {
    id: 'join',
    tab: 'Join',
    title: 'Join from where you stand',
    text: 'One tap puts you in the queue. You do not need to be at the door, only close enough to come back when it is your turn.',
    screen: 'discover',
    ring: { x: 50, y: 90, label: 'Join queue' },
  },
  {
    id: 'wait',
    tab: 'Wait',
    title: 'Wait with an honest number',
    text: 'Your place in the line and a realistic time, so you can go for a walk instead of standing outside.',
    screen: 'queue',
    ring: { x: 50, y: 31, label: 'Your place in line' },
  },
  {
    id: 'ready',
    tab: 'Table ready',
    title: 'Get pinged when it is your turn',
    text: 'The restaurant calls you in from the dashboard, and you are notified. That is the whole loop.',
    screen: 'queue',
    ring: { x: 50, y: 84, label: 'Notified' },
  },
]

const SCREENS = {
  discover: { src: '/assets/spisnem/spisnem-discover.webp', w: 312, h: 640, alt: 'SpisNem guest app: a map of nearby restaurants with live wait times' },
  queue: { src: '/assets/spisnem/spisnem-queue.webp', w: 256, h: 500, alt: 'SpisNem guest app: queue position number two, about eight minutes' },
}

const PINS = [
  { id: 'stats', x: 50, y: 29, title: 'Live numbers', text: 'Who is waiting, the average quote and how many were seated today.' },
  { id: 'waited', x: 61, y: 57, title: 'Honest waits', text: 'Time waited against the time quoted, for every party in the list.' },
  { id: 'notified', x: 86, y: 57, title: 'Notified, then seated', text: 'Guests are pinged when the table is ready. Seating them is one tap.' },
  { id: 'callin', x: 93, y: 67, title: 'Call in', text: 'The next party is called in from the list with one tap.' },
]

const DECISIONS = [
  ['Phone first', 'Guests are standing somewhere with a phone in their hand. The guest side is designed for that moment, not squeezed down from a desktop page.'],
  ['Honest numbers', 'A wait time is only useful if it is believable. Position and minutes are shown plainly, and the restaurant sees waited against quoted.'],
  ['A calm dashboard', 'Staff are busy. The dashboard shows one list, one next action per row and nothing else competing for attention.'],
]

// The phone: a bezel, a screen, and a ring that points at what the step is about.
function Phone({ step, className = '' }) {
  return (
    <div className={`cs-phone ${className}`}>
      <div className="cs-phone-screen">
        {Object.entries(SCREENS).map(([k, v]) => (
          <img
            key={k}
            className={k === step.screen ? 'is-on' : ''}
            src={v.src}
            alt={k === step.screen ? v.alt : ''}
            width={v.w}
            height={v.h}
            aria-hidden={k !== step.screen}
          />
        ))}
        <span
          key={step.id}
          className="cs-ring"
          style={{ left: `${step.ring.x}%`, top: `${step.ring.y}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="cs-phone-label" aria-live="polite">
        {step.ring.label}
      </p>
    </div>
  )
}

export default function CaseSpisnem() {
  const narrow = useMedia('(max-width: 900px)')
  const m = useMedia('(max-width: 760px)') ? 'narrow' : 'wide'
  const [tab, setTab] = useState(0)
  const [active, setActive] = useState(0)
  const [pin, setPin] = useState(0)
  const stepRefs = useRef([])

  useEffect(() => {
    document.title = 'Spisnem · Lachezar Dimchov'
    return () => {
      document.title = 'Lachezar Dimchov, Software Engineer'
    }
  }, [])

  // The sticky phone follows whichever step is centred in the viewport.
  useEffect(() => {
    if (narrow) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    stepRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [narrow])

  return (
    <main className="cs ce">
      {/* Hero */}
      <header className="cs-top wrap">
        <div className="cs-top-copy">
          <Eyebrow>
            Project <i>/</i> Case study
          </Eyebrow>
          <h1 className="cs-h1" style={{ viewTransitionName: 'title-spisnem' }}>
            Spisnem
          </h1>
          <p className="cs-lede">{P.tagline}</p>
          <p className="cs-sub">
            A phone-first web app that lets guests see live wait times on a map and join a restaurant queue
            from where they stand, with a calm dashboard for the restaurant to call parties in.
          </p>
          <dl className="cs-facts">
            <div>
              <dt className="mono">Surfaces</dt>
              <dd>Guest phone app, restaurant dashboard</dd>
            </div>
            <div>
              <dt className="mono">Status</dt>
              <dd>Ongoing, in beta</dd>
            </div>
          </dl>
          <div className="cs-cta">
            <a href={P.url} className="btn btn--solid" target="_blank" rel="noopener noreferrer">
              Try the beta <Arrow dir="ne" />
            </a>
            <Link to="/work" className="hm-link">
              All work
            </Link>
          </div>
          <p className="hm-fine">Restaurants and names shown are demo data.</p>
        </div>

        <div className="cs-top-art">
          <div className="cs-radar" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="cs-proto">
            <Phone step={STEPS[tab]} />
            <div className="cs-tabs" role="tablist" aria-label="Guest journey">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === i}
                  className="cs-tab"
                  onClick={() => setTab(i)}
                >
                  <span className="mono">{i + 1}</span> {s.tab}
                </button>
              ))}
            </div>
          </div>
          <HandNote className="cs-top-note" arrow="down-left">
            tap through the guest&rsquo;s
            <br />
            side of the queue.
          </HandNote>
        </div>
      </header>

      {/* Live demo */}
      <section className="cs-try wrap" aria-labelledby="try-t">
        <Eyebrow>
          Try it <i>/</i> Both sides of the queue
        </Eyebrow>
        <h2 id="try-t" className="ce-h2 cs-h2">
          Be the guest. Then be the host.
        </h2>
        <SpisnemDemo />
      </section>

      {/* Guest journey */}
      <section className="cs-journey wrap" aria-labelledby="journey-t">
        <Eyebrow>
          01 <i>/</i> The guest side
        </Eyebrow>
        <h2 id="journey-t" className="ce-h2 cs-h2">
          Four moments, one phone.
        </h2>
        <div className="cs-journey-grid">
          <ol className="cs-steps">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                ref={(el) => (stepRefs.current[i] = el)}
                data-i={i}
                className={active === i ? 'is-active' : ''}
              >
                <span className="mono cs-step-n">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="cs-step-phone">
                  <Phone step={s} />
                </div>
              </li>
            ))}
          </ol>
          <div className="cs-sticky" aria-hidden={narrow}>
            <Phone step={STEPS[active]} />
          </div>
        </div>
      </section>

      {/* Restaurant side */}
      <section className="cs-host wrap" aria-labelledby="host-t">
        <Eyebrow>
          02 <i>/</i> The restaurant side
        </Eyebrow>
        <h2 id="host-t" className="ce-h2 cs-h2">
          One list, one next action.
        </h2>
        <div className="cs-host-grid">
          <figure className="cs-dash">
            <div className="cs-dash-frame">
              <img
                src="/assets/spisnem/spisnem-dashboard.webp"
                alt="SpisNem restaurant dashboard: the waiting list with call in and seat actions"
                width="1116"
                height="654"
                loading="lazy"
              />
              {PINS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`cs-pin ${pin === i ? 'is-on' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-label={p.title}
                  aria-pressed={pin === i}
                  onClick={() => setPin(i)}
                  onMouseEnter={() => setPin(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <figcaption className="mono">Demo data. Tap a number to see what it does.</figcaption>
          </figure>
          <ol className="cs-pins">
            {PINS.map((p, i) => (
              <li key={p.id} className={pin === i ? 'is-on' : ''}>
                <button type="button" onClick={() => setPin(i)} aria-pressed={pin === i}>
                  <span className="mono">{i + 1}</span>
                  <b>{p.title}</b>
                  <span>{p.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Decisions */}
      <section className="cs-decide wrap" aria-labelledby="decide-t">
        <Eyebrow>
          03 <i>/</i> Product decisions
        </Eyebrow>
        <h2 id="decide-t" className="ce-h2 cs-h2">
          Why it works the way it does.
        </h2>
        <ul className="cs-decisions">
          {DECISIONS.map(([t, d]) => (
            <li key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <div className="ce-panel cs-flow">
          <Flow
            spec={SPIS_FLOW[m]}
            label="Guests join the queue from a phone, the restaurant calls them in from a dashboard, and guests are notified"
          />
          <p className="mono cs-flow-cap">Two interfaces, one shared queue.</p>
        </div>
      </section>

      <CaseNext from="spisnem" />
    </main>
  )
}
