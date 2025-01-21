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
    spacing={1}
    sx={{ position: 'relative', zIndex: 2, maxWidth: { md: '300px'}, margin: '0 auto' }}
  >
    {selections.map((selection) => {
      const active = selected?.id === selection.id
      return (
        <Button
          className={classNames({ active })}
          key={selection.id}
          variant={active ? 'contained' : 'text'}
          sx={{
            width: 'auto',
            '&:active, &:focus': {
              outline: 0
            }
          }}
          onClick={onSelect({
            id: selection.id,
            next: selection.next || next,
            value: selection.id,
          })}
        >
          {selection.label}
        </Button>
      )
    })}
  </Stack>
)
