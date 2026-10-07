import { type DependencyList, type RefObject, useLayoutEffect } from 'react'
import type { gsap as Gsap } from 'gsap'

type GSAP = typeof Gsap

// GSAP (~25 kB gzipped) loads on its own, off the tour's first-paint path:
// every animation it drives starts after hydration anyway.
let instance: GSAP | undefined
let pending: Promise<GSAP> | undefined

export const loadGsap = () =>
  (pending ??= import('gsap').then(({ gsap }) => (instance = gsap)))

/** Runs now if GSAP is loaded, otherwise once it is. */
export const withGsap = (run: (gsap: GSAP) => void) => {
  if (instance) run(instance)
  else void loadGsap().then(run)
}

/**
 * useGSAP for a lazily loaded GSAP. The effect runs in a gsap.context scoped
 * to `scope`, and everything it creates is reverted when the dependencies
 * change or the component unmounts (useGSAP's revertOnUpdate).
 */
export const useGsapEffect = (
  effect: (gsap: GSAP) => void,
  deps: DependencyList,
  scope?: RefObject<Element | null | undefined>
) => {
  useLayoutEffect(() => {
    let live = true
    let context: gsap.Context | undefined
    withGsap((gsap) => {
      if (live)
        context = gsap.context(() => effect(gsap), scope?.current ?? undefined)
    })
    return () => {
      live = false
      context?.revert()
    }
    // Call sites are checked instead (additionalHooks in eslint.config.js).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
