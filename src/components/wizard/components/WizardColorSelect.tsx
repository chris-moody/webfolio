import { FC } from 'react'
import { ColorPicker } from '@/components/colorPicker/ColorPicker'
import { WizardSelectionRendererProps } from '../wizard.types'

const WizardColorSelectSelect: FC<WizardSelectionRendererProps> = ({
  selection,
  onSelect
}) => {
  
  const selectionHandler = (color: string) => {
    onSelect({ id: selection.id, next: selection.next || '', value: color })
  }

  return (
    <div className="wizard-color-select">
      <ColorPicker onSelect={selectionHandler} />
    </div>
  )
}

export default WizardColorSelectSelect
