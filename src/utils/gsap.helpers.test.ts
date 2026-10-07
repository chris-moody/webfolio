import { describe, expect, it } from 'vitest'
import { horizontalLoop } from './gsap.helpers'

describe('horizontalLoop', () => {
  it('measures items whose width GSAP reports with a unit', () => {
    const row = document.createElement('div')
    const items = [0, 1, 2].map((i) => {
      const el = document.createElement('span')
      el.style.width = '100px'
      Object.defineProperty(el, 'offsetLeft', { value: i * 100 })
      Object.defineProperty(el, 'offsetWidth', { value: 100 })
      row.append(el)
      return el
    })
    document.body.append(row)
    const tl = horizontalLoop(items, { speed: 1 })
    expect(tl.duration()).toBeCloseTo(3) // 300px at 100px/s
    // The first item slides one full width left. With "100px" read as 0 this
    // was NaN, and the marquees never moved.
    expect(tl.getChildren()[0]?.vars.xPercent).toBe(-100)
    tl.kill()
  })
})
