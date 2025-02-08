import { FC, useCallback, useRef, ReactNode, useEffect } from 'react'
import { Box, BoxProps, Stack, styled, useTheme } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection } from '../../wizard.types'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from './components/DefaultSelectionRenderer'
import { FancyText } from '@/components/fancyText/FancyText'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useOutletContext, useParams } from 'react-router'
import { useWizardStep } from '@/data/wizards'
import { setSelection, setStep } from '@/redux/slices/wizard/wizard.reducer'
import { selectWizardSelection } from '@/redux/slices/wizard/wizard.selector'
import { buildStepOn } from '../../wizard.transitions'
import { useGSAP } from '@gsap/react'
import { FancyNavButton } from '@/components/fancyButton/FancyButton'

export interface WizardOutetContext {
  nextLink?: string
}

export interface WizardStepConfig {
  next?: string
  id: string
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
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
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
  const theme = useTheme()
  const { wizardId = 'home', stepId: id = '' } = useParams()
  const stepConfig = useWizardStep(wizardId, id)
  const {
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
          next,
          selections: selections.map((s) => ({
            next: s.next,
            id: s.id,
            label: s.label,
          })),
        })
      )
    }
  }, [dispatch, id, next, selections])

  useEffect(() => {})

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
      {...props}
    >
      {(header || body || media || unwrappedMedia) && (
        <Stack
          flex={selectionRenderer || selections.length > 0 ? 0.4 : 1}
          justifyContent="center"
          height="inherit"
        >
          {header && (
            <Box
              className="header content"
              sx={[
                {
                  p: theme.spacing(2),
                  mt: { xs: 0, md: 2, lg: 4 },
                  mb: { xs: 0, md: 2 },
                  mx: 'auto',
                  width: 'fit-content',
                  maxHeight: media || unwrappedMedia ? '50%' : 'auto',
                  zIndex: 2,
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  overflowScrolling: 'touch',
                  background: 'rgba(255,255,255,.75)',
                },
                (theme) =>
                  theme.applyStyles('dark', {
                    background: 'rgba(0,0,0,.75)',
                  }),
              ]}
            >
              <FancyText
                component="div"
                variant="h4"
                fancy={{ depth: 10 }}
                position={'relative'}
              >
                {header}{' '}
                {headerNext && nextLink && (
                  <Box className="header-actions">
                    <FancyNavButton to={nextLink}>{headerNext}</FancyNavButton>
                  </Box>
                )}
              </FancyText>
            </Box>
          )}
          {body && (
            <FancyText
              variant="body1"
              fancy={{ depth: 7 }}
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
              className="content"
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
