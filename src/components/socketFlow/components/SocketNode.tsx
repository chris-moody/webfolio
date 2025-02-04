import { Box, Typography, useTheme } from '@mui/material'
import { Handle, NodeProps, Position } from '@xyflow/react'

const NODE_W = 200
const NDOE_H = 50

export interface SocketNodeProps {
  id: string,
  data: {
    label: string
    color?: string
  },
  position: {
    x: number
    y: number
  }

  width?: number;

  height?: number;

  sourcePosition?: Position;

  targetPosition?: Position;

  dragHandle?: string;

  parentId?: string;

}

export const SocketNode = ({
  id,
  data,
}: NodeProps<SocketNodeProps>) => {
  const color = data.color || '#ff0073'
  const theme = useTheme()
  return (
    <Box
      id={id}
      className="socketNode"
      sx={{ bgcolor: color, width: NODE_W, height: NDOE_H, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      <Handle
        id="source-top-l"
        type="source"
        position={Position.Top}
        style={{
          [Position.Top]: 0,
          left: NODE_W * 0.25,
        }}
      />
      <Handle
        id="source-top-r"
        type="source"
        position={Position.Top}
        style={{
          [Position.Top]: 0,
          left: NODE_W * 0.75,
        }}
      />
      <Handle
        id="source-bot-l"
        type="source"
        position={Position.Bottom}
        style={{
          [Position.Bottom]: 0,
          left: NODE_W * 0.25,
        }}
      />
      <Handle
        id="source-bot-r"
        type="source"
        position={Position.Bottom}
        style={{
          [Position.Bottom]: 0,
          left: NODE_W * 0.75,
        }}
      />
      <Handle
        id="target-top-l"
        type="target"
        position={Position.Top}
        style={{
          [Position.Top]: 0,
          left: NODE_W * 0.25,
        }}
      />
      <Handle
        id="target-top-r"
        type="target"
        position={Position.Top}
        style={{
          [Position.Top]: 0,
          left: NODE_W * 0.75,
        }}
      />
      <Handle
        id="target-bot-l"
        type="target"
        position={Position.Bottom}
        style={{
          [Position.Bottom]: 0,
          left: NODE_W * 0.25,
        }}
      />
      <Handle
        id="target-bot-r"
        type="target"
        position={Position.Bottom}
        style={{
          [Position.Bottom]: 0,
          left: NODE_W * 0.75,
        }}
      />

      <Typography variant="h3" color={theme.palette.common.black}>{data.label}</Typography>
    </Box>
  )
}
