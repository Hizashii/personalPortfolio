import { Link, useRouter } from '../router'
import { ROUTES, SOCIALS, TICKER } from '../data'
import { Arrow, Asterisk, Download } from './ui'

const CASE_PARENT = ['/applyer', '/spisnem', '/minwin']

export function TopBar() {
  const { path } = useRouter()
  const current = CASE_PARENT.includes(path) ? '/work' : path

  return (
    <header className="bar">
      <div className="board flex items-center gap-4 w-full">
        <Link to="/" className="bar-mark" aria-label="Lachezar Dimchov, home">
          <span className="bracket bracket-l" aria-hidden="true">
            [
          </span>
          LD
          <span className="bracket bracket-r" aria-hidden="true">
            ]
          </span>
        </Link>
        <span className="t-micro dimmer hidden lg:inline">
          Lachezar Dimchov&nbsp; / &nbsp;Full-stack developer
        </span>

        <nav className="bar-nav" aria-label="Sections">
          {ROUTES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="bar-link"
              aria-current={current === r.to ? 'page' : undefined}
            >
              <span className="bar-num">{r.num}</span>
              <span>{r.label}</span>
            </Link>
          ))}
        </nav>

        <a className="pill" href={`mailto:${SOCIALS.email}`}>
          Contact
        </a>
      </div>
    </header>
  )
}

export function Ticker({ items = TICKER }) {
  const group = (
    <div className="ticker-group" aria-hidden="true">
      {items.map((t) => (
        <span key={t} className="ticker-item t-label">
          <Asterisk />
          {t}
        </span>
      ))}
    </div>
  )

  return (
    <div className="ticker">
      <div className="ticker-track">
        {group}
        {group}
      </div>
      <span className="sr-only">{items.join('. ')}.</span>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="section board pb-[clamp(28px,4vw,56px)]">
      <div className="panel panel--ink">
        <div className="grid gap-x-10 gap-y-9 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="t-display" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.6rem)' }}>
              Let&rsquo;s build
              <br />
              something.
            </p>
            <p className="t-lede sub mt-6">
              Open to full-stack roles in Copenhagen, on site or hybrid, and to freelance work.
            </p>
            <a className="btn btn--lime mt-6" href={`mailto:${SOCIALS.email}`}>
              Write to me
              <Arrow className="btn-arrow" />
            </a>
          </div>

          <div>
            <h2 className="t-label sub">Elsewhere</h2>
            <ul className="mt-4 flex flex-col gap-3 t-data">
              <li>
                <a className="tlink" href={SOCIALS.github} target="_blank" rel="noreferrer">
                  GitHub
                  <Arrow size={12} />
                </a>
              </li>
              <li>
                <a className="tlink" href={SOCIALS.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                  <Arrow size={12} />
                </a>
              </li>
              <li>
                <a className="tlink" href={SOCIALS.cv} download>
                  CV, PDF
                  <Download size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="t-label sub">Index</h2>
            <ul className="mt-4 flex flex-col gap-3 t-data">
              {ROUTES.map((r) => (
                <li key={r.to}>
                  <Link className="tlink" to={r.to}>
                    <span className="opacity-60 tabular-nums">{r.num}</span>
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t-2 border-current/25 flex flex-wrap gap-x-8 gap-y-2 justify-between t-micro sub">
          <span>Esbjerg, Denmark &nbsp;/&nbsp; open to Copenhagen, on site or hybrid</span>
          <span>Built from scratch: React, Vite, WebGL</span>
          <span>&copy; {new Date().getFullYear()} Lachezar Dimchov</span>
        </div>
      </div>
    </footer>
  )
}

export function Page({ children }) {
  return <main id="main">{children}</main>
}
