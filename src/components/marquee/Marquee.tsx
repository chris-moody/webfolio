import { useGSAP } from '@gsap/react'
import { Box, BoxProps, styled } from '@mui/material'
import { type PointerEvent, useEffect, useRef } from 'react'
import {
  horizontalLoop,
  type HorizontalLoopTimeline,
} from '@/utils/gsap.helpers'

export interface MarqueeProps extends BoxProps {
  speed?: number
  reversed?: boolean
  overflow?:
    'hidden' | 'visible' | 'scroll' | 'auto' | 'inherit' | 'initial' | 'unset'
  /** Hold the row still under the pointer, so its items can be inspected. */
  pauseOnHover?: boolean
}

const TOUCH_HOLD_MS = 2000

const StyledMarquee = styled(Box)<MarqueeProps>`
  display: flex;
  position: relative;
  .item {
    display: flex;
  }
`

export const Marquee: React.FC<MarqueeProps> = ({
  speed = 1,
  reversed = false,
  children,
  overflow = 'hidden',
  pauseOnHover = false,
  ...props
}) => {
  const container = useRef<HTMLDivElement>(null)
  const loop = useRef<HorizontalLoopTimeline>(null)

  useGSAP(
    () => {
      if (!container.current) return

      // Items need their final width now: the loop measures them once.
      const tl = (loop.current = horizontalLoop('.item', {
        speed,
        reversed,
        repeat: -1,
      }))
      return () => tl.kill()
    },
    { dependencies: [speed], scope: container }
  )

  // A mouse holds the row while it's over it. Touch has no hover: a tap holds
  // it for as long as a touch tooltip stays up (MUI's default, 1.5 s).
  const resume = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hold = (event: PointerEvent) => {
    clearTimeout(resume.current)
    loop.current?.pause()
    if (event.pointerType !== 'mouse')
      resume.current = setTimeout(() => loop.current?.resume(), TOUCH_HOLD_MS)
  }
  const release = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') loop.current?.resume()
  }
  useEffect(() => () => clearTimeout(resume.current), [])

  return (
    <StyledMarquee
      ref={container}
      {...props}
      sx={{ overflow }}
      onPointerEnter={pauseOnHover ? hold : undefined}
      onPointerLeave={pauseOnHover ? release : undefined}
      onPointerDown={pauseOnHover ? hold : undefined}
    >
      {children}
      {children}
    </StyledMarquee>
  )
}
