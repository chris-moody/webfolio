import type { ColumnVisibilityState, SortingState } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { DEFAULT_CONFIG, RATES, SIZES } from '../config'
import type { SortKey } from '../engine/query'
import { FrameMeter } from '../FrameMeter'
import { formatPercent, formatPrice } from '../format'
import type { HostMode } from '../hosts'
import { referenceQuery } from '../reference'
import { TapeStore, type TapeSnapshot } from '../store'
import { COLUMN_IDS, frameRows, type TapeRow } from '../rows'
import { TapeGrid } from './TapeGrid'

const EMPTY: TapeSnapshot = {
  frame: null,
  symbols: [],
  mode: 'worker',
  config: DEFAULT_CONFIG,
  paused: false,
}
const ANNOUNCE_INTERVAL_MS = 5_000

const labels: Record<string, string> = {
  symbol: 'Symbol',
  name: 'Name',
  last: 'Last',
  change: 'Change',
  changePct: 'Change %',
  bid: 'Bid',
  ask: 'Ask',
  high: 'High',
  low: 'Low',
  volume: 'Volume',
  vwap: 'VWAP',
  trend: 'Trend',
}

export const TapeDemo = () => {
  // Constructing the store has no side effects; the worker and the meter
  // start in the effect, so they only ever run in the browser.
  const [store] = useState(() => new TapeStore(DEFAULT_CONFIG, 'worker'))
  const meterRoot = useRef<HTMLDivElement>(null)
  const meter = useRef<FrameMeter | null>(null)

  useEffect(() => {
    if (meterRoot.current) {
      meter.current = new FrameMeter(meterRoot.current)
      meter.current.start()
    }
    store.setFrameListener((frame) =>
      meter.current?.record({
        ticksPerSecond: frame.stats.ticksPerSecond,
        bytes: frame.bytes,
        tickMs: frame.stats.tickMs,
        sortMs: frame.stats.sortMs,
      })
    )
    void store.start()
    return () => {
      store.dispose()
      meter.current?.stop()
      meter.current = null
    }
  }, [store])

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    emptySnapshot
  )
  const { frame, symbols, mode, config, paused } = snapshot

  const reference = useQuery(referenceQuery(config.seed, config.symbols))

  const [sorting, setSorting] = useState<SortingState>([])
  const [filter, setFilter] = useState('')
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({ high: false, low: false })
  useEffect(() => {
    const first = sorting[0]
    store.setQuery({
      sort: first ? { key: first.id as SortKey, desc: first.desc } : null,
      filter,
    })
  }, [store, sorting, filter])

  const rows = useMemo(
    () => frameRows(frame, symbols, reference.data),
    [frame, symbols, reference.data]
  )

  const setMode = (next: HostMode) => {
    meter.current?.reset()
    void store.setMode(next)
  }

  // Opt-in announcements for the focused row, throttled so screen readers
  // never get the stream.
  const [announce, setAnnounce] = useState(false)
  const [message, setMessage] = useState('')
  // The grid reports which symbol is focused; the timer reads that symbol's
  // latest values from the most recent rows.
  const activeKey = useRef<number | undefined>(undefined)
  const latestRows = useRef<TapeRow[]>([])
  useEffect(() => {
    latestRows.current = rows
  }, [rows])
  useEffect(() => {
    if (!announce) return
    const timer = setInterval(() => {
      const row = latestRows.current.find(
        (candidate) => candidate.key === activeKey.current
      )
      if (row) {
        setMessage(
          `${row.symbol} ${formatPrice(row.values.last)}, ${formatPercent(row.values.changePct)} on the day`
        )
      }
    }, ANNOUNCE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [announce])

  const ids = {
    rate: useId(),
    size: useId(),
    filter: useId(),
    announce: useId(),
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-end gap-4">
          <fieldset>
            <legend className="text-sm font-semibold">Engine runs on</legend>
            <div className="mt-1 flex overflow-hidden rounded-md border border-border">
              {(['worker', 'main'] as const).map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer px-3 py-1.5 text-sm has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus ${
                    mode === option
                      ? 'bg-accent text-on-accent'
                      : 'text-fg hover:bg-canvas'
                  }`}
                >
                  <input
                    type="radio"
                    name="engine-mode"
                    value={option}
                    checked={mode === option}
                    onChange={() => setMode(option)}
                    className="sr-only"
                  />
                  {option === 'worker' ? 'Web Worker' : 'Main thread'}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={ids.rate} className="block text-sm font-semibold">
              Trades / second
            </label>
            <select
              id={ids.rate}
              value={config.ticksPerSecond}
              onChange={(event) =>
                void store.setConfig({
                  ticksPerSecond: Number(event.target.value),
                })
              }
              className="mt-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
            >
              {RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={ids.size} className="block text-sm font-semibold">
              Symbols
            </label>
            <select
              id={ids.size}
              value={config.symbols}
              onChange={(event) =>
                void store.setConfig({ symbols: Number(event.target.value) })
              }
              className="mt-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
            >
              {SIZES.map((size) => (
                <option key={size} value={size}>
                  {size.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={ids.filter} className="block text-sm font-semibold">
              Filter symbols
            </label>
            <input
              id={ids.filter}
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="e.g. AB"
              autoComplete="off"
              spellCheck={false}
              className="mt-1 w-32 rounded-md border border-border bg-surface px-2 py-1.5 text-sm uppercase placeholder:normal-case"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => store.setPaused(!paused)}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:border-accent"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              type="button"
              onClick={() =>
                void store.setConfig({ seed: Math.floor(Math.random() * 1e9) })
              }
              className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:border-accent"
            >
              New market
            </button>
          </div>
        </div>

        <details className="text-sm md:justify-self-end">
          <summary className="cursor-pointer font-semibold">Columns</summary>
          <fieldset className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <legend className="sr-only">Visible columns</legend>
            {COLUMN_IDS.filter((id) => id !== 'symbol').map((id) => (
              <label key={id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={columnVisibility[id] !== false}
                  onChange={(event) =>
                    setColumnVisibility((current) => ({
                      ...current,
                      [id]: event.target.checked,
                    }))
                  }
                />
                {labels[id]}
              </label>
            ))}
          </fieldset>
        </details>
      </div>

      <TapeGrid
        rows={rows}
        total={frame?.total ?? 0}
        start={frame?.start ?? 0}
        loading={!frame}
        sorting={sorting}
        onSortingChange={setSorting}
        columnVisibility={columnVisibility}
        onViewportChange={(start, end) => store.setViewport(start, end)}
        onActiveRowChange={(row) => (activeKey.current = row?.key)}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-fg-muted">
        <p>
          {frame
            ? `${frame.total.toLocaleString()} of ${config.symbols.toLocaleString()} symbols`
            : 'Loading…'}
          {reference.isPending ? ' · loading reference data…' : ''}
          {frame ? ` · sort ${frame.stats.sortMs.toFixed(1)} ms` : ''}
        </p>
        <label htmlFor={ids.announce} className="flex items-center gap-2">
          <input
            id={ids.announce}
            type="checkbox"
            checked={announce}
            onChange={(event) => setAnnounce(event.target.checked)}
          />
          Announce the focused row’s price every 5 seconds
        </label>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce ? message : ''}
      </p>

      <section
        aria-labelledby="meter-title"
        className="rounded-lg border border-border bg-surface p-4"
      >
        <h2 id="meter-title" className="text-sm font-semibold">
          Frame meter{' '}
          <span className="font-normal text-fg-muted">
            (main thread, measured outside React; budget line at 16.7 ms)
          </span>
        </h2>
        <div ref={meterRoot} className="mt-2" />
      </section>
    </div>
  )
}

const emptySnapshot = () => EMPTY
