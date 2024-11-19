import { FC } from 'react'
import { WizardResult, WizardSelection, WizardValue } from '../wizard.types'
import { Button, Stack } from '@mui/material'
import classNames from 'classnames'

export interface SelectionRendererProps {
  selections?: WizardSelection[]
  selected?: WizardResult | null
  onSelect: (value: WizardResult) => () => void
  next: WizardValue
}
export const DefaultSelectionRenderer: FC<SelectionRendererProps> = ({
  selections = [],
  selected,
  onSelect,
  next,
}) => (
  <Stack
    className="wizard-step-content"
    sx={{ position: 'relative', zIndex: 2 }}
  >
    {selections.map((selection) => (
      <Button
        className={classNames({ active: selected?.id === selection.id })}
        key={selection.id}
        onClick={onSelect({
          id: selection.id,
          next: selection.next || next,
          value: selection.id,
        })}
      >
        {selection.label}
      </Button>
    ))}
  </Stack>
)
