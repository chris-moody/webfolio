/**
 * Frame-time meter. Deliberately not React: it owns its DOM and its own
 * requestAnimationFrame loop, so measuring never adds renders to what it
 * measures.
 *
 * - Frame time: deltas between consecutive rAF callbacks (rolling 300 frames).
 * - Long frames: Long Animation Frames API (`long-animation-frame`) where
 *   available, with script attribution; otherwise the Long Tasks API.
 * - Engine throughput and bytes per frame come from the caller via `record()`.
 *
 * Shared by the Tape demo and the case-study point cloud, which label the
 * engine numbers differently (FrameMeterOptions).
 */

import { semanticColors } from '@/tokens'
import { themeColor } from './themeColors'
import { createTooltips, type Tooltips } from './tooltip'

const FALLBACK = semanticColors('light')

const SAMPLES = 300
const GRAPH_SAMPLES = 120
const GRAPH_HEIGHT = 64
/** The graph's ceiling: frames slower than this are drawn at full height. */
const GRAPH_MAX_MS = 50
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
    /** Exposed for the Playwright performance tests (see `exposeAs`). */
    __tapeStats?: FrameStats
    __plotStats?: FrameStats
  }
}

export interface FrameMeterOptions {
  /** Label for record()'s ticksPerSecond, and what it measures. */
  throughputLabel?: string
  throughputDescription?: string
  /** Label for record()'s bytes, and what it measures. */
  payloadLabel?: string
  payloadDescription?: string
  /** The window property the stats are published on, for tests. */
  exposeAs?: '__tapeStats' | '__plotStats'
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
  private readonly exposeAs: NonNullable<FrameMeterOptions['exposeAs']>
  private readonly tooltips: Tooltips
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

  constructor(
    root: HTMLElement,
    {
      throughputLabel = 'Trades / s',
      throughputDescription = 'Simulated trades the engine processed per second.',
      payloadLabel = 'Bytes / frame',
      payloadDescription = 'Data the worker sent the page for one frame, transferred without copying.',
      exposeAs = '__tapeStats',
    }: FrameMeterOptions = {}
  ) {
    this.exposeAs = exposeAs
    this.tooltips = createTooltips()
    root.replaceChildren()

    // What the graph shows, in words, before the graph itself.
    const heading = document.createElement('p')
    heading.className = 'text-xs text-fg-muted'
    heading.innerHTML =
      '<span class="font-semibold text-fg">Frame time</span>: how long each of the last 120 frames took to produce. ' +
      'Bars above the line missed the 16.7 ms budget for smooth 60 fps animation; red bars took over 25 ms.'

    this.canvas = document.createElement('canvas')
    this.canvas.width = GRAPH_SAMPLES * 2
    this.canvas.height = GRAPH_HEIGHT
    this.canvas.className = 'block h-16 w-full rounded bg-canvas'
    this.canvas.setAttribute('role', 'img')
    this.canvas.setAttribute(
      'aria-label',
      'Frame time graph of the last 120 frames, 0 to 50 milliseconds, with a line at the 16.7 millisecond budget'
    )
    this.context = this.canvas.getContext('2d')

    // Axes: milliseconds up the side (the budget line labelled where it
    // sits), frames along the bottom. Decorative; the canvas label and the
    // heading carry the same information.
    const graph = document.createElement('div')
    graph.className =
      'mt-1 grid grid-cols-[auto_1fr] gap-x-1.5 text-[10px] leading-none text-fg-muted tabular-nums'
    const yAxis = document.createElement('div')
    yAxis.setAttribute('aria-hidden', 'true')
    yAxis.className = 'relative w-9 text-right'
    const tick = (label: string, ms: number) => {
      const element = document.createElement('span')
      element.className = 'absolute right-0 translate-y-1/2'
      element.style.bottom = `${(ms / GRAPH_MAX_MS) * 100}%`
      element.textContent = label
      return element
    }
    yAxis.append(
      tick('50 ms', GRAPH_MAX_MS - 2.5),
      tick('16.7', BUDGET_MS),
      tick('0', 2.5)
    )
    const xAxis = document.createElement('div')
    xAxis.setAttribute('aria-hidden', 'true')
    xAxis.className = 'col-start-2 mt-1 flex justify-between'
    xAxis.innerHTML = '<span>120 frames ago</span><span>now</span>'
    graph.append(yAxis, this.canvas, xAxis)

    const list = document.createElement('dl')
    list.className =
      'mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4'
    const rows: [string, string, string][] = [
      [
        'p50',
        'Frame p50',
        'Median time between frames. 16.7 ms is a steady 60 fps.',
      ],
      [
        'p95',
        'Frame p95',
        '95% of recent frames were this fast or faster. When this rises, you feel stutter.',
      ],
      [
        'p99',
        'Frame p99',
        'The slowest 1% of recent frames: the worst hitches.',
      ],
      [
        'dropped',
        'Dropped (of 300)',
        'Of the last 300 frames (about 5 s), how many took over 1.5× the 16.7 ms budget.',
      ],
      [
        'longFrames',
        'Long frames',
        'Frames over 50 ms since the last reset, reported by the browser. Long enough to delay a click or keypress.',
      ],
      ['longestMs', 'Longest', 'The longest of those frames.'],
      ['ticksPerSecond', throughputLabel, throughputDescription],
      ['bytesPerFrame', payloadLabel, payloadDescription],
    ]
    for (const [key, label, description] of rows) {
      const group = document.createElement('div')
      const term = document.createElement('dt')
      const trigger = document.createElement('button')
      trigger.type = 'button'
      trigger.className =
        'cursor-help text-fg-muted underline decoration-dotted underline-offset-2 hover:text-fg focus-visible:text-fg'
      trigger.textContent = label
      term.append(trigger, this.tooltips.attach(trigger, description))
      const value = document.createElement('dd')
      value.className = 'font-mono text-sm tabular-nums text-fg'
      value.textContent = '–'
      group.append(term, value)
      list.append(group)
      this.values[key] = value
    }
    root.append(heading, graph, list)
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
    this.tooltips.destroy()
    if (window[this.exposeAs] === this.stats) delete window[this.exposeAs]
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
    window[this.exposeAs] = this.stats

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
    const good = themeColor('accent', FALLBACK.accent)
    const bad = themeColor('danger', FALLBACK.negative)
    const guide = themeColor('border', FALLBACK.border)
    context.clearRect(0, 0, width, height)
    // Scale: 0–50 ms; the guide line marks the 16.7 ms budget.
    const y = (ms: number) =>
      height - Math.min(ms, GRAPH_MAX_MS) * (height / GRAPH_MAX_MS)
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
