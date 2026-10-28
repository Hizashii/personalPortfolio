import Noren from '../components/noren'
import Bento from '../components/bento'
import { HAS_MODEL } from '../components/roof'
import { SOCIALS } from '../data'
import { Link } from '../router'

export default function Home() {
  return (
    <div className="jp">
      <Noren />
      <Bento />

      <section className="jp-section" style={{ paddingTop: 0 }}>
        <div className="jp-close">
          <div>
            <h2 className="jp-title">
              Open to work
              <br />
              in Copenhagen.
            </h2>
            <p className="jp-close-note">
              Full-stack roles, on site or hybrid, and freelance projects.
            </p>
          </div>
          <div className="jp-close-links">
            <a className="jp-cta" href={`mailto:${SOCIALS.email}`}>
              <span className="jp-cta-label">Write to me</span>
              <span className="jp-cta-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 8h9M8.5 4l4 4-4 4" />
                </svg>
              </span>
            </a>
            <ul className="jp-close-list">
              <li><a href={SOCIALS.cv} download>CV, PDF</a></li>
              <li><a href={SOCIALS.github} target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href={SOCIALS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
        </div>

        {HAS_MODEL ? (
          <p className="jp-credit">
            Roof model:{' '}
            <a href="https://sketchfab.com/3d-models/japan-roof-f56ec7e366434ea3bdb5a34dd2a8e255" target="_blank" rel="noreferrer">
              Japan Roof
            </a>{' '}
            by{' '}
            <a href="https://sketchfab.com/ugly_kid" target="_blank" rel="noreferrer">
              ugly kid
            </a>
            , licensed{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
              CC BY 4.0
            </a>
            .
          </p>
        ) : null}
      </section>
    </div>
  )
}
