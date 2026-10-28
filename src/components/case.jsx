import { Link } from '../router'
import { CASES } from '../cases'
import { LAYER_META, MINWIN_CLI, MINWIN_GOALS, PROJECTS, PROJECT_RIG } from '../data'
import Obj from './obj'
import { Arrow, ArrowRight, Chips, Layers, SecHead } from './ui'

const FIELD_HEX = { coral: '#ff674d', sand: '#f7dbca', ink: '#17191f' }

export default function Case({ slug }) {
  const p = PROJECTS[slug]
  const c = CASES[slug]
  const next = PROJECTS[c.next]
  const covered = [...p.lit, ...p.partial].sort((a, b) => a - b)

  return (
    <>
      {/* -------------------------------------------------------- masthead */}
      <section className="board pt-[clamp(14px,2vw,26px)]">
        <Link className="t-label dimmer inline-flex items-center gap-2 mb-[var(--gap)]" to="/work">
          <ArrowRight size={12} className="rotate-180" />
          Back to work
        </Link>

        <div className={`panel panel--${c.field} panel--flush`} data-rise>
          <div className="grid lg:grid-cols-[1.3fr_1fr]">
            <div className="p-[var(--panel-pad)] flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <span className="tag tag--ink t-micro">{p.sheet}</span>
                <span className="t-micro sub">{p.status}</span>
              </div>

              <h1 className="t-display-xl mt-8">{p.name}</h1>
              <p className="t-head sub mt-5" style={{ fontSize: 'clamp(1.1rem,1.8vw,1.5rem)' }}>
                {p.tagline}
              </p>
              <p className="t-body sub mt-7">{c.lede}</p>

              <div className="mt-auto pt-8 flex flex-col gap-5">
                <Chips items={p.dims} />
                {p.url ? (
                  <a
                    className="btn btn--light w-fit"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open the live site
                    <Arrow className="btn-arrow" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="p-5 border-t-2 lg:border-t-0 lg:border-l-2 border-current/20 min-h-[300px]">
              <Obj
                rig={PROJECT_RIG[slug].rig}
                field={FIELD_HEX[c.field]}
                label={PROJECT_RIG[slug].label}
                className="h-full"
              />
            </div>
          </div>

          <div className="border-t-2 border-current/20 p-[var(--panel-pad)] pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <h2 className="t-micro sub">Layers covered</h2>
              <span className="t-micro sub">
                {covered.map((i) => LAYER_META[i].name).join(' · ')}
              </span>
            </div>
            <Layers lit={p.lit} partial={p.partial} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- explained */}
      <section className="section board">
        <SecHead index="01" title="The work, explained" />
        <div className="grid gap-[var(--gap)] md:grid-cols-12">
          {c.explain.map((block, i) => (
            <div
              key={block.title}
              className={`panel ${i === 1 ? 'panel--peri' : 'panel--paper'} ${
                ['md:col-span-5', 'md:col-span-7', 'md:col-span-12 md:flex md:items-start md:gap-12'][i]
              }`}
              data-rise
            >
              <h3 className="tag tag--lime t-micro shrink-0">{block.title}</h3>
              <p
                className={`t-body sub text-[1.02rem] ${i === 2 ? 'md:mt-0 mt-6 md:max-w-[62ch]' : 'mt-6'}`}
              >
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- screens */}
      <section className="section board">
        <SecHead
          index="02"
          title={c.screensTitle || 'What it looks like'}
          aside={c.cli ? 'Commands, not screenshots' : 'Demo data, not customer records'}
        />

        {c.cli ? (
          <div className="grid gap-[var(--gap)] lg:grid-cols-[1.35fr_1fr]">
            <div className="panel panel--ink panel--flush" data-rise>
              <ul>
                {MINWIN_CLI.map(([cmd, what], i) => (
                  <li
                    key={cmd}
                    className={`px-[var(--panel-pad)] py-5 ${i ? 'border-t-2 border-current/20' : ''}`}
                  >
                    <p className="t-data flex gap-3">
                      <span aria-hidden="true" className="sub">
                        &gt;
                      </span>
                      <span>{cmd}</span>
                    </p>
                    <p className="t-data sub mt-2 pl-6">{what}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel panel--sand flex flex-col" data-rise>
              <h3 className="t-label">What it has to keep true</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {MINWIN_GOALS.map((g) => (
                  <li key={g} className="t-data sub grid grid-cols-[14px_1fr] gap-3 items-start">
                    <span
                      aria-hidden="true"
                      className="mt-[5px] h-[9px] w-[9px] border-[1.5px] border-current"
                    />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
              <p className="t-data sub mt-auto pt-7">{c.cliNote}</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-[var(--gap)] md:grid-cols-2">
          {c.screens.map((s) => (
            <figure
              key={s.src}
              className={`panel panel--cream panel--flush ${
                s.narrow || s.half ? '' : 'md:col-span-2'
              } flex flex-col`}
              data-rise
            >
              <div
                className={`shot-frame ${s.narrow ? 'grid place-items-center p-7 bg-[var(--peri)]' : ''}`}
              >
                <img
                  className="shot"
                  style={s.narrow ? { maxWidth: 260, borderWidth: 2 } : { border: 0 }}
                  src={s.src}
                  width={s.w}
                  height={s.h}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="t-data sub px-6 py-4 border-t-2 border-[var(--ink)]">
                {s.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- notes */}
      <section className="section board">
        <SecHead index="03" title={c.notes.title} />
        <ul className="rule-list" data-rise>
          {c.notes.rows.map(([k, v]) => (
            <li key={k} className="grid gap-x-8 gap-y-2 md:grid-cols-[180px_1fr] items-baseline">
              <span className="t-label dimmer">{k}</span>
              <span className="t-body sub">{v}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ next case */}
      <section className="section board">
        <Link to={`/${c.next}`} className="panel panel--ink flex flex-wrap items-end justify-between gap-6" data-rise>
          <div>
            <h2 className="t-display" style={{ fontSize: 'clamp(1.9rem,3.6vw,2.9rem)' }}>
              {next.name}
            </h2>
            <p className="t-lede sub">{next.tagline}</p>
          </div>
          <Arrow className="panel-arrow" size={30} />
        </Link>
      </section>
    </>
  )
}
