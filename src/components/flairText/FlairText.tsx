import { FC, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Box, styled, Typography } from '@mui/material'
import woo1Mp4 from '@/assets/media/woo-1.mp4'
import woo1Webm from '@/assets/media/woo-1.webm'
import woo1Poster from '@/assets/media/woo-1-poster.webp'
import woo4Mp4 from '@/assets/media/woo-4.mp4'
import woo4Webm from '@/assets/media/woo-4.webm'
import woo4Poster from '@/assets/media/woo-4-poster.webp'
import woo5Mp4 from '@/assets/media/woo-5.mp4'
import woo5Webm from '@/assets/media/woo-5.webm'
import woo5Poster from '@/assets/media/woo-5-poster.webp'
import woo6Mp4 from '@/assets/media/woo-6.mp4'
import woo6Webm from '@/assets/media/woo-6.webm'
import woo6Poster from '@/assets/media/woo-6-poster.webp'
import { FlairGif } from './FlairGif'
import { useReducedMotion } from '@/motion/motion'

const flairs = [
  {
    flair: {
      id: 'woo1',
      video: { mp4: woo1Mp4, webm: woo1Webm, poster: woo1Poster },
      clipR: '25%',
      clipX: '45%',
      clipY: '45%',
      width: '250px',
    },
    duration: 1.6,
  },
  {
    flair: {
      id: 'woo4',
      video: { mp4: woo4Mp4, webm: woo4Webm, poster: woo4Poster },
      clipR: '40%',
      clipX: '60%',
      clipY: '50%',
      width: '150px',
    },
    duration: 1,
  },
  {
    flair: {
      id: 'woo5',
      video: { mp4: woo5Mp4, webm: woo5Webm, poster: woo5Poster },
      clipR: '40%',
      clipX: '55%',
      clipY: '50%',
      width: '150px',
    },
    duration: 3.75,
  },
  {
    flair: {
      id: 'woo6',
      video: { mp4: woo6Mp4, webm: woo6Webm, poster: woo6Poster },
      clipR: '25%',
      clipX: '65%',
      clipY: '40%',
      width: '250px',
    },
    duration: 1.8,
  },
]

const StyledButton = styled('button')(({ theme }) => ({
  all: 'revert',
  background: theme.palette.primary.main,
  cursor: 'pointer',
  padding: theme.spacing(0.5, 4),
  width: 'fit-content',
  margin: '0 auto',
  border: 'none',
  outline: 0,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}))

const StyledText = styled(Typography)({
  fontSize: '2rem !important',
  position: 'relative',
  userSelect: 'none',
  span: {
    position: 'relative',
    display: 'inline-block',
  },
})

const FlairWrapper = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 300,
})

export interface FlairTextProps {
  text: string
}

export const FlairText: FC<FlairTextProps> = ({ text = '' }) => {
  const container = useRef<HTMLButtonElement>(null)
  const tmln = useRef<gsap.core.Timeline>(null)
  const [flairId, setFlairId] = useState(-1)
  const reduced = useReducedMotion()

  // Hover dance and an endless color cycle; reduced motion shows plain letters.
  useGSAP(
    () => {
      if (!container.current || reduced) return
      const targets = container.current.querySelectorAll('span')
      if (tmln.current) tmln.current.kill()
      const tl = (tmln.current = gsap.timeline({
        repeat: -1,
        repeatDelay: 0,
        paused: true,
      }))

      const delta = 360 / targets.length
      targets.forEach((el, i) => {
        tl.fromTo(
          el,
          { top: 0 },
          { duration: 0.5, top: -10, yoyo: true, repeat: 1 },
          i * 0.1
        )
        tl.fromTo(
          el,
          { rotateY: 0 },
          { duration: 1, rotateY: '+=360' },
          i * 0.1
        )
        gsap.fromTo(
          el,
          { color: `hsl(${i * delta}, 100%, 50%)` },
          {
            duration: 3,
            color: `hsl(${i * delta - 360}, 100%, 50%)`,
            ease: 'none',
            repeat: -1,
          }
        )
      })
    },
    { dependencies: [flairId, reduced], scope: container, revertOnUpdate: true }
  )

  useGSAP(
    () => {
      const flair = flairs[flairId]
      if (!flair) return
      gsap.delayedCall(flair.duration, () => setFlairId(-1))
    },
    { dependencies: [flairId] }
  )

  const onMouseEnter = () => {
    if (tmln.current) tmln.current.play()
  }
  const onMouseLeave = () => {
    if (tmln.current) tmln.current.pause(0)
  }

  const onClick = () => {
    if (flairId >= 0) return
    setFlairId(Math.floor(Math.random() * flairs.length))
  }

  return (
    <>
      <FlairWrapper>
        {flairs.map(
          (entry, index) =>
            // The GIFs are the punchline, but they're motion: skipped when reduced.
            flairId === index &&
            !reduced && <FlairGif key={entry.flair.id} {...entry.flair} />
        )}
      </FlairWrapper>
      <StyledButton
        ref={container}
        // One span per letter (for the dance) reads letter by letter, and
        // the arrows are decoration: name the button once, in words.
        aria-label={text.replace(/[<>]/g, '').trim()}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <StyledText fontFamily="Rammetto One">
          {flairId === -1 &&
            text.split('').map((letter, i) => <span key={i}>{letter}</span>)}
          {flairId >= 0 && (
            <>
              <span>W</span>
              <span>O</span>
              <span>O</span>
              <span>O</span>
              <span>O</span>
              <span>!</span>
            </>
          )}
        </StyledText>
      </StyledButton>
    </>
  )
}
