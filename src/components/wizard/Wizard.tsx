import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { WizardStepConfig } from './components/wizardStep/WizardStep'
import { Box, BoxProps, Stack, styled } from '@mui/material'
import classNames from 'classnames'
import { WizardResult } from './wizard.types'
import { SlideNav } from './components/SlideNav'
import { slideHeadingId } from './wizard.ids'
import { FancyText } from '../fancyText/FancyText'
import { useWizard } from '@/data/wizards'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { FancyNavButton } from '../fancyButton/FancyButton'
import { useAppSelector } from '@/redux/hooks'
import { selectWizardSelection } from '@/redux/slices/wizard/wizard.selector'
import { findTourWizard, tourPath } from '@/data/tour.manifest'
import { NotFound } from '@/components/notFound/NotFound'
import { useSwipeable } from 'react-swipeable'
import { useReducedMotion } from '@/motion/motion'

export interface WizardConfig {
  id: string
  next?: string
  prev?: string
  stepData?: WizardStepConfig[]
  active?: boolean
  header?: React.ReactNode
  body?: React.ReactNode
  showNav?: boolean
  bodyComponent?: FC
  defaultStep?: string
  i?: (
    wizard: WizardConfig,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => React.ReactNode
  renderer?: FC<WizardProps>
}

export type WizardProps = Omit<BoxProps, 'id'>

const StyledWizard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  overflow: 'hidden',
  width: `100%`,
  height: '100%',
  top: 0,
  left: 0,
  padding: theme.spacing(2),
  viewTransitionName: 'wizard',
  '> h1': {
    viewTransitionName: 'wizard-title',
  },
  // Short landscape screens: let the page scroll instead of squeezing or
  // rotating the layout (WCAG 1.3.4 Orientation).
  '@media (max-height: 520px)': {
    position: 'relative',
    height: 'auto',
    minHeight: '100%',
    overflow: 'visible',
  },
}))

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) ||
    // react-colorful's pickers use arrow keys themselves.
    !!target.closest('.react-colorful, [role="slider"]'))

/**
 * A tour "wizard". Multi-slide wizards follow the WAI-ARIA APG carousel
 * pattern, adapted to route-based slides: every slide is a URL, so Back, Next,
 * and the slide picker are real links that work before (and without)
 * hydration.
 */
export const Wizard: FC<WizardProps> = ({ className, ...props }) => {
  const { wizardId: id = 'home', stepId } = useParams()
  const selection = useAppSelector(selectWizardSelection)
  const navigate = useNavigate()
  const location = useLocation()

  const wizardData = useWizard(id)
  const {
    showNav = true,
    active = true,
    defaultStep = '',
    stepData = [],
    header,
    body,
    next,
    prev = next,
    bodyComponent,
  } = wizardData || {}
  const wizardId = wizardData?.id
  const title = findTourWizard(id)?.title ?? ''
  const total = stepData.length
  const isCarousel = total > 1
  const stepIndex = stepData.findIndex((step) => step.id === stepId)
  const slide = stepData[stepIndex]

  // Destinations come from the wizard data, not from effects, so the
  // prerendered links are already correct.
  const prevLink = useMemo(() => {
    const previous = stepData[stepIndex - 1]
    if (wizardId && previous) return tourPath(wizardId, previous.id)
    return prev ? tourPath(prev) : null
  }, [prev, stepData, stepIndex, wizardId])
  const nextLink = useMemo(() => {
    if (!showNav) return null
    const following = slide?.next ?? stepData[stepIndex + 1]?.id
    if (wizardId && following) return tourPath(wizardId, following)
    return (next && tourPath(next)) || selection.next || null
  }, [next, selection, showNav, slide, stepData, stepIndex, wizardId])

  useEffect(() => {
    if (wizardId && stepIndex < 0 && defaultStep)
      navigate(tourPath(wizardId, defaultStep), { replace: true })
  }, [defaultStep, navigate, stepIndex, wizardId])

  // Announce slide changes politely, but not on the first page load: the
  // page itself is being read then.
  const [initialKey] = useState(location.key)
  const navigated = location.key !== initialKey
  const announcement = !navigated
    ? ''
    : isCarousel && slide
      ? `${title}, slide ${stepIndex + 1} of ${total}: ${slide.title}`
      : title

  // Keep focus where it was (on Next, or on a slide link) so repeated presses
  // keep working. If it was inside the old slide and vanished with it, move it
  // to the new slide's heading instead of leaving it on <body>.
  useEffect(() => {
    if (!navigated || !wizardId || !slide) return
    const active = document.activeElement
    if (active && active !== document.body && active.isConnected) return
    document
      .getElementById(slideHeadingId(wizardId, slide.id))
      ?.focus({ preventScroll: true })
  }, [location.key, navigated, slide, wizardId])

  const reduced = useReducedMotion()
  // Keyboard and swipe navigation get the same transition as clicked links.
  const goTo = useCallback(
    (to: string | null | undefined) => {
      if (to) navigate(to, { viewTransition: !reduced })
    },
    [navigate, reduced]
  )

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      isTyping(event.target)
    )
      return
    if (!wizardId) return
    // Navigation updates the URL before React re-renders, so a fast second key
    // press would see the previous slide's links. Work from the URL instead.
    const current = window.location.pathname.split('/').pop()
    const index = stepData.findIndex((step) => step.id === current)
    const at = index < 0 ? stepIndex : index
    const before = stepData[at - 1]
    const following = stepData[at]?.next ?? stepData[at + 1]?.id
    const first = stepData[0]
    const last = stepData[total - 1]
    const target = {
      ArrowLeft: before
        ? tourPath(wizardId, before.id)
        : prev
          ? tourPath(prev)
          : null,
      ArrowRight: following ? tourPath(wizardId, following) : nextLink,
      Home: isCarousel && first ? tourPath(wizardId, first.id) : null,
      End: isCarousel && last ? tourPath(wizardId, last.id) : null,
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    goTo(target)
  }

  // Swipe is a touch convenience only; every swipe has a button equivalent.
  const handlers = useSwipeable({
    onSwipedLeft: () => goTo(nextLink),
    onSwipedRight: () => goTo(prevLink),
    swipeDuration: 450,
    preventScrollOnSwipe: true,
  })

  if (!wizardData || !wizardId) {
    return <NotFound />
  }

  const BodyComponent = bodyComponent
  const wizardBody = BodyComponent ? <BodyComponent /> : body
  return (
    <StyledWizard
      component="section"
      id={`wizard-${id}`}
      className={classNames('wizard', { active }, className)}
      aria-label={title}
      {...(isCarousel && { 'aria-roledescription': 'carousel' })}
      onKeyDown={onKeyDown}
      {...props}
      {...handlers}
    >
      {header && (
        <FancyText
          fancy={{ animate: true, renderBorder: true }}
          variant="h1"
          zIndex={1}
        >
          {header}
        </FancyText>
      )}
      {wizardBody}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          flex: 1,
        }}
      >
        <Outlet context={nextLink ?? ''} />
      </Box>

      {showNav && (
        <Stack
          className="nav"
          direction="row"
          spacing={2}
          justifyContent="center"
          my={1}
        >
          <FancyNavButton
            to={prevLink}
            disabled={!prevLink}
            sx={{
              position: 'relative',
              zIndex: 2,
              flex: { xs: 0.5, md: 'unset' },
            }}
          >
            Back
          </FancyNavButton>
          <FancyNavButton
            to={nextLink}
            disabled={!nextLink}
            sx={{
              position: 'relative',
              zIndex: 2,
              flex: { xs: 0.5, md: 'unset' },
            }}
          >
            Next
          </FancyNavButton>
        </Stack>
      )}

      {isCarousel && (
        <SlideNav wizardId={wizardId} slides={stepData} current={stepIndex} />
      )}

      <p
        role="status"
        aria-live="polite"
        className="sr-only"
        data-slide-announcer
      >
        {announcement}
      </p>
    </StyledWizard>
  )
}

export default Wizard
