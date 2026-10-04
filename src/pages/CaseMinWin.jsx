import { useEffect, useMemo, useState } from 'react'
import '@fontsource/caveat/500.css'
import { Arrow } from '../components/ui'
import { Flow, MINWIN_FLOW } from '../components/drawings'
import { CaseNext, Eyebrow, HandNote } from '../components/case'
import { Link } from '../router'
import { MinWinTerminal } from '../components/demos'
import { PROJECTS } from '../data'
import { useMedia } from '../hooks'

const P = PROJECTS.minwin

const COMMANDS = [
  {
    cmd: 'minwin status',
    does: 'Shows the current state of the machine before anything is touched.',
    why: 'You cannot improve what you have not looked at.',
  },
  {
    cmd: 'minwin benchmark',
    does: 'Measures idle resource use, startup time and background activity.',
    why: 'It gives every later change a baseline to be judged against, instead of a feeling.',
  },
  {
    cmd: 'minwin apply minimal',
    does: 'Applies the minimal profile: the leanest setup that still keeps Windows working.',
    why: 'Profiles are plain TOML, so they can be read, reviewed and edited.',
  },
  {
    cmd: 'minwin apply gaming',
    does: 'Applies the gaming profile, which preserves gaming, drivers, Windows Update and security.',
    why: 'Faster must never mean broken.',
  },
  {
    cmd: 'minwin diff',
    does: 'Shows exactly what changed against the baseline, and why.',
    why: 'Every change has to be explainable.',
  },
  {
    cmd: 'minwin rollback',
    does: 'Reverts the changes that were made.',
    why: 'Reversibility is a requirement, not a feature.',
  },
]

const GUARDRAILS = [
  'Preserve gaming, drivers, Windows Update and security.',
  'Every change is explainable.',
  'Every change is reversible.',
  'It works on top of a standard Windows install, not a custom build.',
]

const STACK = [
  ['Rust', 'Low level and predictable, which suits a tool that touches the system.'],
  ['windows-rs', 'Talks to the Win32 APIs directly.'],
  ['SQLite', 'Keeps state and history locally.'],
  ['TOML', 'Profiles that anyone can read and edit.'],
  ['DISM', 'Windows’ own servicing tool, used where it is the right interface.'],
  ['powercfg', 'Windows’ own power tool, used the same way.'],
]

// A tiny seeded generator, so a resample is repeatable and cheap.
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const gauss = (r) => {
  let u = 0
  let v = 0
  while (!u) u = r()
  while (!v) v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
// Timing noise: mostly small jitter, now and then a slow outlier.
const sample = (seed, n, base) => {
  const r = rng(seed)
  return Array.from({ length: n }, () => {
    let v = base * Math.exp(gauss(r) * 0.07)
    if (r() < 0.07) v *= 1.15 + r() * 0.35
    return v
  })
}
const sorted = (a) => [...a].sort((x, y) => x - y)
const quant = (s, p) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]
const median = (a) => quant(sorted(a), 0.5)

// Why one run proves nothing: two simulated configurations, one genuinely about 3 percent faster.
function NoiseDemo() {
  const [runs, setRuns] = useState(4)
  const [seed, setSeed] = useState(7)
  const { before, after } = useMemo(
    () => ({ before: sample(seed, 80, 100).slice(0, runs), after: sample(seed + 911, 80, 97).slice(0, runs) }),
    [seed, runs],
  )
  const mB = median(before)
  const mA = median(after)
  const iqrB = quant(sorted(before), 0.75) - quant(sorted(before), 0.25)
  const iqrA = quant(sorted(after), 0.75) - quant(sorted(after), 0.25)
  // Standard error of a median, from a robust spread estimate.
  const se = (iqr) => (1.2533 * (iqr / 1.349)) / Math.sqrt(runs)
  const z = (mB - mA) / Math.sqrt(se(iqrB) ** 2 + se(iqrA) ** 2 || 1)
  const shift = ((mB - mA) / mB) * 100
  const verdict =
    runs < 8 ? 'Too few runs to say anything.' : Math.abs(z) > 2.5 ? `A real shift: about ${shift.toFixed(1)}% faster.` : 'Cannot tell this apart from noise.'

  const X0 = 70
  const X1 = 140
  const px = (v) => 40 + ((Math.min(X1, Math.max(X0, v)) - X0) / (X1 - X0)) * 560
  const jitter = (i, row) => ((i * 37 + row * 19) % 29) - 14

  const row = (label, vals, med, y, tone) => (
    <g>
      <text x="40" y={y - 34} className="nd-label">
        {label}
      </text>
      <line x1="40" x2="600" y1={y} y2={y} className="nd-axis" />
      <rect
        x={px(quant(sorted(vals), 0.25))}
        width={Math.max(2, px(quant(sorted(vals), 0.75)) - px(quant(sorted(vals), 0.25)))}
        y={y - 18}
        height="36"
        className={`nd-iqr nd-iqr--${tone}`}
      />
      {vals.map((v, i) => (
        <circle
          key={i}
          r="3.6"
          className={`nd-dot nd-dot--${tone}`}
          style={{ transform: `translate(${px(v)}px, ${y + jitter(i, tone === 'a' ? 1 : 0)}px)` }}
        />
      ))}
      <line x1={px(med)} x2={px(med)} y1={y - 24} y2={y + 24} className={`nd-median nd-median--${tone}`} />
    </g>
  )

  return (
    <div className="nd">
      <div className="nd-chart">
        <svg viewBox="0 0 640 230" role="img" aria-label={`Simulated timings, ${runs} runs each. ${verdict}`}>
          {[80, 100, 120, 140].map((t) => (
            <g key={t}>
              <line x1={px(t)} x2={px(t)} y1="20" y2="190" className="nd-grid" />
              <text x={px(t)} y="212" textAnchor="middle" className="nd-tick">
                {t}
              </text>
            </g>
          ))}
          {row('Before', before, mB, 70, 'b')}
          {row('After a 3% tweak', after, mA, 150, 'a')}
        </svg>
      </div>
      <div className="nd-controls">
        <label className="nd-slider">
          <span className="mono">Runs per configuration</span>
          <input type="range" min="1" max="60" value={runs} onChange={(e) => setRuns(Number(e.target.value))} />
          <b className="mono">{runs}</b>
        </label>
        <button type="button" className="btn btn--line btn--sm" onClick={() => setSeed((s) => s + 1)}>
          Resample
        </button>
      </div>
      <div className="nd-read" aria-live="polite">
        <p className="nd-verdict">{verdict}</p>
        <dl className="mono">
          <div>
            <dt>Median before</dt>
            <dd>{mB.toFixed(1)}</dd>
          </div>
          <div>
            <dt>Median after</dt>
            <dd>{mA.toFixed(1)}</dd>
          </div>
          <div>
            <dt>Spread (IQR)</dt>
            <dd>{((iqrB + iqrA) / 2).toFixed(1)}</dd>
          </div>
        </dl>
      </div>
      <p className="nd-fine">
        Simulated numbers to illustrate the idea, in arbitrary units. This is not MinWin output. The tweak is
        a genuine 3% improvement, and with noisy runs you still need enough of them to see it.
      </p>
    </div>
  )
}

export default function CaseMinWin() {
  const narrow = useMedia('(max-width: 760px)')
  const m = narrow ? 'narrow' : 'wide'
  const [cmd, setCmd] = useState(1)

  useEffect(() => {
    document.title = 'MinWin · Lachezar Dimchov'
    return () => {
      document.title = 'Lachezar Dimchov, Software Engineer'
    }
  }, [])

  const c = COMMANDS[cmd]
  return (
    <main className="cm ce">
      {/* Hero */}
      <header className="cm-top wrap">
        <img className="cm-bg" src="/assets/minwin/minwin-stage.webp" alt="" width="1600" height="1000" fetchPriority="high" />
        <div className="cm-top-copy">
          <Eyebrow>
            Project <i>/</i> Case study
          </Eyebrow>
          <h1 className="cm-h1" style={{ viewTransitionName: 'title-minwin' }}>
            MinWin<span className="cm-caret" aria-hidden="true">_</span>
          </h1>
          <p className="cm-lede">{P.tagline}</p>
          <p className="cm-sub">
            An experimental Windows 11 optimisation tool, written in Rust. It benchmarks every change instead
            of trusting placebo tweaks, explains each one, and can roll all of it back.
          </p>
          <ul className="cm-badges mono">
            <li>Early development</li>
            <li>Experimental</li>
            <li>Rust</li>
          </ul>
          <p className="cm-warn">Expect things to break.</p>
        </div>

        <div className="cm-term" role="group" aria-label="Planned command line">
          <p className="cm-term-head mono">
            <span>planned cli</span>
            <span>early development</span>
          </p>
          <div className="cm-term-body">
            <ul className="cm-cmds">
              {COMMANDS.map((x, i) => (
                <li key={x.cmd}>
                  <button type="button" className={cmd === i ? 'is-on' : ''} aria-pressed={cmd === i} onClick={() => setCmd(i)}>
                    <span aria-hidden="true">{cmd === i ? '>' : ' '}</span> {x.cmd}
                  </button>
                </li>
              ))}
            </ul>
            <div className="cm-cmd-detail" aria-live="polite">
              <p className="cm-cmd-name mono">{c.cmd}</p>
              <p className="cm-cmd-does">{c.does}</p>
              <p className="cm-cmd-why">{c.why}</p>
            </div>
          </div>
        </div>
        <HandNote className="cm-top-note" arrow="down-left">
          measure first.
          <br />
          then touch anything.
        </HandNote>
      </header>

      {/* Live terminal */}
      <section className="cm-sec wrap" aria-labelledby="try-t">
        <div className="cm-sec-text">
          <Eyebrow>
            Try it <i>/</i> Simulated CLI
          </Eyebrow>
          <h2 id="try-t" className="ce-h2">
            Run it.
          </h2>
          <p className="ce-p">
            A simulated preview of the planned command line. Try applying a profile before measuring, or
            rolling back with nothing to undo, and see how it refuses to guess.
          </p>
        </div>
        <MinWinTerminal />
      </section>

      {/* Measure */}
      <section className="cm-sec wrap" aria-labelledby="measure-t">
        <div className="cm-sec-text">
          <Eyebrow>
            01 <i>/</i> Measure, do not guess
          </Eyebrow>
          <h2 id="measure-t" className="ce-h2">
            One run proves nothing.
          </h2>
          <p className="ce-p">
            Timing a machine is noisy. Background work, caches and plain luck move every number. A tweak that
            looks faster on one run is usually just a good run.
          </p>
          <p className="ce-p">
            So MinWin is built around benchmarking: take enough measurements to tell a real change from
            noise, then compare. Drag the slider to see why.
          </p>
        </div>
        <NoiseDemo />
      </section>

      {/* The loop */}
      <section className="cm-sec wrap" aria-labelledby="loop-t">
        <div className="cm-sec-text">
          <Eyebrow>
            02 <i>/</i> The loop
          </Eyebrow>
          <h2 id="loop-t" className="ce-h2">
            Measure, apply, diff, roll back.
          </h2>
          <p className="ce-p">Every change goes through the same path, so nothing is a one-way door.</p>
          <ul className="cm-rules">
            {GUARDRAILS.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="cm-loop">
          <Flow dark spec={MINWIN_FLOW[m]} label="Benchmark, apply a profile, diff what changed, roll back any change" />
          <p className="mono cm-loop-cap">Dashed: still being built.</p>
        </div>
      </section>

      {/* Under the hood */}
      <section className="cm-hood wrap" aria-labelledby="hood-t">
        <Eyebrow>
          03 <i>/</i> Under the hood
        </Eyebrow>
        <h2 id="hood-t" className="ce-h2">
          Low level on purpose.
        </h2>
        <ul className="cm-stack">
          {STACK.map(([n, d]) => (
            <li key={n}>
              <b className="mono">{n}</b>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="cm-fine">
          MinWin is not a custom Windows build. It works on top of a standard installation, and it is in early
          development, so expect things to break.
        </p>
      </section>

      <CaseNext from="minwin" />
      <p className="cm-back wrap">
        <Link to="/lab" className="hm-link">
          See it in the Lab <Arrow />
        </Link>
      </p>
    </main>
  )
}
