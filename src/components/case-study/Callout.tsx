import type { ReactNode } from 'react'

const tones = {
  note: 'border-accent bg-surface',
  tradeoff: 'border-fg-muted bg-surface',
} as const

/** An aside in a case study: a note, or an explicit tradeoff. */
export const Callout = ({
  title,
  tone = 'note',
  children,
}: {
  title: string
  tone?: keyof typeof tones
  children: ReactNode
}) => (
  <aside className={`my-6 rounded-lg border-l-4 p-4 ${tones[tone]}`}>
    <p className="font-semibold text-fg">{title}</p>
    <div className="mt-1 text-fg-muted [&>p]:my-2">{children}</div>
  </aside>
)
