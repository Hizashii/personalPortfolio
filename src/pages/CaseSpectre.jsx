import { useEffect } from 'react'
import '@fontsource/caveat/500.css'
import { Arrow } from '../components/ui'
import { Flow, SPECTRE_FLOW } from '../components/drawings'
import { CaseNext, Eyebrow, HandNote } from '../components/case'
import { AttackGraph, RemediationLab } from '../components/demos'
import { PROJECTS } from '../data'
import { useMedia } from '../hooks'

const P = PROJECTS.spectre

const DECISIONS = [
  ['DENY', 'An explicit Deny matched. It always wins.'],
  ['ALLOW', 'No Deny matched and an Allow did, plus role trust for role assumption.'],
  ['NOT_ALLOWED', 'Nothing granted it. This is the default.'],
  ['UNSUPPORTED', 'The question is outside the modeled subset. Never treated as allowed.'],
]

const RULES = [
  'Deterministic: the same scenario always produces the same result.',
  'Evidence is structural. A path step without evidence cannot exist.',
  'The frontend is a renderer. It computes nothing security relevant.',
  'No LLM takes part in any decision.',
]

const STACK = [
  ['Python + FastAPI', 'The engine and the API, with mypy in strict mode.'],
  ['Pydantic v2', 'A strict, versioned scenario schema. Unknown fields are rejected.'],
  ['SQLAlchemy + SQLite', 'Every analysis and simulation is stored and can be reopened.'],
  ['React + TypeScript', 'Strict TypeScript, with TanStack Query and Zod at the boundary.'],
  ['React Flow', 'The attack graph, with every edge clickable down to its evidence.'],
  ['pytest · Vitest · Playwright', 'Golden outcomes for each scenario, and a real browser against the real API.'],
]

export default function CaseSpectre() {
  const narrow = useMedia('(max-width: 760px)')
  const m = narrow ? 'narrow' : 'wide'

  useEffect(() => {
    document.title = 'SPECTRE · Lachezar Dimchov'
    return () => {
      document.title = 'Lachezar Dimchov, Software Engineer'
    }
  }, [])

  return (
    <main className="cm ce">
      {/* Hero */}
      <header className="cm-top wrap">
        <div className="cm-top-copy">
          <Eyebrow>
            Project <i>/</i> Case study
          </Eyebrow>
          <h1 className="cm-h1" style={{ viewTransitionName: 'title-spectre' }}>
            {P.name}
          </h1>
          <p className="cm-lede">{P.tagline}</p>
          <p className="cm-sub">
            A cloud attack-path analysis tool. It shows how identities, roles, policies and credentials chain
            together into access to sensitive data, traces every step to the rule that allows it, and lets you
            test a fix before you trust it.
          </p>
          <ul className="cm-badges mono">
            <li>Work in progress</li>
            <li>Security</li>
            <li>Python</li>
            <li>React</li>
          </ul>
          <p className="cm-warn">Synthetic scenarios only. It never touches real cloud infrastructure.</p>
        </div>

        <figure className="cm-term sp-hero">
          <p className="cm-term-head mono">
            <span>northstar-financial</span>
            <span>2 critical findings</span>
          </p>
          <AttackGraph label="Attack graph: Alice assumes the CI deployer, then the app runtime, reads the database credentials and reaches the customer database." />
        </figure>
        <HandNote className="cm-top-note" arrow="down-left">
          every step
          <br />
          has a reason.
        </HandNote>
      </header>

      {/* Remediation lab */}
      <section className="cm-sec wrap" aria-labelledby="try-t">
        <div className="cm-sec-text">
          <Eyebrow>
            01 <i>/</i> Remediation lab
          </Eyebrow>
          <h2 id="try-t" className="ce-h2">
            Break the chain.
          </h2>
          <p className="ce-p">
            Finding a path is half the job. The other half is fixing it without breaking what has to keep
            working. SPECTRE applies a change to a copy of the environment and compares before and after.
          </p>
          <p className="ce-p">
            Try each change. Two remove the path. Only one of them is a fix.
          </p>
        </div>
        <RemediationLab />
      </section>

      {/* Evidence */}
      <section className="cm-sec wrap" aria-labelledby="evidence-t">
        <div className="cm-sec-text">
          <Eyebrow>
            02 <i>/</i> Evidence
          </Eyebrow>
          <h2 id="evidence-t" className="ce-h2">
            A drawn edge is not a finding.
          </h2>
          <p className="ce-p">
            A finding exists only when a chain of allowed steps reaches a sensitive resource, and every step
            points at the exact policy statement or trust entry behind it.
          </p>
          <p className="ce-p">
            The engine models a small, documented subset of IAM on purpose. Anything outside it is rejected
            loudly, never quietly treated as allowed.
          </p>
        </div>
        <ul className="sp-decisions">
          {DECISIONS.map(([d, t]) => (
            <li key={d}>
              <b className="mono">{d}</b>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Architecture */}
      <section className="cm-sec wrap" aria-labelledby="arch-t">
        <div className="cm-sec-text">
          <Eyebrow>
            03 <i>/</i> Architecture
          </Eyebrow>
          <h2 id="arch-t" className="ce-h2">
            One direction, no surprises.
          </h2>
          <p className="ce-p">
            A modular monolith: one API process, one web app, one SQLite file. The engine imports neither the
            web framework nor the database.
          </p>
          <ul className="cm-rules">
            {RULES.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="cm-loop">
          <Flow dark spec={SPECTRE_FLOW[m]} label="Web app calls the API, which calls services, then the engine, then the domain model. Services also store runs in SQLite." />
          <p className="mono cm-loop-cap">Red: the engine, pure Python and fully deterministic.</p>
        </div>
      </section>

      {/* Under the hood */}
      <section className="cm-hood wrap" aria-labelledby="hood-t">
        <Eyebrow>
          04 <i>/</i> Under the hood
        </Eyebrow>
        <h2 id="hood-t" className="ce-h2">
          Strict at every boundary.
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
          SPECTRE is a work in progress. A path it reports is reachable under the modeled rules, which is not
          proof of real-world exploitability. It has no authentication and is meant to run locally.
        </p>
      </section>

      <CaseNext from="spectre" />
      <p className="cm-back wrap">
        <a href={P.repo} className="hm-link" target="_blank" rel="noopener noreferrer">
          Source on GitHub <Arrow dir="ne" />
        </a>
      </p>
    </main>
  )
}
