import { createRandom } from './random'

// The tradable universe: synthetic tickers with names and sectors. Both the
// engine (symbols only) and the simulated reference-data API (names, sectors)
// derive it from the same seed, so they always agree.

const SECTORS = [
  'Technology',
  'Health Care',
  'Financials',
  'Energy',
  'Industrials',
  'Consumer',
  'Utilities',
  'Materials',
] as const

const SYLLABLES = [
  'ar',
  'vo',
  'lex',
  'tri',
  'on',
  'qu',
  'zen',
  'mar',
  'cor',
  'al',
  'is',
  'ne',
  'ta',
  'ry',
  'dex',
]
const SUFFIXES = [
  'Systems',
  'Labs',
  'Holdings',
  'Group',
  'Industries',
  'Networks',
  'Bio',
  'Energy',
  'Partners',
]

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export interface UniverseEntry {
  symbol: string
  name: string
  sector: (typeof SECTORS)[number]
}

/** Deterministic, unique tickers (2–5 letters). */
export const generateSymbols = (seed: number, count: number): string[] => {
  const random = createRandom(seed ^ 0x5eed)
  const seen = new Set<string>()
  const symbols: string[] = []
  while (symbols.length < count) {
    const length = random.int(2, 5)
    let symbol = ''
    for (let i = 0; i < length; i++) symbol += LETTERS[random.int(0, 25)]
    if (seen.has(symbol)) continue
    seen.add(symbol)
    symbols.push(symbol)
  }
  return symbols
}

export const generateUniverse = (
  seed: number,
  count: number
): UniverseEntry[] => {
  const random = createRandom(seed ^ 0xbeef)
  return generateSymbols(seed, count).map((symbol) => {
    let word = ''
    for (let i = random.int(2, 3); i > 0; i--)
      word += SYLLABLES[random.int(0, SYLLABLES.length - 1)]
    const name = `${word[0]!.toUpperCase()}${word.slice(1)} ${SUFFIXES[random.int(0, SUFFIXES.length - 1)]}`
    return { symbol, name, sector: SECTORS[random.int(0, SECTORS.length - 1)]! }
  })
}
