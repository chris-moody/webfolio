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
        transform: `translate(min(${Math.random() * 80}vw, max(0px, calc(100vw - ${width}))),
        min(${Math.random() * 80}vh, max(0px, calc(100vh - ${width}))))`,
      }}
    >
      <TypeWriter
        bgcolor="primary.main"
        borderRadius={2}
        p={1}
        mt={flair === 37 ? 6 : 12}
        variant="h3"
        duration={0.5}
        text="Wooooo!!!"
      />
      <img
        id={id}
        src={src}
        width={width}
        height={height}
        style={{
          clipPath: `circle(${clipR} at ${clipX} ${clipY})`,
          zIndex: 2,
        }}
      />
    </StyledBox>
  )
}
