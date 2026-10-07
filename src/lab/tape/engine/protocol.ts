import type { TapeQuery } from './query'

/**
 * The feed delivers trades in packets, as market-data WebSockets do (servers
 * conflate updates on a short interval). Each packet is decoded in one
 * synchronous chunk on whichever thread runs the engine.
 */
export const FEED_INTERVAL_MS = 50

export interface TapeConfig {
  seed: number
  symbols: number
  ticksPerSecond: number
}

/** Messages to the engine (worker or main-thread host). */
export type EngineRequest =
  | { type: 'configure'; config: TapeConfig }
  | { type: 'query'; query: TapeQuery }
  | { type: 'paused'; paused: boolean }
  | { type: 'pull'; id: number; start: number; end: number }

export interface EngineStats {
  /** Trades applied per second, measured over the last second. */
  ticksPerSecond: number
  totalTicks: number
  /** Time spent applying trades in the last second (ms). */
  tickMs: number
  /** Duration of the most recent sort/filter pass (ms). */
  sortMs: number
}

/**
 * One frame of data: only the rows in [start, end) of the current sorted and
 * filtered order. Arrays are row-major and transferred, not copied.
 */
export interface WindowFrame {
  id: number
  /** Configuration generation, so frames from an old configuration are dropped. */
  generation: number
  total: number
  start: number
  /** Changes whenever trades land or the order is recomputed; equal versions mean identical data. */
  version: number
  /** Symbol index per row. */
  index: Int32Array
  /** FIELD_COUNT values per row, in FIELDS order. */
  fields: Float64Array
  /** Sequence number of each row's last update (drives the change flash). */
  seq: Uint32Array
  dir: Int8Array
  /** HISTORY_LENGTH prices per row, oldest first, NaN-padded. */
  history: Float32Array
  stats: EngineStats
  /** Bytes in the frame's buffers. */
  bytes: number
}

export type EngineResponse =
  | { type: 'ready'; generation: number; symbols: string[] }
  | { type: 'frame'; frame: WindowFrame }

export const frameTransferables = (frame: WindowFrame): Transferable[] => [
  frame.index.buffer,
  frame.fields.buffer,
  frame.seq.buffer,
  frame.dir.buffer,
  frame.history.buffer,
]
