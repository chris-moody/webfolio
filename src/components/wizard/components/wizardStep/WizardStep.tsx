import { FC, useCallback, useRef, ReactNode, useEffect } from 'react'
import { Box, BoxProps, Stack, styled } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection } from '../../wizard.types'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from './components/DefaultSelectionRenderer'
import { FancyText } from '@/components/fancyText/FancyText'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useOutletContext, useParams } from 'react-router'
import { useWizard, useWizardStep } from '@/data/wizards'
import { slideHeadingId } from '../../wizard.ids'
import { setSelection, setStep } from '@/redux/slices/wizard/wizard.reducer'
import { selectWizardSelection } from '@/redux/slices/wizard/wizard.selector'
import { buildStepOn } from '../../wizard.transitions'
import { useGSAP } from '@gsap/react'
import { FancyNavButton } from '@/components/fancyButton/FancyButton'
import { TextDisplay } from '@/components/textDisplay/TextDisplay'

export interface WizardOutetContext {
  nextLink?: string
}

export interface WizardStepConfig {
  next?: string
  id: string
  /** Short slide title: the slide's heading and its accessible name. */
  title: string
  selections?: WizardSelection[]
  header?: ReactNode
  headerNext?: string
  body?: ReactNode
  media?: ReactNode
  unwrappedMedia?: ReactNode
  active?: boolean
  selectionRenderer?: FC<SelectionRendererProps>
}

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'> & {
  nextLink?: string
}

// "Slide 2 of 5 · Title", on a pill so it reads on every flair background.
const SlideHeading = styled('h2')(({ theme }) => [
  {
    alignSelf: 'center',
    margin: theme.spacing(0, 0, 1),
    padding: theme.spacing(0.25, 1.5),
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.85)',
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    position: 'relative',
    zIndex: 2,
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    '&:focus:not(:focus-visible)': { outline: 'none' },
  },
  theme.applyStyles('dark', { background: 'rgba(0, 0, 0, 0.6)' }),
])

const StyledWizardStep = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  height: '100%',
  margin: '0 auto',
  width: '100%',
  viewTransitionName: `wizard-step`,
  '.header-actions': {
    paddingTop: theme.spacing(1),
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  '@media (max-height: 520px)': {
    position: 'relative',
    height: 'auto',
    // The page scrolls here, so media needs a real height (Pixi sizes its
    // canvas to this box and would otherwise fall back to 600px).
    '.slide-media': { height: '60vh', minHeight: 200, flexShrink: 0 },
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: 768,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 992,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 1280,
  },
}))

export const WizardStep: FC<WizardStepProps> = ({ className, ...props }) => {
  const dispatch = useAppDispatch()
  const { wizardId = 'home', stepId: id = '' } = useParams()
  const stepConfig = useWizardStep(wizardId, id)
  const slides = useWizard(wizardId)?.stepData ?? []
  const total = slides.length
  const index = slides.findIndex((slide) => slide.id === id)
  const isCarousel = total > 1
  const {
    title,
    selections = [],
    header,
    headerNext,
    body,
    media,
    unwrappedMedia,
    selectionRenderer,
    active = true,
    next = '',
  } = stepConfig
  const nextLink = useOutletContext<string>()

  const container = useRef<HTMLDivElement>(undefined)
  const selection = useAppSelector(selectWizardSelection)

  useGSAP(
    () => {
      if (id) buildStepOn()
    },
    { dependencies: [id], scope: container }
  )

  useEffect(() => {
    if (id) {
      dispatch(
        setStep({
          id,
          title,
          next,
          selections: selections.map((s) => ({
            next: s.next,
            id: s.id,
            label: s.label,
          })),
        })
      )
    }
  }, [dispatch, id, next, selections, title])

  const selectionHandler = useCallback(
    (value: WizardResult) => () => {
      dispatch(setSelection(value))
    },
    [dispatch]
  )

  const SelectionRenderer = selectionRenderer || DefaultSelectionRenderer
  return (
    <StyledWizardStep
      id={`wizard-step-${id}`}
      ref={container}
      className={classNames(`wizard-step`, active, className)}
      {...(isCarousel && {
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-label': `${index + 1} of ${total}: ${title}`,
      })}
      {...props}
    >
      {title && (
        // The slide's heading, and the focus target when focus would be lost.
        // Single-slide wizards already show their question, so it's for
        // screen readers only there.
        <SlideHeading
          id={slideHeadingId(wizardId, id)}
          tabIndex={-1}
          className={isCarousel ? undefined : 'sr-only'}
        >
          {isCarousel ? `Slide ${index + 1} of ${total} · ${title}` : title}
        </SlideHeading>
      )}
      {(header || body || media || unwrappedMedia) && (
        <Stack
          flex={selectionRenderer || selections.length > 0 ? 0.4 : 1}
          justifyContent="space-around"
          height="inherit"
        >
          {header && (
            <TextDisplay
              className="header content"
              sx={{
                maxHeight: media || unwrappedMedia ? '50%' : 'auto',
              }}
            >
              <FancyText
                component="div"
                variant="h4"
                fancy={{ depth: 5, renderBorder: false }}
                position={'relative'}
              >
                {header}{' '}
                {headerNext && nextLink && (
                  <Box className="header-actions">
                    <FancyNavButton to={nextLink}>{headerNext}</FancyNavButton>
                  </Box>
                )}
              </FancyText>
            </TextDisplay>
          )}
          {body && (
            <FancyText
              variant="body1"
              fancy={{ depth: 4, renderBorder: false }}
              className="body content"
              sx={[
                {
                  position: 'relative',
                  p: 2,
                  mb: 2,
                  mx: 'auto',
                  width: 'fit-content',
                  zIndex: 2,
                  background: 'rgba(255,255,255,.75)',
                  borderRadius: 3,
                },
                (theme) =>
                  theme.applyStyles('dark', { background: 'rgba(0,0,0,.75)' }),
              ]}
            >
              {body}
            </FancyText>
          )}
          {media && (
            <Stack
              justifyContent="center"
              alignContent="center"
              className="content slide-media"
              height="50%"
            >
              {media}
            </Stack>
          )}
          {unwrappedMedia}
        </Stack>
      )}
      <SelectionRenderer
        selections={selections}
        selected={selection}
        onSelect={selectionHandler}
      />
    </StyledWizardStep>
  )
}

export default WizardStep
