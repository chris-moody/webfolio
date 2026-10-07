import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { StyledObserver } from './resize.hook.helpers'

export interface Size {
  width: number
  height: number
}

export type ResizeConfig = [
  ReactNode,
  Size,
  () => void,
  React.Dispatch<React.SetStateAction<Size>>,
  React.RefObject<HTMLDivElement | null>,
]

export const useResize: () => ResizeConfig = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>({ width: -1, height: -1 })

  const onResize = useCallback(() => {
    if (!ref.current) return
    setSize({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    })
  }, [])

  // The observer is created in the effect so this hook is safe to render
  // where ResizeObserver doesn't exist (prerendering).
  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(onResize)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onResize])

  return [<StyledObserver ref={ref} key={0} />, size, onResize, setSize, ref]
}
