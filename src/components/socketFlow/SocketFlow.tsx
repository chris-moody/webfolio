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
import { useReducedMotion } from '@/motion/motion'

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
    data: { color: 'yellow' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-l',
    targetHandle: 'target-top-l',
  },
  {
    id: 'r1-s2',
    source: 'r1',
    target: 's2',
    data: { color: 'magenta' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-r',
    targetHandle: 'target-top-l',
  },
  {
    id: 'r2-s1',
    source: 'r2',
    target: 's1',
    data: { color: 'cyan' },
    type: 'socketEdge',
    sourceHandle: 'source-bot-l',
    targetHandle: 'target-top-r',
  },
  {
    id: 'r2-s2',
    source: 'r2',
    target: 's2',
    data: { color: 'orange' },
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
  const reduced = useReducedMotion()

  const onInit = (instance: ReactFlowInstance) => {
    setInstance(instance)
  }

  useGSAP(
    () => {
      if (!instance) return

      // Fit once, without animating it when motion is reduced.
      gsap.delayedCall(reduced ? 0 : 1, () =>
        instance.fitView({ duration: reduced ? 0 : 1000, minZoom: 0.0875 })
      )
      // The signal animation loops forever; reduced motion shows the static diagram.
      if (reduced) return

      const duration = 2
      const tl = gsap.timeline({ paused: true })

      tl.set(
        '#r1',
        {
          backgroundColor: '#FFFF00',
          repeat: -1,
          repeatDelay: 2,
        },
        0
      )
      tl.set(
        '#r1 .label',
        {
          color: theme.palette.getContrastText('#FFFF00'),
          repeat: -1,
          repeatDelay: 2,
        },
        0
      )
      tl.set(
        '#r2',
        {
          backgroundColor: '#ff8800',
          color: theme.palette.getContrastText('#ff8800'),
          repeat: -1,
          repeatDelay: 2,
        },
        0
      )
      tl.set(
        '#r2 .label',
        {
          color: theme.palette.getContrastText('#ff8800'),
          repeat: -1,
          repeatDelay: 2,
        },
        0
      )
      tl.set(
        '#r1',
        {
          backgroundColor: '#FF00FF',
          color: theme.palette.getContrastText('#FF00FF'),
          repeat: -1,
          repeatDelay: 2,
        },
        1
      )
      tl.set(
        '#r1 .label',
        {
          color: theme.palette.getContrastText('#FF00FF'),
          repeat: -1,
          repeatDelay: 2,
        },
        1
      )
      tl.set(
        '#r2',
        {
          backgroundColor: '#00FFFF',
          color: theme.palette.getContrastText('#00FFFF'),
          repeat: -1,
          repeatDelay: 2,
        },
        1
      )
      tl.set(
        '#r2 .label',
        {
          color: theme.palette.getContrastText('#00FFFF'),
          repeat: -1,
          repeatDelay: 2,
        },
        1
      )

      tl.to(
        '#signal-r1-s1',
        {
          duration,
          motionPath: {
            path: '#r1-s1',
          },
          repeat: -1,
          ease: 'none',
        },
        0
      )
      tl.to(
        '#signal-r1-s2',
        {
          duration,
          motionPath: {
            path: '#r1-s2',
          },
          repeat: -1,
          ease: 'none',
        },
        1
      )
      tl.to(
        '#signal-r2-s1',
        {
          duration,
          motionPath: {
            path: '#r2-s1',
          },
          repeat: -1,
          ease: 'none',
        },
        1
      )
      tl.to(
        '#signal-r2-s2',
        {
          duration,
          motionPath: {
            path: '#r2-s2',
          },
          repeat: -1,
          ease: 'none',
        },
        0
      )

      tl.set(
        '#s1',
        {
          backgroundColor: '#FFFF00',
          repeat: -1,
          repeatDelay: 2,
        },
        2
      )
      tl.set(
        '#s1 .label',
        {
          color: theme.palette.getContrastText('#FFFF00'),
          repeat: -1,
          repeatDelay: 2,
        },
        2
      )
      tl.set(
        '#s1',
        {
          backgroundColor: '#00FFFF',
          color: theme.palette.getContrastText('#00FFFF'),
          repeat: -1,
          repeatDelay: 2,
        },
        3
      )
      tl.set(
        '#s1 .label',
        {
          color: theme.palette.getContrastText('#00FFFF'),
          repeat: -1,
          repeatDelay: 2,
        },
        2
      )
      tl.set(
        '#s2',
        {
          backgroundColor: '#FF00FF',
          color: theme.palette.getContrastText('#FF00FF'),
          repeat: -1,
          repeatDelay: 2,
        },
        3
      )
      tl.set(
        '#s2 .label',
        {
          color: theme.palette.getContrastText('#FF00FF'),
          repeat: -1,
          repeatDelay: 2,
        },
        3
      )
      tl.set(
        '#s2',
        {
          backgroundColor: '#ff8800',
          color: theme.palette.getContrastText('#ff8800'),
          repeat: -1,
          repeatDelay: 2,
        },
        2
      )
      tl.set(
        '#s2 .label',
        {
          color: theme.palette.getContrastText('#ff8800'),
          repeat: -1,
          repeatDelay: 2,
        },
        2
      )
      tl.play()
    },
    {
      dependencies: [instance, reduced],
      scope: container,
      revertOnUpdate: true,
    }
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
