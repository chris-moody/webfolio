import { Box, styled } from '@mui/material'
import { FC, useState } from 'react'
import { TypeWriter } from '../typeWriter/TypeWriter'

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
  const [position] = useState(() => ({
    x: Math.random() * 80,
    y: Math.random() * 80,
  }))
  return (
    <StyledBox
      sx={{
        transform: `translate(min(${position.x}vw, max(0px, calc(100vw - ${width}))),
        min(${position.y}vh, max(0px, calc(100vh - ${height}))))`,
      }}
    >
      <TypeWriter
        bgcolor="primary.main"
        borderRadius={2}
        p={1}
        mt={'100px'}
        variant="h3"
        duration={0.5}
        text="Wooooo!!!"
      />
      <img
        id={id}
        src={src}
        alt=""
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
