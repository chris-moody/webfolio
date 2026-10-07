import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router'
import { ErrorBoundary } from '@/components/errorBoundary/ErrorBoundary'
import WizardController from '@/components/wizard/WizardController'
import { EMOTION_CACHE_KEY } from '@/emotion'
import { useIsomorphicLayoutEffect } from '@/hooks/isomorphicLayoutEffect.hook'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { hydrateTheme } from '@/redux/slices/theme/theme.reducer'
import { readStoredTheme } from '@/redux/slices/theme/theme.persistence'
import {
  selectThemeColor,
  selectThemeFlair,
} from '@/redux/slices/theme/theme.selector'
import { store } from '@/redux/store'
import { createTourTheme } from '@/theme'
import { prefetchTourMediaOnIntent } from '@/data/tour.lazy'
import { accentDeclarations, themeForFlair } from '@/tokens'
import { useEffect, useMemo } from 'react'
import '@/styles/tour.css'

// In the browser, a cache with the same key as the build-time renderer adopts
// the prerendered <style data-emotion> tags. On the server, entry.server.tsx
// provides the cache it extracts from, so none is added here.
const clientCache =
  typeof document === 'undefined'
    ? null
    : createCache({ key: EMOTION_CACHE_KEY })

export default function TourLayout() {
  const tour = (
    <Provider store={store}>
      <TourTheme />
    </Provider>
  )
  return clientCache ? (
    <CacheProvider value={clientCache}>{tour}</CacheProvider>
  ) : (
    tour
  )
}

function TourTheme() {
  const dispatch = useAppDispatch()
  // Apply stored flair and color before the first paint on the client.
  useIsomorphicLayoutEffect(() => {
    dispatch(hydrateTheme(readStoredTheme()))
  }, [dispatch])

  const color = useAppSelector(selectThemeColor)
  const flair = useAppSelector(selectThemeFlair)
  const theme = useMemo(() => createTourTheme({ flair, color }), [flair, color])
  useTourTokens(flair, color)
  useEffect(() => prefetchTourMediaOnIntent(), [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <ErrorBoundary>
        <div style={{ maxWidth: 1920, margin: '0 auto', textAlign: 'center' }}>
          <WizardController>
            <Outlet />
          </WizardController>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

/**
 * Mirrors the tour's theme and the visitor's accent into the CSS variables
 * Tailwind reads, so token utilities inside the tour match MUI. Removed on
 * leaving the tour, so the rest of the site keeps the brand accent.
 */
function useTourTokens(flair: number, color: string) {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = themeForFlair(flair).name
    const style = document.createElement('style')
    style.id = 'tour-accent'
    style.textContent = [
      `:root {\n${accentDeclarations('light', color).join('\n')}\n}`,
      `:root.dark {\n${accentDeclarations('dark', color).join('\n')}\n}`,
    ].join('\n')
    document.head.append(style)
    return () => {
      style.remove()
      delete root.dataset.theme
    }
  }, [flair, color])
}
