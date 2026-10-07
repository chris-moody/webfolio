/** Before/after code, side by side on wide screens. */
export const CodeCompare = ({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
}) => (
  <div className="my-6 grid gap-4 lg:grid-cols-2">
    {[
      [beforeLabel, before],
      [afterLabel, after],
    ].map(([label, code]) => (
      <figure key={label} className="min-w-0">
        <figcaption className="mb-1 text-sm font-semibold text-fg-muted">
          {label}
        </figcaption>
        {/* Focusable so keyboard users can scroll long lines (WCAG 2.1.1). */}
        <pre
          tabIndex={0}
          className="h-full overflow-x-auto rounded-lg border border-border bg-canvas p-4 font-mono text-sm leading-relaxed"
        >
          <code>{code!.trim()}</code>
        </pre>
      </figure>
    ))}
  </div>
)
