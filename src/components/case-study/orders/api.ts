// In-memory "server" for the migration sandbox: orders with simulated
// latency, and a log of every request so two data layers can be compared.

export type OrderStatus = 'pending' | 'approved'

export interface Order {
  id: number
  customer: string
  total: number
  status: OrderStatus
}

export interface RequestRecord {
  id: number
  at: number
  adapter: string
  method: 'GET' | 'POST'
  url: string
  ms: number
}

const LATENCY_MS = 250

const seedOrders = (): Order[] =>
  [
    ['Northwind Traders', 1240.5],
    ['Contoso Ltd', 89.99],
    ['Fabrikam', 455],
    ['Tailspin Toys', 2310.25],
    ['Wide World Importers', 712.4],
    ['Adventure Works', 64],
  ].map(([customer, total], i) => ({
    id: 1001 + i,
    customer: customer as string,
    total: total as number,
    status: i % 3 === 0 ? 'approved' : 'pending',
  }))

type Listener = () => void

/** One fake backend shared by both adapters, so they see the same data. */
export class OrdersServer {
  private orders = seedOrders()
  private requests: RequestRecord[] = []
  private nextRequest = 1
  private listeners = new Set<Listener>()

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getLog = () => this.requests

  reset() {
    this.orders = seedOrders()
    this.requests = []
    this.emit()
  }

  async list(status: OrderStatus | 'all', adapter: string): Promise<Order[]> {
    const query = status === 'all' ? '' : `?status=${status}`
    return this.request(adapter, 'GET', `/api/orders${query}`, () =>
      this.orders
        .filter((order) => status === 'all' || order.status === status)
        .map((order) => ({ ...order }))
    )
  }

  async approve(id: number, adapter: string): Promise<Order> {
    return this.request(adapter, 'POST', `/api/orders/${id}/approve`, () => {
      const order = this.orders.find((candidate) => candidate.id === id)
      if (!order) throw new Error(`Order ${id} not found`)
      order.status = 'approved'
      return { ...order }
    })
  }

  private async request<T>(
    adapter: string,
    method: 'GET' | 'POST',
    url: string,
    handle: () => T
  ): Promise<T> {
    const started = performance.now()
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
    const result = handle()
    this.requests = [
      {
        id: this.nextRequest++,
        at: Date.now(),
        adapter,
        method,
        url,
        ms: Math.round(performance.now() - started),
      },
      ...this.requests,
    ].slice(0, 30)
    this.emit()
    return result
  }

  private emit() {
    for (const listener of this.listeners) listener()
  }
}
