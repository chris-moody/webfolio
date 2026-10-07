import { expect, test } from '@playwright/test'
import { routes } from './routes'

for (const route of routes) {
  test(`renders ${route.path} without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })

    await page.goto(route.path)
    await expect(
      page.getByRole('heading', { level: 1, name: route.heading }).first()
    ).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('unknown URLs get the 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/definitely/not/a/page')
  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { level: 1, name: /doesn’t exist/i })
  ).toBeVisible()
})
