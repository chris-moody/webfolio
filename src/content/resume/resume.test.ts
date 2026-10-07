import { describe, expect, it } from 'vitest'
import { resume } from './resume'

const allText = JSON.stringify(resume)

describe('resume content', () => {
  // D4: the ~30% figure was an estimate and is retired; no other percentage
  // claims should appear without a documented measurement.
  it('contains no percentage claims', () => {
    expect(allText).not.toMatch(/\d\s*%/)
  })

  it('lists work by most recent end date, with valid dates', () => {
    const ends = resume.work.map((role) => role.endDate ?? '9999-12')
    expect(ends).toEqual([...ends].sort().reverse())
    for (const role of resume.work) {
      expect(role.startDate).toMatch(/^\d{4}-\d{2}$/)
      if (role.endDate) {
        expect(role.endDate).toMatch(/^\d{4}-\d{2}$/)
        expect(role.endDate >= role.startDate).toBe(true)
      }
    }
  })

  it('has exactly one current role', () => {
    expect(resume.work.filter((role) => !role.endDate)).toHaveLength(1)
  })

  it('has no empty or unfinished bullets', () => {
    for (const role of resume.work) {
      for (const highlight of role.highlights) {
        expect(highlight.trim().length).toBeGreaterThan(20)
        expect(highlight).not.toMatch(/\b(our|the|a|an|and|between)\s*$/i)
      }
    }
  })
})
