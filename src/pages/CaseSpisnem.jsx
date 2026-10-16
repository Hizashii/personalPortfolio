import { useState } from 'react'
import { Flow, SPIS_FLOW } from '../components/drawings'
import { Annotation, CaseHeader, CaseNext, CaseSections, DetailList, Panel } from '../components/case'
import { Arrow } from '../components/ui'
import SpisnemDemo from '../components/SpisnemDemo'
import { PROJECTS, SCREENSHOTS } from '../data'
import { useDocumentTitle, useFlowLayout } from '../hooks'

const P = PROJECTS.spisnem

const LEDE =
  'A phone-first web app that lets guests see live wait times on a map and join a restaurant queue from where they stand, with a calm dashboard for the restaurant to call parties in.'

const FACTS = [
  ['Problem', 'Guests wait at the door without knowing for how long'],
  ['Surfaces', 'Guest phone app, restaurant dashboard'],
  ['Status', 'Ongoing, in beta'],
  [
    'Live',
    <a key="beta" href={P.url} className="link" target="_blank" rel="noopener noreferrer">
      Try the beta <Arrow dir="ne" />
    </a>,
  ],
]

/* Header ------------------------------------------------------------------ */

const PHONE = 'block h-auto rounded-[1.5rem] border-[6px] border-ai bg-ai'

function HeroPhones() {
  return (
    <figure className="relative isolate">
      <span className="cut absolute top-8 right-0 -z-10 h-3/4 w-3/4 bg-fuji" aria-hidden="true" />
      <div className="flex items-start justify-center gap-5 sm:gap-8">
        <img {...SCREENSHOTS.spisnemDiscover} fetchPriority="high" className={`${PHONE} w-[48%] max-w-52`} />
        <img {...SCREENSHOTS.spisnemQueue} className={`${PHONE} mt-16 w-[42%] max-w-44`} />
      </div>
      <figcaption className="mt-6">
        <Annotation>Restaurants and names shown are demo data.</Annotation>
      </figcaption>
    </figure>
  )
}

/* Guest journey ----------------------------------------------------------- */

// Each step names the screen the phone shows and where the ring points.
const STEPS = [
  { title: 'Find a place nearby', text: 'A map of restaurants close to where you are, each with its live wait time. No calling, no guessing.', screen: 'discover', ring: { x: 63, y: 29, label: 'Live wait on the map' } },
  { title: 'Join from where you stand', text: 'One tap puts you in the queue. You do not need to be at the door, only close enough to come back when it is your turn.', screen: 'discover', ring: { x: 50, y: 90, label: 'Join queue' } },
  { title: 'Wait with an honest number', text: 'Your place in the line and a realistic time, so you can go for a walk instead of standing outside.', screen: 'queue', ring: { x: 50, y: 31, label: 'Your place in line' } },
  { title: 'Get pinged when it is your turn', text: 'The restaurant calls you in from the dashboard, and you are notified. That is the whole loop.', screen: 'queue', ring: { x: 50, y: 84, label: 'Notified' } },
]
const SCREENS = { discover: SCREENSHOTS.spisnemDiscover, queue: SCREENSHOTS.spisnemQueue }

function JourneyPhone({ step }) {
  return (
    <figure className="mx-auto w-52 shrink-0">
      <div className="relative aspect-[312/640] overflow-hidden rounded-[1.75rem] border-[6px] border-ai bg-ai">
        {Object.entries(SCREENS).map(([key, shot]) => (
          <img
            key={key}
            {...shot}
            alt={key === step.screen ? shot.alt : ''}
            className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-300 ${key === step.screen ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <span
          className="absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ai bg-fuji/35 transition-[left,top] duration-500 ease-cut"
          style={{ left: `${step.ring.x}%`, top: `${step.ring.y}%` }}
          aria-hidden="true"
        />
      </div>
      <figcaption className="mt-3 text-center text-meta font-medium text-ai-muted">{step.ring.label}</figcaption>
    </figure>
  )
}

function StepButton({ step, n, active, onSelect }) {
  return (
    <li className="border-t border-ai/15">
      <button type="button" aria-pressed={active} onClick={onSelect} className="slab flex w-full items-baseline gap-3 py-4 text-left">
        <span className={`cut shrink-0 px-2 text-meta font-semibold tabular-nums ${active ? 'bg-ai text-gofun' : 'text-ai-muted'}`}>0{n}</span>
        <span>
          <span className="block font-semibold">{step.title}</span>
          {active && <span className="mt-1 block text-small text-ai-muted">{step.text}</span>}
        </span>
      </button>
    </li>
  )
}

function GuestJourney() {
  const [active, setActive] = useState(0)
  return (
    <Panel className="grid items-start gap-8 sm:grid-cols-[auto_1fr]">
      <JourneyPhone step={STEPS[active]} />
      <ol className="border-b border-ai/15" aria-label="Guest journey" aria-live="polite">
        {STEPS.map((step, i) => (
          <StepButton key={step.title} step={step} n={i + 1} active={active === i} onSelect={() => setActive(i)} />
        ))}
      </ol>
    </Panel>
  )
}

/* Restaurant side --------------------------------------------------------- */

// Positions are percentages of the screenshot, placed in empty space beside what they mark.
const PINS = [
  { x: 36, y: 30, title: 'Live numbers', text: 'Who is waiting, the average quote and how many were seated today.' },
  { x: 66, y: 50, title: 'Honest waits', text: 'Time waited against the time quoted, for every party in the list.' },
  { x: 79, y: 57, title: 'Notified, then seated', text: 'Guests are pinged when the table is ready. Seating them is one tap.' },
  { x: 86, y: 66, title: 'Call in', text: 'The next party is called in from the list with one tap.' },
]

function PinnedShot({ active }) {
  return (
    <div className="relative">
      <img {...SCREENSHOTS.spisnemDashboard} loading="lazy" className="block h-auto w-full border border-ai/15" />
      {PINS.map((pin, i) => (
        <span
          key={pin.title}
          aria-hidden="true"
          className={`absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full text-meta font-semibold transition-colors ${active === i ? 'bg-fuji text-ai ring-2 ring-ai' : 'bg-ai text-gofun'}`}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          {i + 1}
        </span>
      ))}
    </div>
  )
}

function HostDashboard() {
  const [active, setActive] = useState(0)
  return (
    <div className="grid gap-6">
      <PinnedShot active={active} />
      <ol className="grid gap-2 sm:grid-cols-2" aria-label="What the dashboard shows">
        {PINS.map((pin, i) => (
          <li key={pin.title}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`flex h-full w-full gap-3 border p-4 text-left transition-colors ${active === i ? 'border-ai bg-fuji/25' : 'border-ai/15 hover:border-ai/50'}`}
            >
              <span className="text-meta font-semibold tabular-nums">{i + 1}</span>
              <span>
                <b className="block font-semibold">{pin.title}</b>
                <span className="text-small text-ai-muted">{pin.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* Decisions --------------------------------------------------------------- */

const DECISIONS = [
  ['Phone first', 'Guests are standing somewhere with a phone in their hand. The guest side is designed for that moment, not squeezed down from a desktop page.'],
  ['Honest numbers', 'A wait time is only useful if it is believable. Position and minutes are shown plainly, and the restaurant sees waited against quoted.'],
  ['A calm dashboard', 'Staff are busy. The dashboard shows one list, one next action per row and nothing else competing for attention.'],
]

function Decisions() {
  const layout = useFlowLayout()
  return (
    <div className="grid gap-6">
      <Panel title="Decisions">
        <DetailList items={DECISIONS} />
      </Panel>
      <Panel>
        <Flow
          spec={SPIS_FLOW[layout]}
          label="Guests join the queue from a phone, the restaurant calls them in from a dashboard, and guests are notified"
        />
      </Panel>
    </div>
  )
}

/* Sections ---------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'try',
    label: 'Try it',
    title: 'Be the guest. Then be the host.',
    Visual: SpisnemDemo,
    body: ['Both sides of the queue, working together in the page. Join on the phone, then call yourself in from the dashboard.'],
  },
  {
    id: 'journey',
    label: 'The guest side',
    title: 'Four moments, one phone.',
    Visual: GuestJourney,
    body: ['The guest side is built for one situation: standing somewhere with a phone in hand, deciding where to eat. Tap a step to see that moment on the screen.'],
  },
  {
    id: 'host',
    label: 'The restaurant side',
    title: 'One list, one next action.',
    Visual: HostDashboard,
    note: 'Demo data.',
    body: ['The restaurant runs the same queue from a dashboard on a tablet or laptop. Each row has exactly one thing to do next.'],
  },
  {
    id: 'decisions',
    label: 'Product decisions',
    title: 'Why it works the way it does.',
    Visual: Decisions,
    note: 'Two interfaces, one shared queue.',
    body: ['Each choice comes from where the people using it are standing: a guest outside with a phone, and staff in the middle of a service.'],
  },
]

export default function CaseSpisnem() {
  useDocumentTitle('Spisnem')
  return (
    <main>
      <CaseHeader project={P} lede={LEDE} facts={FACTS} art={<HeroPhones />} />
      <CaseSections sections={SECTIONS} />
      <CaseNext from="spisnem" />
    </main>
  )
}
