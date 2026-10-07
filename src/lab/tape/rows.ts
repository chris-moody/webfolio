import {
  FIELD_COUNT,
  FIELDS,
  type Field,
  HISTORY_LENGTH,
} from './engine/market'
import type { WindowFrame } from './engine/protocol'
import type { UniverseEntry } from './engine/universe'

export interface TapeRow {
  /** Symbol index in the engine. */
  key: number
  /** Position in the sorted, filtered order. */
  position: number
  symbol: string
  name: string | undefined
  sector: string | undefined
  values: Record<Field, number>
  seq: number
  dir: number
  history: Float32Array
}

/** Grid column ids, in display order. */
export const COLUMN_IDS = [
  'symbol',
  'name',
  'last',
  'change',
  'changePct',
  'bid',
  'ask',
  'high',
  'low',
  'volume',
  'vwap',
  'trend',
] as const

/** Turns a frame's typed arrays into row objects for the visible window only. */
export const frameRows = (
  frame: WindowFrame | null,
  symbols: string[],
  reference: Map<string, UniverseEntry> | undefined
): TapeRow[] => {
  if (!frame) return []
  const rows: TapeRow[] = []
  for (let r = 0; r < frame.index.length; r++) {
    const key = frame.index[r]!
    const symbol = symbols[key] ?? '?'
    const values = {} as Record<Field, number>
    for (let f = 0; f < FIELD_COUNT; f++)
      values[FIELDS[f]!] = frame.fields[r * FIELD_COUNT + f]!
    const entry = reference?.get(symbol)
    rows.push({
      key,
      position: frame.start + r,
      symbol,
      name: entry?.name,
      sector: entry?.sector,
      values,
      seq: frame.seq[r]!,
      dir: frame.dir[r]!,
      history: frame.history.subarray(
        r * HISTORY_LENGTH,
        (r + 1) * HISTORY_LENGTH
      ),
    })
  }
  return rows
}
