import { data as palette } from '@/tokens'
import { BaseEdge, getSmoothStepPath, EdgeProps } from '@xyflow/react'

export interface SocketEdgeProps extends EdgeProps {
  color?: string
  duration?: number
  data: {
    color?: string
  }
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
}: SocketEdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const { color = palette.pink } = data

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle id={'signal-' + id} r="10" fill={color} />
    </>
  )
}
