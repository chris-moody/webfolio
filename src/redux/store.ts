import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit'
import theme, { setColor, setFlair } from './slices/theme/theme.reducer'
import { writeStoredTheme } from './slices/theme/theme.persistence'
import wizard from './slices/wizard/wizard.reducer'

const persistence = createListenerMiddleware()

const reducer = {
  theme,
  wizard,
}

export const store = configureStore({
  reducer,
  middleware: (getDefault) => getDefault().prepend(persistence.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

persistence.startListening({
  matcher: isAnyOf(setFlair, setColor),
  effect: (_action, api) => {
    writeStoredTheme((api.getState() as RootState).theme)
  },
})
