import { useEffect, useLayoutEffect } from 'react'

/** `useLayoutEffect` in the browser, `useEffect` where there is no DOM (prerendering). */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect
