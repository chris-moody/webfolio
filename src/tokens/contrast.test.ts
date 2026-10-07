import { describe, expect, it } from 'vitest'
import { type Mode, resolveAccent } from './accent.ts'
import { contrast } from './oklch.ts'
import { sweepInputs } from './sweep.ts'
import { contrastPairs, semanticColors } from './semantic.ts'
import { themes } from './themes.ts'

/**
 * Every theme × mode × user hue × declared pair must meet its minimum. The
 * hue sweep is what makes the user-chosen accent safe: whatever color a
 * visitor picks in the tour, resolveAccent must land on a passing palette.
 */
const modes: Mode[] = ['light', 'dark']

interface Failure {
  theme: string
  mode: Mode
  input: string
  pair: string
  ratio: number
  min: number
}

const sweep = () => {
  const failures: Failure[] = []
  let checks = 0
  const inputs = sweepInputs()
  for (const theme of Object.values(themes)) {
    for (const mode of modes) {
      for (const input of inputs) {
        const colors = semanticColors(mode, input)
        for (const pair of contrastPairs) {
          const ratio = contrast(pair.fg(colors, mode), pair.bg(colors, mode))
          checks++
          if (ratio < pair.min)
            failures.push({
              theme: theme.name,
              mode,
              input,
              pair: pair.name,
              ratio,
              min: pair.min,
            })
        }
      }
    }
  }
  return { failures, checks }
}

describe('token contrast', () => {
  // 36 hues × 3 chromas × 3 lightnesses (+ the brand color): muted to as vivid
  // as sRGB allows, dark to pale.
  it('every theme × mode × accent × pair meets WCAG 2.2 AA', () => {
    const { failures, checks } = sweep()
    expect(checks).toBeGreaterThan(30_000)
    if (failures.length) {
      const table = failures
        .slice(0, 40)
        .map(
          (f) =>
            `${f.theme.padEnd(10)} ${f.mode.padEnd(5)} accent ${f.input}  ${f.pair.padEnd(30)} ${f.ratio.toFixed(2)} < ${f.min} (short by ${(f.min - f.ratio).toFixed(2)})`
        )
        .join('\n')
      throw new Error(
        `${failures.length} of ${checks} contrast checks failed:\n${table}`
      )
    }
  })

  it('keeps a passing user color as-is and reports when it adjusts', () => {
    const dark = resolveAccent('#1f5fc7', 'light')
    expect(dark.adjusted).toBe(false)
    expect(dark.accent).toBe('#1f5fc7')

    const pale = resolveAccent('#ffd400', 'light') // yellow is never legible on white
    expect(pale.adjusted).toBe(true)
    expect(pale.ratios.onCanvas).toBeGreaterThanOrEqual(4.5)
  })
})
