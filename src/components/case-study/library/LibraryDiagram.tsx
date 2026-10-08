/**
 * Dependency diagram for the shared-library case study: the primary portal
 * and two new apps each carrying their own copies of the same code, against
 * all three depending on one package. Schematic; the caption carries the
 * content for screen readers.
 */

const APPS = ['Primary portal', 'New app 1', 'New app 2']

// Without a library: the same code, copied and renamed in each new app.
const DRIFT = [
  ['MUI theme', 'AppHeader'],
  ['theme (copied)', 'Header'],
  ['theme (copied)', 'TopNav'],
]

const Box = ({
  x,
  y,
  w,
  h,
  title,
  items,
  strong = false,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  items: string[]
  strong?: boolean
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      className={
        strong
          ? 'fill-accent-subtle stroke-accent'
          : 'fill-canvas stroke-border'
      }
      strokeWidth={strong ? 2 : 1}
    />
    <text x={x + 10} y={y + 20} className="fill-fg text-[12px] font-semibold">
      {title}
    </text>
    {items.map((item, i) => (
      <g key={item}>
        <rect
          x={x + 10}
          y={y + 30 + i * 24}
          width={w - 20}
          height={19}
          rx={4}
          className="fill-surface stroke-border"
        />
        <text
          x={x + 18}
          y={y + 43 + i * 24}
          className="fill-fg-muted font-mono text-[10px]"
        >
          {item}
        </text>
      </g>
    ))}
  </g>
)

export const LibraryDiagram = () => (
  <figure className="my-8">
    <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4">
      <svg
        viewBox="0 0 640 300"
        className="w-full min-w-[34rem]"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="library-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" className="fill-fg-muted" />
          </marker>
        </defs>

        <text x={0} y={14} className="fill-fg text-[13px] font-semibold">
          Without a library: each app copies
        </text>
        {APPS.map((app, i) => (
          <Box
            key={app}
            x={0}
            y={28 + i * 92}
            w={180}
            h={84}
            title={app}
            items={DRIFT[i]!}
          />
        ))}

        <text x={300} y={14} className="fill-fg text-[13px] font-semibold">
          With one: every app uses one package
        </text>
        {APPS.map((app, i) => (
          <g key={app}>
            <rect
              x={300}
              y={40 + i * 80}
              width={130}
              height={44}
              rx={8}
              className="fill-canvas stroke-border"
            />
            <text
              x={312}
              y={66 + i * 80}
              className="fill-fg text-[12px] font-semibold"
            >
              {app}
            </text>
            <line
              x1={430}
              y1={62 + i * 80}
              x2={488}
              y2={118 + i * 32}
              className="stroke-fg-muted"
              markerEnd="url(#library-arrow)"
            />
          </g>
        ))}
        <Box
          x={492}
          y={70}
          w={148}
          h={136}
          title="Shared library"
          items={['MUI theme', 'layout + UI', 'Redux slices', 'RTK Query APIs']}
          strong
        />
      </svg>
    </div>
    <figcaption className="mt-2 text-sm text-fg-muted">
      Without a shared library, the two new apps start from copies of the
      primary portal's theme and layout, renamed and drifting apart, so every
      fix and design change has to be made three times. With one, all three apps
      depend on a single package holding the MUI theme, layout and UI
      components, Redux slices, and RTK Query APIs. (Schematic; the component
      names are illustrative.)
    </figcaption>
  </figure>
)
