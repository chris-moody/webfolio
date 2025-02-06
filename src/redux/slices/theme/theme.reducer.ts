import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  flair: number;
  color: string;
  mode: string;
}

const initialState: ThemeState = {
  flair: parseInt(localStorage.getItem("flair") || '1'),
  color: localStorage.getItem("color") || '#256ee0',
  mode: localStorage.getItem("mode") || 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setFlair(state, action: PayloadAction<number>) {
      state.flair = action.payload
      localStorage.setItem("flair", action.payload.toString())
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload
      localStorage.setItem("color", action.payload.toString())
    },
    setMode(state, action: PayloadAction<string>) {
      state.mode = action.payload
      localStorage.setItem("mode", action.payload.toString())
    },
  },
});

export const { setFlair, setColor, setMode } = themeSlice.actions;
export default themeSlice.reducer;