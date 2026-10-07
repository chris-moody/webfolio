import { type ComponentType, lazy } from 'react'

/**
 * A component whose code loads the first time it's needed (a dialog on open,
 * a drawer on toggle), plus a prefetch to call on intent (hover, focus), so
 * the click rarely waits. A failed load is retried on the next attempt.
 */
export const onDemand = <P extends object>(
  load: () => Promise<ComponentType<P>>
) => {
  let pending: Promise<ComponentType<P>> | undefined
  const prefetch = () =>
    (pending ??= load().catch((error: unknown) => {
      pending = undefined
      throw error
    }))
  const Component = lazy(() =>
    prefetch().then((component) => ({ default: component }))
  )
  return { Component, prefetch: () => void prefetch().catch(() => {}) }
}
