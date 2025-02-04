import { BaseEdge, getSmoothStepPath, EdgeProps } from '@xyflow/react'

export interface SocketEdgeProps extends EdgeProps {
  color?: string
  duration?: number
  data: {
    color?: string
    begin?: number
  },
}

export function SocketEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  duration = 2,
}: SocketEdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const { color = '#ff0073', begin = 0 } = data

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="10" fill={color}>
        <animateMotion dur={`${duration}s`} begin={`${begin}s`} repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
}
