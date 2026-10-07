import { expect, test } from '@playwright/test'

test('the contrast matrix is published and every pair passes', async ({
  page,
}) => {
  await page.goto('/system')
  const matrix = page.getByRole('table', { name: /contrast ratios/i })
  const rows = matrix.locator('tbody tr')
  expect(await rows.count()).toBeGreaterThanOrEqual(16)
  await expect(matrix.getByRole('cell', { name: 'Fail' })).toHaveCount(0)
  await expect(page.getByText(/31,200 checks on every CI run/)).toBeVisible()
})

test('the playground resolves a pale color and says it adjusted', async ({
  page,
}) => {
  await page.goto('/system')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Sunflower' }).click()
  const status = page
    .locator('#playground')
    .locator('..')
    .getByRole('status')
    .first()
  await expect(status).toContainText('Adjusted for contrast')
  await page.getByRole('button', { name: 'Brand blue' }).click()
  await page.getByRole('radio', { name: 'Dark' }).check()
  await expect(status).toContainText('Resolved accent')
})
