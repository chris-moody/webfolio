import { BoxProps } from '@mui/material'
import { FC } from 'react'
import { PinData } from '../wizard/components/flairSelectionRenderer/flairSelectionRenderer.helpers'

export interface PinBackProps extends BoxProps {
  data: PinData
}

export const PinBack: FC<PinBackProps> = ({ data }) => {
  const {
    name,
    background = 'red',
    value = 50,
    x = 50,
    y = 50
  } = data

  return (
    <g
      transform={`translate(${x},${y})`}
      id={`pin-${name}`}
      onClick={() => console.log(`Clicked ${name}`)}
    >
      <defs>
        <mask className="mask" id={`pinmask-${name}`}>
          <circle cx={0} cy={0} r={value} fill="white" />
        </mask>
      </defs>
      <circle cx={0} cy={0} r={value} fill="white" />
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
