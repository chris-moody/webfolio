import type { Resume } from './resume.types'

// Commits touching this directory must touch nothing else; run
// scripts/resume-squash.sh afterwards so history keeps only the current version.
export const resume: Resume = {
  basics: {
    name: 'Christopher Moody',
    label: 'Principal Front-End Engineer',
    email: 'chris@moodydigital.com',
    phone: '917.225.7503',
    location: 'Cary, NC',
    url: 'https://webfolio.moodydigital.com',
    profiles: [
      {
        network: 'LinkedIn',
        url: 'https://linkedin.com/in/christophermoody',
        label: 'linkedin.com/in/christophermoody',
      },
      {
        network: 'GitHub',
        url: 'https://github.com/chris-moody',
        label: 'github.com/chris-moody',
      },
    ],
    summary:
      'Front-end engineer with nearly 20 years of experience architecting scalable UI systems, shared component frameworks, and production SaaS platforms. Deep expertise in TypeScript, React, and Vue, with strong command of browser APIs, front-end performance, and AI-augmented development. Known for modernizing large codebases incrementally while product work keeps shipping, and for partnering closely with product and design to turn complex requirements into practical solutions.',
  },
  skills: [
    {
      name: 'Languages',
      keywords: ['TypeScript', 'JavaScript', 'HTML', 'CSS/Sass', 'C#', 'SQL'],
    },
    {
      name: 'Frameworks',
      keywords: [
        'React',
        'Vue',
        'Alpine.js',
        'Node.js',
        'Redux Toolkit / RTK Query',
        'MUI',
        'Tailwind',
        'Electron',
      ],
    },
    {
      name: 'Architecture & Performance',
      keywords: [
        'SSR',
        'micro-frontends',
        'shared component libraries',
        'Web Workers',
        'virtualization',
        'IndexedDB',
        'browser APIs',
      ],
    },
    {
      name: 'Visualization',
      keywords: ['d3', 'Cytoscape.js', 'Three.js', 'PixiJS', 'GSAP', 'AG Grid'],
    },
    {
      name: 'Testing & Build',
      keywords: [
        'Jest',
        'Vitest',
        'Cypress',
        'Vite',
        'Rollup',
        'Webpack',
        'CI/CD',
      ],
    },
    {
      name: 'Cloud & Data',
      keywords: ['AWS Lambda', 'DynamoDB', 'PostgreSQL'],
    },
    {
      name: 'AI',
      keywords: [
        'Claude Code',
        'GitHub Copilot',
        'MCP servers',
        'prompt engineering',
        'agent workflows',
      ],
    },
    {
      name: 'Collaboration',
      keywords: ['Figma', 'Jira', 'Linear', 'Confluence', 'Miro'],
    },
  ],
  work: [
    {
      name: 'Unanet',
      position: 'Senior Software Engineer',
      location: 'Remote',
      startDate: '2025-07',
      highlights: [
        'Contributed to overall modernization efforts for the company’s legacy ERP web application',
        'Migrated RTK Query to TanStack Query to simplify API calls',
        'Reduced repeated code by creating a shared application layer',
        'Leveraged Claude to develop, iterate on, and consume agents and skills used by the dev team',
        'Conduct code reviews and audits',
      ],
    },
    {
      name: 'Biolumina',
      position: 'Senior Interactive Developer',
      location: 'Freelance, Remote',
      startDate: '2025-03',
      endDate: '2025-07',
      highlights: [
        'Designed AI-augmented development workflows that accelerate delivery of websites, interactive panels, and banner ads in a fast-paced agency environment with shifting scope and compressed deadlines',
        'Authored purpose-built Vue, React, Alpine.js, and vanilla JS (ES5) UI frameworks used by both AI agents and human developers',
        'Automated Figma design extraction with MCP servers and Claude tool integrations, significantly reducing asset prep time',
        'Used IndexedDB and the Web Storage API for offline metrics tracking and theme persistence',
      ],
    },
    {
      name: 'Metabolon, Inc.',
      position: 'Principal Software Engineer',
      location: 'Remote (Research Triangle Park, NC)',
      startDate: '2017-08',
      endDate: '2025-02',
      note: 'Promoted from Senior Software Engineer to Principal in 2021',
      highlights: [
        'Architected the company’s primary React web app, the main source of client deliverables, and evolved it into a multi-tenant SaaS platform',
        'Created a shared component library adopted across three engineering teams, removing duplicated UI code and the cost of maintaining parallel implementations',
        'Led incremental modernization without pausing feature work: adopted hooks, converted class components to functional components, and migrated from Thunk to RTK Query',
        'Owned build pipelines (CRA, Webpack, Vite) and CI/CD; remediated security vulnerabilities and coordinated releases',
        'Built data visualizations with d3 and Cytoscape.js, using web workers and virtualization to process large data sets without blocking the main thread',
        'Developed tooling to convert graphs authored in Cytoscape desktop into the Cytoscape.js web format',
        'Used IndexedDB (via Dexie) to improve performance and support offline-capable workflows',
        'Replaced command-line processes with streamlined GUIs, reducing time-to-insight for scientific clients; built internal tools that eliminated paper processes',
        'Established the Jest testing strategy and coverage standards, improving release confidence and reducing regressions',
        'Authored UML diagrams, documentation, and optimization roadmaps; identified and prioritized technical debt',
        'Interviewed and onboarded engineers; distributed tasks, reviewed code, and set patterns and style',
        'Partnered with product management to gather requirements, write and point stories, and prioritize the backlog',
        'Integrated GitHub Copilot and Claude into team workflows for unit tests, code review, and boilerplate',
        'Supported the backend AWS migration; built C# .NET authentication middleware to secure backend routes',
      ],
    },
    {
      name: 'Hidden Level Games',
      position: 'Co-Founder & Lead Engineer',
      location: 'New York, NY',
      startDate: '2011-10',
      endDate: '2017-12',
      highlights: [
        'Led engineering on a greenfield interactive programming game for Windows/Mac (AS3, Adobe AIR)',
        'Designed CodePop, a domain-specific scripting language that let non-engineers modify game world and object properties in real time',
        'Co-authored a Python backend (Flask, MongoDB) for saving and sharing creations; prototyped a WebSocket server for real-time multiplayer collaboration',
        'Partnered with the Anita Borg Foundation to host beta coding camps and develop classroom curricula with educators',
      ],
    },
    {
      name: 'NeOn, an FCB Health Company',
      position: 'Senior Developer',
      location: 'Remote',
      startDate: '2013-11',
      endDate: '2017-05',
      highlights: [
        'Built responsive websites with React, Angular, Next.js, Node.js, Handlebars, and Pug',
        'Authored mkr.js, an open-source JavaScript framework abstracting HTML/CSS authoring, adopted team-wide for templated content',
        'Built Node.js/Electron desktop servers for multi-screen, networked application rollouts at live conferences, with on-site support',
        'Created data visualizations with d3 and data tables with AG Grid; designed an analytics platform for tracking engagement',
        'Mentored team members and advised creative teams on UI/UX within technical constraints',
      ],
    },
    {
      name: 'Harrison and Star',
      position: 'Senior Interactive Developer',
      location: 'New York, NY',
      startDate: '2011-11',
      endDate: '2013-12',
      highlights: [
        'Built HTML/CSS3/JavaScript iPad marketing tools and touchscreen desktop and iOS applications',
        'Built a suite of applications that let iPads control video content across networked devices',
        'Architected a SQLite database manager for tracking, storing, and distributing application metrics',
      ],
    },
  ],
  earlierExperience: [
    'Tremor Video, NeON, Draftfcb, LyonHeart, Visual Alchemy, Erkel Associates, Senior / Lead Developer (2009–2011): content development frameworks, rich media for Pfizer and Boehringer-Ingelheim, touchscreen kiosk applications, team leadership, and hiring',
    'IBM, Research Triangle Park, Engineer/Scientist (2008–2009) and Co-op Engineer (2004–2007): hardware stability test applications and defect triage for critical test cycles',
  ],
  education: [
    {
      institution: 'Carnegie Mellon University',
      studyType: 'B.S.',
      area: 'Electrical and Computer Engineering',
      endDate: '2007',
    },
  ],
}
