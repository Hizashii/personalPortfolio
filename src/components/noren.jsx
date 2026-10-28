import { Link } from '../router'
import { SOCIALS } from '../data'
import Roof from './roof'
import Courtyard from './courtyard'

/* ===========================================================================
   THE NOREN HERO

   A temple roof with shop curtains hanging from its eave. The roof is the one
   piece of real 3D on the site; the banners below are live DOM, so their text
   is real text a recruiter can select, a screen reader can read and a search
   engine can index, and so they can sway independently of the roof.
   =========================================================================== */

const NAV = [
  { label: 'Work', to: '/work' },
  { label: 'Lab', to: '/lab' },
  { label: 'About', to: '/about' },
  { label: 'CV', to: '/cv' },
]

const DISCIPLINES = ['Web', 'Mobile', 'Backend', 'Databases', 'Cloud', 'UI/UX', '+ More']

export default function Noren() {
  return (
    <header className="jp-hero">
      <Courtyard />
      <nav className="jp-bar" aria-label="Main">
        <Link to="/" className="jp-mark" aria-label="Lachezar Dimchov, home">
          LD<i>:</i>
        </Link>

        <div className="jp-nav">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
          <a href={`mailto:${SOCIALS.email}`}>Contact</a>
        </div>

        <span className="jp-place">Copenhagen, DK</span>
      </nav>

      <Roof />
      <div className="jp-support-beam" aria-hidden="true"><i /><i /></div>

      {/* The five curtains. Each is a real element with real words on it. */}
      <div className="jp-norens">
        <div className="jp-noren" style={{ '--n': 0 }}>
          <h1 className="jp-noren-text">Lachezar</h1>
          <span className="jp-noren-num">01</span>
        </div>

        <div className="jp-noren" style={{ '--n': 1 }}>
          <p className="jp-noren-text">Dimchov</p>
          <span className="jp-dot" aria-hidden="true" />
        </div>

        <div className="jp-noren jp-noren--accent" style={{ '--n': 2 }}>
          <span className="jp-noren-pair">
            <p className="jp-noren-text">Full-stack</p>
            <p className="jp-noren-sub">Developer</p>
          </span>
          <span className="jp-noren-num">02</span>
        </div>

        <div className="jp-noren jp-noren--extra" style={{ '--n': 3 }}>
          <p className="jp-noren-list" style={{ textAlign: 'center' }}>
            I build useful software and thoughtful experiences.
          </p>
          <span className="jp-noren-num">03</span>
        </div>

        <div className="jp-noren jp-noren--extra" style={{ '--n': 4 }}>
          <ul className="jp-noren-list">
            {DISCIPLINES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <span className="jp-noren-num">04</span>
        </div>
      </div>

      <p className="jp-rail jp-rail--l">
        Software
        <br />
        Interfaces
        <br />
        Experiences
        <br />
        Ideas
      </p>

      <div className="jp-rail jp-rail--r">
        [ 01 ]
        <br />
        Scroll
        <br />
        to explore
        <div className="jp-scroll-line" aria-hidden="true" />
      </div>

      <div className="jp-hero-foot">
        <a className="jp-cta" href="#work">
          <span className="jp-cta-label">View work</span>
          <span className="jp-cta-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 8h9M8.5 4l4 4-4 4" />
            </svg>
          </span>
        </a>

        <span className="jp-tagline">Let&rsquo;s build something great.</span>
      </div>
    </header>
  )
}
