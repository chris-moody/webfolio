import { expect, type Page, test } from '@playwright/test'

const trackErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    // Vite's dev client logs HMR connection notices as debug, not errors.
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

test('home and resume load', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /christopher moody/i
  )
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Resume' })
    .click()
  await expect(page).toHaveURL(/\/resume$/)
  expect(errors).toEqual([])
})

test('Tape streams data from its worker', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/lab/tape')
  await expect(
    page.getByRole('grid', { name: 'Live quotes' }).getByRole('row').nth(1)
  ).not.toContainText('…', {
    timeout: 30_000,
  })
  await expect
    .poll(() => page.evaluate(() => window.__tapeStats?.ticksPerSecond ?? 0), {
      timeout: 15_000,
    })
    .toBeGreaterThan(0)
  expect(errors).toEqual([])
})

test('case studies, including drafts, load in dev', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/work')
  const first = page.getByRole('main').getByRole('link').first()
  await expect(first).toBeVisible()
  await first.click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(
    page.getByRole('switch', { name: /orders\.tanstack-query/i })
  ).toBeVisible()
  expect(errors).toEqual([])
})

test('the tour loads', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/tour/about/0')
  await expect(
    page.getByRole('heading', { level: 1, name: /about me/i })
  ).toBeVisible()
  expect(errors).toEqual([])
})
