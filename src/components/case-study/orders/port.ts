import type { Order, OrderStatus } from './api'

/**
 * The adapter boundary. Screens depend on this interface, never on RTK Query
 * or TanStack Query directly, so the implementation behind it can change
 * without touching them.
 */
export interface OrdersPort {
  name: string
  useOrders(status: OrderStatus | 'all'): {
    orders: Order[] | undefined
    isLoading: boolean
    isFetching: boolean
    error: string | undefined
  }
  useApproveOrder(): {
    approve: (id: number) => Promise<void>
    isPending: boolean
  }
}
