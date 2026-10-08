import { describe, expect, it } from 'vitest'
import { binPoints, cameraAt, generatePoints, type Points } from './engine'

const points = (coords: [number, number][]): Points => ({
  xs: Float32Array.from(coords.map(([x]) => x)),
  ys: Float32Array.from(coords.map(([, y]) => y)),
})

describe('density engine', () => {
  it('generates the same points for the same seed', () => {
    const a = generatePoints(1000, 3)
    const b = generatePoints(1000, 3)
    expect(a.xs).toEqual(b.xs)
    expect(a.ys).toEqual(b.ys)
    expect(generatePoints(1000, 4).xs).not.toEqual(a.xs)
  })

  it('counts each visible point once, with data y pointing up', () => {
    // A 4 × 2 grid over x ∈ [-1, 1), y ∈ [-0.5, 0.5).
    const grid = new Uint32Array(8)
    const result = binPoints(
      points([
        [-0.9, 0.4], // top-left cell
        [-0.9, 0.4],
        [0.9, -0.4], // bottom-right cell
        [5, 0], // outside
        [0, -5], // outside
      ]),
      { cx: 0, cy: 0, span: 2 },
      4,
      2,
      grid
    )
    expect(result).toEqual({ visible: 3, max: 2 })
    expect([...grid]).toEqual([2, 0, 0, 0, 0, 0, 0, 1])
  })

  it('clears the grid it reuses', () => {
    const grid = new Uint32Array(8).fill(9)
    binPoints(points([]), { cx: 0, cy: 0, span: 2 }, 4, 2, grid)
    expect([...grid]).toEqual(new Array(8).fill(0))
  })

  it('accounts for every point when the view covers them all', () => {
    const data = generatePoints(20_000, 1)
    const grid = new Uint32Array(64 * 40)
    const { visible } = binPoints(
      data,
      { cx: 0, cy: 0, span: 10 },
      64,
      40,
      grid
    )
    expect(visible).toBe(20_000)
    expect(grid.reduce((sum, count) => sum + count, 0)).toBe(20_000)
  })

  it('moves the camera smoothly and stays zoomed into the data', () => {
    for (let t = 0; t < 120; t += 0.5) {
      const view = cameraAt(t)
      expect(view.span).toBeGreaterThan(0.7)
      expect(view.span).toBeLessThanOrEqual(2.4)
      const next = cameraAt(t + 1 / 60)
      expect(Math.abs(next.cx - view.cx)).toBeLessThan(0.01)
    }
  })
})
