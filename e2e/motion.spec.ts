import { expect, test } from '@playwright/test'

test.describe('with reduced motion requested by the system', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the preference applies before hydration and swaps animations for static content', async ({
    page,
  }) => {
    await page.goto('/tour/about/0')
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce')
    // TypeWriter shows the finished name instead of typing it forever.
    await expect(page.getByText('CHRISTOPHER', { exact: true })).toBeVisible()

    await page.goto('/tour/about/3')
    // The three endless marquees become one static list.
    await expect(
      page.getByRole('list', { name: 'Tools and technologies' })
    ).toBeVisible()
    await expect(page.locator('.item')).toHaveCount(0)
  })

  test('“Play animations” overrides the system setting and persists', async ({
    page,
  }) => {
    await page.goto('/tour/about/3')
    await page.getByRole('button', { name: 'Play animations' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full')
    await expect(
      page.getByRole('list', { name: 'Tools and technologies' })
    ).toHaveCount(0)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full')
    await expect(
      page.getByRole('button', { name: 'Stop animations' })
    ).toBeVisible()
  })
})

test('“Stop animations” is the pause control for full motion (WCAG 2.2.2)', async ({
  page,
}) => {
  await page.goto('/tour/about/3')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full')
  await expect(page.locator('.item').first()).toBeAttached()
  await page.getByRole('button', { name: 'Stop animations' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce')
  await expect(page.locator('.item')).toHaveCount(0)
})

test('Settings offers System, Reduce, and Full', async ({ page }) => {
  await page.goto('/tour/about/0')
  await page.getByRole('button', { name: 'Settings' }).click()
  const group = page.getByRole('radiogroup')
  await expect(
    group.getByRole('radio', { name: 'Match my system' })
  ).toBeChecked()
  await group.getByRole('radio', { name: 'Reduce' }).check()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce')
})
