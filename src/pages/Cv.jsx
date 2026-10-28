import { useMemo, useState } from 'react'
import { CV_LOG, EDUCATION, LAYER_META, SOCIALS } from '../data'
import { Arrow, Caret, Chips, Download, SecHead } from '../components/ui'

function Process({ item, dimmed }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="proc" data-dim={dimmed}>
      <button
        type="button"
        className="proc-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="proc-led" data-running={item.running} aria-hidden="true" />
        <span className="min-w-0 proc-org">
          <span className="t-title block truncate">{item.org}</span>
          <span className="t-data dim block truncate">{item.role}</span>
        </span>
        <span className="t-data dim tabular-nums whitespace-nowrap">{item.when}</span>
        <Caret className="proc-caret dimmer" />
      </button>

      <div className="proc-body" data-open={open}>
        <div>
          <div className="pb-7 pl-[30px] pr-2 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="t-body sub">{item.line}</p>
              <ul className="rule-list mt-5">
                {item.detail.map((d) => (
                  <li key={d} className="t-body text-[0.97rem] sub">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="t-micro dimmer">Worked with</h3>
              <div className="mt-3">
                <Chips items={item.stack} />
              </div>
              <h3 className="t-micro dimmer mt-7">Layers touched</h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {LAYER_META.map((l, i) => {
                  const on = item.layers.includes(i)
                  const part = item.partial.includes(i)
                  if (!on && !part) return null
                  return (
                    <li key={l.key} className="t-data flex items-center gap-3">
                      <span className="tabular-nums dimmer">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{l.name}</span>
                      {part ? <span className="t-micro dimmer">partly</span> : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function Cv() {
  const [filter, setFilter] = useState(-1)

  const counts = useMemo(
    () =>
      LAYER_META.map((_, i) =>
        CV_LOG.filter((r) => r.layers.includes(i) || r.partial.includes(i)).length,
      ),
    [],
  )

  const matches = (r) => filter < 0 || r.layers.includes(filter) || r.partial.includes(filter)
  const shown = CV_LOG.filter(matches).length

  return (
    <>
      <section className="board pt-[clamp(14px,2vw,26px)]">
        <div className="grid gap-[var(--gap)] lg:grid-cols-[1.25fr_1fr]">
          <div className="panel panel--ink flex flex-col" data-rise>
            <h1 className="t-display-xl" style={{ fontSize: 'clamp(2.4rem,6.4vw,4.4rem)' }}>
              Six roles,
              <br />
              one stack.
            </h1>
            <p className="t-lede sub mt-8">
              Every role below is a span of the same six layers. Filter by a layer to see which
              of them actually touched it. The range is a structure, not a list.
            </p>
            <div className="mt-auto pt-8 flex flex-wrap gap-3">
              <a className="btn btn--lime" href={SOCIALS.cv} download>
                Download PDF
                <Download />
              </a>
              <a className="btn btn--light" href={`mailto:${SOCIALS.email}`}>
                Write to me
                <Arrow className="btn-arrow" />
              </a>
            </div>
          </div>

          {/* The filter is the same six-layer grammar, as a control. */}
          <div className="panel panel--lime" data-rise>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="t-label">Filter by layer</h2>
              <span className="t-micro sub tabular-nums">
                {shown} of {CV_LOG.length}
              </span>
            </div>

            <ul className="mt-5 -mx-[10px]">
              <li>
                <button
                  type="button"
                  className="layer-row"
                  data-on={filter === -1}
                  onClick={() => setFilter(-1)}
                  aria-pressed={filter === -1}
                >
                  <span className="tabular-nums opacity-55">00</span>
                  <span>Everything</span>
                  <span className="layer-leader" aria-hidden="true" />
                  <span className="tabular-nums opacity-70">{CV_LOG.length}</span>
                </button>
              </li>
              {LAYER_META.map((l, i) => (
                <li key={l.key}>
                  <button
                    type="button"
                    className="layer-row"
                    data-on={filter === i}
                    onClick={() => setFilter(filter === i ? -1 : i)}
                    aria-pressed={filter === i}
                  >
                    <span className="tabular-nums opacity-55">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{l.name}</span>
                    <span className="layer-leader" aria-hidden="true" />
                    <span className="tabular-nums opacity-70">{counts[i]}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="t-data sub mt-auto pt-7">
              Counts are roles, not years. A role counts for a layer if it was part of the job,
              not if it was mentioned in the stack.
            </p>
          </div>
        </div>
      </section>

      <section className="section board">
        <SecHead
          index="01"
          title="Experience"
          aside={
            <span aria-live="polite">
              {filter < 0
                ? `${CV_LOG.length} roles`
                : `${shown} of ${CV_LOG.length} touched ${LAYER_META[filter].name}`}
            </span>
          }
        />
        <ul data-rise>
          {CV_LOG.map((item) => (
            <Process key={item.id} item={item} dimmed={!matches(item)} />
          ))}
        </ul>
        <p className="t-micro dimmer mt-5">
          Open a role for what it actually involved, and which layers it touched.
        </p>
      </section>

      <section className="section board">
        <SecHead index="02" title="Education and elsewhere" />
        <div className="grid gap-[var(--gap)] md:grid-cols-2">
          {EDUCATION.map((e, i) => (
            <div key={e.id} className={`panel ${i === 0 ? 'panel--peri' : 'panel--sand'}`} data-rise>
              <span className="t-micro sub tabular-nums">{e.when}</span>
              <h3 className="t-title mt-4">{e.role}</h3>
              <p className="t-data sub mt-1">{e.org}</p>
              <p className="t-data sub mt-5">{e.line}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
