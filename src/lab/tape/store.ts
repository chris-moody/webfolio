import type { TapeConfig, WindowFrame } from './engine/protocol'
import type { TapeQuery } from './engine/query'
import {
  createMainThreadHost,
  createWorkerHost,
  type EngineHost,
  type HostMode,
} from './hosts'

export interface TapeSnapshot {
  frame: WindowFrame | null
  symbols: string[]
  mode: HostMode
  config: TapeConfig
  paused: boolean
}

type Listener = () => void

/**
 * Bridges the engine host and React. A requestAnimationFrame loop pulls the
 * visible window, at most one request in flight (backpressure: a slow engine
 * lowers the update rate instead of queueing frames). React reads snapshots
 * through useSyncExternalStore.
 */
export class TapeStore {
  private host: EngineHost | null = null
  private snapshot: TapeSnapshot
  private listeners = new Set<Listener>()
  private viewport = { start: 0, end: 60 }
  private inFlight = false
  private raf = 0
  private generation = 0
  private query: TapeQuery = { sort: null, filter: '' }
  /** Called with each frame, outside React (the frame meter listens here). */
  private onFrame: ((frame: WindowFrame) => void) | null = null

  // Construction has no side effects (safe in a useState initializer); the
  // worker starts in start() and stops in dispose(), and the pair can repeat.
  constructor(config: TapeConfig, mode: HostMode = 'worker') {
    this.snapshot = { frame: null, symbols: [], mode, config, paused: false }
  }

  setFrameListener(listener: ((frame: WindowFrame) => void) | null) {
    this.onFrame = listener
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = () => this.snapshot

  private set(patch: Partial<TapeSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch }
    for (const listener of this.listeners) listener()
  }

  async start() {
    this.host = createHost(this.snapshot.mode)
    this.inFlight = false
    await this.configure(this.snapshot.config)
    const loop = () => {
      this.raf = requestAnimationFrame(loop)
      this.pull()
    }
    this.raf = requestAnimationFrame(loop)
  }

  private pull() {
    const { host, generation } = this
    if (!host || this.inFlight || !this.snapshot.symbols.length) return
    this.inFlight = true
    host
      .pull(this.viewport.start, this.viewport.end)
      .then((frame) => {
        // Drop frames from a replaced host or an older configuration.
        if (host !== this.host || frame.generation !== generation) return
        this.onFrame?.(frame)
        // Most animation frames carry no new data (packets arrive every 50 ms);
        // publishing identical frames would re-render the grid for nothing.
        const previous = this.snapshot.frame
        if (
          previous &&
          previous.version === frame.version &&
          previous.start === frame.start &&
          previous.index.length === frame.index.length &&
          previous.total === frame.total
        ) {
          return
        }
        this.set({ frame })
      })
      .finally(() => {
        if (host === this.host) this.inFlight = false
      })
  }

  private configureCalls = 0

  async configure(config: TapeConfig) {
    this.set({ config, frame: null })
    const host = this.host
    if (!host) return
    const call = ++this.configureCalls
    const { generation, symbols } = await host.configure(config)
    // A newer configure (or host) superseded this one while it was pending.
    if (host !== this.host || call !== this.configureCalls) return
    this.generation = generation
    host.setQuery(this.query)
    host.setPaused(this.snapshot.paused)
    this.set({ symbols })
  }

  /** Changes rate or universe size. A new seed or size rebuilds the market. */
  setConfig(patch: Partial<TapeConfig>) {
    return this.configure({ ...this.snapshot.config, ...patch })
  }

  setQuery(query: TapeQuery) {
    this.query = query
    this.host?.setQuery(query)
  }

  setPaused(paused: boolean) {
    this.host?.setPaused(paused)
    this.set({ paused })
  }

  setViewport(start: number, end: number) {
    this.viewport = { start, end }
  }

  /** Swaps where the engine runs; the market is rebuilt from the same seed. */
  async setMode(mode: HostMode) {
    if (mode === this.snapshot.mode) return
    this.set({ mode })
    if (!this.host) return
    this.host.dispose()
    this.host = createHost(mode)
    this.inFlight = false
    await this.configure(this.snapshot.config)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.host?.dispose()
    this.host = null
  }
}

const createHost = (mode: HostMode) =>
  mode === 'worker' ? createWorkerHost() : createMainThreadHost()
