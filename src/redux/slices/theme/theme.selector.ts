import { RootState } from "@/redux/store";

export const selectTheme = (state: RootState) => state.theme
export const selectThemeColor = (state: RootState) => state.theme.color
export const selectThemeFlair = (state: RootState) => state.theme.flair
export const selectThemeMode = (state: RootState) => state.theme.mode