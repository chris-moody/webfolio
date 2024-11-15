import React, { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Box, BoxProps, Button, Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import { WizardResult, WizardSelection, WizardValue } from '../wizard.types'
gsap.registerPlugin(useGSAP)

export type WizardStepProps = Omit<BoxProps, 'onSelect' | 'id'> & {
  next?: WizardValue
  id: WizardValue
  onComplete?: (value: WizardResult) => void
  onSelect?: (value: WizardResult) => void
  selections?: WizardSelection[]
  title: string
  active?: boolean
  renderer?: (
    step: WizardStepProps,
    onComplete: (value: WizardResult) => void,
    onSelect: (value: WizardResult) => void
  ) => React.ReactNode
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

  const renderSelection = useCallback(
    (
      { renderer, ...selection }: WizardSelection,
      onSelect: (value: WizardResult) => () => void,
      active: boolean
    ) => {
      if (renderer) {
        return renderer(selection, onSelect, active)
      }
      return (
        <Button
          className={classNames({ active })}
          key={selection.id}
          onClick={onSelect({
            id: selection.id,
            next: selection.next || next,
            value: selection.id,
          })}
        >
          {selection.label}
        </Button>
      )
    },
    [next]
  )

  const renderComplete = useCallback(() => {
    return (
      <Button disabled={!selected && selections.length > 0} onClick={completeHandler}>
        Next
      </Button>
    )
  }, [completeHandler, selected, selections.length])

  return (
    <Box
      id={`wizard-step-${id}`}
      ref={container}
      className={classNames(`wizard-step`, className)}
      {...props}
    >
      <Typography variant="h2">{title}</Typography>
      <Stack className="wizard-step-content">
        {selections.map((selection) =>
          renderSelection(
            selection,
            selectionHandler,
            selected?.id === selection.id
          )
        )}
      </Stack>
      {renderComplete()}
    </Box>
  )
}

export default WizardStep
