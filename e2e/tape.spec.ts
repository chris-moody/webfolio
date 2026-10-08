import { expect, type Page, test } from '@playwright/test'

const grid = (page: Page) => page.getByRole('grid', { name: 'Live quotes' })

const waitForData = async (page: Page) => {
  await page.goto('/lab/tape')
  await expect(grid(page).getByRole('row').nth(1)).not.toContainText('…', {
    timeout: 15_000,
  })
}

/** The open Columns panel sits against its button (above or below), on screen. */
const expectNextTo = async (page: Page) => {
  const { button, panel, viewport } = await page.evaluate(() => {
    const box = (el: Element | null) =>
      el!.getBoundingClientRect().toJSON() as DOMRect
    return {
      button: box(document.querySelector('button[popovertarget]')),
      panel: box(document.querySelector('[popover]')),
      viewport: { width: innerWidth, height: innerHeight },
    }
  })
  const gapBelow = panel.top - button.bottom
  const gapAbove = button.top - panel.bottom
  expect(Math.min(Math.abs(gapBelow - 6), Math.abs(gapAbove - 6))).toBeLessThan(
    2
  )
  const alignedRight = Math.abs(panel.right - button.right) < 2
  const alignedLeft = Math.abs(panel.left - button.left) < 2
  expect(alignedRight || alignedLeft).toBe(true)
  expect(panel.left).toBeGreaterThanOrEqual(0)
  expect(panel.right).toBeLessThanOrEqual(viewport.width)
  expect(panel.bottom).toBeLessThanOrEqual(viewport.height)
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

test('the Columns menu opens without shifting the layout', async ({ page }) => {
  await waitForData(page)
  const before = await grid(page).boundingBox()
  const button = page.getByRole('button', { name: /^columns/i })
  await button.click()
  const menu = page.getByRole('group', { name: 'Visible columns' })
  await expect(menu).toBeVisible()
  expect(await grid(page).boundingBox()).toEqual(before)
  await expectNextTo(page)

  await expect(
    grid(page).getByRole('columnheader', { name: 'Trend' })
  ).toBeVisible()
  await menu.getByRole('checkbox', { name: 'Trend' }).uncheck()
  await expect(
    grid(page).getByRole('columnheader', { name: 'Trend' })
  ).toHaveCount(0)
  await expect(button).toContainText('8/11')

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(button).toBeFocused()
})

test('frame meter labels explain themselves on hover and focus', async ({
  page,
}) => {
  await waitForData(page)
  const label = page.getByRole('button', { name: 'Frame p95' })
  // Screen readers get the description whether or not the tooltip shows.
  await expect(label).toHaveAccessibleDescription(/95% of recent frames/)
  const tip = page
    .locator('body > div[aria-hidden="true"]')
    .filter({ hasText: '95% of recent frames' })
  await label.focus()
  await expect(tip).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tip).toBeHidden()
  await label.hover()
  await expect(tip).toBeVisible()
})

test.describe('before hydration (no JavaScript)', () => {
  test.use({ javaScriptEnabled: false })

  // The prerendered page's popover works natively; CSS anchor positioning
  // must place it without any script.
  test('the Columns menu still opens next to its button', async ({ page }) => {
    await page.goto('/lab/tape')
    const button = page.getByRole('button', { name: /^columns/i })
    await button.scrollIntoViewIfNeeded()
    await button.click()
    await expect(
      page.getByRole('group', { name: 'Visible columns' })
    ).toBeVisible()
    await expectNextTo(page)
  })
})
