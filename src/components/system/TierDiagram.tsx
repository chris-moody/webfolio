import { ScrollRegion } from '@/components/ScrollRegion'
/** Reference → Semantic → Component → consumers, as a static SVG with a text equivalent. */
const boxes = [
  {
    x: 0,
    title: 'Reference',
    lines: ['OKLCH ramps', 'space · radius', 'type · motion'],
  },
  {
    x: 190,
    title: 'Semantic',
    lines: ['canvas · fg · accent', 'per mode', '+ resolveAccent()'],
  },
  {
    x: 380,
    title: 'Component',
    lines: ['button · focus', 'carousel dot', 'flash'],
  },
]

export const TierDiagram = () => (
  <figure className="my-6 rounded-lg border border-border bg-surface p-4">
    <ScrollRegion label="Token tiers diagram">
      <svg
        viewBox="0 0 680 190"
        className="w-full min-w-[36rem]"
        role="img"
        aria-labelledby="tiers-caption"
      >
        <defs>
          <marker
            id="tier-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" className="fill-fg-muted" />
          </marker>
        </defs>
        {boxes.map((box, i) => (
          <g key={box.title}>
            <rect
              x={box.x}
              y={20}
              width={160}
              height={110}
              rx={10}
              className="fill-canvas stroke-border"
            />
            <text
              x={box.x + 80}
              y={48}
              textAnchor="middle"
              className="fill-fg text-[15px] font-semibold"
            >
              {box.title}
            </text>
            {box.lines.map((line, j) => (
              <text
                key={line}
                x={box.x + 80}
                y={74 + j * 20}
                textAnchor="middle"
                className="fill-fg-muted text-[12px]"
              >
                {line}
              </text>
            ))}
            {i < boxes.length - 1 && (
              <line
                x1={box.x + 162}
                y1={75}
                x2={box.x + 188}
                y2={75}
                strokeWidth={2}
                className="stroke-fg-muted"
                markerEnd="url(#tier-arrow)"
              />
            )}
          </g>
        ))}
        <line
          x1={542}
          y1={60}
          x2={578}
          y2={40}
          strokeWidth={2}
          className="stroke-fg-muted"
          markerEnd="url(#tier-arrow)"
        />
        <line
          x1={542}
          y1={90}
          x2={578}
          y2={112}
          strokeWidth={2}
          className="stroke-fg-muted"
          markerEnd="url(#tier-arrow)"
        />
        <rect
          x={580}
          y={20}
          width={100}
          height={42}
          rx={8}
          className="fill-accent"
        />
        <text
          x={630}
          y={46}
          textAnchor="middle"
          className="fill-on-accent text-[13px] font-semibold"
        >
          Tailwind
        </text>
        <rect
          x={580}
          y={92}
          width={100}
          height={42}
          rx={8}
          className="fill-accent"
        />
        <text
          x={630}
          y={118}
          textAnchor="middle"
          className="fill-on-accent text-[13px] font-semibold"
        >
          MUI
        </text>
        <text
          x={340}
          y={170}
          textAnchor="middle"
          className="fill-fg-muted text-[12px]"
        >
          src/tokens/ (TypeScript) → tokens.generated.css (CSS variables +
          @theme) and createTourTheme()
        </text>
      </svg>
    </ScrollRegion>
    <figcaption id="tiers-caption" className="mt-3 text-sm text-fg-muted">
      Three tiers in one TypeScript source. Reference values (OKLCH color ramps,
      spacing, radii, type, motion) feed semantic tokens (what a color is for,
      per mode). The accent is resolved for contrast at this tier. Component
      tokens derive from semantics. The same source generates the CSS variables
      Tailwind reads and the theme MUI uses.
    </figcaption>
  </figure>
)
