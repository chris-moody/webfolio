import gsap from 'gsap'

export interface HorizontalLoopConfig {
  speed?: number
  repeat?: number
  paused?: boolean
  reversed?: boolean
  paddingRight?: number | string
  /** Snap increment for xPercent, or `false` to disable snapping. */
  snap?: number | false
}

export interface HorizontalLoopTimeline extends gsap.core.Timeline {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween
  current: () => number
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween
  times: number[]
}

const num = (value: unknown) => Number(value) || 0

// Adapted from GSAP's horizontalLoop helper:
// https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop
export const horizontalLoop = (
  selector: gsap.TweenTarget,
  config: HorizontalLoopConfig = {}
): HorizontalLoopTimeline => {
  const items = gsap.utils.toArray<HTMLElement>(selector)
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100)
    },
  }) as HorizontalLoopTimeline
  const length = items.length
  const first = items[0]
  const last = items[length - 1]
  if (!first || !last) {
    return Object.assign(tl, {
      next: () => tl.tweenTo(0),
      previous: () => tl.tweenTo(0),
      current: () => 0,
      toIndex: () => tl.tweenTo(0),
      times: [],
    })
  }

  const startX = first.offsetLeft
  const times: number[] = []
  const widths: number[] = []
  const xPercents: number[] = []
  let curIndex = 0
  const pixelsPerSecond = (config.speed || 1) * 100
  // Some browsers shift by a pixel to accommodate flex layouts, so snap to
  // whole percentage points to keep the motion steady.
  const snap: (value: number) => number =
    config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1)

  gsap.set(items, {
    // Convert "x" to "xPercent" so the loop stays responsive, and cache the
    // widths and xPercents for fast lookups.
    xPercent: (i: number, el: HTMLElement) => {
      const w = (widths[i] = num(gsap.getProperty(el, 'width', 'px')))
      xPercents[i] = snap(
        (num(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
          num(gsap.getProperty(el, 'xPercent'))
      )
      return xPercents[i]
    },
  })
  gsap.set(items, { x: 0 })

  const lastIndex = length - 1
  const totalWidth =
    last.offsetLeft +
    (num(xPercents[lastIndex]) / 100) * num(widths[lastIndex]) -
    startX +
    last.offsetWidth * num(gsap.getProperty(last, 'scaleX')) +
    num(config.paddingRight)

  items.forEach((item, i) => {
    const width = num(widths[i])
    const curX = (num(xPercents[i]) / 100) * width
    const distanceToStart = item.offsetLeft + curX - startX
    const distanceToLoop =
      distanceToStart + width * num(gsap.getProperty(item, 'scaleX'))
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / width) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(((curX - distanceToLoop + totalWidth) / width) * 100),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add('label' + i, distanceToStart / pixelsPerSecond)
    times[i] = distanceToStart / pixelsPerSecond
  })

  const toIndex = (index: number, vars: gsap.TweenVars = {}) => {
    // Always go in the shortest direction.
    if (Math.abs(index - curIndex) > length / 2)
      index += index > curIndex ? -length : length
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = num(times[newIndex])
    if (time > tl.time() !== index > curIndex) {
      // Wrapping the timeline's playhead needs an adjustment.
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars)
  tl.previous = (vars) => toIndex(curIndex - 1, vars)
  tl.current = () => curIndex
  tl.toIndex = toIndex
  tl.times = times
  tl.progress(1, true).progress(0, true) // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete?.()
    tl.reverse()
  }
  return tl
}
