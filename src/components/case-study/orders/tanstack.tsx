import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { OrderStatus, OrdersServer } from './api'
import type { OrdersPort } from './port'

const ADAPTER = 'TanStack Query'

/** The "after": TanStack Query, with the same refetch-after-mutation behavior. */
export const createTanstackOrders = (server: OrdersServer) => {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: 0, retry: false } },
  })
  const key = (status: OrderStatus | 'all') => ['orders', status] as const

  const port: OrdersPort = {
    name: ADAPTER,
    useOrders(status) {
      const result = useQuery({
        queryKey: key(status),
        queryFn: () => server.list(status, ADAPTER),
      })
      return {
        orders: result.data,
        isLoading: result.isPending,
        isFetching: result.isFetching,
        error: result.error?.message,
      }
    },
    useApproveOrder() {
      const queryClient = useQueryClient()
      const mutation = useMutation({
        mutationFn: (id: number) => server.approve(id, ADAPTER),
        // Matches RTK Query's invalidatesTags: ['Order'].
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ['orders'] }),
      })
      return {
        approve: async (id) => {
          await mutation.mutateAsync(id)
        },
        isPending: mutation.isPending,
      }
    },
  }

  const TanstackProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { port, Provider: TanstackProvider }
}
