import { LAYERS } from '../data'

// Six-segment Reach bar. `lit` is solid, `partial` is in progress (hatched).
export function Reach({ lit = [], partial = [], labels = false, className = '' }) {
  const names = [...lit, ...partial].sort().map((i) => LAYERS[i]).join(', ')
  const state = (i) => (lit.includes(i) ? 'is-lit' : partial.includes(i) ? 'is-partial' : '')
  return (
    <div className={`reach ${className}`}>
      <div className="reach-bar" role="img" aria-label={`Reach: ${names || 'none'}`}>
        {LAYERS.map((name, i) => (
          <span key={name} className={`reach-seg ${state(i)}`} />
        ))}
      </div>
      {labels && (
        <ul className="reach-names">
          {LAYERS.map((name, i) => (
            <li key={name} className={state(i)}>
              <span className={`reach-key ${state(i)}`} aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function LangStrip({ langs }) {
  return (
    <div className="langs">
      <div className="langs-bar" role="img" aria-label={langs.map(([n, v]) => `${n} ${v}%`).join(', ')}>
        {langs.map(([name, value], i) => (
          <span key={name} className={`lang-seg lang-${i}`} style={{ flexGrow: Math.max(value, 0.9) }} />
        ))}
      </div>
      <ul className="langs-list">
        {langs.map(([name, value], i) => (
          <li key={name}>
            <span className={`lang-key lang-${i}`} aria-hidden="true" />
            {name} <span className="mono-num">{value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TitleBlock({ cells }) {
  return (
    <dl className="tb">
      {cells.map(([label, value]) => (
        <div className="tb-cell" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Arrow({ dir = 'right', className = '' }) {
  const rot = { right: 0, down: 90, up: -90, ne: -45 }[dir]
  return (
    <svg
      className={`arrow ${className}`}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path d="M1 7h11M8 3l4 4-4 4" />
    </svg>
  )
}

export function Figure({ children, caption, className = '' }) {
  return (
    <figure className={`fig ${className}`}>
      <div className="fig-art">{children}</div>
      {caption && <figcaption className="mono fig-cap">{caption}</figcaption>}
    </figure>
  )
}

// A framed page with a plain title. `num` is optional project numbering (01, 02, 03).
export function Sheet({ id, num, title, status, children, className = '', tb }) {
  return (
    <section id={id} className={`sheet ${className}`} aria-labelledby={`${id}-title`}>
      {num && (
        <span className="sheet-ghost" aria-hidden="true">
          {num}
        </span>
      )}
      <header className="sheet-head">
        {num && <span className="mono">{num}</span>}
        <h2 id={`${id}-title`} className="sheet-title">
          {title}
        </h2>
        {status && <span className="sheet-status">{status}</span>}
      </header>
      <div className="sheet-body">{children}</div>
      {tb && <TitleBlock cells={tb} />}
    </section>
  )
}

export function ContactRow({ label, href, children, external = false }) {
  return (
    <li>
      <a
        className="contact-row"
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="contact-label">{label}</span>
        <span className="contact-value">{children}</span>
        <Arrow dir="ne" className="contact-arrow" />
      </a>
    </li>
  )
}

// Planned command set, drawn as a plain list. Commands are code, so they get the mono face.
export function CliList({ rows }) {
  return (
    <ul className="cli">
      {rows.map(([cmd, note]) => (
        <li key={cmd}>
          <code className="cli-cmd">{cmd}</code>
          <span className="cli-note">{note}</span>
        </li>
      ))}
    </ul>
  )
}

export function Shot({ src, alt, width, height, caption, className = '', lazy = true }) {
  return (
    <figure className={`shot ${className}`}>
      <img src={src} alt={alt} width={width} height={height} loading={lazy ? 'lazy' : undefined} />
      {caption && <figcaption className="mono fig-cap">{caption}</figcaption>}
    </figure>
  )
}
