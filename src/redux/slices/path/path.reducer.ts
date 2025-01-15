import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Step {
  id: string;
  value: number | string;
}

interface PathState {
  steps: Step[];
}

const initialState: PathState = {
  steps: [],
};

const pathSlice = createSlice({
  name: 'path',
  initialState,
  reducers: {
    addStep: (state, action: PayloadAction<Step>) => {
      state.steps.push(action.payload);
    },
    removeStep: (state, action: PayloadAction<string>) => {
      state.steps = state.steps.filter(step => step.id !== action.payload);
    },
    setSteps: (state, action: PayloadAction<Step[]>) => {
      state.steps = action.payload;
    },
  },
});

export const { addStep, removeStep, setSteps } = pathSlice.actions;

export default pathSlice.reducer;