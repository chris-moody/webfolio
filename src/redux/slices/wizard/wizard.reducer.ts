import { WizardStepConfig } from '@/components/wizard/components/wizardStep/WizardStep'
import { WizardResult } from '@/components/wizard/wizard.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WizardState {
  step: WizardStepConfig
  selection: WizardResult
}

const initialState: WizardState = {
  step: {} as WizardStepConfig,
  selection: {} as WizardResult,
}

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<WizardStepConfig>) => {
      state.step = action.payload
      if (action.payload.selections) {
        if (action.payload.selections.length > 0) {
          const { id = '', next = '' } =
            action.payload.selections[0] || ({} as WizardResult)
          state.selection = { id, next, value: id }
        }
      }
    },
    setSelection: (state, action: PayloadAction<WizardResult>) => {
      state.selection = action.payload
    },
    clearSelection: (state) => {
      state.selection = {} as WizardResult
    },
  },
})

export const { clearSelection, setStep, setSelection } = wizardSlice.actions

export default wizardSlice.reducer
