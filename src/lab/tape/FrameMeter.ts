/**
 * Frame-time meter. Deliberately not React: it owns its DOM and its own
 * requestAnimationFrame loop, so measuring never adds renders to what it
 * measures.
 *
 * - Frame time: deltas between consecutive rAF callbacks (rolling 300 frames).
 * - Long frames: Long Animation Frames API (`long-animation-frame`) where
 *   available, with script attribution; otherwise the Long Tasks API.
 * - Engine throughput and bytes per frame come from the store via `record()`.
 */

import { themeColor } from './themeColors'

const SAMPLES = 300
const GRAPH_SAMPLES = 120
const BUDGET_MS = 1000 / 60

export interface FrameStats {
  frames: number
  p50: number
  p95: number
  p99: number
  /** Frames slower than 1.5 × 16.7 ms in the sample window. */
  dropped: number
  /** Long animation frames (or long tasks) > 50 ms since the last reset. */
  longFrames: number
  longestMs: number
  longSource: string
  ticksPerSecond: number
  bytesPerFrame: number
  engineTickMs: number
  engineSortMs: number
  api: 'long-animation-frame' | 'longtask' | 'none'
}

declare global {
  interface Window {
    /** Exposed for the Playwright performance smoke test. */
    __tapeStats?: FrameStats
  }
}

const percentile = (sorted: Float64Array, p: number) =>
  sorted.length
    ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]!
    : 0

interface LongAnimationFrameEntry extends PerformanceEntry {
  scripts?: { sourceURL?: string; invoker?: string; duration: number }[]
}

export class FrameMeter {
  private readonly deltas = new Float64Array(SAMPLES)
  private count = 0
  private cursor = 0
  private last = 0
  private raf = 0
  private observer: PerformanceObserver | null = null
  private readonly canvas: HTMLCanvasElement
  private readonly context: CanvasRenderingContext2D | null
  private readonly values: Record<string, HTMLElement> = {}
  private lastText = 0
  private readonly stats: FrameStats = {
    frames: 0,
    p50: 0,
    p95: 0,
    p99: 0,
    dropped: 0,
    longFrames: 0,
    longestMs: 0,
    longSource: '',
    ticksPerSecond: 0,
    bytesPerFrame: 0,
    engineTickMs: 0,
    engineSortMs: 0,
    api: 'none',
  }

  constructor(root: HTMLElement) {
    root.replaceChildren()
    this.canvas = document.createElement('canvas')
    this.canvas.width = GRAPH_SAMPLES * 2
    this.canvas.height = 48
    this.canvas.className = 'h-12 w-full rounded bg-canvas'
    this.canvas.setAttribute('role', 'img')
    this.canvas.setAttribute(
      'aria-label',
      'Frame time graph for the last two seconds'
    )
    this.context = this.canvas.getContext('2d')

    const list = document.createElement('dl')
    list.className =
      'mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4'
    const rows: [string, string][] = [
      ['p50', 'Frame p50'],
      ['p95', 'Frame p95'],
      ['p99', 'Frame p99'],
      ['dropped', 'Dropped (of 300)'],
      ['longFrames', 'Long frames'],
      ['longestMs', 'Longest'],
      ['ticksPerSecond', 'Trades / s'],
      ['bytesPerFrame', 'Bytes / frame'],
    ]
    for (const [key, label] of rows) {
      const group = document.createElement('div')
      const term = document.createElement('dt')
      term.className = 'text-fg-muted'
      term.textContent = label
      const value = document.createElement('dd')
      value.className = 'font-mono text-sm tabular-nums text-fg'
      value.textContent = '–'
      group.append(term, value)
      list.append(group)
      this.values[key] = value
    }
    root.append(this.canvas, list)
  }

  start() {
    this.observeLongFrames()
    const loop = (now: number) => {
      if (this.last) this.sample(now - this.last)
      this.last = now
      if (now - this.lastText > 250) {
        this.lastText = now
        this.summarize()
        this.paint()
      }
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  /** Engine-side numbers, reported by the store with each frame. */
  record(engine: {
    ticksPerSecond: number
    bytes: number
    tickMs: number
    sortMs: number
  }) {
    this.stats.ticksPerSecond = engine.ticksPerSecond
    this.stats.bytesPerFrame = engine.bytes
    this.stats.engineTickMs = engine.tickMs
    this.stats.engineSortMs = engine.sortMs
  }

  /** Clears samples, e.g. after switching modes, so numbers reflect the new setup. */
  reset() {
    this.count = 0
    this.cursor = 0
    this.last = 0
    this.stats.longFrames = 0
    this.stats.longestMs = 0
    this.stats.longSource = ''
  }

  stop() {
    cancelAnimationFrame(this.raf)
    this.observer?.disconnect()
    if (window.__tapeStats === this.stats) delete window.__tapeStats
  }

  private sample(delta: number) {
    this.deltas[this.cursor] = delta
    this.cursor = (this.cursor + 1) % SAMPLES
    this.count = Math.min(this.count + 1, SAMPLES)
    this.stats.frames++
  }

  private observeLongFrames() {
    const supported = PerformanceObserver.supportedEntryTypes ?? []
    const type = supported.includes('long-animation-frame')
      ? 'long-animation-frame'
      : supported.includes('longtask')
        ? 'longtask'
        : null
    if (!type) return
    this.stats.api = type
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LongAnimationFrameEntry[]) {
        if (entry.duration <= 50) continue
        this.stats.longFrames++
        if (entry.duration > this.stats.longestMs) {
          this.stats.longestMs = entry.duration
          const script = entry.scripts
            ?.slice()
            .sort((a, b) => b.duration - a.duration)[0]
          this.stats.longSource = script
            ? `${script.invoker ?? ''} ${script.sourceURL?.split('/').pop() ?? ''}`.trim()
            : ''
        }
      }
    })
    this.observer.observe({ type, buffered: false })
  }

  private summarize() {
    const window_ = this.deltas.slice(0, this.count).sort()
    this.stats.p50 = percentile(window_, 0.5)
    this.stats.p95 = percentile(window_, 0.95)
    this.stats.p99 = percentile(window_, 0.99)
    let dropped = 0
    for (const delta of window_) if (delta > BUDGET_MS * 1.5) dropped++
    this.stats.dropped = dropped
    window.__tapeStats = this.stats

    const ms = (value: number) => `${value.toFixed(1)} ms`
    this.text('p50', ms(this.stats.p50))
    this.text('p95', ms(this.stats.p95))
    this.text('p99', ms(this.stats.p99))
    this.text('dropped', String(dropped))
    this.text('longFrames', String(this.stats.longFrames))
    this.text(
      'longestMs',
      this.stats.longestMs ? ms(this.stats.longestMs) : '–'
    )
    this.text('ticksPerSecond', this.stats.ticksPerSecond.toLocaleString())
    this.text('bytesPerFrame', this.stats.bytesPerFrame.toLocaleString())
  }

  private text(key: string, value: string) {
    const element = this.values[key]
    if (element && element.textContent !== value) element.textContent = value
  }

  private paint() {
    const context = this.context
    if (!context) return
    const { width, height } = this.canvas
    const good = themeColor('accent', '#1f5fc7')
    const bad = themeColor('danger', '#c0262d')
    const guide = themeColor('border', '#d5d9e0')
    context.clearRect(0, 0, width, height)
    // Scale: 0–50 ms; the guide line marks the 16.7 ms budget.
    const y = (ms: number) => height - Math.min(ms, 50) * (height / 50)
    context.fillStyle = guide
    context.fillRect(0, y(BUDGET_MS), width, 1)
    const bars = Math.min(this.count, GRAPH_SAMPLES)
    const barWidth = width / GRAPH_SAMPLES
    for (let i = 0; i < bars; i++) {
      const index = (this.cursor - bars + i + SAMPLES) % SAMPLES
      const delta = this.deltas[index]!
      context.fillStyle = delta > BUDGET_MS * 1.5 ? bad : good
      context.fillRect(
        i * barWidth,
        y(delta),
        Math.max(1, barWidth - 1),
        height - y(delta)
      )
    }
  }
}
