import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { routes } from './routes'

const colorSchemes = ['light', 'dark'] as const

for (const colorScheme of colorSchemes) {
  test.describe(`${colorScheme} mode`, () => {
    test.use({ colorScheme })

    for (const route of routes) {
      test(`${route.path} has no axe violations`, async ({ page }) => {
        await page.goto(route.path)
        await expect(
          page.getByRole('heading', { level: 1, name: route.heading }).first()
        ).toBeVisible()
        // Let entrance animations settle so contrast is measured on final styles.
        await page.waitForTimeout(1500)

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()

        expect(
          results.violations.map(({ id, impact, nodes }) => ({
            id,
            impact,
            targets: nodes.slice(0, 3).map((node) => node.target.join(' ')),
          }))
        ).toEqual([])
      })
    }
  })
}
