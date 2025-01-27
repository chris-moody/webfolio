export interface Node extends d3.SimulationNodeDatum {
  name: string
  group: string
  value: number
  willRender?: boolean
  r?: number
  x?: number
  y?: number
}