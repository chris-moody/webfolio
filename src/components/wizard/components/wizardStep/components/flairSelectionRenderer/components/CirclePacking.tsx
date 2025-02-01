import { FC, useEffect, useState } from 'react'
import { ForceGraphProps, useForceGraph } from './circlePacking.helpers'
import { Node } from './circlePacking.types'
import { PinBack } from '@/components/pinBack/PinBack'
import { PinData } from '../flairSelectionRenderer.helpers'
import { Box, BoxProps } from '@mui/material'

export type CirclePackingProps = ForceGraphProps & Omit<BoxProps, 'width' | 'height'> & {
  level: number
  data: Node[]
}

export const CirclePacking: FC<CirclePackingProps> = ({
  data,
  width = 400,
  height = 10,
  sx,
  ...props
}) => {
  const graph = useForceGraph({ width, height })
  const [nodes, setNodes] = useState<Node[]>(data)

  useEffect(() => {
    const simulation = graph.initForce(data)
    simulation.on('tick', () => {
      setNodes([...simulation.nodes()])
    })
  }, [graph, data])

  return (
    <Box
      className='content'
      component='svg'
      width={graph.width}
      height={graph.height}
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      sx={{ overflow: 'visible', ...sx }}
      {...props}
    >
      {nodes.map((d) => (
        <PinBack key={d.name} data={d as PinData} />
      ))}
    </Box>
  )
}
