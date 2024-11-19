import { FC, useCallback, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { PinData, usePinPack } from './flairSelectionRenderer.helpers'
import {
  DefaultSelectionRenderer,
  SelectionRendererProps,
} from '../DefaultSelectionRenderer'
import { WizardResult } from '../../wizard.types'
import { PinBack } from '@/components/pinBadge/PinBack'
import { useResize } from '@/hooks/window.hook'

export const FlairSelectionRenderer: FC<SelectionRendererProps> = ({
  onSelect,
  next,
  selections,
  selected,
}) => {
  const container = useRef<HTMLDivElement>()
  const [flair, setFlair] = useState<number>(1)
  const { resizer, size } = useResize()
  const pins = usePinPack(size.width, size.height)

  const selectHandler = useCallback(
    (result: WizardResult) => () => {
      onSelect(result)()
    },
    [onSelect]
  )

  const on = (target: string) => {
    gsap.set(target, {
      alpha: 0,
      scale: 10,
      //top: () => `calc(${Math.random()} * 100%)`,
      //left: () => `calc(${Math.random()} * 100%)`,
    })
    gsap.to(target, {
      alpha: 1,
      scale: 1,
      stagger: 0.05,
    })
  }

  const off = (target: string) => {
    gsap.to(target, {
      alpha: 0,
      //top: '-=100',
      scale: 10,
      stagger: 0.05,
    })
  }

  useGSAP(
    () => {
      const target = container.current
      if (!target || !size.width || gsap.getProperty('.pin-1', 'alpha')) return
      on('.pin-1')
    },
    { dependencies: [size.width], scope: container }
  )

  useGSAP(
    () => {
      const target = container.current
      const newFlair = parseInt(selected?.id as string) || 1
      if (!target || flair === newFlair) return

      if (newFlair < flair) {
        const delta = flair - newFlair
        if (delta === 14) off('.pin-15')
        else if (delta === 22) off('.pin-37')
        else off('.pin-15, .pin-37')
      } else {
        const delta = newFlair - flair
        if (delta === 14) on('.pin-15')
        else if (delta === 22) on('.pin-37')
        else on('.pin-15, .pin-37')
      }

      setFlair(newFlair)
    },
    { dependencies: [selected, flair], scope: container }
  )

  const renderPin = (pinData: PinData) => {
    return (
      <PinBack
        group={pinData.group}
        key={pinData.name}
        id={pinData.name}
        background={pinData.background}
        radius={pinData.r}
        x={pinData.x}
        y={pinData.y}
      />
    )
  }

  const w = size.width || '100%'
  const h = size.height || '100%'
  return (
    <Box className="wizard-step-content">
      <Box
        className="pins"
        ref={container}
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {resizer}
        {size.width && <svg width={`${w}`} height={`${h}`} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
          {pins?.slice(0, 1).map(d => renderPin({...(d as PinData), group: 1 }))}
          {pins?.slice(1, 16).map(d => renderPin({...(d as PinData), group: 15 }))}
          {pins?.slice(16).map(d => renderPin({...(d as PinData), group: 37 }))}
        </svg>}
      </Box>
      <DefaultSelectionRenderer
        selections={selections}
        selected={selected}
        next={next}
        onSelect={selectHandler}
      />
    </Box>
  )
}
