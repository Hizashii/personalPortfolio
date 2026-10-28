export const LAYERS = [
  'Interface',
  'Application',
  'Backend',
  'Infrastructure',
  'System',
  'Business',
]

export const SOCIALS = {
  email: 'Luchezar.DD@protonmail.com',
  linkedin: 'https://www.linkedin.com/in/lachezar-dimchov-4a8b852a3',
  github: 'https://github.com/Hizashii',
  cv: '/CV/WorkingCV.pdf',
}

export const ROUTES = [
  { num: '01', label: 'Work', to: '/work' },
  { num: '02', label: 'About', to: '/about' },
  { num: '03', label: 'CV', to: '/cv' },
  { num: '04', label: 'Lab', to: '/lab' },
]

// lit = fully covered layers, partial = in progress (drawn dashed)
export const PROJECT_RIG = {
  applyer: {
    rig: 'deal',
    label:
      'A deck of roles. One card lifts off the pile, crosses and lands on the applied pile, over and over.',
  },
  spisnem: {
    rig: 'queue',
    label: 'A line of parties shuffling toward the door. The front one is called in; a new one joins the back.',
  },
  minwin: {
    rig: 'strip',
    label: 'A machine being trimmed. Each layer loses its offcuts and settles to a lean core, then rebuilds.',
  },
}

export const PROJECTS = {
  applyer: {
    slug: 'applyer',
    sheet: '01',
    name: 'Applyer',
    tagline: 'Applies to jobs for you, end to end.',
    short:
      'A full-stack platform that uses AI to handle job applications end to end. It runs on Gemini 2.5 Flash today, and local models are being trained to take over.',
    status: 'Ongoing',
    lit: [0, 1, 2, 3],
    partial: [4],
    dims: ['Software', 'Automation & AI', 'Systems'],
    summary:
      'A full-stack platform that uses AI models to handle job applications end to end. It runs on Gemini 2.5 Flash today. An offline agent network inside Docker is being built, and local models are being trained to do the job in its place.',
    langs: [
      ['TypeScript', 97],
      ['PLpgSQL', 1.1],
      ['CSS', 1],
      ['Python', 0.2],
      ['HCL', 0.2],
      ['JavaScript', 0.2],
      ['Other', 0.3],
    ],
    stack: 'TypeScript · Supabase (Postgres) · DuckDB · Docker · Terraform · Ansible · Oracle Cloud VM',
  },
  spisnem: {
    slug: 'spisnem',
    sheet: '02',
    name: 'Spisnem',
    tagline: 'Join a restaurant queue from where you stand.',
    status: 'Ongoing',
    lit: [0, 1, 2],
    partial: [],
    dims: ['Software'],
    summary:
      'A phone-first web app that lets guests see live wait times on a map and join a restaurant queue from where they stand, with a calm dashboard for the restaurant to call parties in.',
    url: 'https://spisnem-main.vercel.app/',
  },
  minwin: {
    slug: 'minwin',
    sheet: '03',
    name: 'MinWin',
    tagline: 'Makes Windows lighter without blindly disabling things.',
    status: 'Experimental',
    lit: [],
    partial: [4],
    dims: ['Systems', 'Software'],
    summary:
      'An experimental Windows 11 optimisation tool, written in Rust, that makes a standard install lighter and easier to control. It benchmarks every change instead of trusting placebo tweaks, explains each one, and can roll all of it back.',
    stack: 'Rust · Win32 (windows-rs) · TOML · SQLite · DISM · powercfg',
  },
}

export const MINWIN_CLI = [
  ['minwin status', 'What is running, and what it costs'],
  ['minwin benchmark', 'Measure idle use, startup and background activity'],
  ['minwin apply minimal', 'Apply a profile: minimal, gaming or developer'],
  ['minwin diff', 'See exactly what changed'],
  ['minwin rollback', 'Undo every change'],
]

export const MINWIN_GOALS = [
  'Lower idle resource use',
  'Faster startup',
  'Less background activity',
  'Keep gaming, drivers, Windows Update and security working',
  'Every change explained, benchmarked and reversible',
]

export const EXPERIENCE = [
  {
    id: 'weblager',
    role: 'Full-stack engineer',
    org: 'Weblager',
    when: 'Apr 2026 – present',
    scope: 'Angular and TypeScript on a large, complex application. Mostly frontend implementation, but the problems rarely stay in the frontend.',
    highlight: 'Daily production problem-solving across search, permissions and access logic, not isolated UI components.',
    more: [
      'Complex search and filtering behaviour.',
      'Permissions, role-based access, clearance logic and archive access.',
      'State synchronisation, data mapping, forms and workflows, with edge cases across large application flows.',
      'Tracing issues across the application and into API behaviour.',
    ],
  },
  {
    id: 'applyer',
    role: 'Founding engineer',
    org: 'Applyer (team project)',
    when: 'Ongoing',
    scope: 'Part of the team building Applyer, working across the product from the first commit, from interface to infrastructure.',
    highlight: 'Breadth is the point: the interface, the backend, the automation and the deployment all had to work together.',
    more: [
      'Interface, authentication and onboarding.',
      'API, backend and data, including job matching and AI-generated application material.',
      'Application workflow and browser automation.',
      'Infrastructure, deployment and failure handling. Now exploring local models and a controlled agent network.',
    ],
  },
  {
    id: 'visma',
    role: 'Full-stack developer',
    org: 'Visma Creditro',
    when: 'Dec 2024 – Jan 2026',
    scope: 'Frontend and backend on a microservice-based product, in Vue, Node.js and NestJS.',
    highlight: 'Moved caching to Redis: about 2.2× faster cached workflows in internal benchmarks.',
    more: [
      'Worked across multiple microservices and debugged behaviour between them.',
      'OCR and document extraction work.',
      'Internal metrics and observability.',
      'Localisation for Sweden, Norway and Finland, and production changes shipped across the stack.',
    ],
  },
  {
    id: 'holdbox',
    role: 'Full-stack engineer (internship)',
    org: 'Holdbox',
    when: 'Jan – Mar 2025',
    scope: 'Built and shipped customer-facing e-commerce and admin functionality for a catalogue of 1,000+ products, using Next.js, Node.js and MongoDB.',
    highlight: 'Worked across both the customer experience and the internal admin workflows.',
  },
  {
    id: 'microsoft',
    role: 'Support engineer, Microsoft 365',
    org: 'Microsoft',
    when: 'Apr – Sep 2023',
    scope: 'Supported enterprise environments across SharePoint, OneDrive, Azure and Commerce, mainly Azure and Commerce.',
    highlight: 'Learned to read and diagnose systems I did not build, which still shapes how I design software.',
    more: [
      'Troubleshooting with CMD and PowerShell.',
      'Cases for large enterprise customers, including IBM and CERN.',
      'Moved here straight from Cisco, onto the Microsoft 365 project.',
    ],
  },
  {
    id: 'cisco',
    role: 'Support engineer',
    org: 'Cisco',
    when: 'Nov 2022 – Apr 2023',
    scope: 'My first professional technical role: hardware, account and network troubleshooting over phone, email and chat.',
    highlight: 'Documented cases and escalated to the networking teams. Fixing systems before building them.',
  },
]

export const ABOUT = [
  ['I started in support, learning how systems break.', 'At Cisco and Microsoft I diagnosed systems I had not built. Then I moved into building them.'],
  ['Today I work across full-stack software.', 'And I spend more and more of my time on automation, infrastructure, reliability and security.'],
  ['I like owning problems end to end.', 'I want to understand why a thing should exist, not only how to implement it, and learn enough about the system around it to make better decisions.'],
  ['That is why I build outside work too.', 'Applyer, Spisnem and MinWin are where I practise taking something from nothing to working software.'],
]

export const ABOUT_META =
  'Elsewhere: studying for a PBA in Web Development at Erhvervsakademi Sydvest, until 2027. Member of the Danish Chamber of Commerce in Japan since Feb 2026. Languages: English, Japanese, Danish (learning).'

export const TICKER = [
  'Usually building something',
  'Exploring infrastructure, local models and security',
  'Writing code most days',
  'Curious about what happens after localhost',
]

// Homepage copy is kept here so presentation components only describe layout.
export const HOME_CONTENT = {
  projects: [
    ['applyer', 'Applyer', 'Finds jobs, writes the application and tracks what happens next.', 'Ongoing'],
    ['spisnem', 'Spisnem', 'A restaurant queue you can join from the pavement.', 'Beta'],
    ['minwin', 'MinWin', 'Makes Windows lighter, and measures before it changes anything.', 'Early'],
  ],
  principles: [
    ['Understand the system', 'A good solution fits the whole system, not only the feature in front of me.'],
    ['Design for reality', 'Requirements change, services fail and people do unexpected things. I plan for that.'],
    ['Own the outcome', 'I care about what happens in production, not only about the first merge.'],
  ],
  roles: [
    ['2026 to now', 'Full-stack engineer', 'Weblager', 'A large Angular and TypeScript application with complex search, permissions and access rules.'],
    ['2024 to 2026', 'Full-stack developer', 'Visma Creditro', 'Vue, Node.js and NestJS microservices. Moved caching to Redis for about 2.2x faster cached workflows.'],
    ['2022 to 2023', 'Support engineer', 'Microsoft 365 and Cisco', 'Enterprise troubleshooting, which taught me to read systems I had not built.'],
  ],
}

/* ---------------------------------------------------------------------------
   The six-layer stack. Shared grammar: every project lights the span it
   covers, every role lights the span it touched. Slab footprints vary so the
   object keeps a silhouette; colours avoid blue because the hero field is blue.
   --------------------------------------------------------------------------- */

export const LAYER_META = [
  {
    key: 'interface',
    name: 'Interface',
    color: '#ff674d',
    w: 1.62,
    d: 1.62,
    h: 0.2,
    note: 'What a person actually touches. Angular, React, Next.js.',
  },
  {
    key: 'application',
    name: 'Application',
    color: '#e9fe6a',
    w: 1.78,
    d: 1.5,
    h: 0.26,
    note: 'Flows, state, permissions, the rules that decide what happens.',
  },
  {
    key: 'backend',
    name: 'Backend',
    color: '#fffdf8',
    w: 1.52,
    d: 1.76,
    h: 0.3,
    note: 'APIs, data, jobs. Node, NestJS, Postgres, Supabase, DuckDB.',
  },
  {
    key: 'infrastructure',
    name: 'Infrastructure',
    color: '#f7dbca',
    w: 1.86,
    d: 1.6,
    h: 0.24,
    note: 'Where it runs and how it recovers. Docker, Terraform, Ansible.',
  },
  {
    key: 'system',
    name: 'System',
    color: '#dfe1ff',
    w: 1.58,
    d: 1.84,
    h: 0.28,
    note: 'The machine underneath. Rust, Win32, benchmarks, resource cost.',
  },
  {
    key: 'business',
    name: 'Business',
    color: '#17191f',
    w: 1.7,
    d: 1.56,
    h: 0.22,
    note: 'Why the thing should exist, and what it costs to keep alive.',
  },
]

/* Roles as running processes. `layers` indexes LAYER_META; `partial` is work
   still in progress. `running` drives the live indicator. */
export const CV_LOG = [
  {
    id: 'weblager',
    org: 'Weblager',
    role: 'Full-stack engineer',
    when: 'Apr 2026 to present',
    running: true,
    stack: ['Angular', 'TypeScript', 'RxJS', 'PrimeNG'],
    layers: [0, 1, 2],
    partial: [5],
    line: 'Complex search, permissions and archive access on a large application.',
    detail: [
      'Complex search and filtering behaviour across large data sets.',
      'Permissions, role-based access, clearance logic and archive access.',
      'State synchronisation, data mapping, forms and workflows, with edge cases across long application flows.',
      'Tracing issues from the interface down into API behaviour.',
    ],
  },
  {
    id: 'applyer',
    org: 'Applyer',
    role: 'Founding engineer',
    when: '2026 to present',
    running: true,
    stack: ['TypeScript', 'Supabase', 'Docker', 'Terraform'],
    layers: [0, 1, 2, 3],
    partial: [4, 5],
    line: 'Built across the whole product, from first commit to deployment.',
    detail: [
      'Interface, authentication and onboarding.',
      'API, backend and data, including job matching and generated application material.',
      'Application workflow and browser automation.',
      'Infrastructure, deployment and failure handling. Now exploring local models and a controlled agent network.',
    ],
  },
  {
    id: 'visma',
    org: 'Visma Creditro',
    role: 'Full-stack developer',
    when: 'Dec 2024 to Jan 2026',
    running: false,
    stack: ['Vue', 'NestJS', 'Node.js', 'Redis'],
    layers: [0, 1, 2],
    partial: [3],
    line: 'Moved caching to Redis: about 2.2× faster cached workflows in internal benchmarks.',
    detail: [
      'Worked across multiple microservices and debugged behaviour between them.',
      'OCR and document extraction work.',
      'Internal metrics and observability.',
      'Localisation for Sweden, Norway and Finland, shipped across the stack.',
    ],
  },
  {
    id: 'holdbox',
    org: 'Holdbox',
    role: 'Full-stack engineer, internship',
    when: 'Jan to Mar 2025',
    running: false,
    stack: ['Next.js', 'Node.js', 'MongoDB'],
    layers: [0, 1, 2],
    partial: [],
    line: 'Customer-facing e-commerce and admin functionality for a catalogue of 1,000+ products.',
    detail: [
      'Shipped both the customer experience and the internal admin workflows.',
      'Catalogue, product data and order handling.',
    ],
  },
  {
    id: 'microsoft',
    org: 'Microsoft',
    role: 'Support engineer, Microsoft 365',
    when: 'Apr to Sep 2023',
    running: false,
    stack: ['Azure', 'PowerShell', 'SharePoint'],
    layers: [3, 4],
    partial: [5],
    line: 'Enterprise environments across Azure and Commerce. Reading systems I did not build.',
    detail: [
      'Troubleshooting with CMD and PowerShell.',
      'Cases for large enterprise customers, including IBM and CERN.',
      'Moved here straight from Cisco, onto the Microsoft 365 project.',
    ],
  },
  {
    id: 'cisco',
    org: 'Cisco',
    role: 'Support engineer',
    when: 'Nov 2022 to Apr 2023',
    running: false,
    stack: ['Networking', 'Hardware', 'Escalation'],
    layers: [4],
    partial: [3],
    line: 'First professional technical role. Fixing systems before building them.',
    detail: [
      'Hardware, account and network troubleshooting over phone, email and chat.',
      'Documented cases and escalated to the networking teams.',
    ],
  },
]

export const EDUCATION = [
  {
    id: 'easv',
    org: 'Erhvervsakademi Sydvest',
    role: 'PBA, Web Development',
    when: '2023 to 2027',
    line: 'Professional bachelor. Web development and e-business, international.',
  },
  {
    id: 'dccj',
    org: 'Danish Chamber of Commerce in Japan',
    role: 'Member',
    when: 'Feb 2026 to present',
    line: 'Languages: English, Japanese, Danish (learning).',
  },
]
