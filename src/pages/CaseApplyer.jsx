import { useEffect } from 'react'
import '@fontsource-variable/newsreader/wght.css'
import '@fontsource/caveat/500.css'
import { Flow, LAB_BOUNDARY, MODEL_SEAM, PIPELINE, SectionDrawing } from '../components/drawings'
import { CaseNext, CaseSection, Eyebrow, HandNote } from '../components/case'
import { Link } from '../router'
import { ApplyerDemo } from '../components/demos'
import { useMedia } from '../hooks'

const FACTS = [
  ['My role', 'Founding engineer, team project'],
  ['Focus', 'Full-stack, AI automation, infrastructure'],
  ['Model today', 'Gemini 2.5 Flash (swappable)'],
  ['Infrastructure', 'Docker, Terraform, Ansible, Oracle Cloud VM'],
]

const PIPE = [
  ['Discover', 'find roles'],
  ['Match', 'score fit'],
  ['Prepare', 'tailor the material'],
  ['Submit', 'send it'],
  ['Track', 'record the status'],
]

const SCREENS = [
  {
    src: '/assets/applyer/applyer-landing.webp',
    w: 1323,
    h: 680,
    title: 'Landing',
    text: 'Search a job. With ease. The promise in one screen.',
    alt: 'Applyer landing page: search a job with ease, with a swipe card preview',
  },
  {
    src: '/assets/applyer/applyer-jobs.webp',
    w: 1546,
    h: 966,
    title: 'Job feed',
    text: 'Swipe through matched jobs. Next, save or apply.',
    alt: 'Applyer job feed: a job card with a match score and next, save and apply actions',
  },
  {
    src: '/assets/applyer/applyer-applications.webp',
    w: 1326,
    h: 1200,
    title: 'Applications',
    text: 'Every application and its status, at a glance.',
    alt: 'Applyer applications list with status filters',
  },
  {
    src: '/assets/applyer/applyer-process.webp',
    w: 1394,
    h: 1021,
    title: 'Application flow',
    text: 'Five steps, with your approval before anything is sent.',
    alt: 'Applyer application flow: five steps, with the CV step open',
  },
]

const SHIPS = [
  'Build and push the Docker image',
  'Deploy with Ansible',
  'Test, lint and build',
  'Container scan, dependency audit, secret scan and static analysis',
]

const GOING = [
  ['Running', 'The platform runs on Gemini 2.5 Flash, behind a model interface.'],
  ['In progress', 'An offline agent network in Docker, with an allow-listed gateway.'],
  ['Training', 'Local models take over the job from the cloud model.'],
]

function ArrowRight() {
  return (
    <svg className="ca-flow-arrow" viewBox="0 0 40 16" fill="none" aria-hidden="true">
      <path d="M1 8h36M30 2l7 6-7 6" />
    </svg>
  )
}

export default function CaseApplyer() {
  const narrow = useMedia('(max-width: 760px)')
  const m = narrow ? 'narrow' : 'wide'
  useEffect(() => {
    document.title = 'Applyer · Lachezar Dimchov'
    return () => {
      document.title = 'Lachezar Dimchov, Software Engineer'
    }
  }, [])

  return (
    <main className="ca ce">
      <header className="ca-top wrap">
        <div className="ca-top-copy">
          <Eyebrow>
            Project <i>/</i> Case study
          </Eyebrow>
          <h1 className="ca-h1" style={{ viewTransitionName: 'title-applyer' }}>
            Applyer
          </h1>
          <p className="ca-lede">
            An AI-assisted platform that handles job applications end to end, from finding relevant roles
            to preparing tailored material and submitting it for you.
          </p>
          <dl className="ca-facts">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="ca-top-art">
          <figure className="ca-browser">
            <div className="ca-browser-bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <img
              src="/assets/applyer/applyer-jobs.webp"
              alt="Applyer: a job card with a match score and apply actions"
              width="1546"
              height="966"
              fetchPriority="high"
            />
          </figure>
          <HandNote className="ca-top-note" arrow="down-left">
            less manual work.
            <br />
            more opportunities.
          </HandNote>
        </div>
      </header>

      <div className="wrap">
        <CaseSection
          id="try"
          n="00"
          label="Try it"
          title="Use it, here."
          aside={<ApplyerDemo />}
        >
          <p className="ce-p">
            A working replica of the core loop, running right here in the page. Swipe through matched
            jobs, apply to one and watch it prepare the application, then approve it.
          </p>
        </CaseSection>

        <CaseSection
          id="how"
          n="01"
          label="Product and system"
          title="How it works"
          aside={
            <>
              <div className="ca-how">
                <div className="ce-panel ca-box">
                  <h3>Inputs</h3>
                  <ul>
                    <li>Jobs from a private API</li>
                    <li>Your profile</li>
                    <li>Your CV</li>
                  </ul>
                </div>
                <ArrowRight />
                <div className="ce-panel ca-box ca-box--pipe">
                  <h3>Agent pipeline</h3>
                  <ol>
                    {PIPE.map(([t, s], i) => (
                      <li key={t}>
                        <span className="mono">{i + 1}</span>
                        <b>{t}</b>
                        <i>{s}</i>
                      </li>
                    ))}
                  </ol>
                </div>
                <ArrowRight />
                <div className="ce-panel ca-box">
                  <h3>Outputs</h3>
                  <ul>
                    <li>Tailored application</li>
                    <li>Your approval</li>
                    <li>Submission</li>
                    <li>Status tracking</li>
                  </ul>
                </div>
              </div>
              <HandNote className="ca-how-note" arrow="down-right">
                from job post to submitted
                <br />
                application.
              </HandNote>
            </>
          }
        >
          <p className="ce-p">
            Applyer finds relevant jobs, matches them to your profile, prepares tailored application
            material and submits it, with you approving before anything is sent.
          </p>
          <Link to="/applyer#screens" className="hm-link">
            See the screens
          </Link>
        </CaseSection>

        <CaseSection
          id="screens"
          n="02"
          label="Screens"
          title="Product screenshots"
          aside={
            <div className="ca-shots">
              {SCREENS.map((s) => (
                <figure key={s.title} className="ca-shot">
                  <span className="ca-shot-frame">
                    <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" />
                  </span>
                  <figcaption>
                    <b>{s.title}</b>
                    <span>{s.text}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          }
        >
          <p className="ce-p">A look at the key parts of the product, from job search to application tracking.</p>
        </CaseSection>

        <CaseSection
          id="failure"
          n="03"
          label="When it works, and when it does not"
          title="When it works, and when it does not"
          aside={
            <div className="ce-panel ca-diagram">
              <Flow
                spec={PIPELINE.failure[m]}
                label="Pipeline with failure handling: failed submissions are classified, retried, parked or sent to a person"
              />
            </div>
          }
        >
          <p className="ce-p">
            A failed submission is classified, then retried with backoff, parked when the form has changed,
            or handed to a person. Nothing fails silently.
          </p>
          <HandNote className="ca-side-note" arrow="down-right">
            every failure ends
            <br />
            somewhere on purpose.
          </HandNote>
        </CaseSection>

        <CaseSection
          id="architecture"
          n="04"
          label="What holds it up"
          title="System architecture"
          aside={
            <div className="ce-panel ca-diagram">
              <SectionDrawing narrow={narrow} className="drawing-static" roomy />
            </div>
          }
        >
          <p className="ce-p">
            Almost all of it is TypeScript. Supabase holds the application data, and DuckDB stores the jobs
            that arrive from a private API. It runs in Docker on an Oracle Cloud VM, set up with Terraform
            and Ansible.
          </p>
        </CaseSection>

        <CaseSection
          id="ships"
          n="05"
          label="How a change ships"
          title="How a change ships"
          aside={
            <figure className="ca-ci">
              <img
                src="/assets/applyer/applyer-checks.webp"
                alt="Seven passing checks: build and push Docker image, deploy via Ansible, test lint and build, container scan, dependency audit, secret scan, static analysis"
                width="631"
                height="330"
                loading="lazy"
              />
              <figcaption className="mono">The checks on a real push, all passing.</figcaption>
            </figure>
          }
        >
          <p className="ce-p">Shipping and security are part of the build. Every push runs the same path.</p>
          <ol className="ca-ships">
            {SHIPS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </CaseSection>

        <CaseSection
          id="model"
          n="06"
          label="Swapping the model"
          title="Swapping the model"
          aside={
            <div className="ce-panel ca-diagram">
              <Flow spec={MODEL_SEAM[m]} label="One model interface in front of Gemini 2.5 Flash and a local model" />
            </div>
          }
        >
          <p className="ce-p">
            Agents talk to one model interface, so the model behind it is configuration. Gemini 2.5 Flash
            runs today, and local models are being trained to plug into the same contract.
          </p>
          <HandNote className="ca-side-note" arrow="down-right">
            swap models without
            <br />
            rewriting the system.
          </HandNote>
        </CaseSection>

        <CaseSection
          id="network"
          n="07"
          label="Next: the offline agent network"
          title="Next: the offline agent network"
          aside={
            <div className="ce-panel ca-diagram">
              <Flow
                spec={LAB_BOUNDARY[m]}
                label="Agents and a local model run inside a Docker network with no direct internet, behind an allow-listed gateway"
              />
            </div>
          }
        >
          <p className="ce-p">
            Agents process personal data on infrastructure we run. Network access passes through one
            controlled gateway, so there is a single place to watch and limit what leaves.
          </p>
          <p className="ce-p ce-p--soft">Still being built, which is why it is drawn dashed.</p>
        </CaseSection>

        <CaseSection
          id="going"
          n="08"
          label="Where it is going"
          title="Where it is going"
          aside={
            <ol className="ca-going">
              {GOING.map(([s, t], i) => (
                <li key={s}>
                  <span className="mono">0{i + 1}</span>
                  <p>{t}</p>
                  <em className="mono">{s}</em>
                </li>
              ))}
            </ol>
          }
        >
          <p className="ce-p">Where the platform is, and what comes next.</p>
        </CaseSection>
      </div>

      <CaseNext from="applyer" />
    </main>
  )
}
