import { describe, expect, it } from 'vitest'
import themeReducer, {
  hydrateTheme,
  initialThemeState,
  setColor,
  setFlair,
} from './theme.reducer'
import { readStoredTheme, writeStoredTheme } from './theme.persistence'

describe('theme reducer', () => {
  it('starts from defaults without touching storage', () => {
    window.localStorage.setItem('flair', '37')
    expect(themeReducer(undefined, { type: '@@init' })).toEqual(
      initialThemeState
    )
  })

  it('updates flair and color', () => {
    const state = themeReducer(initialThemeState, setFlair(15))
    expect(themeReducer(state, setColor('#ff0000'))).toEqual({
      flair: 15,
      color: '#ff0000',
    })
  })

  it('hydrates only the stored fields', () => {
    expect(
      themeReducer(initialThemeState, hydrateTheme({ flair: 37 }))
    ).toEqual({
      ...initialThemeState,
      flair: 37,
    })
  })
})

describe('theme persistence', () => {
  it('round-trips flair and color', () => {
    writeStoredTheme({ flair: 15, color: '#123456' })
    expect(readStoredTheme()).toEqual({ flair: 15, color: '#123456' })
  })

  it('ignores missing or malformed values', () => {
    window.localStorage.setItem('flair', 'lots')
    expect(readStoredTheme()).toEqual({})
  })
})
