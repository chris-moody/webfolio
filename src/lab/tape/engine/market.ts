import { History } from './history'
import type { Random } from './random'

/** Numeric fields sent to the grid, in wire order (see protocol.ts). */
export const FIELDS = [
  'last',
  'bid',
  'ask',
  'change',
  'changePct',
  'high',
  'low',
  'volume',
  'vwap',
] as const
export type Field = (typeof FIELDS)[number]
export const FIELD_COUNT = FIELDS.length

export const HISTORY_LENGTH = 48

/**
 * Struct-of-arrays market state: one typed array per field, indexed by symbol.
 * Ticks mutate in place; nothing is allocated per tick.
 */
export interface Market {
  count: number
  open: Float64Array
  last: Float64Array
  high: Float64Array
  low: Float64Array
  volume: Float64Array
  /** Σ price × size, for VWAP. */
  notional: Float64Array
  /** Per-symbol volatility (per √second). */
  sigma: Float32Array
  /** Half the bid/ask spread as a fraction of price. */
  halfSpread: Float32Array
  /** Global sequence number of each symbol's last update. */
  seq: Uint32Array
  /** Direction of each symbol's last move: -1, 0, 1. */
  dir: Int8Array
  history: History
  /** Sequence counter (total ticks applied). */
  tick: number
}

export const createMarket = (count: number, random: Random): Market => {
  const market: Market = {
    count,
    open: new Float64Array(count),
    last: new Float64Array(count),
    high: new Float64Array(count),
    low: new Float64Array(count),
    volume: new Float64Array(count),
    notional: new Float64Array(count),
    sigma: new Float32Array(count),
    halfSpread: new Float32Array(count),
    seq: new Uint32Array(count),
    dir: new Int8Array(count),
    history: new History(count, HISTORY_LENGTH),
    tick: 0,
  }
  for (let i = 0; i < count; i++) {
    // Log-uniform prices between $2 and $900.
    const price =
      Math.round(Math.exp(Math.log(2) + random.next() * Math.log(450)) * 100) /
      100
    market.open[i] = market.last[i] = market.high[i] = market.low[i] = price
    const sigma = 0.004 + random.next() * 0.02
    market.sigma[i] = sigma
    market.halfSpread[i] = 0.0001 + random.next() * 0.0006
    // Pre-open history: a short walk that ends at the opening price, so
    // sparklines have shape from the first frame.
    const walk = new Float64Array(HISTORY_LENGTH)
    walk[HISTORY_LENGTH - 1] = price
    for (let h = HISTORY_LENGTH - 2; h >= 0; h--)
      walk[h] = walk[h + 1]! * Math.exp(sigma * random.normal())
    for (const value of walk) market.history.push(i, value)
  }
  return market
}

/**
 * The exchange side of the simulation: `n` trades on randomly chosen symbols,
 * encoded one JSON message per trade, as a market-data WebSocket delivers
 * them. Prices follow geometric Brownian motion, `dt` seconds per trade.
 */
export const simulateFeed = (
  market: Market,
  random: Random,
  n: number,
  dt: number
): string[] => {
  const sqrtDt = Math.sqrt(dt)
  const messages = new Array<string>(n)
  // Prices the batch has already moved, so trades on one symbol chain.
  const pending = new Map<number, number>()
  for (let k = 0; k < n; k++) {
    const i = Math.floor(random.next() * market.count)
    const sigma = market.sigma[i]!
    const previous = pending.get(i) ?? market.last[i]!
    const next =
      previous *
      Math.exp(-0.5 * sigma * sigma * dt + sigma * sqrtDt * random.normal())
    const price = Math.max(0.01, Math.round(next * 100) / 100)
    pending.set(i, price)
    messages[k] = JSON.stringify({
      type: 'trade',
      sym: i,
      px: price,
      qty: random.int(1, 50) * 100,
    })
  }
  return messages
}

interface TradeMessage {
  type: 'trade'
  sym: number
  px: number
  qty: number
}

/**
 * The client side: decode each message and apply it to the struct-of-arrays
 * state. This is the per-message work a real feed handler does, and the work
 * the demo moves between threads.
 */
export const ingest = (market: Market, messages: string[]) => {
  for (const raw of messages) {
    const message = JSON.parse(raw) as TradeMessage
    if (message.type !== 'trade') continue
    const i = message.sym
    const price = message.px
    const previous = market.last[i]!
    market.last[i] = price
    if (price > market.high[i]!) market.high[i] = price
    if (price < market.low[i]!) market.low[i] = price
    market.volume[i] = market.volume[i]! + message.qty
    market.notional[i] = market.notional[i]! + price * message.qty
    market.dir[i] = price > previous ? 1 : price < previous ? -1 : 0
    market.seq[i] = ++market.tick
    market.history.push(i, price)
  }
}

/** Simulates and ingests `n` trades. */
export const applyTrades = (
  market: Market,
  random: Random,
  n: number,
  dt: number
) => ingest(market, simulateFeed(market, random, n, dt))

/** Reads one derived field for a symbol. */
export const fieldValue = (market: Market, field: Field, i: number): number => {
  const last = market.last[i]!
  switch (field) {
    case 'last':
      return last
    case 'bid':
      return Math.round(last * (1 - market.halfSpread[i]!) * 100) / 100
    case 'ask':
      return Math.round(last * (1 + market.halfSpread[i]!) * 100) / 100
    case 'change':
      return last - market.open[i]!
    case 'changePct':
      return ((last - market.open[i]!) / market.open[i]!) * 100
    case 'high':
      return market.high[i]!
    case 'low':
      return market.low[i]!
    case 'volume':
      return market.volume[i]!
    case 'vwap':
      return market.volume[i]! > 0
        ? market.notional[i]! / market.volume[i]!
        : last
  }
}
