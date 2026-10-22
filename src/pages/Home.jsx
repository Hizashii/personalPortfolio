import { useState } from 'react'
import { Arrow } from '../components/ui'
import { Link } from '../router'
import { HOME_CONTENT, SOCIALS } from '../data'

const SHOW = [
  {
    slug: 'applyer',
    name: 'Applyer',
    line: 'Finds jobs, writes the application and tracks what happens next.',
    src: '/assets/applyer/applyer-jobs.webp',
    w: 1546,
    h: 966,
    alt: 'Applyer: a job card with a match score and apply actions',
    fit: 'top left',
  },
  {
    slug: 'spisnem',
    name: 'Spisnem',
    line: 'A restaurant queue you can join from the pavement.',
    src: '/assets/spisnem/spisnem-dashboard.webp',
    w: 1116,
    h: 654,
    alt: 'Spisnem: the restaurant dashboard with the waiting list',
    fit: 'top left',
  },
  {
    slug: 'minwin',
    name: 'MinWin',
    line: 'Makes Windows lighter, and measures before it changes anything.',
    src: '/assets/minwin/minwin-stage.webp',
    w: 1600,
    h: 1000,
    alt: 'A Windows 11 desktop wallpaper in deep orange',
    fit: 'center',
  },
]

function Showcase() {
  const [i, setI] = useState(0)
  const s = SHOW[i]
  return (
    <div className="hn-show">
      <div className="hn-frame">
        {SHOW.map((x, k) => (
          <img
            key={x.slug}
            className={k === i ? 'is-on' : ''}
            src={x.src}
            alt={k === i ? x.alt : ''}
            aria-hidden={k !== i}
            width={x.w}
            height={x.h}
            style={{ objectPosition: x.fit }}
            fetchPriority={k === 0 ? 'high' : undefined}
          />
        ))}
      </div>
      <div className="hn-show-bar">
        <div className="hn-tabs" role="tablist" aria-label="Projects">
          {SHOW.map((x, k) => (
            <button
              key={x.slug}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              onMouseEnter={() => setI(k)}
            >
              {x.name}
            </button>
          ))}
        </div>
        <p className="hn-show-line" aria-live="polite">
          {s.line}{' '}
          <Link to={`/${s.slug}`} className="hn-inline">
            Open <Arrow />
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="hn">
      <section id="top" className="hn-hero wrap" aria-label="Introduction">
        <h1 className="hn-h1">
          Software
          <br />
          engineer.
        </h1>
        <div className="hn-hero-grid">
          <div className="hn-hero-copy">
            <p className="hn-lede">
              I&rsquo;m Lachezar. By day I build an Angular and TypeScript application at Weblager. On my own
              time I build Applyer, an app that applies to jobs for you, and tools like MinWin that poke at
              the parts of Windows most people never open.
            </p>
            <p className="hn-body">
              I started in support, fixing other people&rsquo;s systems, so I tend to think about what will
              break before I think about what will ship.
            </p>
            <div className="hn-cta">
              <Link to="/work" className="btn btn--solid">
                See the work <Arrow />
              </Link>
              <a href={SOCIALS.cv} className="btn btn--line" target="_blank" rel="noopener noreferrer">
                Download CV <Arrow dir="down" />
              </a>
            </div>
          </div>
          <Showcase />
        </div>
      </section>

      <section id="work" className="hn-sec wrap" aria-labelledby="work-t">
        <header className="hn-head">
          <h2 id="work-t">Work</h2>
          <Link to="/work" className="hm-link">
            All projects <Arrow />
          </Link>
        </header>
        <ul className="hn-index">
          {HOME_CONTENT.projects.map(([slug, name, text, status]) => (
            <li key={slug}>
              <Link to={`/${slug}`} className="hn-row">
                <span className="hn-row-name" style={{ viewTransitionName: `title-${slug}` }}>
                  {name}
                </span>
                <span className="hn-row-text">{text}</span>
                <span className="hn-row-status">{status}</span>
                <Arrow dir="ne" className="hn-row-arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="notes" className="hn-band hn-band--ink" aria-labelledby="think-t">
        <div className="wrap hn-think">
          <h2 id="think-t" className="hn-think-h">
            How I work
          </h2>
          <p className="hn-quote">
            A failure is data,
            <br />
            not an exception.
          </p>
          <p className="hn-think-text">
            When something breaks I want to know what assumption was wrong. That habit comes from years of
            support, and it shapes how I design, automate and run software.
          </p>
          <ul className="hn-principles">
            {HOME_CONTENT.principles.map(([t, d]) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" className="hn-sec wrap" aria-labelledby="exp-t">
        <header className="hn-head">
          <h2 id="exp-t">Experience</h2>
          <Link to="/experience" className="hm-link">
            The full list <Arrow />
          </Link>
        </header>
        <ol className="hn-roles">
          {HOME_CONTENT.roles.map(([when, role, org, text]) => (
            <li key={org}>
              <span className="hn-when">{when}</span>
              <span className="hn-role">
                {role}, <b>{org}</b>
              </span>
              <span className="hn-role-text">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className="hn-band hn-band--blue" aria-labelledby="contact-t">
        <div className="wrap hn-contact">
          <h2 id="contact-t" className="hn-contact-h">
            Let&rsquo;s talk.
          </h2>
          <p className="hn-contact-text">
            I&rsquo;m looking for software engineering work, and I enjoy conversations about systems,
            automation and infrastructure too.
          </p>
          <a href={`mailto:${SOCIALS.email}`} className="hn-mail">
            {SOCIALS.email} <Arrow />
          </a>
          <p className="hn-contact-links">
            <a href={SOCIALS.cv} target="_blank" rel="noopener noreferrer">
              CV
            </a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
