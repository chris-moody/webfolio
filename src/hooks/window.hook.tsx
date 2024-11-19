import { useEffect, useRef, useState } from 'react'
//import { useDebounce } from './debounce.hook'

export const useWindow: () => Window | undefined = () => {
  const [win, setWin] = useState<Window>()

  useEffect(() => {
    setWin(window)
  }, [])

  return win
}

export type Size = {
  width?: number
  height?: number
}

export function useResize() {
  const ref = useRef<HTMLDivElement>(null)
  //const [debouncedSize, setSize, size] = useDebounce<Size>({ width: undefined, height: undefined })
  const [size, setSize] = useState<Size>({ width: undefined, height: undefined })
  const win = useWindow()

  useEffect(() => {
    if (!win) return
    const onResize = () => {
      if (!ref.current) return
      setSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      })
    }

    win.addEventListener('resize', onResize)
    win.addEventListener('focus', onResize)
    setTimeout(onResize, 100)

    return () => {
      win.removeEventListener('resize', onResize)
      win.removeEventListener('focus', onResize)
    }
  }, [win, ref])

  return {
    resizer: (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
    ),
    size,
    //debouncedSize,
    setSize,
    ref,
  }
}
