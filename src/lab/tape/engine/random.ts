/** Seeded PRNG (mulberry32): the same seed always produces the same market. */
export const mulberry32 = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Random {
  /** Uniform in [0, 1). */
  next: () => number
  /** Standard normal (Box–Muller, caching the spare value). */
  normal: () => number
  /** Integer in [min, max]. */
  int: (min: number, max: number) => number
}

export const createRandom = (seed: number): Random => {
  const next = mulberry32(seed)
  let spare: number | null = null
  return {
    next,
    normal() {
      if (spare !== null) {
        const value = spare
        spare = null
        return value
      }
      let u = 0
      while (u === 0) u = next()
      const v = next()
      const radius = Math.sqrt(-2 * Math.log(u))
      spare = radius * Math.sin(2 * Math.PI * v)
      return radius * Math.cos(2 * Math.PI * v)
    },
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
  }
}
