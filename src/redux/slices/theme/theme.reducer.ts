import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  flair: number;
  color: string;
  mode: string;
}

const initialState: ThemeState = {
  flair: 0,
  color: '#256ee0',
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setFlair(state, action: PayloadAction<number>) {
      state.flair = action.payload;
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
    setMode(state, action: PayloadAction<string>) {
      state.mode = action.payload;
    },
  },
});

export const { setFlair, setColor, setMode } = themeSlice.actions;
export default themeSlice.reducer;