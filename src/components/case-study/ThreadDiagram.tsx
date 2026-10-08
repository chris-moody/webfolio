/**
 * Two timelines of the same work: everything on the main thread (one long
 * task, input waits) versus parsing and aggregation in a worker (the main
 * thread only paints). Static SVG on the site's tokens; the text below it
 * carries the same information for screen readers.
 */

interface Block {
  x: number
  w: number
  label: string
  tone: 'work' | 'paint' | 'input'
}

const tones = {
  work: 'fill-accent',
  paint: 'fill-fg-muted',
  input: 'fill-danger',
} as const

const Lane = ({
  y,
  name,
  blocks,
}: {
  y: number
  name: string
  blocks: Block[]
}) => (
  <g>
    <text x={0} y={y + 15} className="fill-fg text-[11px]">
      {name}
    </text>
    <line x1={110} x2={600} y1={y + 11} y2={y + 11} className="stroke-border" />
    {blocks.map((block) => (
      <g key={`${block.x}-${block.label}`}>
        <rect
          x={110 + block.x}
          y={y}
          width={block.w}
          height={22}
          rx={3}
          className={tones[block.tone]}
        />
        {block.w > 40 && (
          <text
            x={110 + block.x + 6}
            y={y + 15}
            className="fill-on-accent text-[10px] font-semibold"
          >
            {block.label}
          </text>
        )}
      </g>
    ))}
  </g>
)

const paints = (start: number, every: number, until: number): Block[] =>
  Array.from({ length: Math.floor((until - start) / every) }, (_, i) => ({
    x: start + i * every,
    w: 10,
    label: 'paint',
    tone: 'paint',
  }))

export const ThreadDiagram = () => (
  <figure className="my-8">
    <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4">
      <svg
        viewBox="0 0 600 190"
        className="w-full min-w-[32rem]"
        aria-hidden="true"
      >
        <text x={0} y={12} className="fill-fg text-[12px] font-semibold">
          Before: one thread does everything
        </text>
        <Lane
          y={22}
          name="Main thread"
          blocks={[
            { x: 0, w: 120, label: 'parse', tone: 'work' },
            { x: 122, w: 150, label: 'aggregate + layout', tone: 'work' },
            { x: 274, w: 60, label: 'render', tone: 'work' },
            { x: 336, w: 10, label: 'paint', tone: 'paint' },
            ...paints(360, 24, 490),
          ]}
        />
        <Lane
          y={52}
          name="Input"
          blocks={[{ x: 60, w: 6, label: 'click', tone: 'input' }]}
        />
        <text x={176} y={92} className="fill-fg-muted text-[10px]">
          the click is handled only after the whole task ends
        </text>

        <text x={0} y={122} className="fill-fg text-[12px] font-semibold">
          After: the main thread only paints
        </text>
        <Lane
          y={132}
          name="Worker"
          blocks={[
            { x: 0, w: 120, label: 'parse', tone: 'work' },
            { x: 122, w: 150, label: 'aggregate', tone: 'work' },
          ]}
        />
        <Lane y={162} name="Main thread" blocks={paints(0, 24, 490)} />
      </svg>
    </div>
    <figcaption className="mt-2 text-sm text-fg-muted">
      Before, parsing, aggregation, and rendering run as one long task on the
      main thread, so a click during it waits until all of it finishes. After,
      the worker does the parsing and aggregation while the main thread keeps
      painting every frame and answers input immediately; it receives only the
      finished result. (Schematic, not to scale.)
    </figcaption>
  </figure>
)
