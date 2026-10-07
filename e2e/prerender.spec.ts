import { expect, test } from '@playwright/test'
import { routes } from './routes'

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const route of routes) {
    test(`${route.path} has its content in the HTML`, async ({ page }) => {
      await page.goto(route.path)
      await expect(
        page.getByRole('heading', { level: 1, name: route.heading }).first()
      ).toBeVisible()
    })
  }

  test('the resume is readable', async ({ page }) => {
    await page.goto('/resume')
    await expect(
      page.getByRole('heading', { level: 2, name: 'Experience' })
    ).toBeVisible()
    await expect(page.getByText(/Carnegie Mellon University/)).toBeVisible()
  })
})

// Prerendered HTML looks right even when hydration fails, so prove the app
// took over: a client-side navigation keeps window state; a reload wouldn't.
test('content pages hydrate and navigate client-side', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.evaluate(
    () => ((window as unknown as { __marker: number }).__marker = 1)
  )
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Resume' })
    .click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /christopher moody/i
  )
  expect(
    await page.evaluate(
      () => (window as unknown as { __marker?: number }).__marker
    )
  ).toBe(1)
})

test('tour pages hydrate and navigate client-side', async ({ page }) => {
  await page.goto('/tour/about/0')
  await page.waitForLoadState('networkidle')
  await page.evaluate(
    () => ((window as unknown as { __marker: number }).__marker = 1)
  )
  await page.locator('#wizard-dot-1').click()
  await expect(page).toHaveURL(/\/tour\/about\/1$/)
  expect(
    await page.evaluate(
      () => (window as unknown as { __marker?: number }).__marker
    )
  ).toBe(1)
})

test('the resume PDF is generated and served', async ({ request }) => {
  const response = await request.get('/cmoodyResume.pdf')
  expect(response.status()).toBe(200)
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
})
