import { FC } from 'react'
import { WizardResult, WizardSelection } from '../../../wizard.types'
import { Stack } from '@mui/material'
import classNames from 'classnames'
import { FancyNavButton } from '@/components/fancyButton/FancyButton'

export interface SelectionRendererProps {
  selections?: WizardSelection[]
  selected?: WizardResult | null
  onSelect: (value: WizardResult) => () => void
}
export const LinkSelectionRenderer: FC<SelectionRendererProps> = ({
  selections = [],
}) => {
  if (selections.length < 1) return null

  return (
    <Stack
      className="wizard-step-content"
      spacing={2}
      sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: { md: '300px' },
        margin: '0 auto',
      }}
    >
      {selections.map((selection) => {
        return (
          <FancyNavButton
            className={classNames('content')}
            key={selection.id}
            sx={{
              width: 'auto',
              '&:active, &:focus': {
                outline: 0,
              },
            }}
            to={selection.next || null}
          >
            {selection.label}
          </FancyNavButton>
        )
      })}
    </Stack>
  )
}
