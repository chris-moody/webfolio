/// <reference lib="webworker" />
import { binPoints, generatePoints, type Points } from './engine'
import type { DensityRequest, DensityResponse } from './protocol'

// The worker owns the points. The page only ever receives a grid of counts
// (width × height), whatever the number of points.

declare const self: DedicatedWorkerGlobalScope

let points: Points | null = null

const post = (message: DensityResponse, transfer: Transferable[] = []) =>
  self.postMessage(message, transfer)

self.onmessage = ({ data }: MessageEvent<DensityRequest>) => {
  if (data.type === 'init') {
    const start = performance.now()
    points = generatePoints(data.count, data.seed)
    post({
      type: 'ready',
      count: data.count,
      generateMs: performance.now() - start,
    })
    return
  }
  if (!points) return
  const { view, width, height, buffer } = data
  const grid =
    buffer.byteLength === width * height * 4
      ? new Uint32Array(buffer)
      : new Uint32Array(width * height)
  const start = performance.now()
  const result = binPoints(points, view, width, height, grid)
  post(
    {
      type: 'bins',
      result,
      width,
      height,
      buffer: grid.buffer,
      binMs: performance.now() - start,
    },
    [grid.buffer]
  )
}
