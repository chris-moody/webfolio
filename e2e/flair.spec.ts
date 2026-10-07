import { expect, test } from '@playwright/test'

// The flair videos pop up at random places, always fully on screen.
test('flair appears at random spots inside the viewport', async ({ page }) => {
  await page.goto('/tour/fun/2')
  const button = page.getByRole('button', { name: 'Click Me!' })
  const viewport = page.viewportSize()!
  const spots = new Set<string>()
  for (let i = 0; i < 3; i++) {
    const flair = page.locator('video').locator('..')
    // The button is prerendered; a click before it hydrates does nothing.
    await expect(async () => {
      await button.click()
      await expect(flair).toBeVisible({ timeout: 1000 })
    }).toPass()
    // The box grows as its caption types; measure once the video has a size.
    await expect
      .poll(async () => (await flair.boundingBox())?.height ?? 0)
      .toBeGreaterThan(100)
    const box = (await flair.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(-1)
    expect(box.y).toBeGreaterThanOrEqual(-1)
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1)
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1)
    spots.add(`${Math.round(box.x)},${Math.round(box.y)}`)
    // A click is ignored while a flair is showing; wait for it to finish.
    await expect(flair).toHaveCount(0, { timeout: 6000 })
  }
  expect(spots.size).toBeGreaterThan(1)
})
