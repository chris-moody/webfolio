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
