import { type Field, fieldValue, type Market } from './market'

export type SortKey = 'symbol' | Field

export interface TapeQuery {
  sort: { key: SortKey; desc: boolean } | null
  /** Case-insensitive symbol prefix. */
  filter: string
}

/**
 * Returns symbol indexes matching the filter, in sort order. Sort keys are
 * extracted once into a typed array so the comparator does no field lookups.
 */
export const computeOrder = (
  market: Market,
  symbols: string[],
  query: TapeQuery
): Int32Array => {
  const prefix = query.filter.trim().toUpperCase()
  let matches: number[] = []
  if (prefix) {
    for (let i = 0; i < market.count; i++)
      if (symbols[i]!.startsWith(prefix)) matches.push(i)
  } else {
    matches = Array.from({ length: market.count }, (_, i) => i)
  }

  const order = Int32Array.from(matches)
  const sort = query.sort
  if (!sort) return order

  const direction = sort.desc ? -1 : 1
  if (sort.key === 'symbol') {
    return order.sort(
      (a, b) =>
        direction *
        (symbols[a]! < symbols[b]! ? -1 : symbols[a]! > symbols[b]! ? 1 : 0)
    )
  }
  const keys = new Float64Array(market.count)
  for (const i of order) keys[i] = fieldValue(market, sort.key, i)
  return order.sort((a, b) => direction * (keys[a]! - keys[b]!) || a - b)
}
