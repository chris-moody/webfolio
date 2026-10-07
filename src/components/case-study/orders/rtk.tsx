import { configureStore } from '@reduxjs/toolkit'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import type { Order, OrderStatus, OrdersServer } from './api'
import type { OrdersPort } from './port'

const ADAPTER = 'RTK Query'

/** The "before": RTK Query, with tag invalidation refetching lists after a mutation. */
export const createRtkOrders = (server: OrdersServer) => {
  const api = createApi({
    reducerPath: 'orders',
    baseQuery: fakeBaseQuery<string>(),
    tagTypes: ['Order'],
    endpoints: (build) => ({
      listOrders: build.query<Order[], OrderStatus | 'all'>({
        queryFn: async (status) => ({
          data: await server.list(status, ADAPTER),
        }),
        providesTags: ['Order'],
      }),
      approveOrder: build.mutation<Order, number>({
        queryFn: async (id) => ({ data: await server.approve(id, ADAPTER) }),
        invalidatesTags: ['Order'],
      }),
    }),
  })

  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefault) => getDefault().concat(api.middleware),
  })

  const port: OrdersPort = {
    name: ADAPTER,
    useOrders(status) {
      // Parity: TanStack Query (staleTime 0) refetches when a screen mounts;
      // RTK Query reuses its cache by default. Without this, the shadow check
      // caught the two layers showing different data after a mutation made
      // through the other one.
      const result = api.useListOrdersQuery(status, {
        refetchOnMountOrArgChange: true,
      })
      return {
        orders: result.data,
        isLoading: result.isLoading,
        isFetching: result.isFetching,
        // The port speaks strings; RTK Query errors may be SerializedError objects.
        error:
          typeof result.error === 'string'
            ? result.error
            : result.error?.message,
      }
    },
    useApproveOrder() {
      const [trigger, state] = api.useApproveOrderMutation()
      return {
        approve: async (id) => {
          await trigger(id).unwrap()
        },
        isPending: state.isLoading,
      }
    },
  }

  const RtkProvider = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  return { port, Provider: RtkProvider }
}
