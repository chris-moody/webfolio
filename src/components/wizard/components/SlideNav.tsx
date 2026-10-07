import { FC } from 'react'
import { styled } from '@mui/material'
import { NavLink } from 'react-router'
import { tourPath } from '@/data/tour.manifest'
import { useReducedMotion } from '@/motion/motion'

const List = styled('ol')(({ theme }) => [
  {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    width: 'fit-content',
    margin: theme.spacing(0, 'auto', 2),
    padding: theme.spacing(0.25),
    borderRadius: theme.spacing(3),
    background: 'rgba(255, 255, 255, 0.75)',
    position: 'relative',
    zIndex: 1,
  },
  theme.applyStyles('dark', { background: 'rgba(0, 0, 0, 0.5)' }),
])

// The visible dot is 12 px; the link around it is 24 × 24 (WCAG 2.5.8).
const Dot = styled(NavLink)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  '.dot': {
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: `1px solid ${theme.palette.text.primary}`,
  },
  '&[aria-current="step"] .dot': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.getContrastText(theme.palette.primary.main),
  },
  '&:hover .dot': { transform: 'scale(1.2)' },
  '&:focus-visible': {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: 1,
  },
}))

export interface SlideNavProps {
  wizardId: string
  slides: { id: string; title: string }[]
  current: number
}

/** Slide picker for a carousel: one labelled link per slide. */
export const SlideNav: FC<SlideNavProps> = ({ wizardId, slides, current }) => {
  const reduced = useReducedMotion()
  return (
    <nav aria-label="Slides" className="wizard-dots">
      <List>
        {slides.map((slide, index) => (
          <li key={slide.id}>
            <Dot
              to={tourPath(wizardId, slide.id)}
              id={`wizard-dot-${slide.id}`}
              aria-label={`Go to slide ${index + 1} of ${slides.length}: ${slide.title}`}
              aria-current={index === current ? 'step' : undefined}
              viewTransition={!reduced}
            >
              <span className="dot" aria-hidden="true" />
            </Dot>
          </li>
        ))}
      </List>
    </nav>
  )
}
