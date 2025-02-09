import { Box, BoxProps, styled } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'

export interface TextDisplayProps extends BoxProps {
  shadowColor?: string
}
const StyledWrapper = styled(Box)(({ theme }) => [
  {
    background: 'rgba(255,255,255,.75)',
    position: 'relative',
    display: 'block',
    padding: 0,
    zIndex: 2,
    borderRadius: theme.spacing(2),
    width: '100%',
    overflow: 'hidden',
  },
  theme.applyStyles('dark', {
    background: 'rgba(0,0,0,.75)',
  }),
])

const StyledText = styled(Box)(({ theme }) => ({
  fontSize: '1.5rem',
  lineHeight: 1.1,
  fontWeight: 700,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  height: '100%',
  position: 'relative',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  overflowScrolling: 'touch',

  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(2, 'auto'),
  },
  [theme.breakpoints.up('lg')]: {
    margin: theme.spacing(4, 'auto'),
  },

}))

const StyledShadow = styled(Box)<TextDisplayProps>(({ theme  }) => ([
  {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    width: '100%',
    height: '15px',
    background: `linear-gradient(transparent 0%, white 75%)`,
  },
  theme.applyStyles('dark', {
    background: `linear-gradient(transparent 0%, black 75%)`,
  }),
]))

export const TextDisplay: FC<TextDisplayProps> = ({
  children,
  shadowColor,
  ...props
}) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const { current } = textRef
    if (current) {
      setIsOverflowing(current.scrollHeight > current.clientHeight)
    }
  }, [children])

  return (
    <StyledWrapper {...props}>
      <StyledText ref={textRef} className="text">{children}</StyledText>
      {isOverflowing && <StyledShadow />}
    </StyledWrapper>
  )
}
