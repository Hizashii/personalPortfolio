import { useState } from 'react'
import { Flow, PIPELINE } from '../components/drawings'
import { Arrow, Marker, PageHeader } from '../components/ui'
import { AttackGraph } from '../components/spectre'
import { Link } from '../router'
import { TICKER } from '../data'
import { useFlowLayout, useReducedMotion } from '../hooks'

const PRINCIPLES = [
  { focus: ['classify'], title: 'Classify', text: 'Understand what failed before reacting.' },
  { focus: ['retry'], title: 'Recover', text: 'Retry transient failures deliberately, with backoff.' },
  { focus: ['manual', 'park'], title: 'Hand off', text: 'When automation is uncertain, a person decides.' },
]

const AGENT_Y = [34, 66, 98, 130]
const OUT_PATH = 'M180 82H255'

/* Experiments ------------------------------------------------------------- */

// Negative begin offsets start each packet mid-path, so none waits at the SVG origin.
function Packet({ path, begin, dur = '2.6s' }) {
  return (
    <circle r="2.8" className="fill-ai">
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} />
    </circle>
  )
}

function Outside({ open, calm }) {
  if (!open) {
    return (
      <>
        <path d="M180 82H256" className="fill-none stroke-ai/25" strokeDasharray="4 4" />
        <circle cx="262" cy="82" r="17" className="fill-none stroke-ai/25" />
        <path d="M158 72l-8 20M150 72l8 20" className="stroke-alert" strokeWidth="2.2" strokeLinecap="round" />
      </>
    )
  }
  return (
    <>
      <path d="M180 82H256" className="fill-none stroke-ai" strokeWidth="1.5" />
      <circle cx="262" cy="82" r="17" className="fill-none stroke-ai" strokeWidth="1.5" />
      {!calm && <Packet path={OUT_PATH} begin="-0.4s" dur="1.6s" />}
    </>
  )
}

// Four agents, one controlled gateway. The whole diagram is the switch.
function AgentNet({ calm }) {
  const [open, setOpen] = useState(true)
  const paths = AGENT_Y.map((y) => `M26 ${y} C 90 ${y}, 110 82, 168 82`)
  return (
    <button type="button" role="switch" aria-checked={open} onClick={() => setOpen((v) => !v)} className="block w-full text-left">
      <span className="sr-only">Controlled gateway between the agents and the outside</span>
      <svg viewBox="0 0 300 170" fill="none" aria-hidden="true" className="w-full">
        {paths.map((d, i) => (
          <g key={d}>
            <path d={d} className="stroke-ai/35" strokeWidth="1.25" />
            <circle cx="26" cy={AGENT_Y[i]} r="4.5" className="fill-ai" />
            {!calm && <Packet path={d} begin={`-${i * 0.55}s`} />}
          </g>
        ))}
        <line x1="172" y1="6" x2="172" y2="164" className="stroke-ai" strokeDasharray="3 4" />
        <rect x="165" y="64" width="14" height="36" className={open ? 'fill-fuji stroke-ai' : 'fill-ai stroke-ai'} />
        <Outside open={open} calm={calm} />
      </svg>
      <span className="mt-3 flex justify-between text-meta text-ai-muted" aria-hidden="true">
        <span>Agents</span>
        <span className="font-semibold text-ai">Gateway {open ? 'open' : 'closed: nothing leaves'}</span>
      </span>
    </button>
  )
}

// The attack path, and the one change that breaks it.
function SpectreToggle() {
  const [cut, setCut] = useState(false)
  return (
    <button
      type="button"
      aria-pressed={cut}
      onClick={() => setCut((v) => !v)}
      className="surface-dark block w-full p-4 text-left"
      aria-label={cut ? 'Attack path broken: the CI deployer can no longer assume the app runtime. Tap to restore.' : 'Attack path from a developer to the customer database. Tap to break the chain.'}
    >
      <span className="block aspect-[520/300]">
        <AttackGraph compact removed={cut ? 'assume-runtime' : null} />
      </span>
      <span className="mt-2 block text-meta font-semibold text-fuji" aria-hidden="true">
        {cut ? '0 findings' : '2 findings'}
      </span>
    </button>
  )
}

// A model picker that swaps what is behind it without changing the interface.
function ModelSwitch() {
  const [local, setLocal] = useState(false)
  return (
    <button type="button" role="switch" aria-checked={local} onClick={() => setLocal((v) => !v)} className="slab block w-full p-1 text-left">
      <span className="sr-only">Swap the model behind the interface</span>
      <span className="flex min-h-14 items-center justify-between gap-4 border border-ai px-4" aria-hidden="true">
        <span className="font-semibold">{local ? 'Local model' : 'Gemini 2.5 Flash'}</span>
        <Arrow dir="down" />
      </span>
      <span className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-small" aria-hidden="true">
        <span className="text-ai-muted">Interface</span>
        <span>One AI client, unchanged</span>
        <span className="text-ai-muted">Behind it</span>
        <span className="font-semibold">{local ? 'A local model' : 'The cloud model'}</span>
      </span>
    </button>
  )
}

function Experiment({ n, status, title, text, hint, children }) {
  return (
    <li className="flex flex-col border-t-2 border-ai pt-4">
      <p className="flex items-center justify-between text-meta">
        <span className="font-semibold tabular-nums text-ai-muted">0{n}</span>
        <span className="cut bg-ai/10 px-2.5 py-0.5 font-semibold">{status}</span>
      </p>
      <div className="mt-6 border border-ai/15 p-4">{children}</div>
      <h3 className="mt-6 text-h3 font-semibold">{title}</h3>
      <p className="mt-2 text-ai-muted">{text}</p>
      <p className="mt-auto pt-4 text-meta text-ai-muted">{hint}</p>
    </li>
  )
}

function Experiments({ calm }) {
  return (
    <ol className="mt-8 grid gap-14 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
      <Experiment n={1} status="In progress" title="Offline agent network" hint="Tap the diagram to open or close the gateway." text="Agents process personal data locally. Network access passes through one controlled gateway.">
        <AgentNet calm={calm} />
      </Experiment>
      <Experiment n={2} status="Early" hint="Tap the graph to break the chain." text="Finds how cloud permissions chain into a breach, and tests the fix first." title={<Link to="/spectre" className="link">SPECTRE <Arrow /></Link>}>
        <SpectreToggle />
      </Experiment>
      <Experiment n={3} status="In progress" title="Local models" hint="Tap the picker to swap the model." text="Training local models to take over the job the cloud model does today, behind the same interface.">
        <ModelSwitch />
      </Experiment>
    </ol>
  )
}

function LabSection() {
  const calm = useReducedMotion()
  return (
    <section id="lab" className="wrap" aria-labelledby="lab-title">
      <Marker n="01">
        <span id="lab-title">Lab</span>
      </Marker>
      <Experiments calm={calm} />
    </section>
  )
}

// Ends the page on ivory, so the dark notes never sit straight against the dark footer.
function RightNow() {
  return (
    <section className="wrap pt-section" aria-labelledby="now-title">
      <div className="grid gap-4 border-y border-ai/20 py-8 md:grid-cols-[auto_1fr] md:gap-12">
        <h2 id="now-title" className="font-semibold">
          Right now
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-ai-muted">
          {TICKER.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="cut inline-block h-2 w-3 bg-fuji" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* Notes ------------------------------------------------------------------- */

function Principle({ principle, n, setFocus }) {
  const show = () => setFocus(principle.focus)
  const hide = () => setFocus([])
  return (
    <li
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className="flex gap-3 border-t border-gofun/20 py-5 transition-colors last:border-b hover:bg-gofun/5 focus-visible:bg-gofun/5"
    >
      <span className="w-10 shrink-0 pt-1 text-meta font-semibold text-fuji tabular-nums">0{n}</span>
      <div>
        <h3 className="text-h3 font-semibold">{principle.title}</h3>
        <p className="mt-1 text-gofun/80">{principle.text}</p>
      </div>
    </li>
  )
}

function NotesSection() {
  const layout = useFlowLayout()
  const [focus, setFocus] = useState([])
  return (
    <section id="notes" className="surface-dark mt-section py-section" aria-labelledby="notes-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <Marker n="02">Notes · How I think</Marker>
          <h2 id="notes-title" className="mt-6 text-h1 font-semibold">
            A failure is data, <span className="text-fuji">not an exception.</span>
          </h2>
          <p className="mt-6 max-w-measure text-lede text-gofun/85">
            Support taught me to start from what breaks. So I design for the failure first, and nothing fails silently.
          </p>
          <ol className="mt-10">
            {PRINCIPLES.map((principle, i) => (
              <Principle key={principle.title} principle={principle} n={i + 1} setFocus={setFocus} />
            ))}
          </ol>
        </div>
        <figure className="min-w-0 lg:col-span-7 lg:self-center">
          <Flow
            dark
            focus={focus}
            spec={PIPELINE.failure[layout]}
            label="Failure handling: a failed submission is classified, then retried, parked or sent to a person"
          />
          <figcaption className="mt-5 text-meta text-gofun/75">
            What Applyer does when an attempt fails. Hover or focus a principle to find it in the diagram.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export default function Lab() {
  return (
    <main>
      <PageHeader
        eyebrow="Lab and Notes"
        title={
          <>
            Lab
            <span className="block text-ai-muted">Experiments, not shipped products.</span>
          </>
        }
      >
        Where I try things before I know whether they will work. Some of these will turn into real products. Most
        won&rsquo;t. That&rsquo;s the point.
      </PageHeader>
      <LabSection />
      <NotesSection />
      <RightNow />
    </main>
  )
}
