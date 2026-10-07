import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

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
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
})
