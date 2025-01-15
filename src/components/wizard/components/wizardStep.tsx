import React, { FC, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Box, BoxProps, Button, Typography } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection, WizardValue } from '../wizard.types'
import { DefaultSelectionRenderer, SelectionRendererProps } from './DefaultSelectionRenderer'
gsap.registerPlugin(useGSAP)

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'> & {
  next?: WizardValue
  id: WizardValue
  onComplete?: (value: WizardResult) => void
  onSelect?: (value: WizardResult) => void
  selections?: WizardSelection[]
  title: JSX.Element
  active?: boolean
  selectionRenderer?: FC<SelectionRendererProps>
}

export const WizardStep: React.FC<WizardStepProps> = ({
  active,
  selections = [],
  onComplete,
  onSelect,
  className,
  next = '',
  title,
  id,
  selectionRenderer,
  ...props
}) => {
  const container = useRef<HTMLDivElement>()
  const [selected, setSelected] = React.useState<WizardResult | null>(null)

  const selectionHandler = useCallback(
    (value: WizardResult) => () => {
      setSelected(value)
      if (onSelect) {
        onSelect(value)
      }
    },
    [onSelect]
  )

  const completeHandler = useCallback(() => {
    if (onComplete && (selected || selections.length === 0)) {
      onComplete(selected || { id: id, next, value: '' })
    }
  }, [id, next, onComplete, selected, selections.length])

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

  const renderComplete = useCallback(() => {
    return (
      <Button
        disabled={!selected && selections.length > 0}
        onClick={completeHandler}
        sx={{ position: 'relative', zIndex: 2 }}
      >
        Next
      </Button>
    )
  }, [completeHandler, selected, selections.length])

  const SelectionRenderer = selectionRenderer || DefaultSelectionRenderer
  return (
    <Box
      id={`wizard-step-${id}`}
      ref={container}
      className={classNames(`wizard-step`, className)}
      {...props}
    >
      <Typography variant="h2" sx={{ position: 'relative', zIndex: 2 }}>{title}</Typography>
      <SelectionRenderer
        selections={selections}
        selected={selected}
        onSelect={selectionHandler}
        next={next}
      />
      {renderComplete()}
    </Box>
  )
}

export default WizardStep
