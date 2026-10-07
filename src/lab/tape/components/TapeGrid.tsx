import {
  type Column,
  type ColumnVisibilityState,
  FlexRender,
  type Row,
  columnVisibilityFeature,
  createColumnHelper,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  type KeyboardEvent,
  memo,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { HISTORY_LENGTH } from '../engine/market'
import type { TapeRow } from '../rows'
import {
  formatChange,
  formatPercent,
  formatPrice,
  formatVolume,
} from '../format'

const features = tableFeatures({ rowSortingFeature, columnVisibilityFeature })
const helper = createColumnHelper<typeof features, TapeRow>()

const Flash = ({ row, children }: { row: TapeRow; children: string }) => (
  // Keyed by sequence number: a new update remounts the span and restarts the flash.
  <span
    key={row.seq}
    className={`rounded px-1 ${row.dir > 0 ? 'tape-up' : row.dir < 0 ? 'tape-down' : ''}`}
  >
    {children}
  </span>
)

const Signed = ({ value, children }: { value: number; children: string }) => (
  <span
    className={value > 0 ? 'text-positive' : value < 0 ? 'text-negative' : ''}
  >
    {children}
  </span>
)

const SPARK_WIDTH = 96
const SPARK_HEIGHT = 22

/**
 * Trend sparkline as an SVG polyline. (The first version used one <canvas>
 * per row; each became a compositing layer, which cost ~12 ms per scrolled
 * frame under 4x CPU throttling. SVG paints inline with the row.)
 */
const Spark = memo(
  function Spark({
    history,
    dir,
  }: {
    history: Float32Array
    seq: number
    dir: number
  }) {
    let min = Infinity
    let max = -Infinity
    for (const value of history) {
      if (Number.isNaN(value)) continue
      if (value < min) min = value
      if (value > max) max = value
    }
    if (!Number.isFinite(min)) return null
    const range = max - min || 1
    let points = ''
    history.forEach((value, i) => {
      if (Number.isNaN(value)) return
      const x = (i / (HISTORY_LENGTH - 1)) * SPARK_WIDTH
      const y = SPARK_HEIGHT - 2 - ((value - min) / range) * (SPARK_HEIGHT - 4)
      points += `${x.toFixed(1)},${y.toFixed(1)} `
    })
    return (
      <svg
        width={SPARK_WIDTH}
        height={SPARK_HEIGHT}
        aria-hidden="true"
        className="block"
      >
        <polyline
          points={points}
          fill="none"
          strokeWidth={1.5}
          className={dir < 0 ? 'stroke-negative' : 'stroke-positive'}
        />
      </svg>
    )
  },
  // Recompute only when the symbol actually traded.
  (previous, next) => previous.seq === next.seq && previous.dir === next.dir
)

const columns = helper.columns([
  helper.accessor('symbol', {
    id: 'symbol',
    header: 'Symbol',
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    enableHiding: false,
  }),
  helper.accessor('name', {
    id: 'name',
    header: 'Name',
    enableSorting: false,
    cell: (info) => (
      <span className="truncate text-fg-muted">{info.getValue() ?? '…'}</span>
    ),
  }),
  helper.accessor((row) => row.values.last, {
    id: 'last',
    header: 'Last',
    cell: (info) => (
      <Flash row={info.row.original}>{formatPrice(info.getValue())}</Flash>
    ),
  }),
  helper.accessor((row) => row.values.change, {
    id: 'change',
    header: 'Chg',
    cell: (info) => (
      <Signed value={info.getValue()}>{formatChange(info.getValue())}</Signed>
    ),
  }),
  helper.accessor((row) => row.values.changePct, {
    id: 'changePct',
    header: 'Chg %',
    cell: (info) => (
      <Signed value={info.getValue()}>{formatPercent(info.getValue())}</Signed>
    ),
  }),
  helper.accessor((row) => row.values.bid, {
    id: 'bid',
    header: 'Bid',
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.accessor((row) => row.values.ask, {
    id: 'ask',
    header: 'Ask',
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.accessor((row) => row.values.high, {
    id: 'high',
    header: 'High',
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.accessor((row) => row.values.low, {
    id: 'low',
    header: 'Low',
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.accessor((row) => row.values.volume, {
    id: 'volume',
    header: 'Volume',
    cell: (info) => formatVolume(info.getValue()),
  }),
  helper.accessor((row) => row.values.vwap, {
    id: 'vwap',
    header: 'VWAP',
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.display({
    id: 'trend',
    header: 'Trend',
    cell: (info) => {
      const row = info.row.original
      return <Spark history={row.history} seq={row.seq} dir={row.dir} />
    },
  }),
])

/** Column widths (px) and alignment for the CSS grid layout. */
const LAYOUT: Record<string, { width: number; numeric?: boolean }> = {
  symbol: { width: 84 },
  name: { width: 180 },
  last: { width: 96, numeric: true },
  change: { width: 80, numeric: true },
  changePct: { width: 84, numeric: true },
  bid: { width: 88, numeric: true },
  ask: { width: 88, numeric: true },
  high: { width: 88, numeric: true },
  low: { width: 88, numeric: true },
  volume: { width: 84, numeric: true },
  vwap: { width: 88, numeric: true },
  trend: { width: 112 },
}

const ROW_HEIGHT = 32

interface GridRowProps {
  index: number
  offset: number
  row: Row<typeof features, TapeRow> | undefined
  columns: Column<typeof features, TapeRow>[]
  template: string
  /** Active column when this is the active row, otherwise -1. */
  activeCol: number
}

/**
 * One virtual row. Memoized on what can change its output: rows re-render only
 * when their symbol trades, they move, or layout/focus changes. At 5k trades/s
 * across 10k symbols that's a few percent of visible rows per packet.
 */
const GridRow = memo(
  function GridRow({
    index,
    offset,
    row,
    columns,
    template,
    activeCol,
  }: GridRowProps) {
    return (
      <div
        role="row"
        aria-rowindex={index + 2}
        className={`absolute left-0 grid w-full items-center border-b border-border/60 ${
          activeCol >= 0 ? 'group-focus-visible:bg-canvas' : ''
        }`}
        // Rows are placed with `top`, not `transform`: per-row transforms gave
        // each row its own compositing layer, and layerizing ~40 layers cost
        // ~9 ms a frame under 4x CPU throttling (see ARCHITECTURE.md).
        style={{
          height: ROW_HEIGHT,
          top: offset,
          gridTemplateColumns: template,
          contain: 'layout style',
        }}
      >
        {row
          ? row.getVisibleCells().map((cell, col) => (
              <div
                key={cell.column.id}
                id={`tape-cell-${index}-${cell.column.id}`}
                role="gridcell"
                className={`overflow-hidden px-2 whitespace-nowrap tabular-nums ${
                  LAYOUT[cell.column.id]?.numeric ? 'text-right' : ''
                } ${
                  col === activeCol
                    ? 'group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 group-focus-visible:outline-focus'
                    : ''
                }`}
              >
                <FlexRender cell={cell} />
              </div>
            ))
          : columns.map((column) => (
              <div
                key={column.id}
                id={`tape-cell-${index}-${column.id}`}
                role="gridcell"
                className="px-2 text-fg-muted"
              >
                …
              </div>
            ))}
      </div>
    )
  },
  (previous, next) =>
    previous.index === next.index &&
    previous.offset === next.offset &&
    previous.template === next.template &&
    previous.activeCol === next.activeCol &&
    previous.row?.original.key === next.row?.original.key &&
    previous.row?.original.seq === next.row?.original.seq &&
    previous.row?.original.name === next.row?.original.name
)

export interface TapeGridProps {
  rows: TapeRow[]
  total: number
  start: number
  loading: boolean
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  columnVisibility: ColumnVisibilityState
  onViewportChange: (start: number, end: number) => void
  onActiveRowChange?: (row: TapeRow | undefined) => void
}

export const TapeGrid = ({
  rows,
  total,
  start,
  loading,
  sorting,
  onSortingChange,
  columnVisibility,
  onViewportChange,
  onActiveRowChange,
}: TapeGridProps) => {
  const table = useTable({
    features,
    columns,
    data: rows,
    getRowId: (row) => String(row.key),
    // The engine sorts the full dataset; the table only renders the window.
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting, columnVisibility },
    onSortingChange: (updater) =>
      onSortingChange(
        typeof updater === 'function' ? updater(sorting) : updater
      ),
  })

  const scroller = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual returns unstable functions; this project doesn't run the React Compiler.
  const virtualizer = useVirtualizer({
    count: total,
    getScrollElement: () => scroller.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    onChange: (instance) => {
      const range = instance.range
      if (range)
        onViewportChange(Math.max(0, range.startIndex - 8), range.endIndex + 9)
    },
  })

  const visibleColumns = table.getVisibleLeafColumns()
  const template = visibleColumns
    .map((column) => `${LAYOUT[column.id]?.width ?? 96}px`)
    .join(' ')
  const width = visibleColumns.reduce(
    (sum, column) => sum + (LAYOUT[column.id]?.width ?? 96),
    0
  )
  const modelRows = table.getRowModel().rows

  // Keyboard model: the grid keeps focus and points at the active cell with
  // aria-activedescendant, so virtualized rows can come and go safely.
  const [active, setActive] = useState({ row: 0, col: 0 })
  const activeRow = Math.min(active.row, Math.max(0, total - 1))
  const activeCol = Math.min(active.col, visibleColumns.length - 1)
  const activeId = total
    ? `tape-cell-${activeRow}-${visibleColumns[activeCol]?.id}`
    : undefined
  const activeData = modelRows[activeRow - start]?.original
  const reported = useRef<number | undefined>(undefined)
  useLayoutEffect(() => {
    if (reported.current !== activeData?.key) {
      reported.current = activeData?.key
      onActiveRowChange?.(activeData)
    }
  })

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const page = Math.max(
      1,
      Math.floor((scroller.current?.clientHeight ?? 320) / ROW_HEIGHT) - 1
    )
    const lastRow = Math.max(0, total - 1)
    const lastCol = visibleColumns.length - 1
    const moves: Record<string, () => { row: number; col: number }> = {
      ArrowDown: () => ({
        row: Math.min(lastRow, activeRow + 1),
        col: activeCol,
      }),
      ArrowUp: () => ({ row: Math.max(0, activeRow - 1), col: activeCol }),
      ArrowRight: () => ({
        row: activeRow,
        col: Math.min(lastCol, activeCol + 1),
      }),
      ArrowLeft: () => ({ row: activeRow, col: Math.max(0, activeCol - 1) }),
      PageDown: () => ({
        row: Math.min(lastRow, activeRow + page),
        col: activeCol,
      }),
      PageUp: () => ({ row: Math.max(0, activeRow - page), col: activeCol }),
      Home: () =>
        event.ctrlKey || event.metaKey
          ? { row: 0, col: 0 }
          : { row: activeRow, col: 0 },
      End: () =>
        event.ctrlKey || event.metaKey
          ? { row: lastRow, col: lastCol }
          : { row: activeRow, col: lastCol },
    }
    const move = moves[event.key]
    if (!move || !total) return
    event.preventDefault()
    const next = move()
    setActive(next)
    virtualizer.scrollToIndex(next.row, { align: 'auto' })
  }

  return (
    <div
      ref={scroller}
      role="grid"
      aria-label="Live quotes"
      aria-rowcount={total + 1}
      aria-colcount={visibleColumns.length}
      aria-busy={loading}
      aria-activedescendant={activeId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="group relative h-[28rem] overflow-auto rounded-lg border border-border bg-surface text-sm focus-visible:outline-3 focus-visible:outline-focus"
    >
      <div style={{ width, minWidth: '100%' }}>
        <div
          role="rowgroup"
          className="sticky top-0 z-10 border-b border-border bg-surface"
        >
          {table.getHeaderGroups().map((group) => (
            <div
              key={group.id}
              role="row"
              aria-rowindex={1}
              className="grid"
              style={{ gridTemplateColumns: template }}
            >
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                const numeric = LAYOUT[header.column.id]?.numeric
                const label = <table.FlexRender header={header} />
                return (
                  <div
                    key={header.id}
                    role="columnheader"
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                    className={`px-2 py-2 font-semibold text-fg-muted ${numeric ? 'text-right' : 'text-left'}`}
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={`inline-flex items-center gap-1 rounded hover:text-fg ${numeric ? 'flex-row-reverse' : ''}`}
                      >
                        {label}
                        <span aria-hidden="true" className="w-3 text-accent">
                          {sorted === 'asc'
                            ? '▲'
                            : sorted === 'desc'
                              ? '▼'
                              : ''}
                        </span>
                      </button>
                    ) : (
                      label
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div
          role="rowgroup"
          className="relative"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => (
            <GridRow
              key={item.key}
              index={item.index}
              offset={item.start}
              row={modelRows[item.index - start]}
              columns={visibleColumns}
              template={template}
              activeCol={item.index === activeRow ? activeCol : -1}
            />
          ))}
        </div>
      </div>
      {!total && (
        <p className="absolute inset-x-0 top-16 text-center text-fg-muted">
          {loading ? 'Starting the engine…' : 'No symbols match the filter.'}
        </p>
      )}
    </div>
  )
}
