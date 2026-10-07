import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the production build; set E2E_BASE_URL to target a
  // deploy preview instead.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `yarn serve:dist`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
})
