import { useId, useState, useSyncExternalStore } from 'react'
import { type OrderStatus, OrdersServer } from './api'
import type { OrdersPort } from './port'
import { createRtkOrders } from './rtk'
import { createTanstackOrders } from './tanstack'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
const time = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
})

const OrdersPanel = ({
  port,
  status,
}: {
  port: OrdersPort
  status: OrderStatus | 'all'
}) => {
  const { orders, isLoading, isFetching, error } = port.useOrders(status)
  const { approve, isPending } = port.useApproveOrder()
  if (error)
    return <p className="text-negative">Couldn’t load orders: {error}</p>
  return (
    <table className="w-full text-left text-sm" aria-busy={isFetching}>
      <caption className="mb-2 text-left text-fg-muted">
        Orders via <strong className="text-fg">{port.name}</strong>
        {isFetching && !isLoading ? ' · refreshing…' : ''}
      </caption>
      <thead>
        <tr className="border-b border-border text-fg-muted">
          <th scope="col" className="py-1.5 pr-2 font-semibold">
            Order
          </th>
          <th scope="col" className="py-1.5 pr-2 font-semibold">
            Customer
          </th>
          <th scope="col" className="py-1.5 pr-2 text-right font-semibold">
            Total
          </th>
          <th scope="col" className="py-1.5 font-semibold">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={4} className="py-6 text-center text-fg-muted">
              Loading…
            </td>
          </tr>
        ) : orders?.length ? (
          orders.map((order) => (
            <tr key={order.id} className="border-b border-border/60">
              <td className="py-1.5 pr-2 tabular-nums">#{order.id}</td>
              <td className="py-1.5 pr-2">{order.customer}</td>
              <td className="py-1.5 pr-2 text-right tabular-nums">
                {currency.format(order.total)}
              </td>
              <td className="py-1.5">
                {order.status === 'approved' ? (
                  <span className="text-positive">Approved</span>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void approve(order.id)}
                    className="rounded border border-border px-2 py-0.5 text-xs font-semibold hover:border-accent disabled:opacity-60"
                  >
                    Approve <span className="sr-only">order {order.id}</span>
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="py-6 text-center text-fg-muted">
              No orders.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

/**
 * Dual-run: the shadow adapter loads the same data in the background and the
 * results are compared. Divergence shows up before customers see it, at the
 * cost of doubled requests (visible in the log).
 */
const ParityCheck = ({
  primary,
  shadow,
  status,
}: {
  primary: OrdersPort
  shadow: OrdersPort
  status: OrderStatus | 'all'
}) => {
  const a = primary.useOrders(status)
  const b = shadow.useOrders(status)
  const settled = a.orders && b.orders && !a.isFetching && !b.isFetching
  const same = settled && JSON.stringify(a.orders) === JSON.stringify(b.orders)
  return (
    <p
      role="status"
      className={`text-sm ${!settled ? 'text-fg-muted' : same ? 'text-positive' : 'text-negative'}`}
    >
      {!settled
        ? `Comparing ${primary.name} with ${shadow.name}…`
        : same
          ? `Parity: ${shadow.name} returned identical data (${b.orders!.length} orders).`
          : `Mismatch: ${shadow.name} returned different data.`}
    </p>
  )
}

/**
 * The adapter-boundary sandbox from the case study: one `useOrders()` contract,
 * two implementations, a feature flag choosing between them, and a request
 * log showing they behave the same.
 */
export const OrdersSandbox = () => {
  const [{ server, rtk, tanstack }] = useState(() => {
    const instance = new OrdersServer()
    return {
      server: instance,
      rtk: createRtkOrders(instance),
      tanstack: createTanstackOrders(instance),
    }
  })
  const [useTanstack, setUseTanstack] = useState(false)
  const [shadow, setShadow] = useState(false)
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')
  const log = useSyncExternalStore(
    server.subscribe,
    server.getLog,
    server.getLog
  )
  const ids = { status: useId(), shadow: useId() }

  const primary = useTanstack ? tanstack.port : rtk.port
  const secondary = useTanstack ? rtk.port : tanstack.port

  return (
    <figure className="not-prose my-8 rounded-lg border border-border bg-surface p-4">
      <figcaption className="mb-4">
        <p className="font-semibold text-fg">
          Try it: one contract, two data layers
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          The table only knows{' '}
          <code className="font-mono">port.useOrders()</code>. Flip the flag to
          swap RTK Query for TanStack Query underneath it, approve an order with
          each, and compare the request log.
        </p>
      </figcaption>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={useTanstack}
            onClick={() => setUseTanstack((value) => !value)}
            className={`relative h-6 w-11 rounded-full border border-border motion-safe:transition-colors ${
              useTanstack ? 'bg-accent' : 'bg-canvas'
            }`}
          >
            <span className="sr-only">Flag: orders.tanstack-query</span>
            <span
              aria-hidden="true"
              className={`absolute top-0.5 left-0.5 size-4.5 rounded-full bg-fg motion-safe:transition-transform ${
                useTanstack ? 'translate-x-5 bg-on-accent' : ''
              }`}
            />
          </button>
          <span className="font-mono text-sm" aria-hidden="true">
            orders.tanstack-query
          </span>
        </div>

        <label htmlFor={ids.status} className="flex items-center gap-2 text-sm">
          Show
          <select
            id={ids.status}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as OrderStatus | 'all')
            }
            className="rounded-md border border-border bg-surface px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </label>

        <label htmlFor={ids.shadow} className="flex items-center gap-2 text-sm">
          <input
            id={ids.shadow}
            type="checkbox"
            checked={shadow}
            onChange={(event) => setShadow(event.target.checked)}
          />
          Shadow-run the other adapter
        </label>

        <button
          type="button"
          onClick={() => server.reset()}
          className="ml-auto rounded-md border border-border px-3 py-1 text-sm font-semibold hover:border-accent"
        >
          Reset
        </button>
      </div>

      <rtk.Provider>
        <tanstack.Provider>
          <div className="mt-4 grid gap-6 lg:grid-cols-[3fr_2fr]">
            <div className="min-w-0 space-y-3">
              {/* Keyed by adapter: switching remounts the screen, like a flag flip on page load. */}
              <OrdersPanel key={primary.name} port={primary} status={status} />
              {shadow && (
                <ParityCheck
                  primary={primary}
                  shadow={secondary}
                  status={status}
                />
              )}
            </div>
            <div className="min-w-0">
              <table className="w-full text-left font-mono text-xs">
                <caption className="mb-2 text-left font-sans text-sm text-fg-muted">
                  Request log (newest first)
                </caption>
                <thead>
                  <tr className="border-b border-border font-sans text-fg-muted">
                    <th scope="col" className="py-1 pr-2 font-semibold">
                      Time
                    </th>
                    <th scope="col" className="py-1 pr-2 font-semibold">
                      Adapter
                    </th>
                    <th scope="col" className="py-1 font-semibold">
                      Request
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {log.length ? (
                    log.slice(0, 10).map((entry) => (
                      <tr key={entry.id} className="border-b border-border/60">
                        <td className="py-1 pr-2 whitespace-nowrap">
                          {time.format(entry.at)}
                        </td>
                        <td className="py-1 pr-2 whitespace-nowrap">
                          {entry.adapter === 'RTK Query' ? 'RTK' : 'TanStack'}
                        </td>
                        <td className="py-1 break-all">
                          {entry.method} {entry.url}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-3 font-sans text-fg-muted">
                        No requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </tanstack.Provider>
      </rtk.Provider>
    </figure>
  )
}
