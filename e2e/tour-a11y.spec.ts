import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { tourRoutes } from './routes'

// Every flair level (the tour's themes) in both motion modes. Light/dark is
// alternated across flair levels to keep the matrix affordable; a11y.spec.ts
// covers light and dark at the default flair.
const combos = [
  { flair: 1, colorScheme: 'light', reducedMotion: 'reduce' },
  { flair: 1, colorScheme: 'light', reducedMotion: 'no-preference' },
  { flair: 15, colorScheme: 'dark', reducedMotion: 'reduce' },
  { flair: 15, colorScheme: 'dark', reducedMotion: 'no-preference' },
  { flair: 37, colorScheme: 'light', reducedMotion: 'reduce' },
  { flair: 37, colorScheme: 'dark', reducedMotion: 'no-preference' },
] as const

// axe on flair-37 pages (layered 3D text) can take several seconds under load.
test.describe.configure({ timeout: 60_000 })

for (const combo of combos) {
  test.describe(`flair ${combo.flair}, ${combo.colorScheme}, motion ${combo.reducedMotion}`, () => {
    test.use({
      colorScheme: combo.colorScheme,
      reducedMotion: combo.reducedMotion,
    })
    test.beforeEach(async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name !== 'desktop',
        'Theme matrix runs on desktop'
      )
      await page.addInitScript(
        (flair) => localStorage.setItem('flair', String(flair)),
        combo.flair
      )
    })

    for (const route of tourRoutes) {
      test(`${route.path} has no axe violations`, async ({ page }) => {
        await page.goto(route.path)
        await expect(
          page.getByRole('heading', { level: 1, name: route.heading }).first()
        ).toBeVisible()
        await page.waitForTimeout(1500)
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
        expect(
          results.violations.map(({ id, nodes }) => ({
            id,
            targets: nodes.slice(0, 3).map((node) => node.target.join(' ')),
          }))
        ).toEqual([])
      })
    }
  })
}
