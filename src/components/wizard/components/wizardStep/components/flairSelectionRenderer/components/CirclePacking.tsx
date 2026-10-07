import { FC, useEffect, useMemo, useState } from 'react'
import {
  ForceGraphProps,
  settleLayout,
  useForceGraph,
} from './circlePacking.helpers'
import { Node } from './circlePacking.types'
import { PinBack } from '@/components/pinBack/PinBack'
import { PinData } from '../flairSelectionRenderer.helpers'
import { Box, BoxProps } from '@mui/material'
import { useReducedMotion } from '@/motion/motion'

export type CirclePackingProps = ForceGraphProps &
  Omit<BoxProps, 'width' | 'height'> & {
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
  const reduced = useReducedMotion()
  // Reduced motion: the layout is settled before it's shown, not animated there.
  const settled = useMemo(
    () =>
      reduced
        ? settleLayout(data, graph.width ?? width, graph.height ?? height)
        : null,
    [reduced, data, graph.width, graph.height, width, height]
  )

  useEffect(() => {
    if (reduced) return
    const simulation = graph.initForce(data)
    simulation.on('tick', () => {
      setNodes([...simulation.nodes()])
    })
    return () => {
      simulation.stop()
    }
  }, [graph, data, reduced])

  return (
    <Box
      className="content"
      component="svg"
      width={graph.width}
      height={graph.height}
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      sx={{ overflow: 'visible', ...sx }}
      {...props}
    >
      {(settled ?? nodes).map((d) => (
        <PinBack key={d.name} data={d as PinData} />
      ))}
    </Box>
  )
}
