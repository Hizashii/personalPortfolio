import { Arrow, Marker, Tags } from '../components/ui'
import { AttackGraph } from '../components/demos'
import { Link } from '../router'
import { PROJECTS, SOCIALS } from '../data'

// `accent` places the fuji cut that sits behind each preview, so the three rows don't repeat.
const FEATURED = [
  {
    project: PROJECTS.applyer,
    summary: 'Automates job applications from matching to submission.',
    tags: ['Software', 'Automation', 'Infrastructure'],
    accent: '-right-3 -bottom-3 h-2/3 w-3/5 sm:-right-5 sm:-bottom-5',
  },
  {
    project: PROJECTS.spectre,
    summary: 'Traces how cloud permissions chain into a breach, then tests the fix.',
    tags: ['Security', 'Systems', 'Python'],
    accent: '-left-3 -top-3 h-1/2 w-2/5 sm:-left-5 sm:-top-5',
  },
  {
    project: PROJECTS.spisnem,
    summary: 'A restaurant queue guests can join before reaching the door.',
    tags: ['Product', 'Software', 'Mobile'],
    accent: '-right-3 -top-3 h-3/5 w-1/2 sm:-right-5 sm:-top-5',
    note: 'Restaurants and names shown are demo data.',
  },
]

const PRINCIPLES = [
  ['Understand the system', 'Good solutions fit the larger system, not only the immediate feature.'],
  ['Design for reality', 'Requirements change, services fail and users behave unexpectedly. I build with that in mind.'],
  ['Own the outcome', 'I take responsibility from the first implementation through to what actually happens in production.'],
]

const STAGES = [
  {
    label: 'Current',
    when: '2026 to present',
    role: 'Full-stack engineer',
    org: 'Weblager',
    text: 'Working on a large Angular and TypeScript application, solving complex production and domain problems.',
    tags: ['Angular', 'TypeScript', 'APIs'],
  },
  {
    label: 'Previous',
    when: '2024 to 2026',
    role: 'Full-stack developer',
    org: 'Visma Creditro',
    text: 'Full-stack work across Vue, Node.js and NestJS microservices, including caching and backend performance.',
    tags: ['Vue', 'Node.js', 'NestJS', 'Redis'],
  },
  {
    label: 'Foundation',
    when: '2022 to 2023',
    role: 'Support engineer',
    org: 'Microsoft 365 and Cisco',
    text: 'Enterprise troubleshooting for large organisations, including IBM and CERN. It taught me to read systems I did not build.',
    tags: ['Azure', 'PowerShell', 'SharePoint'],
  },
]

const EXPLORING = ['Local AI and agent systems', 'Infrastructure', 'Security and reliability', 'Systems tooling']

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

const projectPath = (project) => `/${project.slug}`

/* Hero ------------------------------------------------------------------ */

function HeroIntro() {
  return (
    <div className="lg:col-span-7">
      <p className="text-meta font-medium text-ai-muted">Software · Systems · Automation</p>
      <h1 className="mt-5 text-display font-semibold">
        <span className="reveal-line">
          <span>Lachezar</span>
        </span>
        <span className="reveal-line">
          <span>Dimchov</span>
        </span>
      </h1>
      <p className="mt-6 flex items-center gap-4 text-h3 font-medium">
        <span className="cut inline-block h-3 w-10 bg-fuji" aria-hidden="true" />
        Software engineer
      </p>
      <p className="mt-8 max-w-measure text-lede">
        I build full-stack products and keep getting deeper into the systems around them: backend, automation,
        infrastructure, reliability and security.
      </p>
      <p className="mt-4 max-w-measure text-ai-muted">
        I started by fixing other people’s systems. Now I build my own, and I am always curious about what happens
        after localhost.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link to="/work" className="btn btn-primary">
          View my work <Arrow />
        </Link>
        <Link to="/about" className="btn btn-secondary">
          About me
        </Link>
        <a href={SOCIALS.cv} className="link ml-2" {...EXTERNAL}>
          Download CV <Arrow dir="down" />
        </a>
      </div>
    </div>
  )
}

function ProjectIndexRow({ project, summary }) {
  return (
    <li className="border-t border-ai/20">
      <Link to={projectPath(project)} className="slab group -mx-3 flex items-baseline gap-3 px-3 py-5">
        <span className="w-10 shrink-0 text-meta font-semibold tabular-nums">{project.sheet}</span>
        <span className="flex-1">
          <span className="block text-h3 font-semibold">{project.name}</span>
          <span className="mt-1 block text-small text-ai-muted group-hover:text-ai">{summary}</span>
        </span>
        <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </li>
  )
}

// The three projects as an index: the quickest way in from the first screen.
function ProjectIndex() {
  return (
    <nav className="lg:col-span-5 lg:self-end" aria-label="Projects">
      <p className="text-meta font-medium text-ai-muted">Selected work</p>
      <ol className="mt-4 border-b border-ai/20">
        {FEATURED.map((item) => (
          <ProjectIndexRow key={item.project.slug} {...item} />
        ))}
      </ol>
      <dl className="mt-8 grid gap-1 text-small">
        <dt className="text-meta font-medium text-ai-muted">Currently</dt>
        <dd>Full-stack engineer at Weblager</dd>
        <dd>Building Applyer</dd>
        <dd>Exploring infrastructure, systems and local AI</dd>
      </dl>
    </nav>
  )
}

function Hero() {
  return (
    <section className="wrap grid gap-14 pt-12 pb-section md:pt-20 lg:grid-cols-12 lg:gap-x-10 lg:pt-28" aria-label="Introduction">
      <HeroIntro />
      <ProjectIndex />
    </section>
  )
}

/* Shared section header -------------------------------------------------- */

function SectionHeader({ n, label, id, link, children }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pb-10">
      <div>
        <Marker n={n}>{label}</Marker>
        <h2 id={id} className="mt-4 text-h1 font-semibold">
          {children}
        </h2>
      </div>
      <Link to={link.to} className="link">
        {link.label} <Arrow />
      </Link>
    </header>
  )
}

/* Selected work ---------------------------------------------------------- */

function ApplyerPreview() {
  return (
    <img
      src="/assets/applyer/applyer-jobs.webp"
      alt="Applyer: a job card with a match score and apply actions"
      width="1546"
      height="966"
      loading="lazy"
      className="block h-auto w-full border border-ai/15"
    />
  )
}

function SpectrePreview() {
  return (
    <div className="surface-dark aspect-preview p-6 sm:p-10">
      <AttackGraph label="SPECTRE: an attack path from a developer to the customer database" />
    </div>
  )
}

function SpisnemPreview() {
  const phone = 'w-1/3 rounded-3xl border-4 border-ai bg-ai'
  return (
    <div className="flex aspect-preview items-start justify-center gap-6 overflow-hidden bg-ai/5 pt-8 sm:gap-10 sm:pt-12">
      <img
        src="/assets/spisnem/spisnem-discover.webp"
        alt="SpisNem: a map of nearby restaurants with live wait times"
        width="312"
        height="640"
        loading="lazy"
        className={phone}
      />
      <img
        src="/assets/spisnem/spisnem-queue.webp"
        alt="SpisNem: a guest's place in the queue"
        width="256"
        height="500"
        loading="lazy"
        className={`${phone} translate-y-1/6`}
      />
    </div>
  )
}

const PREVIEWS = { applyer: ApplyerPreview, spectre: SpectrePreview, spisnem: SpisnemPreview }

function ProjectSummary({ project, summary, tags, note }) {
  return (
    <>
      <p className="text-numeral font-semibold text-fuji tabular-nums" aria-hidden="true">
        {project.sheet}
      </p>
      <h3 id={`featured-${project.slug}`} className="mt-4 text-h2 font-semibold">
        <Link to={projectPath(project)} className="hover:underline hover:decoration-fuji hover:decoration-2 hover:underline-offset-8">
          {project.name}
        </Link>
      </h3>
      <p className="mt-3 max-w-md text-lede">{summary}</p>
      <p className="mt-4 text-meta text-ai-muted">{project.status}</p>
      <div className="mt-5">
        <Tags items={tags} />
      </div>
      <Link to={projectPath(project)} className="btn btn-secondary mt-8">
        Read the case study <Arrow />
      </Link>
      {note && <p className="mt-4 text-meta text-ai-muted">{note}</p>}
    </>
  )
}

// Rows alternate sides on desktop; the preview duplicates the title link, so it stays out of the tab order.
function ProjectFeature({ item, flipped }) {
  const { project, accent } = item
  const Preview = PREVIEWS[project.slug]
  return (
    <article className="grid gap-8 border-t border-ai/20 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-x-10" aria-labelledby={`featured-${project.slug}`}>
      <div className={flipped ? 'lg:order-last lg:col-span-5 lg:col-start-8' : 'lg:col-span-5'}>
        <ProjectSummary {...item} />
      </div>
      <Link
        to={projectPath(project)}
        tabIndex={-1}
        aria-hidden="true"
        className={`group relative isolate block self-center lg:col-span-7 ${flipped ? 'lg:col-start-1' : ''}`}
      >
        <span className={`cut absolute -z-10 bg-fuji transition-transform duration-500 ease-cut group-hover:translate-x-1.5 ${accent}`} />
        <Preview />
      </Link>
    </article>
  )
}

function SelectedWork() {
  return (
    <section id="work" className="wrap pb-section" aria-labelledby="work-title">
      <SectionHeader n="01" label="Selected work" id="work-title" link={{ to: '/work', label: 'View all work' }}>
        A few things I have built.
      </SectionHeader>
      <div className="grid gap-20 md:gap-28">
        {FEATURED.map((item, i) => (
          <ProjectFeature key={item.project.slug} item={item} flipped={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}

/* How I think ------------------------------------------------------------ */

function PrincipleList() {
  return (
    <ol className="lg:col-span-5 lg:self-end">
      {PRINCIPLES.map(([title, text], i) => (
        <li key={title} className="flex gap-3 border-t border-gofun/20 py-6 last:border-b">
          <span className="w-10 shrink-0 pt-1 text-meta font-semibold text-fuji tabular-nums">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="text-h3 font-semibold">{title}</h3>
            <p className="mt-2 text-gofun/80">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Approach() {
  return (
    <section id="notes" className="surface-dark py-section" aria-labelledby="think-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <Marker n="02">How I think</Marker>
          <h2 id="think-title" className="mt-6 text-h1 font-semibold">
            A failure is data,
            <br />
            <span className="text-fuji">not an exception.</span>
          </h2>
          <p className="mt-8 max-w-measure text-lede text-gofun/85">
            I treat failures as information. They show where assumptions break, how systems behave in the real world,
            and what to improve next. That mindset shapes how I design, automate and operate software.
          </p>
        </div>
        <PrincipleList />
      </div>
    </section>
  )
}

/* Experience preview ----------------------------------------------------- */

function Stage({ stage, current }) {
  return (
    <li className="border-t-2 border-ai pt-5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta">
        <span className={`cut px-2.5 py-0.5 font-semibold ${current ? 'bg-fuji' : 'bg-ai/10'}`}>{stage.label}</span>
        <span className="text-ai-muted">{stage.when}</span>
      </p>
      <h3 className="mt-5 text-h3 font-semibold">{stage.role}</h3>
      <p className="font-medium">{stage.org}</p>
      <p className="mt-3 text-ai-muted">{stage.text}</p>
      <div className="mt-5">
        <Tags items={stage.tags} />
      </div>
    </li>
  )
}

function ExperiencePreview() {
  return (
    <section id="experience" className="wrap py-section" aria-labelledby="exp-title">
      <SectionHeader n="03" label="Experience" id="exp-title" link={{ to: '/experience', label: 'View full experience' }}>
        From diagnosing systems
        <br className="hidden sm:block" /> to building them.
      </SectionHeader>
      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {STAGES.map((stage, i) => (
          <Stage key={stage.org} stage={stage} current={i === 0} />
        ))}
      </ol>
    </section>
  )
}

/* Lab teaser and contact ------------------------------------------------- */

function Exploring() {
  return (
    <section id="lab" className="wrap" aria-labelledby="lab-title">
      <div className="grid gap-8 border-y border-ai/20 py-12 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12">
        <h2 id="lab-title" className="text-h3 font-semibold">
          Currently exploring
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-ai-muted">
          {EXPLORING.map((topic) => (
            <li key={topic} className="flex items-center gap-2">
              <span className="cut inline-block h-2 w-3 bg-fuji" aria-hidden="true" />
              {topic}
            </li>
          ))}
        </ul>
        <Link to="/lab" className="link">
          Visit Lab and Notes <Arrow />
        </Link>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="wrap pt-section" aria-labelledby="contact-title">
      <Marker n="04">Contact</Marker>
      <h2 id="contact-title" className="mt-6 max-w-3xl text-h1 font-semibold text-balance">
        Interested in working together?
      </h2>
      <p className="mt-6 max-w-measure text-lede">
        I am open to software engineering opportunities and conversations around systems, automation, infrastructure
        and technical solutions.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a href={`mailto:${SOCIALS.email}`} className="btn btn-primary">
          Say hello <Arrow />
        </a>
        <a href={SOCIALS.cv} className="btn btn-secondary" {...EXTERNAL}>
          Download CV <Arrow dir="down" />
        </a>
      </div>
      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        <a href={SOCIALS.linkedin} className="link" {...EXTERNAL}>
          LinkedIn
        </a>
        <a href={SOCIALS.github} className="link" {...EXTERNAL}>
          GitHub
        </a>
        <a href={`mailto:${SOCIALS.email}`} className="link break-all">
          {SOCIALS.email}
        </a>
      </p>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <SelectedWork />
      <Approach />
      <ExperiencePreview />
      <Exploring />
      <Contact />
    </main>
  )
}
