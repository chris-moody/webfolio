import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import { caseStudiesPlugin } from './scripts/case-studies.plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  optimizeDeps: {
    // Scan every route up front so dependencies are pre-bundled at startup.
    // Otherwise the first visit to the tour (MUI, GSAP, Pixi) re-optimizes
    // and reloads the page mid-session.
    entries: ['src/**/*.tsx'],
    // MUI's transitive dependencies, which the scan doesn't reach through
    // MUI's deep imports. Listed so the first tour visit doesn't trigger
    // "optimized dependencies changed, reloading".
    include: [
      '@emotion/serialize',
      '@emotion/sheet',
      '@emotion/styled',
      '@popperjs/core',
      'clsx',
      'prop-types',
      'react-is',
      'react-transition-group',
    ],
  },
  ssr: {
    // MUI 6's ESM build uses directory imports, which Node's resolver rejects,
    // so the build-time renderer bundles it instead of importing it from node_modules.
    noExternal: [/^@mui\//],
  },
  // The React Router plugin owns the app build; Vitest only needs JSX.
  plugins: [
    tailwindcss(),
    // Case studies: MDX with YAML frontmatter exported as `frontmatter`.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
      }),
    },
    caseStudiesPlugin(),
    !process.env.VITEST && reactRouter(),
  ],
})
