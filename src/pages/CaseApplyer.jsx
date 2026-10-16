import { FRAME_FLOW, Flow, LAB_BOUNDARY, MODEL_SEAM, PIPELINE, SectionDrawing } from '../components/drawings'
import { Annotation, CaseHeader, CaseNext, CaseSections, DetailList, Panel } from '../components/case'
import { Arrow } from '../components/ui'
import ApplyerDemo from '../components/ApplyerDemo'
import ShipPipeline from '../components/ship'
import { PROJECTS } from '../data'
import { useDocumentTitle, useFlowLayout } from '../hooks'

const LEDE =
  'A job platform for Denmark. It finds roles that fit you, tailors your CV and cover letter to each one, and applies for you, once you have approved exactly what will be sent.'

const FACTS = [
  ['My role', 'Founding engineer in a small team'],
  ['I owned', 'The apply pipeline: preflight checks, the apply frame, portal automation and orchestration'],
  ['Shared with the team', 'Job ingestion, CI/CD, deployment and the database schema'],
  ['Stack', 'Next.js, TypeScript, Supabase, Playwright and Gemini, on Docker and Oracle Cloud'],
]

/* Header ------------------------------------------------------------------ */

function BrowserShot() {
  return (
    <figure className="relative isolate">
      <span className="cut absolute -top-3 -right-3 -z-10 h-2/3 w-1/2 bg-fuji sm:-top-5 sm:-right-5" aria-hidden="true" />
      <div className="border border-ai/15 bg-gofun">
        <div className="flex gap-1.5 border-b border-ai/15 px-3 py-2.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-ai/20" />
          ))}
        </div>
        <img
          src="/assets/applyer/applyer-jobs.webp"
          alt="Applyer: a job card with a match score and apply actions"
          width="1546"
          height="966"
          fetchPriority="high"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-5">
        <Annotation>Less manual work, more opportunities.</Annotation>
      </figcaption>
    </figure>
  )
}

/* Section visuals --------------------------------------------------------- */

const INPUTS = ['Job ads from the national service', 'Your profile', 'Your CV']
const PIPE = [
  ['Discover', 'find roles'],
  ['Match', 'score fit'],
  ['Prepare', 'tailor the material'],
  ['Submit', 'after you approve'],
  ['Track', 'record the status'],
]
const OUTPUTS = ['Tailored application', 'Your approval', 'Submission', 'Status tracking']

function FlowStep() {
  return (
    <span className="justify-self-center text-ai-muted sm:self-center">
      <Arrow dir="down" className="sm:hidden" />
      <Arrow className="hidden sm:block" />
    </span>
  )
}

function PipelineList() {
  return (
    <ol className="grid gap-2 text-small">
      {PIPE.map(([step, detail], i) => (
        <li key={step} className="flex items-baseline gap-3">
          <span className="w-3 shrink-0 text-meta font-semibold tabular-nums text-ai-muted">{i + 1}</span>
          <span>
            <b className="font-semibold">{step}</b> <span className="text-ai-muted">{detail}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

const PlainList = ({ items }) => (
  <ul className="grid gap-2 text-small">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

function HowItWorks() {
  return (
    <div className="grid items-start gap-3 sm:grid-cols-[1fr_auto_1.4fr_auto_1fr] sm:gap-4">
      <Panel title="Inputs" className="sm:p-5">
        <PlainList items={INPUTS} />
      </Panel>
      <FlowStep />
      <Panel title="Pipeline" className="bg-fuji/25 sm:p-5">
        <PipelineList />
      </Panel>
      <FlowStep />
      <Panel title="Outputs" className="sm:p-5">
        <PlainList items={OUTPUTS} />
      </Panel>
    </div>
  )
}

const SCREENS = [
  {
    src: '/assets/applyer/applyer-landing.webp',
    width: 1323,
    height: 680,
    title: 'Landing',
    text: 'Search a job. With ease. The promise in one screen.',
    alt: 'Applyer landing page: search a job with ease, with a swipe card preview',
  },
  {
    src: '/assets/applyer/applyer-jobs.webp',
    width: 1546,
    height: 966,
    title: 'Job feed',
    text: 'Swipe through matched jobs. Next, save or apply.',
    alt: 'Applyer job feed: a job card with a match score and next, save and apply actions',
  },
  {
    src: '/assets/applyer/applyer-applications.webp',
    width: 1326,
    height: 1200,
    title: 'Applications',
    text: 'Every application and its status, at a glance.',
    alt: 'Applyer applications list with status filters',
  },
  {
    src: '/assets/applyer/applyer-process.webp',
    width: 1394,
    height: 1021,
    title: 'Application flow',
    text: 'Five steps, with your approval before anything is sent.',
    alt: 'Applyer application flow: five steps, with the CV step open',
  },
]

function Screens() {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
      {SCREENS.map(({ title, text, ...img }) => (
        <figure key={title}>
          <img {...img} loading="lazy" className="block h-auto w-full border border-ai/15" />
          <figcaption className="mt-3 text-small">
            <b className="font-semibold">{title}</b>
            <span className="block text-ai-muted">{text}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const RUN_STATES = [
  ['Preparing documents', 'Tailored CV and cover letter. Your originals are never changed.'],
  ['Choosing a method', 'The router picks how this application can be sent.'],
  ['Filling the form', 'Fields are mapped and filled, stopping before submit.'],
  ['Waiting for you', 'You review the package and the field mapping.', true],
  ['Submitting', 'Only after you confirm.'],
  ['Submitted', 'Recorded, with the status tracked from here.'],
]
const RUN_ENDS = ['Failed', 'Manual review', 'Cancelled']

function RunState({ name, detail, gate }) {
  return (
    <li className="relative pb-5 pl-6 last:pb-0">
      <span
        className={`absolute top-2 h-2.5 ${gate ? 'cut -left-2 w-4 bg-fuji' : '-left-[5px] w-2.5 bg-ai'}`}
        aria-hidden="true"
      />
      <p className="font-semibold">
        {name}
        {gate && <span className="ml-2 text-meta font-medium text-ai-muted">your approval</span>}
      </p>
      <p className="text-small text-ai-muted">{detail}</p>
    </li>
  )
}

function RunStates() {
  return (
    <Panel>
      <ol className="border-l border-ai/25">
        {RUN_STATES.map(([name, detail, gate]) => (
          <RunState key={name} name={name} detail={detail} gate={gate} />
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ai/15 pt-4">
        <span className="mr-2 text-meta text-ai-muted">Any step can end in</span>
        {RUN_ENDS.map((end) => (
          <span key={end} className="tag">
            {end}
          </span>
        ))}
      </div>
    </Panel>
  )
}

const STRATEGIES = [
  ['Direct API', 'The job board offers a documented way to apply.'],
  ['Email', 'The ad names an application address that can be verified.'],
  ['Known portal', 'A recruiting system with a tested recipe.'],
  ['Generic form', 'A plain form with file uploads. Higher risk, so it scores lower.'],
  ['Manual', "The safe default. You finish on the employer's site."],
]
const PORTAL_POLICY = [
  ['Off by default', 'Automation runs only where it has been switched on.'],
  ['Submit allowlist', 'A new recruiting system is never submitted to before a person has looked at it.'],
  ['Blocklist first', 'Any one portal can be switched off in a deploy, without touching the others.'],
]

function Strategies() {
  return (
    <div className="grid gap-6">
      <Panel title="Ways to apply">
        <DetailList items={STRATEGIES} />
      </Panel>
      <Panel title="Which portals it may drive">
        <DetailList items={PORTAL_POLICY} />
      </Panel>
    </div>
  )
}

function FlowPanel({ spec, label }) {
  const layout = useFlowLayout()
  return (
    <Panel>
      <Flow spec={spec[layout]} label={label} />
    </Panel>
  )
}

const FailureFlow = () => (
  <FlowPanel
    spec={PIPELINE.failure}
    label="Pipeline with failure handling: failed submissions are classified, retried, parked or sent to a person"
  />
)

const URL_CHECKS = [
  ['Scheme', 'Only http and https.'],
  ['Address', 'Private, loopback and cloud metadata addresses are refused.'],
  ['DNS', 'The hostname is resolved first, so a public name that points inside the network is refused too.'],
]

const UrlChecks = () => (
  <Panel title="Before the server fetches a URL">
    <DetailList items={URL_CHECKS} />
  </Panel>
)

const FrameFlow = () => (
  <FlowPanel
    spec={FRAME_FLOW}
    label="The candidate's browser opens the apply frame, which fetches the employer's form over plain HTTP and rewrites it to stay inside the frame"
  />
)

const FEED_GATE = [
  {
    title: 'Before',
    text: 'Every unseen job waited for a background page check. When a new filter queued a large batch at once, whole categories showed no jobs until the worker caught up.',
  },
  {
    title: 'After',
    text: 'A job is decided in memory whenever its ad settles it. Only jobs that genuinely need a page check wait for one, in the background.',
  },
]

function FeedGate() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {FEED_GATE.map(({ title, text }, i) => (
        <Panel key={title} title={title} className={i === 1 ? 'border-ai bg-fuji/25' : ''}>
          <p className="text-small">{text}</p>
        </Panel>
      ))}
    </div>
  )
}

function Architecture() {
  const layout = useFlowLayout()
  return (
    <Panel>
      <SectionDrawing narrow={layout === 'narrow'} roomy />
    </Panel>
  )
}

const ModelSeam = () => (
  <FlowPanel spec={MODEL_SEAM} label="One AI client in front of Gemini models, tried in order, and a local model in training" />
)

const GOING = [
  ['Running', 'Live, with Gemini models behind one AI client.'],
  ['In progress', 'An offline agent network in Docker, behind an allow-listed gateway.'],
  ['Training', 'Local models to take over from the cloud model.'],
]

function Roadmap() {
  return (
    <div className="grid gap-6">
      <FlowPanel
        spec={LAB_BOUNDARY}
        label="Agents and a local model run inside a Docker network with no direct internet, behind an allow-listed gateway"
      />
      <ol>
        {GOING.map(([status, text], i) => (
          <li key={status} className="grid grid-cols-[2rem_1fr] gap-x-4 border-t border-ai/15 py-4 sm:grid-cols-[2rem_1fr_auto]">
            <span className="text-meta font-semibold tabular-nums text-ai-muted">0{i + 1}</span>
            <p>{text}</p>
            <span className="col-start-2 mt-1 text-meta text-ai-muted sm:col-start-3 sm:mt-0">{status}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* Sections ---------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'try',
    label: 'Try it',
    title: 'Use it, here.',
    Visual: ApplyerDemo,
    body: [
      'A working replica of the core loop, running right here in the page. Swipe through matched jobs, apply to one and watch it prepare the application, then approve it.',
    ],
  },
  {
    id: 'how',
    label: 'Product',
    title: 'How it works',
    Visual: HowItWorks,
    body: [
      'Job ads arrive from the Danish national job-ad service over mutual TLS and are kept in sync in Supabase. Applyer matches them to your profile and lines them up as a swipe feed.',
      'Apply to one and it tailors your CV and cover letter from facts already in your profile, then waits for your approval before anything is sent.',
    ],
  },
  {
    id: 'screens',
    label: 'Screens',
    title: 'Product screenshots',
    Visual: Screens,
    body: ['A look at the key parts of the product, from job search to application tracking.'],
  },
  {
    id: 'orchestration',
    label: 'Orchestration',
    title: 'One application, one state machine',
    Visual: RunStates,
    note: 'Nothing is sent without you.',
    body: [
      'Each Apply starts a run that moves through fixed states and writes every step to an append-only audit trail.',
      'Only your confirmation moves a run to submitting, and the consent is stored with a hash of the exact package you approved.',
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    title: 'Choosing how to apply',
    Visual: Strategies,
    body: [
      "A router scores the ways an application could be sent and picks the best one. Below a confidence threshold it falls back to manual, and you finish on the employer's site.",
      'An unknown strategy fails loudly. It once fell back quietly, and because the manual path reports success, a migration deployed ahead of its code could mark an application submitted with nothing sent.',
    ],
  },
  {
    id: 'failure',
    label: 'Failure handling',
    title: 'When it works, and when it does not',
    Visual: FailureFlow,
    note: 'Every failure ends somewhere on purpose.',
    body: [
      'Transient errors, such as timeouts and rate limits, are retried with backoff.',
      'A CAPTCHA, a login wall or a form that has changed stops automation and hands the application to a person. Nothing fails silently.',
    ],
  },
  {
    id: 'untrusted',
    label: 'Security',
    title: 'Job ads are untrusted input',
    Visual: UrlChecks,
    body: [
      'An application URL is chosen by whoever published the ad. Before the server fetches one, preflight checks where it really points, so an ad cannot be used to reach inside the network.',
    ],
  },
  {
    id: 'frame',
    label: 'Apply frame',
    title: "The employer's form, inside Applyer",
    Visual: FrameFlow,
    note: 'Cost per open form: one request, not a browser.',
    body: [
      'Employer forms open inside Applyer through a pass-through proxy that rewrites each page to stay in the frame.',
      "It is a plain HTTP hop rather than a browser per form, and the candidate's own browser runs the employer's scripts.",
      'Navigation the rewrite cannot intercept, like a script setting window.location after submitting, is caught and sent back into the right frame.',
    ],
  },
  {
    id: 'feed',
    label: 'Performance',
    title: 'Keeping the feed fast',
    Visual: FeedGate,
    body: [
      'A job reaches the swipe deck only when preflight says it can actually be applied to. That rule must never make the deck wait.',
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    title: 'What holds it up',
    Visual: Architecture,
    body: [
      'Almost all of it is TypeScript on Next.js. Supabase holds users, applications and the audit trail, behind row-level security.',
      'It runs in Docker on an Oracle Cloud VM, provisioned with Terraform and deployed with Ansible.',
    ],
  },
  {
    id: 'ships',
    label: 'Shipping',
    title: 'How a change ships',
    Visual: ShipPipeline,
    body: [
      'Every push builds a Docker image and deploys it with Ansible. Tests, lint and build run alongside four security checks: a dependency audit, a secret scan of the Git history, static analysis and a container scan.',
      "The tests run on Node's built-in test runner. Classifiers such as blocker detection stay pure, so they are tested without a browser.",
    ],
  },
  {
    id: 'model',
    label: 'AI',
    title: 'Swapping the model',
    Visual: ModelSeam,
    note: 'Swap models without rewriting the system.',
    body: [
      'Every AI call goes through one client. It tries Gemini models in order, and since each model has its own daily quota, a quota error moves on to the next model instead of failing the request.',
      'Local models are being trained to plug into the same contract.',
    ],
  },
  {
    id: 'going',
    label: 'Roadmap',
    title: 'Where it is going',
    Visual: Roadmap,
    body: [
      'Next is an offline agent network: agents and a local model in a Docker network with no direct internet, behind one allow-listed gateway, so there is a single place to watch what leaves.',
      'Still being built, which is why it is drawn dashed.',
    ],
  },
]

export default function CaseApplyer() {
  useDocumentTitle('Applyer')
  return (
    <main>
      <CaseHeader project={PROJECTS.applyer} lede={LEDE} facts={FACTS} art={<BrowserShot />} />
      <CaseSections sections={SECTIONS} />
      <CaseNext from="applyer" />
    </main>
  )
}
