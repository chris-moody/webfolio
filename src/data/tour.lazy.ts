import { type ComponentType, createElement, lazy, Suspense } from 'react'

// Heavy tour media, split out of the tour's entry chunk. In the browser each
// loads when its slide renders (or on first interaction, see below).

type Loader<P> = () => Promise<ComponentType<P>>

const loaded = new Map<Loader<never>, ComponentType<never>>()

/**
 * React.lazy that resolves synchronously once its module is loaded. Plain lazy
 * always suspends on first use; on the server that streamed the slide's media
 * as a placeholder plus an inline <script> to fill it in, so the content was
 * missing without JavaScript (and would break under a strict CSP).
 * preloadTourMedia() loads the modules before the server renders.
 */
const preloadableLazy = <P>(load: Loader<P>) => {
  const Component = lazy(() => {
    const ready = loaded.get(load as Loader<never>) as
      ComponentType<P> | undefined
    if (ready) {
      // A synchronous thenable: React reads it as already resolved.
      const thenable = {
        then: (resolve: (value: { default: ComponentType<P> }) => void) =>
          resolve({ default: ready }),
      }
      return thenable as unknown as Promise<{ default: ComponentType<P> }>
    }
    return load().then((component) => {
      loaded.set(load as Loader<never>, component as ComponentType<never>)
      return { default: component }
    })
  })
  // Each lazy component gets its own boundary, as tight as possible. When a
  // chunk isn't loaded yet, React postpones hydrating the whole boundary, and
  // by then state outside it may have changed: a wider boundary (it once held
  // the flair buttons) hydrated against new props and mismatched.
  const Suspended = (props: P & object) =>
    createElement(
      Suspense,
      { fallback: null },
      createElement(Component as ComponentType<P & object>, props)
    )
  return { Component: Suspended, load: load as Loader<never> }
}

const waterText = preloadableLazy(() =>
  import('@/containers/waterText/WaterText').then((m) => m.WaterText)
) // PixiJS
const socketFlow = preloadableLazy(() =>
  import('@/components/socketFlow/SocketFlow').then((m) => m.SocketFlow)
) // React Flow
const techMarquees = preloadableLazy(() =>
  import('@/containers/techMarquees/TechMarquees').then((m) => m.TechMarquees)
) // ~40 icons
const flairText = preloadableLazy(() =>
  import('@/components/flairText/FlairText').then((m) => m.FlairText)
) // video flair
const circlePacking = preloadableLazy(() =>
  import('@/components/wizard/components/wizardStep/components/flairSelectionRenderer/components/CirclePacking').then(
    (m) => m.CirclePacking
  )
) // d3-force

export const WaterText = waterText.Component
export const SocketFlow = socketFlow.Component
export const TechMarquees = techMarquees.Component
export const FlairText = flairText.Component
export const CirclePacking = circlePacking.Component

const all = [waterText, socketFlow, techMarquees, flairText, circlePacking]

/** Loads every split module. The server awaits this before rendering. */
export const preloadTourMedia = () =>
  Promise.all(
    all.map(({ load }) =>
      load().then((component) => void loaded.set(load, component))
    )
  ).then(() => undefined)

/**
 * Loads every split chunk on the visitor's first interaction with the tour, so
 * later slide changes don't wait. Not on idle: import() also executes the
 * modules (Pixi initializes on load), which cost 300–500 ms of blocking time
 * during page load when it ran on requestIdleCallback.
 */
export const prefetchTourMediaOnIntent = () => {
  const events = ['pointerdown', 'keydown', 'touchstart'] as const
  const run = () => {
    for (const event of events) window.removeEventListener(event, run, true)
    void preloadTourMedia()
  }
  for (const event of events)
    window.addEventListener(event, run, {
      capture: true,
      passive: true,
      once: true,
    })
  return () => {
    for (const event of events) window.removeEventListener(event, run, true)
  }
}
