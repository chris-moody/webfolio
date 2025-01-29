import { useGSAP } from '@gsap/react'
import { Box, BoxProps, styled } from '@mui/material'
import { useRef } from 'react'
import { horizontalLoop } from '@/utils/gsap.helpers'

export interface MarqueeProps extends BoxProps {
  speed?: number,
  reversed?: boolean,
}

const StyledMarquee = styled(Box)<MarqueeProps>`
  display: flex;
  position: relative;
  overflow: ${(props) => props.overflow || 'hidden'};
  .item {
    display: flex;
  }
`

export const Marquee: React.FC<MarqueeProps> = ({
  speed = 1,
  reversed = false,
  children,
  ...props
}) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!container.current) return

      horizontalLoop('.item', { speed, reversed, repeat: -1 })
    },
    { dependencies: [speed], scope: container }
  )

  return (
    <StyledMarquee ref={container} {...props}>
      {children}
      {children}
    </StyledMarquee>
  )
}
