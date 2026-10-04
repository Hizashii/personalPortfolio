import { useId, useState } from 'react'
import { Arrow } from '../components/ui'
import { Link } from '../router'
import { EXPERIENCE, SOCIALS } from '../data'

const STAGE = {
  weblager: 'Now',
  applyer: 'Building',
  visma: 'Full-stack',
  holdbox: 'Full-stack',
  microsoft: 'Foundation',
  cisco: 'Foundation',
}

const ARC = [
  ['Foundation', 'Support at Cisco and Microsoft', 'Learning to read systems I did not build.'],
  ['Full-stack', 'Visma Creditro, Holdbox', 'Owning features from interface to database.'],
  ['Now', 'Weblager, Applyer', 'Large applications, and the systems around them.'],
]

const ELSEWHERE = [
  ['Studying', 'PBA in Web Development, Erhvervsakademi Sydvest, until 2027'],
  ['Community', 'Member of the Danish Chamber of Commerce in Japan since February 2026'],
  ['Languages', 'Bulgarian (native), English (C2), Japanese (C2), Danish (A2)'],
]

function Role({ r, first }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <li className={`xp-row ${first ? 'is-now' : ''} ${open ? 'is-open' : ''}`}>
      <div className="xp-when">
        <span className="xp-stage mono">{STAGE[r.id]}</span>
        <span className="xp-dates">{r.when}</span>
      </div>
      <div className="xp-main">
        <h2 className="xp-role">{r.role}</h2>
        <p className="xp-org">{r.org}</p>
        <p className="xp-scope">{r.scope}</p>
        <p className="xp-high">{r.highlight}</p>
        {r.more && (
          <>
            <button
              type="button"
              className="xp-toggle"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="xp-plus" aria-hidden="true" />
              {open ? 'Less' : 'What this involved'}
            </button>
            <div className="xp-more" id={id}>
              <ul>
                {r.more.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

export default function Experience() {
  return (
    <main className="xp">
      <header className="wp-head wrap">
        <p className="hm-kicker">
          <span className="hm-dot" aria-hidden="true" />
          Experience
        </p>
        <div className="wp-head-row">
          <div>
            <h1 className="wp-h1">Four years, one direction.</h1>
            <p className="wp-h1-sub">From diagnosing systems to building them.</p>
          </div>
          <p className="wp-intro">
            I started in support, learning how systems break. Then I moved into building them, and the scope
            has been widening ever since.
          </p>
        </div>
      </header>

      <section className="wrap xp-arc-wrap" aria-label="Career arc">
        <ol className="xp-arc">
          {ARC.map(([t, who, d], i) => (
            <li key={t}>
              <span className="mono xp-arc-n">0{i + 1}</span>
              <h2>{t}</h2>
              <b>{who}</b>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap xp-list-wrap" aria-label="Roles, most recent first">
        <ol className="xp-list">
          {EXPERIENCE.map((r, i) => (
            <Role key={r.id} r={r} first={i === 0} />
          ))}
        </ol>
      </section>

      <section className="wrap xp-else" aria-labelledby="else-t">
        <h2 id="else-t" className="hm-h2">
          Elsewhere
        </h2>
        <dl>
          {ELSEWHERE.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wp-end wrap" aria-label="Next">
        <div>
          <h2 className="wp-end-title">Want the full picture?</h2>
          <p className="wp-end-text">The CV has the details, and the work shows what it looks like in practice.</p>
        </div>
        <div className="wp-end-cta">
          <a href={SOCIALS.cv} className="btn btn--line" target="_blank" rel="noopener noreferrer">
            Download CV <Arrow dir="down" />
          </a>
          <Link to="/work" className="btn btn--solid">
            See the work <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}
