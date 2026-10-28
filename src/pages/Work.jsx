import { Link } from '../router'
import { PROJECTS, PROJECT_RIG } from '../data'
import Obj from '../components/obj'
import { Arrow, Chips, LayerKey, Layers, SecHead } from '../components/ui'

const FIELDS = { applyer: 'coral', spisnem: 'sand', minwin: 'ink' }
const FIELD_HEX = { coral: '#ff674d', sand: '#f7dbca', ink: '#17191f' }

const ORDER = ['applyer', 'spisnem', 'minwin']

export default function Work() {
  return (
    <>
      <section className="board pt-[clamp(14px,2vw,26px)]">
        <div className="panel panel--paper" data-rise>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h1 className="t-display-xl">
                Three things
                <br />
                I built.
              </h1>
              <p className="t-lede sub mt-8">
                A job platform, a restaurant queue and a Windows tool written in Rust. Each one
                lights a different span of the same six layers. Together they are the range.
              </p>
            </div>
            <div>
              <h2 className="t-micro dimmer">The six layers</h2>
              <LayerKey className="mt-3" />
            </div>
          </div>
        </div>
      </section>

      <section className="section board">
        <SecHead index="01" title="Projects" aside={`${ORDER.length} entries`} />

        <div className="stack-v">
          {ORDER.map((slug, idx) => {
            const p = PROJECTS[slug]
            const field = FIELDS[slug]
            const flip = idx % 2 === 1

            return (
              <Link
                key={slug}
                to={`/${slug}`}
                className={`panel panel--${field} panel--flush block`}
                data-rise
              >
                <div
                  className={`grid lg:grid-cols-[1.35fr_1fr] ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}
                >
                  <div className="p-[var(--panel-pad)] flex flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <span className="tag tag--ink t-micro">{p.sheet}</span>
                      <span className="t-micro sub">{p.status}</span>
                    </div>

                    <h3
                      className="t-display mt-7"
                      style={{ fontSize: 'clamp(1.9rem,3.9vw,3.1rem)' }}
                    >
                      {p.name}
                    </h3>
                    <p className="t-title sub mt-4">{p.tagline}</p>
                    <p className="t-body sub mt-6 text-[0.99rem]">{p.summary}</p>

                    {p.stack ? (
                      <p className="t-data sub mt-5 opacity-90">{p.stack}</p>
                    ) : null}

                    <div className="mt-auto pt-8 flex flex-col gap-4">
                      <Layers lit={p.lit} partial={p.partial} />
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <Chips items={p.dims} />
                        <span className="t-label inline-flex items-center gap-2">
                          Open case
                          <Arrow className="panel-arrow" size={13} />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-5 border-t-2 lg:border-t-0 lg:border-l-2 border-current/20"
                    style={{ minHeight: 300 }}
                  >
                    <Obj
                      rig={PROJECT_RIG[slug].rig}
                      field={FIELD_HEX[field]}
                      label={PROJECT_RIG[slug].label}
                      className="h-full"
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
