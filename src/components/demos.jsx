import { useCallback, useEffect, useRef, useState } from 'react'

const Ico = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)
const ICON = {
  x: 'M6 6l12 12M18 6L6 18',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4',
}

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* =====================================================================
   Applyer: swipe jobs, apply, and watch the applications list
   Demo data. Not real listings.
   ===================================================================== */
const JOBS = [
  { id: 1, title: 'Full-stack developer', co: 'Northwind Health', place: 'Copenhagen', match: 91, tags: ['TypeScript', 'React', 'Node.js'], text: 'Build tools clinicians use every day. You own features from the interface to the database.' },
  { id: 2, title: 'Backend engineer', co: 'Fjord Logistics', place: 'Aarhus', match: 84, tags: ['NestJS', 'PostgreSQL', 'Docker'], text: 'Services that track thousands of shipments. Reliability and good observability matter here.' },
  { id: 3, title: 'Frontend engineer', co: 'Lumen Studio', place: 'Remote (EU)', match: 78, tags: ['Angular', 'TypeScript', 'RxJS'], text: 'A large Angular application with complex search, permissions and forms.' },
  { id: 4, title: 'Platform engineer', co: 'Havn Cloud', place: 'Copenhagen', match: 72, tags: ['Terraform', 'Ansible', 'Linux'], text: 'Own the infrastructure code that keeps the product running, from provisioning to deploys.' },
  { id: 5, title: 'Software engineer', co: 'Tide Payments', place: 'Odense', match: 66, tags: ['Node.js', 'Redis', 'APIs'], text: 'Payment flows where correctness comes first. Plenty of edge cases to enjoy.' },
]
const STEPS = ['Analysing the role', 'Tailoring your CV', 'Writing the cover letter']

export function ApplyerDemo() {
  const [tab, setTab] = useState('jobs')
  const [idx, setIdx] = useState(0)
  const [apps, setApps] = useState([])
  const [saved, setSaved] = useState([])
  const [work, setWork] = useState(null) // { job, step }
  const [dir, setDir] = useState('')
  const timer = useRef(0)
  const job = JOBS[idx]
  const left = JOBS.length - idx

  useEffect(() => () => clearTimeout(timer.current), [])

  const advance = useCallback((d) => {
    setDir(d)
    setTimeout(() => {
      setIdx((i) => i + 1)
      setDir('')
    }, calm() ? 0 : 220)
  }, [])

  const apply = () => {
    if (work) return
    const j = job
    setWork({ job: j, step: 0 })
    let s = 0
    const tick = () => {
      s += 1
      if (s >= STEPS.length) {
        setApps((a) => [{ id: j.id, title: j.title, co: j.co, match: j.match, status: 'Ready for approval' }, ...a])
        setWork(null)
        advance('right')
        return
      }
      setWork({ job: j, step: s })
      timer.current = setTimeout(tick, calm() ? 0 : 650)
    }
    timer.current = setTimeout(tick, calm() ? 0 : 650)
  }
  const save = () => {
    setSaved((s) => (s.includes(job.id) ? s : [...s, job.id]))
    advance('up')
  }
  const send = (id) => setApps((a) => a.map((x) => (x.id === id ? { ...x, status: 'Sent' } : x)))
  const reset = () => {
    clearTimeout(timer.current)
    setIdx(0)
    setApps([])
    setSaved([])
    setWork(null)
    setTab('jobs')
  }

  return (
    <div className="dm dm-ap">
      <div className="dm-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="dm-ap-nav">
        <b className="dm-ap-logo">Applyer</b>
        <div role="tablist" aria-label="Applyer demo">
          <button role="tab" aria-selected={tab === 'jobs'} onClick={() => setTab('jobs')}>
            Jobs
          </button>
          <button role="tab" aria-selected={tab === 'apps'} onClick={() => setTab('apps')}>
            Applications{apps.length ? <span className="dm-count">{apps.length}</span> : null}
          </button>
        </div>
        <button className="dm-reset" onClick={reset}>
          Reset
        </button>
      </div>

      {tab === 'jobs' && (
        <div className="dm-ap-body">
          {left > 0 ? (
            <>
              <p className="dm-ap-meta">
                {left} {left === 1 ? 'job' : 'jobs'} matched for you
              </p>
              <article className={`dm-card ${dir ? `is-${dir}` : ''}`} aria-live="polite">
                <span className="dm-match" style={{ '--m': job.match }}>
                  {job.match}% match
                </span>
                <p className="dm-co">{job.co} · {job.place}</p>
                <h3>{job.title}</h3>
                <p className="dm-text">{job.text}</p>
                <ul className="dm-tags">
                  {job.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {work && (
                  <div className="dm-work" role="status">
                    <p>Applying to {work.job.co}</p>
                    <ol>
                      {STEPS.map((s, i) => (
                        <li key={s} className={i < work.step ? 'is-done' : i === work.step ? 'is-now' : ''}>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </article>
              <div className="dm-actions">
                <button onClick={() => advance('left')} disabled={!!work}>
                  <Ico d={ICON.x} /> Next
                </button>
                <button onClick={save} disabled={!!work}>
                  <Ico d={ICON.heart} /> Save
                </button>
                <button className="is-main" onClick={apply} disabled={!!work}>
                  <Ico d={ICON.check} /> Apply
                </button>
              </div>
            </>
          ) : (
            <div className="dm-empty">
              <h3>That was the lot.</h3>
              <p>
                {apps.length} {apps.length === 1 ? 'application' : 'applications'} prepared, {saved.length} saved.
              </p>
              <button className="dm-primary" onClick={() => setTab('apps')}>
                See applications
              </button>
              <button className="dm-link" onClick={reset}>
                Start over
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'apps' && (
        <div className="dm-ap-body">
          {apps.length ? (
            <ul className="dm-list">
              {apps.map((a) => (
                <li key={a.id}>
                  <div>
                    <b>{a.title}</b>
                    <span>{a.co} · {a.match}% match</span>
                  </div>
                  <span className={`dm-chip ${a.status === 'Sent' ? 'is-ok' : ''}`}>{a.status}</span>
                  {a.status !== 'Sent' && (
                    <button className="dm-mini" onClick={() => send(a.id)}>
                      Approve and send
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="dm-empty">
              <h3>No applications yet.</h3>
              <p>Apply to a job and it shows up here, ready for your approval.</p>
              <button className="dm-primary" onClick={() => setTab('jobs')}>
                Back to jobs
              </button>
            </div>
          )}
        </div>
      )}
      <p className="dm-note">Interactive demo with made-up listings. Nothing is sent anywhere.</p>
    </div>
  )
}

/* =====================================================================
   Spisnem: a guest phone and a restaurant dashboard sharing one queue
   ===================================================================== */
const PLACES = [
  { id: 'nordic', name: 'Nordic Table', kind: 'Nordic', wait: 10, rating: 4.8, x: 58, y: 30 },
  { id: 'kaffe', name: 'Mad og Kaffe', kind: 'Café', wait: 15, rating: 4.6, x: 28, y: 52 },
  { id: 'havn', name: 'Havn Kitchen', kind: 'Seafood', wait: 25, rating: 4.7, x: 72, y: 62 },
]
const START = [
  { id: 'a', name: 'Andersen', size: 2, waited: 14, quote: 15, state: 'waiting' },
  { id: 'b', name: 'Larsen', size: 4, waited: 11, quote: 20, state: 'waiting' },
  { id: 'c', name: 'Moreau', size: 2, waited: 7, quote: 10, state: 'waiting' },
]

export function SpisnemDemo() {
  const [place, setPlace] = useState('nordic')
  const [queue, setQueue] = useState(START)
  const [me, setMe] = useState(false)
  const [seated, setSeated] = useState(42)
  const meRow = queue.find((q) => q.id === 'me')
  const waiting = queue.filter((q) => q.state !== 'seated')
  const pos = meRow ? waiting.findIndex((q) => q.id === 'me') + 1 : 0
  const p = PLACES.find((x) => x.id === place)

  const join = () => {
    setMe(true)
    setQueue((q) => [...q, { id: 'me', name: 'You (demo)', size: 2, waited: 0, quote: p.wait, state: 'waiting' }])
  }
  const leave = () => {
    setMe(false)
    setQueue((q) => q.filter((x) => x.id !== 'me'))
  }
  const call = (id) => setQueue((q) => q.map((x) => (x.id === id ? { ...x, state: 'notified' } : x)))
  const seat = (id) => {
    setQueue((q) => q.map((x) => (x.id === id ? { ...x, state: 'seated' } : x)))
    setSeated((n) => n + 1)
  }
  const reset = () => {
    setQueue(START)
    setMe(false)
    setSeated(42)
    setPlace('nordic')
  }

  const screen = !me ? 'map' : meRow?.state === 'seated' ? 'seated' : meRow?.state === 'notified' ? 'ready' : 'wait'
  const eta = pos ? Math.max(2, pos * 4) : 0

  return (
    <div className="dm dm-sp">
      <div className="dm-sp-phone">
        <div className="dm-phone">
          {screen === 'map' && (
            <>
              <div className="dm-search">Search name or cuisine</div>
              <div className="dm-map" role="group" aria-label="Map of nearby restaurants">
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 40C20 34 40 44 62 30S90 24 100 28V60H0Z" className="dm-river" />
                  <path d="M10 0V60M34 0V60M60 0V60M86 0V60M0 12H100M0 34H100M0 52H100" className="dm-streets" />
                </svg>
                {PLACES.map((x) => (
                  <button
                    key={x.id}
                    className={`dm-pin ${place === x.id ? 'is-on' : ''}`}
                    style={{ left: `${x.x}%`, top: `${x.y}%` }}
                    onClick={() => setPlace(x.id)}
                    aria-pressed={place === x.id}
                    aria-label={`${x.name}, ${x.wait} minute wait`}
                  >
                    {x.wait}m
                  </button>
                ))}
              </div>
              <div className="dm-sheet">
                <p className="dm-sheet-h">Nearby · {PLACES.length}</p>
                <div className="dm-place">
                  <span className="dm-thumb" aria-hidden="true" />
                  <div>
                    <b>{p.name}</b>
                    <span>
                      {p.kind} · ★ {p.rating}
                    </span>
                  </div>
                </div>
                <button className="dm-join" onClick={join}>
                  Join queue · {p.wait} min
                </button>
              </div>
            </>
          )}
          {screen === 'wait' && (
            <div className="dm-ticket">
              <p className="dm-ticket-top">{p.name}</p>
              <div className="dm-ring" style={{ '--p': Math.min(1, 1 - (pos - 1) / 6) }}>
                <small>You&rsquo;re</small>
                <b>#{pos}</b>
              </div>
              <p className="dm-eta">About {eta} min</p>
              <p className="dm-sub">Go for a walk. We&rsquo;ll ping you when your table is ready.</p>
              <button className="dm-leave" onClick={leave}>
                Leave the queue
              </button>
            </div>
          )}
          {screen === 'ready' && (
            <div className="dm-ticket is-ready">
              <p className="dm-ticket-top">{p.name}</p>
              <div className="dm-bell" aria-hidden="true">
                <Ico d={ICON.bell} size={34} />
              </div>
              <p className="dm-eta">Your table is ready</p>
              <p className="dm-sub">Head over. The host will seat you.</p>
            </div>
          )}
          {screen === 'seated' && (
            <div className="dm-ticket is-ready">
              <p className="dm-ticket-top">{p.name}</p>
              <p className="dm-eta">Enjoy your meal.</p>
              <button className="dm-leave" onClick={leave}>
                Done
              </button>
            </div>
          )}
        </div>
        <p className="dm-cap">Guest phone</p>
      </div>

      <div className="dm-sp-dash">
        <div className="dm-dash">
          <div className="dm-dash-head">
            <div>
              <h3>Queue</h3>
              <p>Friday · dinner service</p>
            </div>
            <button className="dm-reset" onClick={reset}>
              Reset
            </button>
          </div>
          <div className="dm-stats">
            <div>
              <span>Waiting</span>
              <b>{waiting.length}</b>
            </div>
            <div>
              <span>Avg quote</span>
              <b>18 min</b>
            </div>
            <div className="is-hot">
              <span>Seated today</span>
              <b>{seated}</b>
            </div>
          </div>
          <ul className="dm-rows">
            {waiting.map((q, i) => (
              <li key={q.id} className={q.id === 'me' ? 'is-me' : ''}>
                <span className="dm-n">{i + 1}</span>
                <b>{q.name}</b>
                <span className="dm-party">{q.size}</span>
                <span className="dm-wait">{q.waited} / {q.quote} min</span>
                {q.state === 'notified' ? (
                  <span className="dm-act">
                    <i className="dm-notified">Notified</i>
                    <button className="dm-seat" onClick={() => seat(q.id)}>
                      Seat
                    </button>
                  </span>
                ) : (
                  <button className="dm-call" onClick={() => call(q.id)}>
                    Call in
                  </button>
                )}
              </li>
            ))}
            {!waiting.length && <li className="dm-none">Nobody waiting.</li>}
          </ul>
        </div>
        <p className="dm-cap">Restaurant dashboard</p>
      </div>
      <p className="dm-note dm-note--wide">
        Try it: pick a place, join the queue on the phone, then call yourself in on the dashboard. Demo data only.
      </p>
    </div>
  )
}

/* =====================================================================
   MinWin: a simulated CLI. Numbers are illustrative, never real output.
   ===================================================================== */
const HELP = [
  'minwin status          current state of the machine',
  'minwin benchmark       measure before changing anything',
  'minwin apply <profile> minimal | gaming | developer',
  'minwin diff            what changed, and why',
  'minwin rollback        undo every change',
  'clear                  clear the screen',
]
const CHIPS = ['minwin status', 'minwin benchmark', 'minwin apply minimal', 'minwin diff', 'minwin rollback']

export function MinWinTerminal() {
  const [lines, setLines] = useState([
    { t: 'sys', s: 'MinWin (simulated preview). Type a command or tap one below. Try "help".' },
  ])
  const [val, setVal] = useState('')
  const [busy, setBusy] = useState(false)
  const [st, setSt] = useState({ base: false, profile: null })
  const timers = useRef([])
  const end = useRef(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    end.current?.scrollTo({ top: end.current.scrollHeight })
  }, [lines])

  const emit = (out, done) => {
    setBusy(true)
    const gap = calm() ? 0 : 130
    out.forEach((l, i) => {
      timers.current.push(
        setTimeout(() => {
          setLines((x) => [...x, l])
          if (i === out.length - 1) {
            setBusy(false)
            done?.()
          }
        }, gap * (i + 1)),
      )
    })
  }

  const run = (raw) => {
    const cmd = raw.trim().replace(/\s+/g, ' ')
    if (!cmd || busy) return
    setLines((x) => [...x, { t: 'in', s: cmd }])
    setVal('')
    const a = cmd.toLowerCase().split(' ')
    if (cmd.toLowerCase() === 'clear') return setLines([])
    if (cmd.toLowerCase() === 'help') return emit(HELP.map((s) => ({ t: 'out', s })))
    if (a[0] !== 'minwin') return emit([{ t: 'err', s: `command not found: ${a[0]}. Try "help".` }])

    const sub = a[1]
    if (sub === 'status') {
      return emit([
        { t: 'out', s: 'Windows 11 (standard install)' },
        { t: 'out', s: `baseline     ${st.base ? 'recorded' : 'none yet'}` },
        { t: 'out', s: `profile      ${st.profile ?? 'none'}` },
        { t: 'out', s: 'rollback     ' + (st.profile ? 'available' : 'nothing to undo') },
      ])
    }
    if (sub === 'benchmark') {
      return emit(
        [
          { t: 'out', s: 'running 12 passes...' },
          { t: 'out', s: 'idle memory     median 4.1 GB   iqr 0.08' },
          { t: 'out', s: 'startup time    median 31.2 s   iqr 1.4' },
          { t: 'out', s: 'background cpu  median 3.9 %    iqr 0.6' },
          { t: 'ok', s: 'baseline recorded. Enough passes to trust it.' },
        ],
        () => setSt((s) => ({ ...s, base: true })),
      )
    }
    if (sub === 'apply') {
      const prof = a[2]
      if (!['minimal', 'gaming', 'developer'].includes(prof))
        return emit([{ t: 'err', s: 'usage: minwin apply <minimal|gaming|developer>' }])
      if (!st.base) return emit([{ t: 'err', s: 'no baseline. Run "minwin benchmark" first, so the change can be judged.' }])
      return emit(
        [
          { t: 'out', s: `profile: ${prof}` },
          { t: 'out', s: 'checking Windows Update, drivers and security are untouched... ok' },
          { t: 'out', s: 'applying 14 changes, each with a recorded undo' },
          { t: 'ok', s: 'done. Run "minwin diff" to see exactly what changed.' },
        ],
        () => setSt((s) => ({ ...s, profile: prof })),
      )
    }
    if (sub === 'diff') {
      if (!st.profile) return emit([{ t: 'err', s: 'nothing to diff. Apply a profile first.' }])
      return emit([
        { t: 'out', s: 'idle memory     4.1 GB  ->  3.6 GB   (-12 %)' },
        { t: 'out', s: 'startup time    31.2 s  ->  27.9 s   (-11 %)' },
        { t: 'out', s: 'background cpu  3.9 %   ->  2.8 %    (-28 %)' },
        { t: 'out', s: '14 changes, 0 touching updates, drivers or security' },
        { t: 'ok', s: 'illustrative numbers. Every change can be explained and reversed.' },
      ])
    }
    if (sub === 'rollback') {
      if (!st.profile) return emit([{ t: 'err', s: 'nothing to roll back.' }])
      return emit(
        [
          { t: 'out', s: 'reverting 14 changes in reverse order...' },
          { t: 'ok', s: 'rolled back. The machine is as it was.' },
        ],
        () => setSt((s) => ({ ...s, profile: null })),
      )
    }
    return emit([{ t: 'err', s: `unknown subcommand "${sub ?? ''}". Try "help".` }])
  }

  return (
    <div className="dm dm-mw">
      <p className="dm-mw-head mono">
        <span>minwin · simulated preview</span>
        <span>{st.profile ? `profile: ${st.profile}` : st.base ? 'baseline ok' : 'no baseline'}</span>
      </p>
      <div className="dm-mw-out" ref={end} role="log" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={`dm-ln is-${l.t}`}>
            {l.t === 'in' && <span className="dm-ps">&gt; </span>}
            {l.s}
          </p>
        ))}
      </div>
      <form
        className="dm-mw-in"
        onSubmit={(e) => {
          e.preventDefault()
          run(val)
        }}
      >
        <label htmlFor="mw-input" className="dm-ps">
          &gt;
        </label>
        <input
          id="mw-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="type a command"
          autoComplete="off"
          spellCheck="false"
          disabled={busy}
        />
      </form>
      <div className="dm-mw-chips">
        {CHIPS.map((c) => (
          <button key={c} onClick={() => run(c)} disabled={busy}>
            {c}
          </button>
        ))}
      </div>
      <p className="dm-note">Illustrative numbers from a simulation, not output from the real tool.</p>
    </div>
  )
}
