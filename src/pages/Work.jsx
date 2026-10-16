import { useEffect, useRef } from 'react'
import '@fontsource/caveat/500.css'
import { Arrow } from '../components/ui'
import { AttackGraph } from '../components/demos'
import { Link } from '../router'
import { PROJECTS } from '../data'

const PROJECT_ROWS = [
  {
    p: PROJECTS.applyer,
    side: 'right',
    desc: 'A full-stack platform that uses AI to handle job applications. It runs on Gemini 2.5 Flash today, and local models are being trained to take over.',
    chips: ['Software', 'Automation', 'Infrastructure'],
    points: ['Job matching with AI', 'Automatic form filling', 'Submission and tracking', 'Local models, in progress'],
    stack: ['TypeScript', 'Supabase', 'DuckDB', 'Docker', 'Terraform', 'Ansible', 'Gemini'],
    note: 'AI application automation',
  },
  {
    p: PROJECTS.spectre,
    side: 'left',
    desc: 'A cloud attack-path analysis tool. It shows how identities, roles, policies and credentials chain into access to sensitive data, traces every step to its evidence, and tests a fix on a copy before you trust it.',
    chips: ['Security', 'Systems', 'Software'],
    points: ['Attack paths with evidence for every step', 'A deterministic policy engine', 'Simulate a fix before applying it', 'Flags fixes that break legitimate access'],
    stack: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'SQLite', 'React', 'TypeScript', 'React Flow'],
    live: { href: PROJECTS.spectre.repo, label: 'Source on GitHub' },
    note: 'Every step traced to its evidence',
  },
  {
    p: PROJECTS.spisnem,
    side: 'right',
    desc: 'A phone-first web app that lets guests see live wait times on a map and join a restaurant queue from where they stand, with a calm dashboard for the restaurant to call parties in.',
    chips: ['Software', 'Product', 'Mobile'],
    points: ['Live wait times on a map', 'Guest and restaurant interfaces', 'Join the queue from where you stand', 'A calm dashboard to call parties in'],
    live: { href: PROJECTS.spisnem.url, label: 'Live project' },
    note: 'Live queue and map, for guests and staff',
  },
]

// Real crops of the products themselves, used behind each collage. SPECTRE has no screenshots yet.
const TEXTURES = {
  applyer: ['/assets/applyer/applyer-checks.webp', '/assets/applyer/applyer-landing.webp'],
  spisnem: ['/assets/spisnem/spisnem-discover.webp', '/assets/spisnem/spisnem-queue.webp'],
}

function HandArrow({ flip = '' }) {
  return (
    <svg className={`wp-arrow ${flip}`} viewBox="0 0 64 44" fill="none" aria-hidden="true">
      <path d="M3 40C18 38 32 24 58 6M47 4l12 2-4 11" />
    </svg>
  )
}

// Layers shift a few pixels with the pointer (desktop only), like the homepage hero.
function useParallax(ref) {
  useEffect(() => {
    const el = ref.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !fine || calm) return
    let raf = 0
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3))
        el.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3))
      })
    }
    const reset = () => {
      el.style.setProperty('--px', 0)
      el.style.setProperty('--py', 0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
    }
  }, [ref])
}

function Collage({ slug, to, note }) {
  const ref = useRef(null)
  useParallax(ref)
  return (
    <Link to={to} className={`wc wc--${slug}`} ref={ref} aria-label={`${PROJECTS[slug].name}: open the case study`}>
      <span className="wc-block wc-block--1" aria-hidden="true">
        {TEXTURES[slug] && <img src={TEXTURES[slug][0]} alt="" width="800" height="600" />}
      </span>
      <span className="wc-block wc-block--2" aria-hidden="true">
        {TEXTURES[slug] && <img src={TEXTURES[slug][1]} alt="" width="800" height="600" />}
      </span>

      {slug === 'applyer' && (
        <>
          <span className="wc-item wc-main" style={{ '--d': 5 }}>
            <img src="/assets/applyer/applyer-jobs.webp" alt="Applyer: a job card with a match score and apply actions" width="1546" height="966" decoding="async" />
          </span>
          <span className="wc-item wc-sec" style={{ '--d': 9 }}>
            <img src="/assets/applyer/applyer-applications.webp" alt="Applyer: the applications list and their status" width="1326" height="1200" decoding="async" />
          </span>
        </>
      )}

      {slug === 'spisnem' && (
        <>
          <span className="wc-item wc-main" style={{ '--d': 5 }}>
            <img src="/assets/spisnem/spisnem-dashboard.webp" alt="SpisNem: the restaurant dashboard with the waiting list" width="1116" height="654" decoding="async" />
          </span>
          <span className="wc-item wc-sec wc-phone" style={{ '--d': 9 }}>
            <img src="/assets/spisnem/spisnem-discover.webp" alt="SpisNem: a map of nearby restaurants with live wait times" width="312" height="640" decoding="async" />
          </span>
          <span className="wc-item wc-sec2 wc-phone" style={{ '--d': 12 }}>
            <img src="/assets/spisnem/spisnem-queue.webp" alt="SpisNem: a guest's place in the queue" width="256" height="500" decoding="async" />
          </span>
        </>
      )}

      {slug === 'spectre' && (
        <>
          <span className="wc-item wc-main sp-screen" style={{ '--d': 5 }}>
            <AttackGraph label="SPECTRE: an attack path from a developer to the customer database" />
          </span>
          <span className="wc-item wc-sec wc-path" style={{ '--d': 10 }} aria-hidden="true">
            <b>finding 01 · critical</b>
            <span><i>1</i> assume CI deployer</span>
            <span><i>2</i> assume app runtime</span>
            <span><i>3</i> read DB credentials</span>
            <span><i>4</i> customer DB</span>
          </span>
        </>
      )}

      <span className="wc-note hand">
        {note}
        <HandArrow />
      </span>
    </Link>
  )
}

export default function Work() {
  return (
    <main className="wp">
      <header className="wp-head wrap">
        <p className="hm-kicker">
          <span className="hm-dot" aria-hidden="true" />
          Selected work
        </p>
        <div className="wp-head-row">
          <div>
            <h1 className="wp-h1">Real products.</h1>
            <p className="wp-h1-sub">Open one for the thinking behind it.</p>
          </div>
          <p className="wp-intro">
            These are the main projects I have been building. Different problems, different constraints,
            but the same goal: software that works in the real world.
          </p>
        </div>
      </header>

      <div className="wrap">
        {PROJECT_ROWS.map(({ p, side, desc, chips, points, stack, live, note }) => (
          <article key={p.slug} className={`wp-row wp-row--${side}`} aria-labelledby={`wp-${p.slug}`}>
            <div className="wp-text">
              <span className="mono wp-n">{p.sheet}</span>
              <h2 id={`wp-${p.slug}`} className="wp-title">
                <Link to={`/${p.slug}`} style={{ viewTransitionName: `title-${p.slug}` }}>
                  {p.name}
                </Link>
              </h2>
              <p className="wp-tag">{p.tagline}</p>
              <p className="wp-desc">{desc}</p>
              <ul className="chips">
                {chips.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <ul className="wp-points">
                {points.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="wp-cta">
                <Link to={`/${p.slug}`} className="btn btn--solid">
                  View case study <Arrow />
                </Link>
                {live && (
                  <a href={live.href} className="hm-link" target="_blank" rel="noopener noreferrer">
                    {live.label} <Arrow dir="ne" />
                  </a>
                )}
              </div>
              {p.slug === 'spisnem' && <p className="hm-fine">Restaurants and names shown are demo data.</p>}
            </div>

            <div className="wp-visual">
              <Collage slug={p.slug} to={`/${p.slug}`} note={note} />
              <dl className="wp-meta">
                {stack && (
                  <div className="wp-meta-stack">
                    <dt>Tech stack</dt>
                    <dd>
                      <ul className="chips">
                        {stack.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                <div className="wp-meta-status">
                  <dt>Status</dt>
                  <dd>
                    <span className={`wp-dot ${p.slug === 'spectre' ? 'is-early' : ''}`} aria-hidden="true" />
                    {p.slug === 'spectre' ? 'Work in progress' : p.slug === 'spisnem' ? 'Ongoing, in beta' : 'Ongoing'}
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>

      <section className="wp-end wrap" aria-label="More">
        <div>
          <h2 className="wp-end-title">Want the deeper story?</h2>
          <p className="wp-end-text">
            Each project has its own case study, and Lab and Notes shows how I think.
          </p>
        </div>
        <div className="wp-end-cta">
          <Link to="/lab" className="btn btn--line">
            Lab and Notes <Arrow />
          </Link>
          <Link to="/#contact" className="btn btn--solid">
            Say hello <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}
