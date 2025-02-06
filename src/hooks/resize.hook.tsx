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
  React.RefObject<HTMLDivElement | null>
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
  const observer = useRef<ResizeObserver>(new ResizeObserver(onResize))

  useEffect(() => {
    if (!ref.current || !observer.current) return
    observer.current.observe(ref.current)

    const obs = observer.current
    return () => {
      obs.disconnect()
    }
  }, [])

  return [
    <StyledObserver ref={ref} key={0} />,
    size,
    onResize,
    setSize,
    ref,
  ]
}
