import { describe, expect, it } from 'vitest'
import { TapeEngine } from './engine'
import { History } from './history'
import {
  applyTrades,
  createMarket,
  FIELD_COUNT,
  FIELDS,
  fieldValue,
  HISTORY_LENGTH,
} from './market'
import { computeOrder } from './query'
import { createRandom } from './random'
import { generateSymbols, generateUniverse } from './universe'

describe('random', () => {
  it('is deterministic for a seed', () => {
    const a = createRandom(7)
    const b = createRandom(7)
    expect(Array.from({ length: 5 }, a.next)).toEqual(
      Array.from({ length: 5 }, b.next)
    )
  })

  it('produces roughly standard normals', () => {
    const random = createRandom(1)
    const samples = Array.from({ length: 20_000 }, random.normal)
    const mean = samples.reduce((sum, x) => sum + x, 0) / samples.length
    const variance =
      samples.reduce((sum, x) => sum + (x - mean) ** 2, 0) / samples.length
    expect(Math.abs(mean)).toBeLessThan(0.03)
    expect(Math.abs(variance - 1)).toBeLessThan(0.05)
  })
})

describe('universe', () => {
  it('generates unique tickers, and reference data that matches them', () => {
    const symbols = generateSymbols(42, 5_000)
    expect(new Set(symbols).size).toBe(5_000)
    expect(generateUniverse(42, 5_000).map((entry) => entry.symbol)).toEqual(
      symbols
    )
  })
})

describe('history', () => {
  it('reads oldest first, right-aligned and NaN-padded', () => {
    const history = new History(2, 4)
    history.push(1, 10)
    history.push(1, 11)
    const out = new Float32Array(4)
    history.read(1, out)
    expect(Array.from(out.slice(0, 2)).every(Number.isNaN)).toBe(true)
    expect(Array.from(out.slice(2))).toEqual([10, 11])
  })

  it('wraps at capacity', () => {
    const history = new History(1, 3)
    for (const value of [1, 2, 3, 4, 5]) history.push(0, value)
    const out = new Float32Array(3)
    history.read(0, out)
    expect(Array.from(out)).toEqual([3, 4, 5])
  })
})

describe('market', () => {
  it('keeps prices, ranges, and VWAP consistent', () => {
    const random = createRandom(3)
    const market = createMarket(200, random)
    applyTrades(market, random, 50_000, 1)
    expect(market.tick).toBe(50_000)
    for (let i = 0; i < market.count; i++) {
      const last = fieldValue(market, 'last', i)
      expect(last).toBeGreaterThan(0)
      expect(fieldValue(market, 'low', i)).toBeLessThanOrEqual(last)
      expect(fieldValue(market, 'high', i)).toBeGreaterThanOrEqual(last)
      expect(fieldValue(market, 'bid', i)).toBeLessThanOrEqual(
        fieldValue(market, 'ask', i)
      )
      const vwap = fieldValue(market, 'vwap', i)
      expect(vwap).toBeGreaterThanOrEqual(fieldValue(market, 'low', i) - 0.01)
      expect(vwap).toBeLessThanOrEqual(fieldValue(market, 'high', i) + 0.01)
    }
  })
})

describe('computeOrder', () => {
  const random = createRandom(9)
  const market = createMarket(1_000, random)
  applyTrades(market, random, 10_000, 1)
  const symbols = generateSymbols(9, 1_000)

  it('sorts by a value, descending', () => {
    const order = computeOrder(market, symbols, {
      sort: { key: 'changePct', desc: true },
      filter: '',
    })
    const values = Array.from(order, (i) => fieldValue(market, 'changePct', i))
    expect(values).toEqual([...values].sort((a, b) => b - a))
  })

  it('sorts by symbol and filters by prefix', () => {
    const order = computeOrder(market, symbols, {
      sort: { key: 'symbol', desc: false },
      filter: 'a',
    })
    const names = Array.from(order, (i) => symbols[i]!)
    expect(names.length).toBeGreaterThan(0)
    expect(names.every((name) => name.startsWith('A'))).toBe(true)
    expect(names).toEqual([...names].sort())
  })
})

describe('TapeEngine', () => {
  it('applies trades at the configured rate', () => {
    const engine = new TapeEngine(
      { seed: 1, symbols: 500, ticksPerSecond: 2_000 },
      0
    )
    for (let t = 16; t <= 1_008; t += 16) engine.advance(16, t)
    const frame = engine.frame(1, 0, 10, 1_008)
    expect(frame.stats.totalTicks).toBeGreaterThanOrEqual(1_980)
    expect(frame.stats.totalTicks).toBeLessThanOrEqual(2_020)
  })

  it('returns only the requested window, in row-major arrays', () => {
    const engine = new TapeEngine(
      { seed: 1, symbols: 500, ticksPerSecond: 0 },
      0
    )
    const frame = engine.frame(1, 100, 140, 0)
    expect(frame.total).toBe(500)
    expect(frame.start).toBe(100)
    expect(frame.index.length).toBe(40)
    expect(frame.fields.length).toBe(40 * FIELD_COUNT)
    expect(frame.history.length).toBe(40 * HISTORY_LENGTH)
    expect(frame.fields[FIELDS.indexOf('last')]).toBeGreaterThan(0)
  })

  it('clamps windows past the end and respects the filter', () => {
    const engine = new TapeEngine(
      { seed: 1, symbols: 500, ticksPerSecond: 0 },
      0
    )
    engine.setQuery({ sort: null, filter: 'Q' })
    const frame = engine.frame(1, 0, 10_000, 0)
    expect(frame.total).toBe(frame.index.length)
    expect(
      Array.from(frame.index).every((i) => engine.symbols[i]!.startsWith('Q'))
    ).toBe(true)
  })

  it('stops trading while paused', () => {
    const engine = new TapeEngine(
      { seed: 1, symbols: 100, ticksPerSecond: 10_000 },
      0
    )
    engine.setPaused(true)
    engine.advance(500, 500)
    expect(engine.frame(1, 0, 1, 500).stats.totalTicks).toBe(0)
  })
})
