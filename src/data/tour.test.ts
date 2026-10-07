import { describe, expect, it } from 'vitest'
import wizards from './wizards'
import {
  tourManifest,
  tourPaths,
  tourRedirects,
  TOUR_START,
} from './tour.manifest'

describe('tour manifest', () => {
  it('matches the wizard content exactly', () => {
    expect(tourManifest.map((wizard) => wizard.id).sort()).toEqual(
      Object.keys(wizards).sort()
    )
    for (const entry of tourManifest) {
      const steps = wizards[entry.id]?.stepData?.map((step) => step.id) ?? []
      expect(steps, entry.id).toEqual(entry.steps)
    }
  })

  it('gives every slide a short title', () => {
    for (const wizard of Object.values(wizards)) {
      for (const step of wizard.stepData ?? []) {
        expect(step.title, `${wizard.id}/${step.id}`).toMatch(/\S/)
        expect(
          step.title.length,
          `${wizard.id}/${step.id}`
        ).toBeLessThanOrEqual(32)
      }
    }
  })

  it('starts on a real page', () => {
    expect(tourPaths()).toContain(
      `/tour/${TOUR_START.wizard}/${TOUR_START.step}`
    )
  })

  it('redirects only to prerendered pages', () => {
    const pages = new Set([...tourPaths(), '/404'])
    for (const [from, to] of tourRedirects()) {
      expect(pages.has(to), `${from} → ${to}`).toBe(true)
      expect(pages.has(from), `${from} shadows a page`).toBe(false)
    }
  })

  it('keeps the new /resume and /work pages free of legacy redirects', () => {
    const sources = tourRedirects().map(([from]) => from)
    expect(sources).not.toContain('/resume')
    expect(sources).not.toContain('/work')
    expect(sources).toContain('/work/0')
  })
})
