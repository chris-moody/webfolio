import { useGSAP } from '@gsap/react'
import { Box, BoxProps, styled } from '@mui/material'
import { useRef } from 'react'
import { horizontalLoop } from '@/utils/gsap.helpers'

export interface MarqueeProps extends BoxProps {
  speed?: number,
  reversed?: boolean,
  overflow?: 'hidden' | 'visible' | 'scroll' | 'auto' | 'inherit' | 'initial' | 'unset'
}

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
  ...props
}) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!container.current) return

      const tl = horizontalLoop('.item', { speed, reversed, repeat: -1 })
      return () => tl.kill()
    },
    { dependencies: [speed], scope: container }
  )

  return (
    <StyledMarquee ref={container} {...props} sx={{ overflow }}>
      {children}
      {children}
    </StyledMarquee>
  )
}
