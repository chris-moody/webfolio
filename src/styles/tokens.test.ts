import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Phase 3 replaces this with the generated token system's contrast suite
// (every theme × mode × user hue). Until then: parse tokens.css and hold every
// declared foreground/background pair to WCAG 2.2 AA.
const css = readFileSync(path.resolve(__dirname, 'tokens.css'), 'utf8')

const block = (selector: string) => {
  const start = css.indexOf(`${selector} {`)
  const body = css.slice(start, css.indexOf('}', start))
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(
      ([, name, value]) => [name, value]
    )
  ) as Record<string, string>
}

const luminance = (hex: string) => {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ]
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, minimum ratio]
const pairs: [string, string, number][] = [
  ['fg', 'canvas', 4.5],
  ['fg', 'surface', 4.5],
  ['fg-muted', 'canvas', 4.5],
  ['fg-muted', 'surface', 4.5],
  ['accent', 'canvas', 4.5], // links and accent text
  ['accent', 'surface', 4.5],
  ['on-accent', 'accent', 4.5], // filled buttons
  ['on-accent', 'accent-strong', 4.5],
  ['focus', 'canvas', 3], // focus rings (non-text, 1.4.11)
  ['focus', 'surface', 3],
]

describe.each([
  ['light', ':root'],
  ['dark', ':root.dark'],
])('%s tokens', (_mode, selector) => {
  const tokens = block(selector)

  it.each(pairs)('%s on %s meets %s:1', (fg, bg, minimum) => {
    const [a, b] = [tokens[fg], tokens[bg]]
    expect(a, `--${fg} is defined`).toBeDefined()
    expect(b, `--${bg} is defined`).toBeDefined()
    expect(contrast(a!, b!)).toBeGreaterThanOrEqual(minimum)
  })
})
