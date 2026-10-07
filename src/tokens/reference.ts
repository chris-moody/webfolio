import { type Oklch, oklchToHex } from './oklch.ts'

/**
 * Tier 1, reference tokens: raw values with no meaning attached. Everything
 * else is derived from these; nothing outside src/tokens/ may use a color
 * literal (scripts/check-color-literals.mjs).
 */

const NEUTRAL_HUE = 262

/** Cool neutral ramp. Chroma rises slightly toward the middle. */
const neutralSteps = {
  0: { l: 1, c: 0, h: NEUTRAL_HUE },
  25: { l: 0.976, c: 0.003, h: NEUTRAL_HUE },
  50: { l: 0.936, c: 0.007, h: NEUTRAL_HUE },
  100: { l: 0.898, c: 0.004, h: NEUTRAL_HUE },
  150: { l: 0.884, c: 0.011, h: NEUTRAL_HUE },
  300: { l: 0.746, c: 0.019, h: NEUTRAL_HUE },
  500: { l: 0.43, c: 0.021, h: NEUTRAL_HUE },
  700: { l: 0.312, c: 0.021, h: NEUTRAL_HUE },
  800: { l: 0.221, c: 0.015, h: NEUTRAL_HUE },
  850: { l: 0.209, c: 0.013, h: NEUTRAL_HUE },
  900: { l: 0.182, c: 0.003, h: NEUTRAL_HUE },
  950: { l: 0.177, c: 0.011, h: NEUTRAL_HUE },
  1000: { l: 0, c: 0, h: NEUTRAL_HUE },
} satisfies Record<number, Oklch>

export type NeutralStep = keyof typeof neutralSteps

export const neutral = Object.fromEntries(
  Object.entries(neutralSteps).map(([step, color]) => [step, oklchToHex(color)])
) as Record<NeutralStep, string>

/** Status hues (OKLCH): fixed, not user-adjustable. */
export const status = {
  positive: {
    light: oklchToHex({ l: 0.509, c: 0.133, h: 150.5 }),
    dark: oklchToHex({ l: 0.8, c: 0.182, h: 151.7 }),
  },
  negative: {
    light: oklchToHex({ l: 0.527, c: 0.189, h: 24.7 }),
    dark: oklchToHex({ l: 0.711, c: 0.166, h: 22.2 }),
  },
}

/** Categorical colors for diagrams (e.g. the tour's socket diagram signals). */
export const data = {
  yellow: oklchToHex({ l: 0.95, c: 0.2, h: 105 }),
  orange: oklchToHex({ l: 0.75, c: 0.18, h: 55 }),
  magenta: oklchToHex({ l: 0.7, c: 0.3, h: 330 }),
  cyan: oklchToHex({ l: 0.85, c: 0.13, h: 200 }),
  pink: oklchToHex({ l: 0.63, c: 0.25, h: 5 }),
  red: oklchToHex({ l: 0.52, c: 0.21, h: 29 }),
  plum: oklchToHex({ l: 0.3, c: 0.11, h: 330 }),
}

/** The site's brand accent; also the tour's default user color. */
export const BRAND_ACCENT = oklchToHex({ l: 0.56, c: 0.188, h: 259.5 })

/** 4px base unit. */
export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
}

export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '999px',
}

export const duration = {
  instant: '0ms',
  short: '150ms',
  medium: '300ms',
  long: '600ms',
}
export const easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
}

export const font = {
  system:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  roboto: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
  firaSans: "'Fira Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  chivo: "Chivo, system-ui, -apple-system, 'Segoe UI', sans-serif",
  rammetto: "'Rammetto One', Chivo, system-ui, sans-serif",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
}
