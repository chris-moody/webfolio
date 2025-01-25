import { FC, useCallback, useEffect } from 'react'
import { Box } from '@mui/material'
import { getPinData } from './flairSelectionRenderer.helpers'

import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from '../DefaultSelectionRenderer'
import { WizardResult } from '../../wizard.types'
import { CirclePacking } from './components/CirclePacking'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { setFlair } from '@/redux/slices/theme/theme.reducer'

export const FlairSelectionRenderer: FC<SelectionRendererProps> = ({
  onSelect,
  next,
  selections,
  selected,
}) => {
  const flair = useAppSelector(selectThemeFlair)
  const dispatch = useAppDispatch()

  const selectHandler = useCallback(
    (result: WizardResult) => () => {
      onSelect(result)()
    },
    [onSelect]
  )

  useEffect(() => {
    dispatch(setFlair(parseInt(selected?.id as string) || 1))
  }, [dispatch, selected])

  return (
    <Box className="wizard-step-content">
      <DefaultSelectionRenderer
        selections={selections}
        selected={selected}
        next={next}
        onSelect={selectHandler}
      />
      <CirclePacking data={getPinData().slice(0, flair)} level={flair} sx={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -40%)'
      }} />
    </Box>
  )
}
