import { Box, styled } from '@mui/material'
import { FC } from 'react'
import { TypeWriter } from '../typeWriter/TypeWriter'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'

const StyledBox = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: 'none',
  '> img': {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})

export interface FlairGifProps {
  id: string
  width?: number | string
  height?: number | string
  src: string
  clipX?: string
  clipY?: string
  clipR?: string
}

export const FlairGif: FC<FlairGifProps> = ({
  id,
  src,
  clipR = '25%',
  clipX = '45%',
  clipY = '45%',
  width = 'auto',
  height = 'auto',
}) => {
  const flair = useAppSelector(selectThemeFlair)
  return (
    <StyledBox
      sx={{
        transform: `translate(${Math.random() * 80}vw, ${
          Math.random() * 80
        }vh)`,
      }}
    >
      <img
        id={id}
        src={src}
        width={width}
        height={height}
        style={{
          clipPath: `circle(${clipR} at ${clipX} ${clipY})`,
        }}
      />
      <TypeWriter mt={flair === 37 ? 6 : 12} variant="h3" duration={.5} text="Wooooo!" />
    </StyledBox>
  )
}