import { expect, test } from '@playwright/test'

// Runs in the "perf" project, after every other test has finished, so no
// parallel workers compete for the CPU while frames are measured.
// A smoke budget, not a benchmark: CI machines vary, so this catches
// regressions like per-frame re-renders, not small differences.
test('Tape holds frame time at the default load', async ({
  page,
}, testInfo) => {
  await page.goto('/lab/tape')
  await expect(
    page.getByRole('grid', { name: 'Live quotes' }).getByRole('row').nth(1)
  ).not.toContainText('…', {
    timeout: 15_000,
  })
  // Warm up (hydration, reference data, first sorts), then measure steady state.
  await page.waitForTimeout(3_000)
  const before = await page.evaluate(() => window.__tapeStats?.longFrames ?? 0)
  await page.waitForTimeout(6_000)
  const stats = await page.evaluate(() => window.__tapeStats)
  expect(stats, 'frame meter is running').toBeDefined()
  testInfo.annotations.push({
    type: 'frame-stats',
    description: JSON.stringify(stats),
  })
  expect(stats!.ticksPerSecond).toBeGreaterThan(4_000)
  // p95 within two frames, and no long animation frames in steady state.
  expect(stats!.p95).toBeLessThanOrEqual(34)
  expect(stats!.longFrames - before).toBe(0)
})
