import { useCallback, useEffect, useRef, useState } from 'react'

// The checks and timings are the ones from a real push to Applyer.
const GROUPS = [
  { name: 'Build and deploy', checks: [['Build and push the Docker image', '3m'], ['Deploy with Ansible', '5m']] },
  { name: 'Quality', checks: [['Test, lint and build', '1m']] },
  {
    name: 'Security',
    checks: [['Container scan', '3m'], ['Dependency audit', '23s'], ['Secret scan', '22s'], ['Static analysis', '1m']],
  },
]
const TOTAL = GROUPS.reduce((n, g) => n + g.checks.length, 0)
const STEP_MS = 650

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Ticks checks off one by one. Starts once, when the panel scrolls into view.
function useCheckRun() {
  const [done, setDone] = useState(0)
  const [running, setRunning] = useState(false)
  const root = useRef(null)
  const timer = useRef(0)

  const run = useCallback(() => {
    clearInterval(timer.current)
    if (prefersReducedMotion()) {
      setDone(TOTAL)
      return
    }
    let n = 0
    setDone(0)
    setRunning(true)
    timer.current = setInterval(() => {
      setDone(++n)
      if (n < TOTAL) return
      clearInterval(timer.current)
      setRunning(false)
    }, STEP_MS)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        run()
      },
      { threshold: 0.4 },
    )
    io.observe(root.current)
    return () => {
      io.disconnect()
      clearInterval(timer.current)
    }
  }, [run])

  return { root, done, running, run }
}

const STATE_LABEL = { ok: 'passed', run: 'running', wait: 'waiting' }

function StatusIcon({ state }) {
  if (state === 'ok') {
    return (
      <svg className="size-4 shrink-0 text-ai" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="currentColor" />
        <path d="M4.5 8.2l2.3 2.3 4.7-4.9" fill="none" stroke="var(--color-gofun)" strokeWidth="1.6" />
      </svg>
    )
  }
  const tone = state === 'run' ? 'border-ai bg-fuji motion-safe:animate-pulse' : 'border-ai/30'
  return <span className={`size-4 shrink-0 rounded-full border-[1.5px] ${tone}`} aria-hidden="true" />
}

function CheckRow({ name, time, state }) {
  return (
    <li className="flex min-h-10 items-center gap-3 border-t border-ai/10 text-small">
      <StatusIcon state={state} />
      <span className={state === 'wait' ? 'text-ai-muted' : ''}>{name}</span>
      <span className="ml-auto text-meta tabular-nums text-ai-muted">{state === 'ok' ? time : ''}</span>
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </li>
  )
}

function checkState(index, done, running) {
  if (index < done) return 'ok'
  return index === done && running ? 'run' : 'wait'
}

function CheckGroups({ done, running }) {
  let index = 0
  return GROUPS.map((group) => (
    <section key={group.name} className="mt-6">
      <h3 className="text-meta font-semibold text-ai-muted">{group.name}</h3>
      <ul className="mt-2">
        {group.checks.map(([name, time]) => (
          <CheckRow key={name} name={name} time={time} state={checkState(index++, done, running)} />
        ))}
      </ul>
    </section>
  ))
}

function summary(done, running) {
  if (done >= TOTAL) return 'All checks have passed'
  return running ? 'Running checks' : 'Checks'
}

export default function ShipPipeline() {
  const { root, done, running, run } = useCheckRun()
  return (
    <div ref={root} className="border border-ai/15 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div aria-live="polite">
          <p className="font-semibold">{summary(done, running)}</p>
          <p className="text-meta tabular-nums text-ai-muted">
            {done} of {TOTAL} successful
          </p>
        </div>
        <button type="button" className="btn btn-secondary min-h-10 px-4 py-2" onClick={run} disabled={running}>
          {running ? 'Running' : 'Run again'}
        </button>
      </div>
      <div className="mt-5 h-1 bg-ai/10" aria-hidden="true">
        <div className="h-full bg-ai transition-[width] duration-500 ease-cut" style={{ width: `${(done / TOTAL) * 100}%` }} />
      </div>
      <CheckGroups done={done} running={running} />
      <p className="mt-6 text-meta text-ai-muted">Every push runs this path. Real check names and timings from Applyer.</p>
    </div>
  )
}
