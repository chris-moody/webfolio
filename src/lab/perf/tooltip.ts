import type { Instance } from '@popperjs/core'

/**
 * Plain-DOM tooltips for the frame meter, which owns its DOM outside React.
 *
 * - Screen readers get the description from a visually hidden element the
 *   trigger points at (aria-describedby), present whether or not anything is
 *   shown. The floating tooltip itself is aria-hidden.
 * - It opens on hover and keyboard focus, stays while the pointer is over it,
 *   and closes on Escape (WCAG 1.4.13).
 * - Popper places it (flipping and staying on screen) and loads on first use,
 *   so it costs nothing on page load.
 */

let popper: Promise<typeof import('@popperjs/core')> | null = null
const loadPopper = () => (popper ??= import('@popperjs/core'))

let nextId = 0
const HIDE_DELAY_MS = 120

export interface Tooltips {
  /** Makes `trigger` show `text`; returns the hidden description element. */
  attach: (trigger: HTMLElement, text: string) => HTMLElement
  destroy: () => void
}

export const createTooltips = (): Tooltips => {
  const tip = document.createElement('div')
  tip.setAttribute('aria-hidden', 'true')
  tip.className =
    'z-50 max-w-64 rounded-md bg-fg px-2.5 py-1.5 text-xs leading-snug text-canvas shadow-lg'
  tip.hidden = true
  document.body.append(tip)

  let instance: Instance | null = null
  let current: HTMLElement | null = null
  let hideTimer = 0

  const hide = () => {
    window.clearTimeout(hideTimer)
    tip.hidden = true
    current = null
  }
  const hideSoon = () => {
    window.clearTimeout(hideTimer)
    hideTimer = window.setTimeout(hide, HIDE_DELAY_MS)
  }
  const show = (trigger: HTMLElement, text: string) => {
    window.clearTimeout(hideTimer)
    current = trigger
    tip.textContent = text
    void loadPopper().then(({ createPopper }) => {
      if (current !== trigger) return
      tip.hidden = false
      instance?.destroy()
      instance = createPopper(trigger, tip, {
        placement: 'top',
        strategy: 'fixed',
        modifiers: [
          { name: 'offset', options: { offset: [0, 6] } },
          { name: 'preventOverflow', options: { padding: 8 } },
        ],
      })
    })
  }
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !tip.hidden) hide()
  }

  // Moving onto the tooltip keeps it open.
  tip.addEventListener('pointerenter', () => window.clearTimeout(hideTimer))
  tip.addEventListener('pointerleave', hideSoon)
  document.addEventListener('keydown', onKey)

  return {
    attach(trigger, text) {
      const description = document.createElement('span')
      description.id = `meter-tip-${++nextId}`
      description.className = 'sr-only'
      description.textContent = text
      trigger.setAttribute('aria-describedby', description.id)
      trigger.addEventListener('pointerenter', () => show(trigger, text))
      trigger.addEventListener('pointerleave', hideSoon)
      trigger.addEventListener('focus', () => show(trigger, text))
      trigger.addEventListener('blur', hide)
      return description
    },
    destroy() {
      window.clearTimeout(hideTimer)
      document.removeEventListener('keydown', onKey)
      instance?.destroy()
      tip.remove()
    },
  }
}
