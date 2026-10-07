import { type Mode } from './accent.ts'
import { contrast, oklchToHex } from './oklch.ts'
import { BRAND_ACCENT } from './reference.ts'
import { contrastPairs, semanticColors } from './semantic.ts'

/**
 * The accent inputs the contrast suite sweeps: the brand color plus 36 hues ×
 * 3 chromas × 3 lightnesses. Shared by the test suite and the /system page, so
 * the published matrix is the tested one.
 */
export const SWEEP_HUES = Array.from({ length: 36 }, (_, i) => i * 10)
export const SWEEP_CHROMAS = [0.06, 0.19, 0.37]
export const SWEEP_LIGHTNESSES = [0.3, 0.56, 0.9]

export const sweepInputs = () => [
  BRAND_ACCENT,
  ...SWEEP_HUES.flatMap((h) =>
    SWEEP_CHROMAS.flatMap((c) =>
      SWEEP_LIGHTNESSES.map((l) => oklchToHex({ l, c, h }))
    )
  ),
]

export interface PairResult {
  name: string
  use: string
  min: number
  /** Ratio with the brand accent. */
  brand: Record<Mode, number>
  /** Lowest ratio across every swept accent. */
  worst: Record<Mode, number>
}

/** Contrast of every declared pair, for the brand accent and the worst sweep case. */
export const contrastMatrix = (): PairResult[] => {
  const inputs = sweepInputs()
  const modes: Mode[] = ['light', 'dark']
  const palettes = Object.fromEntries(
    modes.map((mode) => [
      mode,
      inputs.map((input) => semanticColors(mode, input)),
    ])
  ) as Record<Mode, ReturnType<typeof semanticColors>[]>
  return contrastPairs.map((pair) => {
    const ratio = (mode: Mode, index: number) =>
      contrast(
        pair.fg(palettes[mode][index]!, mode),
        pair.bg(palettes[mode][index]!, mode)
      )
    const worst = (mode: Mode) =>
      Math.min(...inputs.map((_, i) => ratio(mode, i)))
    return {
      name: pair.name,
      use: pair.use,
      min: pair.min,
      brand: { light: ratio('light', 0), dark: ratio('dark', 0) },
      worst: { light: worst('light'), dark: worst('dark') },
    }
  })
}

/** Sample visitor colors for demos: ones that need adjusting, and ones that don't. */
export const ACCENT_SAMPLES = [
  { label: 'Brand blue', color: BRAND_ACCENT },
  { label: 'Sunflower', color: '#ffd400' },
  { label: 'Aqua', color: '#3fe0d0' },
  { label: 'Hot pink', color: '#ff4fa3' },
  { label: 'Deep plum', color: '#3b0a45' },
]
