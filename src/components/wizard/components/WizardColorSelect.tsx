import { FC } from 'react'
import { ColorPicker } from '@/components/colorPicker/ColorPicker'
import { SelectionRendererProps } from './DefaultSelectionRenderer'
import { Box } from '@mui/material'

export const WizardColorSelection: FC<SelectionRendererProps> = ({
  onSelect,
  next
}) => {
  
  const selectionHandler = (color: string) => {
    onSelect({ id: 'color', next, value: color })()
  }

  return (
    <div className="wizard-color-select">
      <ColorPicker onSelect={selectionHandler} />
    </div>
  )
}

export const ColorSelectionRenderer: FC<SelectionRendererProps> = ({
  onSelect,
  next
}) => (
  <Box className="wizard-step-content">
    <WizardColorSelection next={next} onSelect={onSelect} />
  </Box>
)
