import { createRandom } from '@/lab/tape/engine/random'

/**
 * The point-cloud engine behind the density plot: synthetic data, a moving
 * camera, and binning points into a grid of counts. Pure functions on typed
 * arrays, so the same code runs in the worker and on the main thread.
 */

export interface Points {
  xs: Float32Array
  ys: Float32Array
}

/** The visible window, in data coordinates. */
export interface View {
  cx: number
  cy: number
  /** Visible width; the height follows the grid's aspect ratio. */
  span: number
}

export interface BinResult {
  /** Points that landed in the grid. */
  visible: number
  /** The largest count in any bin. */
  max: number
}

/**
 * Seeded Gaussian clusters, shaped like a scores plot of samples by group:
 * a few dense groups, some elongated, and a sparse background. Synthetic,
 * not anyone's data.
 */
export const generatePoints = (count: number, seed = 7): Points => {
  const random = createRandom(seed)
  const clusters = Array.from({ length: 14 }, () => ({
    x: (random.next() - 0.5) * 1.8,
    y: (random.next() - 0.5) * 1.8,
    sx: 0.015 + random.next() * 0.07,
    sy: 0.01 + random.next() * 0.04,
    angle: random.next() * Math.PI,
    weight: 0.3 + random.next(),
  }))
  const total = clusters.reduce((sum, c) => sum + c.weight, 0)
  const xs = new Float32Array(count)
  const ys = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    // 3% background noise across the whole field.
    if (random.next() < 0.03) {
      xs[i] = (random.next() - 0.5) * 2.4
      ys[i] = (random.next() - 0.5) * 2.4
      continue
    }
    let pick = random.next() * total
    let cluster = clusters[0]!
    for (const c of clusters) {
      pick -= c.weight
      if (pick <= 0) {
        cluster = c
        break
      }
    }
    const u = random.normal() * cluster.sx
    const v = random.normal() * cluster.sy
    const cos = Math.cos(cluster.angle)
    const sin = Math.sin(cluster.angle)
    xs[i] = cluster.x + u * cos - v * sin
    ys[i] = cluster.y + u * sin + v * cos
  }
  return { xs, ys }
}

/**
 * A slow pan-and-zoom loop, so every frame needs a fresh aggregation of
 * every point (time in seconds).
 */
export const cameraAt = (seconds: number): View => ({
  cx: 0.35 * Math.sin(seconds * 0.23),
  cy: 0.25 * Math.cos(seconds * 0.17),
  span: 2.4 * 2 ** (-1.6 * (0.5 - 0.5 * Math.cos(seconds * 0.11))),
})

/**
 * Counts points per grid cell for the view. `out` (width × height) is
 * overwritten. One pass, no allocation: this is the hot loop.
 */
export const binPoints = (
  { xs, ys }: Points,
  view: View,
  width: number,
  height: number,
  out: Uint32Array
): BinResult => {
  out.fill(0)
  const spanY = (view.span * height) / width
  const x0 = view.cx - view.span / 2
  const y0 = view.cy - spanY / 2
  const sx = width / view.span
  const sy = height / spanY
  let visible = 0
  let max = 0
  for (let i = 0; i < xs.length; i++) {
    const fx = (xs[i]! - x0) * sx
    if (fx < 0 || fx >= width) continue
    const fy = (ys[i]! - y0) * sy
    if (fy < 0 || fy >= height) continue
    // Row 0 is the top of the canvas; data y grows upward.
    const index = (height - 1 - (fy | 0)) * width + (fx | 0)
    const count = ++out[index]!
    if (count > max) max = count
    visible++
  }
  return { visible, max }
}
