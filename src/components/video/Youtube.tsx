import { Box, BoxProps, styled } from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { FC, useState } from 'react'

const StyledWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: '0 auto',
  aspectRatio: '16 / 9',
  height: 'auto',
  maxHeight: '90%',
  width: '100%',
  maxWidth: '768px',
  '.facade': {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    padding: 0,
    border: 0,
    cursor: 'pointer',
    background: theme.palette.common.black,
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    '.play': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 72,
      height: 50,
      borderRadius: 12,
      display: 'grid',
      placeItems: 'center',
      color: theme.palette.common.white,
      background: 'rgba(0, 0, 0, 0.75)',
      transition: theme.transitions.create('background'),
    },
    '&:hover .play, &:focus-visible .play': { background: '#c00' },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
}))

export interface YoutubeProps extends BoxProps {
  videoId: string
  videoTitle?: string
}

/**
 * Click-to-load YouTube embed. The player (~1 MB of third-party script) only
 * loads after the visitor asks for it, and the facade is a real button with an
 * accessible name.
 */
export const Youtube: FC<YoutubeProps> = ({
  videoId,
  videoTitle = 'YouTube video',
  ...props
}) => {
  const [active, setActive] = useState(false)
  return (
    <StyledWrapper {...props}>
      {active ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="facade"
          onClick={() => setActive(true)}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            width={480}
            height={360}
          />
          <span className="play">
            <PlayArrowRoundedIcon fontSize="large" />
          </span>
          <Box component="span" sx={visuallyHidden}>
            Play video: {videoTitle}
          </Box>
        </button>
      )}
    </StyledWrapper>
  )
}

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const
