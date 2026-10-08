import type { BinResult, View } from './engine'

// Messages between the density plot and its worker. Pull-based, like Tape:
// the page asks for one frame at a time and hands the grid buffer back with
// each request, so a single buffer shuttles between threads (transferred,
// never copied) and the worker can't get ahead of the screen.

export type DensityRequest =
  | { type: 'init'; count: number; seed: number }
  | {
      type: 'bin'
      view: View
      width: number
      height: number
      buffer: ArrayBuffer
    }

export type DensityResponse =
  | { type: 'ready'; count: number; generateMs: number }
  | {
      type: 'bins'
      result: BinResult
      width: number
      height: number
      buffer: ArrayBuffer
      binMs: number
    }
