import type { ThemeState } from './theme.reducer'

const FLAIR_KEY = 'flair'
const COLOR_KEY = 'color'

// Storage can be missing (prerendering) or throw (private mode, blocked site
// data), so every access is guarded and falls back to the reducer defaults.
const storage = (): Storage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export const readStoredTheme = (): Partial<ThemeState> => {
  const store = storage()
  if (!store) return {}
  const stored: Partial<ThemeState> = {}
  try {
    const flair = Number.parseInt(store.getItem(FLAIR_KEY) ?? '', 10)
    if (Number.isFinite(flair)) stored.flair = flair
    const color = store.getItem(COLOR_KEY)
    if (color) stored.color = color
  } catch {
    // Unreadable storage leaves the defaults in place.
  }
  return stored
}

export const writeStoredTheme = ({ flair, color }: ThemeState) => {
  try {
    storage()?.setItem(FLAIR_KEY, String(flair))
    storage()?.setItem(COLOR_KEY, color)
  } catch {
    // Persistence is a convenience; failing to write is not an error.
  }
}
