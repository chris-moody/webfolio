import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectWizard = (state: RootState) => state.wizard
export const selectWizardStep = createSelector(selectWizard, (wizard) => wizard.step)
export const selectWizardSelection = createSelector(selectWizard, (wizard) => wizard.selection)