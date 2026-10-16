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

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/experience', label: 'Experience' },
  { to: '/lab', label: 'Lab & Notes' },
  { to: '/about', label: 'About' },
]

// lit = fully covered layers, partial = in progress (drawn dashed)
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
  spectre: {
    slug: 'spectre',
    sheet: '02',
    name: 'SPECTRE',
    tagline: 'Understand the path. Break the chain.',
    status: 'Work in progress',
    summary:
      'A cloud attack-path analysis and remediation-simulation tool. It shows how identities, roles, policies and credentials chain into access to sensitive data, traces every step to its evidence, and tests a fix on a copy before you trust it.',
    repo: 'https://github.com/Hizashii/SPECTURE',
  },
  spisnem: {
    slug: 'spisnem',
    sheet: '03',
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
}

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
  ['That is why I build outside work too.', 'Applyer, SPECTRE and Spisnem are where I practise taking something from nothing to working software.'],
]

export const ABOUT_META =
  'Elsewhere: studying for a PBA in Web Development at Erhvervsakademi Sydvest, until 2027. Member of the Danish Chamber of Commerce in Japan since Feb 2026. Languages: English, Japanese, Danish (learning).'

export const TICKER = [
  'Usually building something',
  'Exploring infrastructure, local models and security',
  'Writing code most days',
  'Curious about what happens after localhost',
]
