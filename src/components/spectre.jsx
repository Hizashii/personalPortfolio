import { useId, useState } from 'react'

/*
  SPECTRE: the Northstar Financial scenario from the README, replayed in the browser.
  A tiny reachability check, not the real policy engine.
*/
const SP_NODES = [
  { id: 'alice', kind: 'user', t: 'Alice', x: 70, y: 84 },
  { id: 'ci', kind: 'role', t: 'CI deployer', x: 260, y: 84 },
  { id: 'runtime', kind: 'role', t: 'App runtime', x: 450, y: 84 },
  { id: 'secret', kind: 'secret', t: 'DB credentials', x: 450, y: 224, restricted: true },
  { id: 'db', kind: 'database', t: 'Customer DB', x: 260, y: 224, restricted: true },
  { id: 'artifacts', kind: 'bucket', t: 'Build artifacts', x: 70, y: 224 },
]
// sid: the policy statement that backs the edge. The secret-to-database edge is a modeled relationship.
// clearA / clearB: the edge leaves or enters through a node's labels, so it stops short of them.
const SP_EDGES = [
  { a: 'alice', b: 'ci', sid: 'assume-ci', lx: 165, ly: 72 },
  { a: 'ci', b: 'runtime', sid: 'assume-runtime', lx: 355, ly: 72 },
  { a: 'runtime', b: 'secret', sid: 'read-db-secret', lx: 440, ly: 158, anchor: 'end', clearA: true, clearB: true },
  { a: 'secret', b: 'db', t: 'credential access', lx: 355, ly: 212, modeled: true },
  { a: 'ci', b: 'artifacts', sid: 'artifacts-rw', lx: 178, ly: 160, anchor: 'start', clearA: true },
]
const SP_LEGIT = [
  { needs: 'assume-ci', t: 'Developers can use the CI deployer role' },
  { needs: 'artifacts-rw', t: 'CI can publish build artifacts' },
]
const SP_CHANGES = [
  { sid: null, t: 'No change', policy: 'The scenario as loaded' },
  { sid: 'assume-runtime', t: 'Remove assume-runtime', policy: 'CI deployer permissions' },
  { sid: 'assume-ci', t: 'Remove assume-ci', policy: 'Developer may assume the CI deployer' },
  {
    sid: 'read-db-secret',
    t: 'Remove read-db-secret',
    policy: 'Runtime may read its database secret',
    caveat:
      'Effective, and yet the app can no longer read its own database password. Nothing declared that it must, so the model cannot know. A verdict is only as good as the access you declare.',
  },
]
const SP_KIND = { user: 'USER', role: 'ROLE', secret: 'SECRET', database: 'DATABASE', bucket: 'BUCKET' }

const spById = Object.fromEntries(SP_NODES.map((n) => [n.id, n]))

/* Analysis ---------------------------------------------------------------- */

// Breadth-first from Alice over the edges that survive the change.
function reachFrom(live) {
  const depth = { alice: 0 }
  const queue = ['alice']
  while (queue.length) {
    const at = queue.shift()
    for (const e of live) {
      if (e.a === at && !(e.b in depth)) {
        depth[e.b] = depth[at] + 1
        queue.push(e.b)
      }
    }
  }
  return depth
}

// An edge is on an attack path when it leads to a reached restricted node.
function hotEdges(live, depth, findings) {
  const hot = new Set()
  const back = findings.map((f) => f.id)
  while (back.length) {
    const to = back.pop()
    for (const e of live) {
      if (e.b === to && e.a in depth && !hot.has(e)) {
        hot.add(e)
        back.push(e.a)
      }
    }
  }
  return hot
}

function analyse(removed) {
  const live = SP_EDGES.filter((e) => !e.sid || e.sid !== removed)
  const depth = reachFrom(live)
  const findings = SP_NODES.filter((n) => n.restricted && n.id in depth).map((n) => ({ ...n, steps: depth[n.id] }))
  const legit = SP_LEGIT.map((l) => ({ ...l, pass: l.needs !== removed }))
  return { depth, hot: hotEdges(live, depth, findings), findings, legit, objective: !('db' in depth) }
}

const SP_BASE = analyse(null)

function verdict(result, removed) {
  if (!removed) {
    return { ok: false, t: `${result.findings.length} critical findings`, s: 'Alice can reach the customer database. The objective is violated.' }
  }
  if (result.legit.some((l) => !l.pass)) {
    return { ok: false, t: 'Breaks legitimate access', s: 'The path is gone, and so is something that must keep working. Removing a path is not a fix if it breaks the product.' }
  }
  if (!result.findings.length) {
    return { ok: true, t: 'Effective under the modeled rules', s: 'Every finding resolved, the objective holds, and legitimate access is intact.' }
  }
  return { ok: false, t: 'Partial', s: 'Some paths remain.' }
}

/* Graph ------------------------------------------------------------------- */

function edgePath(e, R, compact) {
  const a = spById[e.a]
  const b = spById[e.b]
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const ux = (b.x - a.x) / len
  const uy = (b.y - a.y) / len
  const pa = R + (e.clearA ? (compact ? 34 : 30) : 6)
  const pb = R + (e.clearB ? (compact ? 8 : 26) : 6)
  return {
    d: `M${a.x + ux * pa} ${a.y + uy * pa} L${b.x - ux * pb} ${b.y - uy * pb}`,
    cross: `M${(a.x + b.x) / 2 - 7} ${(a.y + b.y) / 2 - 7}l14 14m0 -14l-14 14`,
  }
}

function GraphEdge({ e, result, removed, R, compact, markerId }) {
  const { d, cross } = edgePath(e, R, compact)
  const cut = e.sid && e.sid === removed
  const hot = result.hot.has(e)
  const state = cut ? 'is-cut' : hot ? 'is-hot' : e.a in result.depth ? 'is-ok' : 'is-idle'
  return (
    <g className={`sp-e ${state} ${e.modeled ? 'is-modeled' : ''}`}>
      <path d={d} markerEnd={cut ? undefined : `url(#${markerId}${hot ? 'h' : 'a'})`} />
      {hot && <path d={d} className="sp-flow" />}
      {cut && <path className="sp-x" d={cross} />}
      {!compact && (
        <text x={e.lx} y={e.ly} textAnchor={e.anchor || 'middle'} className="sp-elabel">
          {e.sid || e.t}
        </text>
      )}
    </g>
  )
}

function GraphNode({ n, reached, R, compact }) {
  const cls = ['sp-n', reached && 'is-reached', n.restricted && 'is-restricted', n.id === 'alice' && 'is-entry']
  return (
    <g className={cls.filter(Boolean).join(' ')}>
      {n.restricted && <circle cx={n.x} cy={n.y} r={R + 6} className="sp-ring" />}
      <circle cx={n.x} cy={n.y} r={R} className="sp-dot" />
      {!compact && (
        <text x={n.x} y={n.y - R - 12} textAnchor="middle" className="sp-kind">
          {SP_KIND[n.kind]}
        </text>
      )}
      <text x={n.x} y={n.y + R + (compact ? 26 : 22)} textAnchor="middle" className="sp-name">
        {n.t}
      </text>
    </g>
  )
}

function Markers({ id }) {
  return (
    <defs>
      <marker id={`${id}a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L8 4 L0 8 z" className="sp-head" />
      </marker>
      <marker id={`${id}h`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L8 4 L0 8 z" className="sp-head is-hot" />
      </marker>
    </defs>
  )
}

// Drawn for an indigo surface. `removed` is the statement taken out, if any.
export function AttackGraph({ removed = null, compact = false, label }) {
  const result = removed ? analyse(removed) : SP_BASE
  const R = compact ? 13 : 10
  // Marker ids must be unique, since several graphs can share a page.
  const id = useId()
  const shared = { R, compact }
  return (
    <svg
      className={`sp-graph ${compact ? 'is-compact' : ''}`}
      viewBox="0 0 520 300"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <Markers id={id} />
      {SP_EDGES.map((e) => (
        <GraphEdge key={e.a + e.b} e={e} result={result} removed={removed} markerId={id} {...shared} />
      ))}
      {SP_NODES.map((n) => (
        <GraphNode key={n.id} n={n} reached={n.id in result.depth} {...shared} />
      ))}
    </svg>
  )
}

/* Remediation lab --------------------------------------------------------- */

function ChangePicker({ pick, setPick }) {
  return (
    <fieldset>
      <legend className="text-meta font-semibold text-ai-muted">Change one statement</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {SP_CHANGES.map((change, i) => (
          <label
            key={change.t}
            className={`flex min-h-14 cursor-pointer items-start gap-3 border p-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-ai ${pick === i ? 'border-ai bg-fuji/25' : 'border-ai/20 hover:border-ai/50'}`}
          >
            <input type="radio" name="sp-change" checked={pick === i} onChange={() => setPick(i)} className="mt-1 accent-ai" />
            <span>
              <span className="block text-small font-semibold">{change.t}</span>
              <span className="block text-meta text-ai-muted">{change.policy}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Check({ term, pass, children }) {
  return (
    <div className="grid gap-1 border-t border-ai/15 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-meta font-semibold text-ai-muted">{term}</dt>
      <dd className={`text-small ${pass === undefined ? '' : pass ? 'text-ok' : 'text-alert'}`}>{children}</dd>
    </div>
  )
}

function Readout({ result, change }) {
  const v = verdict(result, change.sid)
  const findings = result.findings.length
    ? result.findings.map((f) => `${f.t}, ${f.steps} steps`).join(' · ')
    : `None (was ${SP_BASE.findings.length})`
  return (
    <div aria-live="polite">
      <p className={`border-l-4 pl-4 ${v.ok ? 'border-ok' : 'border-alert'}`}>
        <b className={`block font-semibold ${v.ok ? 'text-ok' : 'text-alert'}`}>{v.t}</b>
        <span className="block text-small">{change.caveat || v.s}</span>
      </p>
      <dl className="mt-5">
        <Check term="Findings">{findings}</Check>
        <Check term="Objective" pass={result.objective}>
          Alice must not reach the customer DB: {result.objective ? 'holds' : 'violated'}
        </Check>
        {result.legit.map((l) => (
          <Check key={l.needs} term="Must keep working" pass={l.pass}>
            {l.t}: {l.pass ? 'passes' : 'broken'}
          </Check>
        ))}
      </dl>
    </div>
  )
}

export function RemediationLab() {
  const [pick, setPick] = useState(0)
  const change = SP_CHANGES[pick]
  const result = change.sid ? analyse(change.sid) : SP_BASE
  const reached = result.findings.map((f) => f.t).join(' and ')
  return (
    <div>
      <div className="grid gap-6 border border-ai/15 p-4 sm:p-6">
        <p className="flex flex-wrap justify-between gap-x-4 text-meta text-ai-muted">
          <span className="font-semibold text-ai">northstar-financial · remediation lab</span>
          <span>Replayed in your browser</span>
        </p>
        <ChangePicker pick={pick} setPick={setPick} />
        <div className="surface-dark aspect-[520/300] p-4 sm:p-6">
          <AttackGraph
            removed={change.sid}
            label={`Attack graph. ${reached ? `Alice reaches ${reached}.` : 'Alice reaches nothing sensitive.'}`}
          />
        </div>
        <Readout result={result} change={change} />
      </div>
      <p className="mt-3 text-meta text-ai-muted">
        The README walkthrough, recomputed with a few lines of JavaScript. The real engine is Python, evaluates
        policies and keeps evidence for every step.
      </p>
    </div>
  )
}
