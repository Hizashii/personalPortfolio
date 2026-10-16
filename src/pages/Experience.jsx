import { useId, useState } from 'react'
import { Arrow, Marker, PageHeader } from '../components/ui'
import { DetailList } from '../components/case'
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
  ['Languages', 'English, Japanese, and Danish (learning)'],
]

function Arc() {
  return (
    <section className="wrap" aria-labelledby="arc-title">
      <Marker n="01">
        <span id="arc-title">Career arc</span>
      </Marker>
      <ol className="mt-8 grid gap-8 md:grid-cols-3">
        {ARC.map(([stage, who, text], i) => (
          <li key={stage} className="border-t-2 border-ai pt-5">
            <p className="text-meta font-semibold tabular-nums text-ai-muted">0{i + 1}</p>
            <h2 className="mt-3 text-h3 font-semibold">{stage}</h2>
            <p className="font-medium">{who}</p>
            <p className="mt-2 text-ai-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function MoreToggle({ items }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="mt-5">
      <button
        type="button"
        className="link min-h-11"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Less' : 'What this involved'}
        <Arrow dir={open ? 'up' : 'down'} />
      </button>
      <ul id={id} hidden={!open} className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-baseline gap-3 text-ai-muted">
            <span className="cut inline-block h-2 w-3 shrink-0 bg-fuji" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Role({ role, current }) {
  return (
    <li className="grid gap-4 border-t border-ai/20 py-10 lg:grid-cols-12 lg:gap-x-10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-meta lg:col-span-3 lg:block">
        <span className={`cut inline-block px-2.5 py-0.5 font-semibold ${current ? 'bg-fuji' : 'bg-ai/10'}`}>
          {STAGE[role.id]}
        </span>
        <p className="text-ai-muted tabular-nums lg:mt-3">{role.when}</p>
      </div>
      <div className="max-w-measure lg:col-span-9 lg:max-w-none">
        <h2 className="text-h3 font-semibold">{role.role}</h2>
        <p className="font-medium">{role.org}</p>
        <p className="mt-4 max-w-measure">{role.scope}</p>
        <p className="mt-4 max-w-measure border-l-2 border-fuji pl-4 font-medium">{role.highlight}</p>
        {role.more && <MoreToggle items={role.more} />}
      </div>
    </li>
  )
}

function Roles() {
  return (
    <section className="wrap pt-section" aria-labelledby="roles-title">
      <Marker n="02">
        <span id="roles-title">Roles, most recent first</span>
      </Marker>
      <ol className="mt-6 border-b border-ai/20">
        {EXPERIENCE.map((role, i) => (
          <Role key={role.id} role={role} current={i === 0} />
        ))}
      </ol>
    </section>
  )
}

function Elsewhere() {
  return (
    <section className="wrap pt-section" aria-labelledby="else-title">
      <Marker n="03">
        <span id="else-title">Elsewhere</span>
      </Marker>
      <div className="mt-6 max-w-3xl">
        <DetailList items={ELSEWHERE} />
      </div>
    </section>
  )
}

function NextSteps() {
  return (
    <section className="wrap pt-section" aria-labelledby="next-title">
      <div className="grid gap-8 border-y border-ai/20 py-12 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
        <div>
          <h2 id="next-title" className="text-h3 font-semibold">
            Want the full picture?
          </h2>
          <p className="mt-2 text-ai-muted">The CV has the details, and the work shows what it looks like in practice.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href={SOCIALS.cv} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
            Download CV <Arrow dir="down" />
          </a>
          <Link to="/work" className="btn btn-primary">
            See the work <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Experience() {
  return (
    <main>
      <PageHeader
        eyebrow="Experience"
        title={
          <>
            Four years, one direction.
            <span className="block text-ai-muted">From diagnosing systems to building them.</span>
          </>
        }
      >
        I started in support, learning how systems break. Then I moved into building them, and the scope has been
        widening ever since.
      </PageHeader>
      <Arc />
      <Roles />
      <Elsewhere />
      <NextSteps />
    </main>
  )
}
