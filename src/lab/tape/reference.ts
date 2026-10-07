import { queryOptions } from '@tanstack/react-query'
import { generateUniverse, type UniverseEntry } from './engine/universe'

/**
 * Simulated reference-data endpoint (company names and sectors). Real grids
 * join slow-changing reference data to fast-moving quotes; here it comes from
 * TanStack Query with a cache, a simulated network delay, and the same seed
 * as the engine, so symbols always match.
 */
const fetchReference = async (
  seed: number,
  count: number
): Promise<Map<string, UniverseEntry>> => {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return new Map(
    generateUniverse(seed, count).map((entry) => [entry.symbol, entry])
  )
}

export const referenceQuery = (seed: number, count: number) =>
  queryOptions({
    queryKey: ['tape', 'reference', seed, count],
    queryFn: () => fetchReference(seed, count),
    staleTime: Infinity,
  })
