import { defineConfig, devices } from '@playwright/test'

// Smoke tests against the dev server (`react-router dev`), which builds
// differently from production: virtual modules, the worker, and MDX are all
// served on demand. The main suite only sees the production build.
const PORT = 3200

export default defineConfig({
  testDir: './e2e/dev',
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github']] : 'list',
  timeout: 60_000,
  use: { baseURL: `http://localhost:${PORT}`, ...devices['Desktop Chrome'] },
  webServer: {
    command: `yarn dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
