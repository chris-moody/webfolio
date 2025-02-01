import { useCallback } from 'react'
//import { useWindow } from './window.hook'

export function useTimeout(callback: () => void, delay = 250): () => void {

  const run = useCallback(() => {
    const i = window.setTimeout(() => callback(), delay)
    return () => clearTimeout(i)
  }, [callback, delay])

  return run
}
