import { contrast, hexToOklch, type Oklch, oklchToHex } from './oklch.ts'
import { neutral } from './reference.ts'

export type Mode = 'light' | 'dark'

/** The surfaces an accent must work on, per mode. */
export const accentBackgrounds: Record<
  Mode,
  { canvas: string; surface: string; onAccent: string }
> = {
  light: { canvas: neutral[25], surface: neutral[0], onAccent: neutral[0] },
  dark: { canvas: neutral[950], surface: neutral[800], onAccent: neutral[950] },
}

/** Text-level contrast (WCAG 1.4.3): the accent is used for links and button labels sit on it. */
export const ACCENT_MIN_CONTRAST = 4.5

export interface ResolvedAccent {
  /** Links, accent text, and solid fills. */
  accent: string
  /** Hover/pressed state of a solid fill. */
  accentStrong: string
  /** Text and icons on an accent fill. */
  onAccent: string
  /** Quiet tinted backgrounds (selected rows, badges). */
  accentSubtle: string
  /** True when the input color's lightness had to change to pass. */
  adjusted: boolean
  /** The input color, for display. */
  input: string
  ratios: { onCanvas: number; onSurface: number; withOnAccent: number }
}

const passes = (candidate: string, mode: Mode) => {
  const { canvas, surface, onAccent } = accentBackgrounds[mode]
  return (
    contrast(candidate, canvas) >= ACCENT_MIN_CONTRAST &&
    contrast(candidate, surface) >= ACCENT_MIN_CONTRAST &&
    contrast(candidate, onAccent) >= ACCENT_MIN_CONTRAST
  )
}

/**
 * Finds the lightness closest to `start` (moving toward `direction`) at which
 * the color passes in this mode. Hue and chroma are kept; chroma is reduced
 * only if the new lightness is out of gamut.
 */
const searchLightness = (color: Oklch, mode: Mode): Oklch => {
  // Light mode searches toward darker, dark mode toward lighter.
  const at = (l: number) => oklchToHex({ ...color, l })
  if (passes(at(color.l), mode)) return color
  let failing = color.l
  let passing = mode === 'light' ? 0.05 : 0.98
  if (!passes(at(passing), mode)) return { ...color, l: passing } // unreachable for sane inputs
  for (let i = 0; i < 30; i++) {
    const mid = (failing + passing) / 2
    if (passes(at(mid), mode)) passing = mid
    else failing = mid
  }
  return { ...color, l: passing }
}

/**
 * Turns any user-chosen color into an accent that passes WCAG AA in the given
 * mode: as text on canvas and surface, and under its on-accent text.
 *
 * Light mode keeps the user's lightness when it already passes. Dark mode
 * starts from the same hue and chroma at a light lightness, since a color
 * picked against white is rarely legible on near-black.
 */
export const resolveAccent = (input: string, mode: Mode): ResolvedAccent => {
  const original = hexToOklch(input)
  const start: Oklch =
    mode === 'light' ? original : { ...original, l: Math.max(original.l, 0.72) }
  const fitted = searchLightness(start, mode)
  const accent = oklchToHex(fitted)
  const strong = oklchToHex({
    ...fitted,
    l: mode === 'light' ? fitted.l - 0.07 : fitted.l + 0.07,
  })
  const accentStrong = passes(strong, mode) ? strong : accent
  const subtle = oklchToHex({
    l: mode === 'light' ? 0.94 : 0.28,
    c: Math.min(fitted.c, 0.04),
    h: fitted.h,
  })
  const { canvas, surface, onAccent } = accentBackgrounds[mode]
  return {
    accent,
    accentStrong,
    onAccent,
    accentSubtle: subtle,
    adjusted:
      mode === 'light'
        ? Math.abs(fitted.l - original.l) > 0.002
        : !passes(input, 'dark'),
    input,
    ratios: {
      onCanvas: contrast(accent, canvas),
      onSurface: contrast(accent, surface),
      withOnAccent: contrast(accent, onAccent),
    },
  }
}
