import { expect, type Page, test } from '@playwright/test'

const grid = (page: Page) => page.getByRole('grid', { name: 'Live quotes' })

const waitForData = async (page: Page) => {
  await page.goto('/lab/tape')
  await expect(grid(page).getByRole('row').nth(1)).not.toContainText('…', {
    timeout: 15_000,
  })
}

test('streams quotes into the virtualized grid', async ({ page }) => {
  await waitForData(page)
  // 10k symbols, but only a window of rows is in the DOM.
  await expect(grid(page)).toHaveAttribute('aria-rowcount', '10001')
  expect(await grid(page).getByRole('row').count()).toBeLessThan(60)
  await expect(page.getByText(/10,000 of 10,000 symbols/)).toBeVisible()
})

test('sorts on the engine and filters by symbol prefix', async ({ page }) => {
  await waitForData(page)
  const header = grid(page).getByRole('columnheader', { name: /chg %/i })
  await header.getByRole('button').click()
  await expect(header).toHaveAttribute('aria-sort', /ascending|descending/)

  await page.getByRole('searchbox', { name: 'Filter symbols' }).fill('ab')
  await expect(page.getByText(/of 10,000 symbols/)).not.toContainText(
    '10,000 of'
  )
  const symbols = await grid(page).locator('[id$="-symbol"]').allInnerTexts()
  expect(symbols.length).toBeGreaterThan(0)
  for (const symbol of symbols) expect(symbol).toMatch(/^AB/)
})

test('is keyboard operable with an active-descendant cursor', async ({
  page,
}) => {
  await waitForData(page)
  await grid(page).focus()
  await expect(grid(page)).toHaveAttribute(
    'aria-activedescendant',
    'tape-cell-0-symbol'
  )
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowRight')
  await expect(grid(page)).toHaveAttribute(
    'aria-activedescendant',
    'tape-cell-2-name'
  )
  await page.keyboard.press('Control+End')
  await expect(grid(page)).toHaveAttribute(
    'aria-activedescendant',
    'tape-cell-9999-trend'
  )
  // The active row was scrolled into view, so its cell exists.
  await expect(page.locator('#tape-cell-9999-trend')).toBeAttached()
})

test('switches the engine to the main thread and back', async ({ page }) => {
  await waitForData(page)
  await page.getByText('Main thread', { exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Main thread' })).toBeChecked()
  await expect(grid(page).getByRole('row').nth(1)).not.toContainText('…')
  await page.getByText('Web Worker', { exact: true }).click()
  await expect(grid(page).getByRole('row').nth(1)).not.toContainText('…')
})
