import { BoxProps } from '@mui/material'
import { FC } from 'react'

export interface PinBackProps extends BoxProps {
  background?: string
  group?: number
  radius?: number
  x?: number
  y?: number
}

/* const pinBackStyles = {
  borderRadius: '50%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'absolute',
  top: 0,
  left: 0,
  overflow: 'hidden',
  backgroundSize: 'cover',
  //transform: 'translate(-50%, -50%)',
  opacity: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
    borderRadius: '50%',
  },
} */
export const PinBack: FC<PinBackProps> = ({
  id,
  group = 1,
  background = 'red',
  radius = 50,
  x = 50,
  y = 50,
}) => {

  return (
    <g
      key={id}
      transform={`translate(${x}, ${y})`}
      className={`pin-${group}`}
      id={`pin-${id}`}
      style={{ opacity: 0 }}
    >
      <defs>
        <mask className="mask" id={`pinmask-${id}`}>
          <circle cx={radius} cy={radius} r={radius} fill="white" />
        </mask>
      </defs>
      <circle cx={radius} cy={radius} r={radius} fill="white" />
      <image
        href={background}
        mask={`url(#pinmask-${id})`}
        width={radius * 2}
        height={radius * 2}
      />
    </g>
  )
}
