import type { ReactNode } from 'react'

/** A vertical timeline for a case study: `<Timeline><TimelineItem when="…">…`. */
export const Timeline = ({ children }: { children: ReactNode }) => (
  <ol className="my-8 border-l-2 border-border pl-6">{children}</ol>
)

export const TimelineItem = ({
  when,
  title,
  children,
}: {
  when: ReactNode
  title: string
  children?: ReactNode
}) => (
  <li className="relative mb-6 last:mb-0">
    <span
      aria-hidden="true"
      className="absolute top-1.5 -left-[1.95rem] h-3 w-3 rounded-full border-2 border-accent bg-canvas"
    />
    <p className="text-sm font-semibold tracking-wide text-accent uppercase">
      {when}
    </p>
    <p className="mt-0.5 font-semibold text-fg">{title}</p>
    {children && <div className="mt-1 text-fg-muted">{children}</div>}
  </li>
)
