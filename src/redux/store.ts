import { configureStore } from '@reduxjs/toolkit'
import theme from './slices/theme/theme.reducer'
import wizard from './slices/wizard/wizard.reducer'

export const store = configureStore({
  reducer: {
    theme,
    wizard
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch