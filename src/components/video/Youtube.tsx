import { Box, BoxProps, styled } from '@mui/material'
import { FC } from 'react'

export const StyledWrapper = styled(Box)({
  margin: '0 auto',
  aspectRatio: '16 / 9',
  height: 'auto',
  maxHeight: '90%',
  width: '100%',
  maxWidth: '768px',
})

export interface YoutubeProps extends BoxProps {
  videoId: string
  videoTitle?: string
}

export const Youtube: FC<YoutubeProps> = ({ videoId, videoTitle="", ...props }) => {
  return (
    <StyledWrapper {...props}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={videoTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </StyledWrapper>
  )
}
