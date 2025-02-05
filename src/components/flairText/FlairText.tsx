import { FC, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Box, styled, Typography } from '@mui/material'
import woo1 from '@/assets/flair/woo-1.gif'
import woo4 from '@/assets/flair/woo-4.gif'
import woo5 from '@/assets/flair/woo-5.gif'
import woo6 from '@/assets/flair/woo-6.gif'
import { FlairGif } from './FlairGif'

const flairs = [
  {
    flair: {
      id: 'woo1',
      src: woo1,
      clipR: '25%',
      clipX: '45%',
      clipY: '45%',
      width: '200px',
    },
    duration: 1.6,
  },
  {
    flair: {
      id: 'woo4',
      src: woo4,
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
      src: woo5,
      clipR: '45%',
      clipX: '55%',
      clipY: '50%',
      width: '150px',
    },
    duration: 3.75,
  },
  {
    flair: {
      id: 'woo6',
      src: woo6,
      clipR: '25%',
      clipX: '65%',
      clipY: '40%',
      width: '200px',
    },
    duration: 1.8,
  },
]

const StyledButton = styled('button')(({ theme }) => ({
  all: 'revert',
  background: theme.palette.primary.main,
  cursor: 'pointer',
  padding: theme.spacing(0.5, 4),
  margin: theme.spacing(1, 0),
  border: 'none',
  outline: 0,
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
  zIndex: 100,
})

export interface FlairTextProps {
  text: string
}

export const FlairText: FC<FlairTextProps> = ({ text = '' }) => {
  const container = useRef<HTMLButtonElement>(null)
  const tmln = useRef<gsap.core.Timeline>(null)
  const [flairId, setFlairId] = useState(-1)

  useGSAP(
    () => {
      if (!container.current) return
      const targets = container.current.querySelectorAll('span')
      if (tmln.current) tmln.current.kill()
      const tl = (tmln.current = gsap.timeline({
        repeat: -1,
        repeatDelay: 0,
        paused: true,
      }))

      const delta = 360 / targets.length
      targets.forEach((el, i) => {
        tl.fromTo(el, { top: 0 }, { duration: 0.5, top: -10, yoyo: true, repeat: 1 }, i * 0.1)
        tl.fromTo(el, { rotateY: 0 }, { duration: 1, rotateY: '+=360' }, i * 0.1)
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
    { dependencies: [flairId], scope: container }
  )

  useGSAP(
    () => {
      if (flairId === -1) return
      gsap.delayedCall(flairs[flairId].duration, () => setFlairId(-1))
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
          flairId === index && (
            <FlairGif key={entry.flair.id} {...entry.flair} />
          )
      )}
    </FlairWrapper>
      <StyledButton
        ref={container}
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
