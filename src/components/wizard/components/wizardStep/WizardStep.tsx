import { FC, useCallback, useRef, useState, ReactNode } from 'react'
import { Box, BoxProps, Stack } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection, WizardValue } from '../../wizard.types'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from './components/DefaultSelectionRenderer'
import { FancyButton } from '@/components/fancyButton/FancyButton'
import { useGSAP } from '@gsap/react'
import { FancyText } from '@/components/fancyText/FancyText'
import { buildStepOff, buildStepOn } from '../../wizard.transitions'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'> & {
  next?: WizardValue
  id: WizardValue
  index?: number
  onBack?: () => void
  onNext?: (value: WizardResult) => void
  onSelect?: (value: WizardResult) => void
  selections?: WizardSelection[]
  header?: ReactNode
  body?: ReactNode
  active?: boolean
  selectionRenderer?: FC<SelectionRendererProps>
}

export const WizardStep: FC<WizardStepProps> = ({
  selections = [],
  onBack,
  onNext,
  onSelect,
  className,
  next = '',
  header,
  body,
  id,
  index = -1,
  selectionRenderer,
  active,
  ...props
}) => {
  const container = useRef<HTMLDivElement>()
  const flair = useAppSelector(selectThemeFlair)

  const [selected, setSelected] = useState<WizardResult | null>({
    id: selections[0]?.id,
    value: selections[0]?.id,
    next: selections[0]?.next || next,
  })

  const selectionHandler = useCallback(
    (value: WizardResult) => () => {
      setSelected(value)
      if (onSelect) {
        onSelect(value)
      }
    },
    [onSelect]
  )
  const backHandler = useCallback(() => {
    if (onBack) onBack()
  }, [onBack])

  const nextHandler = useCallback(() => {
    if (onNext && (selected || selections.length === 0)) {
      onNext(selected || { id: id, next, value: '' })
    }
  }, [id, next, onNext, selected, selections.length])

  useGSAP(
    () => {
      buildStepOff()
    },
    { dependencies: [], scope: container }
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
        //top: '50%',
        //transform: 'translateY(-50%)',
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
      {(header || body) && (
        <Stack flex={.4} justifyContent="center">
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
        </Stack>
      )}
      <SelectionRenderer
        selections={selections}
        selected={selected}
        onSelect={selectionHandler}
        next={next}
      />
      <Stack
        className="nav"
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="center"
        mb={2}
      >
        {index > 0 && <FancyButton
          onClick={backHandler}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          Back
        </FancyButton>}

        <FancyButton
          disabled={!selected && selections.length > 0}
          onClick={nextHandler}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          Next
        </FancyButton>
      </Stack>
    </Box>
  )
}

export default WizardStep
