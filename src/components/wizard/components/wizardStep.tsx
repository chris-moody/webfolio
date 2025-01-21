import { FC, useCallback, useRef, useState, ReactNode } from 'react'
import { Box, BoxProps, Button, Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection, WizardValue } from '../wizard.types'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from './DefaultSelectionRenderer'

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'> & {
  next?: WizardValue
  id: WizardValue
  onBack?: () => void
  onNext?: (value: WizardResult) => void
  onSelect?: (value: WizardResult) => void
  selections?: WizardSelection[]
  title: ReactNode
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
  title,
  id,
  selectionRenderer,
  active,
  ...props
}) => {
  const container = useRef<HTMLDivElement>()
  const [selected, setSelected] = useState<WizardResult | null>(null)

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

  const SelectionRenderer = selectionRenderer || DefaultSelectionRenderer
  return (
    <Box
      id={`wizard-step-${id}`}
      ref={container}
      className={classNames(`wizard-step`, active, className)}
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
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
      <Typography
        variant="h3"
        sx={{
          position: 'relative',
          p: 2,
          mb: 4,
          zIndex: 2,
          background: 'rgb(0,0,0,.5)',
          borderRadius: 3,
        }}
      >
        {title}
      </Typography>
      <SelectionRenderer
        selections={selections}
        selected={selected}
        onSelect={selectionHandler}
        next={next}
      />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1}
        justifyContent="center"
        mt={2}
      >
        <Button onClick={backHandler} sx={{ position: 'relative', zIndex: 2 }}>
          Back
        </Button>

        <Button
          disabled={!selected && selections.length > 0}
          onClick={nextHandler}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  )
}

export default WizardStep
