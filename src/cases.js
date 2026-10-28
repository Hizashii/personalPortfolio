/* Case-study content. Product truth only - no invented metrics, no claims the
   projects do not make. Screenshots carry demo data and say so. */

export const CASES = {
  applyer: {
    field: 'coral',
    next: 'spisnem',
    lede: 'A platform that finds the job, writes the application and tracks what happens after it is sent, with your approval before anything leaves.',
    explain: [
      {
        title: 'The problem',
        body: 'Relevant roles are scattered across job boards, each with its own form. The work is repetitive, and the repetition is what makes people stop applying.',
      },
      {
        title: 'The system',
        body: 'Ingestion and matching behind an API, application material generated per role, and a browser-automated submission step. Postgres on Supabase, DuckDB for analysis.',
      },
      {
        title: 'The experience',
        body: 'A swipe feed of matched roles, a five-step application flow, and a list showing the status of everything sent. Nothing is submitted without explicit consent.',
      },
    ],
    screens: [
      {
        src: '/assets/applyer/applyer-landing.webp',
        w: 1323,
        h: 680,
        alt: 'Applyer landing page: search a job with ease, with a swipe card preview',
        cap: 'Search a job. With ease. The promise in one screen.',
      },
      {
        src: '/assets/applyer/applyer-jobs.webp',
        w: 1546,
        h: 966,
        alt: 'Applyer job feed: a job card with a match score and next, save and apply actions',
        cap: 'Swipe through matched jobs. Next, save or apply.',
      },
      {
        src: '/assets/applyer/applyer-process.webp',
        w: 1394,
        h: 1021,
        alt: 'Applyer application flow: five steps, with the CV step open',
        cap: 'Five steps, with your approval before anything is sent.',
        half: true,
      },
      {
        src: '/assets/applyer/applyer-applications.webp',
        w: 1326,
        h: 1200,
        alt: 'Applyer applications list with status filters',
        cap: 'Every application and its status, at a glance.',
        half: true,
      },
    ],
    notes: {
      title: 'Where the models run',
      rows: [
        ['Today', 'The platform runs on Gemini 2.5 Flash, behind a model interface.'],
        ['In progress', 'An offline agent network in Docker, with an allow-listed gateway.'],
        ['Next', 'Local models take over the job from the cloud model.'],
      ],
    },
  },

  spisnem: {
    field: 'sand',
    next: 'minwin',
    lede: 'A phone-first web app that lets a guest see live wait times on a map and join a restaurant queue from where they are standing, with a calm dashboard for the restaurant.',
    explain: [
      {
        title: 'The problem',
        body: 'Waiting for a table means standing outside, or calling and guessing. Neither the guest nor the restaurant has a reliable picture of the queue.',
      },
      {
        title: 'The system',
        body: 'A shared queue the guest and the restaurant both read in real time. Position and quoted time on one side, one list with one next action on the other.',
      },
      {
        title: 'The experience',
        body: 'Guests are standing somewhere with a phone in their hand. The guest side is designed for that moment, not squeezed down from a desktop page.',
      },
    ],
    screens: [
      {
        src: '/assets/spisnem/spisnem-discover.webp',
        w: 312,
        h: 640,
        alt: 'SpisNem guest app: a map of nearby restaurants with live wait times',
        cap: 'A map of restaurants close to you, each with its live wait time.',
        narrow: true,
      },
      {
        src: '/assets/spisnem/spisnem-queue.webp',
        w: 256,
        h: 500,
        alt: 'SpisNem guest app: queue position number two, about eight minutes',
        cap: 'Your place in the line, and a realistic time.',
        narrow: true,
      },
      {
        src: '/assets/spisnem/spisnem-dashboard.webp',
        w: 1116,
        h: 654,
        alt: 'SpisNem restaurant dashboard: who is waiting, average quote, seated today',
        cap: 'The restaurant calls the next party in with one tap.',
      },
    ],
    notes: {
      title: 'What the design had to get right',
      rows: [
        ['Believable', 'A wait time is only useful if it is believable. The restaurant sees waited against quoted.'],
        ['One-handed', 'The guest flow works standing on a pavement, on a phone, in one hand.'],
        ['Quiet', 'Staff are busy. One list, one next action per row, nothing else competing.'],
      ],
    },
  },

  minwin: {
    field: 'ink',
    next: 'applyer',
    lede: 'An experimental Windows 11 tool written in Rust that makes a standard install lighter, and benchmarks every change instead of trusting it.',
    explain: [
      {
        title: 'The problem',
        body: 'Most Windows "optimisation" is folklore: tweaks copied between forums, never measured, and impossible to undo cleanly.',
      },
      {
        title: 'The system',
        body: 'Rust over Win32, with profiles in plain TOML and results in SQLite. It reads the machine, measures a baseline, applies a profile and can reverse all of it.',
      },
      {
        title: 'The experience',
        body: 'A command line that explains itself. Every change is named, benchmarked against the baseline, and reversible with one command.',
      },
    ],
    // No interface shots: MinWin is a command-line tool and the only desktop
    // image on hand is a stock wallpaper, which proves nothing about it.
    screens: [],
    screensTitle: 'What you actually type',
    cli: true,
    cliNote:
      'It works on top of a standard Windows install, not a custom build. Profiles are plain TOML, so every change can be read before it is applied.',
    notes: {
      title: 'Rules it holds itself to',
      rows: [
        ['Measure first', 'You cannot improve what you have not looked at. Every change has a baseline.'],
        ['Explain everything', 'Profiles are plain TOML, so they can be read, reviewed and edited.'],
        ['Stay reversible', 'Reversibility is a requirement, not a feature. One command undoes all of it.'],
        ['Break nothing', 'Gaming, drivers, Windows Update and security keep working.'],
      ],
    },
  },
}
