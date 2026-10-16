import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon, Tags } from './ui'
import { prefersReducedMotion } from '../hooks'

// Applyer's core loop, replayed in the page: swipe jobs, apply, approve. Demo data, not real listings.
const JOBS = [
  { id: 1, title: 'Full-stack developer', co: 'Northwind Health', place: 'Copenhagen', match: 91, tags: ['TypeScript', 'React', 'Node.js'], text: 'Build tools clinicians use every day. You own features from the interface to the database.' },
  { id: 2, title: 'Backend engineer', co: 'Fjord Logistics', place: 'Aarhus', match: 84, tags: ['NestJS', 'PostgreSQL', 'Docker'], text: 'Services that track thousands of shipments. Reliability and good observability matter here.' },
  { id: 3, title: 'Frontend engineer', co: 'Lumen Studio', place: 'Remote (EU)', match: 78, tags: ['Angular', 'TypeScript', 'RxJS'], text: 'A large Angular application with complex search, permissions and forms.' },
  { id: 4, title: 'Platform engineer', co: 'Havn Cloud', place: 'Copenhagen', match: 72, tags: ['Terraform', 'Ansible', 'Linux'], text: 'Own the infrastructure code that keeps the product running, from provisioning to deploys.' },
  { id: 5, title: 'Software engineer', co: 'Tide Payments', place: 'Odense', match: 66, tags: ['Node.js', 'Redis', 'APIs'], text: 'Payment flows where correctness comes first. Plenty of edge cases to enjoy.' },
]
const STEPS = ['Analysing the role', 'Tailoring your CV', 'Writing the cover letter']
const ICON = {
  x: 'M6 6l12 12M18 6L6 18',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
}
const EXIT = { left: '-translate-x-8 opacity-0', right: 'translate-x-8 opacity-0', up: '-translate-y-6 opacity-0' }
const STEP_MARK = {
  done: 'w-2.5 bg-ai',
  now: 'cut w-4 bg-fuji motion-safe:animate-pulse',
  wait: 'w-2.5 border border-ai/40',
}
const SWIPE_MS = 220
const STEP_MS = 650

const delay = (ms) => (prefersReducedMotion() ? 0 : ms)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

/* State ------------------------------------------------------------------- */

function useSwipeDeck() {
  const [index, setIndex] = useState(0)
  const [exit, setExit] = useState('')
  const advance = useCallback((direction) => {
    setExit(direction)
    setTimeout(() => {
      setIndex((i) => i + 1)
      setExit('')
    }, delay(SWIPE_MS))
  }, [])
  return { index, exit, advance, restart: () => setIndex(0) }
}

// Steps through the preparation, then hands the job to `onDone`.
function useApplyRun(onDone) {
  const [work, setWork] = useState(null)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const start = (job) => {
    if (work) return
    let step = 0
    setWork({ job, step })
    const tick = () => {
      step += 1
      if (step >= STEPS.length) {
        setWork(null)
        onDone(job)
        return
      }
      setWork({ job, step })
      timer.current = setTimeout(tick, delay(STEP_MS))
    }
    timer.current = setTimeout(tick, delay(STEP_MS))
  }
  const cancel = () => {
    clearTimeout(timer.current)
    setWork(null)
  }
  return { work, start, cancel }
}

function useApplyerDemo() {
  const [tab, setTab] = useState('jobs')
  const [apps, setApps] = useState([])
  const [saved, setSaved] = useState([])
  const deck = useSwipeDeck()
  const run = useApplyRun((job) => {
    setApps((list) => [{ ...job, status: 'Ready for approval' }, ...list])
    deck.advance('right')
  })
  const job = JOBS[deck.index]

  const save = () => {
    setSaved((ids) => (ids.includes(job.id) ? ids : [...ids, job.id]))
    deck.advance('up')
  }
  const send = (id) => setApps((list) => list.map((a) => (a.id === id ? { ...a, status: 'Sent' } : a)))
  const reset = () => {
    run.cancel()
    deck.restart()
    setApps([])
    setSaved([])
    setTab('jobs')
  }
  return {
    tab, setTab, apps, saved, job, send, reset, save,
    left: JOBS.length - deck.index,
    exit: deck.exit,
    work: run.work,
    apply: () => run.start(job),
    skip: () => deck.advance('left'),
  }
}

/* Chrome ------------------------------------------------------------------ */

function TabButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`relative flex min-h-11 items-center px-3 text-small font-medium ${selected ? 'text-ai' : 'text-ai-muted hover:text-ai'}`}
    >
      {children}
      {selected && <span className="cut absolute inset-x-2 bottom-0 h-1 bg-fuji" aria-hidden="true" />}
    </button>
  )
}

function DemoNav({ tab, setTab, count, reset }) {
  return (
    <div className="flex items-center gap-2 border-b border-ai/15 px-3 sm:px-5">
      <b className="mr-auto font-semibold sm:mr-4">Applyer</b>
      <div role="tablist" aria-label="Applyer demo" className="flex sm:mr-auto">
        <TabButton selected={tab === 'jobs'} onClick={() => setTab('jobs')}>
          Jobs
        </TabButton>
        <TabButton selected={tab === 'apps'} onClick={() => setTab('apps')}>
          Applications
          {count > 0 && <span className="ml-1.5 bg-ai px-1.5 text-meta text-gofun tabular-nums">{count}</span>}
        </TabButton>
      </div>
      <button type="button" className="link min-h-11 text-meta" onClick={reset}>
        Reset
      </button>
    </div>
  )
}

/* Jobs -------------------------------------------------------------------- */

function MatchMeter({ match }) {
  return (
    <div>
      <p className="text-meta font-semibold tabular-nums">{match}% match</p>
      <div className="mt-1.5 h-1 bg-ai/10" aria-hidden="true">
        <div className="h-full bg-ai" style={{ width: `${match}%` }} />
      </div>
    </div>
  )
}

function ApplySteps({ work }) {
  const state = (i) => (i < work.step ? 'done' : i === work.step ? 'now' : 'wait')
  return (
    <div role="status" className="absolute inset-0 grid content-center gap-4 bg-gofun/95 p-6">
      <p className="font-semibold">Applying to {work.job.co}</p>
      <ol className="grid gap-2 text-small">
        {STEPS.map((step, i) => (
          <li key={step} className={`flex items-center gap-3 ${state(i) === 'wait' ? 'text-ai-muted' : ''}`}>
            <span
              className={`h-2.5 shrink-0 ${STEP_MARK[state(i)]}`}
              aria-hidden="true"
            />
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function JobCard({ job, exit, work }) {
  return (
    <article
      aria-live="polite"
      className={`relative border border-ai/20 bg-gofun p-5 transition-[translate,opacity] duration-200 ease-cut ${EXIT[exit] ?? ''}`}
    >
      <MatchMeter match={job.match} />
      <p className="mt-5 text-meta text-ai-muted">
        {job.co} · {job.place}
      </p>
      <h3 className="mt-1 text-h3 font-semibold">{job.title}</h3>
      <p className="mt-3 text-small text-ai-muted">{job.text}</p>
      <div className="mt-5">
        <Tags items={job.tags} />
      </div>
      {work && <ApplySteps work={work} />}
    </article>
  )
}

function DeckActions({ demo }) {
  const busy = Boolean(demo.work)
  const secondary = 'btn btn-secondary px-3 disabled:opacity-50'
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <button type="button" className={secondary} onClick={demo.skip} disabled={busy}>
        <Icon d={ICON.x} /> Next
      </button>
      <button type="button" className={secondary} onClick={demo.save} disabled={busy}>
        <Icon d={ICON.heart} /> Save
      </button>
      <button type="button" className="btn btn-primary px-3 disabled:opacity-50" onClick={demo.apply} disabled={busy}>
        <Icon d={ICON.check} /> Apply
      </button>
    </div>
  )
}

function Empty({ title, text, children }) {
  return (
    <div className="grid min-h-72 content-center justify-items-start gap-3">
      <h3 className="text-h3 font-semibold">{title}</h3>
      <p className="text-small text-ai-muted">{text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>
    </div>
  )
}

function JobsView({ demo }) {
  if (demo.left <= 0) {
    return (
      <Empty
        title="That was the lot."
        text={`${plural(demo.apps.length, 'application')} prepared, ${demo.saved.length} saved.`}
      >
        <button type="button" className="btn btn-primary" onClick={() => demo.setTab('apps')}>
          See applications
        </button>
        <button type="button" className="link min-h-11" onClick={demo.reset}>
          Start over
        </button>
      </Empty>
    )
  }
  return (
    <>
      <p className="mb-3 text-meta text-ai-muted">{plural(demo.left, 'job')} matched for you</p>
      <JobCard job={demo.job} exit={demo.exit} work={demo.work} />
      <DeckActions demo={demo} />
    </>
  )
}

/* Applications ------------------------------------------------------------ */

function AppRow({ app, send }) {
  const sent = app.status === 'Sent'
  return (
    <li className="grid gap-3 border-t border-ai/15 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <b className="font-semibold">{app.title}</b>
        <span className="block text-small text-ai-muted">
          {app.co} · {app.match}% match
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`tag ${sent ? 'border-ok text-ok' : ''}`}>{app.status}</span>
        {!sent && (
          <button type="button" className="link min-h-11 text-small" onClick={() => send(app.id)}>
            Approve and send
          </button>
        )}
      </div>
    </li>
  )
}

function AppsView({ demo }) {
  if (!demo.apps.length) {
    return (
      <Empty title="No applications yet." text="Apply to a job and it shows up here, ready for your approval.">
        <button type="button" className="btn btn-primary" onClick={() => demo.setTab('jobs')}>
          Back to jobs
        </button>
      </Empty>
    )
  }
  return (
    <ul className="border-b border-ai/15">
      {demo.apps.map((app) => (
        <AppRow key={app.id} app={app} send={demo.send} />
      ))}
    </ul>
  )
}

export default function ApplyerDemo() {
  const demo = useApplyerDemo()
  return (
    <div>
      <div className="border border-ai/15 bg-gofun">
        <div className="flex gap-1.5 border-b border-ai/15 px-3 py-2.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-ai/20" />
          ))}
        </div>
        <DemoNav tab={demo.tab} setTab={demo.setTab} count={demo.apps.length} reset={demo.reset} />
        <div role="tabpanel" className="min-h-[29rem] bg-ai/[0.03] p-4 sm:p-6">
          {demo.tab === 'jobs' ? <JobsView demo={demo} /> : <AppsView demo={demo} />}
        </div>
      </div>
      <p className="mt-3 text-meta text-ai-muted">Interactive demo with made-up listings. Nothing is sent anywhere.</p>
    </div>
  )
}
