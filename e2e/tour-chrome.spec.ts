import { expect, test } from '@playwright/test'
import { tourPaths } from '../src/data/tour.manifest'

test('the tour menu links only to real tour pages (and back to the site)', async ({
  page,
}) => {
  await page.goto('/tour/about/0')
  await page.getByRole('button', { name: 'Navigation' }).click()
  const menu = page.locator('.MuiDrawer-paper')
  // Open every submenu with the keyboard-operable toggles.
  const show = menu.getByRole('button', { name: /^Show .* pages$/ })
  while ((await show.count()) > 0) await show.first().click()
  const hrefs = await menu
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  const pages = new Set([...tourPaths(), '/'])
  expect(hrefs.length).toBeGreaterThan(5)
  for (const href of hrefs) expect(pages.has(href!), href!).toBe(true)
})

test('tour submenus open from the keyboard', async ({ page }) => {
  await page.goto('/tour/about/0')
  await page.getByRole('button', { name: 'Navigation' }).click()
  const toggle = page.getByRole('button', { name: 'Show Stories pages' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('button', { name: 'Hide Stories pages' })
  ).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('link', { name: 'Make it Bad' })).toBeVisible()
})

test('Settings lists the motion choice after the flair buttons', async ({
  page,
}) => {
  await page.goto('/tour/about/0')
  await page.getByRole('button', { name: 'Settings' }).click()
  const dialog = page.getByRole('dialog')
  const flairBox = await dialog
    .getByRole('button', { name: '37 pieces' })
    .boundingBox()
  const motionBox = await dialog.getByRole('radiogroup').boundingBox()
  expect(motionBox!.y).toBeGreaterThan(flairBox!.y)
})

// The outgoing slide's view-transition snapshot must stay hidden once faded;
// without a fill mode it reappeared for the rest of the transition (a blink).
test('the outgoing slide stays hidden once it has faded', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'View transitions are checked in Chromium'
  )
  await page.goto('/tour/about/1')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    const seen: string[] = []
    ;(window as unknown as { __fills: string[] }).__fills = seen
    const poll = () => {
      for (const animation of document.getAnimations()) {
        const effect = animation.effect as KeyframeEffect | null
        if (effect?.pseudoElement?.includes('view-transition-old(wizard-step)'))
          seen.push(String(effect.getComputedTiming().fill))
      }
      if (seen.length < 5) requestAnimationFrame(poll)
    }
    requestAnimationFrame(poll)
  })
  await page.getByRole('link', { name: 'Next', exact: true }).last().click()
  await expect(page).toHaveURL(/\/tour\/about\/2$/)
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { __fills: string[] }).__fills)
    )
    .not.toEqual([])
  const fills = await page.evaluate(
    () => (window as unknown as { __fills: string[] }).__fills
  )
  expect(new Set(fills)).toEqual(new Set(['both']))
})
