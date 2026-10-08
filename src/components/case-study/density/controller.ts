import type { FrameMeter } from '@/lab/perf/FrameMeter'
import { themeColor } from '@/lab/perf/themeColors'
import { semanticColors } from '@/tokens'
import {
  binPoints,
  type BinResult,
  cameraAt,
  generatePoints,
  type Points,
} from './engine'
import type { DensityRequest, DensityResponse } from './protocol'

export type Where = 'worker' | 'main'

const SEED = 7
const FALLBACK_ACCENT = semanticColors('light').accent

/** The accent token as RGB, by drawing it once into a 1×1 canvas. */
const accentRgb = (): [number, number, number] => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return [37, 99, 235]
  context.fillStyle = themeColor('accent', FALLBACK_ACCENT)
  context.fillRect(0, 0, 1, 1)
  const [r = 37, g = 99, b = 235] = context.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

/**
 * Drives the density plot outside React: the camera, the aggregation (in a
 * worker or on the main thread), and painting. The frame meter watches the
 * same requestAnimationFrame loop the page uses, so blocking work shows up
 * as long frames.
 */
export class DensityController {
  private readonly context: CanvasRenderingContext2D | null
  private readonly image: ImageData
  private readonly pixels: Uint32Array
  private readonly width: number
  private readonly height: number
  private raf = 0
  private seconds = 0
  private lastNow = 0
  private dirty = true

  private where: Where
  private count: number
  private playing: boolean

  // Main-thread state.
  private points: Points | null = null
  private grid: Uint32Array

  // Worker state.
  private worker: Worker | null = null
  private workerReady = false
  private inFlight = false
  private spare: ArrayBuffer | null = null

  private palette = new Uint32Array(256)
  private paletteKey = ''

  private last: BinResult = { visible: 0, max: 0 }
  private lastBinMs = 0
  private scanned = 0
  private statusAt = 0

  constructor(
    canvas: HTMLCanvasElement,
    private readonly status: HTMLElement,
    private readonly meter: FrameMeter,
    options: { where: Where; count: number; playing: boolean }
  ) {
    this.where = options.where
    this.count = options.count
    this.playing = options.playing
    this.width = canvas.width
    this.height = canvas.height
    this.context = canvas.getContext('2d')
    this.image = new ImageData(this.width, this.height)
    this.pixels = new Uint32Array(this.image.data.buffer)
    this.grid = new Uint32Array(this.width * this.height)
    this.prepare()
  }

  start() {
    const loop = (now: number) => {
      const dt = this.lastNow ? Math.min(now - this.lastNow, 100) : 0
      this.lastNow = now
      if (this.playing) {
        this.seconds += dt / 1000
        this.dirty = true
      }
      if (this.dirty) this.frame()
      this.report(now)
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  setWhere(where: Where) {
    if (where === this.where) return
    this.where = where
    this.prepare()
  }

  setCount(count: number) {
    if (count === this.count) return
    this.count = count
    this.points = null
    this.workerReady = false
    this.prepare()
  }

  setPlaying(playing: boolean) {
    this.playing = playing
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.worker?.terminate()
    this.worker = null
  }

  /** Generates the points where they'll be aggregated (once per count). */
  private prepare() {
    this.dirty = true
    this.meter.reset()
    this.setStatus('Generating points…')
    if (this.where === 'main') {
      // Blocking on purpose: in this mode the main thread owns the data.
      if (!this.points) this.points = generatePoints(this.count, SEED)
      return
    }
    if (!this.worker) {
      this.worker = new Worker(
        new URL('./density.worker.ts', import.meta.url),
        { type: 'module', name: 'density' }
      )
      this.worker.onmessage = ({ data }: MessageEvent<DensityResponse>) =>
        this.receive(data)
    }
    if (!this.workerReady) {
      this.inFlight = false
      this.send({ type: 'init', count: this.count, seed: SEED })
    }
  }

  private send(message: DensityRequest, transfer: Transferable[] = []) {
    this.worker?.postMessage(message, transfer)
  }

  private receive(message: DensityResponse) {
    if (message.type === 'ready') {
      if (message.count === this.count) {
        this.workerReady = true
        this.dirty = true
      }
      return
    }
    this.inFlight = false
    this.spare = message.buffer
    // A late reply after switching to the main thread: drop it.
    if (this.where !== 'worker') return
    if (message.width !== this.width || message.height !== this.height) return
    this.last = message.result
    this.lastBinMs = message.binMs
    this.scanned += this.count
    this.paint(new Uint32Array(message.buffer), message.result.max)
  }

  private frame() {
    const view = cameraAt(this.seconds)
    if (this.where === 'main') {
      if (!this.points) return
      const start = performance.now()
      this.last = binPoints(
        this.points,
        view,
        this.width,
        this.height,
        this.grid
      )
      this.lastBinMs = performance.now() - start
      this.scanned += this.count
      this.paint(this.grid, this.last.max)
      this.dirty = false
      return
    }
    // Worker: one request in flight; the reply paints when it lands.
    if (!this.workerReady || this.inFlight) return
    const buffer = this.spare ?? new ArrayBuffer(this.width * this.height * 4)
    this.spare = null
    this.inFlight = true
    this.dirty = false
    this.send(
      { type: 'bin', view, width: this.width, height: this.height, buffer },
      [buffer]
    )
  }

  private updatePalette() {
    const key = `${document.documentElement.className}|${themeColor('accent', '')}`
    if (key === this.paletteKey) return
    this.paletteKey = key
    const [r, g, b] = accentRgb()
    // Alpha ramps up with density; the canvas background shows through.
    for (let i = 0; i < 256; i++) {
      const alpha = i === 0 ? 0 : Math.round(48 + (207 * i) / 255)
      // ImageData is RGBA in memory; little-endian Uint32 reads it as ABGR.
      this.palette[i] = ((alpha << 24) | (b << 16) | (g << 8) | r) >>> 0
    }
  }

  private paint(grid: Uint32Array, max: number) {
    if (!this.context) return
    this.updatePalette()
    const scale = max > 0 ? 255 / Math.log1p(max) : 0
    const { pixels, palette } = this
    for (let i = 0; i < grid.length; i++) {
      const count = grid[i]!
      pixels[i] = count
        ? palette[Math.max(1, (Math.log1p(count) * scale) | 0)]!
        : 0
    }
    this.context.putImageData(this.image, 0, 0)
  }

  private report(now: number) {
    if (now - this.statusAt < 250) return
    const seconds = this.statusAt ? (now - this.statusAt) / 1000 : 0
    const perSecond = seconds ? Math.round(this.scanned / seconds) : 0
    this.scanned = 0
    this.statusAt = now
    this.meter.record({
      ticksPerSecond: perSecond,
      bytes: this.where === 'worker' ? this.width * this.height * 4 : 0,
      tickMs: this.lastBinMs,
      sortMs: 0,
    })
    if (this.where === 'worker' && !this.workerReady) return
    if (this.where === 'main' && !this.points) return
    this.setStatus(
      `${this.count.toLocaleString()} points, ${this.last.visible.toLocaleString()} in view. ` +
        `Aggregated in ${this.lastBinMs.toFixed(1)} ms on the ${this.where === 'worker' ? 'worker' : 'main thread'}.`
    )
  }

  private setStatus(text: string) {
    if (this.status.textContent !== text) this.status.textContent = text
  }
}
