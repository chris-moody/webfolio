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
import { useParams } from 'react-router'
import { useWizardStep } from '@/data/wizards'
import { setSelection, setStep } from '@/redux/slices/wizard/wizard.reducer'
import { selectWizardSelection } from '@/redux/slices/wizard/wizard.selector'
import { buildStepOn } from '../../wizard.transitions'
import { useGSAP } from '@gsap/react'

export interface WizardStepConfig {
  next?: string
  id: string
  selections?: WizardSelection[]
  header?: ReactNode
  body?: ReactNode
  media?: ReactNode
  unwrappedMedia?: ReactNode
  active?: boolean
  selectionRenderer?: FC<SelectionRendererProps>
}

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'>

const StyledWizardStep = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  height: '100%',
  margin: '0 auto',
  width: '100%',
  viewTransitionName: `wizard-step`,
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
  const {
    selections = [],
    header,
    body,
    media,
    unwrappedMedia,
    selectionRenderer,
    active = true,
    next = '',
  } = stepConfig

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

  /* if (!stepConfig || !stepConfig.id) {
    return <Redirect to="/404/notfound" />
  } */

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
                  position: 'relative',
                  p: 2,
                  mt: { xs: 0, md: 2, lg: 4 },
                  mb: { xs: 0, md: 2 },
                  mx: 'auto',
                  width: 'fit-content',
                  maxHeight: (media || unwrappedMedia) ? '50%' : 'auto',
                  overflow: 'auto',
                  zIndex: 2,
                  background: 'rgba(255,255,255,.75)',
                  borderRadius: 3,
                },
                (theme) =>
                  theme.applyStyles('dark', {
                    background: 'rgba(0,0,0,.75)',
                  }),
              ]}
            >
              <FancyText variant="h4" fancy={{ depth: 10 }}>
                {header}
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
          {media && <Box className="content" height="100%">{media}</Box>}
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
