import { ContactRow } from '../components/ui'
import { ABOUT, ABOUT_META, SOCIALS } from '../data'

const PageShell = ({ children }) => (
  <main>
    <div className="wrap page-top">{children}</div>
  </main>
)

export function AboutPage() {
  return (
    <PageShell>
      <section id="about" className="about" aria-labelledby="about-title">
          <header className="sec-head">
            <h2 id="about-title" className="h-sec">
              About
            </h2>
          </header>
          <ol className="about-flow">
            {ABOUT.map(([lead, body]) => (
              <li key={lead}>
                <h3 className="about-lead">{lead}</h3>
                <p className="about-body">{body}</p>
              </li>
            ))}
          </ol>
          <p className="meta about-meta">{ABOUT_META}</p>
        </section>
      <section id="contact" className="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="h-sec">
            Say hello
          </h2>
          <p className="lede">
            If you are building something and want an engineer who looks at the whole of it, write.
          </p>
          <ul className="contact-list">
            <ContactRow label="Email" href={`mailto:${SOCIALS.email}`}>
              {SOCIALS.email}
            </ContactRow>
            <ContactRow label="LinkedIn" href={SOCIALS.linkedin} external>
              lachezar-dimchov
            </ContactRow>
            <ContactRow label="GitHub" href={SOCIALS.github} external>
              Hizashii
            </ContactRow>
            <ContactRow label="CV" href={SOCIALS.cv} external>
              Download PDF
            </ContactRow>
          </ul>
        </section>
    </PageShell>
  )
}
