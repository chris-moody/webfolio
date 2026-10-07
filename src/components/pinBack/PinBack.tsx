import { data as palette, neutral } from '@/tokens'

// SVG masks show what's under white; this is a mask channel, not a design color.
const MASK_VISIBLE = neutral[0]
import { BoxProps } from '@mui/material'
import { FC } from 'react'
import { PinData } from '../wizard/components/wizardStep/components/flairSelectionRenderer/flairSelectionRenderer.helpers'

export interface PinBackProps extends BoxProps {
  data: PinData
}

export const PinBack: FC<PinBackProps> = ({ data }) => {
  const { name, background = palette.red, value = 50, x = 50, y = 50 } = data

  return (
    <g
      transform={`translate(${x},${y})`}
      id={`pin-${name}`}
      onClick={() => console.log(`Clicked ${name}`)}
    >
      <defs>
        <mask className="mask" id={`pinmask-${name}`}>
          <circle cx={0} cy={0} r={value} fill={MASK_VISIBLE} />
        </mask>
      </defs>
      <circle cx={0} cy={0} r={value} fill={neutral[0]} />
      <image
        href={background}
        mask={`url(#pinmask-${name})`}
        width={value * 2}
        height={value * 2}
        x={-value}
        y={-value}
      />
    </g>
  )
}
