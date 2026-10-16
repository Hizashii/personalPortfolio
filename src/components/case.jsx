import { Arrow, Marker } from './ui'
import { Link } from '../router'
import { PROJECTS } from '../data'

// Small pieces shared by the three case-study pages.

const CASE_ORDER = ['applyer', 'spectre', 'spisnem']

export function Eyebrow({ children }) {
  return <p className="text-meta font-medium text-ai-muted">{children}</p>
}

// A short aside next to a visual: the fuji cut used for list bullets, then the note.
export function Annotation({ children, className = '' }) {
  return (
    <p className={`flex items-baseline gap-3 text-small font-medium text-ai-muted ${className}`}>
      <span className="cut inline-block h-2 w-3 shrink-0 bg-fuji" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

// Former name, still imported by the SPECTRE and SpisNem pages until their own redesign.
export const HandNote = Annotation

function Facts({ items }) {
  return (
    <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map(([term, detail]) => (
        <div key={term} className="border-t border-ai/20 pt-3">
          <dt className="text-meta text-ai-muted">{term}</dt>
          <dd className="mt-1 font-medium">{detail}</dd>
        </div>
      ))}
    </dl>
  )
}

export function CaseHeader({ project, lede, facts, art }) {
  return (
    <header className="wrap grid gap-12 pt-12 pb-section md:pt-20 lg:grid-cols-12 lg:gap-x-10 lg:pt-28">
      <div className="lg:col-span-6">
        <Eyebrow>Case study {project.sheet}</Eyebrow>
        <h1 className="mt-5 text-display font-semibold" style={{ viewTransitionName: `title-${project.slug}` }}>
          {project.name}
        </h1>
        <p className="mt-6 max-w-measure text-lede">{lede}</p>
        <Facts items={facts} />
      </div>
      <div className="lg:col-span-6 lg:self-center">{art}</div>
    </header>
  )
}

// A numbered section: the explanation, then the visual beside it on wide screens.
export function CaseSection({ id, n, label, title, children, aside }) {
  return (
    <section id={id} className="border-t-2 border-ai pt-4" aria-labelledby={`${id}-title`}>
      <Marker n={n}>{label}</Marker>
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <h2 id={`${id}-title`} className="text-h2 font-semibold">
            {title}
          </h2>
          <div className="mt-6 grid max-w-measure gap-4">{children}</div>
        </div>
        <div className="min-w-0 lg:col-span-7">{aside}</div>
      </div>
    </section>
  )
}

export function Panel({ title, children, className = '' }) {
  return (
    <div className={`border border-ai/15 p-5 sm:p-8 ${className}`}>
      {title && <h3 className="mb-4 text-meta font-semibold text-ai-muted">{title}</h3>}
      {children}
    </div>
  )
}

// Term and explanation rows; the term column appears from small screens up.
export function DetailList({ items }) {
  return (
    <dl>
      {items.map(([term, detail]) => (
        <div key={term} className="grid gap-1 border-t border-ai/15 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <dt className="font-semibold">{term}</dt>
          <dd className="text-small text-ai-muted">{detail}</dd>
        </div>
      ))}
    </dl>
  )
}

// Where to go next, so the three case studies read as one set.
export function CaseNext({ from }) {
  const next = PROJECTS[CASE_ORDER[(CASE_ORDER.indexOf(from) + 1) % CASE_ORDER.length]]
  return (
    <nav className="wrap pt-section" aria-label="Next project">
      <div className="grid gap-8 border-y border-ai/20 py-10 md:grid-cols-[auto_1fr] md:items-center">
        <Link to="/work" className="link">
          All work
        </Link>
        <Link to={`/${next.slug}`} className="slab block py-3 md:justify-self-end md:pr-4 md:text-right">
          <span className="block text-meta text-ai-muted">Next project</span>
          <span className="mt-1 flex items-center gap-3 text-h2 font-semibold md:justify-end">
            {next.name} <Arrow />
          </span>
          <span className="mt-1 block text-ai-muted">{next.tagline}</span>
        </Link>
      </div>
    </nav>
  )
}
