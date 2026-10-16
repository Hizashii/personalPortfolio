import { Flow, SPECTRE_FLOW } from '../components/drawings'
import { Annotation, CaseHeader, CaseNext, CaseSections, DetailList, Panel } from '../components/case'
import { Arrow } from '../components/ui'
import { AttackGraph, RemediationLab } from '../components/spectre'
import { PROJECTS } from '../data'
import { useDocumentTitle, useFlowLayout } from '../hooks'

const P = PROJECTS.spectre

const LEDE =
  'A cloud attack-path analysis tool. It shows how identities, roles, policies and credentials chain together into access to sensitive data, traces every step to the rule that allows it, and lets you test a fix before you trust it.'

const FACTS = [
  ['Status', 'Work in progress'],
  ['Scope', 'Cloud identity and access paths, in synthetic scenarios'],
  ['Stack', 'Python, FastAPI, Pydantic, SQLAlchemy and SQLite, with a React and TypeScript front end'],
  [
    'Source',
    <a key="repo" href={P.repo} className="link" target="_blank" rel="noopener noreferrer">
      Source on GitHub <Arrow dir="ne" />
    </a>,
  ],
]

/* Header ------------------------------------------------------------------ */

function HeroGraph() {
  return (
    <figure className="relative isolate">
      <span className="cut absolute -top-3 -right-3 -z-10 h-2/3 w-1/2 bg-fuji sm:-top-5 sm:-right-5" aria-hidden="true" />
      <div className="surface-dark">
        <p className="flex flex-wrap justify-between gap-x-4 border-b border-gofun/15 px-4 py-2.5 text-meta">
          <span className="font-semibold">northstar-financial</span>
          <span className="text-gofun/75">2 critical findings</span>
        </p>
        <div className="aspect-[520/300] p-5 sm:p-8">
          <AttackGraph label="Attack graph: Alice assumes the CI deployer, then the app runtime, reads the database credentials and reaches the customer database." />
        </div>
      </div>
      <figcaption className="mt-5">
        <Annotation>Every step has a reason.</Annotation>
      </figcaption>
    </figure>
  )
}

/* Section visuals --------------------------------------------------------- */

const DECISIONS = [
  ['DENY', 'An explicit Deny matched. It always wins.'],
  ['ALLOW', 'No Deny matched and an Allow did, plus role trust for role assumption.'],
  ['NOT_ALLOWED', 'Nothing granted it. This is the default.'],
  ['UNSUPPORTED', 'The question is outside the modeled subset. Never treated as allowed.'],
]

const Decisions = () => (
  <Panel title="Every question ends in one of four decisions">
    <DetailList items={DECISIONS} />
  </Panel>
)

const RULES = [
  'Deterministic: the same scenario always produces the same result.',
  'Evidence is structural. A path step without evidence cannot exist.',
  'The frontend is a renderer. It computes nothing security relevant.',
  'No LLM takes part in any decision.',
]

function Architecture() {
  const layout = useFlowLayout()
  return (
    <div className="grid gap-6">
      <div className="surface-dark p-5 sm:p-8">
        <Flow
          dark
          spec={SPECTRE_FLOW[layout]}
          label="Web app calls the API, which calls services, then the engine, then the domain model. Services also store runs in SQLite."
        />
      </div>
      <Panel title="Ground rules">
        <ul className="grid gap-2">
          {RULES.map((rule) => (
            <li key={rule} className="flex items-baseline gap-3">
              <span className="cut inline-block h-2 w-3 shrink-0 bg-fuji" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

const STACK = [
  ['Python + FastAPI', 'The engine and the API, with mypy in strict mode.'],
  ['Pydantic v2', 'A strict, versioned scenario schema. Unknown fields are rejected.'],
  ['SQLAlchemy + SQLite', 'Every analysis and simulation is stored and can be reopened.'],
  ['React + TypeScript', 'Strict TypeScript, with TanStack Query and Zod at the boundary.'],
  ['React Flow', 'The attack graph, with every edge clickable down to its evidence.'],
  ['pytest · Vitest · Playwright', 'Golden outcomes for each scenario, and a real browser against the real API.'],
]

const Stack = () => (
  <Panel title="Stack and tests">
    <DetailList items={STACK} />
  </Panel>
)

const LIMITS = [
  ['Modeled, not proven', 'A path it reports is reachable under the modeled rules, which is not proof of real-world exploitability.'],
  ['Local only', 'It has no authentication and is meant to run locally.'],
  ['Synthetic only', 'Scenarios are synthetic. It never touches real cloud infrastructure.'],
]

const Limits = () => (
  <Panel title="Stated plainly">
    <DetailList items={LIMITS} />
  </Panel>
)

/* Sections ---------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'try',
    label: 'Remediation lab',
    title: 'Break the chain.',
    Visual: RemediationLab,
    body: [
      'Finding a path is half the job. The other half is fixing it without breaking what has to keep working. SPECTRE applies a change to a copy of the environment and compares before and after.',
      'Try each change. Two remove the path. Only one of them is a fix.',
    ],
  },
  {
    id: 'evidence',
    label: 'Evidence',
    title: 'A drawn edge is not a finding.',
    Visual: Decisions,
    body: [
      'A finding exists only when a chain of allowed steps reaches a sensitive resource, and every step points at the exact policy statement or trust entry behind it.',
      'The engine models a small, documented subset of IAM on purpose. Anything outside it is rejected loudly, never quietly treated as allowed.',
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    title: 'One direction, no surprises.',
    Visual: Architecture,
    note: 'Highlighted: the engine, pure Python and fully deterministic.',
    body: [
      'A modular monolith: one API process, one web app, one SQLite file. The engine imports neither the web framework nor the database.',
    ],
  },
  {
    id: 'hood',
    label: 'Under the hood',
    title: 'Strict at every boundary.',
    Visual: Stack,
    body: [
      'Types are checked strictly on both sides, and the scenario schema rejects anything it does not know. Each scenario has golden outcomes, and Playwright drives a real browser against the real API.',
    ],
  },
  {
    id: 'limits',
    label: 'Limits',
    title: 'What it does not claim.',
    Visual: Limits,
    body: ['SPECTRE is a work in progress. These are the boundaries of what its results mean today.'],
  },
]

export default function CaseSpectre() {
  useDocumentTitle('SPECTRE')
  return (
    <main>
      <CaseHeader project={P} lede={LEDE} facts={FACTS} art={<HeroGraph />} />
      <CaseSections sections={SECTIONS} />
      <CaseNext from="spectre" />
    </main>
  )
}
