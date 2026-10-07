import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ThemeState {
  flair: number
  color: string
}

// Defaults only. Stored preferences are applied after mount via
// `hydrateTheme`, so the server/prerender render and the first client render
// match. Color mode is owned by MUI's `useColorScheme`.
export const initialThemeState: ThemeState = {
  flair: 1,
  color: '#256ee0',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: initialThemeState,
  reducers: {
    setFlair(state, action: PayloadAction<number>) {
      state.flair = action.payload
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload
    },
    hydrateTheme(state, action: PayloadAction<Partial<ThemeState>>) {
      return { ...state, ...action.payload }
    },
  },
})

export const { setFlair, setColor, hydrateTheme } = themeSlice.actions
export default themeSlice.reducer
