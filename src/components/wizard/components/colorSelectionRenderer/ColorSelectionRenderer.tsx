import { FC } from 'react'
import { SelectionRendererProps } from '../DefaultSelectionRenderer'
import { Box } from '@mui/material'
import { WizardColorSelection } from './components/WizardColorSelection'
import { WizardColorSchemeSwitch } from './components/WizardColorSchemeSwitch'

export const ColorSelectionRenderer: FC<SelectionRendererProps> = ({
  onSelect,
  next
}) => (
  <Box className="wizard-step-content">
    <WizardColorSchemeSwitch />
    <WizardColorSelection next={next} onSelect={onSelect} />
  </Box>
)
