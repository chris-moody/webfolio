import type { ColumnVisibilityState } from '@tanstack/react-table'
import {
  type CSSProperties,
  type ToggleEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

/** CSS anchor positioning places the panel with no JavaScript at all. */
const supportsAnchors = () =>
  typeof CSS !== 'undefined' && CSS.supports('position-area: bottom')

export interface ColumnsMenuProps {
  columns: { id: string; label: string }[]
  visibility: ColumnVisibilityState
  onChange: (id: string, visible: boolean) => void
}

/**
 * Column chooser built on the native Popover API: the panel renders in the
 * top layer (no layout shift), and the browser provides light dismiss,
 * Escape to close, and the button's expanded state. No menu library needed.
 *
 * Placement: CSS anchor positioning keeps the panel at its button even before
 * the page hydrates (the popover itself works without JavaScript). Browsers
 * without anchor positioning get the same placement from `place()`.
 */
export const ColumnsMenu = ({
  columns,
  visibility,
  onChange,
}: ColumnsMenuProps) => {
  const id = useId()
  const anchorName = `--columns-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const button = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const hidden = columns.filter(
    (column) => visibility[column.id] === false
  ).length

  // Keep the panel next to its button while open: below and right-aligned,
  // flipping above when there isn't room below (e.g. low on a phone screen).
  const place = () => {
    if (!button.current || !panel.current || supportsAnchors()) return
    const anchor = button.current.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = panel.current
    const gap = 6
    const margin = 8
    const fitsBelow =
      anchor.bottom + gap + height <= window.innerHeight - margin
    const top = fitsBelow ? anchor.bottom + gap : anchor.top - gap - height
    // Right-aligned to the button; left-aligned if that would overflow left.
    const preferred =
      anchor.right - width >= margin ? anchor.right - width : anchor.left
    const left = Math.max(
      margin,
      Math.min(preferred, window.innerWidth - width - margin)
    )
    panel.current.style.margin = '0'
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
        style={{ anchorName } as CSSProperties}
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
        style={
          {
            // Below the button, right-aligned. When that overflows, try above,
            // then left-aligned (a button at the start of a wrapped row on a
            // phone), then both.
            positionAnchor: anchorName,
            positionArea: 'bottom span-left',
            positionTryFallbacks:
              'flip-block, flip-inline, flip-block flip-inline',
            inset: 'auto',
            margin: '6px 0',
          } as CSSProperties
        }
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
