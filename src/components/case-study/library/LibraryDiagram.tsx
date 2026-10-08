/**
 * Before/after dependency diagram for the shared-library case study: three
 * apps that each grew their own copies of the same components, then the same
 * apps depending on one package. Schematic; the caption carries the content
 * for screen readers.
 */

const APPS = ['Team A app', 'Team B app', 'Team C app']

// Before: the "same" component under three names and three implementations.
const DRIFT = [
  ['Button', 'DataTable'],
  ['Btn', 'ResultsTable'],
  ['PrimaryButton', 'Grid'],
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
          Before: every team builds its own
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
          After: every team uses one package
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
          items={['Button', 'DataTable', 'Modal', 'design tokens']}
          strong
        />
      </svg>
    </div>
    <figcaption className="mt-2 text-sm text-fg-muted">
      Before, each of three apps had its own button and table, under different
      names and with different behavior, so every fix and every design change
      had to be made three times. After, all three depend on one shared package
      of components built on shared design tokens. (Schematic; the app and
      component names are illustrative.)
    </figcaption>
  </figure>
)
