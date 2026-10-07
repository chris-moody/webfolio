import { useResize } from '@/hooks/resize.hook'
import { Box, BoxProps, styled } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'

export interface TextDisplayProps extends BoxProps {
  shadowColor?: string
}
const StyledWrapper = styled(Box)(({ theme }) => [
  {
    background: 'var(--surface-overlay)',
    position: 'relative',
    display: 'block',
    padding: 0,
    zIndex: 2,
    borderRadius: theme.spacing(2),
    width: '100%',
    overflow: 'hidden',
    // Short landscape screens scroll the page, so the text flows instead.
    '@media (max-height: 520px)': {
      maxHeight: 'none !important',
      flexShrink: 0,
      '.text': { height: 'auto', overflow: 'visible' },
    },
  },
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

const StyledShadow = styled(Box)<TextDisplayProps>(() => [
  {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    width: '100%',
    height: '15px',
    // Fades overflowing text into the panel.
    background: `linear-gradient(transparent 0%, var(--surface) 75%)`,
  },
])

export const TextDisplay: FC<TextDisplayProps> = ({
  children,
  shadowColor: _shadowColor,
  ...props
}) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [monitor, size] = useResize()
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const { current } = textRef
    if (current) {
      setIsOverflowing(current.scrollHeight > current.clientHeight)
    }
  }, [size])

  return (
    <StyledWrapper {...props}>
      {/* When the text overflows, its scroll container takes focus so
          keyboard users can scroll it (WCAG 2.1.1). */}
      <StyledText
        ref={textRef}
        className="text"
        {...(isOverflowing && {
          tabIndex: 0,
          role: 'region',
          'aria-label': 'Slide text',
        })}
      >
        {children}
      </StyledText>
      {isOverflowing && <StyledShadow />}
      {monitor}
    </StyledWrapper>
  )
}
