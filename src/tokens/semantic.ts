import { type Mode, resolveAccent } from './accent.ts'
import { composite, withAlpha } from './oklch.ts'
import { BRAND_ACCENT, neutral, status } from './reference.ts'

/**
 * Tier 2, semantic tokens: what a color is for. Each mode maps meanings onto
 * reference values; the accent comes from resolveAccent, so any user color
 * yields a passing palette.
 */
export interface SemanticColors {
  canvas: string
  surface: string
  /** Translucent panel over decorative backdrops (tour). */
  surfaceOverlay: string
  /** The tour's backdrop behind panels. */
  backdrop: string
  fg: string
  fgMuted: string
  border: string
  accent: string
  accentStrong: string
  onAccent: string
  accentSubtle: string
  focus: string
  positive: string
  negative: string
  /** Shadows and depth effects (3D text, buttons). */
  shadow: string
  /** Highlights and strokes on depth effects. */
  highlight: string
}

/** Opacity of surfaceOverlay; contrast pairs composite with it. */
export const OVERLAY_ALPHA: Record<Mode, number> = { light: 0.8, dark: 0.72 }

export const semanticColors = (
  mode: Mode,
  accentInput: string = BRAND_ACCENT
): SemanticColors => {
  const accent = resolveAccent(accentInput, mode)
  const light = mode === 'light'
  return {
    canvas: light ? neutral[25] : neutral[950],
    surface: light ? neutral[0] : neutral[800],
    surfaceOverlay: withAlpha(
      light ? neutral[0] : neutral[1000],
      OVERLAY_ALPHA[mode]
    ),
    backdrop: light ? neutral[100] : neutral[900],
    fg: light ? neutral[850] : neutral[50],
    fgMuted: light ? neutral[500] : neutral[300],
    border: light ? neutral[150] : neutral[700],
    accent: accent.accent,
    accentStrong: accent.accentStrong,
    onAccent: accent.onAccent,
    accentSubtle: accent.accentSubtle,
    focus: accent.accent,
    positive: status.positive[mode],
    negative: status.negative[mode],
    shadow: withAlpha(neutral[1000], light ? 0.25 : 0.5),
    highlight: withAlpha(neutral[0], light ? 0.75 : 0.25),
  }
}

/**
 * Every foreground/background pairing the UI uses, with its WCAG minimum.
 * The contrast suite and the /system matrix both read this list.
 * Backgrounds may be composites: overlay panels over the darkest backdrop the
 * tour can draw (its accent-colored flair stripes).
 */
export interface ContrastPair {
  name: string
  fg: (colors: SemanticColors, mode: Mode) => string
  bg: (colors: SemanticColors, mode: Mode) => string
  min: number
  /** What the pairing is used for. */
  use: string
}

const overlayOn = (backdrop: string, mode: Mode) =>
  composite(
    mode === 'light' ? neutral[0] : neutral[1000],
    OVERLAY_ALPHA[mode],
    backdrop
  )

export const contrastPairs: ContrastPair[] = [
  {
    name: 'fg / canvas',
    fg: (c) => c.fg,
    bg: (c) => c.canvas,
    min: 4.5,
    use: 'Body text',
  },
  {
    name: 'fg / surface',
    fg: (c) => c.fg,
    bg: (c) => c.surface,
    min: 4.5,
    use: 'Text on cards',
  },
  {
    name: 'fgMuted / canvas',
    fg: (c) => c.fgMuted,
    bg: (c) => c.canvas,
    min: 4.5,
    use: 'Secondary text',
  },
  {
    name: 'fgMuted / surface',
    fg: (c) => c.fgMuted,
    bg: (c) => c.surface,
    min: 4.5,
    use: 'Secondary text on cards',
  },
  {
    name: 'accent / canvas',
    fg: (c) => c.accent,
    bg: (c) => c.canvas,
    min: 4.5,
    use: 'Links',
  },
  {
    name: 'accent / surface',
    fg: (c) => c.accent,
    bg: (c) => c.surface,
    min: 4.5,
    use: 'Links on cards',
  },
  {
    name: 'onAccent / accent',
    fg: (c) => c.onAccent,
    bg: (c) => c.accent,
    min: 4.5,
    use: 'Button labels',
  },
  {
    name: 'onAccent / accentStrong',
    fg: (c) => c.onAccent,
    bg: (c) => c.accentStrong,
    min: 4.5,
    use: 'Pressed buttons',
  },
  {
    name: 'fg / accentSubtle',
    fg: (c) => c.fg,
    bg: (c) => c.accentSubtle,
    min: 4.5,
    use: 'Text on tinted rows',
  },
  {
    name: 'positive / surface',
    fg: (c) => c.positive,
    bg: (c) => c.surface,
    min: 4.5,
    use: 'Price up',
  },
  {
    name: 'negative / surface',
    fg: (c) => c.negative,
    bg: (c) => c.surface,
    min: 4.5,
    use: 'Price down',
  },
  {
    name: 'focus / canvas',
    fg: (c) => c.focus,
    bg: (c) => c.canvas,
    min: 3,
    use: 'Focus ring (1.4.11)',
  },
  {
    name: 'border / canvas',
    fg: (c) => c.border,
    bg: (c) => c.canvas,
    min: 1.2,
    use: 'Decorative borders (not 1.4.11)',
  },
  {
    name: 'fg / overlay on backdrop',
    fg: (c) => c.fg,
    bg: (c, mode) => overlayOn(c.backdrop, mode),
    min: 4.5,
    use: 'Tour panel text',
  },
  {
    name: 'fg / overlay on accent',
    fg: (c) => c.fg,
    bg: (c, mode) => overlayOn(c.accent, mode),
    min: 4.5,
    use: 'Tour panel text over flair stripes',
  },
  {
    name: 'fgMuted / overlay on accent',
    fg: (c) => c.fgMuted,
    bg: (c, mode) => overlayOn(c.accent, mode),
    min: 4.5,
    use: 'Tour secondary text over flair stripes',
  },
]
