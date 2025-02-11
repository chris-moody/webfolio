import {
  ReactFlow,
  useEdgesState,
  useNodesState,
  Background,
  ReactFlowInstance,
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { SocketEdge } from './components/SocketEdge'
import { SocketNode } from './components/SocketNode'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTheme } from '@mui/material'

const initialNodes: Node[] = [
  {
    id: 'r1',
    position: { x: 16, y: 16 },
    data: { label: 'Remote 1' },
    type: 'socketNode',
  },
  {
    id: 'r2',
    position: { x: 276, y: 32 },
    data: { label: 'Remote 2' },
    type: 'socketNode',
  },
  {
    id: 's1',
    position: { x: 260, y: 368 },
    data: { label: 'Screen 1' },
    type: 'socketNode',
  },
  {
    id: 's2',
    position: { x: 0, y: 384 },
    data: { label: 'Screen 2' },
    type: 'socketNode',
  },
]
const initialEdges: Edge[] = [
  {
    id: 'r1-s1',
    source: 'r1',
    target: 's1',
    data: { begin: 0, color: 'yellow' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-l',
    targetHandle: 'target-top-l',
  },
  {
    id: 'r1-s2',
    source: 'r1',
    target: 's2',
    data: { begin: 0, color: 'magenta' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-r',
    targetHandle: 'target-top-l',
  },
  {
    id: 'r2-s1',
    source: 'r2',
    target: 's1',
    data: { begin: 1, color: 'cyan' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-l',
    targetHandle: 'target-top-r',
  },
  {
    id: 'r2-s2',
    source: 'r2',
    target: 's2',
    data: { begin: 1, color: 'orange' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-r',
    targetHandle: 'target-top-r',
  },
]

export const SocketFlow = () => {
  const theme = useTheme()
  const container = useRef(null)
  const [instance, setInstance] = useState<ReactFlowInstance>()
  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)

  const onInit = (instance: ReactFlowInstance) => {
    setInstance(instance)
  }

  useGSAP(
    () => {
      if (!instance) return

      gsap.delayedCall(1, () => instance.fitView({ duration: 1000, minZoom: 0.0875 }))
    },
    { dependencies: [instance] }
  )

  useGSAP(
    () => {
      const duration = 0
      gsap.to('#s1', {
        duration,
        backgroundColor: '#FFFF00',
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      })
      gsap.to('#s1 .label', {
        duration,
        color: theme.palette.getContrastText('#FFFF00'),
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      })
      gsap.to('#s1', {
        duration,
        backgroundColor: '#00FFFF',
        color: theme.palette.getContrastText('#00FFFF'),
        repeat: -1,
        delay: 3,
        repeatDelay: 2,
      })
      gsap.to('#s1 .label', {
        duration,
        color: theme.palette.getContrastText('#00FFFF'),
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      })
      gsap.to('#s2', {
        duration,
        backgroundColor: '#FF00FF',
        color: theme.palette.getContrastText('#FF00FF'),
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      })
      gsap.to('#s2 .label', {
        duration,
        color: theme.palette.getContrastText('#FF00FF'),
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      })
      gsap.to('#s2', {
        duration,
        backgroundColor: '#ff8800',
        color: theme.palette.getContrastText('#ff8800'),
        repeat: -1,
        delay: 3,
        repeatDelay: 2,
      })
      gsap.to('#s2 .label', {
        duration,
        color: theme.palette.getContrastText('#ff8800'),
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      })
    },
    { dependencies: [], scope: container }
  )

  return (
    <ReactFlow
      ref={container}
      onInit={onInit}
      nodes={nodes}
      edges={edges}
      edgeTypes={{
        socketEdge: SocketEdge,
      }}
      nodeTypes={{
        socketNode: SocketNode,
      }}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
    >
      <Background />
    </ReactFlow>
  )
}
