import { TapeEngine } from './engine/engine'
import {
  type EngineRequest,
  type EngineResponse,
  FEED_INTERVAL_MS,
  type TapeConfig,
  type WindowFrame,
} from './engine/protocol'
import type { TapeQuery } from './engine/query'

export type HostMode = 'worker' | 'main'

/**
 * Where the simulation runs. Both hosts expose the same async interface, so
 * the grid can't tell them apart; only the frame meter can.
 */
export interface EngineHost {
  readonly mode: HostMode
  configure(
    config: TapeConfig
  ): Promise<{ generation: number; symbols: string[] }>
  setQuery(query: TapeQuery): void
  setPaused(paused: boolean): void
  pull(start: number, end: number): Promise<WindowFrame>
  dispose(): void
}

/** Runs the engine in a dedicated worker; frames arrive as transferred buffers. */
export const createWorkerHost = (): EngineHost => {
  const worker = new Worker(new URL('./tape.worker.ts', import.meta.url), {
    type: 'module',
    name: 'tape',
  })
  let nextId = 0
  const pending = new Map<number, (frame: WindowFrame) => void>()
  // The worker handles messages in order, so `ready` replies match configure
  // calls first-in, first-out.
  const ready: ((value: { generation: number; symbols: string[] }) => void)[] =
    []

  worker.onmessage = ({ data }: MessageEvent<EngineResponse>) => {
    if (data.type === 'ready') {
      ready.shift()?.({ generation: data.generation, symbols: data.symbols })
    } else {
      pending.get(data.frame.id)?.(data.frame)
      pending.delete(data.frame.id)
    }
  }
  const send = (request: EngineRequest) => worker.postMessage(request)

  return {
    mode: 'worker',
    configure(config) {
      return new Promise((resolve) => {
        ready.push(resolve)
        send({ type: 'configure', config })
      })
    },
    setQuery: (query) => send({ type: 'query', query }),
    setPaused: (paused) => send({ type: 'paused', paused }),
    pull(start, end) {
      const id = ++nextId
      return new Promise((resolve) => {
        pending.set(id, resolve)
        send({ type: 'pull', id, start, end })
      })
    },
    dispose: () => worker.terminate(),
  }
}

/**
 * Runs the same engine on the main thread, on the same packet cadence, so its
 * cost lands where rendering and input handling happen. This is the "before".
 */
export const createMainThreadHost = (): EngineHost => {
  let engine: TapeEngine | null = null
  let nextId = 0
  let lastAdvance = performance.now()
  const clock = () => performance.now()
  const timer = setInterval(() => {
    const now = performance.now()
    engine?.advance(now - lastAdvance, now, clock)
    lastAdvance = now
  }, FEED_INTERVAL_MS)

  return {
    mode: 'main',
    async configure(config) {
      const now = performance.now()
      if (engine) engine.configure(config, now)
      else engine = new TapeEngine(config, now)
      lastAdvance = now
      return { generation: engine.generation, symbols: engine.symbols }
    },
    setQuery: (query) => engine?.setQuery(query),
    setPaused: (paused) => engine?.setPaused(paused),
    async pull(start, end) {
      if (!engine) throw new Error('Engine not configured')
      return engine.frame(++nextId, start, end, performance.now(), clock)
    },
    dispose: () => clearInterval(timer),
  }
}
