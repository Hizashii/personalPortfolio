import { Arrow, Marker, PageHeader, Tags } from '../components/ui'
import { AttackGraph } from '../components/demos'
import { Link } from '../router'
import { PROJECTS, SCREENSHOTS } from '../data'

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

const FINDING_STEPS = ['Assume CI deployer', 'Assume app runtime', 'Read DB credentials', 'Customer DB']

const projectPath = (project) => `/${project.slug}`

/* Previews ---------------------------------------------------------------- */

// Shared layout: a main frame, a fuji cut behind it, and a smaller inset that breaks the frame's edge.
// The overlap is fixed so the inset only covers the frame's bottom margin, whatever the inset's height.
function Composition({ inset, insetSide, children }) {
  const align = insetSide === 'left' ? 'self-start md:-ml-6' : 'self-end md:-mr-6'
  return (
    <div className="relative isolate flex flex-col">
      <span className="cut absolute -top-3 -right-3 -z-10 h-2/3 w-1/2 bg-fuji sm:-top-5 sm:-right-5" aria-hidden="true" />
      {children}
      <div className={`relative -mt-10 sm:-mt-16 ${align}`}>{inset}</div>
    </div>
  )
}

function ApplyerPreview() {
  return (
    <Composition
      insetSide="left"
      inset={<img {...SCREENSHOTS.applyerApplications} loading="lazy" className="w-36 border-4 border-gofun sm:w-56" />}
    >
      <img {...SCREENSHOTS.applyerJobs} loading="lazy" className="block h-auto w-full border border-ai/15" />
    </Composition>
  )
}

function FindingPanel() {
  return (
    <div className="w-52 border border-ai/20 bg-gofun p-4 sm:w-64 sm:p-5">
      <p className="text-meta font-semibold">Finding 01 · Critical</p>
      <ol className="mt-3 grid gap-2 text-small">
        {FINDING_STEPS.map((step, i) => (
          <li key={step} className="flex items-baseline gap-3">
            <span className="w-4 shrink-0 text-meta font-semibold tabular-nums text-ai-muted">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function SpectrePreview() {
  return (
    <Composition insetSide="right" inset={<FindingPanel />}>
      <div className="surface-dark aspect-preview p-6 sm:p-10">
        <AttackGraph label="SPECTRE: an attack path from a developer to the customer database" />
      </div>
    </Composition>
  )
}

function SpisnemPreview() {
  const phone = 'w-20 rounded-2xl border-4 border-ai bg-ai sm:w-28'
  return (
    <Composition
      insetSide="right"
      inset={
        <div className="flex items-end gap-3">
          <img {...SCREENSHOTS.spisnemDiscover} loading="lazy" className={phone} />
          <img {...SCREENSHOTS.spisnemQueue} loading="lazy" className={phone} />
        </div>
      }
    >
      <img {...SCREENSHOTS.spisnemDashboard} loading="lazy" className="block h-auto w-full border border-ai/15" />
    </Composition>
  )
}

/* Project entries --------------------------------------------------------- */

const ENTRIES = [
  {
    project: PROJECTS.applyer,
    focus: 'Software · Automation · Infrastructure',
    status: 'Ongoing',
    description:
      'A full-stack platform that uses AI to handle job applications. It runs on Gemini 2.5 Flash today, and local models are being trained to take over.',
    points: ['Job matching with AI', 'Automatic form filling', 'Submission and tracking', 'Local models, in progress'],
    stack: ['TypeScript', 'Supabase', 'DuckDB', 'Docker', 'Terraform', 'Ansible', 'Gemini'],
    Preview: ApplyerPreview,
  },
  {
    project: PROJECTS.spectre,
    focus: 'Security · Systems · Software',
    status: 'Work in progress',
    description:
      'A cloud attack-path analysis tool. It shows how identities, roles, policies and credentials chain into access to sensitive data, traces every step to its evidence, and tests a fix on a copy before you trust it.',
    points: [
      'Attack paths with evidence for every step',
      'A deterministic policy engine',
      'Simulate a fix before applying it',
      'Flags fixes that break legitimate access',
    ],
    stack: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'SQLite', 'React', 'TypeScript', 'React Flow'],
    external: { href: PROJECTS.spectre.repo, label: 'Source on GitHub' },
    Preview: SpectrePreview,
  },
  {
    project: PROJECTS.spisnem,
    focus: 'Product · Software · Mobile',
    status: 'Ongoing, in beta',
    description:
      'A phone-first web app that lets guests see live wait times on a map and join a restaurant queue from where they stand, with a calm dashboard for the restaurant to call parties in.',
    points: [
      'Live wait times on a map',
      'Guest and restaurant interfaces',
      'Join the queue from where you stand',
      'A calm dashboard to call parties in',
    ],
    external: { href: PROJECTS.spisnem.url, label: 'Live project' },
    note: 'Restaurants and names shown are demo data.',
    Preview: SpisnemPreview,
  },
]

function EntryTitle({ project, focus, status }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t-2 border-ai pt-4">
        <Marker n={project.sheet}>{focus}</Marker>
        <p className="text-meta text-ai-muted">{status}</p>
      </div>
      <h2 id={`entry-${project.slug}`} className="mt-8 text-display font-semibold">
        <Link
          to={projectPath(project)}
          className="hover:underline hover:decoration-fuji hover:decoration-4 hover:underline-offset-8"
          style={{ viewTransitionName: `title-${project.slug}` }}
        >
          {project.name}
        </Link>
      </h2>
      <p className="mt-4 text-h3 font-medium text-ai-muted">{project.tagline}</p>
    </>
  )
}

function PointList({ points }) {
  return (
    <ul className="grid gap-2">
      {points.map((point) => (
        <li key={point} className="flex items-baseline gap-3">
          <span className="cut inline-block h-2 w-3 shrink-0 bg-fuji" aria-hidden="true" />
          {point}
        </li>
      ))}
    </ul>
  )
}

function EntryDetails({ project, description, points, stack, external, note }) {
  return (
    <div>
      <p className="max-w-measure text-lede">{description}</p>
      <h3 className="mt-8 text-meta font-medium text-ai-muted">What it does</h3>
      <div className="mt-3">
        <PointList points={points} />
      </div>
      {stack && (
        <>
          <h3 className="mt-8 text-meta font-medium text-ai-muted">Stack</h3>
          <div className="mt-3">
            <Tags items={stack} />
          </div>
        </>
      )}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Link to={projectPath(project)} className="btn btn-primary">
          View case study <Arrow />
        </Link>
        {external && (
          <a href={external.href} className="link" {...EXTERNAL}>
            {external.label} <Arrow dir="ne" />
          </a>
        )}
      </div>
      {note && <p className="mt-4 text-meta text-ai-muted">{note}</p>}
    </div>
  )
}

// Previews swap sides on the middle entry, so the page alternates without repeating a template.
function Entry({ entry, flipped }) {
  const { project, Preview } = entry
  return (
    <article aria-labelledby={`entry-${project.slug}`}>
      <EntryTitle {...entry} />
      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
        <div className="lg:col-span-5">
          <EntryDetails {...entry} />
        </div>
        <div className={`lg:col-span-7 ${flipped ? 'lg:order-first' : ''}`}>
          <Preview />
        </div>
      </div>
    </article>
  )
}

function DeeperStory() {
  return (
    <section className="wrap pt-section" aria-labelledby="deeper-title">
      <div className="grid gap-8 border-y border-ai/20 py-12 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
        <div>
          <h2 id="deeper-title" className="text-h3 font-semibold">
            Want the deeper story?
          </h2>
          <p className="mt-2 text-ai-muted">Each project has its own case study, and Lab and Notes shows how I think.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/lab" className="btn btn-secondary">
            Lab and Notes <Arrow />
          </Link>
          <Link to="/#contact" className="btn btn-primary">
            Say hello <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Work() {
  return (
    <main>
      <PageHeader
        eyebrow="Selected work"
        title={
          <>
            Real products.
            <span className="block text-ai-muted">Open one for the thinking behind it.</span>
          </>
        }
      >
        These are the main projects I have been building. Different problems, different constraints, but the same
        goal: software that works in the real world.
      </PageHeader>
      <div className="wrap grid gap-section">
        {ENTRIES.map((entry, i) => (
          <Entry key={entry.project.slug} entry={entry} flipped={i % 2 === 1} />
        ))}
      </div>
      <DeeperStory />
    </main>
  )
}
