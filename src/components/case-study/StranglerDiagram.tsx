import { ScrollRegion } from '@/components/ScrollRegion'
import { useState } from 'react'

const SURFACES = ['Orders', 'Reports', 'Search', 'Billing', 'Settings', 'Admin']

/** How many surfaces run on the new implementation at each stage. */
interface Stage {
  title: string
  description: string
  migrated: number
  /** Surfaces whose new implementation exists but is still behind a flag. */
  flagged: number
  boundary: boolean
  legacy: boolean
}

const STAGES: Stage[] = [
  {
    title: 'Legacy',
    description:
      'Every surface calls the old implementation directly. Nothing can move without touching everything.',
    migrated: 0,
    flagged: 0,
    boundary: false,
    legacy: true,
  },
  {
    title: 'Draw the seam',
    description:
      'Introduce one interface (an adapter boundary) and route every surface through it. Behavior is unchanged: the legacy implementation sits behind the interface.',
    migrated: 0,
    flagged: 0,
    boundary: true,
    legacy: true,
  },
  {
    title: 'Ship dark, flip per surface',
    description:
      'Build the new implementation behind the same interface. It ships disabled; a flag turns it on one surface at a time, and turning the flag off is the rollback.',
    migrated: 2,
    flagged: 2,
    boundary: true,
    legacy: true,
  },
  {
    title: 'Most traffic migrated',
    description:
      'Flags are on for most surfaces. Lint rules block new imports of the legacy layer, so the migration can only move forward while feature work continues.',
    migrated: 5,
    flagged: 1,
    boundary: true,
    legacy: true,
  },
  {
    title: 'Remove the old path',
    description:
      'With every surface on the new implementation, delete the legacy code and the flags. The interface stays as the seam for the next migration.',
    migrated: 6,
    flagged: 0,
    boundary: true,
    legacy: false,
  },
]

const BOX_W = 104
const GAP = 12
const WIDTH = SURFACES.length * BOX_W + (SURFACES.length - 1) * GAP

/** Step-through strangler-fig migration diagram. */
export const StranglerDiagram = () => {
  const [index, setIndex] = useState(0)
  const stage = STAGES[index]!

  return (
    <figure className="my-8 rounded-lg border border-border bg-surface p-4">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Migration stage"
      >
        {STAGES.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
              i === index
                ? 'border-accent bg-accent text-on-accent'
                : 'border-border text-fg hover:border-accent'
            }`}
          >
            {i + 1}. {item.title}
          </button>
        ))}
      </div>

      <ScrollRegion label="Migration diagram" className="mt-4">
        <svg
          viewBox={`0 -4 ${WIDTH} 250`}
          className="w-full min-w-[34rem]"
          aria-hidden="true"
        >
          {SURFACES.map((name, i) => {
            const x = i * (BOX_W + GAP)
            const migrated = i < stage.migrated
            const flagged = migrated && i >= stage.migrated - stage.flagged
            return (
              <g key={name}>
                <rect
                  x={x}
                  y={0}
                  width={BOX_W}
                  height={44}
                  rx={8}
                  className="fill-canvas stroke-border"
                />
                <text
                  x={x + BOX_W / 2}
                  y={27}
                  textAnchor="middle"
                  className="fill-fg text-[13px] font-semibold"
                >
                  {name}
                </text>
                {/* Path from the surface down to whichever implementation serves it. */}
                <line
                  x1={x + BOX_W / 2}
                  y1={44}
                  x2={x + BOX_W / 2}
                  y2={migrated ? 186 : 136}
                  strokeWidth={2}
                  className={`motion-safe:transition-all motion-safe:duration-500 ${
                    migrated ? 'stroke-accent' : 'stroke-fg-muted'
                  }`}
                />
                {flagged && (
                  <g>
                    <rect
                      x={x + BOX_W / 2 + 6}
                      y={56}
                      width={40}
                      height={18}
                      rx={9}
                      className="fill-accent"
                    />
                    <text
                      x={x + BOX_W / 2 + 26}
                      y={69}
                      textAnchor="middle"
                      className="fill-on-accent text-[10px] font-bold"
                    >
                      FLAG
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          <g
            className={`motion-safe:transition-opacity motion-safe:duration-500 ${stage.boundary ? 'opacity-100' : 'opacity-0'}`}
          >
            <rect
              x={0}
              y={88}
              width={WIDTH}
              height={30}
              rx={6}
              className="fill-surface stroke-accent"
              strokeDasharray="6 4"
            />
            <text
              x={WIDTH / 2}
              y={108}
              textAnchor="middle"
              className="fill-accent text-[12px] font-semibold"
            >
              Adapter boundary (one interface)
            </text>
          </g>

          <g
            className={`motion-safe:transition-opacity motion-safe:duration-500 ${stage.legacy ? 'opacity-100' : 'opacity-15'}`}
          >
            <rect
              x={0}
              y={136}
              width={WIDTH}
              height={34}
              rx={6}
              className="fill-canvas stroke-fg-muted"
            />
            <text
              x={WIDTH / 2}
              y={158}
              textAnchor="middle"
              className="fill-fg-muted text-[12px] font-semibold"
            >
              {stage.legacy
                ? 'Legacy implementation'
                : 'Legacy implementation (deleted)'}
            </text>
          </g>
          <rect
            x={0}
            y={186}
            width={WIDTH}
            height={34}
            rx={6}
            className="fill-canvas stroke-accent"
          />
          <text
            x={WIDTH / 2}
            y={208}
            textAnchor="middle"
            className="fill-accent text-[12px] font-semibold"
          >
            New implementation
          </text>
        </svg>
      </ScrollRegion>

      <figcaption aria-live="polite" className="mt-3">
        <p className="font-semibold text-fg">
          Stage {index + 1} of {STAGES.length}: {stage.title}
        </p>
        <p className="mt-1 text-fg-muted">{stage.description}</p>
        <p className="mt-1 text-sm text-fg-muted">
          {stage.migrated} of {SURFACES.length} surfaces on the new
          implementation
          {stage.flagged ? `, ${stage.flagged} still behind a flag` : ''}.
        </p>
      </figcaption>
    </figure>
  )
}
