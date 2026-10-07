import { font, radius } from './reference.ts'

/**
 * Themes: the tour's "flair" levels as named themes. Colors come from the
 * semantic tier (shared); a theme supplies type, shape, motion intensity, and
 * the backdrop treatment.
 */
export type ThemeName = 'minimal' | 'expressive' | 'maximal'

export interface ThemeDefinition {
  name: ThemeName
  label: string
  /** The stored flair value this theme corresponds to. */
  flair: 1 | 15 | 37
  font: { body: string; display: string }
  radius: string
  /** Multiplier for decorative motion; 0 means none. */
  motion: number
  backdrop: 'flat' | 'radial' | 'conic'
  description: string
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  minimal: {
    name: 'minimal',
    label: 'Minimal',
    flair: 1,
    font: { body: font.roboto, display: font.roboto },
    radius: radius.sm,
    motion: 0.5,
    backdrop: 'flat',
    description:
      'One piece of flair: Roboto, quiet surfaces, restrained motion.',
  },
  expressive: {
    name: 'expressive',
    label: 'Expressive',
    flair: 15,
    font: { body: font.firaSans, display: font.firaSans },
    radius: radius.md,
    motion: 1,
    backdrop: 'radial',
    description:
      'Fifteen pieces: Fira Sans, an accent-tinted radial backdrop, stacked text shadows.',
  },
  maximal: {
    name: 'maximal',
    label: 'Maximal',
    flair: 37,
    font: { body: font.chivo, display: font.rammetto },
    radius: radius.lg,
    motion: 1.5,
    backdrop: 'conic',
    description:
      'Thirty-seven pieces: Rammetto One, 3D text, a spinning conic backdrop.',
  },
}

export const themeForFlair = (flair: number): ThemeDefinition =>
  flair === 37
    ? themes.maximal
    : flair === 15
      ? themes.expressive
      : themes.minimal
