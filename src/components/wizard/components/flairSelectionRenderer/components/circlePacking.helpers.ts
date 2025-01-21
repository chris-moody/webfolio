import * as d3 from 'd3'
import { Node } from './circlePacking.types'

export interface ForceGraphProps {
  width: number
  height: number
}

export interface ForceGraph extends ForceGraphProps {
  force: d3.Simulation<Node, undefined>
  initForce: (nodes: Node[]) => d3.Simulation<Node, undefined>
}

export const useForceGraph = ({
  width = 400,
  height = 400,
}: ForceGraphProps) => {
  const graph: ForceGraph = {} as ForceGraph

  const initForce = (data: Node[]): d3.Simulation<Node, undefined> => {
    d3.select('svg')
      .selectAll('.pin')
      .data(data, (d) => (d as Node)?.name)

    return d3
      .forceSimulation(data)
      .force(
        'collide',
        d3.forceCollide().radius((d) => ((d as Node).value))
      )
      .force('charge', d3.forceManyBody().strength(2))
      .force('center', d3.forceCenter(graph.width / 2, graph.height / 2))
  }

  graph.width = width
  graph.height = height
  graph.initForce = initForce

  return graph
}
