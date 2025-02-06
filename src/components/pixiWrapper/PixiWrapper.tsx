import { Size, useResize } from '@/hooks/resize.hook'
import { Box } from '@mui/material'
import {
  Application,
  ApplicationOptions
} from 'pixi.js'
import { ReactNode, useEffect, useRef } from 'react'

export type PixiWrapperProps = Partial<ApplicationOptions> & {
  children?: ReactNode
  preload?: () => Promise<void>
  onResize?: (app: Application, size?: Size) => void
  onReady?: (app: Application) => void
}
export const PixiWrapper = ({
  children,
  preload,
  onResize,
  onReady,
  ...rest
}: PixiWrapperProps) => {
  const container = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const [resizer, size] = useResize()

  useEffect(() => {
    if (!appRef.current) return

    if (onResize) onResize(appRef.current)
  }, [size, onResize])

  useEffect(() => {
    if (appRef.current) return

    const init = async () => {
      const app = new Application()
      appRef.current = app

      await app.init({
        backgroundAlpha: 0,
        ...(container.current && { resizeTo: container.current }),
        ...rest,
      })

      container.current?.appendChild(app.canvas)
      if (preload) await preload()
      if (onReady) onReady(app)
    }

    init()
  }, [onReady, rest, preload])

  return (
    <Box
      ref={container}
      sx={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {resizer}
      {children}
    </Box>
  )
}
