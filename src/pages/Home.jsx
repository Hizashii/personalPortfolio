import { useEffect, useRef } from 'react'
import '@fontsource/caveat/500.css'
import { Arrow } from '../components/ui'
import { Link } from '../router'
import { PROJECTS, SOCIALS } from '../data'

const A = PROJECTS.applyer
const S = PROJECTS.spisnem
const M = PROJECTS.minwin

const WORK = [
  {
    p: A,
    line: 'Automates job applications from matching to submission.',
    tags: ['Software', 'Automation', 'Infrastructure'],
  },
  {
    p: S,
    line: 'A restaurant queue guests can join before reaching the door.',
    tags: ['Product', 'Software', 'Mobile'],
  },
  {
    p: M,
    line: 'A Windows optimisation tool that measures before changing anything.',
    tags: ['Systems', 'Rust', 'Windows'],
  },
]

const PRINCIPLES = [
  ['Understand the system', 'Good solutions fit the larger system, not only the immediate feature.'],
  ['Design for reality', 'Requirements change, services fail and users behave unexpectedly. I build with that in mind.'],
  ['Own the outcome', 'I take responsibility from the first implementation through to what actually happens in production.'],
]

const STAGES = [
  {
    label: 'Current',
    when: '2026 to present',
    role: 'Full-stack engineer',
    org: 'Weblager',
    text: 'Working on a large Angular and TypeScript application, solving complex production and domain problems.',
    tags: ['Angular', 'TypeScript', 'APIs'],
  },
  {
    label: 'Previous',
    when: '2024 to 2026',
    role: 'Full-stack developer',
    org: 'Visma Creditro',
    text: 'Full-stack work across Vue, Node.js and NestJS microservices, including caching and backend performance.',
    tags: ['Vue', 'Node.js', 'NestJS', 'Redis'],
  },
  {
    label: 'Foundation',
    when: '2022 to 2023',
    role: 'Support engineer',
    org: 'Microsoft 365 and Cisco',
    text: 'Enterprise troubleshooting for large organisations, including IBM and CERN. It taught me to read systems I did not build.',
    tags: ['Azure', 'PowerShell', 'SharePoint'],
  },
]

const EXPLORING = ['Local AI and agent systems', 'Infrastructure', 'Security and reliability', 'Systems tooling']

function NoteArrow({ className = '' }) {
  return (
    <svg className={`hc-arrow ${className}`} viewBox="0 0 64 44" fill="none" aria-hidden="true">
      <path d="M3 40C18 38 32 24 58 6" />
      <path d="M47 4l12 2-4 11" />
    </svg>
  )
}

// Hero collage: real products, layered. Pointer movement shifts layers a few pixels (desktop only).
function HeroCollage() {
  const ref = useRef(null)
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
  }, [])

  return (
    <div className="hc" ref={ref}>
      <span className="hc-block hc-block--1" aria-hidden="true" />
      <span className="hc-block hc-block--2" aria-hidden="true" />
      <span className="hc-cross hc-cross--1" aria-hidden="true" />
      <span className="hc-cross hc-cross--2" aria-hidden="true" />

      <Link to="/applyer" className="hc-item hc-a" style={{ '--d': 5 }} aria-label="Applyer, AI application automation">
        <span className="hc-img">
          <img
            src="/assets/applyer/applyer-jobs.webp"
            alt="Applyer: a job card with a match score and apply actions"
            width="1546"
            height="966"
            fetchPriority="high"
          />
        </span>
        <span className="hc-note hc-note--a hand">
          <b>Applyer</b>
          <i>AI application automation</i>
          <NoteArrow />
        </span>
      </Link>

      <Link to="/minwin" className="hc-item hc-m" style={{ '--d': 8 }} aria-label="MinWin, Windows optimisation tool">
        <span className="hc-img">
          <img src="/assets/minwin/minwin-stage.webp" alt="" width="1600" height="1000" />
        </span>
        <span className="hc-note hc-note--m hand">
          <b>MinWin</b>
          <i>Windows optimisation tool</i>
          <NoteArrow className="hc-arrow--up" />
        </span>
      </Link>

      <Link to="/spisnem" className="hc-item hc-s" style={{ '--d': 8 }} aria-label="SpisNem, restaurant queue platform">
        <span className="hc-img hc-img--phone">
          <img
            src="/assets/spisnem/spisnem-discover.webp"
            alt="SpisNem: a map of nearby restaurants with live wait times"
            width="312"
            height="640"
          />
        </span>
        <span className="hc-note hc-note--s hand">
          <b>SpisNem</b>
          <i>Restaurant queue platform</i>
          <NoteArrow className="hc-arrow--left" />
        </span>
      </Link>
    </div>
  )
}

export default function Home() {
  return (
    <main className="hm">
      {/* Hero */}
      <section id="top" className="hm-hero wrap" aria-label="Introduction">
        <div className="hm-copy">
          <p className="hm-kicker">
            <span className="hm-dot" aria-hidden="true" />
            Software <i>·</i> Systems <i>·</i> Automation
          </p>
          <h1 className="hm-h1">
            Software
            <br />
            engineer.
          </h1>
          <p className="hm-lede">
            I build full-stack products and keep getting deeper into the systems around them: backend,
            automation, infrastructure, reliability and security.
          </p>
          <p className="hm-lede hm-lede--soft">
            I started by fixing other people’s systems. Now I build my own, and I am always curious about
            what happens after localhost.
          </p>
          <div className="hm-cta">
            <Link to="/work" className="btn btn--solid">
              View my work <Arrow />
            </Link>
            <a href={SOCIALS.cv} className="btn btn--line" target="_blank" rel="noopener noreferrer">
              Download CV <Arrow dir="down" />
            </a>
            <Link to="/#contact" className="hm-link">
              Say hello
            </Link>
          </div>
          <p className="hm-now">
            <span className="hm-now-label">Currently</span>
            <span>Full-stack engineer at Weblager</span>
            <span>Building Applyer</span>
            <span>Exploring infrastructure, systems and local AI</span>
          </p>
        </div>
        <HeroCollage />
      </section>

      {/* Selected work */}
      <section id="work" className="hm-sec wrap" aria-labelledby="work-title">
        <header className="hm-head">
          <h2 id="work-title" className="hm-h2">
            <span className="mono hm-num">01</span> Selected work
          </h2>
          <p className="hm-sub">A few things I have built.</p>
          <Link to="/work" className="hm-link hm-head-link">
            View all work <Arrow />
          </Link>
        </header>

        <div className="hw">
          {WORK.map(({ p, line, tags }) => (
            <article key={p.slug} className="hw-item">
              <Link to={`/${p.slug}`} className="hw-media" tabIndex={-1} aria-hidden="true">
                {p.slug === 'applyer' && (
                  <span className="stage stage--applyer">
                    <img className="stage-main" src="/assets/applyer/applyer-jobs.webp" alt="" width="1546" height="966" loading="lazy" />
                  </span>
                )}
                {p.slug === 'spisnem' && (
                  <span className="stage stage--spisnem">
                    <img className="stage-dash" src="/assets/spisnem/spisnem-dashboard.webp" alt="" width="1116" height="654" loading="lazy" />
                    <img className="stage-phone stage-phone--1" src="/assets/spisnem/spisnem-discover.webp" alt="" width="312" height="640" loading="lazy" />
                    <img className="stage-phone stage-phone--2" src="/assets/spisnem/spisnem-queue.webp" alt="" width="256" height="500" loading="lazy" />
                  </span>
                )}
                {p.slug === 'minwin' && (
                  <span className="stage stage--minwin">
                    <img className="stage-main" src="/assets/minwin/minwin-stage.webp" alt="" width="1600" height="1000" loading="lazy" />
                  </span>
                )}
              </Link>
              <h3 className="hw-title">
                <Link to={`/${p.slug}`} className="hw-link">
                  <span className="mono hw-n">{p.sheet}</span>
                  <span className="hw-name">{p.name}</span>
                  <Arrow dir="ne" className="hw-arrow" />
                </Link>
              </h3>
              <p className="hw-line">{line}</p>
              <ul className="chips">
                {tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.slug === 'spisnem' && <p className="hm-fine">Restaurants and names shown are demo data.</p>}
            </article>
          ))}
        </div>
      </section>

      {/* How I think */}
      <section id="notes" className="hm-sec wrap" aria-labelledby="think-title">
        <header className="hm-head">
          <h2 id="think-title" className="hm-h2">
            <span className="mono hm-num">02</span> How I think
          </h2>
          <p className="hm-sub">Good software is built on clear thinking.</p>
        </header>
        <div className="ht">
          <div className="ht-lead">
            <p className="ht-quote">
              A failure is data,
              <br />
              not an exception.
            </p>
            <p className="ht-text">
              I treat failures as information. They show where assumptions break, how systems behave in
              the real world, and what to improve next. That mindset shapes how I design, automate and
              operate software.
            </p>
          </div>
          <ol className="ht-list">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t}>
                <span className="mono ht-n">0{i + 1}</span>
                <div>
                  <h3 className="ht-t">{t}</h3>
                  <p className="ht-d">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <figure className="ht-sketch" aria-hidden="true">
            <svg viewBox="0 0 220 150" fill="none">
              <circle cx="82" cy="66" r="48" />
              <circle cx="132" cy="56" r="36" />
              <path className="ht-dash" d="M20 126C60 118 120 108 150 22" />
            </svg>
            <figcaption className="hand">
              Systems
              <br />
              &gt; Features
              <br />
              &gt; Reliable value
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Experience preview */}
      <section id="experience" className="hm-sec wrap" aria-labelledby="exp-title">
        <header className="hm-head">
          <h2 id="exp-title" className="hm-h2">
            <span className="mono hm-num">03</span> Experience
          </h2>
          <p className="hm-sub">From diagnosing systems to building them.</p>
          <Link to="/experience" className="hm-link hm-head-link">
            View full experience <Arrow />
          </Link>
        </header>
        <ol className="hx">
          {STAGES.map((s, i) => (
            <li key={s.role + s.org} className={`hx-item ${i === 0 ? 'is-current' : ''}`}>
              <p className="hx-when mono">
                {s.label} <span>{s.when}</span>
              </p>
              <h3 className="hx-role">{s.role}</h3>
              <p className="hx-org">{s.org}</p>
              <p className="hx-text">{s.text}</p>
              <ul className="chips">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Lab teaser */}
      <section id="lab" className="hm-sec wrap" aria-labelledby="lab-title">
        <div className="hl">
          <h2 id="lab-title" className="hl-title">
            Currently exploring
          </h2>
          <ul className="hl-list">
            {EXPLORING.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <Link to="/lab" className="hm-link">
            Visit Lab and Notes <Arrow />
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="hm-sec hm-sec--last wrap" aria-labelledby="contact-title">
        <div className="hk">
          <div>
            <h2 id="contact-title" className="hk-title">
              Interested in working together?
            </h2>
            <p className="hk-text">
              I am open to software engineering opportunities and conversations around systems,
              automation, infrastructure and technical solutions.
            </p>
          </div>
          <div className="hk-cta">
            <a href={`mailto:${SOCIALS.email}`} className="btn btn--solid">
              Say hello <Arrow />
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
          <a href={`mailto:${SOCIALS.email}`} className="hm-link">
            {SOCIALS.email}
          </a>
        </p>
      </section>
    </main>
  )
}
