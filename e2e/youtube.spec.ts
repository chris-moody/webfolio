import { expect, test } from '@playwright/test'

test('YouTube embeds load only after the facade is activated', async ({
  page,
}) => {
  await page.goto('/tour/beta/0')
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.getByRole('button', { name: /play video/i }).click()
  await expect(
    page.locator('iframe[src*="youtube-nocookie.com/embed/"]')
  ).toHaveCount(1)
})
