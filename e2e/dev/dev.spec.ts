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
  const study = page
    .getByRole('main')
    .getByRole('link', { name: /migrating without freezing/i })
  await expect(study).toBeVisible()
  await study.click()
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

// Vite's dev server never removes a stylesheet once loaded, so after leaving
// the tour both tour.css and site.css apply. Their layer order must agree.
test('leaving the tour lands on a styled site page', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/tour/about/0')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Navigation' }).click()
  await page.getByRole('link', { name: 'Leave the tour' }).click()
  await expect(page).toHaveURL(/\/$/)
  const h1 = page.getByRole('heading', { level: 1 })
  await expect
    .poll(() => h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)))
    .toBeGreaterThan(30)
  expect(errors).toEqual([])
})

// Case-study drafts exist only in dev and preview builds, so their live
// elements are checked here.
test('the density plot aggregates in its worker', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/work/keeping-the-main-thread-free')
  await expect
    .poll(() => page.evaluate(() => window.__plotStats?.ticksPerSecond ?? 0), {
      timeout: 15_000,
    })
    .toBeGreaterThan(0)
  await expect(page.getByText(/aggregated in .* on the worker/i)).toBeVisible()
  await page.getByLabel('The main thread').check()
  await expect(page.getByText(/on the main thread\./i)).toBeVisible()
  expect(errors).toEqual([])
})

test('one theme change restyles every app using the shared library', async ({
  page,
}) => {
  const errors = trackErrors(page)
  await page.goto('/work/one-library-three-teams')
  const exportButton = page.getByRole('button', { name: 'Export' })
  const inviteButton = page.getByRole('button', { name: 'Invite' })
  const bg = (locator: typeof exportButton) =>
    locator.evaluate((el) => getComputedStyle(el).backgroundColor)
  const before = await bg(exportButton)
  await page.getByRole('button', { name: 'Hot pink' }).click()
  await expect.poll(() => bg(exportButton)).not.toBe(before)
  // Same component, same new color, in a different app.
  expect(await bg(inviteButton)).toBe(await bg(exportButton))
  expect(errors).toEqual([])
})
