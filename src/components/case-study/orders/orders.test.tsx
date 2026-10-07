import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { OrdersServer } from './api'
import { createRtkOrders } from './rtk'
import { createTanstackOrders } from './tanstack'

const setup = () => {
  const server = new OrdersServer()
  const rtk = createRtkOrders(server)
  const tanstack = createTanstackOrders(server)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <rtk.Provider>
      <tanstack.Provider>{children}</tanstack.Provider>
    </rtk.Provider>
  )
  return { server, rtk, tanstack, wrapper }
}

describe('orders adapters', () => {
  it('load the same data through the same contract', async () => {
    const { rtk, tanstack, wrapper } = setup()
    const a = renderHook(() => rtk.port.useOrders('pending'), { wrapper })
    const b = renderHook(() => tanstack.port.useOrders('pending'), { wrapper })
    await waitFor(() => expect(a.result.current.orders).toBeDefined())
    await waitFor(() => expect(b.result.current.orders).toBeDefined())
    expect(a.result.current.orders).toEqual(b.result.current.orders)
  })

  // Regression: RTK Query reused its cache on mount while TanStack Query
  // refetched, so after a mutation through one layer the other showed stale data.
  it('agree after a mutation made through the other adapter', async () => {
    const { rtk, tanstack, wrapper } = setup()
    const before = renderHook(() => rtk.port.useOrders('all'), { wrapper })
    await waitFor(() => expect(before.result.current.orders).toBeDefined())
    before.unmount()

    const mutation = renderHook(() => tanstack.port.useApproveOrder(), {
      wrapper,
    })
    await act(() => mutation.result.current.approve(1002))

    const after = renderHook(() => rtk.port.useOrders('all'), { wrapper })
    await waitFor(() =>
      expect(
        after.result.current.orders?.find((order) => order.id === 1002)?.status
      ).toBe('approved')
    )
  })

  it('both refetch after their own mutation', async () => {
    const { server, rtk, tanstack, wrapper } = setup()
    for (const port of [rtk.port, tanstack.port]) {
      const list = renderHook(() => port.useOrders('pending'), { wrapper })
      await waitFor(() => expect(list.result.current.orders).toBeDefined())
      const approve = renderHook(() => port.useApproveOrder(), { wrapper })
      const target = list.result.current.orders![0]!.id
      await act(() => approve.result.current.approve(target))
      await waitFor(() =>
        expect(
          list.result.current.orders?.some((order) => order.id === target)
        ).toBe(false)
      )
    }
    const methods = server
      .getLog()
      .map((entry) => `${entry.adapter} ${entry.method}`)
    expect(methods.filter((entry) => entry.endsWith('POST'))).toHaveLength(2)
  })
})
