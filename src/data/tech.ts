// The logos on the tour's "tools and technologies" slide, with the one-line
// descriptions shown in their tooltips.

export interface Tech {
  name: string
  description: string
  src: string
}

const icon = (file: string) => `/tech_icons/${file}`

export const tools: Tech[] = [
  {
    name: 'Canva',
    description: 'Quick graphics and social assets.',
    src: icon('canva.svg'),
  },
  {
    name: 'Confluence',
    description: 'Team documentation and design specs.',
    src: icon('confluence.webp'),
  },
  {
    name: 'GitHub Copilot',
    description: 'AI pair programming in the editor.',
    src: icon('copilot.webp'),
  },
  {
    name: 'Figma',
    description: 'UI design, prototyping, and design handoff.',
    src: icon('figma.webp'),
  },
  {
    name: 'Jira',
    description: 'Issue tracking and sprint planning.',
    src: icon('jira.webp'),
  },
  {
    name: 'Miro',
    description: 'Whiteboarding for architecture and workshops.',
    src: icon('miro.svg'),
  },
  {
    name: 'VS Code',
    description: 'My everyday editor.',
    src: icon('vscode.svg'),
  },
  {
    name: 'WebStorm',
    description: 'JetBrains IDE for JavaScript and TypeScript.',
    src: icon('webstorm.webp'),
  },
]

export const libraries: Tech[] = [
  {
    name: 'Cytoscape.js',
    description: 'Graph and network visualization.',
    src: icon('cytoscape.svg'),
  },
  {
    name: 'D3',
    description: 'Data-driven visualizations and layout math.',
    src: icon('d3.webp'),
  },
  {
    name: 'Dexie.js',
    description: 'A friendly wrapper for IndexedDB.',
    src: icon('dexiejs.svg'),
  },
  {
    name: 'React Router',
    description: 'Routing, data loading, and prerendering (this site).',
    src: icon('react-router.svg'),
  },
  { name: 'Git', description: 'Version control.', src: icon('git.webp') },
  {
    name: 'GSAP',
    description: 'Timeline animation (these marquees).',
    src: icon('gsap.svg'),
  },
  {
    name: 'Highcharts',
    description: 'Interactive business charts.',
    src: icon('highcharts.webp'),
  },
  {
    name: 'MUI',
    description: 'React component library (this tour).',
    src: icon('mui.webp'),
  },
  {
    name: 'PixiJS',
    description: 'WebGL 2D rendering (the water text).',
    src: icon('pixijs.webp'),
  },
  {
    name: 'Wouter',
    description: 'A tiny router for React.',
    src: icon('wouter.svg'),
  },
  {
    name: 'React',
    description: 'Component-based UI. My main framework.',
    src: icon('react.svg'),
  },
  {
    name: 'Redux',
    description: 'Predictable app state, with Redux Toolkit.',
    src: icon('redux.webp'),
  },
  {
    name: 'styled-components',
    description: 'CSS-in-JS for React.',
    src: icon('styled-components.webp'),
  },
  {
    name: 'Next.js',
    description: 'React framework for server rendering.',
    src: icon('nextjs.svg'),
  },
]

export const platform: Tech[] = [
  {
    name: 'AWS',
    description: 'Cloud hosting and services.',
    src: icon('aws.svg'),
  },
  {
    name: 'CSS',
    description: 'Layout, animation, and modern selectors.',
    src: icon('css.svg'),
  },
  {
    name: 'DynamoDB',
    description: 'AWS key-value and document database.',
    src: icon('dynamoDb.webp'),
  },
  {
    name: 'HTML',
    description: 'Semantic, accessible markup.',
    src: icon('html.svg'),
  },
  {
    name: 'JavaScript',
    description: 'The language of the web.',
    src: icon('js.svg'),
  },
  {
    name: 'MongoDB',
    description: 'Document database.',
    src: icon('mongoDb.svg'),
  },
  {
    name: 'Node.js',
    description: 'JavaScript on the server and in tooling.',
    src: icon('node.svg'),
  },
  {
    name: 'PostgreSQL',
    description: 'Relational database.',
    src: icon('postgresql.webp'),
  },
  {
    name: 'Sass',
    description: 'CSS with variables, mixins, and nesting.',
    src: icon('sass.webp'),
  },
  {
    name: 'Socket.IO',
    description: 'Real-time, bidirectional events.',
    src: icon('socketIO.webp'),
  },
  {
    name: 'TypeScript',
    description: 'Typed JavaScript. Strict mode everywhere.',
    src: icon('typescript.webp'),
  },
  {
    name: 'Vite',
    description: 'Fast dev server and build tool (this site).',
    src: icon('vite.svg'),
  },
  {
    name: 'webpack',
    description: 'Module bundler.',
    src: icon('webpack.webp'),
  },
]
