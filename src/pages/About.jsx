import { ABOUT, ABOUT_META, LAYER_META, SOCIALS } from '../data'
import Obj from '../components/obj'
import { Arrow, Download, LayerKey, SecHead } from '../components/ui'

const FACTS = [
  ['Based', 'Esbjerg, Denmark'],
  ['Open to', 'Copenhagen, on site or hybrid'],
  ['Timezone', 'CET, UTC+1'],
  ['Status', 'Open to roles and freelance'],
  ['Experience', 'Nearly four years'],
  ['Languages', 'English, Japanese, Danish (learning)'],
]

export default function About() {
  return (
    <>
      <section className="board pt-[clamp(14px,2vw,26px)]">
        <div className="grid gap-[var(--gap)] lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <div className="panel panel--blue flex flex-col" data-rise>
            <h1 className="t-display-xl" style={{ fontSize: 'clamp(2.1rem,5.2vw,3.6rem)' }}>
              I started by fixing
              <br />
              systems I did not
              <br />
              build.
            </h1>
            <p className="t-lede sub mt-8">
              Then I started building them. Support taught me to read a system before trusting
              it, and that is still how I work.
            </p>
            <div className="mt-auto pt-8 flex flex-wrap gap-3">
              <a className="btn btn--lime" href={`mailto:${SOCIALS.email}`}>
                Write to me
                <Arrow className="btn-arrow" />
              </a>
              <a className="btn btn--light" href={SOCIALS.cv} download>
                CV, PDF
                <Download />
              </a>
            </div>
          </div>

          <div className="panel panel--paper panel--flush" data-rise>
            <img
              className="w-full h-auto block border-b-2 border-[var(--ink)]"
              src="/images/me.png"
              width={720}
              height={720}
              alt="Lachezar Dimchov"
            />
            <dl className="divide-y-2 divide-[var(--ink)]">
              {FACTS.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-5 px-6 py-3">
                  <dt className="t-micro dimmer">{k}</dt>
                  <dd className="t-data text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section board">
        <SecHead index="01" title="The short version" />
        <div className="grid gap-[var(--gap)] md:grid-cols-12">
          {ABOUT.map(([title, body], i) => (
            <div
              key={title}
              className={`panel ${['panel--lime', 'panel--paper', 'panel--sand', 'panel--peri'][i % 4]} ${
                ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'][i % 4]
              }`}
              data-rise
            >
              <span className="t-micro sub tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="t-head mt-4" style={{ fontSize: 'clamp(1.2rem,1.9vw,1.6rem)' }}>
                {title}
              </h3>
              <p className="t-body sub mt-4 text-[1.02rem]">{body}</p>
            </div>
          ))}
        </div>
        <p className="t-body dim mt-[var(--gap)] text-[0.98rem]">{ABOUT_META}</p>
      </section>

      <section className="section board">
        <SecHead index="02" title="What the layers mean" />
        <div className="panel panel--ink panel--flush" data-rise>
          <div className="grid lg:grid-cols-[1fr_1.15fr]">
            <div className="p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-current/25 min-h-[320px]">
              <Obj
                rig="stack"
                field="#17191f"
                label="Six stacked slabs, one for each layer of the stack."
                className="h-full"
              />
            </div>
            <div className="p-[var(--panel-pad)]">
              <ul className="flex flex-col">
                {LAYER_META.map((l, i) => (
                  <li
                    key={l.key}
                    className="grid grid-cols-[2.6ch_1fr] gap-4 py-4 border-b-2 border-current/20 last:border-b-0"
                  >
                    <span className="t-label sub tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="t-title block">{l.name}</span>
                      <span className="t-data sub block mt-1">{l.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-[var(--gap)]">
          <LayerKey className="dimmer" />
        </div>
      </section>
    </>
  )
}
