import { describe, expect, it } from 'vitest'
import {
  p75,
  sanitizeSample,
  summarize,
  type VitalSample,
  windowStart,
} from './vitals.lib'

const now = new Date('2026-10-07T12:00:00Z')

describe('sanitizeSample', () => {
  it('keeps only the fields needed and strips query strings', () => {
    const sample = sanitizeSample(
      {
        name: 'LCP',
        value: 1834.1234,
        rating: 'good',
        path: '/resume?ref=x#top',
        navigationType: 'navigate',
        id: 'v4-1',
        extra: 'x',
      },
      now
    )
    expect(sample).toEqual({
      name: 'LCP',
      value: 1834.123,
      rating: 'good',
      path: '/resume',
      navigationType: 'navigate',
      day: '2026-10-07',
    })
  })

  it('rejects malformed or implausible samples', () => {
    expect(
      sanitizeSample({ name: 'FID', value: 1, rating: 'good', path: '/' })
    ).toBeNull()
    expect(
      sanitizeSample({ name: 'CLS', value: 50, rating: 'poor', path: '/' })
    ).toBeNull()
    expect(
      sanitizeSample({ name: 'LCP', value: -1, rating: 'good', path: '/' })
    ).toBeNull()
    expect(
      sanitizeSample({ name: 'LCP', value: 100, rating: 'great', path: '/' })
    ).toBeNull()
    expect(
      sanitizeSample({
        name: 'LCP',
        value: 100,
        rating: 'good',
        path: 'https://evil.example',
      })
    ).toBeNull()
    expect(sanitizeSample('nope')).toBeNull()
  })
})

describe('p75', () => {
  it('uses nearest rank', () => {
    expect(p75([1, 2, 3, 4])).toBe(3)
    expect(p75([10])).toBe(10)
    expect(p75([])).toBeNull()
    expect(p75(Array.from({ length: 100 }, (_, i) => i + 1))).toBe(75)
  })
})

describe('summarize', () => {
  it('aggregates per metric and per route', () => {
    const sample = (
      name: VitalSample['name'],
      value: number,
      path = '/'
    ): VitalSample => ({
      name,
      value,
      rating: value < 2500 ? 'good' : 'poor',
      path,
      navigationType: 'navigate',
      day: '2026-10-07',
    })
    const summary = summarize(
      [
        sample('LCP', 1000),
        sample('LCP', 2000),
        sample('LCP', 3000, '/resume'),
        sample('CLS', 0.01),
      ],
      28,
      now
    )
    expect(summary.samples).toBe(4)
    expect(summary.metrics.LCP).toEqual({ p75: 3000, count: 3, good: 2 })
    expect(summary.metrics.INP).toEqual({ p75: null, count: 0, good: 0 })
    expect(summary.routes['/resume']).toEqual({
      LCP: { p75: 3000, count: 1, good: 0 },
    })
  })

  it('computes the window start', () => {
    expect(windowStart(28, now)).toBe('2026-09-10')
  })
})
