import type { TapeConfig } from './engine/protocol'

/** The target load: 10k rows at 5k trades/s. */
export const DEFAULT_CONFIG: TapeConfig = {
  seed: 42,
  symbols: 10_000,
  ticksPerSecond: 5_000,
}
export const RATES = [100, 1_000, 5_000, 10_000, 25_000, 50_000]
export const SIZES = [100, 1_000, 10_000, 25_000, 50_000]
