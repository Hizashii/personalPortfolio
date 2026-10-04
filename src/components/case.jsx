import { Arrow } from './ui'
import { Link } from '../router'
import { PROJECTS } from '../data'

// Small pieces shared by the three case-study pages.

export function Eyebrow({ children }) {
  return <p className="ce-eyebrow mono">{children}</p>
}

export function HandNote({ children, className = '', arrow = 'down-left' }) {
  const d =
    arrow === 'down-left'
      ? 'M58 4C40 8 22 18 6 36M14 28l-9 9 12 2'
      : arrow === 'down-right'
        ? 'M3 4C22 8 40 18 56 36M48 28l9 9-12 2'
        : 'M3 40C18 38 32 24 58 6M47 4l12 2-4 11'
  return (
    <p className={`ce-hand ce-hand--${arrow} hand ${className}`}>
      <span>{children}</span>
      <svg viewBox="0 0 64 44" fill="none" aria-hidden="true">
        <path d={d} />
      </svg>
    </p>
  )
}

// A numbered section: explanation on the left, the visual on the right.
export function CaseSection({ id, n, label, title, children, aside, dark = false }) {
  return (
    <section id={id} className={`ce-sec ${dark ? 'ce-sec--dark' : ''}`} aria-labelledby={`${id}-t`}>
      <div className="ce-sec-text">
        <Eyebrow>
          {n} <i>/</i> {label}
        </Eyebrow>
        <h2 id={`${id}-t`} className="ce-h2">
          {title}
        </h2>
        {children}
      </div>
      <div className="ce-sec-visual">{aside}</div>
    </section>
  )
}

// Where to go next, so the three case studies read as one set.
export function CaseNext({ from }) {
  const order = ['applyer', 'spisnem', 'minwin']
  const next = PROJECTS[order[(order.indexOf(from) + 1) % order.length]]
  return (
    <section className="ce-next wrap" aria-label="Next project">
      <Link to="/work" className="hm-link">
        All work
      </Link>
      <Link to={`/${next.slug}`} className="ce-next-link">
        <span className="mono">Next project</span>
        <span className="ce-next-name">
          {next.name} <Arrow />
        </span>
        <span className="ce-next-tag">{next.tagline}</span>
      </Link>
    </section>
  )
}
