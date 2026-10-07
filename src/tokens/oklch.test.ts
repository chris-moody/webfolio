import { describe, expect, it } from 'vitest'
import {
  composite,
  contrast,
  hexToOklch,
  oklchToHex,
  toGamut,
} from './oklch.ts'

describe('OKLCH conversion', () => {
  it('matches reference values', () => {
    // CSS Color 4 reference: oklch(62.8% 0.2577 29.23) is sRGB red.
    expect(oklchToHex({ l: 0.628, c: 0.2577, h: 29.23 })).toBe('#ff0000')
    expect(oklchToHex({ l: 1, c: 0, h: 0 })).toBe('#ffffff')
    expect(oklchToHex({ l: 0, c: 0, h: 0 })).toBe('#000000')
  })

  it('round-trips sRGB colors', () => {
    for (const hex of [
      '#1f5fc7',
      '#0f7a3a',
      '#c0262d',
      '#f6f7f9',
      '#123456',
      '#abcdef',
    ]) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex)
    }
  })

  it('maps out-of-gamut colors by reducing chroma only', () => {
    const wild = { l: 0.7, c: 0.4, h: 140 }
    const mapped = toGamut(wild)
    expect(mapped.l).toBe(wild.l)
    expect(mapped.h).toBe(wild.h)
    expect(mapped.c).toBeLessThan(wild.c)
  })
})

describe('contrast', () => {
  it('matches WCAG reference values', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2)
  })

  it('composites translucent layers', () => {
    expect(composite('#ffffff', 0.5, '#000000')).toBe('#808080')
  })
})
