import {
  createMarket,
  FIELD_COUNT,
  FIELDS,
  fieldValue,
  HISTORY_LENGTH,
  ingest,
  type Market,
  simulateFeed,
} from './market'
import type { EngineStats, TapeConfig, WindowFrame } from './protocol'
import { computeOrder, type TapeQuery } from './query'
import { createRandom, type Random } from './random'
import { generateSymbols } from './universe'

/** How often the sorted order is recomputed while prices move. */
const RESORT_INTERVAL_MS = 250
/** Simulated seconds of market time per trade on a symbol. */
const TRADE_DT = 1

/**
 * The simulation, independent of where it runs: the worker and the
 * main-thread comparison mode both drive one of these. Time is passed in, so
 * tests can step it deterministically.
 */
export class TapeEngine {
  generation = 0
  symbols: string[] = []
  private market!: Market
  private random!: Random
  private ticksPerSecond = 0
  private carry = 0
  private paused = false
  private query: TapeQuery = { sort: null, filter: '' }
  private order: Int32Array = new Int32Array(0)
  private orderDirty = true
  private orderVersion = 0
  private lastSortAt = -Infinity
  private sortMs = 0
  private window = { ticks: 0, tickMs: 0, startedAt: 0 }
  private stats: EngineStats = {
    ticksPerSecond: 0,
    totalTicks: 0,
    tickMs: 0,
    sortMs: 0,
  }

  constructor(config: TapeConfig, now = 0) {
    this.configure(config, now)
  }

  configure(config: TapeConfig, now = 0) {
    this.generation++
    this.random = createRandom(config.seed)
    this.symbols = generateSymbols(config.seed, config.symbols)
    this.market = createMarket(config.symbols, this.random)
    this.ticksPerSecond = config.ticksPerSecond
    this.carry = 0
    this.orderDirty = true
    this.window = { ticks: 0, tickMs: 0, startedAt: now }
  }

  setRate(ticksPerSecond: number) {
    this.ticksPerSecond = ticksPerSecond
  }

  setQuery(query: TapeQuery) {
    this.query = query
    this.orderDirty = true
    this.lastSortAt = -Infinity
  }

  setPaused(paused: boolean) {
    this.paused = paused
  }

  /** Applies the trades that `elapsedMs` of wall time is worth. */
  advance(elapsedMs: number, now: number, clock: () => number = () => now) {
    if (!this.paused && elapsedMs > 0) {
      // Cap catch-up after a stall (e.g. a background tab) to one second.
      const exact =
        (this.ticksPerSecond * Math.min(elapsedMs, 1000)) / 1000 + this.carry
      const n = Math.floor(exact)
      this.carry = exact - n
      // The exchange's encoding isn't the client's cost; only decoding and
      // applying (ingest) is counted.
      const messages = simulateFeed(this.market, this.random, n, TRADE_DT)
      const startedAt = clock()
      ingest(this.market, messages)
      this.window.tickMs += clock() - startedAt
      this.window.ticks += n
      // Sorted order goes stale as prices move; value sorts refresh on a cadence.
      if (n > 0 && this.query.sort && this.query.sort.key !== 'symbol')
        this.orderDirty = true
    }
    if (now - this.window.startedAt >= 1000) {
      const seconds = (now - this.window.startedAt) / 1000
      this.stats = {
        ...this.stats,
        ticksPerSecond: Math.round(this.window.ticks / seconds),
        tickMs: this.window.tickMs,
      }
      this.window = { ticks: 0, tickMs: 0, startedAt: now }
    }
  }

  private refreshOrder(now: number, clock: () => number) {
    if (!this.orderDirty || now - this.lastSortAt < RESORT_INTERVAL_MS) return
    const startedAt = clock()
    this.order = computeOrder(this.market, this.symbols, this.query)
    this.orderVersion++
    this.sortMs = clock() - startedAt
    this.orderDirty = false
    this.lastSortAt = now
  }

  /** Builds the frame for rows [start, end) of the current order. */
  frame(
    id: number,
    start: number,
    end: number,
    now: number,
    clock: () => number = () => now
  ): WindowFrame {
    this.refreshOrder(now, clock)
    const total = this.order.length
    const from = Math.max(0, Math.min(start, total))
    const to = Math.max(from, Math.min(end, total))
    const rows = to - from
    const index = new Int32Array(rows)
    const fields = new Float64Array(rows * FIELD_COUNT)
    const seq = new Uint32Array(rows)
    const dir = new Int8Array(rows)
    const history = new Float32Array(rows * HISTORY_LENGTH)
    for (let r = 0; r < rows; r++) {
      const i = this.order[from + r]!
      index[r] = i
      for (let f = 0; f < FIELD_COUNT; f++)
        fields[r * FIELD_COUNT + f] = fieldValue(this.market, FIELDS[f]!, i)
      seq[r] = this.market.seq[i]!
      dir[r] = this.market.dir[i]!
      this.market.history.read(i, history, r * HISTORY_LENGTH)
    }
    return {
      id,
      generation: this.generation,
      total,
      start: from,
      // Trades and reorders both bump this; Cantor pairing keeps it one number.
      version:
        ((this.market.tick + this.orderVersion) *
          (this.market.tick + this.orderVersion + 1)) /
          2 +
        this.orderVersion,
      index,
      fields,
      seq,
      dir,
      history,
      stats: {
        ...this.stats,
        totalTicks: this.market.tick,
        sortMs: this.sortMs,
      },
      bytes:
        index.byteLength +
        fields.byteLength +
        seq.byteLength +
        dir.byteLength +
        history.byteLength,
    }
  }
}
