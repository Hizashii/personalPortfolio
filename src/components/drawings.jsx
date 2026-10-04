/* eslint-disable react-refresh/only-export-components */
import { useDrawn } from '../hooks'

/* ---------- primitives ---------- */

function cloudPath(x, y, w, h, pad = 7, step = 15, bulge = 4.5) {
  const x0 = x - pad
  const y0 = y - pad
  const x1 = x + w + pad
  const y1 = y + h + pad
  let p = `M${x0} ${y0}`
  const edge = (ax, ay, bx, by, nx, ny) => {
    const len = Math.hypot(bx - ax, by - ay)
    const n = Math.max(2, Math.round(len / step))
    for (let i = 1; i <= n; i++) {
      const sx = ax + ((bx - ax) * (i - 1)) / n
      const sy = ay + ((by - ay) * (i - 1)) / n
      const ex = ax + ((bx - ax) * i) / n
      const ey = ay + ((by - ay) * i) / n
      p += ` Q${(sx + ex) / 2 + nx * bulge} ${(sy + ey) / 2 + ny * bulge} ${ex} ${ey}`
    }
  }
  edge(x0, y0, x1, y0, 0, -1)
  edge(x1, y0, x1, y1, 1, 0)
  edge(x1, y1, x0, y1, 0, 1)
  edge(x0, y1, x0, y0, -1, 0)
  return p + ' Z'
}

function Node({ n, i = 0, state = '' }) {
  const right = n.anchor === 'end'
  const cx = right ? n.x + n.w - 12 : n.x + n.w / 2
  const anchor = right ? 'end' : 'middle'
  const cls = ['d-box', n.dash && 'd-dash', n.red && 'd-red', n.ext && 'd-ext'].filter(Boolean).join(' ')
  return (
    <g className={`flow-node ${state}`} style={{ '--n': i }}>
      {n.cloud && <path className="d-cloud" d={cloudPath(n.x, n.y, n.w, n.h)} />}
      <rect className={cls} x={n.x} y={n.y} width={n.w} height={n.h} />
      <text className="d-title" x={cx} y={n.s ? n.y + n.h / 2 - 3 : n.y + n.h / 2 + 4.5} textAnchor={anchor}>
        {n.t}
      </text>
      {n.s && (
        <text className="d-note" x={cx} y={n.y + n.h / 2 + 13} textAnchor={anchor}>
          {n.s}
        </text>
      )}
      {n.no && (
        <g className={`d-badge ${n.red ? 'is-red' : ''}`}>
          <circle cx={n.x} cy={n.y} r="9.5" />
          <text x={n.x} y={n.y + 3.6} textAnchor="middle">
            {n.no}
          </text>
        </g>
      )}
    </g>
  )
}

const mid = (a, b) => (a + b) / 2

// Orthogonal path through points, with rounded corners.
function round(points, r = 9) {
  let p = `M${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1]
    const [x, y] = points[i]
    const [nx, ny] = points[i + 1]
    const l1 = Math.hypot(x - px, y - py)
    const l2 = Math.hypot(nx - x, ny - y)
    const k = Math.min(r, l1 / 2, l2 / 2)
    const ax = x - ((x - px) / l1) * k
    const ay = y - ((y - py) / l1) * k
    const bx = x + ((nx - x) / l2) * k
    const by = y + ((ny - y) / l2) * k
    p += ` L${ax} ${ay} Q${x} ${y} ${bx} ${by}`
  }
  const last = points[points.length - 1]
  return p + ` L${last[0]} ${last[1]}`
}

function edgeGeometry(a, b) {
  const acx = a.x + a.w / 2
  const bcx = b.x + b.w / 2
  const acy = a.y + a.h / 2
  const bcy = b.y + b.h / 2
  // same row
  if (Math.abs(acy - bcy) < 4) {
    const right = bcx > acx
    const x1 = right ? a.x + a.w : a.x
    const x2 = right ? b.x : b.x + b.w
    return { d: `M${x1} ${acy} H${x2}`, lx: mid(x1, x2), ly: acy - 6, anchor: 'middle' }
  }
  // same column
  if (Math.abs(acx - bcx) < 4) {
    const down = bcy > acy
    const y1 = down ? a.y + a.h : a.y
    const y2 = down ? b.y : b.y + b.h
    return { d: `M${acx} ${y1} V${y2}`, lx: acx + 7, ly: mid(y1, y2) + 3, anchor: 'start' }
  }
  // b to the right of a: horizontal split
  if (b.x >= a.x + a.w) {
    const x1 = a.x + a.w
    const x2 = b.x
    const mx = mid(x1, x2)
    return { d: round([[x1, acy], [mx, acy], [mx, bcy], [x2, bcy]]), lx: mx + 5, ly: bcy - 6, anchor: 'start' }
  }
  // vertical split
  const down = bcy > acy
  const y1 = down ? a.y + a.h : a.y
  const y2 = down ? b.y : b.y + b.h
  const my = mid(y1, y2)
  return { d: round([[acx, y1], [acx, my], [bcx, my], [bcx, y2]]), lx: bcx + 6, ly: y2 - 8, anchor: 'start' }
}

export function Flow({ spec, label, dark = false, focus = [] }) {
  const ref = useDrawn()
  const byId = Object.fromEntries(spec.nodes.map((n) => [n.id, n]))
  return (
    <svg
      ref={ref}
      className={`drawing ${dark ? 'drawing--dark' : ''}`}
      viewBox={`0 0 ${spec.W} ${spec.H}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="d-arrow" />
        </marker>
        <marker id="arr-red" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="d-arrow d-arrow-red" />
        </marker>
      </defs>
      {(spec.frames || []).map((f) => (
        <g key={f.t}>
          <rect className="d-frame" x={f.x} y={f.y} width={f.w} height={f.h} rx="12" />
          <text className="d-sub d-frame-label" x={f.x + 10} y={f.y + 16}>
            {f.t}
          </text>
        </g>
      ))}
      {spec.edges.map((e, i) => {
        const g = edgeGeometry(byId[e.a], byId[e.b])
        return (
          <g key={i}>
            <path
              d={g.d}
              pathLength="1"
              className={`d-edge flow-edge ${e.red ? 'd-edge-red' : ''} ${e.dash ? 'd-dash-edge' : ''}`}
              style={{ '--i': i }}
              markerEnd={e.red ? 'url(#arr-red)' : 'url(#arr)'}
            />
            {!e.dash && <path d={g.d} className={`flow-pulse ${e.red ? 'is-red' : ''}`} />}
            {e.t && (
              <text className={`d-sub d-edge-label ${e.red ? 'is-red' : ''}`} x={g.lx} y={g.ly} textAnchor={g.anchor}>
                {e.t}
              </text>
            )}
          </g>
        )
      })}
      {spec.nodes.map((n, i) => (
        <Node key={n.id} n={n} i={i} state={focus.length ? (focus.includes(n.id) ? 'is-focus' : 'is-dim') : ''} />
      ))}
    </svg>
  )
}

/* ---------- flow specs (wide / narrow) ---------- */

const chain = (
  [x0, step, w, y, h],
  names,
) => names.map(([id, t, s], i) => ({ id, t, s, no: i + 1, x: x0 + i * step, y, w, h }))

const PIPE_NAMES = [
  ['discover', 'Discover', 'find roles'],
  ['match', 'Match', 'score fit'],
  ['prepare', 'Prepare', 'tailor'],
  ['submit', 'Submit', 'send'],
  ['track', 'Track', 'record'],
]

const happyEdges = [
  { a: 'discover', b: 'match' },
  { a: 'match', b: 'prepare' },
  { a: 'prepare', b: 'submit' },
  { a: 'submit', b: 'track' },
]

export const PIPELINE = {
  happy: {
    wide: {
      W: 736,
      H: 96,
      nodes: chain([0, 161, 92, 24, 48], PIPE_NAMES),
      edges: happyEdges,
    },
    narrow: {
      W: 340,
      H: 340,
      nodes: PIPE_NAMES.map(([id, t, s], i) => ({ id, t, s, no: i + 1, x: 106, y: 8 + i * 66, w: 128, h: 46 })),
      edges: happyEdges,
    },
  },
  failure: {
    wide: {
      W: 736,
      H: 290,
      nodes: [
        ...chain([0, 161, 92, 24, 48], PIPE_NAMES),
        { id: 'classify', t: 'Classify', s: 'what failed?', x: 483, y: 124, w: 92, h: 48, red: true },
        { id: 'retry', t: 'Retry', s: 'with backoff', x: 322, y: 124, w: 92, h: 48 },
        { id: 'park', t: 'Park', s: 'flag the form', x: 644, y: 124, w: 92, h: 48 },
        { id: 'manual', t: 'Manual review', s: 'person decides', x: 624, y: 214, w: 112, h: 48, red: true, dash: true, cloud: true },
      ],
      edges: [
        ...happyEdges,
        { a: 'submit', b: 'classify', red: true, t: 'failed' },
        { a: 'classify', b: 'retry', red: true, t: 'transient' },
        { a: 'retry', b: 'prepare', red: true, t: 'again' },
        { a: 'classify', b: 'park', red: true, t: 'changed' },
        { a: 'park', b: 'manual', red: true, t: 'hand off' },
      ],
    },
    narrow: {
      W: 340,
      H: 460,
      nodes: [
        ...chain([16, 0, 128, 8, 46], [PIPE_NAMES[0]]),
        { ...PIPE_NAMES_NODE(PIPE_NAMES[1]), x: 16, y: 82, w: 128, h: 46 },
        { ...PIPE_NAMES_NODE(PIPE_NAMES[2]), x: 16, y: 156, w: 128, h: 46 },
        { ...PIPE_NAMES_NODE(PIPE_NAMES[3]), x: 16, y: 230, w: 128, h: 46 },
        { ...PIPE_NAMES_NODE(PIPE_NAMES[4]), x: 16, y: 304, w: 128, h: 46 },
        { id: 'retry', t: 'Retry', s: 'with backoff', x: 196, y: 156, w: 128, h: 46 },
        { id: 'classify', t: 'Classify', s: 'what failed?', x: 196, y: 230, w: 128, h: 46, red: true },
        { id: 'park', t: 'Park', s: 'flag the form', x: 196, y: 304, w: 128, h: 46 },
        { id: 'manual', t: 'Manual review', s: 'person decides', x: 196, y: 378, w: 128, h: 46, red: true, dash: true, cloud: true },
      ],
      edges: [
        ...happyEdges,
        { a: 'submit', b: 'classify', red: true, t: 'failed' },
        { a: 'classify', b: 'retry', red: true, t: 'transient' },
        { a: 'retry', b: 'prepare', red: true, t: 'again' },
        { a: 'classify', b: 'park', red: true, t: 'changed' },
        { a: 'park', b: 'manual', red: true, t: 'hand off' },
      ],
    },
  },
}

function PIPE_NAMES_NODE([id, t, s]) {
  return { id, t, s, no: PIPE_NAMES.findIndex((p) => p[0] === id) + 1 }
}

export const MODEL_SEAM = {
  wide: {
    W: 736,
    H: 150,
    nodes: [
      { id: 'agent', t: 'Agent', s: 'asks for an answer', x: 0, y: 52, w: 140, h: 46 },
      { id: 'seam', t: 'Model interface', s: 'one contract', x: 228, y: 52, w: 160, h: 46, red: true },
      { id: 'gemini', t: 'Gemini 2.5 Flash', s: 'today', x: 520, y: 4, w: 160, h: 46 },
      { id: 'local', t: 'Local model', s: 'in training', x: 520, y: 104, w: 160, h: 46, dash: true, cloud: true },
    ],
    edges: [
      { a: 'agent', b: 'seam' },
      { a: 'seam', b: 'gemini' },
      { a: 'seam', b: 'local', dash: true },
    ],
  },
  narrow: {
    W: 340,
    H: 290,
    nodes: [
      { id: 'agent', t: 'Agent', s: 'asks for an answer', x: 90, y: 8, w: 160, h: 46 },
      { id: 'seam', t: 'Model interface', s: 'one contract', x: 90, y: 84, w: 160, h: 46, red: true },
      { id: 'gemini', t: 'Gemini 2.5 Flash', s: 'today', x: 8, y: 196, w: 150, h: 46 },
      { id: 'local', t: 'Local model', s: 'in training', x: 182, y: 196, w: 150, h: 46, dash: true, cloud: true },
    ],
    edges: [
      { a: 'agent', b: 'seam' },
      { a: 'seam', b: 'gemini' },
      { a: 'seam', b: 'local', dash: true },
    ],
  },
}

export const LAB_BOUNDARY = {
  wide: {
    W: 736,
    H: 270,
    frames: [{ t: 'Docker network · no direct internet', x: 168, y: 8, w: 400, h: 254 }],
    nodes: [
      { id: 'api', t: 'Applyer API', x: 0, y: 112, w: 112, h: 46 },
      { id: 'agents', t: 'Agent network', s: 'discover · fill · review', x: 184, y: 56, w: 196, h: 48, dash: true },
      { id: 'model', t: 'Local model', s: 'in training', x: 184, y: 168, w: 196, h: 48, dash: true },
      { id: 'gateway', t: 'Gateway', s: 'allow-list', x: 420, y: 112, w: 128, h: 46, dash: true, red: true },
      { id: 'out', t: 'Approved sites', x: 624, y: 112, w: 112, h: 46, ext: true },
    ],
    edges: [
      { a: 'api', b: 'agents', dash: true },
      { a: 'model', b: 'agents', dash: true },
      { a: 'agents', b: 'gateway', dash: true },
      { a: 'gateway', b: 'out', dash: true, red: true },
    ],
  },
  narrow: {
    W: 340,
    H: 470,
    frames: [{ t: 'Docker network · no direct internet', x: 8, y: 78, w: 324, h: 290 }],
    nodes: [
      { id: 'api', t: 'Applyer API', x: 96, y: 4, w: 148, h: 40 },
      { id: 'agents', t: 'Agent network', s: 'discover · fill · review', x: 56, y: 116, w: 228, h: 48, dash: true },
      { id: 'model', t: 'Local model', s: 'in training', x: 56, y: 206, w: 228, h: 48, dash: true },
      { id: 'gateway', t: 'Gateway', s: 'allow-list', x: 96, y: 296, w: 148, h: 46, dash: true, red: true },
      { id: 'out', t: 'Approved sites', x: 96, y: 420, w: 148, h: 40, ext: true },
    ],
    edges: [
      { a: 'api', b: 'agents', dash: true },
      { a: 'model', b: 'agents', dash: true },
      { a: 'agents', b: 'gateway', dash: true },
      { a: 'gateway', b: 'out', dash: true, red: true },
    ],
  },
}

export const SPIS_FLOW = {
  wide: {
    W: 736,
    H: 150,
    nodes: [
      { id: 'guest', t: 'Guest app', s: 'phone', x: 0, y: 4, w: 130, h: 46 },
      { id: 'queue', t: 'The queue', s: 'shared list', x: 303, y: 4, w: 130, h: 46, red: true },
      { id: 'dash', t: 'Dashboard', s: 'tablet or laptop', x: 606, y: 4, w: 130, h: 46 },
      { id: 'ping', t: 'Notification', s: 'table is ready', x: 303, y: 100, w: 130, h: 46 },
    ],
    edges: [
      { a: 'guest', b: 'queue', t: 'joins' },
      { a: 'dash', b: 'queue', t: 'calls in' },
      { a: 'queue', b: 'ping', t: 'pings' },
    ],
  },
  narrow: {
    W: 340,
    H: 290,
    nodes: [
      { id: 'guest', t: 'Guest app', s: 'phone', x: 16, y: 8, w: 128, h: 46 },
      { id: 'queue', t: 'The queue', s: 'shared list', x: 16, y: 98, w: 128, h: 46, red: true },
      { id: 'dash', t: 'Dashboard', s: 'tablet or laptop', x: 16, y: 188, w: 128, h: 46 },
      { id: 'ping', t: 'Notification', s: 'table is ready', x: 196, y: 98, w: 128, h: 46 },
    ],
    edges: [
      { a: 'guest', b: 'queue', t: 'joins' },
      { a: 'dash', b: 'queue', t: 'calls in' },
      { a: 'queue', b: 'ping', t: 'pings' },
    ],
  },
}

export const MINWIN_FLOW = {
  wide: {
    W: 736,
    H: 96,
    nodes: [
      { id: 'bench', no: 1, t: 'Benchmark', s: 'measure first', x: 0, y: 24, w: 118, h: 48, dash: true },
      { id: 'apply', no: 2, t: 'Apply', s: 'a TOML profile', x: 206, y: 24, w: 118, h: 48, dash: true },
      { id: 'diff', no: 3, t: 'Diff', s: 'what changed', x: 412, y: 24, w: 118, h: 48, dash: true },
      { id: 'roll', no: 4, t: 'Rollback', s: 'every change', x: 618, y: 24, w: 118, h: 48, dash: true, red: true },
    ],
    edges: [
      { a: 'bench', b: 'apply', dash: true },
      { a: 'apply', b: 'diff', dash: true },
      { a: 'diff', b: 'roll', dash: true, red: true, t: 'undo' },
    ],
  },
  narrow: {
    W: 340,
    H: 274,
    nodes: [
      { id: 'bench', no: 1, t: 'Benchmark', s: 'measure first', x: 106, y: 8, w: 128, h: 46, dash: true },
      { id: 'apply', no: 2, t: 'Apply', s: 'a TOML profile', x: 106, y: 74, w: 128, h: 46, dash: true },
      { id: 'diff', no: 3, t: 'Diff', s: 'what changed', x: 106, y: 140, w: 128, h: 46, dash: true },
      { id: 'roll', no: 4, t: 'Rollback', s: 'every change', x: 106, y: 206, w: 128, h: 46, dash: true, red: true },
    ],
    edges: [
      { a: 'bench', b: 'apply', dash: true },
      { a: 'apply', b: 'diff', dash: true },
      { a: 'diff', b: 'roll', dash: true, red: true, t: 'undo' },
    ],
  },
}

/* ---------- Applyer: layered section and UI elevation ---------- */

const ROWS = [
  { layer: 'Interface', boxes: [{ t: 'Web app', s: 'TypeScript' }] },
  { layer: 'Application', boxes: [{ t: 'API' }, { t: 'Auth' }, { t: 'Job queue' }] },
  { layer: 'Agents', tag: 'in progress', boxes: [{ t: 'Discover', d: 1 }, { t: 'Fill forms', d: 1 }, { t: 'Review', d: 1 }] },
  { layer: 'Model', boxes: [{ t: 'Gemini 2.5 Flash', s: 'today' }, { t: 'Local model', s: 'in training', d: 1, cloud: 1 }] },
  { layer: 'Data', boxes: [{ t: 'Supabase', s: 'Postgres' }, { t: 'DuckDB', s: 'job store' }] },
  { layer: 'Infrastructure', boxes: [{ t: 'Oracle Cloud VM' }, { t: 'Docker' }] },
  { layer: 'Delivery', boxes: [{ t: 'Terraform' }, { t: 'Ansible' }] },
  { layer: 'External', boxes: [{ t: 'Private jobs API', ext: 1 }] },
]

function layoutRows(narrow, roomy) {
  const gap = 12
  return ROWS.map((row, i) => {
    const y = narrow ? 8 + i * (roomy ? 70 : 58) : 16 + i * (roomy ? 66 : 52)
    const bh = narrow ? 38 : roomy ? 40 : 34
    const by = narrow ? y + 20 : y
    const x0 = narrow ? 0 : 128
    const area = narrow ? 340 : 608
    const n = row.boxes.length
    const w = (area - gap * (n - 1)) / n
    const boxes = row.boxes.map((b, k) => ({ ...b, x: x0 + k * (w + gap), y: by, w, h: bh, anchor: narrow ? undefined : 'end', dash: b.d ? true : undefined }))
    return { ...row, y, by, bh, boxes }
  })
}

export function SectionDrawing({ narrow, className = '', roomy = false }) {
  const rows = layoutRows(narrow, roomy)
  const W = narrow ? 340 : 736
  const H = narrow ? 8 + ROWS.length * (roomy ? 70 : 58) : 16 + ROWS.length * (roomy ? 66 : 52) - 2
  return (
    <svg
      className={`drawing ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {rows.map((row, i) => {
        const next = rows[i + 1]
        return (
          <g key={row.layer}>
            <text
              className="d-sub d-layer"
              x={narrow ? 0 : 736}
              y={narrow ? row.y + 11 : row.y - 6}
              textAnchor={narrow ? 'start' : 'end'}
            >
              {row.layer}
              {row.tag ? ` · ${row.tag}` : ''}
            </text>
            {next &&
              row.boxes.map((b, k) => {
                const cx = b.x + b.w / 2
                const hit = next.boxes.find((nb) => cx > nb.x + 8 && cx < nb.x + nb.w - 8)
                const to = hit ? cx : null
                return to ? (
                  <line key={k} className="d-edge" x1={to} y1={b.y + b.h} x2={to} y2={next.by} />
                ) : null
              })}
            {row.boxes.map((b) => (
              <Node key={b.t} n={b} />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

const STATUS = ['Applied', 'Queued', 'Applied', 'Needs review', 'Queued', 'Applied']

export function ElevationDrawing({ narrow, className = '' }) {
  if (narrow) {
    return (
      <svg className={`drawing ${className}`} viewBox="0 0 340 482" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <rect className="d-box" x="30" y="4" width="280" height="474" rx="20" />
        <rect className="d-fill" x="50" y="28" width="120" height="14" />
        <rect className="d-bar" x="50" y="50" width="190" height="7" />
        {STATUS.map((s, i) => {
          const y = 84 + i * 64
          const red = s === 'Needs review'
          return (
            <g key={i}>
              <rect className="d-box" x="50" y={y} width="22" height="22" />
              <rect className="d-fill" x="84" y={y + 2} width="104" height="8" />
              <rect className="d-bar" x="84" y={y + 16} width="70" height="6" />
              <rect className={`d-box ${red ? 'd-red' : ''}`} x="204" y={y} width="86" height="22" />
              <text className={`d-sub ${red ? 'is-red' : ''}`} x="247" y={y + 15} textAnchor="middle">
                {s}
              </text>
              <rect className="d-track" x="84" y={y + 36} width="206" height="3" />
              <rect className="d-fill" x="84" y={y + 36} width={[206, 120, 206, 70, 40, 206][i]} height="3" />
            </g>
          )
        })}
      </svg>
    )
  }
  const NAV = ['Applications', 'Needs review', 'Sources', 'Settings']
  return (
    <svg className={`drawing ${className}`} viewBox="0 0 736 440" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <rect className="d-box" x="128" y="16" width="608" height="408" />
      <line className="d-edge" x1="128" y1="46" x2="736" y2="46" />
      <text className="d-title" x="144" y="36">
        Applyer
      </text>
      <line className="d-edge" x1="244" y1="46" x2="244" y2="424" />
      {NAV.map((t, i) => (
        <text key={t} className={i === 0 ? 'd-title' : 'd-sub'} x="144" y={76 + i * 28}>
          {t}
        </text>
      ))}
      <text className="d-title d-h" x="264" y="78">
        Applications
      </text>
      <text className="d-sub" x="264" y="98">
        6 this week · status per application
      </text>
      <line className="d-edge" x1="264" y1="112" x2="720" y2="112" />
      {STATUS.map((s, i) => {
        const y = 126 + i * 46
        const red = s === 'Needs review'
        return (
          <g key={i}>
            <rect className="d-box" x="264" y={y} width="24" height="24" />
            <rect className="d-fill" x="304" y={y + 3} width="116" height="8" />
            <rect className="d-bar" x="304" y={y + 17} width="76" height="6" />
            <rect className={`d-box ${red ? 'd-red' : ''}`} x="440" y={y + 1} width="96" height="22" />
            <text className={`d-sub ${red ? 'is-red' : ''}`} x="488" y={y + 16} textAnchor="middle">
              {s}
            </text>
            <rect className="d-track" x="560" y={y + 10} width="130" height="4" />
            <rect className="d-fill" x="560" y={y + 10} width={[130, 76, 130, 44, 28, 130][i]} height="4" />
            <line className="d-edge d-hair" x1="264" y1={y + 36} x2="720" y2={y + 36} />
          </g>
        )
      })}
      <text className="d-sub is-red" x="8" y="270">
        Needs review:
      </text>
      <text className="d-sub is-red" x="8" y="284">
        a person decides
      </text>
      <path className="d-edge d-edge-red" d="M112 277 H258" markerEnd="url(#arr-red-el)" />
      <defs>
        <marker id="arr-red-el" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="d-arrow d-arrow-red" />
        </marker>
      </defs>
    </svg>
  )
}
