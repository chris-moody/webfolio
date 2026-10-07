import type { ReactNode } from 'react'

/**
 * A horizontally scrollable container for wide content (tables, diagrams).
 * It's focusable and labelled so keyboard users can scroll it on narrow
 * screens (WCAG 2.1.1).
 */
export const ScrollRegion = ({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) => (
  <div
    role="region"
    aria-label={label}
    tabIndex={0}
    className={`overflow-x-auto focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus ${className}`}
  >
    {children}
  </div>
)
