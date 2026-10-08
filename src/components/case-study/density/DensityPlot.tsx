import { useEffect, useId, useRef, useState } from 'react'
import { FrameMeter } from '@/lab/perf/FrameMeter'
import { isReducedMotion } from '@/motion/motion'
import { DensityController, type Where } from './controller'

const WIDTH = 480
const HEIGHT = 300
// The default is large enough that a fast laptop drops frames on the main
// thread; at 1M, a recent desktop aggregates within the frame budget.
const COUNTS = [1_000_000, 2_000_000, 4_000_000]

/**
 * A density plot of two million synthetic points, re-aggregated every frame as
 * the camera moves. Aggregation runs in a worker or on the main thread; the
 * frame meter (shared with the Tape demo) shows what each costs.
 */
export const DensityPlot = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const status = useRef<HTMLParagraphElement>(null)
  const meterRoot = useRef<HTMLDivElement>(null)
  const controller = useRef<DensityController | null>(null)
  const [where, setWhere] = useState<Where>('worker')
  const [count, setCount] = useState(2_000_000)
  // A moving camera is motion: it starts paused when motion is reduced, and
  // the button is the pause control (WCAG 2.2.2).
  const [playing, setPlaying] = useState<boolean | null>(null)
  const ids = { count: useId(), status: useId() }

  useEffect(() => {
    if (!canvas.current || !status.current || !meterRoot.current) return
    const meter = new FrameMeter(meterRoot.current, {
      throughputLabel: 'Points scanned / s',
      payloadLabel: 'Bytes / frame',
      exposeAs: '__plotStats',
    })
    const initial = !isReducedMotion()
    const instance = new DensityController(
      canvas.current,
      status.current,
      meter,
      {
        where: 'worker',
        count: 2_000_000,
        playing: initial,
      }
    )
    controller.current = instance
    meter.start()
    instance.start()
    // The motion preference is only known in the browser.
    setPlaying(initial)
    return () => {
      instance.destroy()
      meter.stop()
      controller.current = null
    }
  }, [])

  useEffect(() => controller.current?.setWhere(where), [where])
  useEffect(() => controller.current?.setCount(count), [count])
  useEffect(() => {
    if (playing !== null) controller.current?.setPlaying(playing)
  }, [playing])

  return (
    <figure className="my-8 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
        <fieldset>
          <legend className="font-semibold">Aggregate on</legend>
          <div className="mt-1 flex gap-4">
            {(
              [
                ['worker', 'A worker'],
                ['main', 'The main thread'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="density-where"
                  checked={where === value}
                  onChange={() => setWhere(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={ids.count} className="block font-semibold">
            Points
          </label>
          <select
            id={ids.count}
            className="mt-1 rounded-md border border-border bg-canvas px-2 py-1"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          >
            {COUNTS.map((value) => (
              <option key={value} value={value}>
                {value.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="rounded-md border border-border bg-canvas px-3 py-1 font-semibold hover:border-accent"
          aria-pressed={playing === false}
          disabled={playing === null}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing === false ? 'Play camera' : 'Pause camera'}
        </button>
      </div>
      <canvas
        ref={canvas}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label="Density plot of synthetic points in fourteen clusters; stronger color means more points per pixel."
        aria-describedby={ids.status}
        className="mt-4 aspect-[8/5] w-full rounded bg-canvas"
      />
      <p
        ref={status}
        id={ids.status}
        className="mt-2 font-mono text-xs text-fg-muted tabular-nums"
      >
        Loads in the browser.
      </p>
      <div ref={meterRoot} className="mt-3" />
      <figcaption className="mt-3 text-sm text-fg-muted">
        Synthetic, seeded data. Each frame counts every point into a 480 × 300
        grid for the current view. On the main thread that loop competes with
        painting; in a worker the page only receives the finished grid, handed
        over without copying.
      </figcaption>
    </figure>
  )
}
