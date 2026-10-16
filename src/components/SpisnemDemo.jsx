import { useState } from 'react'
import { Icon } from './ui'

// A guest phone and a restaurant dashboard sharing one queue. Demo data only.
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
const SEATED_TODAY = 42
const BELL = 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4'

/* State ------------------------------------------------------------------- */

function useQueueDemo() {
  const [placeId, setPlaceId] = useState('nordic')
  const [queue, setQueue] = useState(START)
  const [seated, setSeated] = useState(SEATED_TODAY)
  const place = PLACES.find((p) => p.id === placeId)
  const waiting = queue.filter((q) => q.state !== 'seated')
  const me = queue.find((q) => q.id === 'me')
  const setState = (id, state) => setQueue((list) => list.map((q) => (q.id === id ? { ...q, state } : q)))

  return {
    place, waiting, seated,
    screen: !me ? 'map' : me.state === 'waiting' ? 'wait' : me.state,
    position: me ? waiting.findIndex((q) => q.id === 'me') + 1 : 0,
    pick: setPlaceId,
    join: () => setQueue((list) => [...list, { id: 'me', name: 'You (demo)', size: 2, waited: 0, quote: place.wait, state: 'waiting' }]),
    leave: () => setQueue((list) => list.filter((q) => q.id !== 'me')),
    call: (id) => setState(id, 'notified'),
    seat: (id) => {
      setState(id, 'seated')
      setSeated((n) => n + 1)
    },
    reset: () => {
      setQueue(START)
      setSeated(SEATED_TODAY)
      setPlaceId('nordic')
    },
  }
}

/* Guest phone ------------------------------------------------------------- */

function MapPin({ place, on, pick }) {
  return (
    <button
      type="button"
      className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5"
      style={{ left: `${place.x}%`, top: `${place.y}%` }}
      onClick={() => pick(place.id)}
      aria-pressed={on}
      aria-label={`${place.name}, ${place.wait} minute wait`}
    >
      <span className={`block border px-1.5 text-meta font-semibold tabular-nums ${on ? 'border-ai bg-ai text-gofun' : 'border-ai/40 bg-gofun'}`}>
        {place.wait}m
      </span>
    </button>
  )
}

function MapScreen({ demo }) {
  const { place } = demo
  return (
    <div className="flex h-full flex-col">
      <p className="m-3 border border-ai/20 px-3 py-2 text-meta text-ai-muted">Search name or cuisine</p>
      <div className="relative flex-1 bg-ai/5" role="group" aria-label="Map of nearby restaurants">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40C20 34 40 44 62 30S90 24 100 28V60H0Z" className="fill-fuji/40" />
          <path d="M10 0V60M34 0V60M60 0V60M86 0V60M0 12H100M0 34H100M0 52H100" className="fill-none stroke-ai/15" vectorEffect="non-scaling-stroke" />
        </svg>
        {PLACES.map((p) => (
          <MapPin key={p.id} place={p} on={p.id === place.id} pick={demo.pick} />
        ))}
      </div>
      <div className="grid gap-3 border-t border-ai/15 p-3">
        <p className="text-meta text-ai-muted">Nearby · {PLACES.length}</p>
        <p>
          <b className="block font-semibold">{place.name}</b>
          <span className="text-meta text-ai-muted">
            {place.kind} · ★ {place.rating}
          </span>
        </p>
        <button type="button" className="btn btn-primary" onClick={demo.join}>
          Join queue · {place.wait} min
        </button>
      </div>
    </div>
  )
}

function PlaceRing({ position }) {
  const progress = Math.min(1, 1 - (position - 1) / 6)
  return (
    <div className="relative mx-auto size-32">
      <svg className="size-full -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="34" className="fill-none stroke-ai/10" strokeWidth="6" />
        <circle cx="40" cy="40" r="34" className="fill-none stroke-ai" strokeWidth="6" pathLength="1" strokeDasharray={`${progress} 1`} />
      </svg>
      <p className="absolute inset-0 grid place-content-center text-center">
        <small className="text-meta text-ai-muted">You&rsquo;re</small>
        <b className="text-h2 font-semibold tabular-nums">#{position}</b>
      </p>
    </div>
  )
}

function Ticket({ place, art, title, note, action }) {
  return (
    <div className="grid h-full content-center justify-items-center gap-4 p-6 text-center">
      <p className="text-meta font-semibold text-ai-muted">{place.name}</p>
      {art}
      <p className="text-h3 font-semibold">{title}</p>
      {note && <p className="text-small text-ai-muted">{note}</p>}
      {action}
    </div>
  )
}

const BELL_ART = (
  <span className="cut grid h-16 w-20 place-content-center bg-fuji">
    <Icon d={BELL} size={30} />
  </span>
)

function TicketScreen({ demo }) {
  const { place, position, screen } = demo
  const leave = (label) => (
    <button type="button" className="link min-h-11 text-small" onClick={demo.leave}>
      {label}
    </button>
  )
  if (screen === 'wait') {
    return (
      <Ticket
        place={place}
        art={<PlaceRing position={position} />}
        title={`About ${Math.max(2, position * 4)} min`}
        note="Go for a walk. We’ll ping you when your table is ready."
        action={leave('Leave the queue')}
      />
    )
  }
  if (screen === 'notified') {
    return <Ticket place={place} art={BELL_ART} title="Your table is ready" note="Head over. The host will seat you." />
  }
  return <Ticket place={place} title="Enjoy your meal." action={leave('Done')} />
}

function GuestPhone({ demo }) {
  return (
    <figure className="mx-auto w-full max-w-[17rem]">
      <div className="h-[31rem] overflow-hidden rounded-[2rem] border-[6px] border-ai bg-gofun" aria-live="polite">
        {demo.screen === 'map' ? <MapScreen demo={demo} /> : <TicketScreen demo={demo} />}
      </div>
      <figcaption className="mt-3 text-center text-meta text-ai-muted">Guest phone</figcaption>
    </figure>
  )
}

/* Restaurant dashboard ---------------------------------------------------- */

function Stats({ waiting, seated }) {
  const stats = [
    ['Waiting', waiting],
    ['Avg quote', '18 min'],
    ['Seated today', seated],
  ]
  return (
    <dl className="grid grid-cols-3 border-y border-ai/15">
      {stats.map(([label, value], i) => (
        <div key={label} className={`p-3 ${i === 2 ? 'bg-fuji/30' : ''} ${i ? 'border-l border-ai/15' : ''}`}>
          <dt className="text-meta text-ai-muted">{label}</dt>
          <dd className="text-h3 font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function RowAction({ party, demo }) {
  if (party.state !== 'notified') {
    return (
      <button type="button" className="btn btn-secondary min-h-11 px-3 py-1.5 text-small" onClick={() => demo.call(party.id)}>
        Call in
      </button>
    )
  }
  return (
    <span className="flex items-center gap-3">
      <span className="text-meta font-semibold text-ok">Notified</span>
      <button type="button" className="btn btn-primary min-h-11 px-3 py-1.5 text-small" onClick={() => demo.seat(party.id)}>
        Seat
      </button>
    </span>
  )
}

function QueueRow({ party, n, demo }) {
  return (
    <li className={`grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 border-t border-ai/10 px-3 py-2.5 ${party.id === 'me' ? 'bg-fuji/25' : ''}`}>
      <span className="text-meta font-semibold tabular-nums text-ai-muted">{n}</span>
      <span>
        <b className="block text-small font-semibold">{party.name}</b>
        <span className="text-meta tabular-nums text-ai-muted">
          Party of {party.size} · {party.waited} / {party.quote} min
        </span>
      </span>
      <RowAction party={party} demo={demo} />
    </li>
  )
}

function Dashboard({ demo }) {
  return (
    <figure className="min-w-0">
      <div className="border border-ai/15 bg-gofun">
        <div className="flex items-start justify-between gap-4 p-4">
          <div>
            <h3 className="font-semibold">Queue</h3>
            <p className="text-meta text-ai-muted">Friday · dinner service</p>
          </div>
          <button type="button" className="link min-h-11 text-meta" onClick={demo.reset}>
            Reset
          </button>
        </div>
        <Stats waiting={demo.waiting.length} seated={demo.seated} />
        <ul>
          {demo.waiting.map((party, i) => (
            <QueueRow key={party.id} party={party} n={i + 1} demo={demo} />
          ))}
          {!demo.waiting.length && <li className="p-4 text-small text-ai-muted">Nobody waiting.</li>}
        </ul>
      </div>
      <figcaption className="mt-3 text-meta text-ai-muted">Restaurant dashboard</figcaption>
    </figure>
  )
}

export default function SpisnemDemo() {
  const demo = useQueueDemo()
  return (
    <div>
      <div className="grid gap-8 xl:grid-cols-[17rem_1fr] xl:items-start">
        <GuestPhone demo={demo} />
        <Dashboard demo={demo} />
      </div>
      <p className="mt-6 text-meta text-ai-muted">
        Try it: pick a place, join the queue on the phone, then call yourself in on the dashboard. Demo data only.
      </p>
    </div>
  )
}
