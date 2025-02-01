import { FC, useCallback } from 'react'
import { ColorPicker } from '@/components/colorPicker/ColorPicker'
import { SelectionRendererProps } from '../../DefaultSelectionRenderer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setColor } from '@/redux/slices/theme/theme.reducer'
import { selectThemeColor } from '@/redux/slices/theme/theme.selector'

export const WizardColorSelection: FC<SelectionRendererProps> = ({
  onSelect,
  next,
}) => {
  const defaultColor = useAppSelector(selectThemeColor)
  const dispatch = useAppDispatch()
  
  const selectionHandler = useCallback((color: string) => {
    onSelect({ id: 'color', next, value: color })()
    dispatch(setColor(color))
  }, [dispatch, onSelect, next])

  return (
    <div className="content wizard-color-select">
      <ColorPicker defaultColor={defaultColor} onSelect={selectionHandler} />
    </div>
  )
}
