import { FC, useEffect, useState } from 'react'
import { ForceGraphProps, useForceGraph } from './circlePacking.helpers'
import { Node } from './circlePacking.types'
import { PinBack } from '@/components/pinBadge/PinBack'

export interface CirclePackingProps extends ForceGraphProps {
  level: number
  data: Node[]
}

export const CirclePacking: FC<CirclePackingProps> = ({
  data,
  width = 400,
  height = 10,
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
    <svg
      width={graph.width}
      height={graph.height}
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      style={{ overflow: 'visible' }}
    >
      {nodes.map((d) => (
        <PinBack key={d.name} data={d} />
      ))}
    </svg>
  )
}
