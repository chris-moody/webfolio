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

// Hydration warnings arrive after the page looks ready, so these wait for the
// network to settle before checking. A dev-only Emotion duplication once made
// every tour page mismatch here while production was clean.
for (const path of ['/tour/home/flair', '/tour/about/0']) {
  test(`${path} hydrates without mismatches, including after a reload`, async ({
    page,
  }) => {
    const errors = trackErrors(page)
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })
}
