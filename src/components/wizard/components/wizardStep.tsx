import { FC, useCallback, useRef, useState, ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Box, BoxProps, Button, Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection, WizardValue } from '../wizard.types'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from './DefaultSelectionRenderer'
gsap.registerPlugin(useGSAP)

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

export const WizardStep: React.FC<WizardStepProps> = ({
  active,
  selections = [],
  onBack,
  onNext,
  onSelect,
  className,
  next = '',
  title,
  id,
  selectionRenderer,
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

  useGSAP(
    () => {
      const target = container.current
      if (!target) return
      if (active) {
        gsap.to(target, { xPercent: '0' })
      } else {
        gsap.to(target, {
          xPercent: '-200',
          onComplete: () => {
            gsap.set(target, { xPercent: '200' })
          },
        })
      }
    },
    { dependencies: [active], scope: container }
  )

  const SelectionRenderer = selectionRenderer || DefaultSelectionRenderer
  return (
    <Box
      id={`wizard-step-${id}`}
      ref={container}
      className={classNames(`wizard-step`, className)}
      {...props}
    >
      <Typography variant="h2" sx={{ position: 'relative', zIndex: 2 }}>
        {title}
      </Typography>
      <SelectionRenderer
        selections={selections}
        selected={selected}
        onSelect={selectionHandler}
        next={next}
      />
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="center">
        <Button
          onClick={backHandler}
          sx={{ position: 'relative', zIndex: 2 }}
        >
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
