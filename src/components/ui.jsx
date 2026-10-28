import { LAYER_META } from '../data'

/* Icons are authored SVG at one stroke weight - never a unicode glyph. */

export function Arrow({ className = '', size = 14 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M4 12L12 4M12 4H5.5M12 4v6.5" />
    </svg>
  )
}

export function ArrowRight({ className = '', size = 14 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export function Caret({ className = '', size = 12 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  )
}

export function Download({ className = '', size = 14 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M2.5 14h11" />
    </svg>
  )
}

export function Asterisk({ className = '', size = 12 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M8 2.5v11M3.2 5.2l9.6 5.6M12.8 5.2l-9.6 5.6" />
    </svg>
  )
}

/* --------------------------------------------------------------------------
   The stack bar - the shared grammar. Every project lights the span it covers.
   -------------------------------------------------------------------------- */

export function Layers({ lit = [], partial = [], className = '' }) {
  const names = LAYER_META.map((l) => l.name)
  const litNames = lit.map((i) => names[i]).filter(Boolean)
  const partNames = partial.map((i) => names[i]).filter(Boolean)
  const label = [
    litNames.length ? `Covers ${litNames.join(', ')}` : 'Covers no layer yet',
    partNames.length ? `in progress on ${partNames.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('; ')

  return (
    <div className={`layers ${className}`} role="img" aria-label={label}>
      {names.map((name, i) => (
        <span
          key={name}
          className="layers-seg"
          style={{ '--seg': i }}
          data-state={lit.includes(i) ? 'lit' : partial.includes(i) ? 'partial' : 'off'}
        />
      ))}
    </div>
  )
}

export function LayerKey({ className = '' }) {
  return (
    <ul className={`t-micro grid grid-cols-3 gap-x-4 gap-y-1 ${className}`}>
      {LAYER_META.map((l, i) => (
        <li key={l.key} className="flex gap-2">
          <span className="opacity-50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
          <span>{l.name}</span>
        </li>
      ))}
    </ul>
  )
}

/* --------------------------------------------------------------------------
   Section head - the index line and the heading on one rule.
   -------------------------------------------------------------------------- */

export function SecHead({ id, index, title, aside }) {
  return (
    <div className="sec-head" id={id} data-rise>
      <h2 className="t-head flex items-baseline gap-4">
        {index ? <span className="t-label dimmer translate-y-[-0.35em]">{index}</span> : null}
        <span>{title}</span>
      </h2>
      {aside ? <div className="t-label dimmer pb-1">{aside}</div> : null}
    </div>
  )
}

export function Chips({ items, solid = false }) {
  return (
    <ul className="chips">
      {items.map((t) => (
        <li key={t} className={solid ? 'chip chip--solid' : 'chip'}>
          {t}
        </li>
      ))}
    </ul>
  )
}
