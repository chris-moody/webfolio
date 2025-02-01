import { FC, useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { getPinData } from './flairSelectionRenderer.helpers'

import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from '../DefaultSelectionRenderer'
import { WizardResult } from '../../../../wizard.types'
import { CirclePacking } from './components/CirclePacking'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { setFlair } from '@/redux/slices/theme/theme.reducer'

export const FlairSelectionRenderer: FC<SelectionRendererProps> = ({
  selections,
}) => {
  const flair = useAppSelector(selectThemeFlair)
  const f = flair.toString()
  const [current, setCurrent] = useState<WizardResult | null | undefined>({ id: f, value: f, next: '' })
  const dispatch = useAppDispatch()

  const selectHandler = useCallback(
    (result: WizardResult) => () => {
      dispatch(setFlair(parseInt(result.value) || 1))
    },
    [dispatch]
  )

  useEffect(() => {
    setCurrent((prev) => {
      if (prev && parseInt(prev.id) !== flair) {
        const f = flair.toString()
        return { id: f, value: f, next: prev.next }
      }
      return prev
    })
  }, [flair])

  return (
    <Box className="wizard-step-content">
      <DefaultSelectionRenderer
        selections={selections}
        selected={current}
        onSelect={selectHandler}
      />
      <CirclePacking
        data={getPinData().slice(0, flair)}
        level={flair}
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -40%)',
        }}
      />
    </Box>
  )
}
