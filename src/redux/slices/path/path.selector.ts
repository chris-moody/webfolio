import { RootState } from "@/redux/store";

export const selectPath = (state: RootState) => state.path
export const selectPathSteps = (state: RootState) => state.path.steps