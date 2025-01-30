import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectTheme = (state: RootState) => state.theme
export const selectThemeColor = createSelector(selectTheme, theme => theme.color)
export const selectThemeFlair = createSelector(selectTheme, theme => theme.flair)
export const selectThemeMode = createSelector(selectTheme, theme => theme.mode)