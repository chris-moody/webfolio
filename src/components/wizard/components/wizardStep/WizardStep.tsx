import { FC, useCallback, useRef, ReactNode, useEffect } from 'react'
import { Box, BoxProps, Stack } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection } from '../../wizard.types'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from './components/DefaultSelectionRenderer'
import { useGSAP } from '@gsap/react'
import { FancyText } from '@/components/fancyText/FancyText'
import { buildStepOff, buildStepOn } from '../../wizard.transitions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { useParams } from 'react-router'
import { useWizardStep } from '@/data/wizards'
import { setSelection, setStep } from '@/redux/slices/wizard/wizard.reducer'
import { selectWizardSelection } from '@/redux/slices/wizard/wizard.selector'

export interface WizardStepConfig {
  next?: string
  id: string
  selections?: WizardSelection[]
  header?: ReactNode
  body?: ReactNode
  media?: ReactNode
  active?: boolean
  selectionRenderer?: FC<SelectionRendererProps>
}

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'>

export const WizardStep: FC<WizardStepProps> = ({ className, ...props }) => {
  const dispatch = useAppDispatch()
  const { wizardId = '', stepId: id = '' } = useParams()

  const stepConfig = useWizardStep(wizardId, id)

  const {
    selections = [],
    header,
    body,
    media,
    selectionRenderer,
    active = true,
    next = '',
  } = stepConfig

  const container = useRef<HTMLDivElement>(undefined)
  const flair = useAppSelector(selectThemeFlair)
  const selection = useAppSelector(selectWizardSelection)

  useEffect(() => {
    if (id) {
      dispatch(setStep({ id, next, selections: selections.map((s) => ({
        next: s.next,
        id: s.id,
        label: s.label,
      })) }))
    }
  }, [dispatch, id, next, selections])

  const selectionHandler = useCallback(
    (value: WizardResult) => () => {
      dispatch(setSelection(value))
    },
    [dispatch]
  )

  useGSAP(
    () => {
      if (active) {
        buildStepOn()
      } else {
        buildStepOff()
      }
    },
    { dependencies: [active], scope: container }
  )

  useGSAP(
    () => {
      if (!active) buildStepOff()
    },
    { dependencies: [active, flair], scope: container }
  )

  const SelectionRenderer = selectionRenderer || DefaultSelectionRenderer
  return (
    <Box
      id={`wizard-step-${id}`}
      ref={container}
      className={classNames(`wizard-step`, active, className)}
      sx={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        margin: '0 auto',
        width: {
          xs: '100%',
        },
        maxWidth: {
          md: 768,
          lg: 992,
          xl: 1280,
        },
      }}
      {...props}
    >
      {(header || body || media) && (
        <Stack
          flex={selectionRenderer || selections.length > 0 ? 0.4 : 1}
          justifyContent="center"
        >
          {header && (
            <FancyText
              variant="h4"
              fancy={{ depth: 10 }}
              className="content"
              sx={[
                {
                  position: 'relative',
                  p: 2,
                  mt: 4,
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
              {header}
            </FancyText>
          )}
          {body && (
            <FancyText
              variant="body1"
              fancy={{ depth: 7 }}
              className="content"
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
          {media && <Box>{media}</Box>}
        </Stack>
      )}
      <SelectionRenderer
        selections={selections}
        selected={selection}
        onSelect={selectionHandler}
      />
    </Box>
  )
}

export default WizardStep
