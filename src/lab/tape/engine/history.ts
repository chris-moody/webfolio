/**
 * Fixed-capacity price history for every symbol in one Float32Array, so the
 * engine allocates nothing per tick. Each symbol owns `capacity` slots used as
 * a ring buffer.
 */
export class History {
  readonly capacity: number
  private readonly values: Float32Array
  private readonly heads: Uint16Array
  private readonly sizes: Uint16Array

  constructor(count: number, capacity: number) {
    this.capacity = capacity
    this.values = new Float32Array(count * capacity)
    this.heads = new Uint16Array(count)
    this.sizes = new Uint16Array(count)
  }

  push(symbol: number, value: number) {
    const head = this.heads[symbol]!
    this.values[symbol * this.capacity + head] = value
    this.heads[symbol] = (head + 1) % this.capacity
    if (this.sizes[symbol]! < this.capacity) this.sizes[symbol]!++
  }

  size(symbol: number) {
    return this.sizes[symbol]!
  }

  /**
   * Copies a symbol's history into `out` starting at `offset`, oldest first,
   * right-aligned: missing (not yet filled) slots are NaN.
   */
  read(symbol: number, out: Float32Array, offset = 0) {
    const size = this.sizes[symbol]!
    const head = this.heads[symbol]!
    const base = symbol * this.capacity
    const pad = this.capacity - size
    out.fill(Number.NaN, offset, offset + pad)
    for (let i = 0; i < size; i++) {
      const slot = (head - size + i + this.capacity) % this.capacity
      out[offset + pad + i] = this.values[base + slot]!
    }
  }
}
