/// <reference lib="webworker" />
import { TapeEngine } from './engine/engine'
import {
  type EngineRequest,
  type EngineResponse,
  FEED_INTERVAL_MS,
  frameTransferables,
} from './engine/protocol'

// The worker owns the simulation. It ingests a feed packet every
// FEED_INTERVAL_MS and only
// answers `pull` requests, so the main thread receives one message per
// animation frame containing just the visible rows.

declare const self: DedicatedWorkerGlobalScope

let engine: TapeEngine | null = null
let lastAdvance = performance.now()

const post = (message: EngineResponse, transfer: Transferable[] = []) =>
  self.postMessage(message, transfer)
const clock = () => performance.now()

const loop = () => {
  const now = performance.now()
  engine?.advance(now - lastAdvance, now, clock)
  lastAdvance = now
}
setInterval(loop, FEED_INTERVAL_MS)

self.onmessage = ({ data: request }: MessageEvent<EngineRequest>) => {
  const now = performance.now()
  switch (request.type) {
    case 'configure':
      if (engine) engine.configure(request.config, now)
      else engine = new TapeEngine(request.config, now)
      lastAdvance = now
      post({
        type: 'ready',
        generation: engine.generation,
        symbols: engine.symbols,
      })
      break
    case 'query':
      engine?.setQuery(request.query)
      break
    case 'paused':
      engine?.setPaused(request.paused)
      break
    case 'pull': {
      if (!engine) return
      const frame = engine.frame(
        request.id,
        request.start,
        request.end,
        now,
        clock
      )
      post({ type: 'frame', frame }, frameTransferables(frame))
      break
    }
  }
}
