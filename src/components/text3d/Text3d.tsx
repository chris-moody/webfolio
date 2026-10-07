import { useGSAP } from '@gsap/react'
import {
  Box,
  BoxProps,
  styled,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material'
import classNames from 'classnames'
import gsap from 'gsap'
import { FC, useRef } from 'react'
import { useReducedMotion } from '@/motion/motion'

export interface ThreeDProps {
  depth?: number
  stepSize?: number
  animate?: boolean
  containerProps?: BoxProps
  renderBorder?: boolean
}
export type Text3dProps = TypographyProps & ThreeDProps

const Container = styled(Box)({
  transformStyle: 'preserve-3d',
  transform: 'rotateY(15deg) rotateX(5deg) rotateZ(-1deg) translateZ(0)',
  position: 'relative',
  display: 'inline-block',
  zIndex: 2,
  '> span': {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    transformStyle: 'preserve-3d',
    position: 'absolute',
  },
})

const HiddenText = styled(Typography)({
  visibility: 'hidden',
})

const LayeredText = styled(Typography)(({ theme }) => [
  {
    width: '100%',
    height: 'fit-content',
    position: 'absolute',
    left: 0,
    top: 0,
    transformStyle: 'preserve-3d',
    textShadow: '0 0 4px var(--highlight)',
    color: theme.palette.text.primary,
    userSelect: 'none',
    pointerEvents: 'none',
    '&:first-of-type': {
      userSelect: 'auto',
      pointerEvents: 'all',
      textShadow: 'none',
    },
    '&:last-of-type': {
      WebkitTextStroke: '8px var(--highlight)',
    },
    variants: [
      {
        props: { variant: 'h1' },
        style: [
          {
            color: theme.palette.common.white,
            textShadow: '4px 0 10px var(--shadow)',
            '&:last-of-type': {
              WebkitTextStroke: '16px var(--shadow)',
            },
          },
          theme.applyStyles('dark', {
            color: theme.palette.primary.main,
          }),
        ],
      },
    ],
  },
  theme.applyStyles('dark', {
    textShadow: '0px 0 4px var(--shadow)',
    '&:last-of-type': {
      WebkitTextStroke: '12px var(--shadow)',
    },
  }),
])

export const Text3d: FC<Text3dProps> = ({
  animate = false,
  depth = 15,
  stepSize = 1.5,
  containerProps = {},
  children,
  renderBorder = false,
  className,
  ...props
}) => {
  const theme = useTheme()
  const layers = Math.max(depth, 7)
  const container = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  // The wobble loops forever, so reduced motion turns it off entirely.
  useGSAP(
    () => {
      if (animate && !reduced && container.current) {
        gsap.fromTo(
          container.current,
          { rotateX: -20 },
          {
            rotateX: 20,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            duration: 10,
          }
        )
        gsap.fromTo(
          container.current,
          { rotateY: -30 },
          {
            rotateY: 30,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            duration: 5,
          }
        )
        gsap.fromTo(
          container.current,
          { rotateZ: 5 },
          {
            rotateZ: -5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            duration: 2.5,
          }
        )
      }
    },
    { dependencies: [animate, reduced], scope: container, revertOnUpdate: true }
  )
  const median = Math.floor(layers / 2)
  return (
    <Container
      component="div"
      ref={container}
      className={classNames('container', className)}
      {...containerProps}
    >
      <span>
        {Array.from({ length: layers }).map((_, n) => {
          return (
            <LayeredText
              key={n}
              // Only the front layer is real; the others are depth. Without
              // this, every link and word inside 3D text existed eight times
              // for keyboard and screen-reader users.
              {...(n > 0 && { 'aria-hidden': true, inert: true })}
              {...props}
              sx={[
                {
                  transform: `translateZ(${n * -stepSize}px)`,
                  ...(n === median + 1 && {
                    WebkitTextStroke: '3px var(--shadow)',
                  }),
                  ...(n === median + 2 &&
                    renderBorder && {
                      WebkitTextStroke: `15px ${theme.palette.primary.light}`,
                      textShadow: `6px 0 6px ${theme.palette.primary.dark}, 5px 5px 5px ${theme.palette.primary.dark}, 0 6px 6px ${theme.palette.primary.dark}`,
                    }),
                  ...(n === median + 3 &&
                    renderBorder && {
                      WebkitTextStroke: `15px ${theme.palette.primary.main}`,
                    }),
                },
                theme.applyStyles('dark', {
                  ...(n === median + 2 &&
                    renderBorder && {
                      WebkitTextStroke: `15px ${theme.palette.common.white}`,
                    }),
                  ...(n === median + 3 &&
                    renderBorder && {
                      WebkitTextStroke: `15px ${theme.palette.common.white}`,
                    }),
                }),
              ]}
            >
              {children}
            </LayeredText>
          )
        })}
      </span>
      {/* Reserves layout space only (visibility: hidden keeps it out of the
          accessibility tree and tab order). */}
      <HiddenText {...props} aria-hidden>
        {children}
      </HiddenText>
    </Container>
  )
}
