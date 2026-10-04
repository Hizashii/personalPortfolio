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

export default function ShipPipeline() {
  const [done, setDone] = useState(0) // how many checks have passed
  const [running, setRunning] = useState(false)
  const root = useRef(null)
  const timer = useRef(0)
  const started = useRef(false)

  const run = useCallback(() => {
    clearInterval(timer.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(TOTAL)
      return
    }
    setDone(0)
    setRunning(true)
    let n = 0
    timer.current = setInterval(() => {
      n += 1
      setDone(n)
      if (n >= TOTAL) {
        clearInterval(timer.current)
        setRunning(false)
      }
    }, 650)
  }, [])

  // Start once, when the panel scrolls into view.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          run()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearInterval(timer.current)
    }
  }, [run])

  let i = 0
  return (
    <div className="sp" ref={root}>
      <div className="sp-head">
        <div>
          <p className="sp-title">{done >= TOTAL ? 'All checks have passed' : running ? 'Running checks' : 'Checks'}</p>
          <p className="sp-sub mono">
            {done} of {TOTAL} successful
          </p>
        </div>
        <button type="button" className="sp-rerun" onClick={run} disabled={running}>
          {running ? 'Running' : 'Run again'}
        </button>
      </div>
      <div className="sp-bar" aria-hidden="true">
        <i style={{ width: `${(done / TOTAL) * 100}%` }} />
      </div>
      <div className="sp-groups" role="list" aria-live="polite">
        {GROUPS.map((g) => (
          <section key={g.name} className="sp-group" role="listitem">
            <h3 className="mono">{g.name}</h3>
            <ul>
              {g.checks.map(([name, time]) => {
                const idx = i++
                const state = idx < done ? 'ok' : idx === done && running ? 'run' : 'wait'
                return (
                  <li key={name} className={`is-${state}`}>
                    <span className="sp-ico" aria-hidden="true" />
                    <span className="sp-name">{name}</span>
                    <span className="sp-time mono">{state === 'ok' ? time : state === 'run' ? '...' : ''}</span>
                    <span className="sr-only">{state === 'ok' ? 'passed' : state === 'run' ? 'running' : 'waiting'}</span>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className="sp-fine mono">Every push runs this path. Real check names and timings from Applyer.</p>
    </div>
  )
}
