import * as d3 from 'd3'
import { Node } from './circlePacking.types'

export interface ForceGraphProps {
  width?: number
  height?: number
}

export interface ForceGraph extends ForceGraphProps {
  force: d3.Simulation<Node, undefined>
  initForce: (nodes: Node[]) => d3.Simulation<Node, undefined>
}

/** The pin layout's forces: collide by radius, gentle attraction, centered. */
export const createSimulation = (data: Node[], width: number, height: number) =>
  d3
    .forceSimulation(data)
    .force(
      'collide',
      d3.forceCollide().radius((d) => (d as Node).value)
    )
    .force('charge', d3.forceManyBody().strength(2))
    .force('center', d3.forceCenter(width / 2, height / 2))

/** Runs the simulation to rest without animating (reduced motion). */
export const settleLayout = (
  data: Node[],
  width: number,
  height: number
): Node[] => {
  const nodes = data.map((node) => ({ ...node }))
  const simulation = createSimulation(nodes, width, height).stop()
  simulation.tick(300)
  return simulation.nodes()
}

export const useForceGraph = ({
  width = 400,
  height = 400,
}: ForceGraphProps) => {
  const graph: ForceGraph = {} as ForceGraph

  const initForce = (data: Node[]): d3.Simulation<Node, undefined> =>
    createSimulation(data, graph.width || width, graph.height || height)

  graph.width = width
  graph.height = height
  graph.initForce = initForce

  return graph
}
