import { expect, type Page, test } from '@playwright/test'
import { tourManifest } from '../src/data/tour.manifest'

const carousels = tourManifest.filter((wizard) => wizard.steps.length > 1)

const live = (page: Page) => page.locator('[data-slide-announcer]')
const activeText = (page: Page) =>
  page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')

test.describe('carousel semantics', () => {
  test('a multi-slide wizard is a labelled carousel of labelled slides', async ({
    page,
  }) => {
    await page.goto('/tour/about/2')
    const carousel = page.locator('section[aria-roledescription="carousel"]')
    await expect(carousel).toHaveAttribute('aria-label', 'About Me')
    const slide = carousel.locator('[aria-roledescription="slide"]')
    await expect(slide).toHaveAttribute('role', 'group')
    await expect(slide).toHaveAttribute(
      'aria-label',
      '3 of 5: Where I’ve worked'
    )
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: /slide 3 of 5 · where i’ve worked/i,
      })
    ).toBeVisible()
  })

  test('the slide picker names every slide and marks the current one', async ({
    page,
  }) => {
    await page.goto('/tour/about/2')
    const nav = page.getByRole('navigation', { name: 'Slides' })
    const links = nav.getByRole('link')
    await expect(links).toHaveCount(5)
    await expect(links.nth(0)).toHaveAccessibleName(
      'Go to slide 1 of 5: My name'
    )
    await expect(links.nth(2)).toHaveAttribute('aria-current', 'step')
    await expect(nav.locator('[aria-current]')).toHaveCount(1)
    // WCAG 2.5.8: targets at least 24 × 24.
    for (const link of await links.all()) {
      const box = (await link.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(24)
      expect(box.height).toBeGreaterThanOrEqual(24)
    }
  })

  test('Back on the first slide is a disabled link, not a missing one', async ({
    page,
  }) => {
    await page.goto('/tour/home/flair')
    const back = page.getByRole('link', { name: 'Back' })
    await expect(back).toHaveAttribute('aria-disabled', 'true')
    await expect(page.getByRole('link', { name: 'Next' })).toHaveAttribute(
      'href',
      '/tour/home/color'
    )
  })

  test('single-slide wizards are not carousels', async ({ page }) => {
    await page.goto('/tour/purpose/why')
    await expect(page.locator('[aria-roledescription="carousel"]')).toHaveCount(
      0
    )
    await expect(
      page.getByRole('heading', { level: 2, name: 'Why are you here?' })
    ).toBeAttached()
  })
})

test.describe('keyboard', () => {
  for (const wizard of carousels) {
    test(`${wizard.title} can be completed with the keyboard alone`, async ({
      page,
    }) => {
      await page.goto(`/tour/${wizard.id}/${wizard.steps[0]}`)
      await expect(live(page)).toHaveText('') // nothing announced on first load

      // Tab to Next, then keep pressing Enter: focus stays on Next and each
      // slide is announced.
      const next = page.getByRole('link', { name: 'Next', exact: true }).last()
      for (
        let i = 0;
        i < 40 && !(await next.evaluate((el) => el === document.activeElement));
        i++
      ) {
        await page.keyboard.press('Tab')
      }
      await expect(next).toBeFocused()

      for (let i = 1; i < wizard.steps.length; i++) {
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(
          new RegExp(`/tour/${wizard.id}/${wizard.steps[i]}$`)
        )
        await expect(live(page)).toContainText(
          `slide ${i + 1} of ${wizard.steps.length}`
        )
        expect(await activeText(page)).toBe('Next')
      }
    })
  }

  test('arrow keys, Home, and End move between slides', async ({ page }) => {
    await page.goto('/tour/beta/0')
    await page.waitForLoadState('networkidle') // key handling needs hydration
    await page
      .getByRole('navigation', { name: 'Slides' })
      .getByRole('link')
      .first()
      .focus()
    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/\/tour\/beta\/1$/)
    await page.keyboard.press('End')
    await expect(page).toHaveURL(/\/tour\/beta\/4$/)
    await page.keyboard.press('ArrowLeft')
    await expect(page).toHaveURL(/\/tour\/beta\/3$/)
    await page.keyboard.press('Home')
    await expect(page).toHaveURL(/\/tour\/beta\/0$/)
  })

  test('arrow keys stay with the color picker', async ({ page }) => {
    await page.goto('/tour/home/color')
    const slider = page.getByRole('slider').first()
    await slider.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
    await expect(page).toHaveURL(/\/tour\/home\/color$/)
  })

  test('focus moves to the new slide when its control disappears', async ({
    page,
  }) => {
    await page.goto('/tour/fun/3')
    // "End" lives inside the last slide; the next wizard has no such control.
    const end = page
      .locator('.header-actions')
      .getByRole('link', { name: 'End' })
    await end.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/tour\/storytime\/story-selection$/)
    await expect(
      page.getByRole('heading', { level: 2, name: 'Pick a story' })
    ).toBeFocused()
    await expect(live(page)).toHaveText('Story Time')
  })
})

test('3D text (flair 37) exposes its content once, not once per layer', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('flair', '37'))
  await page.goto('/tour/about/0')
  await page.waitForLoadState('networkidle')
  // getByRole skips inert, aria-hidden, and visibility:hidden copies.
  await expect(
    page.locator('.header-actions').getByRole('link', { name: 'Next' })
  ).toHaveCount(1)
  await expect(
    page.getByRole('heading', { level: 1, name: 'About Me' })
  ).toHaveCount(1)
  // Tab order reaches the in-slide Next exactly once per cycle.
  const visited = new Set<string>()
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const id = await page.evaluate(() => {
      const el = document.activeElement
      if (!el?.closest('.header-actions')) return null
      el.setAttribute(
        'data-visited',
        el.getAttribute('data-visited') ?? String(Math.random())
      )
      return el.getAttribute('data-visited')
    })
    if (id) visited.add(id)
  }
  expect(visited.size).toBe(1)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Back and Next are plain links that work', async ({ page }) => {
    await page.goto('/tour/work/0')
    await page.getByRole('link', { name: 'Next', exact: true }).last().click()
    await expect(page).toHaveURL(/\/tour\/work\/1$/)
    await page.getByRole('link', { name: 'Back' }).click()
    await expect(page).toHaveURL(/\/tour\/work\/0$/)
  })
})
