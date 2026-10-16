import { useState } from 'react'
import { Arrow, Marker } from '../components/ui'
import { Link } from '../router'
import { ABOUT, SOCIALS } from '../data'

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

// Hello in the languages I actually use. Levels are shown honestly.
const HELLOS = [
  { word: 'Hello', lang: 'en', name: 'English' },
  { word: 'こんにちは', lang: 'ja', name: 'Japanese' },
  { word: 'Hej', lang: 'da', name: 'Danish', level: 'still learning' },
]

const CURIOUS = [
  ['Infrastructure', 'Terraform and Ansible on Applyer got me hooked on everything that happens after localhost.'],
  ['Failure modes', 'Support taught me to start from what breaks. Now I design for the failure first.'],
  ['Local AI', 'Training local models to do the job a cloud model does today, behind the same interface.'],
  ['Security', 'Agents that handle personal data locally, with one controlled gateway to the outside.'],
  ['Automation', 'If I do something twice, I start asking whether a machine should do it instead.'],
  ['Other places', 'English, Japanese and a little Danish. Learning how other places think is half the fun.'],
]

const NOW = [
  ['Working', 'Full-stack engineer at Weblager'],
  ['Building', 'Applyer with a team, and SPECTRE'],
  ['Tinkering', 'An offline agent network and local models'],
  ['Studying', 'PBA in Web Development, until 2027'],
]

function Greeting() {
  const [index, setIndex] = useState(0)
  const hello = HELLOS[index]
  const next = () => setIndex((i) => (i + 1) % HELLOS.length)
  return (
    <figure className="relative isolate">
      <span className="cut absolute -top-3 -right-3 -z-10 h-2/3 w-1/2 bg-fuji sm:-top-5 sm:-right-5" aria-hidden="true" />
      <div className="surface-dark grid min-h-72 content-between gap-10 p-6 sm:p-10">
        <p lang={hello.lang} className="text-h1 font-semibold" aria-live="polite">
          {hello.word}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-meta text-gofun/75">
            {hello.name}
            {hello.level && ` · ${hello.level}`}
          </p>
          <button type="button" className="btn btn-secondary min-h-11 px-4 py-2" onClick={next}>
            Say it another way
          </button>
        </div>
      </div>
    </figure>
  )
}

function Intro() {
  return (
    <header className="wrap grid gap-12 pt-12 pb-section md:pt-20 lg:grid-cols-12 lg:gap-x-10 lg:pt-28">
      <div className="lg:col-span-7">
        <p className="text-meta font-medium text-ai-muted">About</p>
        <h1 className="mt-5 text-h1 font-semibold">
          Hi, I&rsquo;m <span className="text-ai-muted">Lachezar.</span>
        </h1>
        <p className="mt-6 max-w-measure text-lede">
          A software engineer who codes most days, mostly because there is always something else I want to understand.
        </p>
        <p className="mt-4 max-w-measure text-ai-muted">
          I live in Esbjerg, Denmark, I like meeting people, and I would rather be building something than talking
          about building something.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href={`mailto:${SOCIALS.email}`} className="btn btn-primary">
            Say hello <Arrow />
          </a>
          <Link to="/work" className="link">
            See what I build <Arrow />
          </Link>
        </div>
      </div>
      <div className="lg:col-span-5 lg:self-end">
        <Greeting />
      </div>
    </header>
  )
}

function Story() {
  return (
    <section id="story" className="wrap" aria-labelledby="story-title">
      <Marker n="01">
        <span id="story-title">How I got here</span>
      </Marker>
      <ol className="mt-8 grid gap-x-10 md:grid-cols-2">
        {ABOUT.map(([lead, body], i) => (
          <li key={lead} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-ai/20 py-8">
            <span className="pt-1 text-meta font-semibold tabular-nums text-ai-muted">0{i + 1}</span>
            <div>
              <h2 className="text-h3 font-semibold">{lead}</h2>
              <p className="mt-3 text-ai-muted">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Curious() {
  return (
    <section className="wrap pt-section" aria-labelledby="curious-title">
      <Marker n="02">
        <span id="curious-title">What I keep coming back to</span>
      </Marker>
      <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {CURIOUS.map(([title, text]) => (
          <li key={title} className="border-t-2 border-ai pt-4">
            <h2 className="flex items-center gap-3 font-semibold">
              <span className="cut inline-block h-2 w-3 shrink-0 bg-fuji" aria-hidden="true" />
              {title}
            </h2>
            <p className="mt-2 text-ai-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RightNow() {
  return (
    <section className="wrap pt-section" aria-labelledby="now-title">
      <Marker n="03">
        <span id="now-title">Right now</span>
      </Marker>
      <dl className="mt-8 grid max-w-3xl">
        {NOW.map(([term, detail]) => (
          <div key={term} className="grid gap-1 border-t border-ai/20 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <dt className="text-meta font-medium text-ai-muted">{term}</dt>
            <dd className="font-medium">{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Contact() {
  return (
    <section className="wrap pt-section" aria-labelledby="about-contact-title">
      <Marker n="04">Contact</Marker>
      <h2 id="about-contact-title" className="mt-6 text-h1 font-semibold">
        Come say hello.
      </h2>
      <p className="mt-6 max-w-measure text-lede">
        If you are building something and want an engineer who looks at the whole of it, write. A hello is welcome too.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a href={`mailto:${SOCIALS.email}`} className="btn btn-primary">
          Email me <Arrow />
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
        <Link to="/experience" className="link">
          Experience
        </Link>
      </p>
    </section>
  )
}

export default function About() {
  return (
    <main>
      <Intro />
      <Story />
      <Curious />
      <RightNow />
      <Contact />
    </main>
  )
}
