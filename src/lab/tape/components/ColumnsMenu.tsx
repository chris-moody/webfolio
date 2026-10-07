import type { ColumnVisibilityState } from '@tanstack/react-table'
import { type ToggleEvent, useEffect, useId, useRef, useState } from 'react'

export interface ColumnsMenuProps {
  columns: { id: string; label: string }[]
  visibility: ColumnVisibilityState
  onChange: (id: string, visible: boolean) => void
}

/**
 * Column chooser built on the native Popover API: the panel renders in the
 * top layer (no layout shift), and the browser provides light dismiss,
 * Escape to close, and the button's expanded state. No menu library needed.
 */
export const ColumnsMenu = ({
  columns,
  visibility,
  onChange,
}: ColumnsMenuProps) => {
  const id = useId()
  const button = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const hidden = columns.filter(
    (column) => visibility[column.id] === false
  ).length

  // Keep the panel next to its button while open: below and right-aligned,
  // flipping above when there isn't room below (e.g. low on a phone screen).
  const place = () => {
    if (!button.current || !panel.current) return
    const anchor = button.current.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = panel.current
    const gap = 6
    const margin = 8
    const fitsBelow =
      anchor.bottom + gap + height <= window.innerHeight - margin
    const top = fitsBelow ? anchor.bottom + gap : anchor.top - gap - height
    const left = Math.max(
      margin,
      Math.min(anchor.right - width, window.innerWidth - width - margin)
    )
    panel.current.style.top = `${Math.max(margin, top)}px`
    panel.current.style.left = `${left}px`
  }

  useEffect(() => {
    if (!open) return
    place()
    window.addEventListener('scroll', place, { passive: true, capture: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, { capture: true })
      window.removeEventListener('resize', place)
    }
  }, [open])

  return (
    <>
      <button
        ref={button}
        type="button"
        popoverTarget={id}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:border-accent"
      >
        Columns
        {hidden > 0 && (
          <span className="text-fg-muted">
            ({columns.length - hidden}/{columns.length})
          </span>
        )}
        <span
          aria-hidden="true"
          className={`text-xs transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        // `toggle` fires after the panel is shown, so it's kept invisible from
        // `beforetoggle` until it's positioned: it never flashes at the
        // browser's default (centered) popover position.
        onBeforeToggle={(event: ToggleEvent<HTMLDivElement>) => {
          if (event.newState === 'open')
            event.currentTarget.style.visibility = 'hidden'
        }}
        onToggle={(event: ToggleEvent<HTMLDivElement>) => {
          if (event.newState === 'open') {
            place()
            event.currentTarget.style.visibility = ''
          }
          setOpen(event.newState === 'open')
        }}
        className="fixed m-0 w-64 rounded-lg border border-border bg-surface p-3 text-sm text-fg shadow-lg"
      >
        <fieldset>
          <legend className="mb-2 font-semibold">Visible columns</legend>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {columns.map((column) => (
              <label key={column.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visibility[column.id] !== false}
                  onChange={(event) =>
                    onChange(column.id, event.target.checked)
                  }
                />
                {column.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  )
}
