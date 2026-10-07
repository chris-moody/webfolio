import { expect, type Locator, type Page, test } from '@playwright/test'

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
    await expect(page.locator('.item').first()).toBeAttached()
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

// A logo that is on screen and not covered, by index and center point.
const visibleLogo = (page: Page) =>
  page.evaluate(() => {
    const items = [...document.querySelectorAll<HTMLElement>('.item')]
    for (const [index, el] of items.entries()) {
      const r = el.getBoundingClientRect()
      const x = r.x + r.width / 2
      const y = r.y + r.height / 2
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue
      const hit = document.elementFromPoint(x, y)
      if (hit && el.contains(hit)) return { index, x, y }
    }
    return null
  })

// Points at (desktop) or taps (mobile) by position: hover() waits for the
// element to stop moving, which a marquee item never does on its own.
const pointAtLogo = async (page: Page, isMobile: boolean) => {
  await expect.poll(() => visibleLogo(page)).not.toBeNull()
  const logo = (await visibleLogo(page))!
  if (isMobile) await page.touchscreen.tap(logo.x, logo.y)
  else await page.mouse.move(logo.x, logo.y)
  return page.locator('.item').nth(logo.index)
}

const x = (item: Locator) => item.evaluate((el) => el.getBoundingClientRect().x)

/** The prerendered logos are there before hydration; moving means hydrated. */
const marqueeRunning = async (page: Page) => {
  const first = page.locator('.item').first()
  const start = await x(first)
  await expect.poll(() => x(first)).not.toBe(start)
}

test('the logo marquees move, and hold still under the pointer or a tap', async ({
  page,
  isMobile,
}) => {
  await page.goto('/tour/about/3')
  await marqueeRunning(page)

  const held = await pointAtLogo(page, isMobile)
  await page.waitForTimeout(100)
  const at = await x(held)
  await page.waitForTimeout(500)
  expect(await x(held)).toBe(at)
})

test('a logo shows its name and description', async ({ page, isMobile }) => {
  await page.goto('/tour/about/3')
  await marqueeRunning(page)
  await pointAtLogo(page, isMobile)
  const tip = page.getByRole('tooltip')
  await expect(tip).toBeVisible()
  await expect(tip).not.toBeEmpty()
})

test('the typewriter keeps its size while it types', async ({ page }) => {
  await page.goto('/tour/about/0')
  const box = page.locator('.text').first()
  const heights = new Set<number>()
  for (let i = 0; i < 12; i++) {
    heights.add(Math.round((await box.boundingBox())!.height))
    await page.waitForTimeout(150)
  }
  expect(heights.size).toBe(1)
})
